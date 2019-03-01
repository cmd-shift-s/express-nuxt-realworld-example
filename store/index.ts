import { MutationTree, GetterTree } from 'vuex'
import { User } from '~/models'

export interface RootState {
  user: User | null
}

export const state = (): RootState => ({
  user: null
})

export const mutations: MutationTree<RootState> = {
  authorize(state, user: User) {
    state.user = user
  }
}

export const getters: GetterTree<RootState, RootState> = {
  isAuthenticated(state) {
    return !!state.user
  }
}
