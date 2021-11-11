'use strict'

const { GenericValidator, object, string, number } = require('../lib')
const interceptor = require('../lib/interceptor')
const validate = require('../lib/validate')

GenericValidator.expand({
  asWarning() {
    this.checks.extra.asWarning = true

    return this
  },
})

interceptor.register((error, extra) => {
  if (extra.prefix) {
    error.message = `${extra.prefix} ${error.message}`
  }

  if (extra.asWarning) {
    return console.warn(error)
  }

  return error
})

describe('interceptor', () => {
  it('asWarning functionality', async () => {
    const schema = object({
      name: string().required().asWarning(),
      age: number().required().asWarning(),
    }).required()

    await schema.assert({ name: 5, age: '23' })
  })

  it('prefix functionality', () => {
    return assert.rejects(
        validate({
          payload: null,
          validator: string().required(),
          prefix: 'OOPS.',
        }),
        /OOPS\. payload is required/,
    )
  })
})