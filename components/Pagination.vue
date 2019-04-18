<template lang="html">
  <nav v-show="isShow">
    <ul class="pagination">
      <li v-if="isShowEdge" class="page-item" :class="{disabled: currentPage === 1}">
        <a href="" class="page-link" @click.prevent="onChange(1)">
          {{ previousText }}
        </a>
      </li>

      <li v-for="(page, idx) in pages" :key="idx" class="page-item" :class="{active: page === currentPage}">
        <a href="" class="page-link" @click.prevent="onChange(page)">
          {{ page }}
        </a>
      </li>

      <li v-if="isShowEdge" class="page-item" :class="{disabled: currentPage === totalPages}">
        <a href="" class="page-link" @click.prevent="onChange(totalPages)">
          {{ nextText }}
        </a>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  props: {
    perPage: {
      type: Number,
      default: 10
    },
    total: {
      type: Number,
      require: true,
      default: 0
    },
    currentPage: {
      type: Number,
      require: true,
      default: 0
    },
    previousText: {
      type: String,
      default: '«'
    },
    nextText: {
      type: String,
      default: '»'
    },
    pageSize: {
      type: Number,
      default: 10
    }
  },
  data() {
    return {
      startPage: 0,
      endPage: 0
    }
  },
  computed: {
    totalPages() {
      // calculate total pages
      return Math.ceil(this.total / this.perPage)
    },
    pages() {
      const totalPages = this.totalPages
      const currentPage = this.currentPage
      const pageSize = this.pageSize
      const pageCeil = Math.ceil(pageSize / 2)
      const isOddPageSize = pageSize % 2 === 0

      let startPage, endPage
      if (totalPages <= pageSize) {
        startPage = 1
        endPage = totalPages
      } else if (currentPage <= pageCeil) {
        startPage = 1
        endPage = pageSize
      } else if (currentPage + pageCeil - 1 >= totalPages) {
        startPage = totalPages - pageSize + 1
        endPage = totalPages
      } else {
        startPage = currentPage - pageCeil + (isOddPageSize ? 0 : 1)
        endPage = currentPage + pageCeil - 1
      }

      const length = endPage - startPage + 1
      return Array.from({ length }, (v, i) => i + startPage)
    },
    isShow() {
      return this.totalPages > 1
    },
    isShowEdge() {
      return this.totalPages > this.pageSize
    }
  },
  methods: {
    onChange(page) {
      if (page === this.currentPage) { return }

      this.$emit('change', page)
    }
  }
}
</script>

<style lang="css">
</style>
