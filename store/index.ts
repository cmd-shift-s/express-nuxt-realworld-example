import { MutationTree, GetterTree } from 'vuex'
import { User, ResponseError } from '~/models'

export interface RootState {
  user: User | null
  errorMessages: string[]
}

export const state = (): RootState => ({
  user: null,
  errorMessages: []
})

export const mutations: MutationTree<RootState> = {
  authorize(state, user: User) {
    state.user = user
  },
  clearError(state) {
    state.errorMessages = []
  },
  pushError(state, res: ResponseError) {
    state.errorMessages.push(...res.errors.body)
  }
}

export const getters: GetterTree<RootState, RootState> = {
  isAuthenticated({ user }) {
    return !!user
  },
  hasError({ errorMessages }) {
    return errorMessages.length > 0
  }
}
