import { Injectable } from '@nestjs/common'
import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  Repository
} from 'typeorm'

@Injectable()
export class BaseCrudService<T> {
  constructor(protected repo: Repository<T>) {}

  async findAll(options?: FindManyOptions): Promise<T[]> {
    return await this.repo.find(options)
  }

  async findOne(options?: FindOneOptions): Promise<T | undefined> {
    return await this.repo.findOne(options)
  }

  async findById(id: string): Promise<T | undefined> {
    return await this.repo.findOne(id)
  }

  async create(dto: DeepPartial<T>): Promise<T> {
    // This ensures listeners like BeforeInsert will run
    // @see https://github.com/typeorm/typeorm/issues/5493
    const entity = this.repo.create(dto)
    return await this.repo.save(entity)
  }

  async update(id: string, dto: DeepPartial<T>): Promise<T> {
    const found = await this.repo.findOneOrFail(id)
    const toSave = this.repo.create({ ...found, ...dto })
    return await this.repo.save(toSave)
  }

  async remove(id: string): Promise<T> {
    const found = await this.repo.findOneOrFail(id)
    return await this.repo.softRemove(found)
  }
}
