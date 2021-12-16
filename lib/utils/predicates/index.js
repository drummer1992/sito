'use strict'

exports.isUndefined = value => value === undefined
exports.isNil = value => value == null
exports.isPrimitive = value => value !== Object(value)
exports.isObject = obj => (obj === Object(obj)) && !Array.isArray(obj)
exports.isNumber = value => value !== null && value !== '' && !isNaN(value)
exports.isString = value => typeof value === 'string'
exports.isFunction = value => typeof value === 'function'

exports.isEmpty = value => {
  const array = []

  if (exports.isObject(value) || Array.isArray(value)) {
    array.push(...Object.keys(value))
  }

  return !array.length
}

