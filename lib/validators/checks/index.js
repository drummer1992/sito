'use strict'

const Check = require('./check')
const { last } = require('../../utils/array')
const { assert } = require('../../errors')

const LIST = Symbol('list')
const COMMON_CHECK = Symbol('commonCheck')

module.exports = class Checks {
  constructor() {
    this[LIST] = []
    this[COMMON_CHECK] = null
  }

  add(check) {
    const wrappedCheck = Check.create(check, this[COMMON_CHECK])

    if (check.common) {
      assert(!this[COMMON_CHECK], 'common check is already defined')

      this[COMMON_CHECK] = wrappedCheck
    }

    this[LIST].push(wrappedCheck)
  }

  async execute(value, key, path, bulk) {
    const errors = []

    for (const check of this.getList()) {
      const error = await check.perform(path, value, key)

      if (error) {
        if (!bulk) {
          throw error
        }

        errors.push(error)
      }
    }

    return errors
  }

  /**
   * @returns {Check[]}
   */
  getList() {
    return [...this[LIST]]
  }

  /**
   * @returns {Check}
   */
  last() {
    const check = last(this.getList())

    assert(check, 'no one check defined')

    return check
  }
}