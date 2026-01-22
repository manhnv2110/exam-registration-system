export class User {
  constructor(data) {
    this.id = data?.id ?? null;
    this.email = data?.email ?? null;
    this.studentCode = data?.studentCode ?? null;
    this.fullname = data?.fullname ?? null;
    this.gender = data?.gender ?? null;
    this.className = data?.className ?? null;
    this.major = data?.major ?? null;
    this.faculty = data?.faculty ?? null;
    this.dob = data?.dob ?? null;
    this.phone = data?.phone ?? null;
    this.role = data?.role ?? null;
    this.firstLogin = data?.firstLogin ?? false;
  }
  
  isStudent() {
    return this.role === 'STUDENT';
  }
  
  isAdmin() {
    return this.role === 'ADMIN';
  }
  
  needsPasswordChange() {
    return this.firstLogin === true;
  }
  
  getDisplayName() {
    return this.fullname || this.email;
  }
  
  static fromJSON(json) {
    return new User(json);
  }
}