'use strict'

const checks = require('./validators/checks/list')
const GenericValidator = require('./validators/generic')
const StringValidator = require('./validators/string')
const NumberValidator = require('./validators/number')
const SchemaValidator = require('./validators/schema')
const ObjectValidator = require('./validators/object')
const ArrayValidator = require('./validators/array')

const { ValidationError, BulkValidationError } = require('./errors')

exports.required = (value = true) => new GenericValidator()
    .addCheck(checks.required(), { optional: !value })

exports.forbidden = (value = true) => new GenericValidator()
    .addCheck(checks.forbidden(), { optional: !value })

exports.boolean = () => new GenericValidator().addCheck(checks.boolean())
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