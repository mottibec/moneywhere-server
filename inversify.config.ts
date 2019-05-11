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
import TransactionController from "./routes/transactions";
import { TransactionRepository } from "./database/TransactionRepository";
import { UserRepository } from "./database/UserRepository";
import { UserService } from "./services/userService";
import authenticationController from "./routes/authentication";
import { IAuthProvider, FacebookAuthProvider, GoogleAuthProvider, LocalAuthProvider } from "./services/authProvider";
import JWTService from "./services/jwtService";
import AuthService from "./services/authService";


const container = new Container();

//web server
container.bind<IWebServer>(TYPES.IWebServer)
    .to(ExpressWebServer)
    .inSingletonScope();

//repo
container.bind<TransactionRepository>(TYPES.TransactionRepository)
    .to(TransactionRepository)
container.bind<UserRepository>(TYPES.UserRepository)
    .to(UserRepository)
    .inSingletonScope();

//services
container.bind<ITransactionService>(TYPES.ITransactionService)
    .to(TransactionService);
container.bind<ILiveLocation>(TYPES.ILiveLocation)
    .to(LiveLocationService);
container.bind<IUserLocationService>(TYPES.IUserLocationService)
    .to(UserLocationService);
container.bind<UserService>(TYPES.UserService)
    .to(UserService);
container.bind<TransactionService>(TYPES.TransactionService)
    .to(TransactionService);
container.bind<AuthService>(TYPES.AuthService)
    .to(AuthService);

container.bind<JWTService>(TYPES.JWTService)
    .to(JWTService);

//auth providers
container.bind<IAuthProvider>(TYPES.IAuthProvider)
    .to(LocalAuthProvider);
container.bind<IAuthProvider>(TYPES.IAuthProvider)
    .to(GoogleAuthProvider);
container.bind<IAuthProvider>(TYPES.IAuthProvider)
    .to(FacebookAuthProvider);

//controllers
container.bind<IController>(TYPES.IController)
    .to(UserController);
container.bind<IController>(TYPES.IController)
    .to(TransactionController);
container.bind<IController>(TYPES.IController)
    .to(authenticationController);

export { container };  