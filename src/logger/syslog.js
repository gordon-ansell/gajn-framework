/**
 * Please refer to the following files in the root directory:
 * 
 * README.md        For information about the package.
 * LICENSE          For license details, copyrights and restrictions.
 */
'use strict';

const Level = require('./level');
const Logger = require('./logger');

let syslog = Logger.createDefault(Level.NOTICE);

module.exports = syslog;


 