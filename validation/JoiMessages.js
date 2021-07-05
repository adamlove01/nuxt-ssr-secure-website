/**
 * An alphabetical list of standard Joi ErrorCodes with custom messages
 * for Joi validation in this app. They are returned to the client Vue page.
 *
 * This is called in /validation/schemas/<schemaName>
 */
const messages = {
  'any.required': `The <name> field is required.`,
  'boolean.base': `The <name> must of type 'boolean'.`,
  'date.base': `The <name> must of type 'date'.`,
  'date.empty': `The <name> field is required.`,
  'date.required': `The <name> field is required.`,
  'number.base': `The <name> must of type 'number'.`,
  'number.empty': `The <name> field is required.`,
  'number.greater': `The <name> must be greater than {#limit}.`,
  'number.integer': `The <name> must be an 'integer'.`,
  'number.less': `The <name> must be less than {#limit}.`,
  'number.required': `The <name> is required.`,
  'string.base': `The <name> must be of type 'text'.`,
  'string.email': `Please format the <name> like name@example.com.`,
  'string.empty': `The <name> field is required.`,
  'string.max': `The <name> cannot have more than {#limit} characters.`,
  'string.min': `The <name> must have at least {#limit} characters.`,
  'string.pattern.base': `The <name> has invalid characters.`,
  'string.required': `The <name> is required.`,
  'string.valid': `The <name> is invalid.`,
}

/**
 * msg - Create a list of error Codes and custom messages for Joi schemas,
 * customized based on the parameters
 *
 * @param {String} name - Descriptive name of the input field
 * @param {String} type - the Joi type of the field
 * @param {Array} errorNames - List of standard Joi error names
 * @return {Object}
 */
export function msg(name, type, errorNames) {
  /** Capitalize the input field name for nicer presentation */
  name = name.charAt(0).toUpperCase() + name.slice(1)

  let errorObject = {}
  /** Add '*.base' error message */
  errorObject[`${type}.base`] = messages[`${type}.base`].replace('<name>', name)

  /** loop through message array, if any */
  if (errorNames && errorNames.length > 0) {
    for (const errorName of errorNames) {
      let errorCode = `${type}.${errorName}`
      if (errorName == 'required') errorCode = 'any.required'

      /** Add message to the object list, overwriting the the name */
      if (!messages[errorCode]) {
        console.log(
          `ERROR: JoiMessages: errorCode '${errorCode}' does not exist in list.`
        )
        errorObject[errorCode] = `Error in '${errorCode}'`
      } else {
        errorObject[errorCode] = messages[errorCode].replace('<name>', name)
      }
    }
  }
  return errorObject
}
