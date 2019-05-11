import { IRepository } from "./IRepository";
import { injectable } from "inversify";

@injectable()
export abstract class BaseMemoryRepository<T> implements IRepository<T>  {
    protected _items: T[] = [];

    getAll(): T[] {
        return this._items;
    }
    create(item: T): Promise<boolean> {
        this._items.push(item);
        return Promise.resolve(true);
    }
    abstract update(item: T): Promise<boolean>;
    abstract find(item: T): Promise<T[]>;
    abstract findOne(id: string): Promise<T | null>;
}