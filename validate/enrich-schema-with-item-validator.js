'use strict'

const { isObject } = require('../utils/predicates')

module.exports = (shape, validator, data) => {
  const keys = (isObject(data) || Array.isArray(data)) ? Object.keys(data) : []

  for (const key of keys) {
    shape[key] = validator
  }
}