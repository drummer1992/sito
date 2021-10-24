'use strict'

const { string } = require('../lib')

describe('string', () => {
  it('smoke', async () => {
    await string().assert('sito')
  })

  it('pattern', async () => {
    await string().pattern(/(foo|bar)/)

    assert.strictEqual(await string().pattern(/(foo|bar)/).isValid('baz'), false)
  })
})