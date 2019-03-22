<template>
  <div class="settings-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">
            Your Settings
          </h1>

          <ul v-if="hasError" class="error-messages">
            <li v-for="(message, i) of errorMessages" :key="i">
              {{ message }}
            </li>
          </ul>

          <form @submit.prevent="onSubmit($event)">
            <fieldset>
              <fieldset class="form-group">
                <input :value="user.image" name="image" class="form-control" type="text" placeholder="URL of profile picture">
              </fieldset>
              <fieldset class="form-group">
                <input :value="user.username" name="username" class="form-control form-control-lg" type="text" placeholder="Your Name">
              </fieldset>
              <fieldset class="form-group">
                <textarea :value="user.bio" name="bio" class="form-control form-control-lg" rows="8" placeholder="Short bio about you" />
              </fieldset>
              <fieldset class="form-group">
                <input :value="user.email" name="email" class="form-control form-control-lg" type="text" placeholder="Email">
              </fieldset>
              <fieldset class="form-group">
                <input name="password" class="form-control form-control-lg" type="password" placeholder="Password">
              </fieldset>
              <button class="btn btn-lg btn-primary pull-xs-right">
                Update Settings
              </button>
            </fieldset>
          </form>
          <hr>
          <button class="btn btn-outline-danger" @click="logout()">
            Or click here to logout.
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, namespace, State, Getter } from 'nuxt-property-decorator'
import { User } from '~/server/entity'

const auth = namespace('auth')

@Component({
  middleware: 'auth'
})
export default class SettingsPage extends Vue {
  @auth.State user!: User
  @State errorMessages!: string[]
  @Getter hasError!: boolean

  async onSubmit({ target }: { target: HTMLFormElement }) {
    this.$store.commit('clearError')

    function getFieldsValue(target: HTMLFormElement, ...fields: string[]) {
      return fields.reduce((obj: any, field) => {
        obj[field] = target[field].value
        return obj
      }, {})
    }

    const user = getFieldsValue(target, 'email', 'username', 'password', 'image', 'bio')
    try {
      const res = await this.$axios.$put('/user', { user })
      this.$auth.setToken('local', res.user.token)
      await this.$auth.fetchUser()
      this.$router.push('/')
    } catch (e) {
      this.$store.commit('pushError', e.response.data)
    }
  }

  async logout() {
    await this.$auth.logout()
    this.$router.push('/')
  }
}
</script>
