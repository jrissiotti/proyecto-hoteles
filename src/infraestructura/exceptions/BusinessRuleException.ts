export class BusinessRuleException extends Error {
    constructor(mensaje: string) {
        super(mensaje);
        this.name = "BusinessRuleException";
    }
}