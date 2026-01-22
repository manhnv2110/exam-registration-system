export class Subject {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.subjectCode = data.subjectCode;
    this.creditHour = data.creditHour;
    this.duration = data.duration;
  }

  static fromJSON(json) {
    return new Subject(json);
  }
}