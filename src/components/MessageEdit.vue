<template>
  <tr class="message-edit">
    <td class="message-edit__title">
      <input
        class="message-edit__input"
        v-model="title"
        :disabled="!isEditing"
        type="text">
    </td>
    <td class="message-edit__parent">
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
      <input v-else-if="message.category" :value="message.category.title" disabled/>
      <div :class="[ 'error', { visible: !!error } ]" >{{ error }}</div>
    </td>
    <td class="message-edit__text">
      <textarea
      class="message-edit__textarea"
      v-model="body"
      :disabled="!isEditing"
      ></textarea>
    </td>
    <td class="message-edit__buttons">
      <template v-if="isEditing">
        <button class="message-edit__save" :disabled="!!error" type="button" @click.stop="onSave">
          Сохранить
        </button>
        <button
          v-if="message.id"
          class="message-edit__save"
          type="button"
          @click.stop="onDelete"
        >
          Удалить
        </button>
        <button class="message-edit__cancel"  type="button" @click.stop="onCancel">
        </button>
      </template>
      <button
        v-else
        class="message-edit__save"
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
import SearchSelect from '@/components/SearchSelect.vue';
import searchCategory from '@/mixins/searchCategory';
import Category from '@/classes/Category';

export default {
  props: {
    message: {
      type: Object,
      default() {
        return {
          title: '',
        };
      },
    },
    isChangeDisabled: {
      type: Boolean,
      default: false,
    },
    isEditing: {
      type: Boolean,
      default: false,
    },
  },
  mixins: [searchCategory],
  components: { SearchSelect },
  data() {
    return {
      id: '',
      title: '',
      body: '',
      category: '',
    };
  },
  methods: {
    init() {
      const {
        id, title, body, category,
      } = this.message;
      this.id = id;
      this.title = title;
      this.body = body;
      this.category = category;

      if (category) {
        this.parent = category;
        this.parentTitle = category.title;
      } else {
        this.parent = null;
        this.parentTitle = '';
      }
    },
    onCancel() {
      this.$emit('cancel');
      this.error = '';
      this.init();
    },
    onDelete() {
      this.$emit('delete', this.message.id);
    },
    onEdit() {
      this.$emit('edit', this.message.id);
    },
    onSave() {
      const {
        id, title, body, parent,
      } = this;
      this.$emit('save', {
        id, title, body, category: parent,
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
  .message-edit {
    &:hover {
      background-color:  rgba(7, 16, 28, 0.1);
    }
    &.active {
      background-color:  rgba(7, 16, 28, 0.1);
    }
    td {
      padding: 4px;
      vertical-align: top;
    }
    &__input {
      background-color:  #fff;
    }
    &__parent {
      width: 230px;
      text-align: left;
    }
    &__textarea {
      width: 400px;
      height: 58px;
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
