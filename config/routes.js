module.exports = app => {

    
    app.post('/signup', app.api.customer.save) 
    app.post('/signin', app.api.auth.signIn) 
    app.post('/validateToken', app.api.auth.validateToken)


    app.route('/customers')
        //.all(app.config.passport.authenticate())
        .get(app.api.customer.get)
        .post(app.api.customer.save)
    
    app.route('/customers/:id')
        //.all(app.config.passport.authenticate())
        .get(app.api.customer.getById)
        .put(app.api.customer.save)
        .delete(app.api.customer.remove)  

    app.route('/employees')
        //.all(app.config.passport.authenticate())
        .get(app.api.employees.get)
        .post(app.api.employees.save)

    app.route('/employees/:id')
        //.all(app.config.passport.authenticate())
        .get(app.api.employees.getById)
        .put(app.api.employees.save)
        .delete(app.api.employees.remove)

    app.route('/services')
        //.all(app.config.passport.authenticate())
        .get(app.api.services.get)
        .post(app.api.services.save)
        
    app.route('/services/:id')
        //.all(app.config.passport.authenticate())
        .get(app.api.services.getById)
        .put(app.api.services.save)
        .delete(app.api.services.remove)
        
    app.route('/invoices')
        //.all(app.config.passport.authenticate())
        .get(app.api.Invoices.invoices.get)
        .post(app.api.Invoices.invoices.save)
        
    app.route('/invoices/:id')
        //.all(app.config.passport.authenticate())
        .get(app.api.Invoices.invoices.getById)
        .delete(app.api.Invoices.invoices.remove)
        .post(app.api.Invoices.invoices.startInvoice)

    app.route('/invoices/user/:id') 
        //.all(app.config.passport.authenticate())
        .get(app.api.Invoices.invoices.getByUserId)
        
        

    
    app.route('/invoicesServices')
        //.all(app.config.passport.authenticate())
        .get(app.api.Invoices.invoicesServices.get)
        .post(app.api.Invoices.invoicesServices.save)
        
    app.route('/invoicesServices/:id')
        //.all(app.config.passport.authenticate())
        .get(app.api.Invoices.invoicesServices.getById)
        .put(app.api.Invoices.invoicesServices.save)
        .delete(app.api.Invoices.invoicesServices.remove)
    
    app.route('/invoicesServices/invoice/:id')
        //.all(app.config.passport.authenticate())
        .get(app.api.Invoices.invoicesServices.getByInvoiceId)


}