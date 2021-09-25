import Joi from 'joi'

export * from './records.js'

/**
 * Validates the input parameters using the specified validator which is a joi Schema
 * @param {object} validator Joi Schema
 * @returns {any}
 */
export function validateParams(schemaValidator) {
  return (req, res, next) => {
    const { error } = schemaValidator.validate(req.body)
    if (error)
      return res.sendStatus(422).json({
        code: 1,
        msg: 'Failure',
        error
      })
    return next()
  }
}
