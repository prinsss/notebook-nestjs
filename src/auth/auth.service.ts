import { Injectable } from '@nestjs/common'
import { UsersService } from '../users/users.service'

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username)
    // WARNING: Don't do this in your real app!
    // You should never store users' password in plain text.
    if (user && user.password === pass) {
      const { password, ...result } = user
      return result
    }
    return null
  }
}
