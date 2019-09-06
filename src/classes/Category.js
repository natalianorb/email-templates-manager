import axios from 'axios';
import Base from '@/classes/Base';

const baseUrl = 'https://simple-api.sandbox.movavi.com/api/v1/';

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

  // eslint-disable-next-line class-methods-use-this
  get(options) {
    if (!options.id) {
      return Promise.reject(new Error('get Category requires id'));
    }
    return axios
      .get(baseUrl, {
        jsonrpc: '2.0',
        method: 'readCategory',
        id: 'test',
        params: {
          conditions: ['id', '=', options.id],
          page: options.page,
          perPage: options.perPage,
          fields: ['id', 'title', 'parent', 'children', 'messages'],
        },
      })
      .then(res => res.data && res.data.result);
  }

  static getSome(options = {}) {
    return axios
      .post(baseUrl, {
        jsonrpc: '2.0',
        method: 'readCategory',
        id: 'test',
        params: {
          conditions: ['id', 'IS NOT NULL'],
          page: options.page,
          perPage: options.perPage,
          fields: ['id', 'title', 'parent', 'children', 'messages'],
        },
      })
      .then(res => res.data && res.data.result);
  }
}

export default Category;
