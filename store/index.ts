import { MutationTree } from 'vuex'

export interface RootState {
  isAuthenticated: boolean
}

export const state = (): RootState => ({
  isAuthenticated: false
})

export const mutations: MutationTree<RootState> = {
  authorize(state, isAuthenticated: boolean) {
    state.isAuthenticated = isAuthenticated
  }
}
