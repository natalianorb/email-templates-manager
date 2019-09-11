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
      <input v-else-if="category.parent" :value="category.parent.title" disabled/>
      <div :class="[ 'error', { visible: !!error } ]" >{{ error }}</div>
    </td>
    <td class="category-edit__children">{{ category.children.size }}</td>
    <td class="category-edit__messages">{{ category.messages.size }}</td>
    <td class="category-edit__buttons">
      <template v-if="isEditing">
        <button class="category-edit__save" :disabled="!!error" type="button" @click.stop="onSave">
          Сохранить
        </button>
        <button
          v-if="category.id"
          class="category-edit__save"
          type="button"
          @click.stop="onDelete"
        >
          Удалить
        </button>
        <button class="category-edit__cancel"  type="button" @click.stop="onCancel">
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
  watch: {
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
        this.parent = parent;
        this.parentTitle = parent.title;
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
        this.error = 'Проверьте корректность ввода';
      }
    },
    onCancel() {
      this.$emit('cancel');
      this.error = '';
      this.init();
    },
    onDelete() {
      this.$emit('delete', this.category.id);
    },
    onEdit() {
      this.$emit('edit', this.category.id);
    },
    onInputParent(val) {
      this.parentTitle = val.trim();
      this.parent = null;
      if (!this.error) {
        this.debouncedsearchParent(this.parentTitle);
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
        parent,
      });
    },
    searchParent(title) {
      if (!title) {
        return;
      }
      Category.getByTitle({ title }).then((res) => {
        this.parents = res;
      });
    },
  },
};
</script>

<style scoped lang="less">
.category-edit {
  height: 55px;
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
  &__input {
    background-color:  #fff;
  }
  &__parent {
    width: 230px;
    text-align: left;
  }
  &__children {
    width: 230px;
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
    background: url('../assets/images/close.svg') center/14px no-repeat;
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
