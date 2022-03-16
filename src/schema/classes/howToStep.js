/**
 * @file        Schema 'HowToStep'.
 * @module      Schema/HowToStep
 * @author      Gordon Ansell   <contact@gordonansell.com> 
 * @copyright   Gordon Ansell, 2020.
 * @license     MIT
 */

'use strict';

const CreativeWork = require("./creativeWork");

/**
 * Schema 'HowToStep'.
 */
class HowToStep extends CreativeWork
{
    itemListElement(val) {return this.setProp('itemListElement', val);}
    itemListOrder(val) {return this.setProp('itemListOrder', val);}
    numberOfItems(val) {return this.setProp('numberOfItems', val);}

    item(val) {return this.setProp('item', val);}
    nextItem(val) {return this.setProp('nextItem', val);}
    position(val) {return this.setProp('position', val);}
    previousItem(val) {return this.setProp('previousItem', val);}
    
}

module.exports = HowToStep