import { Exclude } from 'class-transformer'
import { BaseEntity } from 'src/common/base.entity'
import { createPassword } from 'src/common/utils'
import { Entity, Column, BeforeInsert } from 'typeorm'

@Entity('users')
export class User extends BaseEntity {
  @Column()
  email: string

  @Column()
  @Exclude({ toPlainOnly: true })
  password: string

  @Column({ nullable: true })
  nickname?: string

  @BeforeInsert()
  async hashPassword() {
    this.password = await createPassword(this.password)
  }
}
