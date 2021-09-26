import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import morgan from 'morgan'
import routes from './routes/index.js'
import startServer from './startServer.js'

const app = express()
app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(morgan('short'))
app.use(routes)
startServer(app)

export default app
