<template>
  <tr :class="{ 'category-edit': true, active: isEditing }"  @click="onSelect">
    <td>
      <input class="category-edit__input" v-model="title" :disabled="!isEditing" type="text">
    </td>
    <td class="category-edit__parent">
      <SearchSelect
        v-if="isEditing"
        :searching-value="parentTitle"
        searching-prop="title"
        :options="parents"
        :required="false"
        placeholder="Название"
        @input="onInputParent"
        @blur="onBlur"
        @select="onSelectParent"
        @error="error = $event"
      >
        <template v-slot:default="slotProps">
          <div>
            {{ slotProps.option.title }}
          </div>
        </template>
      </SearchSelect>
      <div v-else-if="parent">{{ parent.title }}</div>
      <div :class="[ 'error', { visible: !!error } ]" >{{ error }}</div>
    </td>
    <td class="category-edit__children">{{ category.children.size }}</td>
    <td class="category-edit__messages">{{ category.messages.size }}</td>
    <td class="category-edit__buttons">
      <template v-if="isEditing">
        <button class="category-edit__save" :disabled="!!error" type="button" @click.stop="onSave">
          Сохранить
        </button>
        <button class="category-edit__save"  type="button" @click.stop="onCancel">
          Отмена
        </button>
      </template>
      <button
        v-else
        class="category-edit__save"
        :disabled="isChangeDisabled"
        type="button"
        @click.stop="onEdit"
      >
        Изменить
      </button>
    </td>
  </tr>
</template>

<script>
import { debounce } from 'lodash';
import SearchSelect from '@/components/SearchSelect.vue';
import Category from '@/classes/Category';

export default {
  components: { SearchSelect },
  props: {
    category: {
      type: Object,
      default() {
        return {
          title: '',
        };
      },
    },
    isEditing: {
      type: Boolean,
      default: false,
    },
    isChangeDisabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      error: '',
      id: '',
      title: '',
      parent: null,
      parents: [],
      parentTitle: '',
      children: [],
      messages: [],
    };
  },
  created() {
    this.init();

    this.debouncedsearchParent = debounce(this.searchParent, 300);
  },
  methods: {
    init() {
      const {
        id, title, parent, children, messages,
      } = this.category;
      this.id = id;
      this.title = title;
      this.children = children;
      this.messages = messages;

      if (parent) {
        Category.getById({ id: parent.id }).then((res) => {
          this.parent = new Category(res);
          this.parentTitle = this.parent.title;
        });
      } else {
        this.parent = null;
        this.parentTitle = '';
      }
    },
    onBlur(e) {
      if (this.error) {
        return;
      }
      if (e.target && e.target.value && !this.parent) {
        this.error = 'Проверьте текст на корректность';
      }
    },
    onCancel() {
      this.$emit('cancel');
      this.error = '';
      this.init();
    },
    onEdit() {
      this.$emit('edit', this.category.id);
    },
    onInputParent(val) {
      this.parentTitle = val;
      if (!this.error) {
        this.debouncedsearchParent(val);
      }
    },
    onSelect() {
      if (!this.isEditing) {
        this.$emit('select', this.category.id);
      }
    },
    onSelectParent(category) {
      this.error = '';
      this.parentTitle = category.title;
      this.parent = category;
    },
    onSave() {
      const {
        id, title, parent, children, messages,
      } = this;
      this.$emit('save', {
        id,
        title,
        children,
        messages,
        parent: parent ? { id: parent.id } : null,
      });
    },
    searchParent(title) {
      const trimmed = title.trim();
      if (!trimmed) {
        return;
      }
      Category.getByTitle({ title: trimmed }).then((res) => {
        this.parents = res;
      });
    },
  },
};
</script>

<style scoped lang="less">
.category-edit {
  height: 50px;
  &:hover {
    background-color:  rgba(7, 16, 28, 0.1);
  }
  &.active {
    background-color:  rgba(7, 16, 28, 0.1);
  }
  td {
    padding: 10px 4px 4px;
    vertical-align: baseline;
  }
  &__parent {
    width: 230px;
    text-align: left;
  }
  &__input {
    background-color:  #fff;
  }
  &__buttons {
    width: 165px;
    button {
      margin: 0 4px;
    }
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
