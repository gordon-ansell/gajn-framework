/**
 * Please refer to the following files in the root directory:
 * 
 * README.md        For information about the package.
 * LICENSE          For license details, copyrights and restrictions.
 */
'use strict';

const Level = require('../level');
const Formatter = require('../formatter/formatter');
const GAError = require('../../utils/gaError');

/**
 * The base log writer class.
 */
class Writer
{
    /**
     * Default log level.
     * @type    int
     */
    #level = Level.NOTICE;

    /**
     * Formatter.
     * @type  Formatter
     */
    #formatter = null;

    /**
     * Contexts.
     * @type array
     */
    #contexts = [];

    /**
     * Constructor.
     * 
     * @param   {int|string}                    level       Default logging level.
     * @param   {Formatter|null}                formatter   Formatter for the message.
     * 
     * @return  Writer
     * @class
     */
    constructor(level = Level.NOTICE, formatter = null)
    {
        this.setLevel(level);
        this.#formatter = formatter;
    }

    /**
     * Set the level.
     * 
     * @param   {int|string}    level       Level to set.
     * 
     * @return  {int}                       Old level.
     */
    setLevel(level)
    {
        let oldLevel = this.#level;

        if ("number" !== typeof (level)) {
            this.#level = Level.convert(level);
        } else {
            this.#level = level;
        }

        return oldLevel;
    }

    /**
     * Get the level.
     * 
     * @return  {int}                       Current log level.
     */
    getLevel()
    {
        return this.#level;
    }

    /**
     * Add a context.
     * 
     * @param   {string}    context         Contezt to add.
     * 
     * @return  {Writer}
     */
    addContext(context)
    {
        this.#contexts.push(context);
        return this;
    }

    /**
     * Clear contexts.
     * 
     * @return  {Writer}
     */
    clearContexts()
    {
        this.#contexts = [];
        return this;
    }

    /**
     * See if we have a context.
     * 
     * @param   {string}        context     Context to check.
     * 
     * @return  {bool}                      True on match, else false.
     */
    _hasContext(context)
    {
        for (let item of this.#contexts) {
            if (context.startsWith(item)) {
                return true;
            }
        }
        return false;
    }

    /**
     * See if we can output a message.
     * 
     * @param   {int}           level       Level of this message.
     * @param   {string|null}   context     Context.
     * 
     * @return  {bool}
     */
    canOutput(level, context)
    {
        if (level < this.#level) {
            return false;
        }

        if (null !== context && this.#contexts.length > 0) {
            if (!this._hasContext(context)) {
                return false;
            }
        } if (null !== context && 0 === this.#contexts.length) {
            return false;
        }

        return true;
    }

    /**
     * Write the message.
     * 
     * @param   {string}        msg         Message to write.
     * @param   {int}           level       Level of this message.
     * @param   {string|null}   context     Context.
     * @param   {any}           extra       Extra data.
     * @param   {int}           indent      Indent level.
     * @param   {string}        indentChars Indent characters.
     * 
     * @return  {void}
     */
    write(msg, level, context = null, extra = null, indent = 0, indentChars = '   ')
    {
        if (!this.canOutput(level, context)) {
            return;
        }

        if (null !== this.#formatter) {
            msg = this.#formatter.format(msg, level, context, extra, indent, indentChars);
        }

        this._output(msg, level, context, extra);
    }

    /**
    * Output the message.
    * 
    * This is just a stub that forces extended classes to implement their own.
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
        throw new GAError("You must implement your own version of Writer._output.", 'Logger/Writer');
    }

}

module.exports = Writer;