module.exports = {

  development: {
    client: 'postgresql',
    connection: {
      database:'clinica',
      user:'postgres',
      password:'admin',
    },
    pool: {
        min: 2,
        max: 10
    },
    migrations: {
        tableName: 'knex_migrations'
    }
  },


};
