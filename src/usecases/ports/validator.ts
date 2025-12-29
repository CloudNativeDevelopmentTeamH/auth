interface ValidatorResult<T> {
    data: T;
    errors?: string[];
}

export default interface Validator<T> {
    validate(data: T): ValidatorResult<T>;
}