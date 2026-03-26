import { FastifyInstance } from 'fastify'
import { knex } from '../database'

interface RetornoMetrica {
  dentro_dieta: number
}

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

  app.get('/total-dentro-dieta', async (request, reply) => {
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
      .where({ user_id: userId.id, dentro_dieta: 1 })

    return refeicoes[0]?.total
  })

  app.get('/total-fora-dieta', async (request, reply) => {
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
      .where({ user_id: userId.id, dentro_dieta: false })

    return refeicoes[0]?.total
  })

  app.get('/melhor-sequencia', async (request, reply) => {
    const sessionId = request.cookies.sessionId

    if (!sessionId) {
      return reply.status(401).send('Acesso não autorizado, inicie a sessão.')
    }

    const userId = await knex('users')
      .select('id')
      .where('session_id', sessionId)
      .first()

    const refeicoes: RetornoMetrica[] = await knex('refeicoes')
      .where('user_id', userId.id)
      .select('dentro_dieta')
      .orderBy('created_at', 'asc')

    let melhorSequencia = 0
    let sequenciaAtual = 0

    for (const tipo of refeicoes) {
      if (tipo.dentro_dieta === 1) {
        sequenciaAtual++

        if (melhorSequencia < sequenciaAtual) {
          melhorSequencia = sequenciaAtual
        }
      } else {
        sequenciaAtual = 0
      }
    }

    return melhorSequencia
  })
}
