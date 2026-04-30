import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from './user.entity';

export interface CreateUserDto {
  email: string;
  password: string;
  name: string;
  company?: string;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const passwordHash = await bcrypt.hash(createUserDto.password, 10);
    
    const user = this.usersRepository.create({
      ...createUserDto,
      passwordHash,
      role: UserRole.FREE,
    });

    return this.usersRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async updateRole(userId: string, role: UserRole): Promise<User> {
    await this.usersRepository.update(userId, { role });
    return this.findById(userId);
  }

  async updateStripeCustomer(userId: string, stripeCustomerId: string): Promise<User> {
    await this.usersRepository.update(userId, { stripeCustomerId });
    return this.findById(userId);
  }
}
