<template>
  <tr class="category-edit"  @click="onSelect">
    <td>
      <input class="category-edit__input" v-model="title" :disabled="!isEditing" type="text">
    </td>
    <td class="category-edit__parent">{{ category.parent }}</td>
    <td class="category-edit__children">{{ category.children.size }}</td>
    <td class="category-edit__messages">{{ category.messages.size }}</td>
    <td>
      <button class="category-edit__save" v-if="isEditing" type="button" @click.stop="onSave">
        save
      </button>
    </td>
  </tr>
</template>

<script>
export default {
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
  },
  data() {
    return {
      id: '',
      title: '',
      parent: {},
      children: [],
      messages: [],
    };
  },
  created() {
    const {
      id, title, parent, children, messages,
    } = this.category;
    this.id = id;
    this.title = title;
    this.parent = parent;
    this.children = children;
    this.messages = messages;
  },
  methods: {
    onSelect() {
      if (!this.isEditing) {
        this.$emit('select', this.category.id);
      }
    },
    onSave() {
      const {
        id, title, parent, children, messages,
      } = this;
      this.$emit('save', {
        id, title, parent, children, messages,
      });
    },
  },
};
</script>

<style scoped lang="less">
.category-edit {
  height: 36px;
  &:hover {
    background-color: rgba(137, 149, 175, 0.1);
  }
  td {
    padding: 4px;
  }
  &__input {
    background-color:  #fff;
  }
}
</style>
