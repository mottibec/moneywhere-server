import { Location } from "../models/location";
import { User } from "../models/user";
import { UserRepository } from "../database/UserRepository";
import { IUserLocationService } from "./interfaces/IUserLocationService";
import { injectable, inject } from "inversify";
import "reflect-metadata";
import { TYPES } from "../inversify.types";

@injectable()
export class UserLocationService implements IUserLocationService {

    @inject(TYPES.UserRepository)
    private _userRepository!: UserRepository;

    private locations: [string, Location][] = [
        ["1", new Location(-73.917007, 40.693451)],
        ["2", new Location(-73.921831, 40.695839)],
        ["3", new Location(-73.928379, 40.702899)],
        ["4", new Location(-73.923305, 40.701891)],
        ["5", new Location(-73.930383, 40.705730)],
        ["6", new Location(-73.920817, 40.7063481)],
        ["7", new Location(-73.915112, 40.707031)],
        ["8", new Location(-73.933985, 40.708332)],
        ["9", new Location(-73.920687, 40.709341)],
        ["10", new Location(-73.921288, 40.706543)],
        ["11", new Location(-73.914682, 40.693451)],
        ["12", new Location(-73.921073, 40.707128)],
        ["13", new Location(-70.912880, 40.711976)]
    ]
    getUsersByLocation(location: Location, radius: number): User[] {
        console.log(location);
        let users = this._userRepository._items;
        const userLocatoins = users.map(user => {
            let userLocation = this.locations.find(location => location["0"] === user.id);
            if (userLocation) {
                user.setLocation(userLocation["1"]);
            }
            return user;
        });
        return userLocatoins.filter(user => {
            var distance = user.location.distanceFrom(location);
            console.log(distance);
            return distance <= radius * 1000;
        });
    }
}