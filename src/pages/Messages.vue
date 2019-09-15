<template>
  <div class="messages">
    <h1 v-if="id">Сообщения категории {{ category.title }}</h1>
    <h1 v-else>Сообщения</h1>
    <div class="header">
      <router-link :to="{ name: 'categories' }">К категориям</router-link>
      <button type="button" @click="createMessage">Создать сообщение</button>
    </div>
    <Filters
      :title.sync="title"
      :parent-title.sync="parentTitle"
      :max-title-length="1024"
      :messages-count.sync="messagesCount"
    />
    <table class="messages__table">
      <tr class="messages__head">
        <td>
          <button
            :class="['messages__sort', { sorted: sortBy === 'title', ascending }]"
            type="button" @click="sortBy = 'title'; ascending = !ascending">
            Название
          </button>
        </td>
        <td>
          <button
            :class="['messages__sort', { sorted: sortBy === 'parentTitle', ascending }]"
            type="button" @click="sortBy = 'parentTitle'; ascending = !ascending">
            Родительская категория
          </button>
        </td>
        <td>
          <button
            :class="['messages__sort', { sorted: sortBy === 'body', ascending }]"
            type="button" @click="sortBy = 'body'; ascending = !ascending">
            Содержимое
          </button>
        </td>
        <td></td>
      </tr>
      <tr v-if="isCreating"
          is="MessageEdit"
          :is-editing="isCreating"
          :message="createdMessage"
          @cancel="isCreating = false"
          @save="debouncedSave(createdMessage, $event)"
      />
      <tr is="MessageEdit"
          v-for="message in filteredMessages"
          :key="message.id"
          :is-editing="message.id === editingMessageId"
          :is-change-disabled="!!editingMessageId && message.id !== editingMessageId"
          :message="message"
          @cancel="editingMessageId = 0"
          @delete="deletingMessageId = $event; isModalVisible = true"
          @edit="editingMessageId = $event"
          @save="debouncedSave(message, $event)"
      />
    </table>
    <paginate
      v-model="page"
      :page-count="totalPages"
      :click-handler="getPage"
      prev-text="Пред."
      next-text="След."
      container-class="pagination"
      page-class="pagination__page"
    >
    </paginate>
    <simple-modal
      v-model="isModalVisible"
      size="small"
      title="Действительно удалить?"
      class="modal">
      <template slot="body">
        <div>Пожалуйста, подтвердите удаление</div>
        <div class="modal__buttons">
          <button type="button" @click="debouncedDelete">Удалить</button>
        </div>
      </template>
    </simple-modal>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import SimpleModal from 'simple-modal-vue';
import { debounce } from 'lodash';
import Paginate from 'vuejs-paginate';
import MessageEdit from '@/components/MessageEdit.vue';
import Message from '@/classes/Message';
import Filters from '@/components/Filters.vue';
import { compareBy } from '@/utils';
import Category from '@/classes/Category';

export default {
  name: 'Messages',
  components: {
    MessageEdit,
    Filters,
    Paginate,
    SimpleModal,
  },
  props: {
    id: {
      type: String,
    },
  },
  data() {
    return {
      createdMessage: {},
      messages: [],
      deletingMessageId: 0,
      isCreating: false,
      isModalVisible: false,
      editingMessageId: 0,
      page: 0,
      totalPages: 0,
      title: '',
      parentTitle: '',
      messagesCount: null,
      sortBy: 'title',
      ascending: true,
    };
  },
  computed: {
    ...mapState({
      category: state => state.category,
    }),
    deletingMessage() {
      return this.messages.find(c => c.id === this.deletingMessageId);
    },
    showNextConfirm() {
      return this.deletingMessage
        && (this.deletingMessage.children.size || this.deletingMessage.messages.size);
    },
    filteredMessages() {
      const { title, parentTitle, messagesCount } = this;
      const normalizedTitle = title.toLowerCase();
      const normalizedParent = parentTitle.toLowerCase();
      let path;

      // eslint-disable-next-line default-case
      switch (this.sortBy) {
        case 'title':
          path = 'title';
          break;
        case 'parentTitle':
          path = 'parent.title';
          break;
        case 'body':
          path = 'body';
          break;
      }

      return this.messages.filter((c) => {
        let res = true;

        if (normalizedTitle) {
          res = c.title.toLowerCase().includes(normalizedTitle);
        }
        if (normalizedParent) {
          res = res && c.category && c.category.title.toLowerCase().includes(normalizedParent);
        }
        if (typeof messagesCount === 'number') {
          res = res && (c.messages.size === messagesCount);
        }
        return res;
      }).sort((a, b) => (this.ascending ? compareBy(a, b, path) : compareBy(b, a, path)));
    },
  },
  created() {
    if (this.id) {
      Category.getById({ id: this.id })
        .then((res) => {
          this.setCategory(new Category(res));
          this.getCategoryMessages();
        });
    } else {
      this.getMessages();
    }
    this.debouncedSave = debounce(this.saveMessage, 300);
    this.debouncedDelete = debounce(this.deleteMessage, 300);
  },
  methods: {
    ...mapActions([
      'setCategory',
    ]),
    createMessage() {
      this.isCreating = true;
      this.createdMessage = new Message();
    },
    deleteMessage() {
      const catIndex = this.messages.findIndex(c => c.id === this.deletingMessageId);

      if (catIndex > -1) {
        this.deletingMessage.delete()
          .then(() => {
            this.editingMessageId = 0;
            this.isModalVisible = false;
            this.deletingMessageId = 0;
            this.messages.splice(catIndex, 1);
          });
      }
    },
    getCategoryMessages(p) {
      const categoryId = this.category.id;
      if (!categoryId) {
        return;
      }
      Message.getMessagesOf({ page: p, categoryId })
        .then(({ data, totalPages, page }) => {
          this.messages = data.map((d) => {
            // eslint-disable-next-line no-param-reassign
            d.category = Object.assign({}, this.category);
            return new Message(d);
          });
          this.totalPages = totalPages;
          this.page = page;
        });
    },
    getMessages(page) {
      Message.get({ page })
      // eslint-disable-next-line no-shadow
        .then(({ data, totalPages, page }) => {
          this.messages = data.map(d => new Message(d));
          this.totalPages = totalPages;
          this.page = page;
          const categoriesIds = data.map(m => m.category && m.category.id);

          return Category.get({
            conditions: ['id', 'IN', [...new Set(categoriesIds)]],
          });
        })
        .then(({ data }) => {
          this.messages.forEach((m, index) => {
            const category = data.find(cat => cat.id === m.category.id);
            this.$set(this.messages, index, new Message(Object.assign({}, m, { category })));
          });
        });
    },
    getPage(page) {
      if (this.id) {
        this.getCategoryMessages(page);
      } else {
        this.getMessages(page);
      }
    },
    saveMessage(message, data) {
      const categoryId = data.category && data.category.id;
      const savingData = Object.assign({}, data);

      savingData.category = { id: categoryId };
      if (message.id) {
        message.update(savingData)
          .then(() => {
            this.editingMessageId = 0;
            const index = this.messages.findIndex(m => m.id === message.id);
            this.$set(this.messages, index, new Message(data));
          });
        return;
      }

      this.createdMessage = new Message(data);
      message.create(savingData)
        .then((res) => {
          const primaryKey = res['Primary key'];
          this.createdMessage.id = primaryKey && primaryKey.id;
          this.isCreating = false;
          this.messages.unshift(this.createdMessage);
        });
    },
  },
};
</script>

<style lang="less" scoped>
  @import "../assets/styles/variables";
  .messages {
    width: 90%;
    min-width: 900px;
    max-width: 1100px;
    margin: 0 auto;
    padding: 40px 0;
    &__table {
      width: 100%;
      margin-top: 20px;
      border-collapse: collapse;
    }
    &__head {
      color: @text-color;
      td {
        padding: 10px 4px;
      }
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
    .filters {
      margin-top: 30px;
      width: 470px;
    }
  }
</style>
