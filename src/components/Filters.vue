<template>
  <form class="filters">
    <div class="filters__header">Фильтры для текущей страницы:</div>
    <div class="filters__body">
      <label class="filters__label">
        <span>Название</span>
        <input type="text" :value="title" placeholder="Название"
               @input="onInputTitle" class="filters__input">
      </label>
      <label class="filters__label _parent">
        <span>Родительская категория</span>
        <input  type="text" :value="parentTitle" placeholder="Родительская категория"
                @input="onInputParent" class="filters__input">
      </label>
      <label class="filters__label _counter">
        <span>Количество сообщений</span>
        <input
          v-if="hasCounter"
          placeholder=""
          :value="messagesCount"
          type="number"
          min="0"
          step="1"
          @input="onInputCount"
          class="filters__input _count"
        >
      </label>

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
    onInputCount(e) {
      const { value } = e.target;
      this.$emit('update:messagesCount', value.length ? +value : null);
    },
  },
};
</script>

<style lang="less" scoped>
  @import "../assets/styles/variables";

  .filters {
    padding: 20px;
    background-color: rgba(7, 16, 28, 0.1);
    border-radius: 2px;
    &__body {
      display: flex;
      flex-direction: column;
      margin-top: 15px;
      @media screen and (min-width: @tablet) {
        flex-direction: row;
        justify-content: space-between;
      }
    }
    &__label {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      margin-top: 10px;
      @media screen and (min-width: @laptop) {
        flex-direction: row;
        justify-content: flex-start;
      }
      &._parent {
        @media screen and (min-width: @laptop) {
          margin: 10px 10px 0;
          flex-grow: 1;
          justify-content: center;
        }
      }
    }
    &__input {
      width: 100%;
      max-width: 220px;
      margin: 5px 0 0 5px;
      &._count {
        width: 80px;
      }
    }

  }
</style>
