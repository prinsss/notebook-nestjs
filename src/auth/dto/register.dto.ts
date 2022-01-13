import {
  IsAscii,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinLength
} from 'class-validator'

export class RegisterDto {
  @IsAscii()
  @IsNotEmpty()
  username: string

  @MinLength(8)
  @MaxLength(32)
  @IsNotEmpty()
  password: string

  @MinLength(2)
  @MaxLength(10)
  @IsOptional()
  nickname?: string
}
