import axios from 'axios';
import Base from '@/classes/Base';
import { baseUrl } from '@/env';

const fields = ['id', 'title', 'parent', 'children', 'messages'];
const capitalize = string => string.charAt(0).toUpperCase() + string.slice(1);

class Category extends Base {
  constructor(props = {
    id: '', title: '', parent: '', children: [], messages: [],
  }) {
    super(props);
    this.parent = props.parent || null;
    this.children = new Set(props.children);
    this.messages = new Set(props.messages);
  }

  // eslint-disable-next-line class-methods-use-this
  create(data) {
    return axios
      .post(baseUrl, {
        jsonrpc: '2.0',
        method: 'createCategory',
        id: 'test',
        params: {
          data,
        },
      })
      .then(res => res.data && res.data.result);
  }

  delete() {
    return axios
      .post(baseUrl, {
        jsonrpc: '2.0',
        method: 'deleteCategory',
        id: 'test',
        params: {
          conditions: ['id', '=', this.id],
        },
      })
      .then(res => res.data && res.data.result);
  }

  // eslint-disable-next-line class-methods-use-this
  update(data) {
    const { id } = data;

    if (!id) {
      return Promise.reject(new Error('save requires id'));
    }
    return axios
      .post(baseUrl, {
        jsonrpc: '2.0',
        method: 'updateCategory',
        id: 'test',
        params: {
          conditions: ['id', '=', data.id],
          data,
        },
      })
      .then(res => res.data && res.data.result);
  }

  static getById(options = {}) {
    const { id } = options;

    if (!id) {
      return Promise.reject(new Error('getById requires id'));
    }
    return axios
      .post(baseUrl, {
        jsonrpc: '2.0',
        method: 'readCategory',
        id: 'test',
        params: {
          conditions: ['id', '=', id],
          fields,
        },
      })
      .then(res => res.data && res.data.result && res.data.result.data && res.data.result.data[0]);
  }

  static getByTitle({ perPage = 10, title, page }) {
    if (!title) {
      return Promise.reject(new Error('getByTitle requires title'));
    }
    return axios
      .post(baseUrl, {
        jsonrpc: '2.0',
        method: 'readCategory',
        id: 'test',
        params: {
          conditions: {
            operator: 'or',
            operand_1: {
              operator: 'or',
              operand_1: ['title', 'LIKE', `${title.toLowerCase()}%`],
              operand_2: ['title', 'LIKE', `${title.toUpperCase()}%`],
            },
            operand_2: ['title', 'LIKE', `${capitalize(title)}%`],
          },
          page,
          perPage,
          fields,
        },
      })
      .then(res => res.data && res.data.result && res.data.result.data && res.data.result.data);
  }

  static get({ perPage = 10, page, conditions = ['id', 'IS NOT NULL'] }) {
    return axios
      .post(baseUrl, {
        jsonrpc: '2.0',
        method: 'readCategory',
        id: 'test',
        params: {
          conditions,
          page,
          perPage,
          fields,
        },
      })
      .then(res => res.data && res.data.result);
  }
}

export default Category;
