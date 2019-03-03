/**
 * Extends NodeJS.Process interface
 */

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string
    LOG_LEVEL: string
    API_PORT: string
    ROUTER_BASE: string
    API_PREFIX: string
  }
}
