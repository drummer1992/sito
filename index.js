'use strict'

const checks = require('./checks')
const GenericValidator = require('./validators/generic')
const StringValidator = require('./validators/string')
const NumberValidator = require('./validators/number')
const SchemaValidator = require('./validators/schema')
const ObjectValidator = require('./validators/object')
const ArrayValidator = require('./validators/array')

const { ValidationError, BulkValidationError } = require('./errors')

exports.boolean = () => new GenericValidator().addCheck(checks.boolean())
exports.required = () => new GenericValidator().addCheck(checks.required())
exports.forbidden = () => new GenericValidator().addCheck(checks.forbidden())
exports.oneOf = values => new GenericValidator().addCheck(checks.oneOf(values))
exports.string = () => new StringValidator()
exports.number = () => new NumberValidator()

exports.object = shape => {
  const validator = new ObjectValidator()

  if (shape) {
    validator.shape(shape)
  }

  return validator
}

exports.map = itemValidator => exports.object().of(itemValidator)

exports.array = itemValidator => {
  const arrayValidator = new ArrayValidator()

  if (itemValidator) {
    arrayValidator.of(itemValidator)
  }

  return arrayValidator
}

exports.Error = {
  ValidationError,
  BulkValidationError,
}

exports.Validator = {
  GenericValidator,
  StringValidator,
  SchemaValidator,
  ObjectValidator,
  ArrayValidator,
}