'use strict'

const GenericValidator = require('./generic')
const checks = require('../checks/list')
const { toBoolean } = require('../utils/boolean')

module.exports = class BooleanValidator extends GenericValidator {
  constructor() {
    super()

    this.check({ ...checks.boolean(), common: true })
  }

  normalize() {
    return this.transform(toBoolean, { optional: true })
  }
}