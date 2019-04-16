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

    private _userLocations: { userId: string, location: Location }[] = [
        { userId: "1", location: new Location(40.693451, -73.917007) },
        { userId: "2", location: new Location(40.695839, -73.921831) },
        { userId: "3", location: new Location(40.702899, -73.928379) },
        { userId: "4", location: new Location(40.701891, -73.923305) },
        { userId: "5", location: new Location(40.705730, -73.930383) },
        { userId: "6", location: new Location(40.706348, -73.9208171) },
        { userId: "7", location: new Location(40.707031, -73.915112) },
        { userId: "8", location: new Location(40.708332, -73.933985) },
        { userId: "9", location: new Location(40.709341, -73.920687) },
        { userId: "10", location: new Location(40.706543, -73.921288) },
        { userId: "11", location: new Location(40.693451, -73.914682) },
        { userId: "12", location: new Location(40.707128, -73.921073) },
        { userId: "13", location: new Location(40.711976, -70.912880) }];

    getUsersByLocation(location: Location, radius: number): User[] {
        const radiusInMeters = radius * 1000;
        let users = this._userRepository.getAll();
        const userLocations = users.map(user => {
            let userLocation = this._userLocations.find(userLocation => userLocation.userId === user.id);
            if (userLocation) {
                user.setLocation(userLocation.location);
            }
            return user;
        });
        return userLocations.filter(user => {
            var distance = user.location.distanceFrom(location);
            return distance <= radiusInMeters;
        });
    }
}