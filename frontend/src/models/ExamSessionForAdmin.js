import { SubjectStatus } from "./SubjectStatus";

export class ExamSessionForAdmin {
  constructor(data) {
    this.id = data.id;
    this.examSessionCode = data.examSessionCode;
    this.date = data.date;
    this.capacity = data.capacity;
    this.registeredCount = data.registeredCount;
    this.startTime = data.startTime;
    this.roomName = data.roomName;
    this.subjectName = data.subjectName;
    this.locationName = data.locationName;
    this.locationId = data.locationId;
    this.roomId = data.roomId;
    this.subjectStatus = data.subjectStatus ? SubjectStatus.fromJSON(data.subjectStatus) : null;
    this.status = data.status;
  }

  static fromJSON(json) {
    return new ExamSessionForAdmin(json);
  }
}