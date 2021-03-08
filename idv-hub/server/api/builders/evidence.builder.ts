import {VerifiableCredentialBuilder} from "./verifiable.credential.builder";
import {PassbaseService} from "../services/passbase.service";

export class EvidenceBuilder
{
    private _value: any;

    constructor()
    {
        this._value = {
            verifier: {},
            document: {}
        };
    }


    public Type(name: EvidenceType): EvidenceBuilder
    {
        this._value.type = name
        return this
    }

    public Method(name: Method): EvidenceBuilder
    {
        this._value.method = name
        return this
    }

    public VerifierOrganization(value: String): EvidenceBuilder
    {
        this._value.verifier.organization = value
        return this
    }

    public VerifierTxn(value: String): EvidenceBuilder
    {
        this._value.verifier.txn = value
        return this
    }

    public Time(value: Date): EvidenceBuilder
    {
        this._value.time = value
        return this
    }

    public DocumentType(value: DocumentType): EvidenceBuilder
    {
        this._value.document.type = value
        return this
    }

    public DocumentNumber(value: String): EvidenceBuilder
    {
        this._value.document.number = value
        return this
    }

    public DocumentIssuerName(value: String): EvidenceBuilder
    {
        if(!this._value.document.issuer){
            this._value.document.issuer = {}
        }
        this._value.document.issuer.name = value
        return this
    }

    public DocumentIssuerCountry(value: String): EvidenceBuilder
    {
        if(!this._value.document.issuer){
            this._value.document.issuer = {}
        }
        this._value.document.issuer.country = value
        return this
    }

    public DocumentIssuerDateOfIssuance(value: string): EvidenceBuilder
    {
        if(value) {
            this._value.document.date_of_issuance = value.split('T')[0]
        }
        return this
    }

    public DocumentIssuerDateOfExpiry(value: string): EvidenceBuilder
    {
        if(value) {
            this._value.document.date_of_expiry = value.split('T')[0]
        }
        return this
    }

    public DocumentProviderName(value: String): EvidenceBuilder
    {
        if(!this._value.document.provider){
            this._value.document.provider = {}
        }
        this._value.document.provider.name = value
        return this
    }

    public DocumentProviderAdress(value: Object): EvidenceBuilder
    {
        if(!this._value.document.provider){
            this._value.document.provider = {}
        }
        this._value.document.provider.address = value
        return this
    }

    public DocumentQesIssuer(value: String): EvidenceBuilder
    {
        this._value.document.issuer = value
        return this
    }

    public DocumentSerialNumber(value: String): EvidenceBuilder
    {
        this._value.document.serial_number = value
        return this
    }

    public DocumentCreatedAt(value: String): EvidenceBuilder
    {
        this._value.document.created_at = value
        return this
    }

    public Build(): any{
        return this._value
    }
}

export default new EvidenceBuilder();

export enum Method {
    PIPP = "pipp",
    SRIPP = "sripp",
    EID = "eid",
    URIPP = "uripp"
}

export enum EvidenceType {
    ID_DOCUMENT = "id_document",
    UTILITY_BILL = "utility_bill",
    QES = "qes"
}

export enum DocumentType {
    ID_CARD = "idcard",
    PASSPORT = "passport",
    DRIVING_PERMIT = "driving_permit"
}