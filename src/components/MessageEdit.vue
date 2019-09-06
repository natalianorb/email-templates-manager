<template>
  <tr class="message-edit">
    <td class="message-edit__title">
      <input
        class="message-edit__input"
        v-model="newMessage.title"
        :disabled="!isEditing"
        type="text">
    </td>
    <td class="message-edit__text">{{ newMessage.body }}</td>
    <td>
      <button class="message-edit__save" v-if="isEditing" type="button" @click.stop="onSave">
        save
      </button>
    </td>
  </tr>
</template>

<script>
import Message from '@/classes/Message';

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
    isEditing: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      newMessage: {
        id: '',
        title: '',
        body: '',
        category: {},
      },
    };
  },
  created() {
    this.newMessage = new Message(this.message);
    this.newMessage.get()
      .then(({ data }) => {
        const {
          id, title, body, category,
        } = (data && data[0]) || {};
        this.newMessage.id = id;
        this.newMessage.title = title;
        this.newMessage.body = body;
        this.newMessage.category = category;
      });
  },
  methods: {
    onSave() {
      const {
        id, title, body, category,
      } = this;
      this.$emit('save', {
        id, title, body, category,
      });
    },
  },
};
</script>

<style scoped lang="less">
  .message-edit {
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
