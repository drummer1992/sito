'use strict'

const { isString, isFunction } = require('../utils/predicates')
const { toFunc } = require('../utils/function')
const { ValidationError, assert } = require('../errors')
const { kMessage, kValidate } = require('../utils/symbols')
const interceptor = require('../interceptor')

const handleError = (...args) => interceptor.run('onError', ...args)

module.exports = class Check {
  constructor(props) {
    const { message, validate, ...customProps } = props

    this.message = message
    this.validate = validate

    Object.assign(this, customProps)
  }

  async execute(params) {
    const { key, value, payload, path = 'payload' } = params

    if (!await this.validate(value, key, payload)) {
      const message = await this.message(path, value, key, payload)

      return handleError(
          new ValidationError(message, path, value, key),
          { ...params, check: this },
      )
    }
  }

  get message() {
    return this[kMessage]
  }

  set message(value) {
    assert(isString(value) || isFunction(value), 'message should be a string or a function')

    this[kMessage] = toFunc(value)
  }

  get validate() {
    return this[kValidate]
  }

  set validate(value) {
    assert(isFunction(value), 'validate should be a function')

    this[kValidate] = value
  }

  isOptional() {
    return this.optional || !this.enabled
  }
}