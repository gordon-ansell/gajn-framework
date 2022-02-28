/**
 * Please refer to the following files in the root directory:
 * 
 * README.md        For information about the package.
 * LICENSE          For license details, copyrights and restrictions.
 */
'use strict';

const HtmlGenerator = require("./htmlGenerator");

/**
 * HTML <figure> class.
 */
class HtmlFigure extends HtmlGenerator
{
    /**
     * Constructor.
     * 
     * @param   {object|null|HtmlAttribs}       attribs     Attributes for HTML statement.
     * @param   {string|null}                   data        Element's data.
     * @param   {boolean|null}                  selfClose   Self-closing element?
     * @param   {boolean|null}                  valueData   Value attribute is the data?
     * 
     * @return  {HtmlFigure}
     */
    constructor(attribs = null, data = null, selfClose = null, valueData = null)
    {
        super('figure', attribs, data, selfClose, valueData);
        this.beforeClose = new HtmlGenerator('figcaption');
    }

    /**
     * Get the figure caption object.
     * 
     * @return  {HtmlGenerator}
     */
    getFigcaption()
    {
        return this.getBeforeClose();
    }

    /**
     * Set the caption.
     * 
     * @param   {string}    caption     Caption to set.
     * 
     * @return  {HtmlFigure}
     */
    setCaption(caption)
    {
        this.getFigcaption().setData(caption);
        return this;
    }
}

module.exports = HtmlFigure;