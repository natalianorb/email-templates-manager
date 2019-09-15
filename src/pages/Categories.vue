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
    <div class="categories__table-wrapper">
      <div class="categories__overflow">
        <table class="categories__table">
          <tr class="categories__head">
            <td class="categories__title">
              <button
                :class="['categories__sort', { sorted: sortBy === 'title', ascending }]"
                type="button" @click="sortBy = 'title'; ascending = !ascending">
                Название
              </button>
            </td>
            <td>
              <button
                :class="['categories__sort', { sorted: sortBy === 'parentTitle', ascending }]"
                type="button" @click="sortBy = 'parentTitle'; ascending = !ascending">
                Родительская категория
              </button>
            </td>
            <td class="categories__children-column">
              <button
                :class="['categories__sort', { sorted: sortBy === 'children', ascending }]"
                type="button" @click="sortBy = 'children'; ascending = !ascending">
                Подкатегории
              </button>
            </td>
            <td>
              <button
                :class="['categories__sort', { sorted: sortBy === 'messages', ascending }]"
                type="button" @click="sortBy = 'messages'; ascending = !ascending">
                Сообщения
              </button>
            </td>
            <td></td>
          </tr>
          <tr is="CategoryView"
              v-for="category in filteredCategories"
              :key="category.id"
              :category="category"
              @edit="goEditCategory"
              @select="showCategory"
          />
        </table>
      </div>
    </div>

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
import CategoryView from '@/components/CategoryView.vue';
import Category from '@/classes/Category';
import Filters from '@/components/Filters.vue';
import { compareBy } from '@/utils';

export default {
  name: 'Categories',
  components: {
    CategoryView,
    Filters,
    Paginate,
  },
  data() {
    return {
      categories: [],
      deletingCategoryId: 0,
      editingCategoryId: 0,
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
    deletingCategory() {
      return this.categories.find(c => c.id === this.deletingCategoryId);
    },
    showNextConfirm() {
      return this.deletingCategory
        && (this.deletingCategory.children.size || this.deletingCategory.messages.size);
    },
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
    &__table-wrapper {
      position: relative;
      padding-left: @table-first-col;
      @media screen and (min-width: @laptop) {
        padding-left: 0;
      }
    }
    &__overflow {
      width: 100%;
      overflow-x: auto;
      overflow-y: hidden;
    }
    &__table {
      width: 100%;
      margin-top: 20px;
    }
    &__head {
      color: @text-color;
      td {
        padding: 10px 0;
      }
    }
    &__title {
      position: absolute;
      left: 0;
      top: auto;
      min-width: @table-first-col;
      width: @table-first-col;
      @media screen and (min-width: @laptop) {
        position: static;
      }
    }
    &__children-column {
      max-width: 100px;
    }
    &__sort {
      border: none;
      &.sorted:after {
        display: inline-block;
        width: 10px;
        height: 10px;
        margin-left: 5px;
        content: '';
        background: url('../assets/images/angle.svg') right center/10px no-repeat;
      }
      &.ascending {
        &:after {
          transform: rotate(180deg);
        }
      }
    }
    .filters {
      margin-top: 30px;
    }
  }
</style>
