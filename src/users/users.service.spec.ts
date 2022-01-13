import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { User } from './entities/user.entity'
import { UsersService } from './users.service'

export const testUser: User = {
  id: '6a3b5548-a3bc-45f5-bb0e-a936f300a5df',
  email: 'john@test.com',
  password: '$2b$10$TxFP8b.c16rk0wkDhWSbTelNOqFSDwoIH2vtM2tV6xuGPzv3ZIq8W',
  nickname: 'Johnny',
  createdAt: new Date(),
  updatedAt: new Date(),
  hashPassword: jest.fn(),
  toJSON: jest.fn()
}

describe('UsersService', () => {
  let service: UsersService
  let repo: Repository<User>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository
        }
      ]
    }).compile()

    service = module.get<UsersService>(UsersService)
    repo = module.get<Repository<User>>(getRepositoryToken(User))
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should find all users', async () => {
    jest.spyOn(repo, 'find').mockResolvedValueOnce([testUser])
    const users = await service.find()
    expect(users).toEqual([testUser])
  })

  it('should find one user', async () => {
    jest.spyOn(repo, 'findOne').mockResolvedValueOnce(testUser)
    const user = await service.findOne()
    expect(user).toEqual(testUser)
  })

  it('should create one user', async () => {
    jest.spyOn(repo, 'create').mockReturnValueOnce(testUser)
    jest.spyOn(repo, 'save').mockResolvedValueOnce(testUser)
    const user = await service.create(testUser)
    expect(user).toEqual(testUser)
  })

  it('should update one user', async () => {
    jest.spyOn(repo, 'save').mockResolvedValueOnce(testUser)
    const user = await service.update(testUser)
    expect(user).toEqual(testUser)
  })

  it('should remove one user', async () => {
    jest.spyOn(repo, 'softRemove').mockResolvedValueOnce(testUser)
    const user = await service.remove(testUser)
    expect(user).toEqual(testUser)
  })
})
