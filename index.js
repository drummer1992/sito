'use strict'

const checks = require('./lib/checks')
const GenericValidator = require('./lib/validators/generic')
const StringValidator = require('./lib/validators/string')
const NumberValidator = require('./lib/validators/number')
const SchemaValidator = require('./lib/validators/schema')
const ObjectValidator = require('./lib/validators/object')
const ArrayValidator = require('./lib/validators/array')

const { ValidationError, BulkValidationError } = require('./lib/errors')

exports.required = value => new GenericValidator().addCheck(checks.required(value))
exports.boolean = () => new GenericValidator().addCheck(checks.boolean())
exports.forbidden = () => new GenericValidator().addCheck(checks.forbidden())
exports.oneOf = values => new GenericValidator().addCheck(checks.oneOf(values))
exports.string = () => new StringValidator()
exports.number = () => new NumberValidator()

exports.object = value => ObjectValidator.create(value)
exports.array = value => ArrayValidator.create(value)

exports.ValidationError = ValidationError
exports.BulkValidationError = BulkValidationError
exports.GenericValidator = GenericValidator
exports.StringValidator = StringValidator
exports.SchemaValidator = SchemaValidator
exports.ObjectValidator = ObjectValidator
exports.ArrayValidator = ArrayValidator