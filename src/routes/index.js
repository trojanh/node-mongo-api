import express from 'express'
import { fetchRecords } from '../controllers/index.js'
import { recordValidator, validateParams } from '../validations/index.js'

const routes = express.Router()

routes.post('/records', validateParams(recordValidator), fetchRecords)
routes.use('*', invalidRoutes)

function invalidRoutes(request, response) {
  return response.status(404).json({
    code: 1,
    msg: 'Route not found',
  })
}

export default routes
