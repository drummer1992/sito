'use strict'

const Checks = require('../checks')
const checks = require('../checks/list')
const { expandPrototype } = require('../utils/object')
const { isFunction } = require('../utils/predicates')
const { compact } = require('../utils/array')
const { assert } = require('../errors')
const { kChecks, kMapper } = require('../utils/symbols')

module.exports = class GenericValidator {
  constructor() {
    this[kChecks] = new Checks()
  }

  static expand(obj) {
    expandPrototype(this.prototype, obj)
  }

  get checks() {
    return this[kChecks]
  }

  get mapper() {
    return this[kMapper]
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
    for (const validator of compact(validators)) {
      this.checks.merge(validator.checks)
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

    assert(check, 'no check defined')

    check.message = message

    return this
  }

  transform(mapper, { optional = false } = {}) {
    assert(mapper, 'mapper is required')
    assert(isFunction(mapper), 'mapper should be a function')

    if (optional) {
      this[kMapper] = x => !x ? x : mapper(x)

      return this
    }

    this[kMapper] = mapper

    return this
  }

  normalize() {
    return this
  }
}