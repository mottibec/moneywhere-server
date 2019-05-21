import passport from "passport";
import { Strategy as jwtStrategy, ExtractJwt } from "passport-jwt";
import config from "../config/config";
import jwt from "jsonwebtoken";
import { injectable, inject } from "inversify";
import { TYPES } from "../inversify.types";
import { UserService } from "./userService";

@injectable()
export default class JWTService {

    @inject(TYPES.UserService)
    private _userService!: UserService;

    register() {
        passport.use(new jwtStrategy({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.jwtSecret
        }, async (jwtPayload: any, callback: Function) => {
            const user = await this._userService.getUser(jwtPayload.id);
            if (user) {
                return callback(null, user);
            }
            return callback("", false);

        }));
    }
    sign(item: any) {
        const token = jwt.sign(item, config.jwtSecret);
        return token;
    }
    verifyToken() {
        return passport.authenticate('jwt', { session: false });
    }
}