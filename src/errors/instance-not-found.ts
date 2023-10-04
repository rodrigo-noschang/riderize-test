export class InstanceNotFoundError extends Error {
    message = '';
    type = 'INSTANCE_NOT_FOUND';

    constructor(instance: string = 'instance') {
        super();
        this.message = `${instance} not found`;
    }
}