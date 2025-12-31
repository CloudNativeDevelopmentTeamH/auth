import type { JSONSchemaType } from "ajv";
import type LoginUserDto from "../../usecases/dtos/login-user";

import AjvValidator from "./ajv-validator";

const loginUserSchema: JSONSchemaType<LoginUserDto> = {
    type: "object",
    properties: {
        email: { type: "string", format: "email", minLength: 5, maxLength: 255 },
        password: { type: "string", maxLength: 64 }
    },
    required: ["email", "password"],
    additionalProperties: false
}

export default new AjvValidator<LoginUserDto>(loginUserSchema);