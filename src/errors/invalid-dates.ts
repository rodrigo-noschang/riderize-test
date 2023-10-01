export class InvalidDatesError extends Error {
    message = '';

    constructor(message: string) {
        super();

        const errorMessage = message ?? 'invalid date(s) on the request';
        this.message = errorMessage;
    }
}