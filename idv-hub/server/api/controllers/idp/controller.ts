
import { Request, Response } from 'express';
import {VcService} from "../../services/vc.service";
import * as fs from "fs";
import * as path from "path";
import {Validator} from "jsonschema";
import log from "../../../common/logger";
import {res} from "pino-std-serializers";

export class Controller {

    getVcs(req: any, res: Response): void {

        if(!Controller.hasRequestVerifiedClaims(req)){
            res.send(400)
            return
        }
        if(!Controller.isClaimsRequestValid(req)){
            res.send(400)
            return
        }
        let verifiedClaimsRequest = Controller.getRequestVerifiedClaims(req)
        log.debug(verifiedClaimsRequest)

        new VcService().getBySub(req.params.sub)
            .then(vcs => Controller.filterVcs(vcs,verifiedClaimsRequest))
            .then((data)=>res.send(data))
            .catch((e)=>{
                log.error(e)
                res.send(500)
            })
    };

    private static hasRequestVerifiedClaims(req :any): boolean{
        if(!req.query.claims){
            return false
        }
        let claims = JSON.parse(req.query.claims)
        if(!claims.userinfo || !claims.userinfo.verified_claims){
            return false
        }
        return true
    }

    private static getRequestVerifiedClaims(req :any): any{
        let claims = JSON.parse(req.query.claims)
        return claims.userinfo.verified_claims
    }

    private static isClaimsRequestValid(req :any): boolean{
        let claims = JSON.parse(req.query.claims)
        let validator = new Validator();
        let schema =  JSON.parse(fs.readFileSync(path.join(__dirname + "/../../../schemas/verified_claims_request_schema.json"), 'utf8'));
        let result = validator.validate(claims, schema)
        if(result.valid){
            log.debug("Schema validation successful")
        }else{
            log.warn({errors:result.errors},"Schema validation failed")
        }
        return result.valid
    }

    private static filterVcs(vcs: any, requestedVc: any){
        let vcService = new VcService()
        let filtered = []
        vcs.forEach(vc =>{
           let result =  vcService.getVerifiedClaimsMatchingRequest(vc,requestedVc)
            if(result){
               result.metadata = vc.metadata
               result.id = vc._id
               filtered.push(result)
            }
        })
        return filtered
    }

}
export default new Controller();
