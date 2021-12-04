import {Response} from 'express';
import {VcService} from "../../services/vc.service";
import * as fs from "fs";
import * as path from "path";
import {Validator} from "jsonschema";
import log from "../../../common/logger";
import {SessionService} from "../../services/session.service";
import {PassbaseService} from "../../services/passbase.service";
import {ErrorBuilder, ErrorReason} from "../../builders/error.builder";
import {ResponseBuilder} from "../../builders/response.builder";
import {eKycService} from "../../services/ekyc.service";
import * as ss from "string-similarity";
import HttpError, {StatusCode} from "../../errors/HttpError";
import FetchingVcError from "../../errors/FetchingVcError";

export class Controller {


    getVcs(req: any, res: Response): void {

        if (!Controller.hasRequestVerifiedClaims(req)) {
            log.info('Failed request verification')
            log.debug(`Claims: ${req.query.claims}`)
            res.send(400)
            return
        }
        if (!Controller.isClaimsRequestValid(req)) {
            log.info('Failed request schema')
            log.debug(`Claims: ${req.query.claims}`)
            res.send(400)
            return
        }
        let verifiedClaimsRequest = Controller.getRequestVerifiedClaims(req)
        log.debug(verifiedClaimsRequest)
        log.debug(`Requested user: ${req.params.sub}`)
        new VcService().getBySub(req.params.sub)
            .then(vcs => Controller.filterVcs(vcs, verifiedClaimsRequest))
            .then((data) => res.send(data))
            .catch((e) => {
                log.error(e)
                res.send(500)
            })
    };

     getAllVcsBySession = async (req: any, res: Response): Promise<void> =>{
        if (!req.body.sessionId || !req.body.sub) {
            throw new HttpError(400,"Missing parameter", StatusCode.MISSING_PARAM)
        }
        let session = await new SessionService().getSession(req.body.sessionId)

        if (session.status == SessionService.STATUS_FINISHED) {
            new VcService().getBySessionId(req.body.sessionId)
                .then(vc => res.send(vc))
            return
        }

        if (!session || !session.serviceHandle) {
            throw new HttpError(400,"Incorrect session", StatusCode.INCORRECT_SESSION)
        }

        let eKycProvider: eKycService = this.getEkycServices().find(service => service.isApplicable(session.serviceName));
        eKycProvider.getVcFromService(session.serviceHandle)
            .then(vc => this.saveVc(vc,req.body.sub,req.body.sessionId))
            .then(vc => res.send(new ResponseBuilder().Data(vc).Build()))
            .catch(function (error) {
                console.error(error)
                if (error instanceof FetchingVcError) {
                    throw new HttpError(200,"vc not ready", StatusCode.VC_NOT_READY)
                } else {
                    throw new HttpError(500,"unknown error", StatusCode.UNKNOWN_ERROR)
                }
            })

    }

    async getVerifyClaim(req: any, res: Response): Promise<void> {
        if (!req.body.sessionId || !req.body.claim || !req.body.claimValue) {
            throw new HttpError(400,"Missing parameter", StatusCode.MISSING_PARAM)
        }

        let vc = await new VcService().getBySessionId(req.body.sessionId)
        if(!vc){
            throw new HttpError(400,"Incorrect session", StatusCode.INCORRECT_SESSION)
        }
        let claimVcValue = vc.claims[req.body.claim]
        if(!claimVcValue){
            throw new HttpError(400,"Incorrect claim for session", StatusCode.INCORRECT_PARAM)
        }
        let similarity = ss.compareTwoStrings(claimVcValue,req.body.claimValue)
        res.send({
            similarity:similarity,
            vcValue: claimVcValue,
            claimValue: req.body.claimValue
        })
        return
    }


    private getEkycServices(): eKycService[]{
        return [new PassbaseService()]
    }


    private saveVc(vc: any, sub: string, sessionId: string): any {
        vc.sub = sub
        vc.sessionId = sessionId
        return new VcService().save(vc)
            .then(() => {
                new SessionService().updateSession(sessionId,
                        {
                            status: SessionService.STATUS_FINISHED,
                            sub: sub
                        })
                }
            ).then(()=>vc)
    }

    private static hasRequestVerifiedClaims(req: any): boolean {
        if (!req.query.claims) {
            return false
        }
        return true
    }

    private static getRequestVerifiedClaims(req: any): any {
        let claims = JSON.parse(req.query.claims)
        if(claims.userinfo && claims.userinfo.verified_claims) {
            return claims.userinfo.verified_claims
        }else if(claims.id_token && claims.id_token.verified_claims){
            return claims.id_token.verified_claims
        }
        log.debug(`No verified_claims found`)
        return null
    }

    private static isClaimsRequestValid(req: any): boolean {
        let claims = JSON.parse(req.query.claims)
        let validator = new Validator();
        let schema = JSON.parse(fs.readFileSync(path.join(__dirname + "/../../../schemas/verified_claims_request_schema.json"), 'utf8'));
        let result = validator.validate(claims, schema)
        if (result.valid) {
            log.debug("Schema validation successful")
        } else {
            log.warn({errors: result.errors}, "Schema validation failed")
        }
        return result.valid
    }

    private static filterVcs(vcs: any, requestedVc: any) {
        log.debug(`Number user claims in db: ${vcs.length}`)
        let vcService = new VcService()
        let filtered = []
        vcs.forEach(vc => {
            let result = vcService.getVerifiedClaimsMatchingRequest(vc, requestedVc)
            if (result) {
                result.metadata = vc.metadata
                result.id = vc._id
                filtered.push(result)
            }
        })
        log.debug(`Found ${filtered.length} matches`)
        return filtered
    }

}

export default new Controller();
