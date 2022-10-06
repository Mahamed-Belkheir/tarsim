import 'reflect-metadata';
import { Schema } from './types';

export const schemaMetaDataKey = 'tarsim-schema'

export function setSchemaProperty(key: string, property: Schema, required: boolean, group: string, model: any) {
    let schema: Schema & { type: "object" } = getSchema(model.constructor, group);
    schema ??= {
        type: "object",
        properties: {},
        required: [],
        additionalProperties: false,
    };
    schema.properties[key] = property;
    if (required) {
        schema.required.push(key);
    }
    Reflect.defineMetadata(`${schemaMetaDataKey}.${group}`, schema, model.constructor);
}

export function getSchema(model: any, group: string = "default") {
    return Reflect.getMetadata(`${schemaMetaDataKey}.${group}`, model);
}