<template>
  <div class="search-select">
    <label>
      <span>{{ label }}</span>
      <input
        :value="searchingValue"
        :placeholder="placeholder"
        class="search-select__input"
        @focus="showDropdown"
        @input="onInput"
        @blur="onBlur"
      />
    </label>
    <div
      v-show="visible && filteredOptions && filteredOptions.length"
      class="search-select__dropdown"
      tabindex="0"
      @blur="closeDropdown"
      @scroll="isScrolling = true"
    >
      <div
        v-for="(option, i) in filteredOptions"
        :key="i"
        :class="['search-select__item']"
        @mousedown="select(option)"
      >
        <slot :option="option">
          {{ option }}
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
function deepFind(obj, path) {
  const paths = path.split('.');
  let current = obj;

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < paths.length; ++i) {
    if (!current[paths[i]]) {
      return current[paths[i]];
    }
    current = current[paths[i]];
  }
  return current;
}

export default {
  model: {
    prop: 'searchingValue',
    event: 'input',
  },
  props: {
    label: {
      type: String,
      default: '',
    },
    searchingValue: {
      type: String,
      default: '',
    },
    searchingProp: {
      type: String,
      default: '',
    },
    options: {
      type: Array,
      default() {
        return [];
      },
    },
    required: {
      type: Boolean,
      default: true,
    },
    placeholder: {
      type: String,
      default: '',
    },
    maxLength: {
      type: Number,
      default: 255,
    },
  },
  data() {
    return {
      isScrolling: false,
      visible: false,
      rules: {
        maxLength: value => !value || (value.length <= this.maxLength),
      },
      selected: null,
    };
  },
  computed: {
    filteredOptions() {
      if (!this.searchingValue || !this.options) {
        return [];
      }
      const searchString = this.searchingValue.trim().toLowerCase();
      if (this.searchingProp) {
        return this.options
          .filter(option => deepFind(option, this.searchingProp)
            .toLowerCase()
            .includes(searchString));
      }

      return this.options.filter(option => option.toLowerCase().includes(searchString));
    },
  },
  methods: {
    closeDropdown() {
      this.visible = false;
      this.isScrolling = false;
    },
    onBlur(event) {
      this.validate(event.target.value);
      this.$emit('blur', event);
      setTimeout(() => {
        if (!this.isScrolling) {
          this.closeDropdown();
        }
      }, 50);
    },
    onInput(e) {
      const { value } = e.target;
      this.visible = true;
      this.validate(value);
      this.$emit('input', value);
    },
    select(option) {
      this.closeDropdown();
      this.$emit('select', option);
    },
    validate(value) {
      if (this.required && !value) {
        this.$emit('error', 'Необходимо заполнить все обязательные поля');
        return false;
      }
      if (!this.rules.maxLength(value)) {
        this.$emit('error', 'Слишком длинный текст');
        return false;
      }
      this.$emit('error', '');
      return true;
    },
    showDropdown() {
      if (this.searchingValue && this.filteredOptions.length) {
        this.visible = true;
      }
    },
  },
};
</script>

<style lang="less">
  .search-select {
    position: relative;

    &__input {
      width: 100%;
      margin-top: 5px;
    }
    &__dropdown {
      position: absolute;
      top: 100%;
      left: 0;
      width: 100%;
      max-height: 220px;
      overflow-y: auto;
      background: #fff;
      z-index: 1000000;
    }
    &__item {
      cursor: pointer;
      padding: 6px 0 5px 32px;
      text-align: left;
      background: rgba(137, 149, 175, 0.1);
      color: #8995af;
      font-family: Lato, sans-serif;
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      line-height: normal;
      transition: background-color 0.4s 0s;
      &:hover {
        background: rgba(137, 149, 175, 0.2);
      }
    }
  }
</style>
