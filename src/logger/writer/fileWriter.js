/**
 * Please refer to the following files in the root directory:
 * 
 * README.md        For information about the package.
 * LICENSE          For license details, copyrights and restrictions.
 */
'use strict';

const Level = require('../level');
const Writer = require('./writer');
const fs = require('fs');
const path = require('path');

/**
 * The file log writer class.
 */
class FileWriter extends Writer
{
    /**
     * Log path.
     * @var {string}
     */
    #path = null;

    /**
     * Days of log files to retain.
     * @var {int}
     */
    #retain = 5;

    /**
     * Constructor.
     * 
     * @param   {string}                        path        Path for logs.
     * @param   {int|string}                    level       Default logging level.
     * @param   {Formatter|null}                formatter   Formatter for the message.
     * @param   {int}                           retain      Days of log files to retain.
     * 
     * @return  Writer
     * @class
     */
    constructor(path, level = Level.NOTICE, formatter = null, retain = 5)
    {
        super(level, formatter);
        this.#path = path;
        this.#retain = retain;
        this._createLogPath();
        this._manageLogFiles();
    }

    /**
     * Create the log path.
     * 
     * @return  {void}
     */
    _createLogPath()
    {
        if (!fs.existsSync(this.#path)) {
            fs.mkdirSync(this.#path, {recursive: true});
        }
    }

    /**
     * Get the file name for today's log file.
     * 
     * @return  {string}
     */
    _getLogFileNameForToday()
    {
        let dt = new Date();
        return dt.getUTCFullYear() 
            + '-' 
            + ("0" + (dt.getUTCMonth() + 1)).slice(-2) 
            + '-' 
            + ("0" + dt.getUTCDate()).slice(-2)
            + '.log';
    }

    /**
     * Manage the log files.
     * 
     * @return  {void}
     */
    _manageLogFiles()
    {
        // Remove expired.
        let files = fs.readdirSync(this.#path, {withFileTypes: true});
        files.sort((a,b) => { return (b.name > a.name) ? 1 : -1; } );

        let count = 0;
        files.forEach(dirent => {
            if (!dirent.isDirectory()) {
                if (count >= this.#retain) {
                    fs.unlinkSync(path.join(this.#path, dirent.name));
                }
                count++;
            }
        });
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
        let buffer = fs.createWriteStream(path.join(this.#path, this._getLogFileNameForToday()), {flags: 'a'});
        buffer.write(msg + "\n");
    }
}

module.exports = FileWriter;