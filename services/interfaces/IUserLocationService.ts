import { user } from "../../models/user";
import { location } from "../../models/location";

export interface IUserLocationService {
    getUsersByLocation(location: location, radius: number): user[];

}