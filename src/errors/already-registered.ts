export class AlreadyRegisteredError extends Error {
    message = 'user already registered to this ride';
    type = 'DUPLICATED_REGISTRATION'

    constructor() {
        super();
    }
}