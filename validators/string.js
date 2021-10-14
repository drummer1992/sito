'use strict'

const GenericValidator = require('./generic')
const checks = require('../checks')

module.exports = class StringValidator extends GenericValidator {
  constructor() {
    super()

    this.addCheck(checks.string())
  }

  maxLength(n) {
    return this.addCheck(checks.string.max(n))
  }

  minLength(n) {
    return this.addCheck(checks.string.minLength(n))
  }

  hasLength(n) {
    return this.addCheck(checks.string.hasLength(n))
  }

  notEmpty() {
    return this.addCheck(checks.string.notEmpty())
  }
}