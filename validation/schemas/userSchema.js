import Joi from 'joi'
import { msg } from '../JoiMessages'
import html from '../sanitizeHtml'
import { tlds } from '../tlds'

/**
 * User validation Schema
 *
 * Note that 'empty()' will trigger before 'required()' so we need a separate
 * trigger and message for it.
 *
 * For .email(): We are validating TLDs (top-level domains) but you can turn
 * this off if you wish, like this: .email({ tlds: { allow: false } })
 * Adding TLD validation means ~20kb added to page load on the client side.
 *
 */
export const schema = {
  id: Joi.number()
    .integer()
    .required()
    .greater(0)
    .less(2147483647)
    .messages(msg('id', 'number', ['integer', 'required', 'greater', 'less'])),
  name: Joi.string()
    .custom(html.removeAll)
    .trim()
    .required()
    .empty()
    .min(2)
    .max(255)
    .messages(msg('name', 'string', ['required', 'empty', 'min', 'max'])),
  email: Joi.string()
    .custom(html.removeAll)
    .trim()
    .lowercase()
    .required()
    .empty()
    .email({ tlds: { allow: tlds } })
    .max(255)
    .messages(msg('email', 'string', ['required', 'empty', 'email', 'max'])),
  password: Joi.string()
    .trim()
    .required()
    .empty()
    .min(8)
    .max(255)
    .messages(msg('password', 'string', ['required', 'empty', 'min', 'max'])),
  image: Joi.string()
    .custom(html.removeAll)
    .trim()
    .min(4)
    .messages(msg('image', 'string', ['min'])),
  type: Joi.string()
    .trim()
    .required()
    .empty()
    .valid('client', 'admin')
    .messages(msg('type', 'string', ['required', 'empty', 'valid'])),
  status: Joi.string()
    .trim()
    .required()
    .empty()
    .valid('active', 'inactive', 'pending')
    .messages(msg('status', 'string', ['required', 'empty', 'valid'])),
  created_at: Joi.date()
    .iso()
    .required()
    .empty()
    .messages(msg('created_at', 'date', ['required', 'empty'])),
  updated_at: Joi.date()
    .iso()
    .required()
    .empty()
    .messages(msg('updated_at', 'date', ['required', 'empty'])),
  last_login: Joi.date()
    .iso()
    .required()
    .empty()
    .messages(msg('last_login', 'date', ['required', 'empty'])),
}
