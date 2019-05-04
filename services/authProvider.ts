import { IWebServer } from "../webserver/IWebServer";
import passport from "passport";
import { OAuth2Strategy as GoogleStrategy } from "passport-google-oauth";
import FacebookTokenStrategy from "passport-facebook-token";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as jwtStrategy, ExtractJwt } from "passport-jwt";
import config from "../config/config";
import { injectable } from "inversify";
import jwt from "jsonwebtoken";

export interface IAuthProvider {
    register(webServer: IWebServer): void;
}

class JWTService {
    register() {
        passport.use(new jwtStrategy({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.jwtSecret
        }, (jwtPayload: any, callback: Function) => {
            console.log("jwtPayload", jwtPayload);
            return callback(null, jwtPayload.id);
        }));
    }
    sign(user: any) {
        const token = jwt.sign(user, config.jwtSecret);
        return token;
    }
    authCallback() {
        return () => passport.authenticate('jwt', { session: false })
    }
}

@injectable()
export class LocalAuthProvider implements IAuthProvider {
    jwtService: JWTService = new JWTService();

    register(webServer: IWebServer): void {
        passport.use("local", new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            session: false
        }, this.verifyUser));

        webServer.registerPost('/auth/login', (req: any, res: any, next: any) =>
            passport.authenticate("local", { session: false }, (err, user, info) => {
                const token = this.jwtService.sign(user);
                return res.json(token);
            })(req, res, next)
        );
        this.jwtService.register();
    }
    verifyUser(userName: string, password: string, callback: Function) {
        return callback(null, { id: userName });
    }
}

@injectable()
export class GoogleAuthProvider implements IAuthProvider {
    register(webServer: IWebServer): void {
        passport.use(new GoogleStrategy({
            clientID: config.oAuth.google.appId,
            clientSecret: config.oAuth.google.secret,
            callbackURL: `${config.rootSericeUrl}/auth/google/callback`
        },
            this.verifyUser));

        webServer.registerGet('/auth/google', passport.authenticate("google", { scope: ['https://www.googleapis.com/auth/plus.login'] }))
        webServer.registerGet('/auth/google/callback', passport.authenticate("google"))
    }
    async verifyUser(accessToken: string, refreshToken: string, profile: any, done: Function) {

        return done(null, profile);
    }

}

@injectable()
export class FacebookAuthProvider implements IAuthProvider {
    register(webServer: IWebServer): void {
        passport.use(new FacebookTokenStrategy({
            clientID: config.oAuth.facebook.appId,
            clientSecret: config.oAuth.facebook.secret
        },
            this.verifyUser));
        webServer.registerPost('/auth/facebook', passport.authenticate('facebook-token'));
    }

    async verifyUser(accessToken: string, refreshToken: string, profile: any, done: Function) {
        return done(null, profile);
    }

}