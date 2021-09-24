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
     * Is progress active?
     * @member {boolean}
     */
    progressIsActive = false;

    /**
     * Last progress.
     * @member {number}
     */
    lastProgress = 0;

    /**
     * Last progress description.
     * @member {string}
     */
    lastProgessDesc = '';

    /**
     * Print a progress message.
     * 
     * @param   {number}    progress    Progress percent.
     * @param   {string}    desc        Descriptive message.
     * 
     * @return  {void} 
     */
    printProgress(progress, desc)
    {
        this.progressIsActive = true;
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        this.lastProgress = Math.round(progress);
        let msg = this.lastProgress + '%';
        if (desc && desc != '') {
            this.lastProgressDesc = desc;
            msg += ' ' + desc; 
        }
        process.stdout.write(msg);
    }

    /**
     * End progress display.
     * 
     * @return  {void}
     */
    endProgress()
    {
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        this.progressIsActive = false;
        this.lastProgressDesc = '';
    }

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
        if (this.progressIsActive) {
            process.stdout.clearLine();
            process.stdout.cursorTo(0);
        }

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

        if (this.progressIsActive) {
            this.printProgress(this.lastProgress, this.lastProgressDesc);
        }
    }
}

module.exports = ConsoleWriter;