import pino, { LoggerOptions } from 'pino'

const loggerConfig: LoggerOptions = {}

if (process.env.NODE_ENV !== 'production') {
  loggerConfig.transport = {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'yyyy-mm-dd HH:MM:ss',
      ignore: 'pid,hostname',
    },
  }
}

const logger = pino(loggerConfig)

export default logger
