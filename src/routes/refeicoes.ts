import { FastifyInstance } from 'fastify'
import z from 'zod'
import { knex } from '../database'
import { randomUUID } from 'crypto'

export async function refeicoesRoutes(app: FastifyInstance) {
  app.get('/', async (request, reply) => {
    const sessionId = request.cookies.sessionId

    if (!sessionId) {
      return reply.status(401).send('Acesso não autorizado, inicie a sessão.')
    }

    const userId = await knex('users')
      .select('id')
      .where('session_id', sessionId)
      .first()

    const refeicoes = await knex('refeicoes')
      .where('user_id', userId.id)
      .select()

    return { refeicoes }
  })

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
      user_id: userId.id,
    })

    return reply.status(201).send()
  })

  app.put('/:id', async (request, reply) => {
    const getRefeicaoParamsSchema = z.object({
      id: z.uuid(),
    })

    const sessionId = request.cookies.sessionId
    const { id } = getRefeicaoParamsSchema.parse(request.params)

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
      .where('session_id', sessionId, id)
      .first()

    await knex('refeicoes').where('user_id', userId.id).update({
      nome,
      descricao,
      dentro_dieta: dentroDieta,
    })

    return reply.status(204).send()
  })

  app.delete('/:id', async (request, reply) => {
    const getRefeicaoParamsSchema = z.object({
      id: z.uuid(),
    })

    const sessionId = request.cookies.sessionId
    const { id } = getRefeicaoParamsSchema.parse(request.params)

    if (!sessionId) {
      return reply.status(401).send('Acesso não autorizado, inicie a sessão.')
    }

    await knex('refeicoes').where('id', id).delete()

    return reply.status(200).send()
  })
}
