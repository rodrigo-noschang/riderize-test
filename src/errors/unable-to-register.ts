export class UnableToRegisterErrorUserToRideError extends Error {
    message = 'failed registration, try again later';
    type = 'FAILED_REGISTRATION';

    constructor() {
        super();
    }
}