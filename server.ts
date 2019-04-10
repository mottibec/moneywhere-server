import App from "./app";
import TransactionController from "./routes/transactions";
import UserController from "./routes/users";

const port = + (process.env["PORT"] || "3000");

const app = new App([
    new UserController(),
    new TransactionController()]
    , port);
app.listen();