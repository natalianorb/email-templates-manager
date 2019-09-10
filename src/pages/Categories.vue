<template>
  <div class="categories">
    <button type="button" @click="createCategory">Создать категорию</button>
    <table class="categories__table">
      <tr class="categories__head">
        <td>Название</td>
        <td>Родительская категория</td>
        <td>Подкатегории</td>
        <td colspan="2">Сообщения</td>
      </tr>
      <tr v-if="isCreating"
          is="CategoryEdit"
          :is-editing="isCreating"
          :category="createdCategory"
          @cancel="isCreating = false"
          @save="saveCategory(createdCategory, $event)"
      />
      <tr is="CategoryEdit"
          v-for="category in categories"
          :key="category.id"
          :is-editing="category.id === editingCategoryId"
          :is-change-disabled="!!editingCategoryId && category.id !== editingCategoryId"
          :category="category"
          @cancel="editingCategoryId = 0"
          @edit="editingCategoryId = $event"
          @save="saveCategory(category, $event)"
          @select="showCategory"
      />
    </table>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import CategoryEdit from '@/components/CategoryEdit.vue';
import Category from '@/classes/Category';

export default {
  name: 'Categories',
  components: {
    CategoryEdit,
  },
  data() {
    return {
      createdCategory: new Category(),
      categories: [],
      isCreating: false,
      editingCategoryId: 0,
    };
  },
  created() {
    this.getCategories();
  },
  methods: {
    ...mapActions([
      'setCategory',
    ]),
    createCategory() {
      this.isCreating = true;
    },
    getCategories() {
      Category.getSome({ perPage: 15 })
        .then((res) => {
          this.categories = res.data.map(d => new Category(d));
        });
    },
    saveCategory(category, data) {
      if (category.id) {
        category.update(data)
          .then(() => {
            this.editingCategoryId = 0;
          });
        return;
      }
      category.create(data)
        .then((res) => {
          const primaryKey = res['Primary key'];
          this.category.id = primaryKey && primaryKey.id;
          this.isCreating = false;
        });
    },
    showCategory(id) {
      if (this.editingCategoryId) {
        return;
      }
      const cat = this.categories.find(c => c.id === id);
      this.setCategory(cat);
      this.$router.push({ name: 'category', params: { id } });
    },
  },
};
</script>

<style lang="less" scoped>
  @import "../assets/styles/colors";
.categories {
  &__table {
    border-collapse: collapse;
  }
  &__head {
    color: @text-color;
    td {
      padding: 10px 4px 4px;
    }
  }
}
</style>
