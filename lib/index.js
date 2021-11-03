'use strict'

const checks = require('./checks/list')
const GenericValidator = require('./validators/generic')
const StringValidator = require('./validators/string')
const NumberValidator = require('./validators/number')
const SchemaValidator = require('./validators/schema')
const ObjectValidator = require('./validators/object')
const ArrayValidator = require('./validators/array')

const { ValidationError, BulkValidationError, GenericValidationError } = require('./errors')

exports.check = check => new GenericValidator().check(check)
exports.combine = (...validators) => new GenericValidator().combine(...validators)

exports.required = enabled => new GenericValidator().required(enabled)
exports.forbidden = enabled => new GenericValidator().forbidden(enabled)

exports.exists = enabled => new GenericValidator()
    .check({ ...checks.exists(), enabled })

exports.boolean = () => exports.check(checks.boolean())
exports.oneOf = values => exports.check(checks.oneOf(values))

exports.string = () => new StringValidator()
exports.number = () => new NumberValidator()

exports.object = schema => ObjectValidator.create(schema)
exports.array = schema => ArrayValidator.create(schema)

exports.GenericValidationError = GenericValidationError
exports.ValidationError = ValidationError
exports.BulkValidationError = BulkValidationError
exports.GenericValidator = GenericValidator
exports.StringValidator = StringValidator
exports.SchemaValidator = SchemaValidator
exports.ObjectValidator = ObjectValidator
exports.ArrayValidator = ArrayValidator
exports.NumberValidator = NumberValidator