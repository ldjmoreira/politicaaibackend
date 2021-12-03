
exports.up = function (knex, Promise) {
    return knex.schema.createTable('politicos', table => {
        table.increments('id').primary()
        table.string('nome').notNull()
        table.string('partido').notNull()

    })
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('politicos')
};