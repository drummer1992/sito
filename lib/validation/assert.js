'use strict'

const validate = require('./validate')

module.exports = async (validator, payload, customOptions = {}) => {
  await validate(validator, payload, { ...customOptions, throwFirst: true })
}