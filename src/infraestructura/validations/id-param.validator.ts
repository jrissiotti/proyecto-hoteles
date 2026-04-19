import { ValidationException } from "../exceptions/ValidationError";

export class IdParamvalidator {
    static validate(id: string) {
        if(id?.length === 9)
            return true;
        else throw new ValidationException('El id noes valido');
    }
}