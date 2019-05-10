import { BaseMemoryRepository } from "./BaseMemoryRepository";
import { Balance } from "../models/balance";

export class BalanceRepository extends BaseMemoryRepository<Balance> {
    update(item: Balance): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    find(item: Balance): Promise<Balance[]> {
        throw new Error("Method not implemented.");
    }
    findOne(id: string): Promise<Balance> {
        var item = this._items.find(balance => balance.id == id);
        if (!item) {
            return Promise.reject(`"no balance with id ${id} found`);
        }
        return Promise.resolve(item);
    }

}