'use strict'

const { forbidden } = require('../index')

module.exports = (validator, payload, { strict } = {}) => {
  const validatorShape = validator.getShape()
  const itemValidator = validator.getItemValidator()

  const shouldSetAdditionalValidator = Boolean(strict || itemValidator)

  if (shouldSetAdditionalValidator) {
    const payloadKeys = payload ? Object.keys(payload) : []

    for (const key of payloadKeys) {
      if (itemValidator) {
        validatorShape[key] = itemValidator
      }

      if (strict && !validatorShape[key]) {
        validatorShape[key] = forbidden()
      }
    }
  }

  return validatorShape
}