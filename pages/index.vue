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
                <a v-if="isAuthenticated" class="nav-link disabled" href="">Your Feed</a>
              </li>
              <li class="nav-item">
                <a class="nav-link active" href="">Global Feed</a>
              </li>
            </ul>
          </div>

          <article-preview v-for="(article, i) of articles" :key="i" :article="article" />
        </div>

        <div class="col-md-3">
          <div class="sidebar">
            <p>Popular Tags</p>

            <div class="tag-list">
              <n-link v-for="(tag, i) of tags" :key="i" to="" class="tag-pill tag-default">
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
import { Component, Vue, State } from 'nuxt-property-decorator'
import ArticlePreview from '~/components/ArticlePreview.vue'

@Component({
  async asyncData({ app }) {
    const { tags } = await app.$axios.$get('tags')
    const { articles, articleCount } = await app.$axios.$get('articles')
    return {
      tags,
      articles,
      articleCount
    }
  },
  components: {
    ArticlePreview
  }
})
export default class IndexPage extends Vue {
  @State isAuthenticated!: boolean
}
</script>

<style>
</style>
