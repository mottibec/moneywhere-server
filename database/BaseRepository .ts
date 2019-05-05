import { IRepository } from "./IRepository";
import { injectable } from "inversify";


@injectable()
export abstract class BaseRepository<T> implements IRepository<T>  {
    protected _items: T[] = [];

    getAll(): T[] {
        return this._items;
    }
    create(item: T): Promise<boolean> {
        console.log(item);
        console.log("before adding", this._items.length);
        this._items.push(item);
        console.log("after adding", this._items.length);
        return Promise.resolve(true);
    }
    abstract update(item: T): Promise<boolean>;
    abstract find(item: T): Promise<T[]>;
    abstract findOne(id: string): Promise<T | null>;
}