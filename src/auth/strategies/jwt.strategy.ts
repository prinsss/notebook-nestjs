import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { jwtConstants } from '../constants'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // Should be retrieved from ConfigService later
      secretOrKey: jwtConstants.secret
    })
  }

  async validate(payload: any) {
    // What we returned here will be attached to the request object
    return { userId: payload.sub, username: payload.username }
  }
}
