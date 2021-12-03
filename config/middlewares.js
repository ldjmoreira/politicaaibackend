const bodyParser = require('body-parser')
const cors = require('cors')

module.exports = app => {
    //não é utilizado junto com admin. vem antes.
    app.use(bodyParser.json())
    app.use(cors())
}
