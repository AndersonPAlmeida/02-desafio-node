import { FastifyInstance } from 'fastify'
import { knex } from '../database'

export async function metricasRoutes(app: FastifyInstance) {
  app.get('/total', async (request, reply) => {
    const sessionId = request.cookies.sessionId

    if (!sessionId) {
      return reply.status(401).send('Acesso não autorizado, inicie a sessão.')
    }

    const userId = await knex('users')
      .select('id')
      .where('session_id', sessionId)
      .first()

    const refeicoes = await knex('refeicoes')
      .count({ total: '*' })
      .where('user_id', userId.id)

    return refeicoes[0]?.total
  })
}
