import { Test, TestingModule } from '@nestjs/testing'
import { testUser } from 'src/users/users.service.spec'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'

const mockAuthService = {
  validateUser: jest.fn(),
  createUser: jest.fn(),
  signJwt: jest.fn((user: any) => user.id)
}

describe('AuthController', () => {
  let controller: AuthController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService
        }
      ]
    }).compile()

    controller = module.get<AuthController>(AuthController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  it('should login users', async () => {
    const { email, password } = testUser
    mockAuthService.validateUser.mockReturnValueOnce(testUser)

    expect(await controller.login({ email, password })).toEqual({
      user: testUser,
      accessToken: testUser.id
    })
  })

  it('should register users', async () => {
    const { email, password, nickname } = testUser
    mockAuthService.createUser.mockReturnValueOnce(testUser)

    expect(await controller.register({ email, password, nickname })).toEqual({
      user: testUser,
      accessToken: testUser.id
    })
  })

  it('should show whoami', () => {
    const req: any = { user: testUser }
    expect(controller.getCurrentUser(req)).toEqual(testUser)
  })
})
