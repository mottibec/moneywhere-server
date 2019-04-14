import { BaseRepository } from "./BaseRepository ";
import { User } from "../models/user";
import { injectable } from "inversify";

@injectable()
export class UserRepository extends BaseRepository<User> {
  constructor() {
    super();
    this._items = [
      new User("motti", "", "1"),
      new User("moshe", "", "2"),
      new User("david", "", "3"),
      new User("matt", "", "4"),
      new User("mojo", "", "5"),
      new User("nepton", "", "6"),
      new User("dave", "", "7"),
      new User("jack", "", "8"),
      new User("mordechai", "", "9"),
      new User("sima", "", "10"),
      new User("sonya", "", "11"),
      new User("boris", "", "12"),
      new User("nave", "", "13")
    ];
  }
  find(item: User): Promise<User[]> {
    return Promise.resolve(this._items);
  }
  findOne(id: string): Promise<User> {
    const user = this._items.find(user => user.id === id);
    if (!user) {
      return Promise.reject();
    }
    return Promise.resolve(user);
  }
}