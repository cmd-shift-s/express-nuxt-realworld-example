<template>
  <div>
    <nav class="navbar navbar-light">
      <div class="container">
        <n-link class="navbar-brand" to="/">
          conduit
        </n-link>
        <ul class="nav navbar-nav pull-xs-right">
          <li class="nav-item">
            <!-- Add "active" class when you're on that page" -->
            <n-link class="nav-link" to="/" exact>
              Home
            </n-link>
          </li>
          <template v-if="loggedIn">
            <li class="nav-item">
              <n-link class="nav-link" to="/editor">
                <i class="ion-compose" />&nbsp;New Post
              </n-link>
            </li>
            <li class="nav-item">
              <n-link class="nav-link" to="/settings">
                <i class="ion-gear-a" />&nbsp;Settings
              </n-link>
            </li>
            <li class="nav-item">
              <n-link class="nav-link" :to="`/profile/${user.username}`">
                {{ user.username }}
              </n-link>
            </li>
          </template>
          <template v-if="!loggedIn">
            <li class="nav-item">
              <n-link class="nav-link" to="/login">
                <i class="ion-log-in" />&nbsp;Sign In
              </n-link>
            </li>
            <li class="nav-item">
              <n-link class="nav-link" to="/register">
                Sign up
              </n-link>
            </li>
          </template>
        </ul>
      </div>
    </nav>

    <nuxt />

    <footer>
      <div class="container">
        <a href="/" class="logo-font">conduit</a>
        <span class="attribution">
          An interactive learning project from <a href="https://thinkster.io">Thinkster</a>. Code &amp; design licensed under MIT.
        </span>
      </div>
    </footer>
  </div>
</template>

<script lang="ts">
import { Component, Vue, namespace } from 'nuxt-property-decorator'
import { User } from '~/models'

const auth = namespace('auth')

@Component
export default class DefaultLayout extends Vue {
  @auth.State loggedIn!: boolean
  @auth.State user!: User
}
</script>

<style>
</style>
