const status = new Map([
  ['session', false],
  ['cart', false]
]);

export function markRedisAvailable(label) {
  status.set(label, true);
}

export function markRedisUnavailable(label) {
  status.set(label, false);
}

export function isRedisAvailable(label) {
  return status.get(label) === true;
}

export function getRedisStatusSnapshot() {
  return Object.fromEntries(status.entries());
}
