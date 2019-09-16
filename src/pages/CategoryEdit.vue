<template>
  <div :key="id" class="category-edit">
    <h2 v-if="isEditing">Редактирование категории</h2>
    <h2 v-else >Категория</h2>
    <h1 class="category-edit__page-title">{{ category.title }}</h1>
    <div class="header" v-if="id !== '0'">
      <router-link :to="{ name: 'categoryMessages', params: { id } }">
        К сообщениям категории
      </router-link>
    </div>
    <div class="category-edit__top">
      <div class="category-edit__title">
        <label>
          <div>Название</div>
          <input v-model="title" :disabled="!isEditing" class="category-edit__input" />
          <div :class="['error', { visible: $v && $v.title && $v.title.$invalid }]">
            Слишком длинное название
          </div>
        </label>
      </div>
      <div class="category-edit__parent">
        <SearchSelect
          v-if="isEditing"
          :searching-value="parentTitle"
          searching-prop="title"
          :options="parents"
          :required="false"
          label="Название родительской категории"
          @input="onInputParent"
          @blur="onBlur"
          @select="onSelectParent"
          @error="parentError = $event"
        >
          <template v-slot:default="slotProps">
            <div>
              {{ slotProps.option.title }}
            </div>
          </template>
        </SearchSelect>
        <div v-else>
          <span>Родительская категория:</span>
          <div>{{ category.parent && category.parent.title }}</div>
        </div>
        <div :class="[ 'error', { visible: !!parentError } ]" >{{ parentError }}</div>
      </div>
    </div>
    <div class="category-edit__children">
      <template  v-if="children">
        <h2>
          Количество подкатегорий: {{ children.length }}
        </h2>
        <CategoriesTable
          v-if="children.length"
          :categories="children"
          @edit="goEditCategory"
          />
      </template>
    </div>
    <div class="category-edit__messages">
      <h2 v-if="category.messages">Количество сообщений: {{ category.messages.size }}</h2>
    </div>
    <div v-if="isEditing" class="category-edit__buttons">
      <button
        class="category-edit__save"
        :disabled="saveDisabled"
        type="button"
        @click.stop="debouncedSave"
      >
        Сохранить
      </button>
      <button
        v-if="category.id"
        class="category-edit__save"
        type="button"
        @click="isModalVisible = true"
      >
        Удалить
      </button>
      <button class="category-edit__cancel"  type="button" @click.stop="onCancel">
      </button>
    </div>
    <div v-else>
      <button class="category-edit__edit" type="button" @click.stop="isEditing = true">
        Изменить
      </button>
    </div>
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
import { mapActions, mapState } from 'vuex';
import { debounce } from 'lodash';
import SimpleModal from 'simple-modal-vue';
import { maxLength } from 'vuelidate/lib/validators';
import SearchSelect from '@/components/SearchSelect.vue';
import searchCategory from '@/mixins/searchCategory';
import Category from '@/classes/Category';
import CategoriesTable from '@/components/CategoriesTable.vue';

export default {
  mixins: [searchCategory],
  components: { CategoriesTable, SearchSelect, SimpleModal },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  validations() {
    return {
      title: {
        maxLength: maxLength(255),
      },
    };
  },
  data() {
    return {
      title: '',
      children: [],
      messages: [],
      isModalVisible: false,
      isSecondConfirmVisible: false,
      isEditing: true,
    };
  },
  computed: {
    ...mapState({
      category: state => state.category,
    }),
    saveDisabled() {
      if (!this.$v) {
        return true;
      }
      const { $v } = this;

      return ($v && $v.title && $v.title.$invalid) || !!this.parentError;
    },
    showNextConfirm() {
      return this.category
        && this.category.children
        && this.category.messages
        && (this.category.children.size || this.category.messages.size);
    },
  },
  watch: {
    id: {
      deep: true,
      handler(newVal, oldVal) {
        if (oldVal !== '0') {
          this.initializeCategory();
        }
      },
    },
    category: {
      deep: true,
      handler(newVal, oldVal) {
        if (newVal.parent && newVal.parent.title && (!oldVal.parent || !oldVal.parent.title)) {
          this.parent = newVal.parent;
          this.parentTitle = newVal.parent.title;
        }
      },
    },
  },
  created() {
    this.debouncedSave = debounce(this.saveCategory, 300);
    this.debouncedDelete = debounce(this.deleteCategory, 300);
    this.initializeCategory();
  },
  methods: {
    ...mapActions([
      'setCategory',
    ]),
    initializeCategory() {
      Category.getById({ id: this.id })
        .then((res) => {
          this.setCategory(new Category(res));
          const {
            title, parent, messages,
          } = this.category;
          this.title = title;
          this.messages = messages;

          if (parent) {
            this.getParent();
          } else {
            this.parent = null;
            this.parentTitle = '';
          }
          this.getChildren();
        });
    },
    doubleCheck() {
      if (this.showNextConfirm && !this.isSecondConfirmVisible) {
        this.isSecondConfirmVisible = true;
        return;
      }
      this.deleteCategory();
    },
    deleteCategory() {
      this.category.delete()
        .then(() => {
          this.isModalVisible = false;
          this.isSecondConfirmVisible = false;
          this.$router.go(-1);
        });
    },
    getChildren() {
      const p = [];
      this.category.children.forEach((c) => {
        p.push(Category.getById({ id: c.id }));
      });
      return Promise.all(p)
        .then((data) => {
          this.children = data;
          this.children.forEach((c) => {
            // eslint-disable-next-line no-param-reassign
            c.parent = this.category;
          });
        });
    },
    getParent() {
      if (!this.category || !this.category.parent) {
        return;
      }
      Category.getById({ id: this.category.parent.id })
        .then((res) => {
          this.parent = new Category(res);
          this.parentTitle = this.parent.title;
        });
    },
    goEditCategory(id) {
      this.$router.push({ name: 'categoryEdit', params: { id: `${id}` } });
    },
    onCancel() {
      this.$router.go(-1);
    },
    saveCategory() {
      const {
        id, title, parent, children, messages,
      } = this;
      const clientData = {
        id,
        title,
        children,
        messages,
        parent,
      };
      const savingData = {
        id,
        title,
        messages,
      };

      savingData.parent = parent ? { id: parent.id } : null;
      savingData.children = children.length ? children.map(c => ({ id: c.id })) : [];
      if (this.id !== '0') {
        this.category.update(savingData)
          .then(() => {
            this.setCategory(clientData);
            this.isEditing = false;
          });
        return;
      }

      const newCategory = new Category(clientData);
      newCategory.create(savingData)
        .then((res) => {
          this.isEditing = false;
          const primaryKey = res['Primary key'];
          clientData.id = primaryKey.id;
          this.setCategory(clientData);
          this.$router.replace({
            name: 'categoryEdit',
            params: {
              id: `${primaryKey.id}`,
            },
          });
        });
    },
    searchParent(title) {
      if (!title) {
        return;
      }
      Category.getByTitle({ title }).then((res) => {
        this.parents = res.filter(c => c.id !== this.category.id);
      });
    },
  },
};
</script>

<style lang="less">
  @import "../assets/styles/variables";

  .category-edit {
    width: 90%;
    max-width: 1100px;
    margin: 0 auto;
    padding: 40px 0;
    &__page-title {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    &__top {
      @media screen and (min-width: @laptop) {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }
    &__title,
    &__parent {
      width: 38%;
      max-width: 420px;
    }
    input {
      margin-top: 5px;
    }
    &__input {
      width: 100%;
      background-color:  #fff;
    }
    &__parent {
      margin-top: 20px;
      text-align: left;
    }
    &__children {
    }
    &__buttons {
      width: 200px;
      button {
        margin: 0 4px;
      }
    }
    &__cancel {
      width: 20px;
      height: 20px;
      background: url('../assets/images/close.svg') center/14px no-repeat #fff;
    }
    .error {
      opacity: 0;
      height: 14px;
      color: transparent;
      font-size: 12px;
      &.visible {
        opacity: 1;
        color: red;
      }
    }
    .search-select {
      text-align: left;
    }
  }
</style>
