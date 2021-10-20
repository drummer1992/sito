'use strict'

const GenericValidator = require('./generic')
const { assert } = require('../errors')
const { isEmpty, isFunction } = require('../utils/predicates')

const mightBeValidator = value => value instanceof GenericValidator || isFunction(value)

const ensureShapeIsValid = shape => {
  for (const key of Object.keys(shape)) {
    assert(mightBeValidator(shape[key]), `bad validator '${key}' provided`)
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

  static create(value) {
    const validator = new this()

    if (mightBeValidator(value)) {
      validator.of(value)
    } else if (value) {
      validator.shape(value)
    }

    return validator
  }

  of(itemValidator) {
    assert(isEmpty(this.getShape()), 'unable to use item validator if shape is already defined')
    assert(mightBeValidator(itemValidator), 'bad validator provided')

    this._of = itemValidator

    return this
  }

  shape(shape) {
    assert(!this.getItemValidator(), 'unable to use shape validation if item validator is already defined')

    ensureShapeIsValid(shape)

    this._shape = shape

    return this
  }

  getShape() {
    throw new Error('abstract method call')
  }

  getItemValidator() {
    return this._of
  }
}