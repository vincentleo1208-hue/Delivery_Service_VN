import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';

export interface RegisterDto {
  email: string;
  password: string;
  name: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto) {
    // TODO: Hash password and create user
    const user = await this.usersService.create({
      email: registerDto.email,
      password: registerDto.password, // Will be hashed in service
      name: registerDto.name,
    });

    const tokens = await this.getTokens(user.id, user.email);
    
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      ...tokens,
    };
  }

  async login(loginDto: LoginDto) {
    // TODO: Validate password
    const user = await this.usersService.findByEmail(loginDto.email);
    
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const tokens = await this.getTokens(user.id, user.email);
    
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      ...tokens,
    };
  }

  async refreshToken(userId: string, refreshToken: string) {
    // TODO: Validate refresh token
    const user = await this.usersService.findById(userId);
    
    if (!user) {
      throw new Error('User not found');
    }

    return this.getTokens(user.id, user.email);
  }

  private async getTokens(userId: string, email: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, email },
        {
          expiresIn: this.configService.get('JWT_EXPIRES_IN', '15m'),
        },
      ),
      this.jwtService.signAsync(
        { sub: userId, email },
        {
          expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRES_IN', '7d'),
        },
      ),
    ]);

    return { accessToken, refreshToken };
  }
}
