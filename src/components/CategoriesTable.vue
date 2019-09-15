<template>
  <div class="categories-table__table-wrapper">
    <div class="categories-table__overflow">
      <table class="categories-table__table">
        <tr class="categories-table__head">
          <td class="categories-table__title">
            <button
              :class="['categories-table__sort', { sorted: sortBy === 'title', ascending }]"
              type="button" @click="$emit('sort', { sortBy: 'title', ascending: !ascending })">
              Название
            </button>
          </td>
          <td>
            <button
              :class="['categories-table__sort', { sorted: sortBy === 'parentTitle', ascending }]"
              type="button"
              @click="$emit('sort', { sortBy: 'parentTitle', ascending: !ascending })"
            >
              Родительская категория
            </button>
          </td>
          <td class="categories-table__children-column">
            <button
              :class="['categories-table__sort', { sorted: sortBy === 'children', ascending }]"
              type="button" @click="$emit('sort', { sortBy: 'children', ascending: !ascending })">
              Подкатегории
            </button>
          </td>
          <td>
            <button
              :class="['categories-table__sort', { sorted: sortBy === 'messages', ascending }]"
              type="button" @click="$emit('sort', { sortBy: 'messages', ascending: !ascending })">
              Сообщения
            </button>
          </td>
          <td></td>
        </tr>
        <tr
          v-for="category in categories"
          :key="category.id"
          class="category-view"  @click="onSelect(category.id)">
          <td class="category-view__title">
            {{ category.title }}
          </td>
          <td class="category-view__parent">
            <div v-if="category.parent">{{ category.parent.title }}</div>
          </td>
          <td class="category-view__children">
            <div v-if="category.children">
              {{ category.children.size || category.children.length }}
            </div>
          </td>
          <td class="category-view__messages">
            <div v-if="category.messages">
              {{ category.messages.size || category.messages.length }}
            </div>
          </td>
          <td class="category-view__buttons">
            <button
              class="category-view__save"
              type="button"
              @click.stop="onEdit(category.id)"
            >
              Изменить
            </button>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    categories: {
      type: Array,
      default() {
        return [];
      },
    },
    sortBy: {
      type: String,
      default: 'title',
    },
    ascending: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    onEdit(id) {
      this.$emit('edit', id);
    },
    onSelect(id) {
      this.$emit('select', id);
    },
  },
};
</script>

<style lang="less">
  @import "../assets/styles/variables";
  @row-height: 55px;

  .categories-table {
    &__table-wrapper {
      position: relative;
      padding-left: @table-first-col;
      @media screen and (min-width: @laptop) {
        padding-left: 0;
      }
    }
    &__overflow {
      width: 100%;
      overflow-x: auto;
      overflow-y: hidden;
    }
    &__table {
      width: 100%;
      margin-top: 20px;
    }
    &__head {
      color: @text-color;
      td {
        padding: 10px 0;
      }
    }
    &__title {
      position: absolute;
      left: 0;
      top: auto;
      min-width: @table-first-col;
      width: @table-first-col;
      @media screen and (min-width: @laptop) {
        position: static;
      }
    }
    &__children-column {
      max-width: 100px;
      text-align: center;
    }
    &__sort {
      border: none;
      &.sorted:after {
        display: inline-block;
        width: 10px;
        height: 10px;
        margin-left: 5px;
        content: '';
        background: url('../assets/images/angle.svg') right center/10px no-repeat;
      }
      &.ascending {
        &:after {
          transform: rotate(180deg);
        }
      }
    }
  }
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
