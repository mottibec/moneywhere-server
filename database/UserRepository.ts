import { BaseMemoryRepository } from "./BaseMemoryRepository";
import { User } from "../models/user";
import { injectable } from "inversify";

@injectable()
export class UserRepository extends BaseMemoryRepository<User> {
  constructor() {
    super();
    this._items = [
      new User("motti", "mb@gmail.com", "1"),
      new User("moshe", "mos@gmail.com", "2"),
      new User("david", "da@gmail.com", "3"),
      new User("matt", "matt@gmail.com", "4"),
      new User("mojo", "mojo@gmail.com", "5"),
      new User("nepton", "nepton@gmail.com", "6"),
      new User("dave", "dast@gmail.com", "7"),
      new User("jack", "daef@gmail.com", "8"),
      new User("mordechai", "da4d@gmail.com", "9"),
      new User("sima", "da443@gmail.com", "10"),
      new User("sonya", "d4ffa@gmail.com", "11"),
      new User("boris", "dae33@gmail.com", "12"),
      new User("nave", "d555a@gmail.com", "13")
    ];
  }
  update(item: User): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  find(item: User): Promise<User[]> {
    return Promise.resolve(this._items);
  }
  findBy(prop: string, value: string): Promise<User | null> {
    const user = this._items.find(user => user[prop] == value);
    if (!user) {
      return Promise.resolve(null);
    }
    return Promise.resolve(user);
  }
  findOne(id: string): Promise<User | null> {
    const user = this._items.find(user => user.id === id);
    if (!user) {
      return Promise.resolve(null);
    }
    return Promise.resolve(user);
  }
}