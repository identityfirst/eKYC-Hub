export class ErrorBuilder {
    private _value: any;

    constructor() {
        this._value = {
            status: "error",
            error:"",
            message:""
        }
    }


    public Error(error: string): ErrorBuilder
    {
        this._value.error = error
        return this
    }

    public Message(message: string): ErrorBuilder
    {
        this._value.message = message
        return this
    }

    public Build(): any{
        return this._value
    }
}

export default new ErrorBuilder();

export enum ErrorReason {
    VC_NOT_READY = "vc_not_ready",
    UNKNOWN_ERROR = "unknown_error",
    MISSING_PARAMETER = "missing_parameter"
}