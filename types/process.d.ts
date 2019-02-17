/**
 * Extends NodeJS.Process interface
 */

declare namespace NodeJS {
  interface ProcessEnv {
    ROUTER_BASE: string
  }
}
