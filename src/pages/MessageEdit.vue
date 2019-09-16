<template>
  <div class="message-edit container">
    <h2 v-if="isEditing">{{ id === '0'? 'Создание' : 'Редактирование' }} сообщения</h2>
    <h2 v-else >Сообщение</h2>
    <h1 v-if="message" class="message-edit__page-title">{{ message.title }}</h1>
    <div class="message-edit__title">
      <label>
        <div>Название</div>
        <input
          class="message-edit__input"
          v-model="title"
          :disabled="!isEditing"
          type="text">
        <div :class="['error', { visible: $v && $v.title && $v.title.$invalid }]">
          Слишком длинное название
        </div>
      </label>
    </div>
    <div class="message-edit__parent">
      <template v-if="isEditing">
        <SearchSelect
          :searching-value="parentTitle"
          searching-prop="title"
          :options="parents"
          :required="false"
          label="Категория"
          placeholder="Название"
          @input="onInputParent"
          @blur="onBlur"
          @select="onSelectParent"
          @error="parentError = $event"
        >
          <template v-slot:default="slotProps">
            <div>
              {{ slotProps.option.title }}
            </div>
          </template>
        </SearchSelect>
        <div :class="[ 'error', { visible: !!parentError } ]" >{{ parentError }}</div>
      </template>
      <template v-else>
        <label>
          <div>Категория</div>
          <input v-if="message && message.category" :value="message.category.title" disabled/>
        </label>
      </template>
    </div>
    <div class="message-edit__text">
      <label>
        <div>Текст</div>
        <textarea
          class="message-edit__textarea"
          v-model="body"
          :disabled="!isEditing"
        ></textarea>
      </label>
    </div>
    <div class="message-edit__buttons">
      <template v-if="isEditing">
        <button
          class="message-edit__save"
          :disabled="!!parentError"
          type="button"
          @click.stop="debouncedSave"
        >
          Сохранить
        </button>
        <button
          v-if="id !== '0'"
          class="message-edit__save"
          type="button"
          @click.stop="isModalVisible = true"
        >
          Удалить
        </button>
        <button class="message-edit__cancel"  type="button" @click.stop="onCancel">
        </button>
      </template>
      <button
        v-else
        class="message-edit__save"
        type="button"
        @click.stop="isEditing = true"
      >
        Изменить
      </button>
    </div>
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
import { debounce } from 'lodash';
import SimpleModal from 'simple-modal-vue';
import { maxLength } from 'vuelidate/lib/validators';
import SearchSelect from '@/components/SearchSelect.vue';
import searchCategory from '@/mixins/searchCategory';
import Category from '@/classes/Category';
import Message from '@/classes/Message';

export default {
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  mixins: [searchCategory],
  components: { SearchSelect, SimpleModal },
  validations() {
    return {
      title: {
        maxLength: maxLength(1024),
      },
    };
  },
  data() {
    return {
      title: '',
      body: '',
      category: '',
      message: null,
      isModalVisible: false,
      isEditing: true,
    };
  },
  computed: {
    saveDisabled() {
      if (!this.$v) {
        return true;
      }
      const { $v } = this;

      return ($v && $v.title && $v.title.$invalid) || !!this.parentError;
    },
  },
  created() {
    this.debouncedSave = debounce(this.saveMessage, 300);
    this.debouncedDelete = debounce(this.deleteMessage, 300);
  },
  methods: {
    init() {
      Message.getById({ id: this.id })
        .then((res) => {
          this.message = new Message(res);
          const {
            title, category, body,
          } = this.message;
          this.title = title;
          this.body = body;

          if (category) {
            this.getParent();
          } else {
            this.parent = null;
            this.parentTitle = '';
          }
        });
    },
    deleteMessage() {
      this.message.delete()
        .then(() => {
          this.isModalVisible = false;
          this.$router.go(-1);
        });
    },
    getParent() {
      if (!this.message || !this.message.category) {
        return;
      }
      Category.getById({ id: this.message.category.id })
        .then((res) => {
          this.parent = new Category(res);
          this.parentTitle = this.parent.title;
        });
    },
    onCancel() {
      this.$router.go(-1);
    },
    saveMessage() {
      const {
        id, title, parent, body, message,
      } = this;
      const categoryId = parent && parent.id;
      const savingData = {
        id,
        title,
        body,
      };

      savingData.category = { id: categoryId };
      if (message.id) {
        message.update(savingData)
          .then(() => {
            this.isEditing = false;
            message.category = parent;
          });
        return;
      }

      message.create(savingData)
        .then((res) => {
          const primaryKey = res['Primary key'];
          message.id = primaryKey && primaryKey.id;
          this.isEditing = false;
          message.category = parent;
          this.$router.replace({
            name: 'messageEdit',
            params: {
              id: `${primaryKey.id}`,
            },
          });
        });
    },
    searchParent(title) {
      if (!title) {
        return;
      }
      Category.getByTitle({ title }).then((res) => {
        this.parents = res;
      });
    },
  },
};
</script>

<style scoped lang="less">
  .message-edit {
    input,
    textarea {
      margin-top: 5px;
    }
    &__input {
      width: 100%;
      background-color:  #fff;
    }
    &__parent {
      margin-top: 20px;
      text-align: left;
    }
    &__text {
      margin-top: 20px;
    }
    &__textarea {
      width: 100%;
      height: 400px;
      max-height: 55vh;
    }
    &__buttons {
      margin-top: 20px;
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
