import type { JSONSchemaType } from "ajv"
import type RegisterUserInputDTO from "../../usecases/dtos/register-user-input.ts"

import AjvValidator from "./ajv-validator.ts";

const registerUserSchema: JSONSchemaType<RegisterUserInputDTO> = {
  type: "object",
  properties: {
    email: { type: "string", format: "email", minLength: 5, maxLength: 255 },
    name: { type: "string", minLength: 1, maxLength: 255 },
    password: { type: "string", minLength: 8, maxLength: 64 }
  },
  required: ["email", "name", "password"],
  additionalProperties: false,
}

export default new AjvValidator<RegisterUserInputDTO>(registerUserSchema);