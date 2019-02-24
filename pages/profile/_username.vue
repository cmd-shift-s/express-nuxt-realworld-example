<template>
  <div class="profile-page">
    <div class="user-info">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-md-10 offset-md-1">
            <img :src="profile.image" class="user-img">
            <h4>{{ profile.username }}</h4>
            <p>
              {{ profile.bio }}
            </p>
            <button v-if="profile.following" class="btn btn-sm action-btn btn-secondary">
              <i class="ion-minus-round" />
              &nbsp;
              Unfollow {{ profile.username }}
            </button>
            <button v-else class="btn btn-sm action-btn btn-outline-secondary">
              <i class="ion-plus-round" />
              &nbsp;
              Follow {{ profile.username }}
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
                <n-link :to="`/profile/${profile.username}`" class="nav-link" exact>
                  My Articles
                </n-link>
              </li>
              <li class="nav-item">
                <n-link :to="`/profile/${profile.username}/favorites`" class="nav-link">
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
import { Profile } from '~/models'

@Component({
  async asyncData({ app, params }) {
    const { profile } = await app.$axios.$get(`profile/${params.username}`)
    return {
      profile
    }
  }
})
export default class ProfilePage extends Vue {
  profile!: Profile
}
</script>
