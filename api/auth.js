const authSecret = 'gustavo'

const jwt = require('jwt-simple')
const bcrypt = require('bcrypt-nodejs')  


module.exports = app => {
    const signIn = async (req, res) => {
        if( !req.body.email || !req.body.password ){
            return res.status(400).send('Informe cliente ou senha!')
        }

        const customer = await app.db('customers')
            .where({ email: req.body.email })
            .first()
        
        if( !customer ) return res.status(400).send('CLIENTE NÃO ENCONTRADO!')

        const isMatch = bcrypt.compareSync(req.body.password, customer.password)

        if (!isMatch) return res.status(401).send('Senha inválida!')


        const now = Math.floor(Date.now() / 1000)

        const payload = {
            id: customer.id,
            name: customer.name,
            email: customer.email,
            iat: now, 
            exp: now + (60 * 60 * 24) 
        }

        res.json({
            ...payload,
            token: jwt.encode(payload, authSecret)
        })

    }
    const validateToken = async (req, res) => {
        const customerData = req.body || null
        try {
            if(customerData) {
                const token = jwt.decode(customerData.token, authSecret)
                if(new Date(token.exp * 1000) > new Date()) {
                    return res.send(true)
                }
            }
        } catch(e) {
            // problema com o token
        }

        res.send(false)
      

      
    }

    return { signIn, validateToken }
}