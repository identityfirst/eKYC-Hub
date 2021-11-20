import {Framework, VerifiableCredentialBuilder} from '../builders/verifiable.credential.builder'
import {DocumentType, EvidenceBuilder, EvidenceType, Method} from '../builders/evidence.builder'
import {ClaimKeys} from "../common/enums";
import axios, {AxiosResponse} from "axios";
import log from "../../common/logger";
import {eKycService} from "./ekyc.service"



import {FieldMapping} from "../common/field.mapping";
import FetchingVcError from "../errors/FetchingVcError";

export class PassbaseService implements eKycService{

    private  docTypePath: string = "authentication_document.type"
    private  logName : string = "PassbaseService"
    private  serviceName : string = "passbase"
    private  secretKey : string = process.env.PASSBASE_SECRET_KEY

    isApplicable(serviceName: string): boolean{
        return serviceName === this.serviceName
    }

    getVcFromService(key: string): any{
        return this.getDataFromPassbase(key)
            .then(body => this.translate(body.data))
            .catch(error => {
                if (error.response && error.response.status == 404) {
                    throw new FetchingVcError(error.message)
                }else {
                    throw error;
                }})
    }

    translate(body: any): any {
        log.info(body)
        let mapping: FieldMapping = new FieldMapping(body.authentication,this.serviceName,this.docTypePath)
        return new VerifiableCredentialBuilder()
            .BuildFromMapping(mapping,body.authentication)
    }

    getDataFromPassbase(key: string): Promise<AxiosResponse>{
        console.log(key)
        return axios.get('https://api.passbase.com/api/v1/authentications/by_key/'+key,{ headers: {
                'Authorization': this.secretKey,
                'Accept': 'application/json'
            }})
    }

    getAllDataFromPassbase(): Promise<AxiosResponse>{
        return axios.get('https://api.passbase.com/api/v1/authentications',{ headers: {
                'Authorization': this.secretKey,
                'Accept': 'application/json'
            }})
    }
}

export default new PassbaseService();



