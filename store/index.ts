import { MutationTree, GetterTree } from 'vuex'
import { ResponseError } from '~/models'

export interface RootState {
  errorMessages: string[]
}

export const state = (): RootState => ({
  errorMessages: []
})

export const mutations: MutationTree<RootState> = {
  clearError(state) {
    state.errorMessages = []
  },
  pushError(state, res: ResponseError) {
    state.errorMessages.push(...res.errors.body)
  }
}

export const getters: GetterTree<RootState, RootState> = {
  hasError({ errorMessages }) {
    return errorMessages.length > 0
  }
}
