import type { FastifyInstance } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { z } from 'zod'
import { prisma } from '../lib/prisma'
import { ClientError } from '../error/client-error'

export async function getParticipant(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    '/participants/:participantId',
    {
      schema: {
        params: z.object({
            participantId: z.string().uuid(),
        }),
      },
    },
    async (request) => {
      const { participantId } = request.params

      const participant = await prisma.participant.findUnique({
        select: {
            id: true,
            name: true,
            email: true,
            is_confirmed: true,
        },
        where: { id: participantId },
      })

      if (!participantId) {
        throw new ClientError('Participant not found')
      }

      return { participant }
    },
  )
}