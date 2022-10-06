import { Field, getSchema } from "../"

describe("Schema Generation Tests", () => {
    it("can generate a simple schema with default group", async () => {
        class Test {
            @Field({ type: "string" })
            attr1: string
            @Field({ type: "string" })
            attr2: string
            @Field({ type: "number" })
            attr3: number
            @Field({ type: "boolean" })
            attr4: boolean
        };
        let defaultSchema = getSchema(Test);
        expect(defaultSchema).toMatchObject({
            type: "object",
            properties: {
                attr1: { type: "string" },
                attr2: { type: "string" },
                attr3: { type: "number" },
                attr4: { type: "boolean" },
            },
            required: ["attr1", "attr2", "attr3", "attr4"],
            additionalProperties: false
        })
    })

    it("can generate complex schemas for different groups", async () => {
        class Test {
            @Field({ type: "string" }, { requiredIn: ["group1"], optionalIn: ["group2"] })
            attr1: string
            @Field({ type: "string" }, { optionalIn: ["group2"]})
            attr2: string
            @Field({ type: "number" }, { requiredIn: ["group2"], optionalIn: ["group1"] })
            attr3: number
            @Field({ type: "boolean" }, { requiredIn: ["group2"] })
            attr4: boolean
        };
        let group1Schema = getSchema(Test, "group1");
        let group2Schema = getSchema(Test, "group2");
        expect(group1Schema).toMatchObject({
            type: "object",
            properties: {
                attr1: { type: "string" },
                attr3: { type: "number" },
            },
            required: ["attr1"],
            additionalProperties: false
        })

        expect(group2Schema).toMatchObject({
            type: "object",
            properties: {
                attr1: { type: "string" },
                attr2: { type: "string" },
                attr3: { type: "number" },
                attr4: { type: "boolean" },
            },
            required: ["attr3", "attr4"],
            additionalProperties: false
        })
    })
})