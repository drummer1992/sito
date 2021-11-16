'use strict'

const Check = require('./check')
const { last } = require('../utils/array')
const { assert } = require('../errors')
const { isObject } = require('../utils/predicates')
const resolve = require('../utils/resolve')
const { kList, kCommonCheck } = require('../utils/symbols')

module.exports = class Checks {
  constructor() {
    this[kList] = []
    this[kCommonCheck] = null
  }

  async execute(params) {
    const errors = []

    for (const check of this.values()) {
      const error = await check.execute(params)

      if (error) {
        if (params.throwFirst) throw error

        errors.push(error)
      }
    }

    return errors
  }

  add(checkDto) {
    assert(isObject(checkDto), 'check should be an object')

    const check = new Check({
      ...checkDto,
      validate: resolve.validate(checkDto, this[kCommonCheck]),
    })

    if (checkDto.common) {
      assert(!this[kCommonCheck], 'common check is already defined')

      this[kCommonCheck] = check
    }

    this[kList].push(check)
  }

  merge(checks) {
    this[kList].push(...checks.values())
  }

  last() {
    return last(this.values())
  }

  values() {
    return [...this[kList]]
  }

  areOptional() {
    return this.values().every(check => check.isOptional())
  }
}