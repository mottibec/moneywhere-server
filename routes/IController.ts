import { Router } from "express";

export default interface IController {
    router: Router;
    route: string;
    initRoutes(): void;
}