interface IState {
  isAuthenticated: boolean
}

export const state = (): IState => ({
  isAuthenticated: false
})

export const mutations = {
  authorize(state: IState, isAuthenticated: boolean) {
    state.isAuthenticated = isAuthenticated
  }
}
