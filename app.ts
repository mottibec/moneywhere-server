import express from "express";
import IController from "./routes/IController";

class App {
    public app: express.Application;
    private port: number;

    constructor(controllers: IController[], port: number) {
        this.app = express();
        this.port = port;
        this.configRoutes(controllers);
    }
    configRoutes(controllers: IController[]) {
        controllers.forEach((controller) => {
            controller.initRoutes();
            console.log(`'${controller.route}' registered with ${controller.router.stack.length} routes`);
            this.app.use('/', controller.router);
        });
    }
    public listen() {
        const port = this.port;
        this.app.listen(port, function () {
            console.log(`app is listing on port ${port}`);
        });
    }
}

export default App;