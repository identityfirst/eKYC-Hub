export class ResponseBuilder {
    private _value: any;

    constructor() {
        this._value = {
            status: "ok",
            data:{},
        }
    }


    public Data(data: any): ResponseBuilder
    {
        this._value.data = data
        return this
    }

    public Build(): any{
        return this._value
    }
}

export default new ResponseBuilder();

