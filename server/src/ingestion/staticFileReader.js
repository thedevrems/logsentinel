import fs from 'node:fs';
import readline from 'node:readline';

// Streams a static log file line by line without loading it fully in memory.
export function readStaticFile(source, onLine) {
  return new Promise((resolve, reject) => {
    const stream = fs.createReadStream(source.path, { encoding: 'utf8' });
    const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });
    let count = 0;
    rl.on('line', (line) => {
      if (line.trim()) {
        onLine({ type: source.type, path: source.path, line });
        count += 1;
      }
    });
    rl.on('close', () => resolve(count));
    stream.on('error', reject);
  });
}
