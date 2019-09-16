<template>
  <tr class="message-view">
    <td class="message-view__title">
      {{ message.title }}
    </td>
    <td class="message-view__parent">
      {{ message.category.title}}
    </td>
    <td class="message-view__text">
      <div class="message-view__textarea">{{ message.body }}</div>
    </td>
    <td class="message-view__buttons">
      <router-link
        v-show="!isChangeDisabled"
        class="message-view__save"
        :to="{ name: 'messageEdit', params: { id: `${message.id}` } }"
      >
        Изменить
      </router-link>
    </td>
  </tr>
</template>

<script>
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
  },
  methods: {
    onEdit() {
      this.$emit('edit', this.message.id);
    },
  },
};
</script>

<style scoped lang="less">
  @import "../assets/styles/variables";

  .message-view {
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
    &__title {
      max-width: 130px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      @media screen and (min-width: @laptop) {
        max-width: 300px;
      }
    }
    &__parent {
      max-width: 80px;
      text-align: left;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      @media screen and (min-width: @tablet) {
        max-width: 200px;
      }
      @media screen and (min-width: @laptop) {
        max-width: 300px;
      }
    }
    &__text {
      display: none;
      @media screen and (min-width: @tablet) {
       display: table-cell;
      }
    }
    &__textarea {
      max-width: 200px;
      height: 58px;
      overflow: hidden;
      text-overflow: ellipsis;
      @media screen and (min-width: @laptop) {
        max-width: 250px;
      }
      @media screen and (min-width: 1200px) {
        max-width: 400px;
      }
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
