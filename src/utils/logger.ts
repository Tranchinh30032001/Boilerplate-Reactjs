/* eslint-disable no-console */
/**
 * Logger — dùng thay vì console.log trực tiếp.
 * Dev: log ra console. Prod: gửi lên error tracking.
 */

const isDev = import.meta.env.DEV

type LogContext = Record<string, unknown>

function log(level: 'info' | 'warn' | 'error' | 'debug', message: string, context?: LogContext) {
  if (!isDev && level !== 'error' && level !== 'warn') return

  const prefix = `[${level.toUpperCase()}]`
  if (level === 'error') console.error(prefix, message, context ?? '')
  else if (level === 'warn') console.warn(prefix, message, context ?? '')
  else console.log(prefix, message, context ?? '')

  // TODO: Sentry.captureException(...) khi production
}

export const logger = {
  info: (msg: string, ctx?: LogContext) => log('info', msg, ctx),
  warn: (msg: string, ctx?: LogContext) => log('warn', msg, ctx),
  error: (msg: string, ctx?: LogContext) => log('error', msg, ctx),
  debug: (msg: string, ctx?: LogContext) => log('debug', msg, ctx),
}
