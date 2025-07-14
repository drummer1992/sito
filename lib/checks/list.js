'use strict'

const predicates = require('../utils/predicates')
const datePredicates = require('../utils/predicates/date')

exports.required = () => ({
  optional: false,
  validate: value => !predicates.isNil(value),
  message: path => `${path} is required`,
})

exports.forbidden = ignoreNil => ({
  optional: false,
  message: path => `${path} is forbidden attribute`,
  validate: ignoreNil ? predicates.isNil : predicates.isUndefined,
})

exports.object = () => ({
  validate: predicates.isObject,
  message: path => `${path} should be type of object`,
})

exports.object.notEmpty = () => ({
  validate: value => !predicates.isEmpty(value),
  message: path => `${path} should be a non-empty object`,
})

exports.array = () => ({
  validate: Array.isArray,
  message: path => `${path} should be type of array`,
})

exports.array.notEmpty = () => ({
  validate: value => !predicates.isEmpty(value),
  message: path => `${path} should be a non-empty array`,
})

exports.array.hasLength = n => ({
  validate: value => value.length === n,
  message: path => `${path} should have ${n} elements`,
})

exports.array.max = n => ({
  validate: value => value.length <= n,
  message: path => `${path} should have less than or equal ${n} elements`,
})

exports.array.min = n => ({
  validate: value => value.length >= n,
  message: path => `${path} should have more than or equal ${n} elements`,
})

exports.string = () => ({
  validate: value => predicates.isString(value),
  message: path => `${path} should be type of string`,
})

exports.string.pattern = pattern => ({
  validate: value => pattern.test(value),
  message: path => `${path} does not match the pattern ${pattern}`,
})

exports.string.max = length => ({
  validate: value => value.length <= length,
  message: path => `${path} should have less than or equal ${length} characters`,
})

exports.string.min = length => ({
  validate: value => value.length >= length,
  message: path => `${path} should have more than or equal ${length} characters`,
})

exports.string.notEmpty = () => ({
  validate: value => value.trim().length,
  message: path => `${path} should not be empty string`,
})

exports.string.hasLength = length => ({
  validate: value => value.length === length,
  message: path => `${path} should have ${length} characters`,
})

exports.number = () => ({
  validate: value => predicates.isNumber(value),
  message: path => `${path} should be a number`,
})

exports.number.strict = () => ({
  validate: value => typeof value === 'number',
  message: path => `${path} should be type of number`,
})

exports.number.min = n => ({
  validate: value => Number(value) >= n,
  message: path => `${path} should be greater than or equal ${n}`,
})

exports.number.max = n => ({
  validate: value => Number(value) <= n,
  message: path => `${path} should be less than or equal ${n}`,
})

exports.number.integer = () => ({
  validate: value => Number.isInteger(Number(value)),
  message: path => `${path} should be integer`,
})

exports.boolean = () => ({
  validate: value => [true, false].includes(value),
  message: path => `${path} should be type of boolean`,
})

exports.oneOf = values => ({
  validate: value => values.includes(value),
  message: path => `${path} should be one of [${values.join(', ')}]`,
})

exports.equals = expected => ({
  validate: actual => expected === actual,
  message: (path, actual) => `${path} expected to be ${expected} but received ${actual}`,
})

exports.exists = () => ({
  optional: false,
  validate: (value, key, shape) => key in (shape || {}),
  message: path => `${path} is not defined`,
})

exports.date = () => ({
  validate: value => datePredicates.isValidDate(value),
  message: key => `${key} should be valid date`,
})

exports.date.inFuture = () => ({
  validate: value => datePredicates.isInFuture(value),
  message: key => `${key} should not be in past`,
})

exports.date.inPast = () => ({
  validate: value => !datePredicates.isInFuture(value),
  message: key => `${key} should not be in future`,
})

exports.date.today = () => ({
  validate: value => datePredicates.isToday(value),
  message: key => `${key} should have today date`,
})

exports.date.before = date => ({
  validate: value => datePredicates.isBefore(value, date),
  message: key => `${key} should be before ${date}`,
})

exports.date.after = date => ({
  validate: value => datePredicates.isAfter(value, date),
  message: key => `${key} should be after ${date}`,
})