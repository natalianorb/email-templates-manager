<template>
  <div class="categories">
    <router-link :to="{ name: 'messages' }">К сообщениям</router-link>
    <button type="button" @click="createCategory">Создать категорию</button>
    <Filters
      :title.sync="title"
      :parent-title.sync="parentTitle"
      :has-counter="true"
      :messages-count.sync="messagesCount"
    />
    <table class="categories__table">
      <tr class="categories__head">
        <td>
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
        <td>
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
      <tr v-if="isCreating"
          is="CategoryEdit"
          :is-editing="isCreating"
          :category="createdCategory"
          @cancel="isCreating = false"
          @save="debouncedSave(createdCategory, $event)"
      />
      <tr is="CategoryEdit"
          v-for="category in filteredCategories"
          :key="category.id"
          :is-editing="category.id === editingCategoryId"
          :is-change-disabled="!!editingCategoryId && category.id !== editingCategoryId"
          :category="category"
          @cancel="editingCategoryId = 0"
          @delete="deletingCategoryId = $event; isModalVisible = true"
          @edit="editingCategoryId = $event"
          @save="debouncedSave(category, $event)"
          @select="showCategory"
      />
    </table>
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
    <simple-modal
      v-model="isModalVisible"
      size="small"
      title="Действительно удалить?"
      class="modal">
      <template v-if="!isSecondConfirmVisible" slot="body">
        <div>Пожалуйста, подтвердите удаление</div>
        <div class="modal__buttons">
          <button type="button" @click="doubleCheck">Удалить</button>
        </div>
      </template>
      <template v-else slot="body">
        <div>Данная категория содержит сообщения или другие категории</div>
        <div class="modal__buttons">
          <button type="button" @click="debouncedDelete">Все равно удалить</button>
        </div>
      </template>
    </simple-modal>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import SimpleModal from 'simple-modal-vue';
import { debounce } from 'lodash';
import Paginate from 'vuejs-paginate';
import CategoryEdit from '@/components/CategoryEdit.vue';
import Category from '@/classes/Category';
import Filters from '@/components/Filters.vue';
import { compareBy } from '@/utils';

export default {
  name: 'Categories',
  components: {
    CategoryEdit,
    Filters,
    Paginate,
    SimpleModal,
  },
  data() {
    return {
      createdCategory: {},
      categories: [],
      deletingCategoryId: 0,
      isCreating: false,
      isModalVisible: false,
      editingCategoryId: 0,
      isSecondConfirmVisible: false,
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
    this.debouncedSave = debounce(this.saveCategory, 300);
    this.debouncedDelete = debounce(this.deleteCategory, 300);
  },
  methods: {
    ...mapActions([
      'setCategory',
    ]),
    createCategory() {
      this.isCreating = true;
      this.createdCategory = new Category();
    },
    doubleCheck() {
      if (this.showNextConfirm && !this.isSecondConfirmVisible) {
        this.isSecondConfirmVisible = true;
        return;
      }
      this.deleteCategory();
    },
    deleteCategory() {
      const catIndex = this.categories.findIndex(c => c.id === this.deletingCategoryId);

      if (catIndex > -1) {
        this.deletingCategory.delete()
          .then(() => {
            this.editingCategoryId = 0;
            this.isModalVisible = false;
            this.deletingCategoryId = 0;
            this.categories.splice(catIndex, 1);
            this.isSecondConfirmVisible = false;
          });
      }
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
    saveCategory(category, data) {
      const savingData = Object.assign({}, data);

      savingData.parent = data.parent ? { id: data.parent.id } : null;
      if (category.id) {
        category.update(savingData)
          .then(() => {
            this.editingCategoryId = 0;
            const index = this.categories.findIndex(cat => cat.id === category.id);
            this.$set(this.categories, index, new Category(data));
          });
        return;
      }

      this.createdCategory = new Category(data);
      category.create(savingData)
        .then((res) => {
          const primaryKey = res['Primary key'];
          this.createdCategory.id = primaryKey && primaryKey.id;
          this.isCreating = false;
          this.categories.unshift(this.createdCategory);
        });
    },
    showCategory(id) {
      if (this.isCreating || this.editingCategoryId) {
        return;
      }
      const cat = this.categories.find(c => c.id === id);
      this.setCategory(cat);
      this.$router.push({ name: 'category', params: { id: `${id}` } });
    },
  },
};
</script>

<style lang="less" scoped>
  @import "../assets/styles/colors";
.categories {
  width: 90%;
  min-width: 900px;
  max-width: 1100px;
  margin: 0 auto;
  padding: 40px 0;
  &__table {
    width: 100%;
    margin-top: 20px;
    border-collapse: collapse;
  }
  &__head {
    color: @text-color;
    td {
      padding: 10px 4px;
    }
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
