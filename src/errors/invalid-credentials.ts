export class InvalidCredentialsError extends Error {
    message: string;
    type = 'INVALID_CREDENTIALS'

    constructor() {
        super();
        this.message = 'Invalid credentials';
    }
}