import express from 'express'
import cookieParser from 'cookie-parser'
import { authRoutes } from './routes/authRoutes'
import { captchaRoutes } from './routes/captchaRoutes'
import { loginRoutes } from './routes/loginRoutes'
import { mailRoutes } from './routes/mailRoutes'
import { userRoutes } from './routes/userRoutes'

/** Create express instance */
const app = express()

/** Add Express options and plugins */
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

/** Do not show 'x-powered-by: Express' in page header */
app.disable('x-powered-by')

/** Add Express Routes */
app.use(authRoutes)
app.use(captchaRoutes)
app.use(mailRoutes)
app.use(loginRoutes)
app.use(userRoutes)

/**
 * Express has access to the root of the project.
 * ALL Express routes should start with '/server/...' to avoid collision with
 * client-side page paths.
 */
export default { path: '/', handler: app }
