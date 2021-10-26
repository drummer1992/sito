'use strict'

const checks = require('./checks/list')
const Checks = require('./checks')
const { expandPrototype } = require('../utils/object')

/**
 * @typedef {Object} CheckData
 * @property {function(path, value, key): String|String} message
 * @property {function(value): Boolean} validate
 * @property {Boolean} [optional = true]
 * @property {Boolean} [enabled = true]
 * @property {Boolean} [common = false]
 */

const CHECKS = Symbol('checks')

module.exports = class GenericValidator {
  constructor() {
    this[CHECKS] = new Checks()
  }

  get checks() {
    return this[CHECKS]
  }

  static expand(obj) {
    expandPrototype(this.prototype, obj)
  }

  check(check) {
    this.checks.add(check)

    return this
  }

  combine(...validators) {
    for (const validator of validators) {
      validator.checks.getList().forEach(check => this.check(check))
    }

    return this
  }

  required(isRequired = true) {
    return this.check({ ...checks.required(), optional: false, enabled: isRequired })
  }

  forbidden(isForbidden = true) {
    return this.check({ ...checks.forbidden(), optional: false, enabled: isForbidden })
  }

  message(message) {
    const check = this.checks.last()

    check.message = message

    return this
  }

  assert(payload) {
    return require('./validate')(this, payload)
  }

  assertBulk(payload) {
    return require('./validate')(this, payload, { bulk: true })
  }

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