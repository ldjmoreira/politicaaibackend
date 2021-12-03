//const app = require('express')()//instancia do node.js
const express = require('express')
const app = express()
const consign = require('consign')
const db = require('./config/db')
app.use(express.static('./site'))//prover os arquivos estatics
app.db = db

consign()// app é passado para todas as instancias do then do consign
.include('./config/passport.js')
.then('./config/middlewares.js')
.then('./api/validation.js')
.then('./api/date_utils.js')
.then('./api')

.then('./config/routes.js')
.into(app)

app.listen(4005, () => {
    console.log('Backend 4005 nodeLembrador executando...')
})