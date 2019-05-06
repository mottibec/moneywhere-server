export interface IWebServer {
    registerGet(routeTemplate: string, callback: Function): void;

    registerPost(routeTemplate: string, callback: Function): void;

    registerProtectedGet(routeTemplate: string, callback: Function): void;

    registerProtectedPost(routeTemplate: string, callback: Function): void;

    start(port: number, callback: Function): void;
}