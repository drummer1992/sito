'use strict'

const Checks = require('../checks')
const checks = require('../checks/list')
const { expandPrototype } = require('../utils/object')
const { assert } = require('../errors')

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

  validate(payload, customOptions = {}) {
    return require('../validation/validate')(this, payload, customOptions)
  }

  assert(payload, customOptions = {}) {
    return require('../validation/assert')(this, payload, customOptions)
  }

  assertBulk(payload, customOptions = {}) {
    return require('../validation/assert-bulk')(this, payload, customOptions)
  }

  isValid(payload) {
    return this.assert(payload).then(
        () => true,
        () => false,
    )
  }

  check({ enabled = true, optional = true, validate, message, ...rest } = {}) {
    this.checks.add({ enabled, optional, validate, message, ...rest })

    return this
  }

  combine(...validators) {
    return this.compose(...validators)
  }

  compose(...validators) {
    for (const validator of validators) {
      validator.checks.values().forEach(check => this.check(check))
    }

    return this
  }

  required(enabled = true) {
    return this.check({ ...checks.required(), enabled })
  }

  forbidden(enabled = true) {
    return this.check({ ...checks.forbidden(), enabled })
  }

  message(message) {
    const check = this.checks.last()

    assert(check, 'no one check defined')

    check.message = message

    return this
  }
}