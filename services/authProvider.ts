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

export interface IAuthProvider {
    register(webServer: IWebServer, route: string): void;
    verifyUser(...arg: any): void;
}

@injectable()
export class LocalAuthProvider implements IAuthProvider {

    @inject(TYPES.JWTService)
    private _jwtService!: JWTService;

    register(webServer: IWebServer, route: string): void {
        passport.use("local", new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            session: false
        }, this.verifyUser));

        webServer.registerPost(`/${route}/login`, (req: any, res: any, next: any) =>
            passport.authenticate("local", { session: false }, (err, user, info) => {
                const token = this._jwtService.sign(user);
                return res.json(token);
            })(req, res, next)
        );
        this._jwtService.register();
    }
    verifyUser(userName: string, password: string, callback: Function) {
        return callback(null, { id: userName });
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
                return response.json(token);
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