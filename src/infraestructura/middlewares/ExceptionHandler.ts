import { DatabaseNotFoundException } from "../exceptions/DatabaseNotFoudException";
import { ValidationException } from "../exceptions/ValidationError";

export interface IHttpResponse {
    error: boolean,
    message: string,
    status: number,
}

export class ExceptionHandler {

    public static handle(err: Error): IHttpResponse {
        if(err instanceof DatabaseNotFoundException) 
            return {
                error: true,
                message: err.message,
                status: 404,
            };
        else if(err instanceof ValidationException) 
            return {
                error: true,
                message: err.message,
                status: 406,
            };
        else return {
            error: true,
            message: 'Error Interno del servidor',
            status: 500,
        }
    }
}