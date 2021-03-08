import {Framework, VerifiableCredentialBuilder} from '../builders/verifiable.credential.builder'
import {DocumentType, EvidenceBuilder, EvidenceType, Method} from '../builders/evidence.builder'
import {ClaimKeys} from "../common/enums";
import axios, {AxiosResponse} from "axios";
import log from "../../common/logger";



import {FieldMapping} from "../common/field.mapping";

export class PassbaseService {

    private  docTypePath: string = "documents[0].document_type"
    private  logName : string = "PassbaseService"
    private  serviceName : string = "passbase"
    private  secretKey : string = process.env.PASSBASE_SECRET_KEY

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



