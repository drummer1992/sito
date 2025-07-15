'use strict'

const GenericValidator = require('./generic')
const checks = require('../checks/list')

module.exports = class NumberValidator extends GenericValidator {
  constructor() {
    super()

    this.check({ ...checks.number(), common: true })
  }

  min(n) {
    return this.check(checks.number.min(n))
  }

  max(n) {
    return this.check(checks.number.max(n))
  }

  integer() {
    return this.check(checks.number.integer())
  }

  positive() {
    return this.min(0)
  }

  negative() {
    return this.max(0)
  }

  strict(enabled = true) {
    return this.check({ ...checks.number.strict(), enabled })
  }

  normalize() {
    return this.transform(Number, { optional: true })
  }

  toJsonSchema(options = {}) {
    const schema = super.toJsonSchema(options)

    schema.type = 'number'

    return schema
  }
}
