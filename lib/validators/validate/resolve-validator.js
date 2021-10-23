'use strict'

const GenericValidator = require('../generic')

module.exports = (validator, payload, key, object) => {
  if (validator instanceof GenericValidator) {
    return validator
  } else if (typeof validator === 'function') {
    return validator(payload, key, object)
  }

  throw new Error(
      'Not valid validator provided. '
      + 'It should be instance of GenericValidator, '
      + 'or the function which returns instance of GenericValidator.',
  )
}