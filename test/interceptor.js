'use strict'

const { GenericValidator, object, string, number } = require('../lib')
const interceptor = require('../lib/interceptor')

GenericValidator.expand({
  asWarning() {
    this.checks.extra.asWarning = true

    return this
  },
})

interceptor.register((error, extra) => {
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
})