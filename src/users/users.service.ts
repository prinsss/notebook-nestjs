import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { BaseCrudService } from 'src/common/base-crud.service'
import { Repository } from 'typeorm'
import { User } from './entities/user.entity'

@Injectable()
export class UsersService extends BaseCrudService<User> {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>
  ) {
    super(usersRepository)
  }
}
