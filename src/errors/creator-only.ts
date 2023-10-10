export class CreatorOnlyError extends Error {
    message = '';
    type = 'CREATOR_ONLY';

    constructor(instance: string) {
        super();

        this.message = `only ${instance} creator can delete it`;
    }
}