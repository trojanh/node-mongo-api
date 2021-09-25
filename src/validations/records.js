import Joi from 'joi';

/**
 * Validates the object keys for '/record' route
 */
const recordValidator = Joi.object({
  startDate: Joi.date().required(),
  endDate: Joi.date().required().min(Joi.ref('startDate')),
  maxCount: Joi.number().required(),
  minCount: Joi.number().required()
})


export  { recordValidator }
