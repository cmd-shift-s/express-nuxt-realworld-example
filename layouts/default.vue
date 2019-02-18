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
          <template v-if="isAuthenticated">
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
              <a class="nav-link" href="" @click.prevent="logout()">
                <i class="ion-log-out" />&nbsp;Logout
              </a>
            </li>
          </template>
          <template v-if="!isAuthenticated">
            <li class="nav-item">
              <!-- <n-link class="nav-link" to="/login"> -->
              <a class="nav-link" href="" @click.prevent="login()">
                <i class="ion-log-in" />&nbsp;Sign In
              </a>
              <!-- </n-link> -->
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
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class DefaultLayout extends Vue {
  isAuthenticated: boolean = false

  login() {
    this.isAuthenticated = true
    this.goHome()
  }

  logout() {
    this.isAuthenticated = false
    this.goHome()
  }

  goHome() {
    this.$router.push({ name: 'index' })
  }
}
</script>

<style>
</style>
