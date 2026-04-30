import { Controller, Get, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getProfile() {
    // Will be implemented with auth guard
    return { message: 'User profile endpoint' };
  }
}
