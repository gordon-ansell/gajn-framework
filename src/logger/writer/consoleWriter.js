/**
 * Please refer to the following files in the root directory:
 * 
 * README.md        For information about the package.
 * LICENSE          For license details, copyrights and restrictions.
 */
'use strict';

const Level = require('../level');
const Writer = require('./writer');

/**
 * The console log writer class.
 */
class ConsoleWriter extends Writer
{
    /**
    * Output the message.    
    *  
    * @param   {string}        msg         Message to write.
    * @param   {int}           level       Level of this message.
    * @param   {string|null}   context     Context.
    * @param   {any}           extra       Extra data.
    * 
    * @return  {void}
    */
    _output(msg, level, context, extra)
    {
        switch (level) {
            case Level.TRACE:
            case Level.DEBUG:
                console.debug(msg);
                break;
            case Level.INFO:
            case Level.NOTICE:
                console.log(msg);
                break;
            case Level.WARNING:
                console.warn(msg);
                break;
            default:
                console.error(msg);
                break;
        }
    }
}

module.exports = ConsoleWriter;