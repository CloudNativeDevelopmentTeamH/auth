import type Validator from "../../usecases/ports/outbound/validator";
import type { ValidatorResult } from "../../usecases/ports/outbound/validator";

import Ajv from "ajv";
import addFormats from "ajv-formats";
import type { JSONSchemaType, ValidateFunction } from "ajv";

export default class AjvValidator<T> implements Validator<T> {
  private validateFunction: ValidateFunction<T>;

  constructor(JsonSchema: JSONSchemaType<T>) {
    const ajv = new Ajv();
    addFormats(ajv);
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