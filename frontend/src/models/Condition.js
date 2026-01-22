export class Condition {
  constructor(data) {
    this.studentId = data.studentId
    this.studentCode = data.studentCode
    this.fullname = data.fullname
    this.status = data.status
    this.reason = data.reason
    this.subjectId = data.subjectId
    this.examId = data.examId
  }

  static fromJSON(json) {
    return new Condition(json)
  }
}