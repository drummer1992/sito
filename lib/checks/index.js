'use strict'

const Check = require('./check')
const { last } = require('../utils/array')
const { assert } = require('../errors')

const LIST = Symbol('list')
const COMMON_CHECK = Symbol('commonCheck')

module.exports = class Checks {
  constructor() {
    this[LIST] = []
    this[COMMON_CHECK] = null
  }

  async execute(params) {
    const errors = []

    for (const check of this.values()) {
      const error = await check.execute(params)

      if (error) {
        if (!params.bulk) throw error

        errors.push(error)
      }
    }

    return errors
  }

  add(check) {
    const wrappedCheck = Check.create(check, this[COMMON_CHECK])

    if (check.common) {
      assert(!this[COMMON_CHECK], 'common check is already defined')

      this[COMMON_CHECK] = wrappedCheck
    }

    this[LIST].push(wrappedCheck)
  }

  last() {
    return last(this.values())
  }

  values() {
    return [...this[LIST]]
  }
}