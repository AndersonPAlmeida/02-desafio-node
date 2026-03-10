import fastify from 'fastify'
import { usersRoutes } from './routes/users'
import { refeicoesRoutes } from './routes/refeicoes'

export const app = fastify()

app.register(usersRoutes, {
  prefix: 'users',
})

app.register(refeicoesRoutes, {
  prefix: 'refeicoes',
})
