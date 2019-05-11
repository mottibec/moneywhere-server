import IController from "./routes/IController";
import { IWebServer } from "./webserver/IWebServer";

class App {
    private _webServer: IWebServer;

    constructor(webServer: IWebServer, controllers: IController[]) {
        this._webServer = webServer;
        this.configRoutes(controllers);
    }
    configRoutes(controllers: IController[]) {
        controllers.forEach(controller => {
            controller.initRoutes();
            console.log(`'${controller.route}' registered`);
        });
    }
    public start(port: number) {
        this._webServer.start(port, () => `app is listing on port ${port}`);
    }
}

export default App;