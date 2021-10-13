'use strict'

const { forbidden } = require('../checks')
const { isObject } = require('../utils/predicates')
const GenericValidator = require('../validators/generic')

module.exports = (objectValidator, data) => {
  const keys = isObject(data) ? Object.keys(data) : []

  for (const key of keys) {
    if (!objectValidator[key]) {
      objectValidator[key] = new GenericValidator(forbidden())
    }
  }
}