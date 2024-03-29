'use strict'

const { number } = require('../lib')

describe('number', () => {
  it('smoke', async () => {
    assert.strictEqual(await number().isValid(10), true)
    assert.strictEqual(await number().isValid('10'), true)
    assert.strictEqual(await number().isValid('10a'), false)
    assert.strictEqual(await number().strict().isValid('10'), false)
    assert.strictEqual(await number().integer().isValid(11.4), false)
    assert.strictEqual(await number().strict().integer().isValid(11.4), false)
    assert.strictEqual(await number().integer().isValid('11'), true)
    assert.strictEqual(await number().strict().integer().isValid(11), true)
    assert.strictEqual(await number().negative().integer().isValid(10), false)
    assert.strictEqual(await number().positive().integer().isValid(10), true)
  })
})