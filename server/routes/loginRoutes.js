import { Router } from 'express'
import {
  register,
  login,
  logout,
  verify,
  forgotPassword,
  resetPassword,
} from '../controllers/loginController'

const loginRoutes = Router()

loginRoutes.post('/server/register', register)
loginRoutes.post('/server/login', login)
loginRoutes.get('/server/logout', logout)
loginRoutes.post('/server/verify', verify)
loginRoutes.post('/server/forgot-password', forgotPassword)
loginRoutes.post('/server/reset-password', resetPassword)

export { loginRoutes }
