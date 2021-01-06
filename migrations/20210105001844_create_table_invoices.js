
exports.up = async function(knex) {
    await knex.schema.createTable('invoices', table => {
        table.increments('id').primary()
        table.float('totalPrice').nullable().defaultTo(0.0) 
        table.integer('totalDuration').nullable().defaultTo(0) 
        table.boolean('open').notNull().defaultTo(true) 
        table.integer('userId').unsigned().references('id')
        .inTable('customers').notNull().onDelete('CASCADE') 
    }) 
};

exports.down = async function(knex) {
    await knex.schema.dropTable('invoices')    
};
