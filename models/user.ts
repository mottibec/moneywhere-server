import { Location } from "./location";
import crypto from "crypto";

interface IUser {
    id: string;
    name: string;
    avatar: string;
    phone?: string;
    email?: string;
    password?: string;
    rating: number;
    location: Location;
    gender: gender;
    dob: Date,
    countryCode: string,
    mainCurrencyCode: string,
    authProvider?: authProvider
    authToken: string,
    authRefreshToken: string;
}
enum authProvider {
    facebook,
    google,
    local
}

enum gender {
    male,
    female,
    other
}

class User implements IUser {
    authProvider!: authProvider;
    authToken!: string;
    authRefreshToken!: string;
    password!: string;
    dob!: Date;
    countryCode!: string;
    mainCurrencyCode!: string;
    id: string;
    name: string;
    avatar!: string;
    phone!: string;
    email: string;
    rating!: number;
    location!: Location;
    gender!: gender;

    [k: string]: any;

    constructor(name: string, email: string, id?: string) {
        this.name = name;
        this.email = email;
        this.id = id || crypto.randomBytes(16).toString("hex");
    }
    set Location(location: Location) {
        this.location = location;
    }
}

export { IUser, User };