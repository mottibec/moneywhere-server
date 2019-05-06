import { User } from "../../models/user";
import { Location } from "../../models/location";

export interface IUserLocationService {
    getUsersByLocation(location: Location, radius: number): User[];
}