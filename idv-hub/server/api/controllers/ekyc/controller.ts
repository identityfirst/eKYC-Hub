import {Request, Response} from 'express';
import {PassbaseService} from "../../services/passbase.service";
import {VcService} from "../../services/vc.service";

export class Controller {
    fetchFromPassbase(req: any, res: Response): Promise<any> {

        return new PassbaseService().getVcFromService(req.params.key)
            .then(vc => {
                vc.sub = req.session.user.id_token_claims.sub
                return vc
            })
            .then(vc => new VcService().save(vc))
            .then(() => Controller.removePending(req.params.key))
            .then(() => res.send(200))
            .catch(function (error) {
                if (error.response && error.response.status == 404) {
                    Controller.passbaseNotFound(req.params.key, req.session.user.id_token_claims.sub)
                        .then(() => res.send(404))
                } else {
                    console.error(error)
                    res.send(error)
                }
            })
    };

    private static passbaseNotFound(key: string, sub: string): any {
        let vcService = new VcService()
        return vcService.getPendingByKey(key)
            .then(data => {
                if (data.length == 0) {
                    return vcService.save(Controller.getPendingVc(key, sub))
                }
                return Promise.resolve()
            })
    }

    private static removePending(key: string) {
        let vcService = new VcService()
        return vcService.getPendingByKey(key)
            .then(data => {
                if (data.length > 0) {
                    return vcService.deleteById(data[0]._id)
                } else {
                    return Promise.resolve()
                }
            })
    }

    private static getPendingVc(key: string, sub: string) {
        return {
            key: key,
            sub: sub,
            provider: "Passbase",
            date: new Date().toUTCString(),
            status: "pending"
        }
    }

    fetchAllFromPassbase(req: any, res: Response): void {
        new PassbaseService().getAllDataFromPassbase()
            .then((response) => res.send(response.data))
    };

    getVcs(req: any, res: Response): void {
        new VcService().getBySub(req.params.sub)
            .then((data) => res.send(data))
    };

    postVcs(req: any, res: Response): void {
        new VcService().save(req.body)
            .then(() => res.sendStatus(200))
    };

    getPendingVcs(req: any, res: Response): void {
        console.log(req.session.user.id_token_claims.sub)
        new VcService().getPendingBySub(req.session.user.id_token_claims.sub)
            .then((data) => res.send(data))
    };

    deleteVc(req: any, res: Response): void {
        new VcService().deleteById(req.params.id)
            .then(() => res.sendStatus(200))
    };

    getVcsClaims(req: any, res: Response): void {
        new VcService().getBySub(req.session.user.id_token_claims.sub)
            .then((data) => data.map(data => Controller.getSimpleClaim(data)))
            .then((data) => Array.prototype.concat.apply([], data))
            .then((data) => res.send(data))
    };

    getMy(req: any, res: Response): void {
        new VcService().getBySub(req.session.user.id_token_claims.sub)
            .then((data) => res.send(data))
    };

    getConfig(req: any, res: Response): void {
        res.send({
            passbasePublicKey: process.env.PASSBASE_PUBLIC_KEY || ''
        })
    };

    static getSimpleClaim(vc: any): any {
        console.log(vc)
        let claims = []
        for (const key in vc.claims) {
            claims.push({
                name: key,
                value: vc.claims[key],
                document: vc.verification.evidence[0].document.type,
                source: vc.verification.evidence[0].verifier.organization
            })
        }
        return claims;
    }


}

export default new Controller();
