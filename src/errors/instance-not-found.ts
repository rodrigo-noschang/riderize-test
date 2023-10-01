export class InstanceNotFoundError extends Error {
    message = '';

    constructor(instance: string = 'instance') {
        super();
        this.message = `${instance} not found`;
    }
}