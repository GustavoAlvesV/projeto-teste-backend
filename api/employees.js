
module.exports = app => {
    
    const { existsOrError, notExistsOrError, equalsOrError }  = app.api.validation


    const save = async ( req, res ) => {
        
        const employee = {...req.body}
        if(req.params.id) employee.id = req.params.id  //Para rota de Edição

        try{
            existsOrError(employee.name, 'Nome não informado')
            existsOrError(employee.email, 'Email não informado')

            const employeeFromDB = await app.db('employees')
                .where({ email: employee.email }).first()

            if(!employee.id){ 
                notExistsOrError(employeeFromDB, 'Usuário já cadastrado')
            }

        }catch(msg){
            return res.status(400).send(msg)
        }
        //Edição
        if(employee.id){
            app.db('employees')
                .update(employee)
                .where({id: customer.id})
                .then(() => res.status(204).send()) 
                .catch(err => res.status(500).send(err)) 

        } //Crição
        else{
            app.db('employees')
                .insert(employee)
                .then(() => res.status(204).send())
                .catch(err => res.status(500).send(err)) 

        }      
    }

    const get = ( req, res ) =>{
        app.db('employees')
            .select('*')
            .then(employee => res.json(employee))
            .catch(err => res.status(500).send(err))
    }

    const getById = ( req, res ) =>{
        app.db('employees')
            .select('*')
            .where({id: req.params.id})
            .first()
            .then(employee => res.json(employee))
            .catch(err => res.status(500).send(err))
    }  

    const remove = async ( req, res ) =>{
        try{
            await app.db('employees')
            .where({ id: req.params.id })
            .del()
            .then(() =>  res.status(204).send())
        }catch(msg){
            res.status(400).send(msg)
        }
    } 

    return { save, get, getById, remove }
}