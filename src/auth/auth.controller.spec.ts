import { UnauthorizedException } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

const mockedAuthService = {
  validateUser: jest.fn(),
  signJwt: jest.fn((user: any) => user.username)
}

const user = {
  userId: 2,
  username: 'maria',
  password: 'guess'
}

describe('AuthController', () => {
  let controller: AuthController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockedAuthService
        }
      ]
    }).compile()

    controller = module.get<AuthController>(AuthController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  it('should login users', async () => {
    mockedAuthService.validateUser
      .mockReturnValueOnce(user)
      .mockReturnValueOnce(null)

    expect(await controller.login(user)).toEqual({
      user,
      accessToken: user.username
    })
    await expect(controller.login(user)).rejects.toThrow(UnauthorizedException)
  })

  it('should show whoami', () => {
    const req: any = { user }
    expect(controller.getCurrentUser(req)).toEqual(user)
  })
})
