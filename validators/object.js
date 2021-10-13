'use strict'

const SchemaValidator = require('./schema')

const { object } = require('../checks')

module.exports = class ObjectValidator extends SchemaValidator {
  constructor(shape) {
    super(object())

    Object.assign(this, shape)
  }

  getShapeValidator() {
    return this
  }

  notEmpty() {
    return this.addCheck(object.notEmpty())
  }
}