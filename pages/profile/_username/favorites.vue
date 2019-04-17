<template>
  <div v-if="loadingArticle">
    Loading articles...
  </div>

  <div v-else-if="articleCount === 0">
    No articles are here... yet.
  </div>

  <div v-else>
    <article-preview v-for="(article, i) of articles" :key="i" :article="article" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import ArticlePreview from '~/components/ArticlePreview.vue'
import { ArticleSearchParams, Article } from '~/models'

@Component({
  components: {
    ArticlePreview
  }
})
export default class ProfileArticleFavoriesPage extends Vue {
  loadingArticle: boolean = false
  articles: Article[] = []
  articleCount: number = 0

  beforeMount() {
    this.loadArticles()
  }

  get username() {
    return this.$route.params.username
  }

  get articleParams(): ArticleSearchParams {
    return {
      favorited: this.username
    }
  }

  async loadArticles() {
    this.loadingArticle = true
    const { articles, articleCount } = await this.$axios.$get('articles', { params: this.articleParams })
    this.loadingArticle = false
    this.articles = articles
    this.articleCount = articleCount
  }
}
</script>
