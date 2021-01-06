
exports.up = async function(knex) {
    await knex.schema.createTable('invoices_services', table => {
        table.increments('id').primary()
        table.float('comission').nullable()
        table.integer('invoiceId').unsigned().references('id')
        .inTable('invoices').notNull().onDelete('CASCADE') 
        table.integer('serviceId').unsigned().references('id')
        .inTable('services').notNull().onDelete('CASCADE') 
        table.integer('employeeId').unsigned().references('id')
        .inTable('employees').notNull().onDelete('CASCADE') 
    }) 
};

exports.down = async function(knex) {
    await knex.schema.dropTable('invoices_services')    
};
