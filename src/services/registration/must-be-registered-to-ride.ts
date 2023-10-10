export class MustBeRegisteredToRideError extends Error {
    message = 'user must be registered to ride to delete registration';
    type = 'MUST_BE_REGISTERED';

    constructor() {
        super();
    }
}