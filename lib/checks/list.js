'use strict'

const predicates = require('../utils/predicates')

exports.required = () => ({
  validate: value => !predicates.isNil(value),
  message: key => `${key} is required`,
})

exports.forbidden = () => ({
  message: key => `${key} is forbidden attribute`,
  validate: predicates.isUndefined,
})

exports.object = () => ({
  validate: predicates.isObject,
  message: key => `${key} should be type of object`,
})

exports.object.notEmpty = () => ({
  validate: value => !predicates.isEmpty(value),
  message: key => `${key} should be not empty object`,
})

exports.array = () => ({
  validate: Array.isArray,
  message: key => `${key} should be type of array`,
})

exports.array.notEmpty = () => ({
  validate: value => !predicates.isEmpty(value),
  message: key => `${key} should be not empty array`,
})

exports.string = () => ({
  validate: predicates.isString,
  message: key => `${key} should be type of string`,
})

exports.string.pattern = pattern => ({
  validate: value => pattern.test(value),
  message: key => `${key} should be type of string`,
})

exports.string.max = length => ({
  validate: value => value.length <= length,
  message: key => `${key} should have less than or equal ${length} characters`,
})

exports.string.min = length => ({
  validate: value => value.length <= length,
  message: key => `${key} should have more than or equal ${length} characters`,
})

exports.string.notEmpty = () => ({
  validate: value => value.trim().length,
  message: key => `${key} should not be empty string`,
})

exports.string.hasLength = length => ({
  validate: value => value.length === length,
  message: key => `${key} should have ${length} characters`,
})

exports.number = () => ({
  validate: value => typeof value === 'number' && predicates.isNumber(value),
  message: key => `${key} should be a number`,
})

exports.number.min = n => ({
  validate: value => Number(value) >= n,
  message: key => `${key} should be greater than or equal ${n}`,
})

exports.number.max = n => ({
  validate: value => Number(value) <= n,
  message: key => `${key} should be less than or equal ${n}`,
})

exports.boolean = () => ({
  validate: value => [true, false].includes(value),
  message: key => `${key} should be type of boolean`,
})

exports.oneOf = values => ({
  validate: value => values.includes(value),
  message: key => `${key} should be one of [${values.join(', ')}]`,
})