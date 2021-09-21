/**
 * Please refer to the following files in the root directory:
 * 
 * README.md        For information about the package.
 * LICENSE          For license details, copyrights and restrictions.
 */
'use strict';

const GAError = require("../utils/gaerror");

class DependencyInjectionIDAlreadyExists extends GAError {}
class DependencyInjectionClassAlreadyExists extends GAError {}

exports.DependencyInjectionIDAlreadyExists = DependencyInjectionIDAlreadyExists;
exports.DependencyInjectionClassAlreadyExists = DependencyInjectionClassAlreadyExists;
