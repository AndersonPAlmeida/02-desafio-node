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
    })

    const { nome, descricao, dentroDieta } = createRefeicaoSchema.parse(
      request.body,
    )

    const sessionId = request.cookies.sessionId

    if (!sessionId) {
      return reply.status(401).send('Acesso não autorizado, inicie a sessão.')
    }

    const userId = await knex('users')
      .select('id')
      .where('session_id', sessionId)
      .first()

    await knex('refeicoes').insert({
      id: randomUUID(),
      nome,
      descricao,
      dentro_dieta: dentroDieta,
      user_id: userId,
    })

    return reply.status(201).send()
  })

  app.put('/', async (request, reply) => {
    const sessionId = request.cookies.sessionId

    if (!sessionId) {
      return reply.status(401).send('Acesso não autorizado, inicie a sessão.')
    }

    const createRefeicaoSchema = z.object({
      nome: z.string().min(3),
      descricao: z.string(),
      dentroDieta: z.boolean(),
    })

    const { nome, descricao, dentroDieta } = createRefeicaoSchema.parse(
      request.body,
    )

    const userId = await knex('users')
      .select('id')
      .where('session_id', sessionId)
      .first()

    await knex('refeicoes').where('id', userId).update({
      id: randomUUID(),
      nome,
      descricao,
      dentro_dieta: dentroDieta,
      user_id: userId,
    })

    return reply.status(201).send()
  })
}
