import axios from 'axios';
import Base from '@/classes/Base';
import { baseUrl } from '@/env';

class Message extends Base {
  constructor(props = {
    id: '', title: '', body: '', category: '',
  }) {
    super(props);
    this.body = props.body || '';
    this.category = props.category;
  }

  // eslint-disable-next-line class-methods-use-this
  create(data) {
    return axios
      .post(baseUrl, {
        jsonrpc: '2.0',
        method: 'createMessage',
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
        method: 'deleteMessage',
        id: 'test',
        params: {
          conditions: ['id', '=', this.id],
        },
      })
      .then(res => res.data && res.data.result);
  }

  static getById(options = { perPage: 10 }) {
    const { id } = options;

    if (!id) {
      return Promise.reject(new Error('get Message by id requires id'));
    }
    return axios
      .post(baseUrl, {
        jsonrpc: '2.0',
        method: 'readMessage',
        id: 'test',
        params: {
          conditions: ['id', '=', id],
        },
      })
      .then(res => res.data && res.data.result && res.data.result.data && res.data.result.data[0]);
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
        method: 'updateMessage',
        id: 'test',
        params: {
          conditions: ['id', '=', data.id],
          data,
        },
      })
      .then(res => res.data && res.data.result);
  }

  static get({ perPage = 10, page, conditions = ['id', 'IS NOT NULL'] }) {
    return axios
      .post(baseUrl, {
        jsonrpc: '2.0',
        method: 'readMessage',
        id: 'test',
        params: {
          conditions,
          page,
          perPage,
        },
      })
      .then(res => res.data && res.data.result);
  }

  static getMessagesOf({ perPage = 10, page, categoryId }) {
    if (!categoryId) {
      return Promise.reject(new Error('getMessagesOf requires Category id'));
    }
    return axios
      .post(baseUrl, {
        jsonrpc: '2.0',
        method: 'readMessage',
        id: 'test',
        params: {
          conditions: ['category', '=', categoryId],
          page,
          perPage,
        },
      })
      .then(res => res.data && res.data.result);
  }
}

export default Message;
