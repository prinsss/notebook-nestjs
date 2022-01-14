import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ForbiddenException,
  NotFoundException
} from '@nestjs/common'
import { NotesService } from './notes.service'
import { CreateNoteDto } from './dto/create-note.dto'
import { UpdateNoteDto } from './dto/update-note.dto'
import { CurrentUser } from 'src/auth/decorators/user.decorator'
import { User } from 'src/users/entities/user.entity'

@Controller('api/notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  async create(
    @Body() createNoteDto: CreateNoteDto,
    @CurrentUser() user: User
  ) {
    createNoteDto.user = user
    return await this.notesService.create(createNoteDto)
  }

  @Get()
  async findAll(@CurrentUser() user: User) {
    return await this.notesService.findAll({
      where: { user: { id: user.id } }
    })
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return await this.checkResourceOwnerOrFail(id, user)
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateNoteDto: UpdateNoteDto,
    @CurrentUser() user: User
  ) {
    await this.checkResourceOwnerOrFail(id, user)
    return await this.notesService.update(id, updateNoteDto)
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @CurrentUser() user: User) {
    await this.checkResourceOwnerOrFail(id, user)
    return await this.notesService.remove(id)
  }

  async checkResourceOwnerOrFail(id: string, user: User) {
    const found = await this.notesService.findById(id, {
      relations: ['user']
    })

    if (!found) {
      throw new NotFoundException()
    }

    if (found?.user?.id !== user.id) {
      throw new ForbiddenException()
    }

    return found
  }
}
