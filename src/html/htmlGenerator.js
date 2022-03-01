/**
 * Please refer to the following files in the root directory:
 * 
 * README.md        For information about the package.
 * LICENSE          For license details, copyrights and restrictions.
 */
'use strict';

const HtmlAttribs = require("./htmlAttribs");
const GAError = require('../utils/gaError');

/**
 * HTML generator class.
 */
class HtmlGenerator
{
    /**
     * The HTML element.
     * @member {string}
     */
    elem = null;

    /**
     * Atttributes.
     * @member {HtmlAttribs}
     */
    attribs = null;

    /**
     * Data for the element.
     * @member {string}
     */
    data = null;

    /**
     * Self close data?
     * @member {boolean|null}
     */
    selfClose = null;

    /**
     * Is the value attribute also the data?
     * @member {boolean|null}
     */
    valueData = null;

    /**
     * Self closing tags.
     * @member {string[]}
     */
    selfClosers = ['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link',
		'meta', 'param', 'source', 'track', 'wbr'];

    /**
     * Anything before the closing tag?
     * @member {any}
     */
    beforeClose = null;

    /**
     * Constructor.
     * 
     * @param   {string}                        elem        Element we're generating.
     * @param   {object|null|HtmlAttribs}       attribs     Attributes for HTML statement.
     * @param   {string|null}                   data        Element's data.
     * @param   {boolean|null}                  selfClose   Self-closing element?
     * @param   {boolean|null}                  valueData   Value attribute is the data?
     * 
     * @return  {HtmlGenerator}
     */
    constructor(elem, attribs = null, data = null, selfClose = null, valueData = null)
    {
        this.elem = elem;

        if (attribs instanceof HtmlAttribs) {
            this.attribs = attribs;
        } else {
            this.attribs = new HtmlAttribs(attribs);
        }

        this.data = data;

        if (null === selfClose) {
            if (this.selfClosers.includes(elem)) {
                this.selfClose = true;
            } else {
                this.selfClose = false;
            }
        } else {
            this.selfClose = selfClose;
        }

        if (null === valueData) {
            if (this.selfClosers.includes(elem)) {
                this.valueData = true;
            } else {
                this.valueData = false;
            }
        } else {
            this.valueData = valueData;
        }
    }

    /**
     * Set the data.
     * 
     * @param   {any}       data    Data to set.
     * 
     * @return  {HtmlGenerator}
     */
    setData(data)
    {
        this.data = data;
        return this;
    }

    /**
     * See if we have an attribute.
     * 
     * @param   {string}    name    Name of attribute to test.
     * 
     * @return  {boolean}
     */
    hasAttrib(name)
    {
        return this.attribs.has(name);
    }

    /**
     * Add an attribute.
     * 
     * @param   {string}    name    Attribute name.
     * @param   {any}       val     Attribute value.
     * @param   {boolean}   or      Allow overiding?
     * 
     * @return  {HtmlGenerator}
     */
    addAttrib(name, val, or = false)
    {
        if (this.hasAttrib(name) && !or) {
            throw new GAError(`Attribute '${name}' already exists. Cannot add attribute to element '<${this.elem}>'.`);
        }
        this.attribs.add(name, val, or);
        return this;
    }

    /**
     * Set an attribute.
     * 
     * @param   {string}    name    Attribute name.
     * @param   {any}       val     Attribute value.
     * 
     * @return  {HtmlGenerator}
     */
    setAttrib(name, val)
    {
        this.attribs.set(name, val);
        return this;
    }

    /**
     * Delete attribute.
     * 
     * @param   {string}    name    Attribute name.
     * 
     * @return  {HtmlGenerator}
     */
    delAttrib(name)
    {
        this.attribs.del(name);
        return this;
    }

    /**
     * Count the attributes.
     * 
     * @return  {number}
     */
    countAttribs()
    {
        return this.attribs.count();
    }

    /**
     * See if an attribute is boolean.
     * 
     * @param   {string}    name    Attribute name to check.
     * 
     * @return  {boolean}
     */
    isBooleanAttrib(name)
    {
        return this.attribs.isBoolean(name);
    }

    /**
     * Append a value to an attribute.
     * 
     * @param   {string}    name    Attribute name.
     * @param   {any}       value   Attribute value.
     * @param   {boolean}   dup     Allow duplicates?
     * 
     * @return  {HtmlGenerator}
     */
    appendAttrib(name, val, dup = false)
    {
        if (!val) {
            throw new GAError(`Cannot append to '${name}' attribute on '<${this.elem}>' because no value was passed.`);
        }
        this.attribs.append(name, val, dup);
        return this;
    }

    /**
     * Prepend a value to an attribute.
     * 
     * @param   {string}    name    Attribute name.
     * @param   {any}       value   Attribute value.
     * @param   {boolean}   dup     Allow duplicates?
     * 
     * @return  {HtmlGenerator}
     */
    prependAttrib(name, val, dup = false)
    {
        this.attribs.prepend(name, val, dup);
        return this;
    }

    /**
     * Get an attribute.
     * 
     * @param   {string}    name    Attribute name.
     * @param   {boolean}   excp    Throw exception if not found?
     * 
     * @return  {any}
     */
    attrib(name, excp = true)
    {
        return this.attribs.get(name, excp);
    }

    /**
     * Get all the attributes.
     * 
     * @return  {object}
     */
    getAttribs()
    {
        return this.attribs.getAll();
    }

    /**
     * See if an attribute contains something.
     * 
     * @param   {string}    name        Attribute name.
     * @param   {string}    something   To check.
     * 
     * @return  {boolean}
     */
    attribContains(name, something)
    {
        return this.attribs.contains(name, something);
    }

    /**
     * Set something before the closing tag.
     * 
     * @param   {string}    something   The something you're setting.
     * 
     * @return  {HtmlGenerator}
     */
    setBeforeClose(something)
    {
        this.beforeClose = something;
        return this;
    }

    /**
     * Get the before close thing.
     * 
     * @return  {HtmlGenerator|any}
     */
    getBeforeClose()
    {
        return this.beforeClose;
    }

    /**
     * Render the open statement.
     * 
     * @return  {string}            HTML element open string.
     */
    renderOpen()
    {
        if (this.valueData && null === this.data && this.hasAttrib('value')) {
            this.data = this.attrib('value');
            this.delAttrib('value');
        }

        let ret = `<${this.elem}`;

        if (this.countAttribs() > 0) {
            ret += this.attribs.render();
        }

        if (this.selfClose) {
            ret += ` />`;
        } else {
            ret += `>`;
        }

        return ret;
    }

    /**
     * Render the close.
     * 
     * @param   {string}    data    Optional data.
     * 
     * @return  {string}            HTML.
     */
    renderClose(data = null)
    {
        let ret = ``;

        if (null === data && null !== this.data) {
			data = this.data;
		}
        if (null !== data) {
            if (data instanceof HtmlGenerator) {
                ret += data.render();
            } else {
                ret += data;
            }
        }

        if (null !== this.beforeClose) {
            if (this.beforeClose instanceof HtmlGenerator) {
                ret += this.beforeClose.render();
            } else {
                ret += this.beforeClose;
            }
        }

        ret += `</${this.elem}>`;

        return ret;
    }

    /**
     * Render the HTML.
     * 
     * @param   {string}    data    Optional data.
     * 
     * @return  {string}            HTML.
     */
    render(data = null)
    {
        let ret = this.renderOpen();
        //console.log('----------------------------------------')
        //console.log(ret);
        //console.log('----------------------------------------')

        if (!this.selfClose) {
            ret += this.renderClose(data);
        }

        return ret;
    }
}

module.exports = HtmlGenerator;