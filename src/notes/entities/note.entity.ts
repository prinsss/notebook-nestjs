import { BaseEntity } from 'src/common/base.entity'
import { Entity, Column } from 'typeorm'

@Entity('notes')
export class Note extends BaseEntity {
  @Column()
  title: string

  @Column({ nullable: true })
  content?: string
}
