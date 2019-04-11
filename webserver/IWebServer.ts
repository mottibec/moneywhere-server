export interface IWebServer {
    registerGet(routeTemplate: string, callback: Function): void;
    
    registerPost(routeTemplate: string, callback: Function): void;

    getRouter(): any;
}