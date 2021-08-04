import { schema } from '../../validation/schemas/mailSchema'
import { validate, response, joiResponse } from '../../validation/JoiValidate'
import { sendContactEmail } from '../utilities/sendContactEmail'

/** Register user */
export async function contactEmail(req, res) {
  /** --- Validate input */

  /** Sanitize and validate registration input */
  /** @var {Array} - [vErr false || {object}, v {object} || false] */
  const [vErr, v] = validate('name, email, subject, message', req.body, schema)

  /** Error: Invalid input */
  if (vErr || !v) return res.json(joiResponse(vErr))

  /** Send the email */
  sendContactEmail(v)

  /** --- Success */

  /** Return message to client */
  return res.json(response('success, email, emailSent'))
}
