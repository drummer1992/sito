'use strict'

const { object, number, string } = require('../lib')

describe('object', () => {
  it('strict', () => {
    const schema = object({ foo: string().required() }).strict()

    return assert.rejects(
        schema.assert({ foo: 'bar', baz: 42 }),
        /baz is forbidden attribute/,
    )
  })

  it('of', async () => {
    const schema = object(
        object({ name: string() }),
    )

    await assert.rejects(
        schema.assert({ foo: { name: 'john' }, bar: { name: 2 } }),
        /bar.name should be type of string/,
    )

    const ALLOWED_MUSICIANS = ['drums', 'bass', 'piano']

    const fnSchema = object(
        (value, key) => object({
          name: string().required().min(2).max(35),
          level: number().min(0).max(10),
        })
            .forbidden(!ALLOWED_MUSICIANS.includes(key))
            .message(`${key} is not needed`),
    )

    const musiciansMap = {
      bass: {
        name: 'Valera',
        level: 10,
      },
      drums: {
        name: 'Andrii',
        level: 9,
      },
      piano: {
        name: 'Victor',
        level: 10,
      },
      voice: {
        name: 'Olga',
        level: 10,
      },
    }

    await assert.rejects(fnSchema.assert(musiciansMap), /voice is not needed/)
  })

  it('check type', () => {
    return assert.rejects(object().assert(1), /payload should be type of object/)
  })

  it('required', () => {
    return assert.rejects(object().required().assert(), /payload is required/)
  })

  it('not empty', () => {
    return assert.rejects(object().notEmpty().assert({}), /payload should be not empty object/)
  })

  describe('nested validation', () => {
    const schema = object({
      foo: object({
        bar: object({
          baz: object({
            n: string()
                .required(false)
                .message('custom message that will not show')
                .notEmpty(),
          }).required(),
        }).required(),
      }).required(),
    }).required()

    it('smoke', async () => {
      await assert.rejects(schema.assert({}), /foo is required/)
      await assert.rejects(schema.assert({ foo: {} }), /foo\.bar is required/)
      await assert.rejects(schema.assert({ foo: { bar: {} } }), /foo\.bar\.baz is required/)

      await assert.rejects(
          schema.assert({ foo: { bar: { baz: { n: 5 } } } }),
          /foo\.bar\.baz\.n should be type of string/,
      )

      await assert.rejects(
          schema.assertBulk({ foo: { bar: { baz: { n: 5 } } } }),
          error => {
            assert.strictEqual(error.message, 'Bulk Validation Failed')

            return true
          },
      )
    })
  })

  describe('map', () => {
    const schema = object(
        object({
          name: string().required(),
          age: number().required(),
        })
            .notEmpty()
            .required(),
    )
        .required()
        .notEmpty()

    it('smoke', async () => {
      await assert.rejects(schema.assert({ id1: '' }), /id1 should be type of object/)
      await assert.rejects(schema.assert({ id1: { foo: '' } }), /id1\.name is required/)
      await assert.rejects(schema.assert({ id1: { name: 'Andrii' } }), /id1\.age is required/)

      await assert.rejects(schema.assert({
        id1: { name: 'Andrii', age: 28 },
        id2: { name: 'Max', age: {} },
      }), /id2\.age should be a number/)

      await schema.assert({
        id1: { name: 'Andrii', age: 28 },
        id2: { name: 'Max', age: 29 },
      })
    })
  })
})