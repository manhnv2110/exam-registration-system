export class StudentResponse {
  constructor({id,code, name, gender, dob, className, phone, email, major, faculty, role
  }) {
    this.id = id
    this.code = code
    this.name = name
    this.gender = gender
    this.dob = dob
    this.className = className
    this.phone = phone
    this.email = email
    this.major = major
    this.faculty = faculty
    this.role = role
  }

  static fromJSON(json) {
    return new StudentResponse(json)
  }
}
