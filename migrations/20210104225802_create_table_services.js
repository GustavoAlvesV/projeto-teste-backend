
exports.up = async function(knex) {
    await knex.schema.createTable('services', table => {

        table.increments('id').primary()
        table.string('name').notNull()
        table.string('description').notNull()
        table.float('price').notNull()
        table.integer('duration').notNull()
    }).then(async function () {
        await knex("services").insert([   
            { name: "1", description:"a", price:"10", duration:"5"},
            { name: "2", description:"b", price:"20",  duration:"10"},
            { name: "3", description:"c", price:"30",  duration:"15"},
        ]);
    })   
};

exports.down = async function(knex) {
    await knex.schema.dropTable('services')    
};
