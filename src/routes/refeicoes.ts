import { FastifyInstance } from 'fastify'
import z from 'zod'
import { knex } from '../database'
import { randomUUID } from 'crypto'

export async function refeicoesRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const createRefeicaoSchema = z.object({
      nome: z.string().min(3),
      descricao: z.string(),
      dentroDieta: z.boolean(),
      userId: z.uuid(),
    })

    const { nome, descricao, dentroDieta, userId } = createRefeicaoSchema.parse(
      request.body,
    )

    await knex('refeicoes').insert({
      id: randomUUID(),
      nome,
      descricao,
      dentro_dieta: dentroDieta,
      user_id: userId,
    })

    return reply.status(201).send()
  })
}
