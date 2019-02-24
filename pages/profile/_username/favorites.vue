<template>
  <div>
    <article-preview v-for="(article, i) of articles" :key="i" :article="article" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import ArticlePreview from '~/components/ArticlePreview.vue'

@Component({
  async asyncData({ app }) {
    const { articles, articleCount } = await app.$axios
      .$get('articles', { params: { limit: 10 } })
    return {
      articles,
      articleCount
    }
  },
  components: {
    ArticlePreview
  }
})
export default class ProfileArticleFavoriesPage extends Vue {
}
</script>
