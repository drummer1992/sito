# Sito

Sito is a JavaScript lightweight schema validator built without any dependencies. 
The API is heavily inspired by [Yup](https://github.com/jquense/yup).

## Usage

Define a validator, validate the object, array or any scalar values.
The schema definition is extremely declarative that allows building complex schemas of interdependent validators.

```js
import { object, array, number, string } from 'sito'

const objectSchema = object({
  foo: object({
    bar: number()
  }),
 })

await objectSchema.assert({ 
  foo: {
    bar: 'a',
   },
 }) // throws error with message => foo.bar should be a number

const arraySchema = array([
  string(),
  number(),
])

await arraySchema.assert([
  'foo',
  'bar',
]) // throws error with message => [1] should be a number

const arrayOfValidatorsSchema = array(string())

await arrayOfValidatorsSchema.assert([
  'foo',
  'bar',
  'baz',
  42,
]) // throws error with message => [3] should be type of string

const mapOfValidatorsSchema = object(
    object({
      name: string().required(),
      age: number().required(),
    }),
)

await mapOfValidatorsSchema.assert({
  john: { name: 'john', age: 28 },
  pit: { name: 'pit' },
}) // throws error with message => pit.age is required
```

The exported functions are factory methods of validators:
```js
import {
  required,
  boolean,
  forbidden,
  oneOf,
  string,
  number,
  object,
  array,
  check,
} from 'sito'
```

If you need the validator classes, they are also exported:

```js
import {
  GenericValidator,
  StringValidator,
  NumberValidator,
  SchemaValidator,
  ObjectValidator,
  ArrayValidator,
} from 'sito'
```

## API

- `Sito`
  - [`ValidationError(message: string, value: any, path: string, key: string)`](#validationerrormessage-string-value-any-path-string-key-string)
  - [`BulkValidationError(errors: ValidationError[])`](#bulkvalidationerrorerrors-validationerror)
  - [GenericValidator](#generic)
    - [`validator.assert(payload: any): Promise<void>`](#validatorassertpayload-any-promisevoid)
    - [`validator.assertBulk(payload: any): Promise<void>`](#validatorassertbulkpayload-any-promisevoid)
    - [`validator.validate(payload: any): Promise<ValidationError[]>`](#validatorvalidatepayload-any-promisevalidationerror)
    - [`validator.isValid(payload: any): Promise<Boolean>`](#validatorisvalidpayload-any-promiseboolean)
    - [`validator.required(isRequired?: boolean): GenericValidator`](#validatorrequiredisrequired-boolean-genericvalidator)
    - [`validator.forbidden(isForbidden?: boolean): GenericValidator`](#validatorforbiddenisforbidden-boolean-genericvalidator)
    - [`validator.message(message: string | function(path: string, value: any, key: string|void): string): GenericValidator`](#validatormessagemessage-string--functionpath-string-value-any-key-stringvoid-string-genericvalidator)
    - [`validator.combine(validators: GenericValidator[]): GenericValidator`](#validatorcombinevalidators-genericvalidator-genericvalidator)
    - [`validator.check({ message: string | function(path: string, value: any, key: string|void): string|string, validate: function(value: any): boolean|Promise<boolean>, optional?: true, common?: false }): GenericValidator`](#validatorcheck-message-string--functionpath-string-value-any-key-stringvoid-stringstring-validate-functionvalue-any-booleanpromiseboolean-optional-true-common-false--genericvalidator)
    - [`check({ message: string | function(path: string, value: any, key: string|void): string|string, validate: function(value: any): boolean|Promise<boolean>, optional?: true, common?: false })`](#validatorcheck-message-string--functionpath-string-value-any-key-stringvoid-stringstring-validate-functionvalue-any-booleanpromiseboolean-optional-true-common-false--genericvalidator)
    - [`boolean()`](#boolean)
    - [`oneOf(values: any[])`](#oneof)
    - [`required(isRequired?: true)`](#required)
    - [`forbidden(isForbidden?: true)`](#forbidden)
  - [StringValidator|string](#string)
    - [`string.length(limit: number): StringValidator`](#stringlengthlimit-number-stringvalidator)
    - [`string.min(limit: number): StringValidator`](#stringminlimit-number-stringvalidator)
    - [`string.max(limit: number): StringValidator`](#stringmaxlimit-number-stringvalidator)
  - [NumberValidator|number](#number)
    - [`number.min(limit: number): NumberValidator`](#numberminlimit-number-numbervalidator)
    - [`number.max(limit: number): NumberValidator`](#numbermaxlimit-number-numbervalidator)
    - [`number.positive(): NumberValidator`](#numberpositive-numbervalidator)
    - [`number.negative(): NumberValidator`](#numbernegative-numbervalidator)
  - [ArrayValidator|array](#array)
    - [`array.strict(isStrict?: boolean): ArrayValidator`](#arraystrictitemvalidator-genericvalidator-arrayvalidator)
    - [`array.of(itemValidator: GenericValidator): ArrayValidator`](#arrayofiremvalidator-genericvalidator-arrayvalidator)
    - [`array.shape(arr: Array): ArrayValidator`](#arrayshapearr-array-arrayvalidator)
  - [ObjectValidator|object](#object)
    - [`object.strict(isStrict?: boolean): ObjectValidator`](#objectstrictitemvalidator-genericvalidator-objectvalidator)
    - [`object.of(itemValidator: GenericValidator): ObjectValidator`](#objectofitemvalidator-genericvalidator-objectvalidator)
    - [`object.shape(obj: Array): ObjectValidator`](#objectshapeobj-object-objectvalidator)

#### `ValidationError(message: string, value: any, path: string, key: string)`

Thrown on failed validations, with the following properties

- `name`: "ValidationError"
- `path`: a string, indicates where the error thrown. `path` is equal to `payload` at the root level.
- `key`: a string, indicates property key.
- `message`: error message
- `value`: checked value

#### `BulkValidationError(errors: ValidationError[])`

Thrown on failed validations, with the following properties

- `name`: "BulkValidationError"
- `errors`: An array of ValidationError instances
- `message`: "Bulk Validation Failed"

#### `generic`
### `validator.assert(payload: any): Promise<void>`

```js
const schema = object({ foo: required() })

await schema.assert({}) // throws error with message => foo is required
```

### `validator.assertBulk(payload: any): Promise<void>`

`assertBulk` method forces to validate the whole payload and collect errors, if there are some errors, BulkValidationError will be thrown

```js
const schema = object({ foo: required() }).strict()

await schema.assertBulk({ foo: 'bar', baz: 42 })
 
/**
  throws error =>
 {
   message: 'Bulk Validation Failed',
   errors: [{
     name: 'ValidationError',
     message: 'baz is forbidden attribute',
     path: 'baz',
     value: 42,
     key: 'baz'
   }]
 }
*/ 
```
 

### `validator.validate(payload: any): Promise<ValidationError[]>`

`validate` method performs validation and returns an array of the errors

```js
const schema = object({ foo: required() }).strict()

await schema.validate({ foo: 'bar', baz: 42 })
 
/**
 => [{
      name: 'ValidationError',
      message: 'baz is forbidden attribute',
      path: 'baz',
      value: 42,
      key: 'baz'
 }]
*/  
```

### `validator.isValid(payload: any): Promise<Boolean>`

`isValid` method performs validation and returns `true` in case of successful validation, otherwise `false`

```js
await array([number()]).isValid(['ops']) // false 
```

#### `validator.required(isRequired?: boolean): GenericValidator`

Method takes flag `isRequired` so you can disable such check on the fly.

```js
const schema = string().required()

await schema.assert('sito') // ok
```

#### `validator.forbidden(isForbidden?: boolean): GenericValidator`

Method takes flag `isForbidden` so you can disable such check on the fly.

```js
const MALE = 'm'
const FEMALE = 'f'

const schema = object({
  name: string(),
  gender: oneOf([FEMALE, MALE]),
  age: (value, key, obj) => number()
      .min(18)
      .forbidden(obj.gender === FEMALE)
      .message('It is not decent to ask a woman about her age 8)'),
})

await schema.assert({ name: 'Tolya', gender: 'm', age: 41 }) 
// ok
await schema.assert({ name: 'Zina', gender: 'f', age: 38 }) 
// throws error with message => It is not decent to ask a woman about her age 8)
```

#### `validator.message(message?: string | function(path: string, value: any, key: string|void): string): GenericValidator`

Set custom `message`:

```js
const schema = string().message('custom message')

await schema.assert(5) // throws error with message => custom message
```

`message` method takes function as well:

```js
const schema = object({
  foo: string().message((path, value, key) => `${path} is not valid`,)
})

await schema.assert({ foo: 5 }) // throws error with message => foo is not valid
```

### `validator.check({ message: string | function(path: string, value: any, key: string|void): string|string, validate: function(value: any): boolean|Promise<boolean>, optional?: true, common?: false }): GenericValidator`

You can enrich validator with custom check using `check` method.

```js
const secret = 'mankivka'

const schema = object({
  secret: new GenericValidator().check({
                optional: false,
                message: 'secret is not valid',
                validate: value => value === secret,
              })
})

await schema.assert({ secret: 'popivka' }) // throws error with message => secret is not valid
```

### `check({ message: string | function(path: string, value: any, key: string|void): string|string, validate: function(value: any): boolean|Promise<boolean>, optional?: true, common?: false }): GenericValidator`

Also, you can create a generic validator with a custom check using the `check` factory.

```js
const secret = 'mankivka'

const schema = object({
  secret: check({
                optional: false,
                message: path => `${path} is not valid`,
                validate: value => value === secret,
          })
})

await schema.assert({ secret: 'popivka' }) // throws error with message => secret is not valid
```

- `message` - error message or function which returns error message
- `validate` - the function which will be performed during validation
- `optional`: each check is `optional` by default, it means that the validation won't perform if checked value is `undefined`.
- `common`: forces the validator to run the check marked as `common` before other checks of this validator.
This allows you not to write extra code for type checks in each `validate` function.

```js
class DateValidator extends GenericValidator {
  constructor() {
   super()

   this.check({
      common: true,
      message: path => `${path} is not a date`,
      validate: value => new Date(value).toString() !== 'Invalid Date',
   })
  }

  inFuture() {
    return this.check({
       message: path => `${path} should be in future`,
       validate: value => new Date(value).getTime() > Date.now(),
    })
  }
}

const date = () => new DateValidator()

const schema = object({
  dob: date().inFuture().required()
}).required()

await schema.assertBulk({ dob: 'not a date' })
/**
  throws error =>
{
  "name": "BulkValidationError",
  "message": "Bulk Validation Failed",
  "errors": [
    {
      "name": "ValidationError",
      "message": "dob is not a date",
      "path": "dob",
      "key": "dob",
      "value": "not a date"
    },
    {
      "name": "ValidationError",
      "message": "dob should be in future",
      "path": "dob",
      "key": "dob",
      "value": "not a date"
    }
  ]
}
*/
```

This may also be required if you need to expand the validator's prototype

```js
NumberValidator.expand({
  safe() {
    return this.check({
      validate: value => value < Number.MAX_SAFE_INTEGER,
      message: key => `${key} is not safe`,
    })
  },
})
```

### `validator.combine(validators: GenericValidator[]): GenericValidator`

It might be useful if you need to merge validators

```js
const userIdSchema = string().max(50).required()
    .combine(
      check({
          validate: value => User.exists({ where: { id: value } }),
          message: (path, value) => `User not found by id ${value}`,
        })
    )
```

### boolean

Define a boolean validator.

```js
boolean()
```

```js
await boolean().isValid(true) // => true
```

### oneOf

Define a oneOf validator.

```js
const  validator = oneOf([1, 2])

await validator.isValid(1) // => true
await validator.isValid(3) // => false
```

### required

Define a required validator.

```js
string().required()
// or
required()
```

Method takes flag `isRequired` so you can disable such check on the fly.

```js
await required(false).isValid(null) // => true
```

### forbidden

Define a forbidden validator.

```js
string().forbidden()
// or
forbidden()
```

Method takes flag `isForbidden` so you can disable such check on the fly.

```js
await forbidden(false).isValid({}) // => true
```


### string

Define a string validator.

```js
string()
```

```js
await string().assert('sito') // ok
```

#### `string.length(limit: number): StringValidator`

Set the expected length for the string.

#### `string.min(limit: number): StringValidator`

Set the minimum expected length for the string.

#### `string.max(limit: number): StringValidator`

Set the maximum expected length for the string.

#### `string.pattern(regex: Regex): StringValidator`

Takes a regex pattern to check the string.

```js
await string().pattern(/(foo|bar)/).isValid('foo') // => true
await string().pattern(/(foo|bar)/).isValid('baz') // => false
```

### number

Define a number validator.

```js
number()
```

```js
await number().isValid(10) // => true
```

#### `number.min(limit: number): NumberValidator`

Set the minimum value allowed.

#### `number.max(limit: number): NumberValidator`

Set the maximum value allowed.

#### `number.positive(): NumberValidator`

Value must be a positive number.

#### `number.negative(): NumberValidator`

Value must be a negative number.

### array

Define an array validator.

```js
array()
```

```js
await array().assert({}) // throws error with message => payload should be type of array
```


### `array.strict(isStrict?: boolean): ArrayValidator`

A `strict` method makes the schema strict or no, it means that each attribute that is not defined in the schema will be rejected.


```js
const schema = array([string().required()]).strict()

await schema.assert(['foo', 'bar']) // throws error with message => [1] is forbidden attribute
```

#### `array.of(iremValidator: GenericValidator): ArrayValidator`

```js
const schema = array().of(string().min(2))

await schema.isValid(['ab', 'abc']) // => true
await schema.isValid(['ab', 'a']) // => false
```

You can also pass some validator to the array constructor.

```js
array().of(number())
// or
array(number())
``` 

It accepts function as well, which should return instance of GenericValidator.

```js
array().of((value, idx, array) => number())
// or
array((value, idx, array) => number())
``` 

```js
const fnSchema = array(
    (value, idx) => number().forbidden(idx === 100),
)

assert.strictEqual(await fnSchema.isValid([1]), true)

const numbersList = [...Array(100), 5].map(() => Math.random())

await fnSchema.assert(numbersList) // throws error with message => [100] is forbidden attribute
```

### `array.shape(arr: Array): ArrayValidator`

You can also define shape for the array validator.

```js
array().shape([number()])
// or
array([number()])
```


### object

Define object validator.

```js
object()
```

### `object.strict(isStrict?: boolean): ObjectValidator`

A `strict` method makes the schema strict or no, it means that each attribute that is not defined in the schema will be rejected.

```js
const schema = object({ 
  foo: string().required(),
}).strict()

await schema.assert({ foo: 'bar', baz: 42 }) // throws error with message => baz is forbidden attribute
```

#### `object.shape(obj: object): ObjectValidator`

You can also pass a shape to the object constructor.

```js
object().shape({
  num: number(),
})
// or
object({
  num: number(),
})
```

#### `object.of(itemValidator: GenericValidator): ObjectValidator`

You can also pass a validator to the object constructor.

```js
object().of(number())
// or
object(number())
```

```js
const schema = object(
  object({ name: string() })
)

await schema.assert({
  foo: { name: 'john' },
  bar: { name: 'doe' },
}) // ok
```

It accepts function as well, which should return instance of GenericValidator.

```js
object().of((value, key, object) => number())
// or
object((value, key, object) => number())
``` 

```js
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

await fnSchema.assert(musiciansMap) // throws error with message => voice is not needed
```