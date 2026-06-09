import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Get,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ZodValidationPipe } from '../../common/pipes/zod-validation.pipe';
import { registerSchema, loginSchema } from './schemas/auth.schema';
import type { RegisterDto, LoginDto } from './schemas/auth.schema';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GetUser } from './decorators/get-user.decorator';
import { UsersService } from '../users/users.service';

@Controller('v1/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService
  ) {}

  @Post('register')
  async register(
    @Body(new ZodValidationPipe(registerSchema)) dto: RegisterDto
  ) {
    const user = await this.authService.register(dto);
    return {
      message: 'User registered successfully',
      data: user,
    };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body(new ZodValidationPipe(loginSchema)) dto: LoginDto) {
    const result = await this.authService.login(dto);
    return {
      message: 'Login successful',
      data: result,
    };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@GetUser('userId') userId: string) {
    const user = await this.usersService.findSafeById(userId);
    return {
      message: 'Current user fetched successfully',
      data: user,
    };
  }
}
