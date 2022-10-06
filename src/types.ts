export type FieldType = "number" | "integer" | "string" | "boolean" | "array" | "object" | "null"

export type FormatName =
  | "date"
  | "time"
  | "date-time"
  | "iso-time"
  | "iso-date-time"
  | "duration"
  | "uri"
  | "uri-reference"
  | "uri-template"
  | "url"
  | "email"
  | "hostname"
  | "ipv4"
  | "ipv6"
  | "regex"
  | "uuid"
  | "json-pointer"
  | "json-pointer-uri-fragment"
  | "relative-json-pointer"
  | "byte"
  | "int32"
  | "int64"
  | "float"
  | "double"
  | "password"
  | "binary"

export type NumberKeywords = {
    maximum?: number
    minimum?: number
    exclusiveMaximum?: number
    exclusiveMinimum?: number
    multipleOf?: number
}

export type StringKeywords = {
    maxLength?: number
    minLength?: number
    pattern?: string | RegExp
    format?: FormatName
}

export type ArrayKeywords = {
    maxItems?: number
    minItems?: number
    uniqueItems?: boolean
    items?: Schema | Schema[]
    contains?: Schema
}

export type ObjectKeywords = {
    maxProperties?: number
    minProperties?: number
    required?: string[]
    properties?: Record<string, Schema>
    patternProperties?: Record<string, Schema>
    additionalProperties?: boolean | Record<string, Schema>
    propertyNames?: Schema
}

export type AnyKeywords = {
    enum?: any[]
    const?: any
    oneOf?: Schema[]
    anyOf?: Schema[]
    allOf?: Schema[]
}

export type Schema = 
    (
        ({ type: "number" | "integer" } & NumberKeywords)   |
        ({ type: "string" } & StringKeywords)               |
        ({ type: "boolean" })                               |
        ({ type: "array" } & ArrayKeywords )                |
        ({ type: "object" } & ObjectKeywords )              |
        ({ type: "null" })
    ) & AnyKeywords

