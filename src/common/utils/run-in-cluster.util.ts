import cluster from 'cluster';
import * as os from 'os';

export function runInCluster(bootstrap: () => Promise<void>): void {
  const numberOfCores = os.cpus().length;
  console.log(`Number of cores: ${numberOfCores}`);
  if (cluster.isPrimary) {
    for (let i = 0; i < numberOfCores; ++i) {
      cluster.fork();
    }
  } else {
    bootstrap();
  }
}
