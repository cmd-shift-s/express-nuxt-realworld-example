<template>
  <div class="home-page">
    <div class="banner">
      <div class="container">
        <h1 class="logo-font">
          conduit
        </h1>
        <p>A place to share your knowledge.</p>
      </div>
    </div>

    <div class="container page">
      <div class="row">
        <div class="col-md-9">
          <div class="feed-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
                <a class="nav-link disabled" href="">Your Feed</a>
              </li>
              <li class="nav-item">
                <a class="nav-link active" href="">Global Feed</a>
              </li>
            </ul>
          </div>

          <div class="article-preview">
            <div class="article-meta">
              <n-link to="/profile/Eric Simons">
                <img src="http://i.imgur.com/Qr71crq.jpg">
              </n-link>
              <div class="info">
                <n-link to="/profile/Eric Simons" class="author">
                  Eric Simons
                </n-link>
                <span class="date">January 20th</span>
              </div>
              <button class="btn btn-outline-primary btn-sm pull-xs-right">
                <i class="ion-heart" /> 29
              </button>
            </div>
            <n-link to="/article/how-to-build-webapps-that-scale" class="preview-link">
              <h1>How to build webapps that scale</h1>
              <p>This is the description for the post.</p>
              <span>Read more...</span>
            </n-link>
          </div>

          <div class="article-preview">
            <div class="article-meta">
              <n-link to="/profile/Albert Pai">
                <img src="http://i.imgur.com/N4VcUeJ.jpg">
              </n-link>
              <div class="info">
                <n-link to="/profile/Albert Pai" class="author">
                  Albert Pai
                </n-link>
                <span class="date">January 20th</span>
              </div>
              <button class="btn btn-outline-primary btn-sm pull-xs-right">
                <i class="ion-heart" /> 32
              </button>
            </div>
            <n-link to="/article/the-song-you-wont-ever-stop-singing" class="preview-link">
              <h1>The song you won't ever stop singing. No matter how hard you try.</h1>
              <p>This is the description for the post.</p>
              <span>Read more...</span>
            </n-link>
          </div>
        </div>

        <div class="col-md-3">
          <div class="sidebar">
            <p>Popular Tags</p>

            <div class="tag-list">
              <n-link v-for="tag of tags" :key="tag" to="" class="tag-pill tag-default">
                {{ tag }}
              </n-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component({
  async asyncData({ app }) {
    const { tags } = await app.$axios.$get('tags')
    return { tags }
  }
})
export default class IndexPage extends Vue {

}
</script>

<style>
</style>
