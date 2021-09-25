import { APP_PORT, MONGO_URI } from '../config/index.js'
import { initializeMongo } from './database/index.js'

/**
 * starts the express server on the APP_PORT and initializes mongodb using MONGO_URI
 * @param {any} app
 * @returns {any}
 */
export default async function startServer (app) {
  try {
    await initializeMongo(MONGO_URI)
    app.listen(APP_PORT)

    console.info(`Server Started Successfully! Listening on Port: ${APP_PORT}`)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}
