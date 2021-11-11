'use strict'

const { object, number, string, exists, array, oneOf, boolean } = require('../lib')

describe('object', () => {
  it('strict', () => {
    const schema = object({ foo: string().required() }).strict()

    return assert.rejects(
        schema.assert({ foo: 'bar', baz: 42 }),
        /baz is forbidden attribute/,
    )
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

  describe('of', () => {
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

    it('schema', async () => {
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

    it('fnSchema', async () => {
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
  })

  describe('exists', () => {
    const node = () => object({
      value: exists(),
      next: value => value ? node() : exists(true),
    })
        .strict()

    it('should validate linked list', async () => {
      await assert.rejects(node().assert({
        value: 'foo',
        next: {
          value: 'bar',
          next: {
            value: 'baz',
            next: {
              value: 'almost',
              next: {
                value: 'end',
              },
            },
          },
        },
      }), /next\.next\.next\.next\.next is not defined/)

      await assert.rejects(node().assert({
        value: 'foo',
        next: {
          value: 'bar',
          passenger: 'ops',
          next: null,
        },
      }), /next.passenger is forbidden attribute/)

      await node().assert({
        value: 'foo',
        next: {
          value: 'bar',
          next: null,
        },
      })
    })
  })

  describe('issues', () => {
    const validationSchema = object({
      fieldOne  : boolean().required(),
      nestedObj1: object({
        fieldTwo  : string(),
        nestedObj2: object({
          fieldThree: number().required(),
          nestedObj3: object({
            fieldFour: string().max(2),
            fieldFive: string().min(2),
          }).required(),
        }).required(),
      }),
      nestedArr : array(object({
        nestedArrObj: object({
          fieldSix: number().combine(oneOf([1, 2])).required(),
        }).required(),
      })).required(),
      nestedArr2: array(
          object({ fieldSeven: string().notEmpty().required() }).required(),
      ),
      fieldEight: string().message('custom message'),
    }).required()

    it('should validate nested array', () => {
      return assert.rejects(
          async () => await validationSchema.assert({
            fieldOne : true,
            nestedArr: [{ nestedArrObj: { fieldSix: 3 } }],
          }),
          /nestedArr\[0]\.nestedArrObj\.fieldSix should be one of \[1, 2]/,
      )
    })
  })
})