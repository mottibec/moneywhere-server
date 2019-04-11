import App from "./app";
import TransactionController from "./routes/transactions";
import { container } from "./inversify";
import { TYPES } from "./inversify.types";
import IController from "./routes/IController";
import "reflect-metadata";

const port = + (process.env["PORT"] || "3000");


const userController = container.get<IController>(TYPES.IController);

const app = new App([
    userController,
    new TransactionController()]
    , port);
app.listen();