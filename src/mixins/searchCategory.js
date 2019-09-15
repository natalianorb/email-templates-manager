import { debounce } from 'lodash';

export default {
  data() {
    return {
      parentError: '',
      parent: null,
      parents: [],
      parentTitle: '',
    };
  },
  created() {
    if (this.init) {
      this.init();
    }
    this.debouncedsearchParent = debounce(this.searchParent, 300);
  },
  methods: {
    onBlur(e) {
      if (this.parentError) {
        return;
      }
      if (e.target && e.target.value && !this.parent) {
        this.parentError = 'Проверьте корректность ввода';
      }
    },
    onInputParent(val) {
      this.parentTitle = val.trim();
      this.parent = null;
      if (!this.parentError) {
        this.debouncedsearchParent(this.parentTitle);
      }
    },
    onSelectParent(category) {
      this.parentError = '';
      this.parentTitle = category.title;
      this.parent = category;
    },
  },
};
