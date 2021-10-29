'use strict'

const predicates = require('../utils/predicates')

exports.required = () => ({
  optional: false,
  validate: value => !predicates.isNil(value),
  message: path => `${path} is required`,
})

exports.forbidden = () => ({
  optional: false,
  message: path => `${path} is forbidden attribute`,
  validate: predicates.isUndefined,
})

exports.object = () => ({
  validate: predicates.isObject,
  message: path => `${path} should be type of object`,
})

exports.object.notEmpty = () => ({
  validate: value => !predicates.isEmpty(value),
  message: path => `${path} should be not empty object`,
})

exports.array = () => ({
  validate: Array.isArray,
  message: path => `${path} should be type of array`,
})

exports.array.notEmpty = () => ({
  validate: value => !predicates.isEmpty(value),
  message: path => `${path} should be not empty array`,
})

exports.string = () => ({
  validate: value => predicates.isString(value),
  message: path => `${path} should be type of string`,
})

exports.string.pattern = pattern => ({
  validate: value => pattern.test(value),
  message: path => `${path} should be type of string`,
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
  validate: value => typeof value === 'number' && predicates.isNumber(value),
  message: path => `${path} should be a number`,
})

exports.number.min = n => ({
  validate: value => Number(value) >= n,
  message: path => `${path} should be greater than or equal ${n}`,
})

exports.number.max = n => ({
  validate: value => Number(value) <= n,
  message: path => `${path} should be less than or equal ${n}`,
})

exports.boolean = () => ({
  validate: value => [true, false].includes(value),
  message: path => `${path} should be type of boolean`,
})

exports.oneOf = values => ({
  validate: value => values.includes(value),
  message: path => `${path} should be one of [${values.join(', ')}]`,
})

exports.exists = () => ({
  optional: false,
  validate: (value, key, shape) => key in (shape || {}),
  message: path => `${path} is not defined`,
})