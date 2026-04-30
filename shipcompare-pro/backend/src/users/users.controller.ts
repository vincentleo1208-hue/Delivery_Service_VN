import { Controller, Get, Post, Body, Param, UseGuards, Logger } from '@nestjs/common';
import { UsersService, User } from './users.service';

@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  async findById(@Param('id') id: string): Promise<User | null> {
    return await this.usersService.findById(id);
  }

  @Get('email/:email')
  async findByEmail(@Param('email') email: string): Promise<User | null> {
    return await this.usersService.findByEmail(email);
  }

  @Post()
  async create(@Body() userData: Partial<User>): Promise<User> {
    this.logger.log(`Creating user: ${userData.email}`);
    return await this.usersService.create(userData);
  }
}
