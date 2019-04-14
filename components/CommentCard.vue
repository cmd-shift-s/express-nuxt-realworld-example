<template lang="html">
  <div class="card">
    <div class="card-block">
      <p class="card-text">
        {{ comment.body }}
      </p>
    </div>
    <div class="card-footer">
      <n-link :to="'/profile/' + comment.author.username" class="comment-author">
        <img :src="comment.author.image" class="comment-author-img">
      </n-link>
    &nbsp;
      <n-link :to="'/profile/' + comment.author.username" class="comment-author">
        {{ comment.author.username }}
      </n-link>
      <span class="date-posted">{{ comment.createdAt | date('MMM Do') }}</span>
      <span v-if="isOwner" class="mod-options">
        <!-- <i class="ion-edit" /> -->
        <i class="ion-trash-a" @click="$emit('remove', comment.id)" />
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, namespace } from 'nuxt-property-decorator'
import { Comment, User } from '~/server/entity'

const auth = namespace('auth')

@Component
export default class CommentCard extends Vue {
  @Prop({ required: true }) comment!: Comment

  @auth.State loggedIn!: boolean
  @auth.State user!: User

  get isOwner() {
    return this.loggedIn &&
      this.comment.author.id === this.user.id
  }
}
</script>

<style lang="css" scoped>
</style>
