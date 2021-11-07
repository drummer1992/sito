'use strict'

const Check = require('./check')
const { last } = require('../utils/array')
const { assert } = require('../errors')
const { intercept } = require('../interceptor')
const { isObject } = require('../utils/predicates')
const resolve = require('../utils/resolve')

const LIST = Symbol('list')
const COMMON_CHECK = Symbol('commonCheck')

module.exports = class Checks {
  constructor() {
    this.extra = {}

    this[LIST] = []
    this[COMMON_CHECK] = null
  }

  async execute(params) {
    const errors = []

    for (const check of this.values()) {
      const error = intercept(await check.execute(params), this.extra)

      if (error) {
        if (!params.bulk) throw error

        errors.push(error)
      }
    }

    return errors
  }

  add(checkDto) {
    assert(isObject(checkDto), 'check should be an object')

    const check = new Check({
      validate: resolve.validate(checkDto, this[COMMON_CHECK]),
      message: checkDto.message,
    })

    if (checkDto.common) {
      assert(!this[COMMON_CHECK], 'common check is already defined')

      this[COMMON_CHECK] = check
    }

    this[LIST].push(check)
  }

  last() {
    return last(this.values())
  }

  values() {
    return [...this[LIST]]
  }
}