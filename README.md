# Tarsim

(Arabic: ترسيم, "demarcation") is yet another json-schema from decorators generator, born from the need for
multiple schemas from the same class, similar to class-validator's groups

It also comes with a decorator to generate AJV validators from the schemas generated 

### Installation
As with most decorator libraries you'll need to add the following to your tsconfig:
```json
    "emitDecoratorMetadata": true,
    "esModuleInterop": true,
    "experimentalDecorators": true,
```
and install the rest with

`npm i tarsim ajv reflect-metadata`


### Usage
The library is pretty simple, it includes 2 decorators and 2 methods to fetch the generated results from the decorators

##### json-schema

The decorator for creating new properties is `@Field(schema, options)`
it creates a new schema on the class if one does not exist yet, and adds the property schema to it

The options parameter defines what group/schema to assign the property to, and if it's required (`requiredIn: string[]`) or
optional (`optionalIn: string[]`) in the schema, the options value defaults to `{ requiredIn: ["default"] }`

This allows you to have properties required in a specific schema, and optional in another, or non existent completely (removing or erroring out on inclusion depending on your ajv configuration)


###### Example

```ts
import { Field, getSchema } from "tarsim"

enum UserValidationGroups {
    query = "query",
    auth = "auth",
    edit = "edit",
    create = "create",
}

class User {

    static vg = UserValidationGroups

    @Field({ type: "string", format: "uuid" }, { optionalIn: [User.vg.query]})
    id: string

    @Field({ type: "string", format: "email" }, { optionalIn: [User.vg.query, User.vg.edit], requiredIn: [User.vg.auth, User.vg.create] })
    email: string

    @Field({ type: "string", minLength: 8 }, { optionalIn: [User.vg.edit], requiredIn: [User.vg.auth, User.vg.create] })
    password: string

    @Field({ type: "string", format: "date" }, { optionalIn: [User.vg.query, User.vg.edit], requiredIn: [User.vg.create] })
    dateOfBirth: string
}

console.log(getSchema(User, User.vg.query))
// generates the following schema
{
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      email: { type: 'string', format: 'email' },
      dateOfBirth: { type: 'string', format: 'date' }
    },
    required: [],
    additionalProperties: false
}

console.log(getSchema(User, User.vg.auth))
// generates the following schema
{
    type: 'object',
    properties: {
      email: { type: 'string', format: 'email' },
      password: { type: 'string', minLength: 8 }
    },
    required: [ 'email', 'password' ],
    additionalProperties: false
}

console.log(getSchema(User, User.vg.create)) 
// generates the following schema
{
    type: 'object',
    properties: {
      email: { type: 'string', format: 'email' },
      password: { type: 'string', minLength: 8 },
      dateOfBirth: { type: 'string', format: 'date' }
    },
    required: [ 'email', 'password', 'dateOfBirth' ],
    additionalProperties: false
}

console.log(getSchema(User, User.vg.edit)) 
// generates the following schema
{
    type: 'object',
    properties: {
      email: { type: 'string', format: 'email' },
      password: { type: 'string', minLength: 8 },
      dateOfBirth: { type: 'string', format: 'date' }
    },
    required: [],
    additionalProperties: false
}

```


##### ajv
The ajv part has a decorator that fetches all the generated schemas and compiles them using ajv `@GenerateAJV(ajvInstance)`, and a function `getAJValidator(Class, group)` to retrieve the compiled validation function

###### Example

```ts
import { Field, getSchema, GenerateAJV, getAJValidator } from "tarsim";
import Ajv from "ajv";
import AjvFormat from "ajv-formats";

let ajv = new Ajv({
    removeAdditional: true,
})
AjvFormat(ajv)


@GenerateAJV(ajv)
class User {
// previous fields we delcared

}

let authValidator = getAJValidator(User, User.vg.auth) // ValidateFunction<typeof User>

```

if you require more control over the AJV compilation you can just use the schema parts of the library, alternatively feel free to open an issue or a pull request to add more functionality