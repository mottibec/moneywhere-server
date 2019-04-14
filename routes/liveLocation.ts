import socketIo from "socket.io";
import { Router } from "express";
import { createServer, Server } from 'http';
import { Location } from "../models/location";
import IController from "./IController";

export default class LiveLocationController implements IController {
    route: string;
    router: Router;
    private io: socketIo.Server;
    private server: Server;
    private trackedUsers: [string, string, socketIo.Socket][];

    constructor() {
        this.route = "";
        this.server = createServer();
        this.router = Router();;
        this.io = socketIo(this.server);
        this.trackedUsers = [];
        this.connect();
    }
    initRoutes(): void {
        throw new Error("Method not implemented.");
    }
    connect() {
        this.io.on('connection', this.onConnection);
    }
    onConnection(socket: socketIo.Socket) {
        socket.on("disconnect", this.onDisconnect)
        socket.on("observeUserLocation", (userId, trackedUserId) => this.observeUserLocation(socket, userId, trackedUserId));
        socket.on("updateUserLocation", location => this.updateUserLocation(socket, location));
    }
    onDisconnect() {

    }
    updateUserLocation(clientSocket: socketIo.Socket, location: Location) {
        const userRecord = this.trackedUsers.find(item => item[0] === clientSocket.id);
        if (!userRecord) {
            return;
        }
        const trackedUser = this.trackedUsers.find(item => item[0] === userRecord[1]);
        if (!trackedUser) {
            return;
        }
        var socket = trackedUser[2];
        if (!socket.connected) {
            return;
        }
        socket.emit("userLocationUpdate", location);
    }
    observeUserLocation(clientSocket: socketIo.Socket, userId: string, trackedUserId: string) {
        this.trackedUsers.push([clientSocket.id, trackedUserId, clientSocket]);
    }
}