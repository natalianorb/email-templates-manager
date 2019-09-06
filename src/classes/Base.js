class Base {
  constructor(props = { id: '', title: '' }) {
    const { id, title } = props;
    this.id = id;
    this.title = title;
  }
}

export default Base;
