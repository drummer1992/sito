'use strict'

const SchemaValidator = require('./schema')
const { object } = require('../checks')

module.exports = class ObjectValidator extends SchemaValidator {
  constructor() {
    super()

    this.addCheck(object())
  }

  notEmpty() {
    return this.addCheck(object.notEmpty())
  }

  getShape() {
    return { ...(this._shape || {}) }
  }
}