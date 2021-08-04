import { authSchema } from '../../validation/schemas/authorizeSchema'
import { validate, joiResponse } from '../../validation/JoiValidate'
import jwt from 'jsonwebtoken'
import * as dotenv from 'dotenv'
dotenv.config()
import { clientList, serverList } from '../accessList'
import consola from 'consola'

/**
 * Check user's login status based on tokens
 *
 * @param {String} accessToken
 * @param {String} refreshToken
 * @return {Boolean|Object} - false or decoded user data
 */
function checkLogin(accessToken, refreshToken) {
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

/** Check if the user type has access to the route */
function checkAccess(route, type, isServerRoute) {
  /** --- Validate input */

  // Prepare input for validation
  let input = {}
  input.route = route
  input.type = type

  /** Sanitize and validate input */
  /** @var {Array} - [vErr false || {object}, v {object} || false] */
  const [vErr, v] = validate('route, type', input, authSchema)

  /** Error: Invalid input */
  if (vErr || !v) return false

  /** --- Find route match and user type match */

  /**
   * Wildcard string match
   *
   * This function always takes the FIRST MATCH it finds.
   *
   * @param {String} str - the route to test
   * @param {String} accessRule - wildcard accessList route
   * @return {Boolean}
   */
  function wilcdardMatch(str, accessRule) {
    const escapeRegex = (str) =>
      str.replace(/([.*+?^=!:${}()|[\]/\\])/g, '\\$1')
    return new RegExp(
      '^' + accessRule.split('*').map(escapeRegex).join('.*') + '$'
    ).test(str)
  }

  /** Choose the server or client list */
  const accessList = isServerRoute ? serverList : clientList
  let result = 'noRouteMatch'

  /** Loop through all wildcard routes from the accessList */
  for (const accessRule of accessList) {
    /**
     * Try to match the route and user type.
     * If accessRule[0] is empty, it will match any user type.
     */
    if (wilcdardMatch(route, accessRule[0])) {
      /** accessRule[1] is empty, so this route does not require login. */
      if (accessRule[1] === '') {
        result = 'allMatch'
        break
      }
      /** accessRule[0] matches the user type. */
      if (accessRule[1].includes(type)) {
        result = 'typeMatch'
        break
      }
      /** No type match */
      result = 'noTypeMatch'
      break
    }
  }

  if (result === 'noRouteMatch') {
    /** Log this! */
    consola.info(`No route match. Route: ${route}`)
  }

  return result
}

/** Authorize user's login status and access based on user type */
export async function authorize(req, res, next) {
  /** --- Check if server-route or client-route */

  /**
   * If no client route was sent (req.body.route) then
   * this is an $axios call to the server route (req.path)
   */
  const isServerRoute = !req.body.route
  const route = isServerRoute ? req.path : req.body.route

  /** --- Validate input */

  /** Prepare input for validation */
  let input = {}
  input.route = route
  input.accessToken = req.headers.authorization || ''
  input.refreshToken = req.cookies.refreshToken || ''

  /** Sanitize and validate route and tokens */
  /** @var {Array} - [vErr false || {object}, v {object} || false] */
  const [vErr, v] = validate(
    'route, accessToken, refreshToken',
    input,
    authSchema
  )

  /** Error: Invalid input */
  if (vErr || !v) return res.json(joiResponse(vErr))

  /** --- Check if user is logged in */

  /** @var {Boolean|Object} isLoggedIn - false or decoded user data */
  const loginData = checkLogin(v.accessToken, v.refreshToken)

  /** @var {String} type - The user type from the decoded token data */
  const type = loginData.type || 'none'

  /** --- Check if user type has access */

  /** @var {String} access - The returned access code */
  const access = checkAccess(v.route, type, isServerRoute)

  /** Error: ROUTE is not in the access list (client or server) */
  if (access === 'noRouteMatch')
    return res.json({ status: 'error', code: '404' })

  /** Error: USER TYPE not found in the access list (client or server) */
  if (access === 'noTypeMatch') {
    /** User is not logged in */
    if (loginData === false || loginData === {})
      return res.json({ status: 'error', code: 'notLoggedIn' })
    /** User is logged in */
    return res.json({ status: 'error', code: '401' })
  }

  /** --- Success */

  if (access === 'allMatch' || access === 'typeMatch') {
    /** Server route -- Continue to controller. */
    if (isServerRoute) return next()

    /** Client route -- User is not logged in */
    if (loginData === false || loginData === {})
      return res.json({ status: 'success', code: 'loggedOut' })

    /** Client route -- User is logged in. Return user data */
    return res.json({
      status: 'success',
      code: 'loggedIn',
      data: {
        id: loginData.id,
        email: loginData.email,
        name: loginData.name,
        type: loginData.type,
      },
    })
  }
}
