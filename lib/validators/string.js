'use strict'

const GenericValidator = require('./generic')
const checks = require('./checks/list')

module.exports = class StringValidator extends GenericValidator {
  constructor() {
    super()

    this.check({ ...checks.string(), common: true })
  }

  max(length) {
    return this.check(checks.string.max(length))
  }

  min(length) {
    return this.check(checks.string.min(length))
  }

  length(length) {
    return this.check(checks.string.hasLength(length))
  }

  notEmpty() {
    return this.check(checks.string.notEmpty())
  }

  pattern(pattern) {
    return this.check(checks.string.pattern(pattern))
  }
}