import App from "./app";
import { container } from "./inversify.config";
import { TYPES } from "./inversify.types";
import IController from "./routes/IController";
import { IWebServer } from "./webserver/IWebServer";

const port = + (process.env["PORT"] || "3000");

var controllers = container.getAll<IController>(TYPES.IController)
var webServer = container.get<IWebServer>(TYPES.IWebServer);
const app = new App(webServer, controllers);
app.start(port);