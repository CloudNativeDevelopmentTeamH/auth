import type Validator from "../../usecases/ports/outbound/validator.ts";
import type { ValidatorResult } from "../../usecases/ports/outbound/validator.ts";

import _Ajv from "ajv";
import _addFormats from "ajv-formats";
import type { JSONSchemaType, ValidateFunction } from "ajv";

export default class AjvValidator<T> implements Validator<T> {
  private validateFunction: ValidateFunction<T>;

  constructor(JsonSchema: JSONSchemaType<T>) {
    const Ajv = _Ajv as unknown as typeof _Ajv.default;
    const ajv = new Ajv();
    const addFormats = _addFormats as unknown as typeof _addFormats.default;
    addFormats(ajv, ["email"]);
    this.validateFunction = ajv.compile(JsonSchema);
  } 

  validate(data: T): ValidatorResult<T> {
    const valid = this.validateFunction(data);

    if (!valid) {
      const errors = this.validateFunction.errors?.map(err => `${err.instancePath} ${err.message}`) || [];
      return { data, errors };
    }

    return { data }
  }
}