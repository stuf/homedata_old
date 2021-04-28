const { InfluxDB } = require('@influxdata/influxdb-client');
const { SetupAPI } = require('@influxdata/influxdb-client-apis');

const { url, org, bucket, token } = require('./env');

const client = new InfluxDB({ url });

const setupApi = new SetupAPI(client);

setupApi.getSetup().then(({ allowed }) => {
  if (allowed) {
    console.log('Onboarding allowed.');

    setupApi.postSetup({ body: { org, bucket, token } }).then(result => {
      console.log('Onboarding completed for `%s`', url);
    });
  } else {
    console.log('Onboarding already done.');
  }
});
