import { BaseMemoryRepository } from "./BaseMemoryRepository";
import { Review } from "../models/review";

export class ReviewRepository extends BaseMemoryRepository<Review>
{
    update(item: Review): Promise<boolean> {
        throw new Error("Method not implemented.");
    }
    find(item: Review): Promise<Review[]> {
        throw new Error("Method not implemented.");
    }
    findOne(id: string): Promise<Review> {
        const review = this._items.find(r => r.createdById == id);
        if (!review) {
            return Promise.reject();
        }
        return Promise.resolve(review);
    }
}