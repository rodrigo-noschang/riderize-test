export class UniqueFieldConstraintError extends Error {
    message: string;

    constructor(field: string) {
        super()
        this.message = `this ${field} is already registered`
    }
}