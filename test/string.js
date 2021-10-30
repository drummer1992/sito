'use strict'

const { string, object } = require('../lib')

const EMAIL_REGEX = /^[-.\w]+@([\w-]+\.)+[\w-]{2,12}$/

describe('string', () => {
  it('smoke', async () => {
    await string().assert('sito')
  })

  it('pattern', async () => {
    await string().pattern(/(foo|bar)/)

    assert.strictEqual(await string().pattern(/(foo|bar)/).isValid('baz'), false)

    const validationSchema = object({
      email: string().required().pattern(EMAIL_REGEX)
          .combine(),
      displayName: string(),
      password: string(),
    })

    await assert.rejects(
        validationSchema.assert({ email: 'mail' }),
        /email does not match the pattern/,
    )
  })
})