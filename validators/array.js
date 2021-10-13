'use strict'

const SchemaValidator = require('./schema')
const GenericValidator = require('./generic')

const { array } = require('../checks')

module.exports = class ArrayValidator extends SchemaValidator {
  constructor(itemsValidator = new GenericValidator()) {
    super(array())

    this.itemsValidator = itemsValidator
  }

  getShapeValidator() {
    return this.itemsValidator
  }

  notEmpty() {
    return this.addCheck(array.notEmpty())
  }
}