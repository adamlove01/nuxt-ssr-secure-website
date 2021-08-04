/**
 * An alphabetical, reusable list of custom server messages
 * for this app. They are returned to the client Vue page.
 *
 * called in /controllers/[myController].js
 */
const messages = {
  authorized: `<name> authorized.`,
  created: `<name> created successfully.`,
  deleted: `<name> deleted successfully.`,
  emailInactive: `The <name> is not active.`,
  emailPending: `The <name> is pending. Please check your email to verify
   your account.`,
  emailSentToUser: `The <name> has been sent. Please check your email.`,
  emailSent: `The <name> has been sent. Thank you!`,
  errorCreating: `Error while creating <name>. Please try again later.`,
  errorDeleting: `Error while deleting <name>. Please try again later.`,
  errorLoggingIn: `Error while logging in the <name>. Please try again later.`,
  errorReading: `Error while reading <name>. Please try again later.`,
  errorSaving: `Error while saving <name>. Please try again later.`,
  errorUpdating: `Error while updating <name>. Please try again later.`,
  exists: `The <name> already exists. Please enter a different one.`,
  inUse: `The <name> is already in use. Please enter a different one.`,
  invalid: `The <name> you entered is invalid.`,
  loggedIn: `Logged in successfully.`,
  loggedOut: `Logged out successfully.`,
  noneInList: `There are no <name>.`,
  notFound: `<name> not found.`,
  notFoundDeleted: `<name> not found. It may have been deleted.`,
  notFoundEntered: `The <name> you entered was not found.`,
  read: `<name> retrieved.`,
  registered: `<name> registered successfully.`,
  unauthorized: `<name> unauthorized`,
  unknownError: `Unknown error. Please try again later.`,
  updated: `<name> updated successfully.`,
  verified: `<name> verified.`,
}

/**
 * msg - Create a list of error Codes and custom messages for Server errors,
 * customized based on the parameters
 *
 * @param {String} name - Descriptive name of the field
 * @param {String} errorCode - The message code
 * @return {String}
 */
export function msg(name, errorCode) {
  /** Capitalize the input field name for nicer presentation */
  name = name.charAt(0).toUpperCase() + name.slice(1)
  return messages[errorCode].replace('<name>', name)
}
