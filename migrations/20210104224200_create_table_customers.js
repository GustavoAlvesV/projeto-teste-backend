
exports.up = async function(knex) {
    await knex.schema.createTable('customers', table => {
        table.increments('id').primary()
        table.string('name').notNull()
        table.string('email').notNull()
        table.string('password').notNull() 
    }).then(async function () {
        await knex("customers").insert([   
            { name: "Arthur", email:"arthur@gmail.com", password:"123"},
            { name: "Lucas", email:"lucas@gmail.com", password:"123"},
            { name: "Pedro", email:"pedro@gmail.com", password:"123"},
        ]);
    })  
};

exports.down = async function(knex) {
    await knex.schema.dropTable('customers')  
};
