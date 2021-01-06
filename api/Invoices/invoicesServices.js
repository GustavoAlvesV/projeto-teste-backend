const bcrypt = require('bcrypt-nodejs')


module.exports = app => {

    const { existsOrError, notExistsOrError, equalsOrError } = app.api.validation

    const addPriceDuration = async (invoiceServiceId) => {

        const invoiceService = await app.db('invoices_services')
            .select('*')
            .where({ id: invoiceServiceId })

        const service = await app.db('services')
            .select('*')
            .where({ id: invoiceService[0].serviceId })

        const employee = await app.db('employees')
            .select('*')
            .where({ id: invoiceService[0].employeeId })

        const invoice = await app.db('invoices')
            .select('*')
            .where({ id: invoiceService[0].invoiceId })

        await app.db('invoices')
            .update({
                totalPrice: invoice[0].totalPrice + service[0].price,
                totalDuration: invoice[0].totalDuration + service[0].duration
            })
            .where({ id: invoiceService[0].invoiceId })
            .then(() => {
                return true
            })
            .catch(err => { return err })
    }

    const removePriceDuration = async (invoiceServiceId) => {

        const invoiceService = await app.db('invoices_services')
            .select('*')
            .where({ id: invoiceServiceId })

        const service = await app.db('services')
            .select('*')
            .where({ id: invoiceService[0].serviceId })

        const employee = await app.db('employees')
            .select('*')
            .where({ id: invoiceService[0].employeeId })

        const invoice = await app.db('invoices')
            .select('*')
            .where({ id: invoiceService[0].invoiceId })

        await app.db('invoices')
            .update({
                totalPrice: invoice[0].totalPrice - service[0].price,
                totalDuration: invoice[0].totalDuration - service[0].duration
            })
            .where({ id: invoiceService[0].invoiceId })
            .then(() => {
                return true
            })
            .catch(err => { return err }
            )
    }

    const save = async (req, res) => {
        const invoicesServices = { ...req.body } //invoiceId //serviceId //EmployeeId

        if (req.params.id) invoicesServices.id = req.params.id  //SE FOR EDICAO DO SERVICO

        let comission = 0
        let comissionPercent = 0.01 //Comissao de 10%

        try {
            existsOrError(invoicesServices.invoiceId, 'Atendimento não informado')
            existsOrError(invoicesServices.serviceId, 'Servico não informado')
            existsOrError(invoicesServices.employeeId, 'Empregado não informado')

            const invoiceServiceFromDB = await app.db('invoices_services')
                .where({ invoiceId: invoicesServices.invoiceId })
                .where({ serviceId: invoicesServices.serviceId })
                .where({ employeeId: invoicesServices.employeeId })
                .first()

            if (!invoicesServices.id) {
                notExistsOrError(invoiceServiceFromDB, 'Servico já adicionado no Atendimento')
            }

            const invoiceFromDB = await app.db('invoices')
                .where({ id: invoicesServices.invoiceId }).first()

            existsOrError(invoiceFromDB, 'Atendimento não cadastrado')

            if (invoiceFromDB.open !== true) {
                return res.status(204).send('Atendimento em andamento')
            }

            const serviceFromDB = await app.db('services')
                .where({ id: invoicesServices.serviceId }).first()
            existsOrError(serviceFromDB, 'Servico não cadastrado')

            comission = serviceFromDB.price * comissionPercent

            invoicesServices.comission = comission

            const employeeFromDB = await app.db('employees')
                .where({ id: invoicesServices.employeeId }).first()
            existsOrError(employeeFromDB, 'Empregado não cadastrado')

        } catch (msg) {
            return res.status(400).send(msg)
        }


        //Edição
        if (invoicesServices.id) {
            removePriceDuration(invoicesServices.id)
                .then(() => {
                    app.db('invoices_services')
                        .update(invoicesServices)
                        .where({ id: invoicesServices.id })
                        .returning('id')
                        .then((id) => {
                            addPriceDuration(id[0])
                                .then(() => {
                                    res.send(id).status(204)
                                })
                        })
                        .catch(err => res.status(500).send(err))
                })

        } //Crição
        else {
            app.db('invoices_services')
                .insert(invoicesServices)
                .returning('id')
                .then((id) => {
                    addPriceDuration(id[0])
                        .then(() => {
                            res.send(id).status(204)
                        })
                })
                .catch(err => res.status(500).send(err))

        }
    }



    const get = (req, res) => {
        app.db('invoices_services')
            .select('*')
            .then(invoices => res.json(invoices))
            .catch(err => res.status(500).send(err))
    }

    const getById = (req, res) => {
        app.db('invoices_services')
            .select('*')
            .where({ id: req.params.id })
            .first()
            .then(service => res.json(service))
            .catch(err => res.status(500).send(err))
    }

    const getByInvoiceId = (req, res) => { //Retorna services do invoice com id passado
        app.db('invoices_services as is')
            .join('employees as emp', 'emp.id', 'is.employeeId')
            .join('services as s', 's.id', 'is.serviceId')
            .join('invoices as inv', 'inv.id', 'is.invoiceId')
            .select('inv.id as invoiceId', 'inv.totalPrice', 'inv.totalDuration', 's.id as serviceId', 's.name as serviceName',
                's.price', 's.duration', 's.description', 'emp.id as employeeId', 'emp.name as employeeName', 'emp.totalCommission',
                'is.id as invoiceServiceId', 'is.comission')
            .where({ invoiceId: req.params.id })
            .then(service => res.json(service))
            .catch(err => console.log(err))
    }



    const remove = async (req, res) => {
        const invoiceServiceId = req.params.id
        try {
            await removePriceDuration(invoiceServiceId)
                .then(() => {
                    app.db('invoices_services')
                        .where({ id: invoiceServiceId })
                        .del()
                        .then(() => {
                            res.send().status(204)
                        })
                })
                .catch(err => console.log(err))

        } catch (msg) {
            res.status(400).send(msg)
        }
    }

    return { save, get, getById, remove, getByInvoiceId }
}