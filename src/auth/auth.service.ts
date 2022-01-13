import {
  ConflictException,
  Injectable,
  UnauthorizedException
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { verifyPassword } from 'src/common/utils'
import { User } from 'src/users/entities/user.entity'
import { UsersService } from '../users/users.service'
import { JwtPayload } from './interfaces/jwt-payload.interface'

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findOne({ where: { email } })
    if (!user) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const isPasswordValid = await verifyPassword(password, user.password)
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials')
    }

    return user
  }

  async createUser(
    email: string,
    password: string,
    nickname?: string
  ): Promise<User> {
    const found = await this.usersService.findOne({
      where: { email }
    })
    if (found) {
      throw new ConflictException('Email already registered')
    }

    return await this.usersService.create({
      email,
      password,
      nickname
    })
  }

  signJwt(user: Pick<User, 'id'>): string {
    const payload: JwtPayload = {
      sub: user.id
    }
    return this.jwtService.sign(payload)
  }
}
