
import { Request, Response } from 'express';
import { Issuer } from 'openid-client'
import jwtDecode from 'jwt-decode'
export class Controller {

    static redirectUrl: string = process.env.SELF_HOST+'/api/v2/oidc/cb'

    static clientConfig: any = {
        client_id: process.env.OIDC_CLIENT_ID,
        client_secret: process.env.OIDC_CLIENT_SECRET,
        response_types: [process.env.OIDC_RESPONSE_TYPE],
        redirect_uris: [Controller.redirectUrl]
    }

    static authorizationUrlConfig: any = {
        scope: process.env.OIDC_SCOPES,
    }


    login(req: Request, res: Response): void {
        Issuer.discover(process.env.OIDC_IDP_URL)
            .then(issuer => new issuer.Client(Controller.clientConfig))
            .then(client => client.authorizationUrl(Controller.authorizationUrlConfig))
            .then(url => res.redirect(url))
      };

    callback(req: any, res: Response): void {
        var client
        Issuer.discover(process.env.OIDC_IDP_URL)
            .then(issuer => client = new issuer.Client(Controller.clientConfig))
            .then(()=> client.callbackParams(req))
            .then(params => client.callback(Controller.redirectUrl, params) )
            .then(tokenSet=>{
                console.log(tokenSet.access_token)
                req.session.user = tokenSet
                req.session.user.id_token_claims = jwtDecode(tokenSet.id_token)
                req.session.save()
            })
            .then(()=>res.redirect("/auth/"))
    };

    account(req: any, res: Response): void {
        res.send({username: req.session.user.id_token_claims.email})
    };

}
export default new Controller();
