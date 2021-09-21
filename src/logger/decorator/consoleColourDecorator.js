/**
 * Please refer to the following files in the root directory:
 * 
 * README.md        For information about the package.
 * LICENSE          For license details, copyrights and restrictions.
 */
'use strict';

const Decorator = require('./decorator');
const Ansi = require('./ansi');
const Level = require('../level');

/**
 * The base log decorator class.
 */
class ConsoleColourDecorator extends Decorator
{
    /**
     * Colour schemes.
     * @var array
     */
    #colourScheme = {
        'trace': [Ansi.STYLE_INTENSITY_FAINT],
        'debug': [Ansi.STYLE_INTENSITY_FAINT],
        'info': [Ansi.COLOR_FG_RESET],
        'notice': [Ansi.COLOR_FG_GREEN],
        'warning': [Ansi.COLOR_FG_PURPLE],
        'error': [Ansi.COLOR_FG_RED],
        'exception': [Ansi.COLOR_FG_CYAN],
        'critical': [Ansi.STYLE_BOLD, Ansi.COLOR_FG_RED],
        'alert': [Ansi.STYLE_BOLD, Ansi.COLOR_FG_RED, Ansi.COLOR_BG_YELLOW],
        'emergency': [Ansi.STYLE_BOLD, Ansi.STYLE_BLINK, Ansi.COLOR_FG_WHITE, Ansi.COLOR_BG_RED],
    };

    /**
     * Decorate the message.
     * 
     * @param   {string}        msg         Message to write.
     * @param   {int}           level       Level of this message.
     * 
     * @return  {string}                    Decorated message.
     */
    decorate(msg, level)
    {
        let levelStr = Level.toString(level);
        if (levelStr in this.#colourScheme) {
            let cc = this.#colourScheme[levelStr].join(';');
            msg = Ansi.cs(cc) + msg + Ansi.cs(Ansi.RESET);
        }
        return msg;
    }
}

module.exports = ConsoleColourDecorator;