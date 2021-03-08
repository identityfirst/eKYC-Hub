import {MappingType} from "./enums"
import log from "../../common/logger";
import jp from "jsonpath";
import fs from "fs";
import path from "path";

export class FieldMapping {
    private mapping: Object
    private logName: string = "FieldMapping"


    constructor(body: any, serviceName: string, docTypePath: string ) {
        this.mapping = this.getTypeMapping(serviceName,this.getDocType(docTypePath,body));
    }

    public getMappingType(value: any) : MappingType{
        if(value == null){
            return MappingType.NULL
        }
        if(value instanceof Object){
            switch (value.type){
                case "query": return MappingType.QUERY;
            }
        }
        return MappingType.DIRECT
    }

    public getEntries() : Array<Array<any>>{
        return Object.entries(this.mapping)
    }

    private getDocType(docTypePath: string, body: any): string{
        let type = jp.query(body,docTypePath)[0]
        log.info("Found document type "+type,this.logName)
        return type
    }

    private getTypeMapping(service:string, type: string): any{
        return JSON.parse(fs.readFileSync(path.join(__dirname + '../../../mappings/'+service+"/"+type+".json"), 'utf8'));
    }


}