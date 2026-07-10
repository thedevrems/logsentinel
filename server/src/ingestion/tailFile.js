import fs from 'node:fs';

// Emits complete lines from a buffer, keeping any trailing partial line.
function drainBuffer(state, onLine, source) {
  const parts = state.buffer.split('\n');
  state.buffer = parts.pop();
  for (const line of parts) {
    if (line.trim()) onLine({ type: source.type, path: source.path, line });
  }
}

// Reads newly appended bytes since the last known file offset.
function readNewBytes(source, state, onLine) {
  fs.stat(source.path, (err, stats) => {
    if (err || stats.size <= state.offset) return;
    const stream = fs.createReadStream(source.path, { start: state.offset, encoding: 'utf8' });
    stream.on('data', (chunk) => {
      state.buffer += chunk;
      drainBuffer(state, onLine, source);
    });
    stream.on('end', () => {
      state.offset = stats.size;
    });
  });
}

// Follows a growing log file and streams appended lines in real time.
export function tailFile(source, onLine) {
  const startSize = fs.existsSync(source.path) ? fs.statSync(source.path).size : 0;
  const state = { offset: startSize, buffer: '' };
  const watcher = fs.watch(source.path, () => readNewBytes(source, state, onLine));
  return () => watcher.close();
}
