const  {Issuer}  = require('openid-client');
const { custom } = require('openid-client');
const express = require('express')
const session = require('express-session')
const jwtDecode =require('jwt-decode')
const idpHost = process.env.IDP_URL || 'http://localhost:8080'
const selfHost = process.env.SELF_URL ||'http://172.17.0.1:3000'
const path = require('path')
var cors = require('cors');
const clientConfig = {
    client_id: 'demo-rp',
    client_secret: 'secret',
    response_types: ['code'],
    redirect_uris: [selfHost+'/cb']
}
const claims = require ('./authorization-claims')

custom.setHttpOptionsDefaults({
    timeout: 500000,
});

const scopes = 'openid email profile vc'

var authorizationUrlConfig= (claim)=>{
    return{
        scope: scopes,
        claims: claim,
        purpose: "Sign in to finance application",
        prompt: "login"
    }
}


const idpUrl = idpHost+'/auth/realms/demo'


const app = express()
const port = 3000

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))

app.use(cors());
app.options('*', cors());

app.get('/login', (req, res) => {
    console.log(idpUrl)
    Issuer.discover(idpUrl)
        .then(issuer => new issuer.Client(clientConfig))
        .then(client => client.authorizationUrl({scope:'openid email', prompt:"login"}))
        .then(url => res.redirect(url))
})

app.get('/login/:claim', (req, res) => {
    console.log(idpUrl)
    Issuer.discover(idpUrl)
        .then(issuer => new issuer.Client(clientConfig))
        .then(client => client.authorizationUrl(authorizationUrlConfig(claims[req.params.claim])))
        .then(url => res.redirect(url))
})

app.get('/custom/login', (req, res) => {
    let claims = JSON.parse(req.query.claims)
    console.log(idpUrl)
    Issuer.discover(idpUrl)
        .then(issuer => new issuer.Client(clientConfig))
        .then(client => client.authorizationUrl(authorizationUrlConfig(claims)))
        .then(url => res.redirect(url))
})
app.get('/cb', (req, res) => {
    var client
    Issuer.discover(idpUrl)
        .then(issuer => client = new issuer.Client(clientConfig))
        .then(()=> client.callbackParams(req))
        .then(params => client.callback(selfHost+'/cb', params) )
        .then(tokenSet=>{
            console.log(tokenSet.access_token)
            req.session.user = tokenSet
            req.session.user.id_token_claims = jwtDecode(tokenSet.id_token)
            req.session.save()
        })
        .then(()=>res.redirect("/profile.html"))
})

app.get('/info',isAuthenticated, (req, res) => {
    Issuer.discover(idpUrl)
        .then(issuer => new issuer.Client(clientConfig))
        .then(client => client.userinfo(req.session.user.access_token))
        .then((user_info)=>req.session.user.user_info = user_info)
        .then(()=>res.end(JSON.stringify(req.session.user.user_info, null, 2)))
})

app.get('/jwt',isAuthenticated, (req, res) => {
    res.end(JSON.stringify(req.session.user.id_token_claims, null, 2))
})

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/views/index.html'));
})

app.get('/profile.html',isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname + '/views/profile.html'));
})

app.get('/account.html',isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname + '/views/profile.html'));
})

app.get('/logout',isAuthenticated, (req, res) => {
    req.session.destroy();
    res.redirect("/")
})

app.use('/static',express.static('static'));

function isAuthenticated(req, res, next) {
    if (req.session.user)
        return next();
    res.redirect('/');
}

app.listen(port, () => console.log(`Demo rp listening at ${selfHost} and connecting to ${idpHost}`))
