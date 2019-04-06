<template lang="html">
  <div class="article-meta">
    <n-link :to="`/profile/${article.author.username}`">
      <img :src="article.author.image">
    </n-link>
    <div class="info">
      <n-link :to="`/profile/${article.author.username}`" class="author">
        {{ article.author.username }}
      </n-link>
      <span class="date">{{ article.createdAt | date }}</span>
    </div>

    <template v-if="isAuthor">
      <n-link :to="`/editor/${article.slug}`" class="btn btn-sm btn-outline-secondary">
        <i class="ion-edit" />
        &nbsp;
        Edit Article
      </n-link>
      &nbsp;&nbsp;
      <button class="btn btn-sm btn-outline-danger" @click="removeArticle()">
        <i class="ion-trash-a" />
        &nbsp;
        Delete Article
      </button>
    </template>
    <template v-else>
      <button v-if="article.author.following" class="btn btn-sm btn-secondary" @click="$emit('unfollow')">
        <i class="ion-minus-round" />
        &nbsp;
        Unfollow {{ article.author.username }}<span class="counter">({{ article.author.followerCount }})</span>
      </button>
      <button v-else class="btn btn-sm btn-outline-secondary" @click="$emit('follow')">
        <i class="ion-plus-round" />
        &nbsp;
        Follow {{ article.author.username }}<span class="counter">({{ article.author.followerCount }})</span>
      </button>
      &nbsp;&nbsp;
      <button v-if="article.favorited" class="btn btn-sm btn-primary" @click="$emit('unfavorite')">
        <i class="ion-heart" />
        &nbsp;
        Unfavorite Post <span class="counter">({{ article.favoritesCount }})</span>
      </button>
      <button v-else class="btn btn-sm btn-outline-primary" @click="$emit('favorite')">
        <i class="ion-heart" />
        &nbsp;
        Favorite Post <span class="counter">({{ article.favoritesCount }})</span>
      </button>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, namespace } from 'nuxt-property-decorator'
import { User, Article } from '~/server/entity'

const auth = namespace('auth')

@Component
export default class ArticlePreview extends Vue {
  @Prop({ required: true }) article!: Article

  @auth.State loggedIn!: boolean
  @auth.State user!: User

  get isAuthor() {
    return this.loggedIn &&
      this.article.author.username === this.user.username
  }
}
</script>

<style lang="css" scoped>
</style>
