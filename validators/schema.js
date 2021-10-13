'use strict'

const GenericValidator = require('./generic')

module.exports = class SchemaValidator extends GenericValidator {
  getShapeValidator() {
    throw new Error('Method must be overridden')
  }
}