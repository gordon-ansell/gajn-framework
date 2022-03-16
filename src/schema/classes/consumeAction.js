/**
 * @file        Schema 'WebPage'.
 * @module      Schema/WebPage
 * @author      Gordon Ansell   <contact@gordonansell.com> 
 * @copyright   Gordon Ansell, 2020.
 * @license     MIT
 */

'use strict';

const Action = require("./action");

/**
 * Schema 'ConsumeAction'.
 */
class ConsumeAction extends Action
{
    actionAccessibilityRequirement(val) {return this.setProp('actionAccessibilityRequirement', val);}
    expectsAcceptanceOf(val) {return this.setProp('expectsAcceptanceOf', val);}
}

module.exports = ConsumeAction