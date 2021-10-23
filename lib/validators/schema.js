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

const ofKey = Symbol('of')
const shapeKey = Symbol('shape')
const isStrictKey = Symbol('isStrict')

module.exports = class SchemaValidator extends GenericValidator {
  constructor() {
    super()

    this[ofKey] = null
    this[shapeKey] = null
    this[isStrictKey] = false
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

  isStrict() {
    return this[isStrictKey]
  }

  strict(value = true) {
    this[isStrictKey] = value

    return this
  }

  of(itemValidator) {
    assert(isEmpty(this.getShape()), 'unable to use item validator if shape is already defined')
    assert(mightBeValidator(itemValidator), 'bad validator provided')

    this[ofKey] = itemValidator

    return this
  }

  shape(shape) {
    assert(!this.getItemValidator(), 'unable to use shape validation if item validator is already defined')

    ensureShapeIsValid(shape)

    this[shapeKey] = shape

    return this
  }

  getShape() {
    return this[shapeKey]
  }

  getItemValidator() {
    return this[ofKey]
  }
}