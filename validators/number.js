'use strict'

const GenericValidator = require('./generic')
const checks = require('../checks')

module.exports = class NumberValidator extends GenericValidator {
  constructor() {
    super()

    this.addCheck(checks.number())
  }

  min(n) {
    return this.addCheck(checks.number.min(n))
  }

  max(n) {
    return this.addCheck(checks.number.max(n))
  }

  positive() {
    return this.min(0)
  }

  negative() {
    return this.max(0)
  }
}