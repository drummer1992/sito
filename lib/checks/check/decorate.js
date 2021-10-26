'use strict'

const { isNil } = require('../../utils/predicates')
const { and } = require('../../utils/function')

const makeOptional = validate => value => {
  if (isNil(value)) {
    return true
  }

  return validate(value)
}

const disabled = () => true

module.exports = (check, commonCheck) => {
  const { enabled = true, optional = true } = check

  if (!enabled) {
    return disabled
  }

  let validate = check.validate

  if (optional) {
    if (commonCheck) {
      validate = and(commonCheck.validate, validate)
    }

    validate = makeOptional(validate)
  }

  return validate
}