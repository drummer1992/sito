'use strict'

const SchemaValidator = require('./schema')
const GenericValidator = require('./generic')

const { array } = require('../checks')

module.exports = class ArrayValidator extends SchemaValidator {
  constructor() {
    super(array())

    this._of = new GenericValidator()
  }

  notEmpty() {
    return this.addCheck(array.notEmpty())
  }

  of(validator) {
    this._of = validator

    return this
  }
}