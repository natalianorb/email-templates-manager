import axios from 'axios';
import Base from '@/classes/Base';
import { baseUrl } from '@/env';

const categoryFields = ['id', 'title', 'parent', 'children', 'messages'];

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

  get(options = {}) {
    const { id } = this;

    if (!id) {
      return Promise.reject(new Error('get Category requires id'));
    }
    return axios
      .post(baseUrl, {
        jsonrpc: '2.0',
        method: 'readCategory',
        id: 'test',
        params: {
          conditions: ['id', '=', id],
          page: options.page,
          perPage: options.perPage,
          fields: categoryFields,
        },
      })
      .then(res => res.data && res.data.result);
  }

  static getSome(options = { perPage: 10 }) {
    return axios
      .post(baseUrl, {
        jsonrpc: '2.0',
        method: 'readCategory',
        id: 'test',
        params: {
          conditions: ['id', 'IS NOT NULL'],
          page: options.page,
          perPage: options.perPage,
          fields: categoryFields,
        },
      })
      .then(res => res.data && res.data.result);
  }
}

export default Category;
