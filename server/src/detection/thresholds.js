// Fixed detection thresholds and per-rule sliding-window lengths.
export const thresholds = {
  sshBruteForce: { count: 5, windowSec: 60 },
  urlScan: { count: 8, windowSec: 30 },
  errorSpike: { count: 10, windowSec: 60 },
};
