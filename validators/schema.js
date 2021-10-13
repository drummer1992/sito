'use strict'

const GenericValidator = require('./generic')
const { object, array, notEmpty } = require('../checks')

class SchemaValidator extends GenericValidator {
  constructor(schemaCheck) {
    super(schemaCheck)
  }

  notEmpty() {
    return this.addCheck(notEmpty())
  }

  getShapeValidator() {
    throw new Error('abstract method not call')
  }
}

class ObjectValidator extends SchemaValidator {
  constructor(shape) {
    super(object())

    Object.assign(this, shape)
  }

  getShapeValidator() {
    return this
  }
}

class ArrayValidator extends SchemaValidator {
  constructor(itemsValidator = new GenericValidator()) {
    super(array())

    this.itemsValidator = itemsValidator
  }

  getShapeValidator() {
    return this.itemsValidator
  }
}

module.exports = { ObjectValidator, ArrayValidator, SchemaValidator }