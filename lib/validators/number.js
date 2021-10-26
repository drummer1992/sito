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

  positive() {
    return this.min(0)
  }

  negative() {
    return this.max(0)
  }
}