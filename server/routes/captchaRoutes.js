import { Router } from 'express'
import { createCaptcha } from '../controllers/captchaController'

const captchaRoutes = Router()

captchaRoutes.get('/server/captcha', createCaptcha)

export { captchaRoutes }
