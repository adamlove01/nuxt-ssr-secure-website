import { Router } from 'express'
import { authorize } from '../controllers/authController'

const authRoutes = Router()

authRoutes.post('/server/authorize', authorize)

export { authRoutes }
