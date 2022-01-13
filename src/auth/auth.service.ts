import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { User, UsersService } from '../users/users.service'
import { JwtPayload } from './interfaces/jwt-payload.interface'

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async validateUser(
    username: string,
    password: string
  ): Promise<Omit<User, 'password'> | null> {
    const user = await this.usersService.findOne(username)
    // WARNING: Don't do this in your real app!
    // You should never store users' password in plain text.
    if (user && user.password === password) {
      const { password, ...result } = user
      return result
    }
    return null
  }

  signJwt(user: Pick<User, 'userId' | 'username'>): string {
    const payload: JwtPayload = {
      sub: user.userId.toString(),
      username: user.username
    }
    return this.jwtService.sign(payload)
  }
}
