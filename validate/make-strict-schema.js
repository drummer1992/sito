'use strict'

const { forbidden } = require('../checks')
const { isObject } = require('../utils/predicates')
const GenericValidator = require('../validators/generic')

module.exports = (shape, data) => {
  const keys = isObject(data) ? Object.keys(data) : []

  for (const key of keys) {
    if (!shape[key]) {
      shape[key] = new GenericValidator(forbidden())
    }
  }
}