import Joi from 'joi'
import { msg } from '../JoiMessages'
import html from '../sanitizeHtml'

/**
 * Authorize validation Schema
 *
 * Note that 'empty()' will trigger before 'required()' so we need a separate
 * trigger and message for it.
 */
export const authSchema = {
  route: Joi.string()
    .custom(html.removeAll)
    .required()
    .empty()
    .max(255)
    .messages(msg('route', 'string', ['required', 'empty', 'max'])),
  type: Joi.string()
    .custom(html.removeAll)
    .trim()
    .lowercase()
    .required()
    .empty()
    .max(255)
    .messages(msg('type', 'string', ['required', 'empty', 'max'])),
  accessToken: Joi.string()
    .allow('')
    .custom(html.removeAll)
    .max(255)
    .pattern(/^[a-zA-Z0-9-_.]*$/)
    .messages(msg('accessToken', 'string', ['max', 'pattern.base'])),
  refreshToken: Joi.string()
    .allow('')
    .custom(html.removeAll)
    .max(255)
    .pattern(/^[a-zA-Z0-9-_.]*$/)
    .messages(msg('refreshToken', 'string', ['max', 'pattern.base'])),
  token: Joi.string()
    .allow('')
    .custom(html.removeAll)
    .max(255)
    .pattern(/^[a-zA-Z0-9-_.]*$/)
    .messages(msg('token', 'string', ['max', 'pattern.base'])),
}
