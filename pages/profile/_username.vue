<template>
  <div class="profile-page">
    <div class="user-info">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-md-10 offset-md-1">
            <img src="http://i.imgur.com/Qr71crq.jpg" class="user-img">
            <h4>Eric Simons</h4>
            <p>
              Cofounder @GoThinkster, lived in Aol's HQ for a few months, kinda looks like Peeta from the Hunger Games
            </p>
            <button class="btn btn-sm btn-outline-secondary action-btn">
              <i class="ion-plus-round" />
              &nbsp;
              Follow Eric Simons
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="container">
      <div class="row">
        <div class="col-xs-12 col-md-10 offset-md-1">
          <div class="articles-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
                <n-link :to="`/profile/${username}`" class="nav-link" exact>
                  My Articles
                </n-link>
              </li>
              <li class="nav-item">
                <n-link :to="`/profile/${username}/favorites`" class="nav-link">
                  Favorites Articles
                </n-link>
              </li>
            </ul>
          </div>

          <nuxt />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class ProfileIndexPage extends Vue {
  get username() {
    return this.$route.params.username
  }
}
</script>
