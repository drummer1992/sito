'use strict'

const GenericValidator = require('./generic')

module.exports = class SchemaValidator extends GenericValidator {
  constructor(schemaCheck) {
    super(schemaCheck)
  }

  getShapeValidator() {
    throw new Error('abstract method not call')
  }
}