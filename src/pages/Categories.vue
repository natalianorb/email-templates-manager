<template>
  <div class="categories">
    <h1>Категории</h1>
    <div class="header">
      <router-link :to="{ name: 'messages' }">К сообщениям</router-link>
      <button type="button" @click="createCategory">Создать категорию</button>
    </div>
    <Filters
      :title.sync="title"
      :parent-title.sync="parentTitle"
      :has-counter="true"
      :messages-count.sync="messagesCount"
    />
    <CategoriesTable
        :categories="filteredCategories"
        :sort-by="sortBy"
        :ascending="ascending"
        @edit="goEditCategory"
        @select="showCategory"
        @sort="setSorting"
    />

    <paginate
      v-model="page"
      :page-count="totalPages"
      :click-handler="getPage"
      prev-text="Пред."
      next-text="След."
      container-class="pagination"
      page-class="pagination__page"
      >
    </paginate>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import Paginate from 'vuejs-paginate';
import CategoriesTable from '@/components/CategoriesTable.vue';
import Category from '@/classes/Category';
import Filters from '@/components/Filters.vue';
import { compareBy } from '@/utils';

export default {
  name: 'Categories',
  components: {
    CategoriesTable,
    Filters,
    Paginate,
  },
  data() {
    return {
      categories: [],
      page: 0,
      totalPages: 0,
      title: '',
      parentTitle: '',
      messagesCount: null,
      sortBy: 'title',
      ascending: true,
    };
  },
  computed: {
    filteredCategories() {
      const { title, parentTitle, messagesCount } = this;
      const normalizedTitle = title.toLowerCase();
      const normalizedParent = parentTitle.toLowerCase();
      let path;

      // eslint-disable-next-line default-case
      switch (this.sortBy) {
        case 'title':
          path = 'title';
          break;
        case 'parentTitle':
          path = 'parent.title';
          break;
        case 'children':
          path = 'children.size';
          break;
        case 'messages':
          path = 'messages.size';
          break;
      }

      return this.categories.filter((c) => {
        let res = true;

        if (normalizedTitle) {
          res = c.title.toLowerCase().includes(normalizedTitle);
        }
        if (normalizedParent) {
          res = res && c.parent && c.parent.title.toLowerCase().includes(normalizedParent);
        }
        if (typeof messagesCount === 'number') {
          res = res && (c.messages.size === messagesCount);
        }
        return res;
      }).sort((a, b) => (this.ascending ? compareBy(a, b, path) : compareBy(b, a, path)));
    },
  },
  created() {
    this.getCategories();
  },
  methods: {
    ...mapActions([
      'setCategory',
    ]),
    createCategory() {
      this.$router.push({ name: 'categoryEdit', params: { id: '0' } });
    },
    goEditCategory(id) {
      this.$router.push({ name: 'categoryEdit', params: { id: `${id}` } });
    },
    getCategories(params = {}) {
      let hasParents;

      return Category.get(params)
        .then(({ data, totalPages, page }) => {
          this.categories = data.map(d => new Category(d));
          this.totalPages = totalPages;
          this.page = page;
        })
        .then(() => {
          hasParents = this.categories.filter(c => !!c.parent);
          return Category.get({
            conditions: ['id', 'IN', [...new Set(hasParents.map(c => c.parent.id))]],
          });
        })
        .then(({ data }) => {
          hasParents.forEach((c) => {
            const parent = data.find(cat => cat.id === c.parent.id);
            const index = this.categories.findIndex(cat => cat.id === c.id);
            this.$set(this.categories, index, new Category(Object.assign({}, c, { parent })));
          });
        });
    },
    getPage(page) {
      this.getCategories({ page });
    },
    setSorting({ sortBy, ascending }) {
      this.sortBy = sortBy;
      this.ascending = ascending;
    },
    showCategory(id) {
      const cat = this.categories.find(c => c.id === id);
      this.setCategory(cat);
      this.$router.push({ name: 'category', params: { id: `${id}` } });
    },
  },
};
</script>

<style lang="less" scoped>
  @import "../assets/styles/variables";
  .categories {
    width: 90%;
    max-width: 1100px;
    margin: 0 auto;
    padding: 40px 0;

    .filters {
      margin-top: 30px;
    }
  }
</style>
