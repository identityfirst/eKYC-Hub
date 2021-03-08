import {EvidenceBuilder} from "./evidence.builder";
import dot from 'dot-object';
import jp from "jsonpath";
import {Validator} from "jsonschema";
import {FieldMapping} from "../common/field.mapping";
import {MappingType} from "../common/enums";
import log from "../../common/logger"
import processor from "../common/processor"
import * as fs from "fs";
import * as path from "path";

export class VerifiableCredentialBuilder
{
    private _value: any;

    constructor()
    {
        this._value = {
            verification:{
                evidence:[]
            },
            claims:{}
        };
    }

    public Framework(name: Framework): VerifiableCredentialBuilder
    {
        this._value.verification.trust_framework = name
        return this
    }

    public Time(value: Date): VerifiableCredentialBuilder
    {
        this._value.verification.time = value
        return this
    }

    public VerificationProcess(value: String): VerifiableCredentialBuilder
    {
        this._value.verification.verification_process = value
        return this
    }

    public AddEvidence(value: Object): VerifiableCredentialBuilder
    {
        this._value.verification.evidence.push(value)
        return this
    }

    public AddClaim(key: string, value: any): VerifiableCredentialBuilder
    {
        if(value) {
            this._value.claims[key] = value
        }
        return this
    }

    public Build(): any{
        return this._value
    }

    public BuildFromMapping(mapping: FieldMapping, source: any): any{
        for( const [key,val] of mapping.getEntries()){
            switch (mapping.getMappingType(val)){
                case MappingType.QUERY: this.getQueryValue(key,val,source); break;
                case MappingType.DIRECT: dot.str(key,val,this._value); break;
                case MappingType.NULL: dot.str(key,val,this._value); break;
            }
        }
        this.validateWithSchema()
        return this._value
    }

    private getQueryValue(key: string, val: any, source: any){
        let pathValue: string = this.getPathValue(val.path,source)
        if(val.postProcessor){
            pathValue = this.runPostProcessor(pathValue,val.postProcessor)
        }
        dot.str(key,pathValue,this._value)
    }

    private getPathValue(path: string, source: any):string {
        let value = jp.query(source,path)[0]
        log.debug("Value from path "+path+" "+value)
        return value
    }

    private runPostProcessor(value: string, processorName: string): string{
        return processor[processorName](value);
    }

    private validateWithSchema(){
        let validator = new Validator();
        let schema =  JSON.parse(fs.readFileSync(path.join(__dirname + "/../../schemas/verified_claims_schema.json"), 'utf8'));
        let result = validator.validate(this._value, schema)
        if(result.valid){
            log.debug("Schema validation successful")
        }else{
            log.warn("Schema validation failed",result.errors)
        }
    }
}


export default new VerifiableCredentialBuilder();


export enum Framework {
    NULL= null
}
