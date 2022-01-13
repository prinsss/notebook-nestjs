import { Request } from 'express'
import { User } from 'src/users/entities/user.entity'

export interface AuthenticatedRequest extends Request {
  readonly user: User
}

export interface UnauthenticatedRequest extends Request {
  readonly user?: undefined
}
