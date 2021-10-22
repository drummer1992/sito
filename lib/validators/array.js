'use strict'

const SchemaValidator = require('./schema')
const { array } = require('../checks')
const { assert } = require('../errors')

module.exports = class ArrayValidator extends SchemaValidator {
  constructor() {
    super()

    this.addCheck(array())
  }

  notEmpty() {
    return this.addCheck(array.notEmpty())
  }

  getShape() {
    return [...this._shape || []]
  }

  shape(shape) {
    assert(Array.isArray(shape), 'shape must be an array')

    return super.shape(shape)
  }
}