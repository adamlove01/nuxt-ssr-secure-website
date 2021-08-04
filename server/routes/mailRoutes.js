import { Router } from 'express'
import { contactEmail } from '../controllers/mailController'

const mailRoutes = Router()

mailRoutes.post('/server/sendContactEmail', contactEmail)

export { mailRoutes }
