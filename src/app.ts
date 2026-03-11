import fastify from 'fastify'
import cookie from '@fastify/cookie'
import { usersRoutes } from './routes/users'
import { refeicoesRoutes } from './routes/refeicoes'

export const app = fastify()

app.register(cookie)

app.register(usersRoutes, {
  prefix: 'users',
})

app.register(refeicoesRoutes, {
  prefix: 'refeicoes',
})
