import { Injectable, Logger, NotFoundException } from '@nestjs/common';

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  role: 'free' | 'pro' | 'enterprise';
  stripeCustomerId?: string;
  createdAt: Date;
}

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  // TODO: Replace with actual database repository
  private readonly users: Map<string, User> = new Map();

  async findById(id: string): Promise<User | null> {
    return this.users.get(id) || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    for (const user of this.users.values()) {
      if (user.email === email) return user;
    }
    return null;
  }

  async create(userData: Partial<User>): Promise<User> {
    const id = `usr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const user: User = {
      id,
      email: userData.email!,
      passwordHash: userData.passwordHash!,
      role: userData.role || 'free',
      stripeCustomerId: userData.stripeCustomerId,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    this.logger.log(`Created user: ${user.email}`);
    return user;
  }

  async update(id: string, updates: Partial<User>): Promise<User> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    const updated = { ...user, ...updates };
    this.users.set(id, updated);
    return updated;
  }
}
