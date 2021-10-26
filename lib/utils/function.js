'use strict'

exports.and = (...predicates) => async (...args) => {
  for (const predicate of predicates) {
    const ok = await predicate(...args)

    if (!ok) {
      return false
    }
  }

  return true
}

exports.toFunc = value => typeof value === 'function' ? value : () => value