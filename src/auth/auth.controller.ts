import {
  Body,
  Controller,
  Get,
  HttpCode,
  NotImplementedException,
  Post,
  Request,
  UnauthorizedException,
  UseGuards
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { JwtAuthGuard } from './guards/jwt-auth.guard'
import { AuthenticatedRequest } from './interfaces/request.interface'

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
    if (!user) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const accessToken = this.authService.signJwt(user)
    return { accessToken, user }
  }

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    throw new NotImplementedException()
  }

  @UseGuards(JwtAuthGuard)
  @Get('whoami')
  getCurrentUser(@Request() req: AuthenticatedRequest) {
    return req.user
  }
}
