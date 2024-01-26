'use strict'

const checks = require('./checks/list')
const interceptor = require('./interceptor')
const GenericValidator = require('./validators/generic')
const StringValidator = require('./validators/string')
const NumberValidator = require('./validators/number')
const SchemaValidator = require('./validators/schema')
const ObjectValidator = require('./validators/object')
const ArrayValidator = require('./validators/array')
const DateValidator = require('./validators/date')
const BooleanValidator = require('./validators/boolean')

const { ValidationError, BulkValidationError, GenericValidationError } = require('./errors')

exports.check = check => new GenericValidator().check(check)

const compose = (...validators) => new GenericValidator().compose(...validators)

exports.combine = compose
exports.compose = compose

exports.required = enabled => new GenericValidator().required(enabled)
exports.forbidden = (enabled, ignoreEmpty) => new GenericValidator().forbidden(enabled, ignoreEmpty)
exports.exists = enabled => new GenericValidator().check({ ...checks.exists(), enabled })

exports.boolean = () => new BooleanValidator()
exports.oneOf = values => exports.check(checks.oneOf(values))

exports.string = () => new StringValidator()
exports.number = () => new NumberValidator()
exports.date = () => new DateValidator()

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
exports.DateValidator = DateValidator

exports.validate = require('./validation/validate')
exports.assert = require('./validation/assert')
exports.assertBulk = require('./validation/assert-bulk')

exports.interceptor = {
  onError: fn => interceptor.set('onError', fn),
  onBulkError: fn => interceptor.set('onBulkError', fn),
}