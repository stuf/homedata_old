#!/usr/bin/env node
const env = require('dotenv').config();

console.log({ env });

require('./src/index')();
