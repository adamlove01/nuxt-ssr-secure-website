/**
 * Start Express server
 */
import express from 'express'
import consola from 'consola'
import my from 'nuxt'
import config from '../nuxt.config.js'
import * as dotenv from 'dotenv'
dotenv.config()

const app = express()

/** Set Nuxt.js options */
config.dev = process.env.NODE_ENV !== 'production'

async function start() {
  /** Init Nuxt.js */
  const nuxt = new my.Nuxt(config)

  /** Get host and port from BASE_URL */
  const [host, port] = process.env.BASE_URL.replace(
    new RegExp(/^https?:\/\//),
    ''
  ).split(':')

  /** Build only in dev mode */
  if (config.dev) {
    const builder = new my.Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }

  /** Give nuxt middleware to express */
  app.use(nuxt.render)

  /** Listen to the server */
  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true,
  })
}

/** Run start */
start()
