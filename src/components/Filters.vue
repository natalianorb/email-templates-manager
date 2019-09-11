<template>
  <form class="filters">
    <div class="filters__header">Фильтры для текущей страницы:</div>
    <div class="filters__body">
      <input type="text" :value="title" placeholder="Название"
             @input="onInputTitle" >
      <input  type="text" :value="parentTitle" placeholder="Родительская категория"
              @input="onInputParent">
      <input
        v-if="hasCounter"
        placeholder="Количество сообщений"
        :value="messagesCount"
        type="number"
        min="0"
        step="1"
        @input="$emit('update:messagesCount', +$event.target.value)" >
    </div>
  </form>
</template>

<script>
export default {
  name: 'Filters',
  props: {
    title: {
      type: String,
      default: '',
    },
    maxTitleLength: {
      type: Number,
      default: 255,
    },
    parentTitle: {
      type: String,
      default: '',
    },
    maxParentLength: {
      type: Number,
      default: 255,
    },
    messagesCount: {
      type: Number,
    },
    hasCounter: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    onInputTitle(e) {
      const trimmed = e.target.value.trim().slice(0, this.maxTitleLength);
      e.target.value = trimmed;
      this.$emit('update:title', trimmed);
    },
    onInputParent(e) {
      const trimmed = e.target.value.trim().slice(0, this.maxParentLength);
      e.target.value = trimmed;
      this.$emit('update:parentTitle', trimmed);
    },
  },
};
</script>

<style lang="less" scoped>
.filters {
  padding: 20px;
  &__body {
    display: flex;
    padding: 10px 0;
    justify-content: space-between;
  }
}
</style>
