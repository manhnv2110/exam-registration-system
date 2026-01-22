export class Location {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.address = data.address;
  }

  static fromJSON(json) {
    return new Location(json)
  }
}