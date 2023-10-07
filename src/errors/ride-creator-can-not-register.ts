export class RideCreatorCanNotRegisterError extends Error {
    message = 'ride creator can not register to it';
    type = 'REGISTER_TO_OWN_RIDE';

    constructor() {
        super();
    }
}