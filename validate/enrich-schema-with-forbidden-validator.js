'use strict'

const { isObject } = require('../utils/predicates')
const { forbidden } = require('../index')

module.exports = (shape, data) => {
  const keys = (isObject(data) || Array.isArray(data)) ? Object.keys(data) : []

  for (const key of keys) {
    if (!shape[key]) {
      shape[key] = forbidden()
    }
  }
}