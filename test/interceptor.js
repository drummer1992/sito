'use strict'

const { GenericValidator, object, string, number, interceptor } = require('../lib')

GenericValidator.expand({
  asWarning() {
    this.checks.extra.asWarning = true

    return this
  },
})

interceptor.register((error, options) => {
  if (options.prefix) {
    error.message = `${options.prefix} ${error.message}`
  }

  if (options.extra.asWarning) {
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
        string().required().assert(undefined, { prefix: 'OOPS.' }),
        /OOPS\. payload is required/,
    )
  })
})