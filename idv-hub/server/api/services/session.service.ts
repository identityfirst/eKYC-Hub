import {DbClient} from "../common/db.client";
import uuid4 from "uuid4";

export class SessionService {

    private COLLECTION: string = "session"
    private TTL: number = 4

    public static STATUS_FINISHED = "FINISHED"
    public static STATUS_PENDING = "PENDING"


    getNewSession(body): Promise<string> {
        let callbackUrl = body.callbackUrl;
        let service = body.service;
        let claims = body.claims
        let sessionId = uuid4();
        var expireAt = new Date();
        expireAt.setHours(expireAt.getHours() + this.TTL);
        return new DbClient().connect()
            .then(db => db.collection(this.COLLECTION).insert(
                {
                    sessionId: sessionId,
                    callbackUrl: callbackUrl,
                    service: service,
                    claims: claims
                }))
            .then(()=>sessionId);
    }

    getSession(sessionId: string): any {
        return new DbClient().connect()
            .then(db => db.collection(this.COLLECTION).findOne(
                {
                    "sessionId": sessionId
                }))
    }

    updateSession(sessionId: string, fields: any): Promise<string> {
        return new DbClient().connect()
            .then(db => db.collection(this.COLLECTION).updateOne(
                { "sessionId": sessionId},
                { $set: fields}))
    }

    isSessionValid(sessionId: string): Promise<boolean> {
        return new DbClient().connect()
            .then(db => db.collection(this.COLLECTION).countDocuments(
                {
                    "sessionId": sessionId
                }, { limit: 1 }))
            .then((result)=>result == 1);
    }

}
export default new SessionService();

