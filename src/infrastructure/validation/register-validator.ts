import type { JSONSchemaType } from "ajv"
import type RegisterUserDto from "../../usecases/dtos/register-user"

import AjvValidator from "./ajv-validator";

const registerUserSchema: JSONSchemaType<RegisterUserDto> = {
    type: "object",
    properties: {
        email: { type: "string", format: "email", minLength: 5, maxLength: 255 },
        name: { type: "string", minLength: 1, maxLength: 255 },
        password: { type: "string", minLength: 8, maxLength: 64 }
    },
    required: ["email", "name", "password"],
    additionalProperties: false,
}

export default new AjvValidator<RegisterUserDto>(registerUserSchema);