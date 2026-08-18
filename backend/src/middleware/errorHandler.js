export function notFound(req, res) {
  return res.status(404).json({ error: 'Not found' });
}

export function errorHandler(err, req, res, _next) {
  console.error('[api] error', err);
  if (res.headersSent) {
    return;
  }
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
}
