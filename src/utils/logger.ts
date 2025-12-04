/**
 * Simple logging utility
 * In production, this can be replaced with a more robust logging solution
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
}

const currentLogLevel: LogLevel =
  (process.env.LOG_LEVEL as LogLevel) ||
  (process.env.NODE_ENV === 'production' ? 'info' : 'debug')

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[currentLogLevel]
}

function formatMessage(level: LogLevel, message: string, meta?: Record<string, unknown>): string {
  const timestamp = new Date().toISOString()
  const metaStr = meta ? ` ${JSON.stringify(meta)}` : ''
  return `[${timestamp}] [${level.toUpperCase()}] ${message}${metaStr}`
}

export const logger = {
  debug: (message: string, meta?: Record<string, unknown>) => {
    if (shouldLog('debug')) {
      console.debug(formatMessage('debug', message, meta))
    }
  },
  info: (message: string, meta?: Record<string, unknown>) => {
    if (shouldLog('info')) {
      console.info(formatMessage('info', message, meta))
    }
  },
  warn: (message: string, meta?: Record<string, unknown>) => {
    if (shouldLog('warn')) {
      console.warn(formatMessage('warn', message, meta))
    }
  },
  error: (message: string, error?: Error | unknown, meta?: Record<string, unknown>) => {
    if (shouldLog('error')) {
      const errorDetails = error instanceof Error ? { error: error.message, stack: error.stack } : { error }
      console.error(formatMessage('error', message, { ...errorDetails, ...meta }))
    }
  },
}



