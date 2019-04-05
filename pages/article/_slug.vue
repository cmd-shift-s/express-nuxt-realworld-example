<template>
  <div class="article-page">
    <div class="banner">
      <div class="container">
        <h1>{{ article.title }}</h1>

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
            <button class="btn btn-sm btn-outline-secondary">
              <i class="ion-plus-round" />
              &nbsp;
              Follow {{ article.author.username }}<span class="counter">(10)</span>
            </button>
          &nbsp;&nbsp;
            <button class="btn btn-sm btn-outline-primary">
              <i class="ion-heart" />
              &nbsp;
              Favorite Post <span class="counter">(29)</span>
            </button>
          </template>
        </div>
      </div>
    </div>

    <div class="container page">
      <div class="row article-content">
        <div class="col-md-12">
          {{ article.body }}
        </div>
      </div>

      <hr>

      <div class="article-actions">
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
            <button class="btn btn-sm btn-outline-secondary">
              <i class="ion-plus-round" />
              &nbsp;
              Follow {{ article.author.username }}<span class="counter">(10)</span>
            </button>
          &nbsp;&nbsp;
            <button class="btn btn-sm btn-outline-primary">
              <i class="ion-heart" />
              &nbsp;
              Favorite Post <span class="counter">(29)</span>
            </button>
          </template>
        </div>
      </div>

      <div class="row">
        <div class="col-xs-12 col-md-8 offset-md-2">
          <form v-if="loggedIn" class="card comment-form">
            <div class="card-block">
              <textarea class="form-control" placeholder="Write a comment..." rows="3" />
            </div>
            <div class="card-footer">
              <img :src="user.image" class="comment-author-img">
              <button class="btn btn-sm btn-primary">
                Post Comment
              </button>
            </div>
          </form>

          <p v-else>
            <n-link to="/login">
              Sign in
            </n-link>
            or
            <n-link to="/register">
              sign up
            </n-link> to add comments on this article.
          </p>

          <comment-card
            v-for="comment of comments"
            :key="comment.id"
            :comment="comment"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, namespace } from 'nuxt-property-decorator'
import CommentCard from '~/components/CommentCard.vue'
import { Article, Comment } from '~/models'
import { User } from '~/server/entity'

const auth = namespace('auth')

@Component({
  async asyncData({ app, params }) {
    const [{ article }, { comments }] = await Promise.all([
      app.$axios.$get(`/articles/${params.slug}`),
      app.$axios.$get(`/articles/${params.slug}/comments`)
    ])

    return {
      article,
      comments
    }
  },
  components: {
    CommentCard
  }
})
export default class ArticlePage extends Vue {
  comments!: Comment[]
  article!: Article

  @auth.State loggedIn!: boolean
  @auth.State user!: User

  get isAuthor() {
    return this.loggedIn &&
      this.article.author.username === this.user.username
  }

  async removeArticle() {
    if (!this.isAuthor) {
      return this.$router.push('/login')
    }

    const slug = this.article.slug

    await this.$axios.$delete(`/articles/${slug}`)
    this.$router.push('/')
  }
}
</script>
