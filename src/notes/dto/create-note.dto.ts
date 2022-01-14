import { IsNotEmpty, IsOptional } from 'class-validator'

export class CreateNoteDto {
  @IsNotEmpty()
  title: string

  @IsOptional()
  content?: string
}
