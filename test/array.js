'use strict'

const { object, array, number, string } = require('../lib')

describe('array', () => {
  it('smoke', () => {
    const schema = array()

    return assert.rejects(schema.assert({}), /payload should be type of array/)
  })

  it('length', async () => {
    await assert.rejects(
        array().of(string()).max(1).assert([1, 2]),
        /payload should have less than or equal 1 elements/,
    )

    await assert.rejects(
        array().of(string()).min(1).assert([]),
        /payload should have more than or equal 1 elements/,
    )

    await array().of(string()).min(1).assert(['1'])
    await array().of(string()).min(1).assert(['1', '2'])
    await array().of(string()).max(1).assert(['1'])
    await array().of(string()).max(1).assert([])
  })

  it('of', async () => {
    const schema = array().of(string().min(2))

    await schema.assert(['ab', 'abc'])

    assert.strictEqual(await schema.isValid(['ab', 'a']), false)

    const fnSchema = array(
        (value, idx) => number().forbidden(idx === 100),
    )

    assert.strictEqual(await fnSchema.isValid([1]), true)

    const numbersList = [...Array(100), 5].map(() => Math.random())

    await assert.rejects(fnSchema.assert(numbersList), /\[100] is forbidden attribute/)
  })

  it('strict', () => {
    const schema = array([string().required()]).strict()

    return assert.rejects(
        schema.assert(['foo', 'bar']),
        /\[1] is forbidden attribute/,
    )
  })

  it('check type', () => {
    return assert.rejects(array().assert(1), /payload should be type of array/)
  })

  it('required', () => {
    return assert.rejects(array().required().assert(), /payload is required/)
  })

  it('not empty', () => {
    return assert.rejects(array().notEmpty().assert([]), /payload should be a non-empty array/)
  })

  it('shape', () => {
    return assert.rejects(array([
      string().required(),
    ]).required().assert([]), /\[0] is required/)
  })

  describe('nested validation', () => {
    const schema = array(
        object({
          foo: object({
            bar: object({
              baz: object({
                n: array(number().required()).notEmpty().required(),
              }).strict().required(),
            }).strict().required(),
          }).strict().required(),
        }).strict(),
    ).strict().required().notEmpty()

    it('smoke', async () => {
      const validItem = { foo: { bar: { baz: { n: [5] } } } }

      await assert.rejects(schema.assert({}), /payload should be type of array/)
      await assert.rejects(schema.assert([{}]), /foo is required/)
      await assert.rejects(schema.assert([{ foo: {} }]), /\[0]\.foo.bar is required/)
      await assert.rejects(schema.assert([{ foo: { bar: {} } }]), /\[0]\.foo\.bar\.baz is required/)
      await assert.rejects(schema.assert([{ foo: { bar: { baz: {} } } }]), /\[0]\.foo\.bar\.baz\.n is required/)

      await assert.rejects(
          schema.assert([{ foo: { bar: { baz: { n: [] } } } }]),
          /\[0]\.foo\.bar\.baz\.n should be a non-empty array/,
      )

      await assert.rejects(
          schema.assert([{ foo: { bar: { baz: { n: [{}] } } } }]),
          /\[0]\.foo\.bar\.baz\.n\[0] should be a number/,
      )

      const errors = await schema.validate([{ foo: { bar: { baz: { n: ['asdo'] } } } }])

      assert.strictEqual(errors.length, 1)
      assert.strictEqual(errors[0].message, '[0].foo.bar.baz.n[0] should be a number')

      await schema.assert([validItem])

      assert.deepStrictEqual(await schema.validate([validItem]), [])

      await assert.rejects(schema.assert([validItem, { foo: {} }]), /\[1]\.foo.bar is required/)
      await assert.rejects(schema.assert([validItem, { foo: { bar: {} } }]), /\[1]\.foo\.bar\.baz is required/)

      await assert.rejects(
          schema.assert([validItem, { ...validItem, name: 'foo' }]),
          /\[1]\.name is forbidden attribute/,
      )

      await assert.rejects(
          schema.assert([validItem, { foo: { bar: { baz: {} } } }]),
          /\[1]\.foo\.bar\.baz\.n is required/,
      )

      await assert.rejects(
          schema.assert([validItem, { foo: { bar: { baz: { n: [] } } } }]),
          /\[1]\.foo\.bar\.baz\.n should be a non-empty array/,
      )

      await assert.rejects(
          schema.assert([validItem, { foo: { bar: { baz: { n: [{}] } } } }]),
          /\[1]\.foo\.bar\.baz\.n\[0] should be a number/,
      )

      await schema.assert([validItem, validItem])
    })
  })
})