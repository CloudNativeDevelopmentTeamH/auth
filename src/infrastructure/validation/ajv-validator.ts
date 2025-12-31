import type Validator from "../../usecases/ports/validator";
import type { ValidatorResult } from "../../usecases/ports/validator";

import Ajv from "ajv";
import type { JSONSchemaType, ValidateFunction } from "ajv";

export default class AjvValidator<T> implements Validator<T> {
    private validateFunction: ValidateFunction<T>;

    constructor(JsonSchema: JSONSchemaType<T>) {
        const ajv = new Ajv();
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