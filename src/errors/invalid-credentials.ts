export class InvalidCredentialsError extends Error {
    message: string;

    constructor() {
        super();
        this.message = 'Invalid credentials';
    }
}