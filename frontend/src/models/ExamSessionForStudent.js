import { Room } from "./Room";
import { SubjectStatus } from "./SubjectStatus";

export class ExamSessionForStudent {
  constructor(data) {
    this.id = data.id;
    this.examSessionCode = data.examSessionCode;
    this.date = data.date;
    this.capacity = data.capacity;
    this.registeredCount = data.registeredCount;
    this.startTime = data.startTime;
    this.room = data.room ? Room.fromJSON(data.room) : null;
    this.subjectStatus = data.subjectStatus ? SubjectStatus.fromJSON(data.subjectStatus) : null;
    this.status = data.status;
  }

  static fromJSON(json) {
    return new ExamSessionForStudent(json);
  }
}