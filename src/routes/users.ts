import z from 'zod'
import { knex } from '../database'
import { FastifyInstance } from 'fastify'
import { randomUUID } from 'crypto'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const createUserSchema = z.object({
      name: z.string().min(3),
    })

    const { name } = createUserSchema.parse(request.body)

    await knex('users').insert({
      id: randomUUID(),
      name,
    })

    return reply.status(201).send()
  })

  app.get('/', async () => {
    const result = await knex('users').select('*').first()

    return result
  })
}
