'use strict'

const { string, object } = require('../lib')

const EMAIL_REGEX = /^[-.\w]+@([\w-]+\.)+[\w-]{2,12}$/

describe('string', () => {
  it('smoke', async () => {
    await string().assert('sito')
  })

  it('pattern', async () => {
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

  it('uuid4', async () => {
    const uuid4 = 'edf1f073-0615-4555-aab3-85238d249d2b'
    const uuid4Uppercase = 'faf4e3e9-3bbf-4d57-b7cb-40a2deda674c'.toUpperCase()
    const randomString = '532234-432424-2343-4234-5324-2353453'

    assert.strictEqual(await string().uuid4().isValid(uuid4), true)
    assert.strictEqual(await string().uuid4().isValid(uuid4Uppercase), true)

    const validationSchema = object({
      objectId: string().required().uuid4(),
      name: string(),
    })

    return assert.rejects(
      validationSchema.assert({ objectId: randomString }),
    )
  })
})