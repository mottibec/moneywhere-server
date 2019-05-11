import { IWebServer } from "../webserver/IWebServer";
import passport from "passport";
import { OAuth2Strategy as GoogleStrategy } from "passport-google-oauth";
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
    register(webServer: IWebServer, route: string): void {
        passport.use(new GoogleStrategy({
            clientID: config.oAuth.google.appId,
            clientSecret: config.oAuth.google.secret,
            callbackURL: `${config.rootSericeUrl}/auth/google/callback`
        },
            this.verifyUser));

        webServer.registerGet(`/${route}/google`, passport.authenticate("google", { scope: ['https://www.googleapis.com/auth/plus.login'] }))
        webServer.registerGet(`/${route}/google/callback`, passport.authenticate("google"))
    }
    async verifyUser(accessToken: string, refreshToken: string, profile: any, done: Function) {
        return done(null, profile);
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