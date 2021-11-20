import { CustomError } from 'ts-custom-error'

class HttpError extends CustomError {
    public constructor(
        public code: number,
        message?: string,
        statusCode?: string,
    ) {
        super(message)
    }
}

export const StatusCode = {
    MISSING_PARAM: "missing_param",
    INCORRECT_SESSION: "incorrect_session",
    INCORRECT_PARAM: "incorrect_param",
    VC_NOT_READY: "vc_not_ready",
    UNKNOWN_ERROR: "unknown_error"
}

export default HttpError