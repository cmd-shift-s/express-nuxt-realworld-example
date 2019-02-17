<template>
  <div>
    <nav class="navbar navbar-light">
      <div class="container">
        <a class="navbar-brand" href="index.html">conduit</a>
        <ul class="nav navbar-nav pull-xs-right">
          <li class="nav-item">
            <!-- Add "active" class when you're on that page" -->
            <n-link class="nav-link" to="/" exact>
              Home
            </n-link>
          </li>
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
            <n-link class="nav-link" to="/auth">
              Sign up
            </n-link>
          </li>
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

<style>
</style>
