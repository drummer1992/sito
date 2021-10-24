'use strict'

const Check = require('./check')
const { last } = require('../../utils/array')
const { assert } = require('../../errors')

const LIST = Symbol('list')
const COMMON = Symbol('common')

module.exports = class Checks {
  constructor() {
    this[LIST] = []
    this[COMMON] = null
  }

  add(check) {
    const instance = Check.create(check, this[COMMON])

    if (check.common) {
      assert(!this[COMMON], 'common check is already defined')

      this[COMMON] = instance
    }

    this[LIST].push(instance)
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