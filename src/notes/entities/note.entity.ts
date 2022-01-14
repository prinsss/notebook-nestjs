import { Exclude } from 'class-transformer'
import { BaseEntity } from 'src/common/base.entity'
import { User } from 'src/users/entities/user.entity'
import { Entity, Column, ManyToOne } from 'typeorm'

@Entity('notes')
export class Note extends BaseEntity {
  @Column()
  title: string

  @Column({ nullable: true })
  content?: string

  @Exclude()
  @ManyToOne(() => User, (user) => user.notes)
  user: User
}
