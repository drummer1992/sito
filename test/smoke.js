'use strict'

const { object, array, required, number, map, string } = require('../index')

describe('mk-validator', () => {
  describe('shape validation', () => {
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
                n: required(),
              }).required(),
            }).required(),
          }).required(),
        }).required()

        it('smoke', async () => {
          await assert.rejects(schema.assert({}), /foo is required/)
          await assert.rejects(schema.assert({ foo: {} }), /foo\.bar is required/)
          await assert.rejects(schema.assert({ foo: { bar: {} } }), /foo\.bar\.baz is required/)
          await assert.rejects(schema.assert({ foo: { bar: { baz: {} } } }), /foo\.bar\.baz\.n is required/)

          await schema.assert({ foo: { bar: { baz: { n: 5 } } } })
        })
      })

      describe('map', () => {
        const schema = map(
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

      describe('nested validation', () => {
        const schema = array(object({
          foo: object({
            bar: object({
              baz: object({
                n: array(number().required()).notEmpty().required(),
              }).required(),
            }).required(),
          }).required(),
        }))
            .required()
            .notEmpty()

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

          await schema.assert([validItem])

          await assert.rejects(schema.assert([validItem, { foo: {} }]), /\[1]\.foo.bar is required/)
          await assert.rejects(schema.assert([validItem, { foo: { bar: {} } }]), /\[1]\.foo\.bar\.baz is required/)

          await assert.rejects(
              schema.assert([validItem, { ...validItem, name: 'foo' }], { strict: true }),
              /\[1]\.name is forbidden value/,
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

  describe('unit validation', () => {
    it('required', () => {
      return assert.rejects(required().assert(), /payload is required/)
    })
  })
})