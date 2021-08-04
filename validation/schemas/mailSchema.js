import Joi from 'joi'
import { msg } from '../JoiMessages'
import html from '../sanitizeHtml'
import { tlds } from '../tlds'

/**
 * Mail Schema
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
  subject: Joi.string()
    .custom(html.removeAll)
    .trim()
    .required()
    .empty()
    .min(2)
    .max(255)
    .messages(msg('subject', 'string', ['required', 'empty', 'min', 'max'])),
  message: Joi.string()
    .custom(html.removeAll)
    .trim()
    .required()
    .empty()
    .min(2)
    .max(30000)
    .messages(msg('message', 'string', ['required', 'empty', 'min', 'max'])),
}
