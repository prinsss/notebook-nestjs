import { Test, TestingModule } from '@nestjs/testing'
import { Note } from './entities/note.entity'
import { NotesController } from './notes.controller'
import { NotesService } from './notes.service'

const mockNotesService = {
  findAll: jest.fn(),
  findOne: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn()
}

const testNote: Note = {
  id: '5fb55df4-4dd4-47e0-b3d5-fd3d745977ea',
  title: 'Hello World',
  content: 'First note',
  createdAt: new Date(),
  updatedAt: new Date(),
  toJSON: jest.fn()
}

describe('NotesController', () => {
  let controller: NotesController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotesController],
      providers: [
        {
          provide: NotesService,
          useValue: mockNotesService
        }
      ]
    }).compile()

    controller = module.get<NotesController>(NotesController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  it('should create note', async () => {
    mockNotesService.create.mockReturnValueOnce(testNote)
    expect(await controller.create(testNote)).toEqual(testNote)
  })

  it('should find all notes', async () => {
    mockNotesService.findAll.mockReturnValueOnce([testNote])
    expect(await controller.findAll()).toEqual([testNote])
  })

  it('should find note by id', async () => {
    mockNotesService.findById.mockReturnValueOnce(testNote)
    expect(await controller.findOne(testNote.id)).toEqual(testNote)
  })

  it('should update note', async () => {
    mockNotesService.update.mockReturnValueOnce(testNote)
    expect(await controller.update(testNote.id, {})).toEqual(testNote)
  })

  it('should delete note', async () => {
    mockNotesService.remove.mockReturnValueOnce(testNote)
    expect(await controller.remove(testNote.id)).toEqual(testNote)
  })
})
