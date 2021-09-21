/**
 * Please refer to the following files in the root directory:
 * 
 * README.md        For information about the package.
 * LICENSE          For license details, copyrights and restrictions.
 */
'use strict';

const syslog = require('../../logger/syslog');
const GAError = require('../../utils/gaError');

class NunjucksShortcodeError extends GAError {}


/**
 * Nunjucks shortcode class.
 */
class NunjucksShortcode
{
    /**
     * Tags.
     */
    tags = null;

    /**
     * Config.
     */
    config = null;

    /**
     * Paired?
     */
    paired = false;

    /**
     * Async?
     */
    isasync = false;

    /**
     * Constructor.
     */
    constructor(tags, config, paired = false, isasync = false)
    {
        if (Array.isArray(tags)) {
            this.tags = tags;
        } else {
            this.tags = [tags];
        }

        this.config = config;
        this.paired = paired;
        this.isasync = isasync;
    }

    /**
     * Normalise the return context.
     *
     * @param   {object}  context  Context.
     * @return  {object
     */
    /*
    _normalizeShortcodeContext(context) 
    {
        let obj = {};
        if (context.ctx && context.ctx.page) {
            obj.page = context.ctx.page;
        }
        return obj;
    }
    */

    /**
     * Parse.
     */
    parse(parser, nodes, lexer)
    {
        let args;
        let tok = parser.nextToken();

        args = parser.parseSignature(true, true);

        if (!this.paired) {
            // Nunjucks bug with non-paired custom tags bug still exists even
            // though this issue is closed. Works fine for paired.
            // https://github.com/mozilla/nunjucks/issues/158
            if (args.children.length === 0) {
                args.addChild(new nodes.Literal(0, 0, ""));
            }
        }

        parser.advanceAfterBlockEnd(tok.value);

        let body;
        if (this.paired) {
            body = parser.parseUntilBlocks("end" + this.tags[0]);
            parser.advanceAfterBlockEnd();
        }

        if (this.isasync) {
            return new nodes.CallExtensionAsync(this, "run", args, [body]);
        }

        return new nodes.CallExtension(this, "run", args, [body]);
    }

    /**
     * Run.
     */
    run(...args)
    {
        let resolve;
                
        if (this.isasync) {
            resolve = args.pop();
        }

        let body;
        if (this.paired) {
            body = args.pop();
        }
        let [context, ...argArray] = args;

        this.safe = context.env.filters.safe;

        if (this.isasync) {
            if (this.paired) {
                //this.renderAsyncPaired(this._normalizeShortcodeContext(context), body(), argArray)
                this.renderAsyncPaired(context, body(), argArray)
                    .then(function (returnValue) {
                        resolve(null, this.safe(returnValue));
                    })
                    .catch(function (e) {
                        resolve(
                            new NunjucksShortcodeError(`Error with Nunjucks shortcode '${this.tags[0]}': ${e.message}`, null, e),
                            null
                        );
                    });
            } else {
                //this.renderAsync(this._normalizeShortcodeContext(context), argArray)
                this.renderAsync(context, argArray)
                    .then(function (returnValue) {
                        resolve(null, this.safe(returnValue));
                    })
                    .catch(function (e) {
                        resolve(
                            new NunjucksShortcodeError(`Error with Nunjucks shortcode '${this.tags[0]}': ${e.message}`, null, e),
                            null
                        );
                    });                
            }

        } else {
            try {
                let ret;
                if (this.paired) {
                    //ret = this.renderPaired(this._normalizeShortcodeContext(context), body(), argArray);
                    ret = this.renderPaired(context, body(), argArray);
                } else {
                    //ret = this.render(this._normalizeShortcodeContext(context), argArray);
                    ret = this.render(context, argArray);
                }
                return this.safe(ret);
        
            } catch (e) {
                throw new NunjucksShortcodeError(`Error with Nunjucks shortcode '${this.tags[0]}': ${e.message}`, null, e);
            }
        }

    }

    /**
     * Render.
     */
    render(context, args)
    {
        throw new NunjucksShortcodeError(`You must override the 'render' method.`)
    }

    /**
     * Render paired.
     */
    renderPaired(context, body, args)
    {
        throw new NunjucksShortcodeError(`You must override the 'renderPaired' method.`)
    }

    /**
     * Render async.
     */
    async renderAsync(context, args)
    {
        throw new NunjucksShortcodeError(`You must override the 'renderAsync' method.`)
    }

    /**
     * Render async paired.
     */
     async renderAsyncPaired(context, args, body)
     {
         throw new NunjucksShortcodeError(`You must override the 'renderAsyncPaired' method.`)
     }
 }

module.exports = NunjucksShortcode;