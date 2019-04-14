import { Location } from "./location";
import crypto from "crypto";

interface IUser {
    id: string;
    name: string;
    avatar: string;
    phone?: string;
    email?: string;
    rating: number;
    location: Location;
}

class User implements IUser {
    id: string;
    name: string;
    avatar!: string;
    phone!: string;
    email: string;
    rating!: number;
    location!: Location;

    constructor(name: string, email: string, id?: string) {
        this.name = name;
        this.email = email;
        this.id = id || crypto.randomBytes(16).toString("hex");
    }
    setLocation(location: Location) {
        this.location = location;
    }

}

export { IUser, User };