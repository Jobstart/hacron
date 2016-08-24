// @flow

export default function get (): Object {
  let stats = {
    cpu: {},
    memory: {}
  };

  const { rss, heapTotal, heapUsed } = process.memoryUsage();

  stats.memory = {
    rss,
    heapTotal,
    heapUsed
  };

  if (typeof process.cpuUsage === 'function') { //works on node 6 only
    const { system, user } = process.cpuUsage();
    stats.cpu = {
      system,
      user
    };
  }

  return stats;
};
