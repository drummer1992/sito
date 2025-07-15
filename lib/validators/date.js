'use strict'

const GenericValidator = require('./generic')
const checks = require('../checks/list')
const { parseDate } = require('../utils/date')

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

  normalize() {
    return this.transform(parseDate, { optional: true })
  }

  before(date) {
    return this.check(checks.date.before(date))
  }

  after(date) {
    return this.check(checks.date.after(date))
  }

  toJsonSchema() {
    const schema = super.toJsonSchema()

    schema.type = 'string'
    schema.format = 'date-time'

    return schema
  }
}