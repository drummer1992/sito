'use strict'

const { object, array, number, string } = require('../lib')

describe('shape', () => {
  describe('object validation', () => {
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

  describe('array validation', () => {
    it('check type', () => {
      return assert.rejects(array().assert(1), /payload should be type of array/)
    })

    it('required', () => {
      return assert.rejects(array().required().assert(), /payload is required/)
    })

    it('not empty', () => {
      return assert.rejects(array().notEmpty().assert([]), /payload should be not empty array/)
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
            /\[0]\.foo\.bar\.baz\.n should be not empty array/,
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
            /\[1]\.foo\.bar\.baz\.n should be not empty array/,
        )

        await assert.rejects(
            schema.assert([validItem, { foo: { bar: { baz: { n: [{}] } } } }]),
            /\[1]\.foo\.bar\.baz\.n\[0] should be a number/,
        )

        await schema.assert([validItem, validItem])
      })
    })
  })
})