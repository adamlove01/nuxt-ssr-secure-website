import db from '../database/knex.cjs'
import { schema } from '../../validation/schemas/userSchema'
import { authSchema } from '../../validation/schemas/authorizeSchema'
import { validate, response, joiResponse } from '../../validation/JoiValidate'
import { sendConfirmationEmail } from '../utilities/sendConfirmationEmail'
import { sendPasswordResetEmail } from '../utilities/sendPasswordResetEmail'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import Try from '../../helpers/tryCatch'
import * as dotenv from 'dotenv'
dotenv.config()

/** Register user */
export async function register(req, res) {
  /** --- Validate input */

  /** Sanitize and validate registration input */
  /** @var {Array} - [vErr false || {object}, v {object} || false] */
  const [vErr, v] = validate(
    'name, email, password, type, status',
    req.body,
    schema
  )

  /** Error: Invalid input */
  if (vErr || !v) return res.json(joiResponse(vErr))

  /** --- Check if email is unique */

  /** Check db for email */
  /** @var {Array} r - row data from db */
  const [err, r] = await Try(
    db.knex('users').select('*').where('email', v.email)
  )

  /** Error: DB error */
  if (err) return res.json(response('error, user, errorCreating', err))

  /** Error: email is in use */
  if (r.length > 0) return res.json(response('error, email, inUse'))

  /** --- 'admin' user is special */

  if (v.name === 'admin') {
    /** Check db for existing 'admin' name */
    /** @var {Array} r - row data from db */
    const [err1, r1] = await Try(
      db.knex('users').select('*').where('name', 'admin')
    )

    /** Error: DB error */
    if (err1) return res.json(response('error, user, errorCreating', err1))

    /** Error: admin name is in use */
    if (r1.length > 0) return res.json(response('error, "admin" name, inUse'))

    v.type = 'admin'
  }

  /** --- Save new user */

  /** Encrypt password and create timestamp */
  const salt = bcrypt.genSaltSync(10)
  const encryptedPassword = bcrypt.hashSync(v.password, salt)
  const dateISO = new Date().toISOString()

  /** Initialize user data */
  let user = {
    name: v.name,
    email: v.email,
    password: encryptedPassword,
    type: v.type,
    status: v.status,
    created_at: dateISO,
    updated_at: dateISO,
    last_login: dateISO,
  }

  /** Save user in db */
  /** @var {Array} r2 - row id returned from db */
  const [err2, r2] = await Try(db.knex('users').insert(user).returning('id'))

  /** Error: db error */
  if (err2) return res.json(response('error, user, errorCreating', err2))

  /** Error: Nothing inserted in db */
  if (r2 === undefined) return res.json(response('error, user, errorCreating'))

  /** If status is pending, send confirmation email */
  if (v.status === 'pending') {
    sendConfirmationEmail({ id: r2[0], email: v.email })
  }
}

/** Log in user */
export async function login(req, res) {
  /** --- Validate input */

  /** Sanitize and validate login input */
  /** @var {Array} - [vErr false || {object}, v {object} || false] */
  const [vErr, v] = validate('email, password', req.body, schema)

  /** Error: Invalid input */
  if (vErr || !v) return res.json(joiResponse(vErr))

  /** --- Get user data using email */

  /** @var {Array} row - row data from db matching email */
  const [err, row] = await Try(
    db.knex('users').select('*').where('email', v.email)
  )

  /** Error: db error */
  if (err) return res.json(response('error, user, errorLoggingIn'))

  /** Error: User with that email not found */
  if (row.length < 1) return res.json(response('error, email, notFoundEntered'))

  /** @var {Object} r - user data */
  const r = row[0]

  /** --- Validate password */

  /** Compare submitted password with password in DB */
  /** @var {Boolean} isMatched - whether password matches */
  const isMatched = await bcrypt.compare(v.password, r.password)

  /** Error: Invalid password */
  if (isMatched === false) return res.json(response('error, password, invalid'))

  /** --- Check if user is active */

  /** Error: User is pending */
  if (r.status === 'pending')
    return res.json(response('error, account, emailPending'))

  /** Error: User not active */
  if (r.status === 'inactive')
    return res.json(response('error, account, emailInactive'))

  /** --- Update last_login */

  /** Update last_login in db */
  const last_login = { last_login: new Date().toISOString() }
  /** @var {Array} r2[0] - id(s) of row(s) updated in db */
  // eslint-disable-next-line
  const [err2, r2] = await Try(
    db.knex('users').update(last_login, ['id']).where('id', r.id)
  )

  /** Error: DB Error */
  if (err2) return res.json(response('error, user, errorLoggingIn'))

  /** --- Create Tokens */

  /** Set user data and token data */
  const user = { id: r.id, email: r.email, name: r.name, type: r.type }
  let tokenData = user

  /** Create accessToken for Vuex. Randomize so tokens are unique. */
  tokenData.rand = Math.floor(Math.random() * 10000000)
  const accessToken = jwt.sign(tokenData, process.env.TOKEN_AUTH_SECRET, {
    expiresIn: '15 minutes',
  })

  /** Create refreshToken for cookie. Randomize so tokens are unique. */
  tokenData.rand = Math.floor(Math.random() * 10000000)
  const refreshToken = jwt.sign(tokenData, process.env.TOKEN_AUTH_SECRET, {
    expiresIn: '7 days',
  })

  /** Create cookie. 'maxAge' must be the same as 'expiresIn' above */
  res.cookie('refreshToken', refreshToken, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days, in milliseconds
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' ? true : false,
    sameSite: 'strict',
  })

  /** --- Success */

  /** Return accessToken and user data, to be inserted into Vuex */
  return res.json(
    response('success, user, loggedIn', {
      token: accessToken,
      user: user,
      loggedIn: 'yes',
    })
  )
}

/** Log out user */
export async function logout(req, res) {
  /** --- Delete cookie */

  /** Get cookie if exists */
  let refreshToken = req.cookies.refreshToken || ''

  /** Delete cookie */
  if (refreshToken)
    /**
     * Note: The browser requires that we pass the same options
     * as we used to set the cookie.
     */
    res.clearCookie('refreshToken', refreshToken, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days, in milliseconds
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production' ? true : false,
      sameSite: 'strict',
    })

  /** --- Success */

  /** Return message to client */
  return res.json(response('success, user, loggedOut'))
}

/** Verify user email */
export async function verify(req, res) {
  /** --- Validate input */

  /** Sanitize and validate verification token input */
  /** @var {Array} - [vErr false || {object}, v {object} || false] */
  const [vErr, v] = validate('token', req.body, authSchema)

  /** Error: Invalid input */
  if (vErr || !v) return res.json(joiResponse(vErr))

  /** --- Decode user data */

  /** @var {Object|false} r - decoded token data */
  let decodedUserData = false
  try {
    decodedUserData = jwt.verify(v.token, process.env.TOKEN_AUTH_SECRET)
  } catch (err) {
    /** Error: Verification failed or token is expired */
    return res.json(response('error, user, notFound'))
  }

  /** --- Check if user id exists */

  /** @var {Array} r - rows matching id in db */
  const [err, r] = await Try(
    db.knex('users').select('*').where('id', decodedUserData.id).limit(1)
  )

  /** Error: db error */
  if (err) return res.json(response('error, user, errorUpdating'))

  /** Error: user not in db */
  if (r.length < 1) return res.json(response('error, user, notFound'))

  /** --- Check which type of verification this is */

  const types = ['sendPasswordResetEmail', 'sendConfirmationEmail']

  if (!types.includes(decodedUserData.type))
    return res.json(response('error, none, unknownError'))

  /** User lands on /reset-password route - email verified */
  if (decodedUserData.type === 'sendPasswordResetEmail') {
    /** --- Success */

    /** Return message to client */
    return res.json(
      response('success, user, verified', {
        id: decodedUserData.id,
      })
    )
  }

  /** User lands on /Verify route - Verify email address after registration */
  if (decodedUserData.type === 'sendConfirmationEmail') {
    /** --- Save the user status to 'active' */

    /** Initialize user data */
    const dateISO = new Date().toISOString()
    const user = {
      status: 'active',
      updated_at: dateISO,
    }

    /** Update user in db */
    /** @var {Array} row - user row returned from db  */
    const [err2, row] = await Try(
      db
        .knex('users')
        .update(user, ['id', 'name', 'email'])
        .where('id', r[0].id)
    )

    /** Error: db error */
    if (err2) return res.json(response('error, user, errorUpdating'))

    /** Error: Nothing inserted in db */
    if (row === undefined) return res.json(response('error, user, notFound'))

    /** --- Success */

    /** Return message to client */
    return res.json(response('success, user, updated', row[0]))
  }
}

/** Forgot Password */
export async function forgotPassword(req, res) {
  /** --- Validate input */

  /** Sanitize and validate email input */
  /** @var {Array} - [vErr false || {object}, v {object} || false] */
  const [vErr, v] = validate('email', req.body, schema)

  /** Error: Invalid input */
  if (vErr || !v) return res.json(joiResponse(vErr))

  /** --- Get user data using email */

  /** @var {Array} row - row data from db matching email */
  const [err, row] = await Try(
    db.knex('users').select('*').where('email', v.email)
  )

  /** Error: db error */
  if (err) return res.json(response('error, user, errorLoggingIn'))

  /** Error: User with that email not found */
  if (row.length < 1) return res.json(response('error, email, notFoundEntered'))

  /** @var {Object} r - user data */
  const r = row[0]

  /** --- Check if user is active */

  /** Error: User is pending */
  if (r.status === 'pending')
    return res.json(response('error, account, emailPending'))

  /** Error: User not active */
  if (r.status === 'inactive')
    return res.json(response('error, account, emailInactive'))

  /** Send password reset email */
  sendPasswordResetEmail({ id: r.id, email: v.email })

  /** --- Success */

  /** Return message to client */
  return res.json(response('success, password reset link, emailSentToUser', r))
}

/** Reset Password */
export async function resetPassword(req, res) {
  /** --- Validate input */

  /** Sanitize and validate input */
  /** @var {Array} - [vErr false || {object}, v {object} || false] */
  const [vErr, v] = validate('id, password', req.body, schema)

  /** Error: Invalid input */
  if (vErr || !v) return res.json(joiResponse(vErr))

  /** --- Get user data using id */

  /** @var {Array} row - row data from db matching user ID */
  const [err, row] = await Try(db.knex('users').select('*').where('id', v.id))

  /** Error: db error */
  if (err) return res.json(response('error, user, notFound'))

  /** Error: User with that ID not found */
  if (row.length < 1) return res.json(response('error, user, notFound'))

  /** @var {Object} r - user data */
  const r = row[0]

  /** --- Check if user is active */

  /** Error: User is pending */
  if (r.status === 'pending')
    return res.json(response('error, account, emailPending'))

  /** Error: User not active */
  if (r.status === 'inactive')
    return res.json(response('error, account, emailInactive'))

  /** --- Save the user password */

  /** Initialize user data */
  const dateISO = new Date().toISOString()
  const user = {
    password: v.password,
    updated_at: dateISO,
  }

  /** Update user in db */
  /** @var {Array} row2 - user row returned from db  */
  const [err2, row2] = await Try(
    db.knex('users').update(user).where('id', r.id)
  )

  /** Error: db error */
  if (err2) return res.json(response('error, user, errorUpdating'))

  /** Error: Nothing inserted in db */
  if (row2 === undefined) return res.json(response('error, user, notFound'))

  /** --- Success */

  /** Return message to client */
  return res.json(response('success, user, updated', row2[0]))
}
