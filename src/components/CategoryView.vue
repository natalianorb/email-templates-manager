<template>
  <tr class="category-view"  @click="onSelect">
    <td class="category-view__title">
      {{ category.title }}
    </td>
    <td class="category-view__parent">
      <div v-if="category.parent">{{ category.parent.title }}</div>
    </td>
    <td class="category-view__children">
      <div v-if="category.children">{{ category.children.size || category.children.length }}</div>
    </td>
    <td class="category-view__messages">
      <div v-if="category.messages">{{ category.messages.size || category.messages.length }}</div>
    </td>
    <td class="category-view__buttons">
      <button
        class="category-view__save"
        type="button"
        @click.stop="onEdit"
      >
        Изменить
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
  },
  methods: {
    onEdit() {
      this.$emit('edit', this.category.id);
    },
    onSelect() {
      this.$emit('select', this.category.id);
    },
  },
};
</script>

<style lang="less">
  @import "../assets/styles/variables";
  @row-height: 55px;

  .category-view {
    height: 55px;
    @media screen and (min-width: @laptop) {
      &:hover {
        background-color:  rgba(7, 16, 28, 0.1);
      }
    }
    td {
      padding: 10px 0 4px;
      vertical-align: baseline;
    }
    &__title {
      position: absolute;
      left: 0;
      top: auto;
      width: @table-first-col;
      max-width: @table-first-col;
      height: @row-height;
      overflow: hidden;
      text-overflow: ellipsis;
      @media screen and (min-width: @laptop) {
        position: static;
      }
    }
    &__input {
      background-color:  #fff;
    }
    &__parent {
      text-align: left;
    }
    &__children {
      text-align: center;
    }
    &__messages {
      text-align: center;
    }
    &__buttons {
      width: 200px;
      button {
        margin: 0 4px;
      }
    }
  }
</style>
