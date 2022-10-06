import Ajv, { ValidateFunction } from "ajv"
import { getSchema, schemaMetaDataKey } from "./util"



const ajvValidatorKey = `ajv-validator`

export function GenerateAJV(ajv: Ajv) {
    return function(model: any) {
        Reflect.getMetadataKeys(model)
        .filter((s: string) => s.match(schemaMetaDataKey))
        .map((s: string) => s.slice(schemaMetaDataKey.length + 1))
        .forEach((g: string) => Reflect.defineMetadata(
            `${ajvValidatorKey}.${g}`,
            ajv.compile(getSchema(model, g)), model)
            )
    }
}

export function getAJValidator<T>(model: T, group: string) {
    let validator = Reflect.getMetadata(`${ajvValidatorKey}.${group}`, model);
    if (!validator) {
        throw new Error(`no validator for group ${group} found on class ${model.constructor?.name}`)
    }

    return validator as ValidateFunction<T>
}


