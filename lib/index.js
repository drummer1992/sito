'use strict'

const checks = require('./validators/checks/list')
const GenericValidator = require('./validators/generic')
const StringValidator = require('./validators/string')
const NumberValidator = require('./validators/number')
const SchemaValidator = require('./validators/schema')
const ObjectValidator = require('./validators/object')
const ArrayValidator = require('./validators/array')

const { ValidationError, BulkValidationError } = require('./errors')

/**
 * @param {CheckData} check
 * @returns {GenericValidator}
 */
exports.check = check => new GenericValidator().check(check)

exports.required = isRequired => new GenericValidator().required(isRequired)
exports.forbidden = isForbidden => new GenericValidator().forbidden(isForbidden)

exports.boolean = () => exports.check(checks.boolean())
exports.oneOf = values => exports.check(checks.oneOf(values))

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
exports.NumberValidator = NumberValidator