import { BaseRepository } from "./BaseRepository ";
import { Balance } from "../models/balance";

export class BalanceRepository extends BaseRepository<Balance> {
    find(item: Balance): Promise<Balance[]> {
        throw new Error("Method not implemented.");
    }
    findOne(id: string): Promise<Balance> {
        throw new Error("Method not implemented.");
    }

}