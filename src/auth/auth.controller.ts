import { Body, Controller, Get, HttpCode, Post, Request } from '@nestjs/common'
import { AuthService } from './auth.service'
import { Public } from './decorators/public.decorator'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'
import { AuthenticatedRequest } from './interfaces/request.interface'

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(200)
  async login(@Body() dto: LoginDto) {
    const { email, password } = dto
    const user = await this.authService.validateUser(email, password)
    const accessToken = this.authService.signJwt(user)
    return { accessToken, user }
  }

  @Public()
  @Post('register')
  async register(@Body() dto: RegisterDto) {
    const { email, password, nickname } = dto
    const user = await this.authService.createUser(email, password, nickname)
    const accessToken = this.authService.signJwt(user)
    return { accessToken, user }
  }

  @Get('whoami')
  getCurrentUser(@Request() req: AuthenticatedRequest) {
    return req.user
  }
}
