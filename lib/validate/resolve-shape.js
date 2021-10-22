'use strict'

const { forbidden } = require('../../index')

module.exports = (schemaValidator, payload) => {
  const validatorShape = schemaValidator.getShape()
  const itemValidator = schemaValidator.getItemValidator()

  const shouldSetAdditionalValidator = Boolean(schemaValidator.isStrict() || itemValidator)

  if (shouldSetAdditionalValidator) {
    const payloadKeys = payload ? Object.keys(payload) : []

    for (const key of payloadKeys) {
      if (itemValidator) {
        validatorShape[key] = itemValidator
      }

      if (schemaValidator.isStrict() && !validatorShape[key]) {
        validatorShape[key] = forbidden()
      }
    }
  }

  return validatorShape
}