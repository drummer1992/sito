'use strict'

const SchemaValidator = require('./schema')
const { object } = require('./checks/list')
const { assert } = require('../errors')
const { isObject } = require('../utils/predicates')

module.exports = class ObjectValidator extends SchemaValidator {
  constructor() {
    super()

    this.check({ ...object(), common: true })
  }

  notEmpty() {
    return this.check(object.notEmpty())
  }

  getShape() {
    return { ...(super.getShape() || {}) }
  }

  shape(shape) {
    assert(isObject(shape), 'shape must be an object')

    return super.shape(shape)
  }
}