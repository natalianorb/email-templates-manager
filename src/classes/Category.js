import axios from 'axios';
import Base from '@/classes/Base';
import { baseUrl } from '@/env';

const fields = ['id', 'title', 'parent', 'children', 'messages'];

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
    const { id, page, perPage } = options;

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
          page,
          perPage,
          fields,
        },
      })
      .then(res => res.data && res.data.result && res.data.result.data && res.data.result.data[0]);
  }

  static getByTitle(options = {}) {
    const { title, page, perPage } = options;

    if (!title) {
      return Promise.reject(new Error('getByTitle requires title'));
    }
    return axios
      .post(baseUrl, {
        jsonrpc: '2.0',
        method: 'readCategory',
        id: 'test',
        params: {
          conditions: ['title', 'LIKE', `${title}%`],
          page,
          perPage,
          fields,
        },
      })
      .then(res => res.data && res.data.result && res.data.result.data && res.data.result.data);
  }

  static getSome(options = { perPage: 10 }) {
    const { page, perPage } = options;

    return axios
      .post(baseUrl, {
        jsonrpc: '2.0',
        method: 'readCategory',
        id: 'test',
        params: {
          conditions: ['id', 'IS NOT NULL'],
          page,
          perPage,
          fields,
        },
      })
      .then(res => res.data && res.data.result);
  }
}

export default Category;
