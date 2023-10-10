export class ReachedParticipantsLimitError extends Error {
    message = 'participants limit was reached, no one can register to this ride unless someone cancels their registration';
    type = 'PARTICIPANTS_LIMIT';

    constructor() {
        super();
    }
}