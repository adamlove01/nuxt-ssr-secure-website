import { authSchema } from '../../validation/schemas/authorizeSchema'
import { validate, joiResponse } from '../../validation/JoiValidate'
import { checkLogin } from './checkLogin'
import { checkAccess } from './checkAccess'

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
