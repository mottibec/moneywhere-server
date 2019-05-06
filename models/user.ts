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
    mainCurrencyCode: string
}

enum gender {
    male,
    female,
    other
}

class User implements IUser {
    [k: string]: any;
    password?: string | undefined;
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