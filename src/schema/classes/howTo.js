/**
 * @file        Schema 'HowTo'.
 * @module      Schema/HowTo
 * @author      Gordon Ansell   <contact@gordonansell.com> 
 * @copyright   Gordon Ansell, 2020.
 * @license     MIT
 */

'use strict';

const CreativeWork = require("./creativeWork");

/**
 * Schema 'HowTo'.
 */
class HowTo extends CreativeWork
{
    estimatedCost(val) {return this.setProp('estimatedCost', val);}
    performTime(val) {return this.setProp('performTime', val);}
    prepTime(val) {return this.setProp('prepTime', val);}
    step(val) {return this.setProp('step', val);}
    supply(val) {return this.setProp('supply', val);}
    tool(val) {return this.setProp('tool', val);}
    totalTime(val) {return this.setProp('totalTime', val);}
    yield(val) {return this.setProp('yield', val);}
    
}

module.exports = HowTo