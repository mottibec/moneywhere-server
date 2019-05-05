import { IWebServer } from "./IWebServer";
import { Request, Response, Router, Application } from "express";
import express from "express";
import { injectable } from "inversify";
import passport from "passport";
import bodyparser from "body-parser";


@injectable()
export default class ExpressWebServer implements IWebServer {

    private _router: Router;
    private _app: Application;

    constructor() {
        this._app = express();
        this._router = Router();
        this._app.use(bodyparser.urlencoded({ extended: false }))
        this._app.use(bodyparser.json());
        this._app.use(passport.initialize());
    }
    public start(port: number, callback: Function) {
        this._app.use('/', this._router);
        this._app.listen(port, callback);
    }

    public registerGet(routeTemplate: string, callback: Function): void {
        this._router.get(routeTemplate, (request: Request, response: Response) =>
            callback(request, response));
    }

    public registerPost(routeTemplate: string, callback: Function): void {
        this._router.post(routeTemplate, (request: Request, response: Response, next: Function) => {
            callback(request, response, next)
        });
    }

    registerProtectedGet(routeTemplate: string, callback: Function): void {
        this._router.get(routeTemplate, passport.authenticate('jwt', { session: false }), (request: Request, response: Response) =>
            callback(request, response));
    }
    registerProtectedPost(routeTemplate: string, callback: Function): void {
        this._router.get(routeTemplate, passport.authenticate('jwt', { session: false }), (request: Request, response: Response) =>
            callback(request, response));
    }
}