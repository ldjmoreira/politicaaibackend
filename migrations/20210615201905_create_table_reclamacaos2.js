
exports.up = function (knex, Promise) {
    return knex.schema.createTable('reclamacaos', table => {
        table.increments('id').primary()
        table.string('area').notNull()
        table.integer('politico_id').references('id').inTable('politicos')
        table.string('descricao').notNull()
        table.string('thumblink').notNull()
        table.date('datap')
        table.string('texto').notNull()
      //  table.boolean('admin').notNull().defaultTo(false)
    })
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('reclamacaos')
};