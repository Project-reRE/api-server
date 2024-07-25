import * as process from 'process'

export const jwtConstants = {
  secret: process.env.JWT_SECRET_KEY || 'JWT_SECRET_KEY_EXAMPLE',
}
