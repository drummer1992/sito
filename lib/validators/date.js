'use strict'

const GenericValidator = require('./generic')
const checks = require('../checks/list')

module.exports = class DateValidator extends GenericValidator {
  constructor() {
    super()

    this.check({ ...checks.date(), common: true })
  }

  inFuture() {
    return this.check(checks.date.inFuture())
  }

  inPast() {
    return this.check(checks.date.inPast())
  }

  today() {
    return this.check(checks.date.today())
  }
}