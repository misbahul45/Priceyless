import { Injectable, UnauthorizedException, ConflictException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto, LoginDto } from './schemas/auth.schema';
import { sanitizeUser } from '../../common/utils/sanitize-user';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    this.logger.log(`Registering new user: ${dto.email}`);
    const existingUser = await this.usersService.findOneByEmail(dto.email);
    if (existingUser) {
      this.logger.warn(`Registration failed: Email ${dto.email} already exists`);
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.usersService.create({
      ...dto,
      password: hashedPassword,
    });

    this.logger.log(`User registered successfully: ${user.id}`);
    return sanitizeUser(user);
  }

  async login(dto: LoginDto) {
    this.logger.log(`Login attempt for user: ${dto.email}`);
    const user = await this.usersService.findOneByEmail(dto.email);
    if (!user) {
      this.logger.warn(`Login failed: User ${dto.email} not found`);
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      this.logger.warn(`Login failed: Invalid password for user ${dto.email}`);
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { email: user.email, sub: user.id, role: user.role };
    this.logger.log(`User logged in successfully: ${user.id}`);
    return {
      accessToken: this.jwtService.sign(payload),
      user: sanitizeUser(user),
    };
  }
}

