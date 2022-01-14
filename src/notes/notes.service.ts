import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { BaseCrudService } from 'src/common/base-crud.service'
import { Repository } from 'typeorm'
import { Note } from './entities/note.entity'

@Injectable()
export class NotesService extends BaseCrudService<Note> {
  constructor(
    @InjectRepository(Note)
    private readonly notesRepository: Repository<Note>
  ) {
    super(notesRepository)
  }
}
