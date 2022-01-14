import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken, InjectRepository } from '@nestjs/typeorm'
import { EntityNotFoundError, Repository } from 'typeorm'
import { BaseCrudService } from './base-crud.service'
import { BaseEntity } from './base.entity'

export class TestEntity extends BaseEntity {}
export class TestCrudService extends BaseCrudService<TestEntity> {
  constructor(
    @InjectRepository(TestEntity)
    private readonly testRepository: Repository<TestEntity>
  ) {
    super(testRepository)
  }
}
export const testEntity: TestEntity = {
  id: '6a3b5548-a3bc-45f5-bb0e-a936f300a5df',
  createdAt: new Date(),
  updatedAt: new Date(),
  toJSON: jest.fn()
}

describe('BaseCrudService', () => {
  let service: TestCrudService
  let repo: Repository<TestEntity>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TestCrudService,
        {
          provide: getRepositoryToken(TestEntity),
          useClass: Repository
        }
      ]
    }).compile()

    service = module.get<TestCrudService>(TestCrudService)
    repo = module.get<Repository<TestEntity>>(getRepositoryToken(TestEntity))
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should find all entities', async () => {
    jest
      .spyOn(repo, 'find')
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([testEntity])

    expect(await service.findAll()).toHaveLength(0)
    expect(await service.findAll()).toEqual([testEntity])
  })

  it('should find one entity', async () => {
    jest
      .spyOn(repo, 'findOne')
      .mockResolvedValueOnce(undefined)
      .mockResolvedValueOnce(testEntity)

    expect(await service.findOne()).toBeUndefined()
    expect(await service.findOne()).toEqual(testEntity)
  })

  it('should find one entity by id', async () => {
    jest.spyOn(repo, 'findOne').mockResolvedValueOnce(testEntity)
    expect(await service.findById(testEntity.id)).toEqual(testEntity)
  })

  it('should create one entity', async () => {
    const create = jest.spyOn(repo, 'create').mockReturnValueOnce(testEntity)
    jest.spyOn(repo, 'save').mockResolvedValueOnce(testEntity)

    const dto = { id: 'test' }
    expect(await service.create(dto)).toEqual(testEntity)
    expect(create).toBeCalledWith(dto)
  })

  it('should update one entity', async () => {
    jest
      .spyOn(repo, 'findOneOrFail')
      .mockRejectedValueOnce(new EntityNotFoundError(TestEntity, {}))
      .mockResolvedValueOnce(testEntity)
    jest.spyOn(repo, 'create').mockReturnValueOnce(testEntity)
    jest.spyOn(repo, 'save').mockResolvedValueOnce(testEntity)

    await expect(service.update(testEntity.id, {})).rejects.toThrow(
      EntityNotFoundError
    )
    expect(await service.update(testEntity.id, {})).toEqual(testEntity)
  })

  it('should remove one entity', async () => {
    jest.spyOn(repo, 'findOneOrFail').mockResolvedValueOnce(testEntity)
    jest.spyOn(repo, 'softRemove').mockResolvedValueOnce(testEntity)

    const entity = await service.remove(testEntity.id)
    expect(entity).toEqual(testEntity)
  })
})
