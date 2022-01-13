import { JwtService } from '@nestjs/jwt'
import { Test, TestingModule } from '@nestjs/testing'
import { UsersModule } from 'src/users/users.module'
import { UsersService } from 'src/users/users.service'
import { AuthService } from './auth.service'

const mockedJwtService = {
  sign: jest.fn((payload: any) => payload.sub)
}

const user = {
  userId: 2,
  username: 'maria',
  password: 'guess'
}

describe('AuthService', () => {
  let authService: AuthService
  let usersService: UsersService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UsersModule],
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: mockedJwtService
        }
      ]
    }).compile()

    authService = module.get<AuthService>(AuthService)
    usersService = module.get<UsersService>(UsersService)
  })

  it('should be defined', () => {
    expect(authService).toBeDefined()
  })

  it('should validate user', async () => {
    const { password, ...omitted } = user

    jest
      .spyOn(usersService, 'findOne')
      .mockImplementation(
        async (username: string) => await Promise.resolve(user)
      )

    let result = await authService.validateUser(user.username, user.password)
    expect(result).toMatchObject(omitted)
    result = await authService.validateUser(user.username, 'wrong')
    expect(result).toBeNull()
  })

  it('should sign jwt', () => {
    expect(authService.signJwt(user)).toEqual(user.userId.toString())
  })
})
