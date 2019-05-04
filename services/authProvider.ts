import { IWebServer } from "../webserver/IWebServer";
import passport from "passport";
import { OAuth2Strategy as GoogleStrategy } from "passport-google-oauth";
import FacebookTokenStrategy from "passport-facebook-token";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as jwtStrategy, ExtractJwt } from "passport-jwt";
import config from "../config/config";
import { injectable } from "inversify";
import jwt from "jsonwebtoken";
import { response } from "express";

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
        console.log("authCallback");
        return () => passport.authenticate('jwt', { session: false })
    }
}

@injectable()
export class LocalAuthProvider implements IAuthProvider {
    register(webServer: IWebServer): void {
        passport.use("local", new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password',
            session: false
        }, this.verifyUser));

        webServer.registerPost('/auth/login', (req: any, res: any, next: any) => passport.authenticate("local", { session: false }, (err, user, info) => {
            console.log("user", user);
            console.log("err", err);
            console.log("info", info);
            return res.json(user);
        })(req, res, next)
        );
    }
    verifyUser(userName: string, password: string, callback: Function) {
        console.log("userName", userName);
        console.log("password", password);
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
        console.log("profile", profile);
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
        console.log("profile", profile);
        return done(null, profile);
    }

}