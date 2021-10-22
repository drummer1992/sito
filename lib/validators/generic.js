'use strict'

const { required } = require('../checks/list')
const Checks = require('../checks')

/**
 * @typedef {Object} ValidatorCheck
 * @property {function(path, key): String|String} message
 * @property {function(value): Boolean} validate
 */

module.exports = class GenericValidator {
  constructor() {
    this.checks = new Checks()
  }

  static expand(obj) {
    Object.assign(this.prototype, obj)
  }

  addCheck(check, { force, main } = {}) {
    this.checks.add(check, { force, main })

    return this
  }

  combine(...validators) {
    for (const validator of validators) {
      validator.checks.getList().forEach(check => this.addCheck(check))
    }

    return this
  }

  required(value = true) {
    return this.addCheck(required(), { force: value })
  }

  message(message) {
    this.checks.last().setMessage(message)

    return this
  }

  assert(payload) {
    return require('../validate')(this, payload)
  }

  assertBulk(payload) {
    return require('../validate')(this, payload, { bulk: true })
  }

  /**
   * @param {*} payload
   * @returns {Promise<ValidationError[]>}
   */
  async validate(payload) {
    try {
      await this.assert(payload, { bulk: true })
    } catch (err) {
      return err.errors
    }

    return []
  }

  isValid(payload) {
    return this.assert(payload).then(
        () => true,
        () => false,
    )
  }
}