import jwt from 'jsonwebtoken'

export class TokenGeneratorAdapter {
  generate(payload, secret, expiresIn) {
    return jwt.sign(payload, secret, { expiresIn })
  }
}
