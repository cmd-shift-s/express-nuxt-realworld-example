/**
 * Augment the typings of Vue.js
 */

import Vue, { ComponentOptions } from 'vue'
import { CookieAttributes } from 'js-cookie'
import { User } from '~/models'

// todo: context?
interface StorageCookieOptions extends CookieAttributes {
  cookie: {
    prefix: string;
    options?: StorageCookieOptions;
  }
}
interface Storage {
  setUniversal(key: string, value: any, isJson?: boolean): string
  getUniversal(key: string, isJson?: boolean): any
  syncUniversal(key: string, defaultValue: any, isJson?: boolean): any
  // Local State
  setState(key: string, val: any): string
  getState(key: string): string
  watchState(key: string, handler: (newValue: any) => void): void
  // Cookies
  setCookie(key: string, val: any, options?: StorageCookieOptions): void
  getCookie(key: string, isJson?: boolean): any
  // Local Storage
  setLocalStorage(key: string, val: any, isJson?: boolean): void
  getLocalStorage(key: string, isJson?: boolean): any
}

interface Auth<T = any> {
  ctx: any
  $state: any // todo: type this
  $storage: Storage
  user: Partial<T>
  loggedIn: boolean
  loginWith(strategyName: string, ...args: any[]): Promise<never>
  login(...args: any[]): Promise<never>
  logout(): Promise<never>
  fetchUser(): Promise<never>
  fetchUserOnce(): Promise<never>
  hasScope(scopeName: string): boolean
  setToken(strategyName: string, token?: string): string
  syncToken(strategyName: string): string
  onError(handler: (error: Error, name: string, endpoint: any) => void): void
  setUser(user?: Partial<T>): void
  reset(): Promise<never>
  redirect(name: string): void
}

declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    auth?: boolean
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    $auth: Auth<User>
  }
}
