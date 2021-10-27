'use strict'

const decorate = require('./decorate')
const { isObject, isString, isFunction } = require('../../utils/predicates')
const { toFunc } = require('../../utils/function')
const { ValidationError, assert } = require('../../errors')

const DEFAULT_ROOT = 'payload'
const MESSAGE = Symbol('message')
const VALIDATE = Symbol('validate')

module.exports = class Check {
  constructor(check) {
    this.message = check.message
    this.validate = check.validate
  }

  static create(check, commonCheck) {
    assert(isObject(check), 'check should be an object')

    return new this({
      validate: decorate(check, commonCheck),
      message: check.message,
    })
  }

  async execute({ key, value, payload, path = DEFAULT_ROOT }) {
    if (!await this.validate(value, key, payload)) {
      const message = await this.message(path, value, key, payload)

      return new ValidationError(message, path, value, key)
    }
  }

  get message() {
    return this[MESSAGE]
  }

  set message(value) {
    assert(isString(value) || isFunction(value), 'message should be a string or a function')

    this[MESSAGE] = toFunc(value)
  }

  get validate() {
    return this[VALIDATE]
  }

  set validate(value) {
    assert(isFunction(value), 'validate should be a function')

    this[VALIDATE] = value
  }
}