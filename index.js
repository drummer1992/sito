'use strict'

const checks = require('./checks')
const GenericValidator = require('./validators/generic')
const StringValidator = require('./validators/string')
const NumberValidator = require('./validators/number')
const { ObjectValidator, ArrayValidator, SchemaValidator } = require('./validators/schema')
const { ValidationError, BulkValidationError } = require('./errors')

exports.boolean = () => new GenericValidator(checks.boolean())
exports.required = () => new GenericValidator(checks.required())
exports.forbidden = () => new GenericValidator(checks.forbidden())
exports.oneOf = values => new GenericValidator(checks.oneOf(values))
exports.object = shape => new ObjectValidator(shape)
exports.array = validator => new ArrayValidator(validator)
exports.string = () => new StringValidator()
exports.number = () => new NumberValidator()

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