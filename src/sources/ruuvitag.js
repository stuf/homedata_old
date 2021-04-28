const K = require('kefir');
const ruuvi = require('node-ruuvitag');

// const onTagUpdated = data => {
//   console.log('updated', { data });
// };

// const onFound = tag => {
//   tag.on('updated', onTagUpdated);
// };

// ruuvi.on('found', onFound);

/**
 * @type {K.Property<RuuviTag, any>}
 */
const ruuvi$ = K.fromEvents(ruuvi, 'found');
/**
 * @type {K.Property<RuuviData, any>}
 */
const updates$ = ruuvi$
  .flatMap(tag => K.fromEvents(tag, 'updated'))
  .toProperty();

module.exports = updates$;

/**
 * @typedef {object} RuuviTag
 * @prop {string} id
 * @prop {string} address
 * @prop {string} addressType
 * @prop {boolean} connectable
 */

/**
 * @typedef {object} RuuviData
 * @prop {string} url
 * @prop {number} temperature
 * @prop {number} pressure
 * @prop {number} humidity
 * @prop {any} eddystoneId
 * @prop {string} rssi
 * @prop {number} battery
 * @prop {number} accelerationX
 * @prop {number} accelerationY
 * @prop {number} accelerationZ
 * @prop {any} txPower
 * @prop {any} movementCounter
 * @prop {any} measurementSequenceNumber
 * @prop {string} mac
 */
