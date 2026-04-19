export class DatabaseNotFoundException extends Error {
    constructor(message: string){
        super(message);
    }
}