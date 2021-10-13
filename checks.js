'use strict'

const predicates = require('./utils/predicates')

exports.required = () => ({
  force: true,
  validate: value => !predicates.isNil(value),
  message: key => `${key} is required`,
})

exports.forbidden = () => ({
  force: true,
  message: key => `${key} is forbidden value`,
  validate: predicates.isUndefined,
})

exports.notEmpty = () => ({
  validate: value => !predicates.isEmpty(value),
  message: key => `${key} should not be empty`,
})

exports.object = () => ({
  validate: predicates.isObject,
  message: key => `${key} should be type of object`,
})

exports.array = () => ({
  validate: Array.isArray,
  message: key => `${key} should be type of array`,
})

exports.string = () => ({
  validate: predicates.isString,
  message: key => `${key} should be type of string`,
})

exports.string.maxLength = length => ({
  validate: value => value.length <= length,
  message: key => `${key} should have less than or equal ${length} characters`,
})

exports.string.minLength = length => ({
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
  validate: predicates.isNumber,
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

exports.number.checkType = () => ({
  validate: value => typeof value === 'number',
  message: key => `${key} should be type of number`,
})

exports.boolean = () => ({
  validate: value => [true, false].includes(value),
  message: key => `${key} should be type of boolean`,
})

exports.oneOf = values => ({
  validate: value => values.includes(value),
  message: key => `${key} should be one of [${values.join(', ')}]`,
})