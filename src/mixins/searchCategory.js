import { debounce } from 'lodash';

export default {
  data() {
    return {
      error: '',
      parent: null,
      parents: [],
      parentTitle: '',
    };
  },
  created() {
    this.init();
    this.debouncedsearchParent = debounce(this.searchParent, 300);
  },
  methods: {
    onBlur(e) {
      if (this.error) {
        return;
      }
      if (e.target && e.target.value && !this.parent) {
        this.error = 'Проверьте корректность ввода';
      }
    },
    onInputParent(val) {
      this.parentTitle = val.trim();
      this.parent = null;
      if (!this.error) {
        this.debouncedsearchParent(this.parentTitle);
      }
    },
    onSelectParent(category) {
      this.error = '';
      this.parentTitle = category.title;
      this.parent = category;
    },
  },
};
