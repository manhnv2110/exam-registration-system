import { ExamSessionForStudent } from "./ExamSessionForStudent";

export class ExamRegistration {
  constructor(data) {
    this.id = data.id;
    this.studentId = data.studentId;
    this.registeredAt = data.registeredAt;
    this.examSession = data.examSession ? ExamSessionForStudent.fromJSON(data.examSession) : null;
  }

  static fromJSON(json) {
    return new ExamRegistration(json);
  }
}