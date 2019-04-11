import "reflect-metadata";
import { Container } from "inversify";
import { TYPES } from "./inversify.types";
import { ITransactionService } from "./services/interfaces/ITransactionService";
import TransactionService from "./services/transactionService";
import { ILiveLocation } from "./services/interfaces/ILiveLocation";
import { LiveLocationService } from "./services/liveLocation";
import { IUserLocationService } from "./services/interfaces/IUserLocationService";
import { UserLocationService } from "./services/userLocation";
import { IWebServer } from "./webserver/IWebServer";
import ExpressWebServer from "./webserver/ExpressWebServer";
import IController from "./routes/IController";
import UserController from "./routes/users";


const container = new Container();

//web server
container.bind<IWebServer>(TYPES.IWebServer).to(ExpressWebServer);

//services
container.bind<ITransactionService>(TYPES.ITransactionService).to(TransactionService);
container.bind<ILiveLocation>(TYPES.ILiveLocation).to(LiveLocationService);
container.bind<IUserLocationService>(TYPES.IUserLocationService).to(UserLocationService);
container.bind<IController>(TYPES.IController).to(UserController);

//controllers



export { container };  