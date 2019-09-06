<template>
  <table class="categories">
    <tr class="categories__head">
      <td>Название</td>
      <td>Родительская категория</td>
      <td>Подкатегории</td>
      <td colspan="2">Сообщения</td>
    </tr>
    <tr is="CategoryEdit"
        v-for="category in categories"
        :key="category.id"
        :is-editing="false"
        :category="category"
        @select="showCategory"
        @save="saveCategory"
    />
  </table>
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
      category: new Category(),
      categories: [],
    };
  },
  created() {
    this.getCategories();
  },
  methods: {
    ...mapActions([
      'setCategory',
    ]),
    getCategories() {
      Category.getSome()
        .then((res) => {
          this.categories = res.data.map(d => new Category(d));
        });
    },
    saveCategory(data) {
      this.category.create(data)
        .then((res) => {
          const primaryKey = res['Primary key'];
          this.category.id = primaryKey && primaryKey.id;
        });
    },
    showCategory(id) {
      const cat = this.categories.find(c => c.id === id);
      this.setCategory(cat);
      this.$router.push({ name: 'category', params: { id } });
    },
  },
};
</script>

<style lang="less" scoped>
.categories {
  border-collapse: collapse;
  &__head {
    color: #2c3e50;
    td {
      padding: 4px;
    }
  }
}
</style>
