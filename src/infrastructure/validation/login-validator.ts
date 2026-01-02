import type { JSONSchemaType } from "ajv";
import type LoginUserInputDTO from "../../usecases/dtos/login-user-input";

import AjvValidator from "./ajv-validator";

const loginUserSchema: JSONSchemaType<LoginUserInputDTO> = {
  type: "object",
  properties: {
    email: { type: "string", format: "email", minLength: 5, maxLength: 255 },
    password: { type: "string", maxLength: 64 }
  },
  required: ["email", "password"],
  additionalProperties: false
}

export default new AjvValidator<LoginUserInputDTO>(loginUserSchema);