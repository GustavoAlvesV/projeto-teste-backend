const bcrypt = require('bcrypt-nodejs')


module.exports = app => {
    
    const { existsOrError, notExistsOrError }  = app.api.validation

    const save = async ( req, res ) => {
        const service = {...req.body}

        if(req.params.id) service.id = req.params.id  

        try{
            existsOrError(service.name, 'Nome não informado')
            existsOrError(service.description, 'Descrição não informada')
            existsOrError(service.price, 'Preço não informada')
            existsOrError(service.duration, 'Duração não informada')

            const serviceFromDB = await app.db('services')
                .where({ name: service.name }).first()

            if(!service.id){ 
                notExistsOrError(serviceFromDB, 'Serviço já cadastrado')
            }

        }catch(msg){
            return res.status(400).send(msg)
        }

        //Edição
        if(service.id){
            app.db('services')
                .update(service)
                .where({id: service.id})
                .then(() => res.status(204).send()) 
                .catch(err => res.status(500).send(err)) 

        } //Crição
        else{
            app.db('services')
                .insert(service)
                .then(() => res.status(204).send())
                .catch(err => res.status(500).send(err)) 

        }
    }

    const get = ( req, res ) =>{
        app.db('services')
            .select('*')
            .then(services => res.json(services))
            .catch(err => res.status(500).send(err))
    }

    const getById = ( req, res ) =>{
        app.db('services')
            .select('*')
            .where({id: req.params.id})
            .first()
            .then(service => res.json(service))
            .catch(err => res.status(500).send(err))
    }  

    const remove = async ( req, res ) =>{
        try{
            await app.db('services')
            .where({ id: req.params.id })
            .del()
            .then(() => res.status(204).send())
        }catch(msg){
            res.status(400).send(msg)
        }
    } 

    return { save, get, getById, remove }
}