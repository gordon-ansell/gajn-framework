/**
 * Please refer to the following files in the root directory:
 * 
 * README.md        For information about the package.
 * LICENSE          For license details, copyrights and restrictions.
 */
'use strict';

exports.TRACE = 50;
exports.DEBUG = 100;
exports.INFO = 200;
exports.NOTICE = 250;
exports.WARNING = 300;
exports.ERROR = 400;
exports.EXCEPTION = 450;
exports.CRITICAL = 500;
exports.ALERT = 550;
exports.EMERGENCY = 600;
exports.SILENT = 999;

exports.TRACE_TXT = 'trace';
exports.DEBUG_TXT = 'debug';
exports.INFO_TXT = 'info';
exports.NOTICE_TXT = 'notice';
exports.WARNING_TXT = 'warning';
exports.ERROR_TXT = 'error';
exports.EXCEPTION_TXT = 'exception';
exports.CRITICAL_TXT = 'critical';
exports.ALERT_TXT = 'alert';
exports.EMERGENCY_TXT = 'emergency';
exports.SILENT_TXT = 'silent';

const Conversions = {
    'trace': this.TRACE,
    'debug': this.DEBUG,
    'info': this.INFO,
    'notice': this.NOTICE,
    'warning': this.WARNING,
    'error': this.ERROR,
    'exception': this.EXCEPTION,
    'critical': this.CRITICAL,
    'alert': this.ALERT,
    'emergency': this.EMERGENCY,
    'silent': this.SILENT
};

/**
 * Convert the level from a string to an integer.
 * 
 * @param   {string}    levelStr    String version of the level.
 * 
 * @return  {int}                   The integer level.
 * 
 * @throws  Error                   If an invalid log level string is passed in.
 */
function convert(levelStr)
{
    if (levelStr.toLowerCase() in Conversions) {
        return Conversions[levelStr.toLowerCase()];
    }
    throw new Error("No log level string '" + levelStr + "' found.");
}

/**
 * Get the level string from the level number.
 * 
 * @param   {int}       level       Level.
 * 
 * @return  {int}                   The string representing the level.
 * 
 * @throws  Error                   If an invalid log level is passed in.
 */
function toString(level)
{
    for (let key in Conversions) {
        if (level === Conversions[key]) {
            return key;
        }
    }
    throw new Error("No log level '" + level + "' found.");
}

exports.convert = convert;
exports.toString = toString;