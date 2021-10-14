'use strict'

const GenericValidator = require('./generic')
const { assert } = require('../errors')
const { isObject, isEmpty } = require('../utils/predicates')

const ensureShapeIsValid = shape => {
  assert(isObject(shape), 'shape should be type of object')

  for (const key of Object.keys(shape)) {
    const validatorIsValid = (shape[key] instanceof GenericValidator) || (typeof shape[key] === 'function')

    assert(validatorIsValid, `not valid validator '${key}' provided`)
  }
}

module.exports = class SchemaValidator extends GenericValidator {
  constructor() {
    super()

    Object.defineProperties(this, {
      _of: {
        enumerable: false,
        writable: true,
        configurable: false,
        value: null,
      },
      _shape: {
        value: null,
        enumerable: false,
        writable: true,
      },
    })
  }

  of(itemValidator) {
    assert(isEmpty(this._shape), 'unable to use item validator of shape is already defined')

    assert(itemValidator instanceof GenericValidator, 'item validator should be instanceof GenericValidator')

    this._of = itemValidator

    return this
  }

  shape(shape) {
    assert(!this._of, 'unable to use shape validation if item validator is already defined')

    ensureShapeIsValid(shape)

    this._shape = shape

    return this
  }
}