import type { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('refeicoes', (table) => {
    table.uuid('id').primary()
    table.text('nome').notNullable()
    table.text('descricao').notNullable()
    table.boolean('dentro_dieta').notNullable().defaultTo(true)
    table.timestamp('data_hora_refeicao').notNullable()
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
    table.uuid('user_id').references('users.id')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('refeicoes')
}
