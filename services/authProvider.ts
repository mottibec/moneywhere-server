import { IWebServer } from "../webserver/IWebServer";
import passport from "passport";
import { OAuth2Client as GoogleStrategy } from "google-auth-library";
import FacebookTokenStrategy from "passport-facebook-token";
import { Strategy as LocalStrategy } from "passport-local";
import config from "../config/config";
import { injectable, inject } from "inversify";
import { IRequest, IResponse } from "../webserver/IWebRequest";
import JWTService from "./jwtService";
import { TYPES } from "../inversify.types";
import { UserService } from "./userService";
import { User } from "../models/user";
import AuthService from "./authService";

export interface IAuthProvider {
    register(webServer: IWebServer, route: string): void;
    verifyUser(...arg: any): void;
}

@injectable()
export class LocalAuthProvider implements IAuthProvider {

    @inject(TYPES.JWTService)
    private _jwtService!: JWTService;

    @inject(TYPES.UserService)
    private _userService!: UserService;

    @inject(TYPES.AuthService)
    private _authService!: AuthService;

    register(webServer: IWebServer, route: string): void {
        passport.use(new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            session: false
        }, async (...args) => this.verifyUser(...args)));

        webServer.registerPost(`${route}/login`, (request: any, response: any, next: any) =>
            passport.authenticate("local", { session: false }, (err, user, info) => {
                if (err || !user) {
                    return response
                        .status(400)
                        .json({
                            error: err,
                            user: user,
                            info: info
                        });
                }
                const token = this._jwtService.sign(user);
                return response.json({ access_token: token });
            })(request, response, next)
        );
        this._jwtService.register();
    }
    async verifyUser(userName: string, password: string, callback: Function) {
        const user = await this._userService.findByEmail(userName);
        if (!user) {
            return callback(null, false, "invalid user name or password");
        }
        const doseMatch = await this._authService.verifyHash(password, user.password);
        if (!doseMatch) {
            return callback(null, false, "invalid user name or password");
        }
        return callback(null, { id: user.id });

    }
}

@injectable()
export class GoogleAuthProvider implements IAuthProvider {

    private _googleStrategy!: GoogleStrategy;

    @inject(TYPES.UserService)
    private _userService!: UserService;

    @inject(TYPES.JWTService)
    private _jwtService!: JWTService;

    register(webServer: IWebServer, route: string): void {
        this._googleStrategy = new GoogleStrategy(config.oAuth.google.appId);

        webServer.registerPost(`${route}/google`, async (request: IRequest, response: IResponse) =>
            await this.verifyUser(request, response));
    }
    async verifyUser(request: IRequest, response: IResponse) {
        const idToken = request.body.id_token;
        try {
            const profileInfo = await this._googleStrategy.verifyIdToken({
                idToken: idToken,
                audience: config.oAuth.google.appId
            });
            console.log("profileInfo", profileInfo);
            const paylod = profileInfo.getPayload();

            if (paylod && paylod.email_verified && paylod.email) {
                console.log("paylod.email", paylod.email);
                let user = await this._userService.findByEmail(paylod.email);
                if (!user) {
                    const name = paylod.given_name || paylod.family_name || paylod.email;
                    user = new User(name, paylod.email);
                    user.authToken = idToken;
                    user.avatar = paylod.picture || "";
                    //newUser.authRefreshToken = refreshToken;
                    await this._userService.createUser(user);
                }
                console.log(user);
                const token = this._jwtService.sign({ id: user.id });
                return response.json({ access_token: token });
            }
            else {
                return response.status(400);
            }
        }
        catch (err) {
            console.log("err", err);
            return response.status(400).json({ error: err.message });
        }

    }
}

@injectable()
export class FacebookAuthProvider implements IAuthProvider {

    @inject(TYPES.JWTService)
    private _jwtService!: JWTService;

    @inject(TYPES.UserService)
    private _userService!: UserService;

    register(webServer: IWebServer, route: string): void {
        passport.use(new FacebookTokenStrategy({
            clientID: config.oAuth.facebook.appId,
            clientSecret: config.oAuth.facebook.secret,
            profileFields: ['id', 'email', 'gender', 'locale', 'name', 'displayName'],
        },
            (...args) => this.verifyUser(...args)));
        webServer.registerPost(`${route}/facebook`, (request: IRequest, response: IResponse) =>
            passport.authenticate('facebook-token', { scope: ['email'] }, (error, user, info) => {
                const token = this._jwtService.sign(user);
                return response.json({ access_token: token });
            })(request, response)
        );
    }
    async verifyUser(accessToken: string, refreshToken: string, profile: any, done: Function) {
        const user = await this._userService.getUser(profile.id);
        if (user) {
            return done(null, { id: user.id });
        }
        const emails = profile.emails as { value: string }[];

        const newUser = new User(profile.displayName, emails[0].value, profile.id);

        newUser.authToken = accessToken;
        newUser.authRefreshToken = refreshToken;

        await this._userService.createUser(newUser);

        return done(null, { id: newUser.id });
    }
}