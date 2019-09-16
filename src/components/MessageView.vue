<template>
  <tr class="message-edit">
    <td class="message-edit__title">
      <div class="message-edit__input">
        {{ message.title }}
      </div>
    </td>
    <td class="message-edit__parent">
      <div>{{ message.category.title}}</div>
    </td>
    <td class="message-edit__text">
      <div class="message-edit__textarea">{{ message.body }}</div>
    </td>
    <td class="message-edit__buttons">
      <button
        v-show="!isChangeDisabled"
        class="message-edit__save"
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
