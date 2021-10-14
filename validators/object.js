'use strict'

const SchemaValidator = require('./schema')

const { object } = require('../checks')

module.exports = class ObjectValidator extends SchemaValidator {
  constructor() {
    super(object())

    this._shape = {}
  }

  notEmpty() {
    return this.addCheck(object.notEmpty())
  }

  shape(shape) {
    this._shape = shape

    return this
  }
}