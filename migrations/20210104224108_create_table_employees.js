
exports.up = async function(knex) {
    await knex.schema.createTable('employees', table => {
        table.increments('id').primary()
        table.string('name').notNull()  
        table.string('email').notNull()
        table.float('totalCommission').notNull().defaultTo(0.0)
    }).then(async function () {
        await knex("employees").insert([   
            { name: "Jose", email:"Jose@gmail.com"},
            { name: "Maria", email:"lucas@gmail.com"},
            { name: "Joao", email:"pedro@gmail.com"},
        ]);
    })
};

exports.down = async function(knex) {
    await knex.schema.dropTable('employees')  

};
