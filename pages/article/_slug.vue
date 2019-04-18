<template>
  <div class="article-page">
    <div class="banner">
      <div class="container">
        <h1>{{ article.title }}</h1>

        <article-meta
          :article="article"
          @follow="follow()"
          @unfollow="unfollow()"
          @favorite="favorite()"
          @unfavorite="unfavorite()"
        />
      </div>
    </div>

    <div class="container page">
      <div class="row article-content">
        <div class="col-md-12">
          <div>
            <p v-html="compiledMarkdown" />
          </div>
          <ul v-if="article.tagList" class="tag-list">
            <li v-for="(tag, i) of article.tagList" :key="i" class="tag-default tag-pill tag-outline">
              <a href="" @click.prevent="searchArticleByTag(tag)">{{ tag }}</a>
            </li>
          </ul>
        </div>
      </div>

      <hr>

      <div class="article-actions">
        <article-meta
          :article="article"
          @follow="follow()"
          @unfollow="unfollow()"
          @favorite="favorite()"
          @unfavorite="unfavorite()"
        />
      </div>

      <div class="row">
        <div class="col-xs-12 col-md-8 offset-md-2">
          <form v-if="loggedIn" class="card comment-form" @submit.prevent="postComment()">
            <div class="card-block">
              <textarea v-model="commentBody" class="form-control" placeholder="Write a comment..." rows="3" />
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

          <div v-if="loadingComments" class="tag-list">
            Loading comments...
          </div>

          <comment-card
            v-for="comment of comments"
            :key="comment.id"
            :comment="comment"
            @remove="removeComment($event)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, namespace } from 'nuxt-property-decorator'
import marked from 'marked'
import CommentCard from '~/components/CommentCard.vue'
import ArticleMeta from '~/components/ArticleMeta.vue'
import { Article, User, CommentForm, Comment } from '~/server/entity'

const auth = namespace('auth')

@Component({
  async asyncData({ app, params }) {
    const { article } = await app.$axios.$get(`/articles/${params.slug}`)

    return {
      article
    }
  },
  components: {
    CommentCard, ArticleMeta
  }
})
export default class ArticlePage extends Vue {
  comments: Comment[] = []
  article!: Article

  commentBody: string = ''
  loadingComments: boolean = false

  @auth.State loggedIn!: boolean
  @auth.State user!: User

  get isAuthor() {
    return this.loggedIn &&
      this.article.author.username === this.user.username
  }

  get slug() {
    return this.$route.params.slug
  }

  beforeMount() {
    this.loadComments()
  }

  get compiledMarkdown() {
    return marked(this.article.body, { sanitize: true })
  }

  searchArticleByTag(tag: string) {
    this.$router.push({
      path: '/',
      query: { tag }
    })
  }

  async loadComments() {
    this.loadingComments = true
    const { comments } = await this.$axios.$get(`/articles/${this.slug}/comments`)
    this.loadingComments = false
    this.comments = comments
  }

  async postComment() {
    const body = this.commentBody

    if (body === '') return

    const commentForm: CommentForm = { body }

    const { comment } = await this.$axios.$post(`/articles/${this.slug}/comments`, { comment: commentForm })
    this.comments.unshift(comment)

    this.commentBody = ''
  }

  async removeComment(id: number) {
    await this.$axios.$delete(`/articles/${this.slug}/comments/${id}`)
    const idx = this.comments.findIndex(v => v.id === id)
    this.comments.splice(idx, 1)
  }

  async removeArticle() {
    if (!this.isAuthor) {
      return this.$router.push('/login')
    }

    await this.$axios.$delete(`/articles/${this.slug}`)
    this.$router.push('/')
  }

  async follow() {
    if (!this.loggedIn) {
      return this.$router.push('/login')
    }

    const username = this.article.author.username

    try {
      const { profile } = await this.$axios.$post(`profiles/${username}/follow`)
      this.article.author.following = true
      this.article.author.followerCount++
    } catch (e) {}
  }

  async unfollow() {
    if (!this.loggedIn) {
      return this.$router.push('/login')
    }

    const username = this.article.author.username

    try {
      const { profile } = await this.$axios.$delete(`profiles/${username}/follow`)
      this.article.author.following = false
      this.article.author.followerCount--
    } catch (e) {}
  }

  async favorite() {
    if (!this.loggedIn) {
      return this.$router.push('/login')
    }

    try {
      const { article } = await this.$axios.$post(`articles/${this.slug}/favorite`)
      this.article = article
    } catch (e) {}
  }

  async unfavorite() {
    if (!this.loggedIn) {
      return this.$router.push('/login')
    }

    try {
      const { article } = await this.$axios.$delete(`articles/${this.slug}/favorite`)
      this.article = article
    } catch (e) {}
  }
}
</script>
