import jwt from 'jsonwebtoken'

export class TokenVerifierAdapter {
  verify(token, secret) {
    return jwt.verify(token, secret)
  }
}
