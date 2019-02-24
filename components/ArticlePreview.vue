<template>
  <div class="article-preview">
    <div v-if="article.author" class="article-meta">
      <n-link :to="`/profile/${article.author.username}`">
        <img :src="article.author.image">
      </n-link>
      <div class="info">
        <n-link :to="`/profile/${article.author.username}`" class="author">
          {{ article.author.username }}
        </n-link>
        <span class="date">{{ article.createdAt | date }}</span>
      </div>
      <button class="btn btn-sm pull-xs-right" :class="favoriteButtonClass">
        <i class="ion-heart" /> {{ article.favoritesCount }}
      </button>
      <n-link :to="`/article/${article.slug}`" class="preview-link">
        <h1>{{ article.title }}</h1>
        <p>{{ article.description }}</p>
        <span>Read more...</span>
        <ul v-if="article.tagList" class="tag-list">
          <li v-for="(tag, i) of article.tagList" :key="i" class="tag-default tag-pill tag-outline">
            {{ tag }}
          </li>
        </ul>
      </n-link>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import { Article } from '~/models'

@Component
export default class ArticlePreview extends Vue {
  @Prop({ required: true }) article!: Article

  get favoriteButtonClass() {
    return [
      this.article.favorited ? 'btn-primary' : 'btn-outline-primary'
    ]
  }
}

</script>

<style lang="css" scoped>
</style>
