
const express = require('express')

const path = require('path')
const fs = require('fs')


const app = express()
const port = 5000

app.get('/api/v1/idp/vc/:sub',(req, res) => {
    var vc = JSON.parse(fs.readFileSync(path.join(__dirname + '/mockvc.json'), 'utf8'));
    res.json(vc)
})

app.listen(port, () => console.log(`Mock idv-hub started at ${port} `))
