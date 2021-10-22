'use strict'

const SchemaValidator = require('./schema')
const { object } = require('../checks')
const { assert } = require('../errors')
const { isObject } = require('../utils/predicates')

module.exports = class ObjectValidator extends SchemaValidator {
  constructor() {
    super()

    this.addCheck(object())
  }

  notEmpty() {
    return this.addCheck(object.notEmpty())
  }

  getShape() {
    return { ...(this._shape || {}) }
  }

  shape(shape) {
    assert(isObject(shape), 'shape must be an object')

    return super.shape(shape)
  }
}