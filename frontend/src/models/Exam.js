export class ExamResponse {
  constructor({ id, examName, startDate, endDate, examStatus, description }) {
    this.id = id
    this.examName = examName
    this.startDate = startDate
    this.endDate = endDate
    this.examStatus = examStatus
    this.description = description
  }

  static fromJSON(json) {
    return new ExamResponse(json)
  }
}

export class Exam {
  constructor(data) {
    this.id = data?.id ?? null;
    this.examCode = data?.examCode ?? null;
    this.examName = data?.examName ?? null;
    this.startDate = data?.startDate ?? null;
    this.endDate = data?.endDate ?? null;
    this.examStatus = data?.examStatus ?? null;
    this.description = data?.description ?? null;
    this.isOpen = data?.isOpen ?? false;
  }

  static fromJSON(json) {
    return new Exam(json)
  }
}