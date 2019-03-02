import { Context } from '@nuxt/vue-app'

export default ({ store }: Context) => {
  store.commit('clearError')
}
