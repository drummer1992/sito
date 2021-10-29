'use strict'

const Checks = require('../checks')
const checks = require('../checks/list')
const { expandPrototype } = require('../utils/object')
const { assert, BulkValidationError } = require('../errors')

const validate = params => require('../validate')(params)

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

  validate(payload) {
    return validate({
      payload,
      validator: this,
      bulk: true,
    })
  }

  async assert(payload) {
    await validate({
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