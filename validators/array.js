'use strict'

const SchemaValidator = require('./schema')
const GenericValidator = require('./generic')
const { assert } = require('../errors')
const { array } = require('../checks')

module.exports = class ArrayValidator extends SchemaValidator {
  constructor() {
    super()

    this.addCheck(array())

    Object.defineProperty(this, '_of', {
      enumerable: false,
      writable: true,
      configurable: false,
      value: new GenericValidator(),
    })
  }

  notEmpty() {
    return this.addCheck(array.notEmpty())
  }

  of(itemValidator) {
    assert(
        itemValidator instanceof GenericValidator,
        'item validator should be instanceof GenericValidator',
    )

    this._of = itemValidator

    return this
  }
}