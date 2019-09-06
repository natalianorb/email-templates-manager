<template>
  <form class="category">
    <input v-model="title" :disabled="!isEditing" type="text" @click="onSelect">
    <button v-if="isEditing" type="submit" @click="onSubmit">save</button>
  </form>
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
    onSubmit() {
      const {
        id, title, parent, children, messages,
      } = this;
      this.$emit('submit', {
        id, title, parent, children, messages,
      });
    },
  },
};
</script>

<style scoped lang="less">
.category {
  padding: 5px;
}
</style>
