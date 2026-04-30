import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  async findById(id: string) {
    return null;
  }

  async findByEmail(email: string) {
    return null;
  }

  async create(userData: any) {
    return { id: '1', ...userData };
  }
}
