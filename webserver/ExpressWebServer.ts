import { IWebServer } from "./IWebServer";
import { Request, Response, Router, Application } from "express";
import express from "express";
import { injectable } from "inversify";

@injectable()
export default class ExpressWebServer implements IWebServer {
    private _router: Router;
    private _app: Application;

    constructor() {
        this._app = express();
        this._router = Router();
    }
    start(port: number, callback: Function) {
        console.log(this._router.stack.length);
        this._app.use('/', this._router);
        this._app.listen(port, callback());
    }

    registerGet(routeTemplate: string, callback: Function): void {
        this._router.get(routeTemplate, (request: Request, response: Response) => callback(request, response));
    }

    registerPost(routeTemplate: string, callback: Function): void {
        this._router.post(routeTemplate, (request: Request, response: Response) => callback(request, response));
    }
}