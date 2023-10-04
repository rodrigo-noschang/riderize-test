export class UniqueFieldConstraintError extends Error {
    message: string;
    type = 'UNIQUE_CONSTRAINT'

    constructor(field: string) {
        super()
        this.message = `this ${field} is already registered`
    }
}