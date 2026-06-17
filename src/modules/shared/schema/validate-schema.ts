import {
  FastifyReply,
  FastifyRequest,
} from 'fastify'

import {
  ZodError,
  ZodSchema,
} from 'zod'

export interface ApiValidationError {
  timestamp: string
  status: number
  message: string
  path: string
  errors: {
    field: string | null
    message: string
    global: boolean
  }[]
}

function mapZodError(
  error: ZodError,
  path: string,
): ApiValidationError {
  return {
    timestamp: new Date().toISOString(),
    status: 400,
    message: 'Dados inválidos',
    path,
    errors: error.issues.map(
      (issue) => ({
        field:
          issue.path.length > 0
            ? issue.path.join('.')
            : null,
        message: issue.message,
        global:
          issue.path.length === 0,
      }),
    ),
  }
}

export function validateSchema(
  schema: ZodSchema,
) {
  return async (
    request: FastifyRequest,
    reply: FastifyReply,
  ) => {
    const result = schema.safeParse(
      request.body,
    )

    if (!result.success) {
      return reply.status(400).send(
        mapZodError(
          result.error,
          request.url,
        ),
      )
    }

    request.body = result.data
  }
}