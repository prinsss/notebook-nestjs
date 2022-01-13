import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  Repository
} from 'typeorm'
import { User } from './entities/user.entity'

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>
  ) {}

  async find(options?: FindManyOptions): Promise<User[]> {
    return await this.usersRepository.find(options)
  }

  async findOne(options?: FindOneOptions): Promise<User | undefined> {
    return await this.usersRepository.findOne(options)
  }

  async create(userLike: DeepPartial<User>): Promise<User> {
    const user = this.usersRepository.create(userLike)
    return await this.usersRepository.save(user)
  }

  async update(user: User): Promise<User> {
    return await this.usersRepository.save(user)
  }

  async remove(user: User): Promise<User> {
    return await this.usersRepository.softRemove(user)
  }
}
