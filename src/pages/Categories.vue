<template>
  <div class="categories">
    <CategoryEdit
      v-for="category in categories"
      :key="category.id"
      :is-editing="false"
      :category="category"
      @select="showCategory"
      @submit="saveCategory"/>
  </div>
</template>

<script>
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
    getCategories(params = { perPage: 10 }) {
      Category.getSome(params)
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
      this.$router.push({ name: 'category', params: { id } });
    },
  },
};
</script>

<style scoped>

</style>
