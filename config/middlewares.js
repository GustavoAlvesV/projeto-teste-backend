const bodyParser = require('body-parser')
const cors = require('cors')

const corsOptions = {

    origin: '*', // client (todo mundo pode acessar)
    
    optionsSuccessStatus: 200
    
}
 
module.exports = app => {
    app.use(bodyParser.json())
    app.use(cors(corsOptions))
}
