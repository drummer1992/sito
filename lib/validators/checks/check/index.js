'use strict'

const decorate = require('./decorate')
const { isObject, isString, isFunction } = require('../../../utils/predicates')
const { ValidationError, assert } = require('../../../errors')

const assertMessage = message => {
  assert(isString(message) || isFunction(message), 'message should be a string or a function')
}

const assertValidate = validate => {
  assert(isFunction(validate), 'validate should be a function')
}

const DEFAULT_ROOT_ATTRIBUTE = 'payload'

const MESSAGE = Symbol('message')
const VALIDATE = Symbol('validate')

module.exports = class Check {
  constructor(check) {
    this[MESSAGE] = check.message
    this[VALIDATE] = check.validate

    this.message = this.message.bind(this)
    this.validate = this.validate.bind(this)
  }

  static create(check, commonCheck) {
    assert(isObject(check), 'check should be type of object')

    assertMessage(check.message)
    assertValidate(check.validate)

    return new this({
      validate: decorate(check, commonCheck),
      message: check.message,
    })
  }

  message(path, value, key) {
    return typeof this[MESSAGE] === 'function'
        ? this[MESSAGE](path || DEFAULT_ROOT_ATTRIBUTE, value, key)
        : this[MESSAGE]
  }

  validate(value) {
    return this[VALIDATE](value)
  }

  async perform(path, value, key) {
    if (!await this.validate(value)) {
      const message = await this.message(path, value, key)

      return new ValidationError(message, path, value, key)
    }
  }

  setMessage(message) {
    assertMessage(message)

    this[MESSAGE] = message
  }
}