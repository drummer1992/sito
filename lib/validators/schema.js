'use strict'

const GenericValidator = require('./generic')
const resolve = require('../utils/resolve')
const { assert } = require('../errors')
const { isEmpty, isFunction } = require('../utils/predicates')

const mightBeValidator = value => value instanceof GenericValidator || isFunction(value)

const ensureShapeIsValid = shape => {
  for (const key of Object.keys(shape)) {
    assert(mightBeValidator(shape[key]), `bad validator '${key}' provided`)
  }
}

const OF = Symbol('of')
const SHAPE = Symbol('shape')
const IS_STRICT = Symbol('isStrict')

module.exports = class SchemaValidator extends GenericValidator {
  constructor() {
    super()

    this[OF] = null
    this[SHAPE] = null
    this[IS_STRICT] = false
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

  static async validate(params) {
    const errors = await super.validate(params)

    const value = resolve.value(params.key, params.payload)
    const validator = resolve.validator(params.validator, value, params.key, params.payload)
    const shape = resolve.shape(validator, value)

    for (const key of Object.keys(shape)) {
      const Validator = resolve.constructor(shape[key], value, params.key, params.payload)

      const schemaErrors = await Validator.validate({
        payload: value,
        validator: shape[key],
        path: resolve.path(params.path, key, validator),
        key: resolve.key(key, validator),
        bulk: params.bulk,
      })

      errors.push(...schemaErrors)
    }

    return errors
  }

  isStrict() {
    return this[IS_STRICT]
  }

  strict(value = true) {
    this[IS_STRICT] = value

    return this
  }

  of(itemValidator) {
    assert(isEmpty(this.getShape()), 'unable to use item validator if shape is already defined')
    assert(mightBeValidator(itemValidator), 'bad validator provided')

    this[OF] = itemValidator

    return this
  }

  shape(shape) {
    assert(!this.getItemValidator(), 'unable to use shape validation if item validator is already defined')

    ensureShapeIsValid(shape)

    this[SHAPE] = Object.assign(this.getShape(), shape)

    return this
  }

  getShape() {
    return this[SHAPE]
  }

  getItemValidator() {
    return this[OF]
  }
}