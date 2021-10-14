'use strict'

const SchemaValidator = require('./schema')
const GenericValidator = require('./generic')
const { object } = require('../checks')
const { assert } = require('../errors')
const { isObject } = require('../utils/predicates')

const ensureShapeIsValid = shape => {
  assert(isObject(shape), 'shape should be type of object')

  for (const key of Object.keys(shape)) {
    const validatorIsValid = (shape[key] instanceof GenericValidator) || (typeof shape[key] === 'function')

    assert(validatorIsValid, `not valid validator '${key}' provided`)
  }
}

module.exports = class ObjectValidator extends SchemaValidator {
  constructor() {
    super()

    this.addCheck(object())

    Object.defineProperty(this, '_shape', {
      value: {},
      enumerable: false,
      writable: true,
    })
  }

  notEmpty() {
    return this.addCheck(object.notEmpty())
  }

  shape(shape) {
    ensureShapeIsValid(shape)

    this._shape = shape

    return this
  }
}