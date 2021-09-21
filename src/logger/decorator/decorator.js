/**
 * Please refer to the following files in the root directory:
 * 
 * README.md        For information about the package.
 * LICENSE          For license details, copyrights and restrictions.
 */
'use strict';

const GAError = require('../../utils/gaError');

/**
 * The base log decorator class.
 */
class Decorator
{
    /**
     * Decorate the message.
     * 
     * This is just a stub that forces extended classes to implement their own.
     * 
     * @param   {string}        msg         Message to write.
     * @param   {int}           level       Level of this message.
     * 
     * @return  {string}                    Decorated message.
     */
    decorate(msg, level)
    {
        throw new GAError("You must implement your own version of Decorator.decorate.", 'Logger/Decorator');
    }
}

module.exports = Decorator;