import { Location } from "./Location";

export class Room {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.location = data.location ? Location.fromJSON(data.location) : null;
  }

  static fromJSON(json) {
    return new Room(json)
  }
}