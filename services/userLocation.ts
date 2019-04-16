import { Location } from "../models/location";
import { User } from "../models/user";
import { UserRepository } from "../database/UserRepository";
import { IUserLocationService } from "./interfaces/IUserLocationService";
import { injectable, inject } from "inversify";
import { TYPES } from "../inversify.types";

@injectable()
export class UserLocationService implements IUserLocationService {

    @inject(TYPES.UserRepository)
    private _userRepository!: UserRepository;
    private _locations: [string, Location][] = [
        ["1", new Location(40.693451, -73.917007)],
        ["2", new Location(40.695839, -73.921831)],
        ["3", new Location(40.702899, -73.928379)],
        ["4", new Location(40.701891, -73.923305)],
        ["5", new Location(40.705730, -73.930383)],
        ["6", new Location(40.706348, -73.9208171)],
        ["7", new Location(40.707031, -73.915112)],
        ["8", new Location(40.708332, -73.933985)],
        ["9", new Location(40.709341, -73.920687)],
        ["10", new Location(40.706543, -73.921288)],
        ["11", new Location(40.693451, -73.914682)],
        ["12", new Location(40.707128, -73.921073)],
        ["13", new Location(40.711976, -70.912880)]
    ]
    getUsersByLocation(location: Location, radius: number): User[] {
        let users = this._userRepository.getAll();
        const userLocations = users.map(user => {
            let userLocation = this._locations.find(location => location["0"] === user.id);
            if (userLocation) {
                user.setLocation(userLocation["1"]);
            }
            return user;
        });
        return userLocations.filter(user => {
            var distance = user.location.distanceFrom(location);
            return distance <= radius * 1000;
        });
    }
}