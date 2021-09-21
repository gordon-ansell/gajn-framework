/**
 * Please refer to the following files in the root directory:
 * 
 * README.md        For information about the package.
 * LICENSE          For license details, copyrights and restrictions.
 */
'use strict';

const GAError = require('./gaError');

/**
 * Make something into an array if it isn't already.
 * 
 * @param   {any}       whatever    Whatever you want to make into an array.
 * @return  {Array}                 Converted to an array.
 */
function makeArray(whatever)
{
   return (Array.isArray(whatever)) ? whatever : [whatever];
}
 
 /**
  * See if an array is empty.
  * 
  * @param   {Array}     test        Array to test.
  * @return  {boolean}               True if it is, else false.
  */
function isEmpty(test)
{
    if (!Array.isArray(test)) {
        throw new GAError(`Array's isEmpty must have an array passed to it.`);
    }
    return test.length === 0;
}
 
exports.makeArray = makeArray;
exports.isEmpty = isEmpty;
 
