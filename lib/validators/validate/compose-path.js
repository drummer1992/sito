'use strict'

const ArrayValidator = require('../array')
const { compact } = require('../../utils/array')

module.exports = (path, attribute, validator) => {
  const isArray = validator instanceof ArrayValidator
  const key = isArray ? `[${attribute}]` : attribute
  const separator = isArray ? '' : '.'

  return compact([path, key]).join(separator)
}