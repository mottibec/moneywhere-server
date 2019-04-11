import { IWebServer } from "./IWebServer";
import { Request, Response, Router } from "express";
import { injectable } from "inversify";

@injectable()
export default class ExpressWebServer implements IWebServer {
    private router: Router;
    getRouter() {
        return this.router;
    }
    constructor() {
        this.router = Router();
    }
    registerGet(routeTemplate: string, callback: Function): void {
        this.router.get(routeTemplate, (request: Request, response: Response) => callback(request, response));
    }
    registerPost(routeTemplate: string, callback: Function): void {
        this.router.post(routeTemplate, (request: Request, response: Response) => callback(request, response));
    }
}