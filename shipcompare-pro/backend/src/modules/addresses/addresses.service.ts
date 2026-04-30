import { Injectable } from '@nestjs/common';

@Injectable()
export class AddressesService {
  async findAll(userId: string) {
    return [];
  }

  async findOne(id: string) {
    return null;
  }

  async create(userId: string, addressData: any) {
    return { id: '1', userId, ...addressData };
  }

  async update(id: string, addressData: any) {
    return { id, ...addressData };
  }

  async delete(id: string) {
    return true;
  }
}
