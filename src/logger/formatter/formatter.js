/**
 * Please refer to the following files in the root directory:
 * 
 * README.md        For information about the package.
 * LICENSE          For license details, copyrights and restrictions.
 */
'use strict';

const Decorator = require("../decorator/decorator");
const GAError = require('../../utils/gaError');

/**
 * The base log formatter class.
 */
class Formatter
{
    /**
     * Decorators.
     * @type  Decorator[]
     */
    #decorators = [];

    /**
     * Constructor.
     * 
     * @param   {Decorator|Decorator[]|null}   decorators  Decorators to add.
     * 
     * @return  Formatter
     * @class 
     */
    constructor(decorators = null)
    {
        if (null !== decorators) {

            if (!Array.isArray(decorators)) {
                decorators = [decorators];
            }

            decorators.forEach(decorator =>
            {
                this.addDecorator(decorator);
            });

        }
    }

    /**
     * Add a decorator.
     * 
     * @param   {Decorator}   decorator     Decorator to add.
     * 
     * @return  {Formatter}                 Ourself.
     * 
     * @throws  Error                       If the passed variable is not an instance of Decorator.
     */
    addDecorator(decorator)
    {
        if (!decorator instanceof Decorator) {
            throw new GAError("Formatter.addDecorator requires an instance of the Decorator class.", 'Logger/Formatter');
        }
        this.#decorators.push(decorator);
        return this;
    }

    /**
     * Format the message.
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
    format(msg, level, context = null, extra = null, indent = 0, indentChars = '   ')
    {
        let final = this._internalFormat(msg, level, context, extra, indent, indentChars);
        if (this.#decorators.length > 0) {
            for (let dec of this.#decorators) {
                final = dec.decorate(final, level);
            }
        }
        return final;
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
        throw new GAError("You must implement your own version of Formatter._internalFormat.", 'Logger/Formatter');
    }
}

module.exports = Formatter;