/**
 * Please refer to the following files in the root directory:
 * 
 * README.md        For information about the package.
 * LICENSE          For license details, copyrights and restrictions.
 */
'use strict';

const GAError = require('../utils/gaError');

/**
 * HTML attribs class.
 */
class HtmlAttribs
{
    /**
     * The actual attributes.
     * @member {object}
     */
    attribs = {}

    /**
     * Constructor.
     * 
     * @param   {object|null}       attribs     Attributes for HTML statement.
     * 
     * @return  {HtmlAttribs}
     */
    constructor(attribs = null)
    {
        if (attribs) {
            this.setAll(attribs);
        }
    }

    /**
     * Set all attributes.
     * 
     * @param   {object|HtmlAttribs}    attribs     Attributes.
     * 
     * @return  {HtmlAttribs}
     */
    setAll(attribs)
    {
        if (attribs instanceof HtmlAttribs) {
            this.attribs = attribs.getAll();
        } else {
            this.attribs = attribs;
        }
    }

    /**
     * See if we have an attribute.
     * 
     * @param   {string}    name    Name of attribute to test.
     * 
     * @return  {boolean}
     */
    has(name)
    {
        return this.attribs.hasOwnProperty(name);
    }

    /**
     * Add an attribute.
     * 
     * @param   {string}    name    Attribute name.
     * @param   {any}       val     Attribute value.
     * @param   {boolean}   or      Allow overiding?
     * 
     * @return  {HtmlAttribs}
     * 
     * @throws  {GAError}           If attrib already exists and or !== true.
     */
    add(name, val, or = false)
    {
        if ("string" !== typeof(name)) {
            throw new GAError(`1st parameter (name) of HtmlAttribs.add must be a string, we were passed a ${typeof(name)}.`);
        } 
        if (Array.isArray(val)) {
            throw new GAError(`2nd parameter (val) of HtmlAttribs.add must not be an array.`);
        }

        if (this.has(name) && !or) {
            throw new GAError(`Attribute '${name}' already exists. Cannot add attribute.`);
        }

        this.attribs[name] = val;

        return this;
    }

    /**
     * Set an attribute.
     * 
     * @param   {string}    name    Attribute name.
     * @param   {any}       val     Attribute value.
     * 
     * @return  {HtmlAttribs}
     */
    set(name, val, or = false)
    {
        if ("string" !== typeof(name)) {
            throw new GAError(`1st parameter (name) of HtmlAttribs.set must be a string, we were passed a ${typeof(name)}.`);
        } 
        if (Array.isArray(val)) {
            throw new GAError(`2nd parameter (val) of HtmlAttribs.set must not be an array.`);
        }

        return this.add(name, val, true);
    }

    /**
     * Delete attribute.
     * 
     * @param   {string}    name    Attribute name.
     * 
     * @return  {HtmlAttribs}
     */
    del(name)
    {
        if (this.has(name)) {
            delete this.attribs[name];
        }
        return this;
    }

    /**
     * Count attributes.
     * 
     * @return  {number}
     */
    count()
    {
        return Object.keys(this.attribs).length;
    }

    /**
     * See if an attribute is boolean.
     * 
     * @param   {string}    name    Attribute name to check.
     * 
     * @return  {boolean}
     */
    isBoolean(name)
    {
        return this.has(name) && 'boolean' === typeof(this.attribs[name]);
    }

    /**
     * Append a value to an attribute.
     * 
     * @param   {string}    name    Attribute name.
     * @param   {any}       value   Attribute value.
     * @param   {boolean}   dup     Allow duplicates?
     * 
     * @return  {HtmlAttribs}
     * 
     * @throws  {GAError}           If we try to append to a boolean.
     */
    append(name, val, dup = false)
    {
        if (!val) {
            throw new GAError(`Cannot append to '${name}' attribute because no value was passed.`);
        }

        if (!this.has(name)) {
            return this.add(name, val);
        }

        if (this.isBoolean(name)) {
            throw new GAError(`Cannot append to '${name}' attribute because it is boolean.`);
        }

        if ("string" !== typeof(name)) {
            throw new GAError(`1st parameter (name) of HtmlAttribs.append must be a string, we were passed a ${typeof(name)}.`);
        } 
        if (Array.isArray(val)) {
            throw new GAError(`2nd parameter (val) of HtmlAttribs.append must not be an array.`);
        }

        val = val.trim();

        let multi = val.split(' ');

        for (let item of multi) {
            let sp = this.attribs[name].split(' ');
            if (!sp.includes(item) || dup) {
                sp.push(item);
                this.set(name, sp.join(' '));
            }
        }

        return this;
    }

    /**
     * Prepend a value to an attribute.
     * 
     * @param   {string}    name    Attribute name.
     * @param   {any}       value   Attribute value.
     * @param   {boolean}   dup     Allow duplicates?
     * 
     * @return  {HtmlAttribs}
     * 
     * @throws  {GAError}           If we try to prepend to a boolean.
     */
    prepend(name, val, dup = false)
    {
        if (!this.has(name)) {
            return this.add(name, val);
        }

        if (this.isBoolean(name)) {
            throw new GAError(`Cannot prepend to '${name}' attribute because it is boolean.`);
        }

        val = val.trim();
        let multi = val.split(' ');

        for (let item of multi) {
            let sp = this.attribs[name].split(' ');
            if (!sp.includes(item) || dup) {
                sp.unshift(item);
                this.set(name, sp.join(' '));
            }
        }

        return this;
    }

    /**
     * See if an attribute contains something.
     * 
     * @param   {string}    name        Attribute name.
     * @param   {string}    something   To check.
     * 
     * @return  {boolean}
     */
    contains(name, something)
    {
        if (!this.has(name)) {
            return false;
        }
        return -1 !== this.get(name).indexOf(something);
    }

    /**
     * Get an attribute.
     * 
     * @param   {string}    name    Attribute name.
     * @param   {boolean}   excp    Throw exception if not found?
     * 
     * @return  {any}
     * 
     * @throws  {GAError}           If attrib already not found and excp === true.
     */
    get(name, excp = true)
    {
        if (!this.has(name)) {
            if (excp) {
                throw new GAError(`Cannot get attribute '${name}' because it does not exist.`)
            }
            return null;
        }

        return this.attribs[name];
    }

    /**
     * Get an attribute as an array.
     * 
     * @param   {string}    name    Attribute name.
     * @param   {boolean}   excp    Throw exception if not found?
     * 
     * @return  {string[]}
     * 
     * @throws  {GAError}           If attrib already not found and excp === true.
     */
    getArray(name, excp = true)
    {
        if (!this.has(name)) {
            if (excp) {
                throw new GAError(`Cannot get attribute '${name}' because it does not exist.`)
            }
            return null;
        }

        return this.attribs[name].split(' ');
    }

    /**
     * Get all the attributes.
     * 
     * @return  {object}
     */
    getAll()
    {
        return this.attribs;
    }

    /**
     * Render the attributes.
     * 
     * @return  {string}
     */
    render()
    {
        let ret = '';

        for (let name in this.attribs) {
            if (this.isBoolean(name)) {
                ret += ` ${name}`;
            } else {
                ret += ` ${name}="${this.attribs[name]}"`;
            }
        }

        return ret;
    }
}

module.exports = HtmlAttribs;