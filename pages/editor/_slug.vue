<template>
  <div class="editor-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-10 offset-md-1 col-xs-12">
          <form @submit.prevent="publish($event)">
            <fieldset>
              <fieldset class="form-group">
                <input v-model="articleForm.title" type="text" class="form-control form-control-lg" placeholder="Article Title">
              </fieldset>
              <fieldset class="form-group">
                <input v-model="articleForm.description" type="text" class="form-control" placeholder="What's this article about?">
              </fieldset>
              <fieldset class="form-group">
                <textarea v-model="articleForm.body" class="form-control" rows="8" placeholder="Write your article (in markdown)" />
              </fieldset>
              <fieldset class="form-group">
                <input v-model="inputTag" type="text" class="form-control" placeholder="Enter tags" @keydown.enter.prevent="addTag(inputTag)">
                <div class="tag-list">
                  <span v-for="(tag, index) of articleForm.tagList" :key="index" class="tag-default tag-pill">
                    <i class="ion-close-round" @click="removeTag(index)" />
                    {{ tag }}
                  </span>
                </div>
              </fieldset>
              <button class="btn btn-lg pull-xs-right btn-primary" type="submit">
                Publish Article
              </button>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import { Article, ArticleFormData } from '~/models'
import { getFieldsValue } from '~/plugins/utils'

@Component({
  middleware: 'auth',
  async asyncData({ app, params }) {
    if (params.slug) {
      const { article } = await app.$axios.$get(`articles/${params.slug}`)
      return { articleForm: article }
    } else {
      return {
        articleForm: {
          title: '',
          description: '',
          body: '',
          tagList: []
        }
      }
    }
  }
})
export default class EditorPage extends Vue {
  articleForm!: ArticleFormData

  inputTag: string = ''

  async publish() {
    this.$store.commit('clearError')

    try {
      const res = await this.$axios.$post('articles', { article: this.articleForm })
      this.$router.push('/')
    } catch (e) {
      this.$store.commit('pushError', e.response.data)
    }
  }

  addTag(tag: string) {
    this.inputTag = ''

    if (this.articleForm.tagList.includes(tag)) {
      return
    }

    this.articleForm.tagList.push(tag)
  }

  removeTag(index: number) {
    this.articleForm.tagList.splice(index, 1)
  }
}
</script>
