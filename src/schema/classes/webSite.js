/**
 * @file        Schema 'WebSite'.
 * @module      Schema/WebSite
 * @author      Gordon Ansell   <contact@gordonansell.com> 
 * @copyright   Gordon Ansell, 2020.
 * @license     MIT
 */

'use strict';

const CreativeWork = require("./creativeWork");

/**
 * Schema 'WebSite'.
 */
class WebSite extends CreativeWork
{
    issn(val) {return this.setProp('issn', val);}
    
}

module.exports = WebSite