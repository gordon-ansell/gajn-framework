/**
 * @file        Schema 'ItemList'.
 * @module      Schema/ItemList
 * @author      Gordon Ansell   <contact@gordonansell.com> 
 * @copyright   Gordon Ansell, 2020.
 * @license     MIT
 */

'use strict';

const Thing = require("./thing");

/**
 * Schema 'ItemList'.
 */
class ItemList extends Thing
{
    itemListElement(val) {return this.setProp('itemListElement', val);}
    itemListOrder(val) {return this.setProp('itemListOrder', val);}
    numberOfItems(val) {return this.setProp('numberOfItems', val);}
}

module.exports = ItemList