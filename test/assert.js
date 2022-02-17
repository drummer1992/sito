'use strict'

const { object, string } = require('../lib')

describe('assert', () => {
  it('smoke', () => {
    const schema = object({ foo: string().required() })

    return assert.rejects(schema.assert({}), /foo is required/)
  })

  it('should return undefined in case validation passed', async () => {
    const schema = object({ foo: string().required() })

    assert.strictEqual(await schema.assert({ foo: '' }), undefined)
  })
})