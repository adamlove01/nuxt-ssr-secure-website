import Joi from 'joi'
import { msg } from './serverMessages'

/**
 * validate - Joi input validation
 *
 * This function can validate any or all fields from a single
 * table schema by pulling only the requested keys from it.
 *
 * Usage:
 * const v = validate('email, password', req.body, schema)
 *
 * @param  {String} input  - The names of all the inputs, comma-separated
 *                           like 'name, email, password'
 * @param  {Object} data   - The object (req.body or custom object) that
 *                           contains the input values
 * @param  {Object} schema - The Table Schema to be used for extracting
 *                           schema keys
 * @return {Array}           [v {object} || false, vErr {object} || false]
 */
export function validate(input, data, schema) {
  /* Split the input string into array, removing spaces */
  const inputArray = input.replace(/\s/g, '').split(',')
  let err = {}
  let inputObject = {}
  let schemaObject = {}

  /** Loop through input array, building inputObject and schemaObject */
  for (let key of inputArray) {
    /** Error: data[key] does not exist */
    if (!Object.prototype.hasOwnProperty.call(data, key)) {
      console.log(
        `ERROR JoiValidate.js: '${key}' key not found in data object.`
      )
      err = {
        details: [{ message: msg('', 'unknownError'), context: { key: key } }],
      }
      return [err, false]
    }

    /** Error: schema[key] does not exist */
    if (!Object.prototype.hasOwnProperty.call(schema, key)) {
      console.log(
        `ERROR JoiValidate.js: '${key}' key not found in schema object.`
      )
      err = {
        details: [{ message: msg('', 'unknownError'), context: { key: key } }],
      }
      return [err, false]
    }

    /** Add data[key] to inputObject */
    inputObject[key] = data[key]

    /** Add schema[key] to schemaObject */
    schemaObject[key] = schema[key]
  }

  /**
   * Validate the custom schema using the extracted input
   *
   * abortEarly: false  =  Return all errors.
   * convert: true      =  Options like .custom(), .trim() and .lowercase()
   *                       will alter the data that is returned.
   */
  const result = Joi.object(schemaObject)
    .options({ abortEarly: false, convert: true })
    .validate(inputObject)

  /** Return Array [v {object} || false, vErr {object} || false] */
  if (!result.error) {
    return [false, result.value]
  } else {
    return [result.error, false]
  }
}

/**
 * response - Create a res.json return object for server respones
 *
 * Usage: return res.json(response('success, User, created', data))
 *
 * @param  {String} message - A comma-separated string of format
 *                            'status, name, msgKey' for server errors.
 * @param  {Any}    data    - Optional data, such as row id or row data
 * @return {Object}
 */
export function response(message, data = null) {
  /**
   * Split the message string into separate variables
   *
   * @param {String} status - Status must be 'success', 'info' or 'error'
   * @param {String} name   - The name to be inserted into the msg() function
   * @param {String} msgKey - The message key must be from the list at
   *                          /validation/serverMessages.js
   */
  const [status, name, msgKey] = message.replace(/\s/g, '').split(',')
  return {
    message: msg(name, msgKey),
    status: status,
    name: name,
    data: data,
  }
}

/**
 * joiResponse - Create a res.json return object for Joi validation errors.
 *
 * Usage: return res.json(joiResponse(vErr))
 *
 * @param {Object} error - The error object returned from Joi.validate()
 * @prop  {Array}  error.details - Array of all errors thrown by Joi
 * @prop  {String} error.details.message - The error message
 * @prop  {String} error.details.context.key - The key name
 */
export function joiResponse(error) {
  /** Put all error details into arrays */
  const nameArray = []
  const messageArray = []
  for (let item of error.details) {
    nameArray.push(item.context.key)
    messageArray.push(item.message)
  }
  return {
    message: messageArray,
    status: 'inputError',
    name: nameArray,
    count: error.details.length,
  }
}
