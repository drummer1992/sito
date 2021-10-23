'use strict'

const GenericValidator = require('./generic')
const checks = require('./checks/list')

module.exports = class StringValidator extends GenericValidator {
  constructor() {
    super()

    this.addCheck(checks.string(), { common: true })
  }

  max(length) {
    return this.addCheck(checks.string.max(length))
  }

  min(length) {
    return this.addCheck(checks.string.min(length))
  }

  length(length) {
    return this.addCheck(checks.string.hasLength(length))
  }

  notEmpty() {
    return this.addCheck(checks.string.notEmpty())
  }

  pattern(pattern) {
    return this.addCheck(checks.string.pattern(pattern))
  }
}