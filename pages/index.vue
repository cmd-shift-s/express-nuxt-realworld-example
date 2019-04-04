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
                <a v-if="loggedIn" class="nav-link disabled" href="">Your Feed</a>
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
import { Component, Vue, namespace } from 'nuxt-property-decorator'
import ArticlePreview from '~/components/ArticlePreview.vue'
import { Article } from '~/models'

const auth = namespace('auth')

@Component({
  async asyncData({ app }) {
    const [{ tags }, { articles, articleCount }] = await Promise.all([
      app.$axios.$get('tags'),
      app.$axios.$get('articles', { params: { limit: 10 } })
    ])

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
  @auth.State loggedIn!: boolean

  tags: string[] = []
  articles: Article[] = []
  articleCount: number = 0

  get isEmpty() { return this.articleCount === 0 }
}
</script>

<style>
</style>
