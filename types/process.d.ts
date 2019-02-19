/**
 * Extends NodeJS.Process interface
 */

declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: string
    LOG_LEVEL: string
    PORT: string
    HOST: string
    ROUTER_BASE: string
    API_PREFIX: string
  }
}
