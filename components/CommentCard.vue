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
        <i class="ion-edit" />
        <i class="ion-trash-a" />
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Comment } from '~/models'

@Component
export default class CommentCard extends Vue {
  @Prop({ required: true }) comment!: Comment

  get isOwner() {
    return Math.round(Math.random())
  }
}
</script>

<style lang="css" scoped>
</style>
