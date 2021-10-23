'use strict'

const { isObject, isString, isFunction, isNil } = require('../utils/predicates')
const { last } = require('../utils/array')
const { and } = require('../utils/function')
const { ValidationError, assert } = require('../errors')

const DEFAULT_ROOT_ATTRIBUTE = 'payload'

const composeMessage = (message, path, value, key) => typeof message === 'function'
    ? message(path || DEFAULT_ROOT_ATTRIBUTE, value, key)
    : message

const makeOptional = validate => value => {
  if (isNil(value)) {
    return true
  }

  return validate(value)
}

const assertMessage = message => {
  assert(isString(message) || isFunction(message), 'message should be a string or a function')
}

const assertValidate = validate => {
  assert(isFunction(validate), 'validate should be a function')
}

class Check {
  constructor(check, optional) {
    this.message = check.message
    this.validate = optional ? makeOptional(check.validate) : check.validate
  }

  static create(check, optional) {
    assert(isObject(check), 'check should be type of object')

    assertMessage(check.message)
    assertValidate(check.validate)

    return new this(check, optional)
  }

  setMessage(message) {
    assertMessage(message)

    this.message = message
  }
}

const listKey = Symbol('list')

module.exports = class Checks {
  constructor() {
    this[listKey] = []

    /**
     * @type {Check}
     */
    this.common = undefined
  }

  add(check, { optional = true, common = false } = {}) {
    const instance = Check.create(check, optional)

    if (this.common) {
      instance.validate = and(this.common.validate, instance.validate)
    }

    if (common) {
      assert(!this.common, 'common check is already defined')

      this.common = instance
    }

    this[listKey].push(instance)
  }

  async run(params) {
    const errors = []

    for (const check of this.getList()) {
      const error = await this.runOne(check, params)

      if (error) {
        if (!params.bulk) {
          throw error
        }

        errors.push(error)
      }
    }

    return errors
  }

  async runOne(check, params) {
    const { path, value, key } = params

    if (!await check.validate(value)) {
      const message = await composeMessage(check.message, path, value, key)

      return new ValidationError(message, path, value, key)
    }
  }

  /**
   * @returns {Check[]}
   */
  getList() {
    return [...this[listKey]]
  }

  /**
   * @returns {Check}
   */
  last() {
    const check = last(this.getList())

    assert(check, 'no one check defined')

    return check
  }
}