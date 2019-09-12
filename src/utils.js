export function deepFind(obj, path) {
  const paths = path.split('.');
  let current = obj;
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < paths.length; ++i) {
    if (!current[paths[i]]) {
      return current[paths[i]];
    }
    current = current[paths[i]];
  }
  return current;
}
export function compareBy(a, b, path) {
  const first = deepFind(a, path);
  const second = deepFind(b, path);
  if (!first) {
    return -1;
  }
  if (!second) {
    return 1;
  }
  return first.toString().toLowerCase() < second.toString().toLowerCase() ? -1 : 1;
}
