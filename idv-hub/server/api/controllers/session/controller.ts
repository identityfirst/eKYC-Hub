
import { Request, Response } from 'express';
import {SessionService} from '../../services/session.service'
import {ErrorBuilder, ErrorReason} from "../../builders/error.builder";

export class Controller {

    private static REDIRECT_URL: string = "https://localhost:5443/auth/passbase.html"

    getSession(req: Request, res: Response): void {
        new SessionService().getNewSession(req.body)
            .then(sessionId => res.send(Controller.getNewSessionResponse(sessionId)))
     };

    setServiceHandle(req: any, res: Response): any {
        if(req.body.sessionId && req.body.serviceHandle  && req.body.serviceName){
            let updateBody = {
                serviceHandle: req.body.serviceHandle,
                serviceName: req.body.serviceName,
                status: SessionService.STATUS_PENDING
            }

            let sessionService = new SessionService()

            return sessionService.updateSession(req.session.sessionId, updateBody)
                .then(()=>sessionService.getSession(req.session.sessionId))
                .then((session) => res.send({callbackUrl:session.callbackUrl}))


        }else{
            res.send(new ErrorBuilder().Error(ErrorReason.MISSING_PARAMETER).Build())
            return
        }
    };

    private static getNewSessionResponse(sessionId: string) {
        return {
            sessionId: sessionId,
            redirectUrl: `${this.REDIRECT_URL}?sessionId=${sessionId}`
        }
    }

}
export default new Controller();
