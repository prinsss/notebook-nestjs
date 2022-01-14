import { PartialType } from '@nestjs/mapped-types'
import { IsNotEmpty, IsOptional } from 'class-validator'
import { Note } from '../entities/note.entity'

export class CreateNoteDto extends PartialType(Note) {
  @IsNotEmpty()
  title: string

  @IsOptional()
  content?: string
}
