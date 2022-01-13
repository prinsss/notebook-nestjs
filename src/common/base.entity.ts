import { Exclude, instanceToPlain } from 'class-transformer'
import {
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm'

export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @Exclude()
  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date

  toJSON() {
    return instanceToPlain(this)
  }
}
