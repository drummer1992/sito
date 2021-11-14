'use strict'

const validate = require('./validate')

module.exports = (validator, payload, customOptions = {}) => {
  return validate(validator, payload, { ...customOptions, throwFirst: true })
}