    const bcrypt = require('bcrypt-nodejs')


    module.exports = app => {

        const { existsOrError, notExistsOrError, equalsOrError } = app.api.validation

        const save = async (req, res) => {
            const invoice = { ...req.body }

            try {
                existsOrError(invoice.userId, 'Usuário não informado')

                const invoicesFromDB = await app.db('invoices')
                    .where({ id: invoice.userId }).first()

                if (invoicesFromDB.open !== true) { res.status(500).send('Atendimento já finalizado') }

            } catch (msg) {
                return res.status(400).send(msg)
            }

            app.db('invoices')
                .insert(invoice)
                .returning('id')
                .then((id) => {
                    res.send(id).status(204)
                })
                .catch(err => res.status(500).send(err))

        }

        const get = (req, res) => {
            app.db('invoices')
                .select('*')
                .then(services => res.json(services))
                .catch(err => res.status(500).send(err))
        }

        const getById = (req, res) => {
            app.db('invoices')
                .select('*')
                .where({ id: req.params.id })
                .first()
                .then(service => res.json(service))
                .catch(err => res.status(500).send(err))
        }

        const getByUserId = (req, res) => {
            app.db('invoices')
                .select('id')
                .where({ userId: req.params.id })
                .where({ open: true })
                .first()
                .then(service => res.json(service))
                .catch(err => res.status(500).send(err))
        }

        const remove = async (req, res) => {
            try {
                await app.db('invoices')
                    .where({ id: req.params.id })
                    .del()
                    .then(() => res.status(204).send())
            } catch (msg) {
                res.status(400).send(msg)
            }
        }

        const startInvoice = async (req, res) => {
            const invoiceFromDB = await app.db('invoices')
                .where({ id: req.params.id })
                .first()

            try {
                existsOrError(invoiceFromDB, 'Atendimento não existe')

            } catch (msg) {
                res.status(400).send(msg)
            }
            if (invoiceFromDB.open !== true) { res.status(500).send('Atendimento já finalizado') }

            await app.db('invoices')
                .update({ open: false })
                .where({ id: req.params.id })
                .then(() => res.status(204).send())
                .catch(err => res.status(500).send(err))

        }





        return { save, get, getById, remove, getByUserId, startInvoice }
    }