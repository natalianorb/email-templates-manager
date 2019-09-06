import axios from 'axios';
import Base from '@/classes/Base';
import { baseUrl } from '@/env';

class Message extends Base {
  constructor(props) {
    super(props);
    this.body = props.body || '';
    this.category = props.category;
  }

  get(options = { perPage: 10 }) {
    const { id } = this;

    if (!id) {
      return Promise.reject(new Error('get Category requires id'));
    }
    return axios
      .post(baseUrl, {
        jsonrpc: '2.0',
        method: 'readMessage',
        id: 'test',
        params: {
          conditions: ['id', '=', id],
          page: options.page,
          perPage: options.perPage,
        },
      })
      .then(res => res.data && res.data.result);
  }
}

export default Message;
