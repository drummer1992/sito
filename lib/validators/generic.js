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

  static expand(obj) {
    Object.assign(this.prototype, obj)
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

  required(value) {
    return this.addCheck(required(value))
  }

  message(message) {
    assert(isString(message) || isFunction(message), 'message should be a string or a function')

    const check = last(this.getChecks())

    assert(check, 'no one check defined')

    check.message = message

    return this
  }

  assert(payload) {
    return require('../validate')(this, payload)
  }

  assertBulk(payload) {
    return require('../validate')(this, payload, { bulk: true })
  }

  /**
   * @param {*} payload
   * @returns {Promise<ValidationError[]>}
   */
  async validate(payload) {
    try {
      await this.assert(payload, { bulk: true })
    } catch (err) {
      return err.errors
    }

    return []
  }

  isValid(payload) {
    return this.assert(payload).then(
        () => true,
        () => false,
    )
  }
}