import { BaseRepository } from "./BaseRepository ";
import { balance } from "../models/balance";

export class BalanceRepository extends BaseRepository<balance> {
    find(item: balance): Promise<balance[]> {
        throw new Error("Method not implemented.");
    }
    findOne(id: string): Promise<balance> {
        throw new Error("Method not implemented.");
    }

}