'use strict'

const { required } = require('../checks')
const { last } = require('../utils/array')
const { isObject, isString, isFunction } = require('../utils/predicates')
const { assert } = require('../errors')

/**
 * @typedef {Object} ValidatorCheck
 * @property {function(path, key): String|String} message
 * @property {function(value): Boolean} validate
 */

module.exports = class GenericValidator {
  constructor() {
    const _checks = []

    Object.defineProperties(this, {
      _getChecks: {
        writable: false,
        enumerable: false,
        value: () => [..._checks],
      },
      _addCheck: {
        writable: false,
        enumerable: false,
        value: check => _checks.push(check),
      },
    })
  }

  getChecks() {
    return this._getChecks()
  }

  combine(...validators) {
    for (const validator of validators) {
      validator.getChecks().forEach(check => this.addCheck(check))
    }

    return this
  }

  /**
   * @param {ValidatorCheck} check
   * @returns {this}
   */
  addCheck(check) {
    assert(check, 'check is required')
    assert(isObject(check), 'check should be type of object')
    assert(check.message, 'check.message is required')
    assert(check.validate, 'check.validate is required')
    assert(isString(check.message) || isFunction(check.message), 'check.message should be a string or a function')
    assert(isFunction(check.validate), 'check.validate should be a function')

    this._addCheck(check)

    return this
  }

  required(value = true, message) {
    if (value) {
      this.addCheck(required(message))
    }

    return this
  }

  message(message) {
    assert(isString(message) || isFunction(message), 'message should be a string or a function')

    const validator = last(this.getChecks())

    if (validator) {
      validator.message = message
    }

    return this
  }

  /**
   * @param {*} [payload]
   * @param {ValidationOptions} [options]
   * @returns {Promise<void>}
   */
  assert(payload, options = {}) {
    return require('../validate')(this, payload, options)
  }

  /**
   * @param {*} payload
   * @param {ValidationOptions} [options]
   * @returns {Promise<BulkValidationError[]>}
   */
  async validate(payload, options = {}) {
    try {
      await this.assert(payload, { ...options, bulk: true })
    } catch (err) {
      return err.errors
    }

    return []
  }
}