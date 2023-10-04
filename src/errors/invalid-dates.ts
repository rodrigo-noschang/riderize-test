export class InvalidDatesError extends Error {
    message = '';
    type = 'DATE_RELATED_ERROR';

    constructor(message: string) {
        super();

        const errorMessage = message ?? 'invalid date(s) on the request';
        this.message = errorMessage;
    }
}