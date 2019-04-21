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
                <n-link v-if="loggedIn" :to="`/?author=${user.username}`" class="nav-link" :class="{'active': hasQueryAuthor}">
                  Your Feed
                </n-link>
              </li>
              <li class="nav-item">
                <n-link
                  to="/"
                  class="nav-link"
                  :class="{'active': !hasQueryAuthor && !hasQueryTag}"
                  exact
                >
                  Global Feed
                </n-link>
              </li>
              <li v-show="hasQueryTag" class="nav-item">
                <n-link :to="`/?tag=${queryTag}`" class="nav-link" :class="{'active': hasQueryTag}">
                  #{{ queryTag }}
                </n-link>
              </li>
            </ul>
          </div>

          <article-preview
            v-for="(article, i) of articles"
            :key="i"
            :article="article"
            @favorite="favorite($event)"
            @unfavorite="unfavorite($event)"
          />

          <div v-if="loadingArticle">
            Loading articles...
          </div>

          <div v-else-if="articleCount === 0">
            No articles are here... yet.
          </div>

          <pagination
            :current-page="currentPage"
            :total="articleCount"
            @change="changePage($event)"
          />
        </div>

        <div class="col-md-3">
          <div class="sidebar">
            <p>Popular Tags</p>

            <div v-if="loadingTags" class="tag-list">
              Loading tags...
            </div>

            <div class="tag-list">
              <a v-for="(tag, i) of tags" :key="i" href="" class="tag-pill tag-default" @click.prevent="$router.push({query: {tag}})">
                {{ tag }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, namespace, Watch } from 'nuxt-property-decorator'
import ArticlePreview from '~/components/ArticlePreview.vue'
import Pagination from '~/components/Pagination.vue'
import { Article, User } from '~/server/entity'

const auth = namespace('auth')

@Component({
  components: {
    ArticlePreview,
    Pagination
  }
})
export default class IndexPage extends Vue {
  @auth.State loggedIn!: boolean
  @auth.State user!: User

  tags: string[] = []
  articles: Article[] = []
  articleCount: number = 0

  loadingArticle: boolean = false
  loadingTags: boolean = false

  beforeMount() {
    this.loadArticles()
    this.loadTags()
  }

  get queryAuthor() {
    return this.$route.query.author
  }
  get hasQueryAuthor() {
    return !!this.queryAuthor
  }

  get queryTag() {
    return this.$route.query.tag
  }
  get hasQueryTag() {
    return !!this.queryTag
  }

  get currentPage() {
    return (Number.parseInt(this.$route.query.offset as string, 10) || 0) + 1
  }

  @Watch('$route')
  async loadArticles() {
    this.loadingArticle = true
    const { articles, articleCount } = await this.$axios.$get('articles', { params: this.$route.query })
    this.loadingArticle = false
    this.articles = articles
    this.articleCount = articleCount
  }

  changePage(offset: number) {
    this.$router.push({
      query: {
        offset: String(offset - 1)
      }
    })
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
