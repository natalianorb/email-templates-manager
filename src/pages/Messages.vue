<template>
  <div class="messages container">
    <h1 v-if="id" class="messages__title">Сообщения категории {{ category.title }}</h1>
    <h1 v-else>Сообщения</h1>
    <div class="header">
      <router-link :to="{ name: 'categories' }">К категориям</router-link>
      <router-link :to="{ name: 'messageEdit', params: { id: '0'} }">Создать сообщение</router-link>
    </div>
    <Filters
      v-if="messages.length"
      :title.sync="title"
      :parent-title.sync="parentTitle"
      :max-title-length="1024"
      :messages-count.sync="messagesCount"
    />
    <table v-if="messages.length" class="messages__table">
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
        <td class="messages__body-column">
          <button
            :class="['messages__sort', { sorted: sortBy === 'body', ascending }]"
            type="button" @click="sortBy = 'body'; ascending = !ascending">
            Содержимое
          </button>
        </td>
        <td></td>
      </tr>
      <tr is="MessageView"
          v-for="message in filteredMessages"
          :key="message.id"
          :is-change-disabled="false"
          :message="message"
          @edit="$router.push({ name: 'messageEdit', params: { id: `${message.id}` } })"
      />
    </table>
    <paginate
      v-show="totalPages"
      v-model="page"
      :page-count="totalPages"
      :click-handler="getPage"
      prev-text="Пред."
      next-text="След."
      container-class="pagination"
      page-class="pagination__page"
    >
    </paginate>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import Paginate from 'vuejs-paginate';
import MessageView from '@/components/MessageView.vue';
import Message from '@/classes/Message';
import Filters from '@/components/Filters.vue';
import { compareBy } from '@/utils';
import Category from '@/classes/Category';

export default {
  name: 'Messages',
  components: {
    MessageView,
    Filters,
    Paginate,
  },
  props: {
    id: {
      type: String,
    },
  },
  data() {
    return {
      messages: [],
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
  },
  methods: {
    ...mapActions([
      'setCategory',
    ]),
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
  },
};
</script>

<style lang="less" scoped>
  @import "../assets/styles/variables";
  .messages {
    &__title {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
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
    &__body-column {
      display: none;
      @media screen and (min-width: @tablet) {
        display: table-cell;
      }
    }
    .filters {
      margin-top: 30px;
    }
  }
</style>
