import { GetUserHelper } from '../helpers/http.js'
import jwt from 'jsonwebtoken'

export const authMiddleware = (req, res, next) => {
  try {
    const acessToken = req.headers?.authorization?.split('Bearer ')
    if (!acessToken) {
      return GetUserHelper.responseStatusError(res, 401, 'Unauthorized')
    }

    const decodedToken = jwt.verify(
      acessToken,
      process.env.JWT_ACCESS_TOKEN_SECRET,
    )

    if (!decodedToken) {
      return GetUserHelper.responseStatusError(res, 401, 'Unauthorized')
    }
    req.userId = decodedToken.userId
    next()
  } catch (e) {
    console.error(e)
    return GetUserHelper.responseStatusError(res, 401, 'Unauthorized')
  }
}
