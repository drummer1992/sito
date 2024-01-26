'use strict'

const { date } = require('../lib')

describe('date', () => {
  it('smoke', async () => {
    assert.strictEqual(await date().isValid(Date.now()), true)
    assert.strictEqual(await date().isValid({}), false)
    assert.strictEqual(await date().today().isValid(Date.now()), true)
    assert.strictEqual(await date().today().isValid(1), false)
    assert.strictEqual(await date().inFuture().isValid(1), false)
    assert.strictEqual(await date().inFuture().isValid(Date.now()), false)
    assert.strictEqual(await date().inFuture().isValid(Date.now() + 1000), true)
    assert.strictEqual(await date().inPast().isValid(Date.now()), true)
    assert.strictEqual(await date().inPast().isValid(Date.now() - 1000), true)
    assert.strictEqual(await date().before(new Date()).isValid(Date.now() + 1000), false)
    assert.strictEqual(await date().before(new Date()).isValid(Date.now() - 1000), true)
    assert.strictEqual(await date().after(new Date()).isValid(Date.now() + 1000), true)
    assert.strictEqual(await date().after(new Date()).isValid(Date.now() - 1000), false)
  })
})