import jwt from 'jsonwebtoken'
import * as dotenv from 'dotenv'
dotenv.config()

/**
 * Check user's login status based on tokens
 *
 * @param {String} accessToken
 * @param {String} refreshToken
 * @return {Boolean|Object} - false or decoded user data
 */
export function checkLogin(accessToken, refreshToken) {
  /** --- Check if user is logged in, based on tokens */

  /** Error: No tokens found */
  if (accessToken === '' && refreshToken === '') return false

  /** Use the first token that is set */
  const token = accessToken !== '' ? accessToken : refreshToken

  /** --- Decode user data */
  /** @var {Object|false} r - decoded token data */
  let decodedUserData = false
  try {
    decodedUserData = jwt.verify(token, process.env.TOKEN_AUTH_SECRET)
  } catch (err) {
    /** Error: Verification failed or token is expired */
    return false
  }

  /** Error: No data */
  if (!decodedUserData) return false

  /** Success. User is logged in. */
  return decodedUserData
}
