/**
 * Please refer to the following files in the root directory:
 * 
 * README.md        For information about the package.
 * LICENSE          For license details, copyrights and restrictions.
 */
'use strict';

/**
 * My own error class.
 */
class GAError extends Error
{
    /**
     * Constructor.
     * 
     * @constructor
     * @param   {string}    message         Error message.
     * @param   {string}    context         Context.
     * @param   {Error}     originalError   Original error.
     * 
     * @return  {GAError}                   New instance.
     */
    constructor(message, context, originalError) 
    {
        super(message);
        this.name = this.constructor.name;

        Error.captureStackTrace(this, this.constructor);

        if (context) {
            this.message += `\n => ${context}`;
        }

        if (originalError) {
            this.originalError = originalError;
        }
    }
}

module.exports = GAError;
