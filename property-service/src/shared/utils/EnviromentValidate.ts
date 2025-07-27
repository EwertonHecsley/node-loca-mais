import { z } from 'zod'
import logger from './logger'

export default class EnviromentValidator {
  private readonly envSchema = z
    .object({
      NODE_ENV: z.enum(['development', 'production', 'test']),
      PORT: z.string().regex(/^\d+$/).transform(Number),
    })
    .loose()

  validateEnviromentVariables(): void {
    const result = this.envSchema.safeParse(process.env)

    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      }))

      logger.error('❌ Environment variable validation failed:')
      errors.forEach((error) => logger.error(`- ${error.path}: ${error.message}`))
      process.exit(1)
    }

    const env = result.data

    logger.info(`✅ Environment: ${env.NODE_ENV}`)
    logger.info('✅ Environment variables successfully validated')
  }
}
