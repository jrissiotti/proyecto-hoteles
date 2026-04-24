export class DatabaseNotFoundException extends Error {
    constructor(mensaje: string) {
        super(mensaje);
        this.name = "DatabaseNotFoundException";
    }
}