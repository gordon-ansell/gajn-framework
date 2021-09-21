/**
 * Please refer to the following files in the root directory:
 * 
 * README.md        For information about the package.
 * LICENSE          For license details, copyrights and restrictions.
 */
'use strict';

const Formatter = require("./formatter");
const Level = require('../level');
const str = require('../../utils/string');

/**
 * A standard formatter.
 */
class StdFormatter extends Formatter
{
    /**
     * Uppercase first character and pad.
     * 
     * @param   {string}        text        Text to work on.
     * @param   {int}           pad         Pad length.
     * 
     * @return  {string}
     */
    _ucFirstAndPad(text, pad = 10)
    {
        return str.ucfirst(text).padEnd(pad);
    }

    /**
     * Format the message (internally).
     * 
     * This is just a stub that forces extended classes to implement their own.
     * 
     * @param   {string}        msg         Message to write.
     * @param   {int}           level       Level of this message.
     * @param   {string|null}   context     Context.
     * @param   {any}           extra       Extra data.
     * @param   {int}           indent      How much to indent.
     * @param   {string}        indentChars Indent characters.    
     * 
     * @return  {string}                    Formatted message.
     */
    _internalFormat(msg, level, context = null, extra = null, indent = 0, indentChars = '   ')
    {
        if (0 !== indent) {
            msg = indentChars.repeat(indent) + msg;
        }

        let base = new Date().toISOString() + ' ' + this._ucFirstAndPad(Level.toString(level)) + ' ' + msg;
        if (null !== context) {
            base += ' [' + context + ']';
        }
        return base;
    }
}

module.exports = StdFormatter;