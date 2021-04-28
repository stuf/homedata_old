const url = process.env['INFLUX_URL'] || 'http://localhost:8086';

const token = process.env['INFLUX_TOKEN'];

const org = process.env['INFLUX_ORG'] || 'etm12';

const bucket = process.env['INFLUX_BUCKET'] || 'homedata';

module.exports = { url, token, org, bucket };
