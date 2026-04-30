import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  // TODO: Implement authentication logic
  async validateUser(email: string, password: string): Promise<any> {
    return null;
  }

  async login(user: any) {
    return { access_token: '', refresh_token: '' };
  }

  async register(userData: any) {
    return { user: {}, access_token: '', refresh_token: '' };
  }
}
