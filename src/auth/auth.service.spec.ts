import { ConflictException, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test, TestingModule } from '@nestjs/testing'
import { User } from 'src/users/entities/user.entity'
import { UsersService } from 'src/users/users.service'
import { AuthService } from './auth.service'

const mockJwtService = {
  sign: jest.fn((payload: any) => payload.sub)
}

const mockUsersService = {
  findOne: jest.fn(),
  create: jest.fn()
}

export const testUser: User = {
  id: '6a3b5548-a3bc-45f5-bb0e-a936f300a5df',
  email: 'john@test.com',
  password: '$2b$10$TxFP8b.c16rk0wkDhWSbTelNOqFSDwoIH2vtM2tV6xuGPzv3ZIq8W',
  nickname: 'Johnny',
  notes: [],
  createdAt: new Date(),
  updatedAt: new Date(),
  hashPassword: jest.fn(),
  toJSON: jest.fn()
}

describe('AuthService', () => {
  let service: AuthService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService
        },
        {
          provide: JwtService,
          useValue: mockJwtService
        }
      ]
    }).compile()

    service = module.get<AuthService>(AuthService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should validate user', async () => {
    const { email, password } = testUser
    mockUsersService.findOne
      .mockResolvedValueOnce(undefined)
      .mockResolvedValue(testUser)

    await expect(service.validateUser(email, password)).rejects.toThrow(
      UnauthorizedException
    )
    expect(await service.validateUser(email, '12345678')).toEqual(testUser)
    await expect(service.validateUser(email, 'wrong')).rejects.toThrow(
      UnauthorizedException
    )
  })

  it('should create user', async () => {
    const { email, password, nickname } = testUser
    mockUsersService.findOne
      .mockResolvedValueOnce(testUser)
      .mockResolvedValue(undefined)
    mockUsersService.create.mockResolvedValueOnce(testUser)

    await expect(service.createUser(email, password, nickname)).rejects.toThrow(
      ConflictException
    )
    expect(await service.createUser(email, password, nickname)).toEqual(
      testUser
    )
  })

  it('should sign jwt', () => {
    expect(service.signJwt(testUser)).toEqual(testUser.id)
  })
})
