import { Router } from 'express'
import svgCaptcha from 'svg-captcha'

const captchaRoutes = Router()

/** Get Captcha data */
captchaRoutes.get('/server/captcha', function (req, res) {
  /** Create a math captcha 50% of the time */
  if (Math.round(Math.random())) {
    let captcha = svgCaptcha.createMathExpr({
      width: '200',
      color: true,
      noise: 3,
      mathMin: 1,
      mathMax: 10,
      mathOperator: '+',
    })

    captcha.message = 'Type the answer'
    return res.json(captcha)
  }

  /** Create a code captcha 50% of the time */
  let captcha = svgCaptcha.create({
    width: '200',
    color: true,
    noise: 3,
    size: 6,
    ignoreChars: '0oO1iIlL',
  })

  /** Set text as lowercase so the code is not case-sensitive */
  captcha.text = captcha.text.toLowerCase()
  captcha.message = 'Type the code'
  return res.json(captcha)
})

export { captchaRoutes }
