<template>
  <table class="category-page">
    <tr class="category-page__head">
      <td>Название</td>
      <td colspan="2">Сообщение</td>
    </tr>
    <tr is="MessageEdit"
        v-for="message in category.messages"
        :key="message.id"
        :is-editing="false"
        :message="message"
    />
  </table>
</template>

<script>
import { mapState } from 'vuex';
import MessageEdit from '@/components/MessageEdit.vue';
// import Message from '@/classes/Message';
/* import { mapActions } from 'vuex'; */

export default {
  name: 'CategoryPage',
  components: {
    MessageEdit,
  },
  computed: {
    ...mapState({
      category: state => state.category,
    }),
  },
  data() {
    return {
      messages: [],
    };
  },
  created() {
    // this.messages = this.category.messages.map(m => new Message(m));
  },
  methods: {
  },
};
</script>

<style lang="less" scoped>
  .category-page {

  }
</style>
