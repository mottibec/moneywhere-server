import { BaseMemoryRepository } from "./BaseMemoryRepository";
import { userPreference } from "../models/userPreference";

export class UserPreferencesRepository extends BaseMemoryRepository<userPreference> {
    update(item: userPreference): Promise<boolean> {
        return Promise.resolve(true);
    }
    find(item: userPreference): Promise<userPreference[]> {
        throw new Error("Method not implemented.");
    }
    findOne(id: string): Promise<userPreference | null> {
        const up = this._items.find(up => up.id == id);
        if (up) {
            return Promise.resolve(up);
        }
        return Promise.resolve(null);
    }


}