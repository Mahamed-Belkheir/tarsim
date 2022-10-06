import { Field, getAJValidator, GenerateAJV } from "../"
import Ajv from "ajv";
import AjvFormat from "ajv-formats"

let ajv = new Ajv({
    removeAdditional: true,
})
AjvFormat(ajv)
enum UserValidationGroups {
    auth = "auth",
    create = "create",
    edit = "edit",
    query = "query"
}

@GenerateAJV(ajv)
class User {
    static vg = UserValidationGroups
    @Field({ type: "string" }, { optionalIn: [User.vg.query] })
    id: string
    @Field({ type: "string", format: "email" }, { optionalIn: [User.vg.query, User.vg.edit], requiredIn: [User.vg.create, User.vg.auth] })
    email: string
    @Field({ type: "string", minLength: 8 }, { optionalIn: [User.vg.query, User.vg.edit], requiredIn: [User.vg.create, User.vg.auth] })
    password: string
    @Field({ type: "string", format: "date" }, { optionalIn: [User.vg.query, User.vg.edit], requiredIn: [User.vg.create] })
    dateOfBirth: Date
}

let authValidator = getAJValidator(User, User.vg.auth)
let createValidator = getAJValidator(User, User.vg.create)
let editValidator = getAJValidator(User, User.vg.edit)
let queryValidator = getAJValidator(User, User.vg.query)

describe("AJV Validator Generation Tests", () => {
    
    it ("passes valid objects", async () => {
        let authObjects = [...new Array(5)].map((_,i) => {
            return {
                email: `user${i}@email.com`,
                password: `password12345`
            }
        })

        let createObjects = [...new Array(5)].map((_,i) => {
            return {
                email: `user${i}@email.com`,
                password: `password12345`,
                dateOfBirth: `1990-01-0${i+1}`
            }
        })

        let editObjects = [...new Array(5)].map((_,i) => {
            return {
                email: Math.random() > 0.5 ? `user${i}@email.com` : undefined,
                password: Math.random() > 0.5 ? `password12345` : undefined,
                dateOfBirth: Math.random() > 0.5 ? `1990-01-0${i+1}` : undefined,
            }
        })

        let queryObjects = [...new Array(5)].map((_,i) => {
            return {
                id: Math.random() > 0.5 ? `${i}` : undefined,
                email: Math.random() > 0.5 ? `user${i}@email.com` : undefined,
                password: Math.random() > 0.5 ? `password12345` : undefined,
                dateOfBirth: Math.random() > 0.5 ? `1990-01-0${i+1}` : undefined,
            }
        })

        authObjects.forEach(auth => {
            expect(authValidator(auth)).toBeTruthy()
        })

        createObjects.forEach(create => {
            expect(createValidator(create)).toBeTruthy()
        })

        editObjects.forEach(edit => {
            expect(editValidator(edit)).toBeTruthy()
        })

        queryObjects.forEach(query => {
            expect(queryValidator(query)).toBeTruthy()
        })
    })

    it("does not passs invalid objects", () => {
        let authObjects = [...new Array(5)].map((_,i) => {
            return {
                email: `user${i}email.com`,
                password: `password12345`
            }
        })

        let createObjects = [...new Array(5)].map((_,i) => {
            return {
                email: `user${i}@email.com`,
                password: `pas${i}`,
                dateOfBirth: `1990-01-0${i+1}`
            }
        })

        let editObjects = [...new Array(5)].map((_,i) => {
            return {
                email: Math.random() > 0.5 ? `user${i}@email.com` : undefined,
                password: Math.random() > 0.5 ? `passsword2345` : undefined,
                dateOfBirth: `1990-01${i+1}`,
            }
        })

        let queryObjects = [...new Array(5)].map((_,i) => {
            return {
                id: Math.random() > 0.5 ? `${i}` : undefined,
                email: Math.random() > 0.5 ? `user${i}@email.com` : undefined,
                password: Math.random() > 0.5 ? `password12345` : undefined,
                dateOfBirth: `1990-01${i+1}`,
            }
        })

        authObjects.forEach(auth => {
            expect(authValidator(auth)).toBeFalsy()
            expect((authValidator.errors as any[]).find(e => e.message === `must match format "email"`)).not.toBeUndefined()
        })

        createObjects.forEach(create => {
            expect(createValidator(create)).toBeFalsy()
            expect((createValidator.errors as any[]).find(e => e.message === `must NOT have fewer than 8 characters`)).not.toBeUndefined()
        })

        editObjects.forEach(edit => {
            expect(editValidator(edit)).toBeFalsy();
            expect((editValidator.errors as any[]).find(e => e.message === `must match format "date"`)).not.toBeUndefined()
        })

        queryObjects.forEach(query => {
            expect(queryValidator(query)).toBeFalsy();
            expect((queryValidator.errors as any[]).find(e => e.message === `must match format "date"`)).not.toBeUndefined()
        })
    })
    
    
})

