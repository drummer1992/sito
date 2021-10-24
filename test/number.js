'use strict'

const { number } = require('../lib')

describe('number', () => {
  it('smoke', async () => {
    assert.strictEqual(await number().isValid(10), true)
  })
})