'use strict'

const checks = require('./checks/list')
const Checks = require('./checks')
const { expandPrototype } = require('../utils/object')

/**
 * @typedef {Object} ValidatorCheck
 * @property {function(path, value, key): String|String} message
 * @property {function(value): Boolean} validate
 * @property {Boolean} [optional = true]
 * @property {Boolean} [common = false]
 */

const CHECKS = Symbol('checks')

module.exports = class GenericValidator {
  constructor() {
    this[CHECKS] = new Checks()
  }

  /**
   * @returns {Checks}
   */
  get checks() {
    return this[CHECKS]
  }

  static expand(obj) {
    expandPrototype(this.prototype, obj)
  }

  check({ validate, message, common = false, optional = true } = {}) {
    this.checks.add({ validate, message, common, optional })

    return this
  }

  combine(...validators) {
    for (const validator of validators) {
      validator.checks.getList().forEach(check => this.check(check))
    }

    return this
  }

  required(value = true) {
    return this.check({ ...checks.required(), optional: !value })
  }

  message(message) {
    this.checks.last().setMessage(message)

    return this
  }

  assert(payload) {
    return require('./validate')(this, payload)
  }

  assertBulk(payload) {
    return require('./validate')(this, payload, { bulk: true })
  }

  /**
   * @param {*} payload
   * @returns {Promise<ValidationError[]>}
   */
  validate(payload) {
    return this.assertBulk(payload).then(() => [], e => e.errors)
  }

  isValid(payload) {
    return this.assert(payload).then(
        () => true,
        () => false,
    )
  }
}