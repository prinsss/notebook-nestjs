import {
  Body,
  Controller,
  Get,
  HttpCode,
  NotImplementedException,
  Post,
  Request,
  UnauthorizedException
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { Public } from './decorators/public.decorator'
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

  @Public()
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

  @Public()
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    throw new NotImplementedException()
  }

  @Get('whoami')
  getCurrentUser(@Request() req: AuthenticatedRequest) {
    return req.user
  }
}
