import Base from '@/classes/Base';

class Message extends Base {
  constructor(props) {
    super(props);
    this.body = props.body || '';
    this.category = props.category;
  }
}

export default Message;
