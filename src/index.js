const { InfluxDB, Point } = require('@influxdata/influxdb-client');
const { url, token, org, bucket } = require('./env');

const influxDb = new InfluxDB({ url, token });
const writeApi = influxDb.getWriteApi(org, bucket, 'ms');

const sources = require('./sources');

function main() {
  sources.ruuvitag.onValue(v => {
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
    console.log('  => %s', point.toLineProtocol());
  });

  sources.ruuvitag.onEnd(() => {
    writeApi.close();
  });

  sources.ruuvitag.onError(err => {
    console.error('err', err);
  });
}

module.exports = main;
