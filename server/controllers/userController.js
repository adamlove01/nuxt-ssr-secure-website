import db from '../database/knex.cjs'
import { schema } from '../../validation/schemas/userSchema'
import { validate, response, joiResponse } from '../../validation/JoiValidate'
import { sendConfirmationEmail } from '../utilities/sendConfirmationEmail'
import bcrypt from 'bcryptjs'
import Try from '../../helpers/tryCatch'
import * as dotenv from 'dotenv'
dotenv.config()

/** Create user */
export async function create(req, res) {
  /** --- Validate input */

  /** Sanitize and validate user input */
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
  const date = new Date().toISOString().replace('T', ' ').split('.')[0]

  /** Initialize user data */
  let user = {
    name: v.name,
    email: v.email,
    password: encryptedPassword,
    type: v.type,
    status: v.status,
    created_at: date,
    updated_at: date,
    last_login: date,
  }

  /** Save user in db */
  /** @var {Array} r2 - row id returned from db */
  const [err2, r2] = await Try(
    db
      .knex('users')
      .insert(user)
      .then(function (id) {
        return id
      })
  )
  console.log(`r2=${r2}`)

  /** Error: db error */
  if (err2) return res.json(response('error, user, errorCreating', err2))

  /** Error: Nothing inserted in db */
  if (r2 === undefined) return res.json(response('error, user, errorCreating'))

  /** If status is pending, send confirmation email */
  if (v.status === 'pending') {
    sendConfirmationEmail({ id: r2[0], email: v.email })
  }

  /** --- Success */

  /** Return message to client */
  return res.json(response('success, user, registered', r2))
}

/** Read all users */
export async function read(req, res) {
  /** --- Read users */

  /** Read all users in db */
  /** @var {Array} rows - all user rows in db */
  const [err, rows] = await Try(db.knex('users').select('*'))

  /** Error: db error */
  if (err) res.json(response('error, users, errorReading'))

  /** Error: No users found */
  if (rows.length < 1) return res.json(response('info, users, noneInList'))

  /** --- Success */

  /** Return all users to client */
  return res.json(response('success, users, read', rows))
}

/** Update a user */
export async function update(req, res) {
  /** --- Validate input */

  /** Sanitize and validate user input */
  /** @var {Array} - [vErr false || {object}, v {object} || false] */
  const [vErr, v] = validate('name, email, type, status', req.body, schema)

  /** Error: Invalid input */
  if (vErr || !v) return res.json(joiResponse(vErr))

  /** Sanitize and validate user id */
  /** @var {Array} - [v2Err false || {object}, v2 {object} || false] */
  const [v2Err, v2] = validate('id', req.body, schema)

  /** Error: id invalid  */
  if (v2Err || !v2) return res.json(response('error, user, errorUpdating'))

  /** --- Check if email is unique */

  /** Check if email is in db for another user */
  /** @var {Array} r - rows matching email in db */
  const [err, r] = await Try(
    db
      .knex('users')
      .select('*')
      .where('email', v.email)
      .whereNot('id', v2.id)
      .limit(1)
  )

  /** Error: db error */
  if (err) return res.json(response('error, user, errorUpdating'))

  /** Error: email is in use */
  if (r.length > 0) return res.json(response('error, email, inUse'))

  /** --- Save the user update */

  /** Initialize user data */
  const date = new Date().toISOString().replace('T', ' ').split('.')[0]
  const user = {
    name: v.name,
    email: v.email,
    type: v.type,
    status: v.status,
    updated_at: date,
  }

  /** Update user in db */
  /** @var {Array} row.data - user row returned from db  */
  const [err2, row] = await Try(
    db.knex('users').update(user).where('id', v2.id)
  )

  /** Error: db error */
  if (err2) return res.json(response('error, user, errorUpdating'))

  /** Error: Nothing inserted in db */
  if (row === undefined) return res.json(response('error, user, notFound'))

  /** --- Success */

  /** Retrieve data from updated user */
  /** @var {Array} r - row data from db */
  const [err3, r3] = await Try(
    db.knex('users').select('id', 'name', 'email').where('id', v2.id)
  )

  /** Error: db error */
  if (err3) return res.json(response('error, user, errorUpdating'))

  /** Return message to client */
  return res.json(response('success, user, updated', r3[0]))
}

/** Delete a user */
export async function del(req, res) {
  /** --- Validate input */

  /** Sanitize and validate user ID */
  /** Key @var {Object} v - v[inputValues] or v.err */
  const [vErr, v] = validate('id', req.params, schema)

  /** Error: Invalid input */
  if (vErr || !v) return res.json(joiResponse(vErr))

  /** --- Delete user */

  /** Delete user in db */
  /** @var {Number} r - number of rows deleted */
  const [err, count] = await Try(db.knex('users').delete().where('id', v.id))

  /** Error: db error */
  if (err) res.json(response('error, user, errorDeleting'))

  /** Error: no user deleted */
  if (count < 1) return res.json(response('error, user, notFoundDeleted'))

  /** --- Success */

  /** Return message to the client */
  return res.json(response('success, user, deleted', count))
}
