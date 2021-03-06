import {DbClient} from "../common/db.client";
import {ObjectID} from "mongodb";
import dot from 'dot-object';

export class VcService {

    private COLLECTION: string = "vc"

    getBySub(sub: string): Promise<any> {
        return new DbClient().connect()
            .then(db => db.collection(this.COLLECTION).find({sub: sub, status: {$ne: "pending"}}).toArray())
    }

    deleteById(id: string): Promise<any> {
        return new DbClient().connect()
            .then(db => db.collection(this.COLLECTION).deleteOne({_id: new ObjectID(id)}))
    }

    save(vc: any): Promise<void> {
        return new DbClient().connect()
            .then(db => db.collection(this.COLLECTION).insertOne(vc))

    }

    getPendingBySub(sub: any): Promise<any> {
        return new DbClient().connect()
            .then(db => db.collection(this.COLLECTION).find({sub: sub, status: "pending"}).toArray())
    }

    getPendingByKey(key: any): Promise<any> {
        return new DbClient().connect()
            .then(db => db.collection(this.COLLECTION).find({key: key, status: "pending"}).toArray())
    }


    getVerifiedClaimsMatchingRequest(verifiedClaims: any, requestedVerifiedClaims: any): any {
        console.log(JSON.stringify(verifiedClaims, null, 2))
        console.log(JSON.stringify(requestedVerifiedClaims, null, 2))
        let result: any = {}
        if (requestedVerifiedClaims.verification) {
            let matchingVerification = this.getVerificationMatchingRequest(verifiedClaims.verification, requestedVerifiedClaims.verification)
            if (!matchingVerification) {
                return null
            } else {
                result.verification = matchingVerification
            }
        }

        result.claims = this.getClaimsMathingRequest(verifiedClaims.claims, requestedVerifiedClaims.claims)
        return result
    }

    getClaimsMathingRequest(vcClaims: any, requestedClaims: any): any {
        let result = {}
        let requestedKeys = Object.keys(requestedClaims)
        for (const key in vcClaims) {
            if (requestedKeys.includes(key)) {
                result[key] = vcClaims[key]
            }
        }
        return result;
    }

    getVerificationMatchingRequest(vcVerification: any, requestedVerification: any): any {
        let vcEvidences = vcVerification.evidence
        let matchingEvidence: any
        let requestedEvidences = requestedVerification.evidence
        if (requestedEvidences) {
            if (!Array.isArray(requestedEvidences)) {
                requestedEvidences = [requestedEvidences]
            }
            if (!Array.isArray(vcEvidences)) {
                vcEvidences = [vcEvidences]
            }

            if (vcEvidences) {
                matchingEvidence = this.getMatchingEvidence(vcEvidences, requestedEvidences);
                if (!matchingEvidence) {
                    return null
                }
            }
        }


        delete requestedVerification.evidence
        let requestedPaths: any = dot.dot(requestedVerification);
        let matchingVerification = this.matchPathsWithObject(requestedPaths, vcVerification);
        if (!matchingVerification) {
            return null
        } else {
            if(matchingEvidence) {
                matchingVerification.evidence = [matchingEvidence]
            }
            return matchingVerification
        }
    }

    private getMatchingEvidence(vcEvidences: Array<any>, requestedEvidences: Array<any>): any {
        for (const vcEvidence of vcEvidences) {
            for (const requestedEvidence of requestedEvidences) {
                let requestedPaths: any = dot.dot(requestedEvidence);
                let matchingEvidence = this.matchPathsWithObject(requestedPaths, vcEvidence);
                if (matchingEvidence) {
                    return matchingEvidence;
                }
            }
        }
        return null;
    }

    private matchPathsWithObject(requestedPaths: any, target: any): any {
        let result = true;
        let build = {}
        for (const [key, value] of Object.entries(requestedPaths)) {
            let lastNode = key.split(".").pop()
            let copyKey = key.replace("." + lastNode, "")
            switch (lastNode) {
                case "value":
                    if (!this.matchValue(key, value, target)) {
                        return null
                    }
                    ;
                    break;
                case "values":
                case "max_age":
                default:
                    copyKey = key;
                    break;
            }
            dot.copy(copyKey, copyKey, target, build)
        }
        return build;
    }

    private matchValue(key: string, value: any, vc: any): boolean {
        let path = key.slice(0, -6)
        let vcValue = dot.pick(path, vc)
        return vcValue === value;
    }

}

export default new VcService();