'use strict'

const SchemaValidator = require('./schema')
const { array } = require('../checks/list')
const { assert } = require('../errors')

module.exports = class ArrayValidator extends SchemaValidator {
  constructor() {
    super()

    this.check({ ...array(), common: true })
  }

  notEmpty() {
    return this.check(array.notEmpty())
  }

  getShape() {
    return [...super.getShape() || []]
  }

  shape(shape) {
    assert(Array.isArray(shape), 'shape must be an array')

    return super.shape(shape)
  }
}