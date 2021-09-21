/**
 * Please refer to the following files in the root directory:
 * 
 * README.md        For information about the package.
 * LICENSE          For license details, copyrights and restrictions.
 */
'use strict';

const Level = require('./level');
const Writer = require('./writer/writer');
const ConsoleWriter = require('./writer/consoleWriter');
const StdFormatter = require('./formatter/stdFormatter');
const ConsoleColourDecorator = require('./decorator/consoleColourDecorator');
const util = require('util');
const GAError = require('../utils/gaError');

/**
 * Main logger class.
 */
class Logger
{
    /**
     * Writers.
     * @type    Array
     */
    #writers = {};

    /**
     * Constructor.
     * 
     * @param   {array|null}        writers     Writers to add in {name: writer} format.
     * @param   {string|int|null}   level       Level to set.
     * 
     * @return  Logger
     * @class
     */
    constructor(writers = null, level = null)
    {
        if (null !== writers) {

            for (let name in writers) {
                this.addWriter(name, writers[name]);
            }

        }

        if (null !== level) {
            this.setLevel(level);
        }
    }

    /**
     * Static creation of a default setup.
     * 
     * @param   {string|int|null}   level       Level to set.
     * 
     * @return  {Logger}
     */
    static createDefault(level)
    {
        let formatter = new StdFormatter(new ConsoleColourDecorator());
        let writer = new ConsoleWriter(level, formatter);
        return new Logger({ 'console': writer });
    }

    /**
     * Set the level on all writers.
     * 
     * @param   {int|string}    level       Level to set.
     * 
     * @return  {void}                       
     */
    setLevel(level)
    {
        for (let name in this.#writers) {
            this.#writers[name].setLevel(level);
        }
    }

    /**
     * Add a writer.
     * 
     * @param   {string}      name          Index name.
     * @param   {Writer}      writer        Writer to add.
     * 
     * @return  {Logger}                    Ourself.
     * 
     * @throws  Error                       If the passed variable is not an instance of Writer.
     */
    addWriter(name, writer)
    {
        if (!writer instanceof Writer) {
            throw new GAError("Writer.addWriter requires an instance of the Writer class.", 'Logger');
        }
        this.#writers[name] = writer;
        return this;
    }

    /**
     * Get a writer.
     * 
     * @param   {string}    name        Name of writer to get.
     * 
     * @return  {Writer}                The writer.
     * 
     * @throws  {Error}                 If writer not found.
     */
    getWriter(name)
    {
        if (name in this.#writers) {
            return this.#writers[name];
        }
        throw new GAError(`No writer with name '${name}' found.`, 'Logger');
    }

    /**
     * Add a context to all writers.
     * 
     * @param   {string}    context         Context to add.
     * 
     * @return  {Logger}
     */
    addContext(context)
    {
        for (let name in this.#writers) {
            this.#writers[name].addContext(context);
        }
        return this;
    }

    /**
     * Add a bunch of contexts to all writers.
     * 
     * @param   {Array}    contexts         Contexts to add.
     * 
     * @return  {Logger}
     */
    addContexts(contexts)
    {
        for (let ct of contexts) {
            this.addContext(ct);
        }
        return this;
    }

    /**
     * Clear contexts from all writers.
     * 
     * @return  {Logger}
     */
    clearContexts()
    {
        for (let name in this.#writers) {
            this.#writers[name].clearContexts();
        }
        return this;
    }

    /**
     * Display a message.
     * 
     * @param   {string}        msg         Message to write.
     * @param   {int|string}    level       Level of this message.
     * @param   {string|null}   context     Context.
     * @param   {any}           extra       Extra data.
     * @param   {int}           indent      Indent level.
     * @param   {string}        indentChars Indent characters.
     * 
     * @return  {void}
     */
    message(msg, level, context = null, extra = null, indent = 0, indentChars = '   ')
    {
        if ("string" === typeof (level)) {
            level = Level.convert(level);
        }

        for (let name in this.#writers) {
            this.#writers[name].write(msg, level, context, extra, indent, indentChars);
        }
    }

    /**
     * Inspection.
     * 
     * @param  {object}     obj      Anything you want to inspect.
     * @param  {int|string} level    Message level.
     * @param  {string}     msg      Message to precede inspect.
     * @param  {string}     context  Context.
     * @param  {any}        extra    Extra stuff.
     * 
     * @return {void}
     */
    inspect(obj, level = Level.DEBUG, msg = null, context = null, extra = null)
    {
        if ("string" === typeof (level)) {
            level = Level.convert(level);
        }

        let headerMsg = "Inspect: ";
        if (null !== msg) {
            headerMsg += msg;
        }
        headerMsg += ' ====>';

        let dump = util.inspect(obj, true, null, true);

        for (let name in this.#writers) {
            this.#writers[name].write(headerMsg, level, context, extra);
            this.#writers[name].write(dump, level, context, extra);
        }

    }

    /**
     * Handle an exception.
     * 
     * @param   {Error}     ex              Exception object.
     * @param   {string}    level           Message level.
     * @param   {boolen}    stackTraces     Do we want stack traces?
     */
    exception(ex, level = "exception", stackTraces = true)
    {
        this.message(ex.message, level);

        if (ex.stack && stackTraces) {
            for (let line of ex.stack.split('\n').slice(1)) {
                this.message(line.trim(), level);
            }
        }

        if (ex.originalError) {
            let orig = ex.originalError;
            let indent = 1;

            while (orig) {
                this.message(`==> An exception of type '${orig.name}' was encountered: ${orig.message}`, 
                    level, null, null, indent);

                if (orig.stack && st) {
                    for (let line of orig.stack.split('\n').slice(1)) {
                        this.message(line.trim(), level, null, null, indent);
                    }
                }

                if (orig.originalError) {
                    indent++;
                    orig = orig.originalError;
                } else {
                    orig = null;
                }
            }
        }
    }

    /**
     * Quick access to the various levels.
     */
    trace(msg, context = null, extra = null) { this.message(msg, Level.TRACE, context, extra); }
    debug(msg, context = null, extra = null) { this.message(msg, Level.DEBUG, context, extra); }
    info(msg, context = null, extra = null) { this.message(msg, Level.INFO, context, extra); }
    notice(msg, context = null, extra = null) { this.message(msg, Level.NOTICE, context, extra); }
    warning(msg, context = null, extra = null) { this.message(msg, Level.WARNING, context, extra); }
    error(msg, context = null, extra = null) { this.message(msg, Level.ERROR, context, extra); }
    critical(msg, context = null, extra = null) { this.message(msg, Level.CRITICAL, context, extra); }
    alert(msg, context = null, extra = null) { this.message(msg, Level.ALERT, context, extra); }
    emergency(msg, context = null, extra = null) { this.message(msg, Level.EMERGENCY, context, extra); }
}

module.exports = Logger;