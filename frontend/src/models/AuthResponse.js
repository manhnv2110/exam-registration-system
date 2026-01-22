import { User } from "./User";

export class AuthResponse {
  constructor(data) {
    this.message = data.message;
    this.token = data.data.token;
    this.refreshToken = data?.data?.refreshToken ?? null;
    this.user = new User(data.data.user)
  }

  hasToken() {
    return !!this.token;
  }
  
  isFirstLogin() {
    return this.user.firstLogin === true;
  }
  
  static fromJSON(json) {
    return new AuthResponse(json);
  }
}