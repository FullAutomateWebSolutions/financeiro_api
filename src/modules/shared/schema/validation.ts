import { ZodSchema } from 'zod'

export function validate<T>(
    schema: ZodSchema<T>,
    data: unknown,
) {
    const result = schema.safeParse(data)

    if (!result.success) {
        return {
            success: false,
            errors: result.error.flatten(),
        }
    }

    return {
        success: true,
        data: result.data,
    }
}