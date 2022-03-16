/**
 * @file        Schema 'WebPageElement'.
 * @module      Schema/WebPageElement
 * @author      Gordon Ansell   <contact@gordonansell.com> 
 * @copyright   Gordon Ansell, 2020.
 * @license     MIT
 */

'use strict';

const CreativeWork = require("./creativeWork");

/**
 * Schema 'WebPageElement'.
 */
class WebPageElement extends CreativeWork
{
    cssSelector(val) {return this.setProp('cssSelector', val);}
    xpath(val) {return this.setProp('xpath', val);}
}

module.exports = WebPageElement