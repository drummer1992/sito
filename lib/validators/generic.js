'use strict'

const Checks = require('../checks')
const checks = require('../checks/list')
const resolve = require('../utils/resolve')
const { expandPrototype } = require('../utils/object')
const { assert, BulkValidationError } = require('../errors')

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

  static expand(obj) {
    expandPrototype(this.prototype, obj)
  }

  get checks() {
    return this[CHECKS]
  }

  static validate(params) {
    const value = resolve.value(params.key, params.payload)
    const validator = resolve.validator(params.validator, value, params.key, params.payload)

    return validator.checks.execute(value, params.key, params.path, params.bulk)
  }

  validate(payload) {
    return this.constructor.validate({
      payload,
      validator: this,
      bulk: true,
    })
  }

  async assert(payload) {
    await this.constructor.validate({
      payload,
      validator: this,
      bulk: false,
    })
  }

  async assertBulk(payload) {
    const errors = await this.validate(payload)

    if (errors.length) {
      throw new BulkValidationError(errors)
    }
  }

  isValid(payload) {
    return this.assert(payload).then(
        () => true,
        () => false,
    )
  }

  check(check) {
    this.checks.add(check)

    return this
  }

  combine(...validators) {
    for (const validator of validators) {
      validator.checks.values().forEach(check => this.check(check))
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

    assert(check, 'no one check defined')

    check.message = message

    return this
  }
}