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
          @save="debouncedSave(createdCategory, $event)"
      />
      <tr is="CategoryEdit"
          v-for="category in categories"
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
import CategoryEdit from '@/components/CategoryEdit.vue';
import Category from '@/classes/Category';

export default {
  name: 'Categories',
  components: {
    CategoryEdit,
    SimpleModal,
  },
  data() {
    return {
      createdCategory: new Category(),
      categories: [],
      deletingCategoryId: 0,
      isCreating: false,
      isModalVisible: false,
      editingCategoryId: 0,
      isSecondConfirmVisible: false,
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
.modal {
  &__buttons {
    margin-top: 20px;
  }
}
</style>
