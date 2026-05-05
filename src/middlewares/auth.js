import jwt from 'jsonwebtoken'
import { GetUserHelper } from '../helpers/http.js'

const getUserHelper = new GetUserHelper()

export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader) {
      return getUserHelper.responseStatusError(res, 401, 'Unauthorized')
    }

    const [type, accessToken] = authHeader.split(' ')

    if (type !== 'Bearer' || !accessToken) {
      return getUserHelper.responseStatusError(res, 401, 'Unauthorized')
    }

    const decodedToken = jwt.verify(
      accessToken,
      process.env.JWT_ACCESS_TOKEN_SECRET,
    )

    if (!decodedToken?.userId) {
      return getUserHelper.responseStatusError(res, 401, 'Unauthorized')
    }

    req.userId = decodedToken.userId

    return next()
  } catch (e) {
    if (e.name === 'TokenExpiredError') {
      return getUserHelper.responseStatusError(res, 401, 'Token expired')
    }

    if (e.name === 'JsonWebTokenError') {
      return getUserHelper.responseStatusError(res, 401, 'Invalid token')
    }

    return getUserHelper.responseStatusError(res, 401, 'Unauthorized')
  }
}
