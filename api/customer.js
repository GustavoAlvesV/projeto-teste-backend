const bcrypt = require('bcrypt-nodejs')


module.exports = app => {

    const { existsOrError, notExistsOrError, equalsOrError } = app.api.validation

    const encryptPassword = (password) => {
        const salt = bcrypt.genSaltSync(10)
        return bcrypt.hashSync(password, salt);
    }

    const save = async (req, res) => {

        const customer = { ...req.body }
        console.log(customer)
        if (req.params.id) customer.id = req.params.id  //Para rota de Edição

        try {
            existsOrError(customer.name, 'Nome não informado')
            existsOrError(customer.email, 'Email não informado')
            existsOrError(customer.password, 'Senha não informada')
            existsOrError(customer.confirmPassword, 'Confirmação de senha não informada')
            equalsOrError(customer.password, customer.confirmPassword, 'Senhas não conferem')

            const customerFromDB = await app.db('customers')
                .where({ email: customer.email }).first()

            if (!customer.id) {
                notExistsOrError(customerFromDB, 'Usuário já cadastrado')
            }

        } catch (msg) {
            return res.status(400).send(msg)
        }

        customer.password = encryptPassword(req.body.password)
        delete customer.confirmPassword

        console.log(customer)
        //Edição
        if (customer.id) {
            app.db('customers')
                .update(customer)
                .where({ id: customer.id })
                .then(() => res.status(204).send())
                .catch(err => res.status(500).send(err))

        } //Crição
        else {
            app.db('customers')
                .insert(customer)
                .then(() => res.status(204).send())
                .catch(err => console.log(err))
        }
    }

    const get = (req, res) => {
        app.db('customers')
            .select('*')
            .then(clients => res.json(clients))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        app.db('customers')
            .select('*')
            .where({ id: req.params.id })
            .first()
            .then(client => res.json(client))
            .catch(err => res.status(500).send(err))
    }

    const remove = async (req, res) => {
        try {
            await app.db('customers')
                .where({ id: req.params.id })
                .del()
                .then(() => res.status(204).send())
        } catch (msg) {
            res.status(400).send(msg)
        }
    }

    return { save, get, getById, remove }
}