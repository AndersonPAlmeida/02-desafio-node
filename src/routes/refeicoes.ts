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

  app.get('/:id', async (request, reply) => {
    const getRefeicaoParamsSchema = z.object({
      id: z.uuid(),
    })

    const sessionId = request.cookies.sessionId
    const { id } = getRefeicaoParamsSchema.parse(request.params)

    if (!sessionId) {
      return reply.status(401).send('Acesso não autorizado, inicie a sessão.')
    }

    const refeicoes = await knex('refeicoes').where('id', id).select()

    return { refeicoes }
  })

  app.post('/', async (request, reply) => {
    const createRefeicaoSchema = z
      .object({
        nome: z.string().min(3),
        descricao: z.string(),
        dentroDieta: z.boolean(),
        data: z.string(),
        hora: z.string(),
      })
      .transform(({ data, hora, ...rest }) => {
        const [dia, mes, ano] = data.split('/')

        return {
          ...rest,
          data_hora_refeicao: `${ano}-${mes}-${dia} ${hora}:00`,
        }
      })

    const { nome, descricao, dentroDieta, data_hora_refeicao } =
      createRefeicaoSchema.parse(request.body)

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
      data_hora_refeicao,
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

    const createRefeicaoSchema = z
      .object({
        nome: z.string().min(3),
        descricao: z.string(),
        dentroDieta: z.boolean(),
        data: z.string(),
        hora: z.string(),
      })
      .transform(({ data, hora, ...rest }) => {
        const [dia, mes, ano] = data.split('/')

        return {
          ...rest,
          data_hora_refeicao: `${ano}-${mes}-${dia} ${hora}:00`,
        }
      })

    const { nome, descricao, dentroDieta, data_hora_refeicao } =
      createRefeicaoSchema.parse(request.body)

    await knex('refeicoes').where('id', id).update({
      nome,
      descricao,
      dentro_dieta: dentroDieta,
      data_hora_refeicao,
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
