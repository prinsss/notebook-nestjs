import {
  Body,
  Controller,
  Get,
  HttpCode,
  NotImplementedException,
  Post,
  UnauthorizedException
} from '@nestjs/common'
import { AuthService } from './auth.service'

// Should be replaced with real DTOs later
export interface LoginDto {
  username: string
  password: string
}
export type RegisterDto = LoginDto

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  async login(@Body() dto: LoginDto) {
    const user = await this.authService.validateUser(dto.username, dto.password)
    if (user) {
      return { user }
    }

    throw new UnauthorizedException()
  }

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    throw new NotImplementedException()
  }

  @Get('whoami')
  getCurrentUser() {
    throw new NotImplementedException()
  }
}
