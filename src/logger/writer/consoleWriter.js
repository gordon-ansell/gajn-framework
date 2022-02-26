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
     * Progress has just ended?
     * @member {boolean}
     */
    progressEnded = false;

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
        if (Level.SILENT !== this.level) {
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
    }

    /**
     * End progress display.
     * 
     * @return  {void}
     */
    endProgress()
    {
        if (Level.SILENT !== this.level) {
            console.log('here');
            process.stdout.clearLine();
            process.stdout.cursorTo(0);
            this.progressIsActive = false;
            this.lastProgressDesc = '';
            this.progressEnded = true;
        }
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
        if (this.progressIsActive && (level.SILENT !== this.level)) {
            process.stdout.clearLine();
            process.stdout.cursorTo(0);
        }

        if (this.progressEnded && (level.SILENT !== this.level)) {
            console.log('Triggered 1');
            process.stdout.cursorTo(0);
            process.stdout.clearLine();
            this.progressEnded = false;
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

        if (this.progressIsActive && (level.SILENT !== this.level)) {
            this.printProgress(this.lastProgress, this.lastProgressDesc);
        }

    }
}

module.exports = ConsoleWriter;