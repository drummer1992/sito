'use strict'

const { required } = require('../checks')
const { last, toArray, compact } = require('../utils/array')
const assert = require('assert')

/**
 * @typedef {Object} ValidatorCheck
 * @property {Function|String} message
 * @property {Function} validate
 */

module.exports = class GenericValidator {
  /**
   * @param {ValidatorCheck|ValidatorCheck[]} [checks]
   */
  constructor(checks) {
    const _checks = compact(toArray(checks))

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
   * @returns {GenericValidator}
   */
  addCheck(check) {
    assert(check, 'check is required')

    this._addCheck(check)

    return this
  }

  required(value = true) {
    if (value) {
      this.addCheck(required())
    }

    return this
  }

  message(message) {
    assert(message, 'message is required')

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