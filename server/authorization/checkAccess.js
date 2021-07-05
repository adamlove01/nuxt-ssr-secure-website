import { authSchema } from '../../validation/schemas/authorizeSchema'
import { validate } from '../../validation/JoiValidate'
import { clientList, serverList } from './accessList'
import consola from 'consola'

/** Check if the user type has access to the route */
export function checkAccess(route, type, isServerRoute) {
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
