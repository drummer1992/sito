'use strict'

const { array, string } = require('../lib')

describe('array', () => {
  it('smoke', () => {
    const schema = array()

    return assert.rejects(schema.assert({}), /payload should be type of array/)
  })

  it('of', async () => {
    const schema = array().of(string().min(2))

    assert.strictEqual(await schema.isValid(['ab', 'abc']), true)
    assert.strictEqual(await schema.isValid(['ab', 'a']), false)
  })

  it('strict', () => {
    const schema = array([string().required()]).strict()

    return assert.rejects(
        schema.assert(['foo', 'bar']),
        /\[1] is forbidden attribute/,
    )
  })
})