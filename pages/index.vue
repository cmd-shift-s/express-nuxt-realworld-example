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

          <div v-if="loadingArticle">
            Loading articles...
          </div>

          <div v-else-if="articleCount === 0">
            No articles are here... yet.
          </div>

          <article-preview
            v-for="(article, i) of articles"
            :key="i"
            :article="article"
            @favorite="favorite($event)"
            @unfavorite="unfavorite($event)"
          />
        </div>

        <div class="col-md-3">
          <div class="sidebar">
            <p>Popular Tags</p>

            <div v-if="loadingTags" class="tag-list">
              Loading tags...
            </div>

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
import { Article } from '~/server/entity'

const auth = namespace('auth')

@Component({
  components: {
    ArticlePreview
  }
})
export default class IndexPage extends Vue {
  @auth.State loggedIn!: boolean

  tags: string[] = []
  articles: Article[] = []
  articleCount: number = 0

  loadingArticle: boolean = false
  loadingTags: boolean = false

  beforeMount() {
    this.loadArticles()
    this.loadTags()
  }

  async loadArticles() {
    this.loadingArticle = true
    const { articles, articleCount } = await this.$axios.$get('articles', { params: { limit: 10 } })
    this.loadingArticle = false
    this.articles = articles
    this.articleCount = articleCount
  }

  async loadTags() {
    this.loadingTags = true
    const { tags } = await this.$axios.$get('tags')
    this.loadingTags = false
    this.tags = tags
  }

  async favorite(article: Article) {
    if (!this.loggedIn) {
      return this.$router.push('/login')
    }

    try {
      const res = await this.$axios.$post(`articles/${article.slug}/favorite`)
      Object.assign(article, res.article)
    } catch (e) {}
  }

  async unfavorite(article: Article) {
    if (!this.loggedIn) {
      return this.$router.push('/login')
    }

    try {
      const res = await this.$axios.$delete(`articles/${article.slug}/favorite`)
      Object.assign(article, res.article)
    } catch (e) {}
  }
}
</script>

<style>
</style>
