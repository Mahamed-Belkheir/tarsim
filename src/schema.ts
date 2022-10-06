import { Schema } from "./types";
import { setSchemaProperty } from "./util";

export type FieldOptions = {
    requiredIn?: string[]
    optionalIn?: string[]
}

export function Field(schema: Schema, opts: FieldOptions = { requiredIn: ["default"] }) {
    return function(model: any, key: any) {
        opts.optionalIn && opts.optionalIn.forEach(group => setSchemaProperty(key, schema, false, group, model));
        opts.requiredIn && opts.requiredIn.forEach(group => setSchemaProperty(key, schema, true, group, model));
    }
}