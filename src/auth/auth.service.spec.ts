import { Test, TestingModule } from '@nestjs/testing'
import { UsersModule } from 'src/users/users.module'
import { UsersService } from 'src/users/users.service'
import { AuthService } from './auth.service'

describe('AuthService', () => {
  let authService: AuthService
  let usersService: UsersService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UsersModule],
      providers: [AuthService]
    }).compile()

    authService = module.get<AuthService>(AuthService)
    usersService = module.get<UsersService>(UsersService)
  })

  it('should be defined', () => {
    expect(authService).toBeDefined()
  })

  it('should validate user', async () => {
    const username = 'maria'
    const password = 'guess'

    jest.spyOn(usersService, 'findOne').mockImplementation(
      async (username: string) =>
        await Promise.resolve({
          username,
          password
        })
    )

    let result = await authService.validateUser(username, password)
    expect(result).toMatchObject({ username })
    result = await authService.validateUser(username, 'wrong')
    expect(result).toBeNull()
  })
})
