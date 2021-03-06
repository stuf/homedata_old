const { InfluxDB, Point } = require('@influxdata/influxdb-client');
const { url, token, org, bucket } = require('./env');
const sources = require('./sources');

const influxDb = new InfluxDB({ url, token });
const writeApi = influxDb.getWriteApi(org, bucket, 'ms');

const LOG_FREQ = 100;

const _log = (level, msg) => {
  const ts = new Date();
  const datetime = ts.toISOString();
  console[level](`[homedata:${level}:${datetime}]`, msg);
};

const log = msg => {
  _log('log', msg);
};

const error = msg => {
  _log('error', msg);
};

function main() {
  let n = 0;
  log(`Collecting data from Ruuvitag; LOG_FREQ=${LOG_FREQ}`);
  sources.ruuvitag.onValue(v => {
    n = n + 1;
    const point = new Point('ruuvitag');

    point
      .tag('mac', v.mac)
      .floatField('temperature', v.temperature)
      .floatField('pressure', v.pressure)
      .floatField('humidity', v.humidity)
      .floatField('rssi', v.rssi)
      .intField('accelerationX', v.accelerationX)
      .intField('accelerationY', v.accelerationY)
      .intField('accelerationZ', v.accelerationZ)
      .intField('battery', v.battery)
      .intField('txPower', v.txPower)
      .intField('movementCounter', v.movementCounter)
      .intField('measurementSequenceNumber', v.measurementSequenceNumber);

    writeApi.writePoint(point);
    // console.log('  => %s', point.toLineProtocol());
    if (n % LOG_FREQ === 0) {
      log(`Logged ${n} data points.`);
    }
  });

  sources.ruuvitag.onEnd(() => {
    writeApi.close();
  });

  sources.ruuvitag.onError(err => {
    error('Error!', err.message);
  });
}

module.exports = main;
