import { Subject } from "./Subject";

export class SubjectStatus {
  constructor(data) {
    this.id = data.id;
    this.status = data.status;
    this.subject = data.subject ? Subject.fromJSON(data.subject) : null;
    this.registered = data.registered;
  }

  static fromJSON(json) {
    return new SubjectStatus(json);
  }
}