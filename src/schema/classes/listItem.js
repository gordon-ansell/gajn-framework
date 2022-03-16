/**
 * @file        Schema 'ListItem'.
 * @module      Schema/ListItem
 * @author      Gordon Ansell   <contact@gordonansell.com> 
 * @copyright   Gordon Ansell, 2020.
 * @license     MIT
 */

'use strict';

const Thing = require("./thing");

/**
 * Schema 'ListItem'.
 */
class ListItem extends Thing
{
    item(val) {return this.setProp('item', val);}
    nextItem(val) {return this.setProp('nextItem', val);}
    position(val) {return this.setProp('position', val);}
    previousItem(val) {return this.setProp('previousItem', val);}
}

module.exports = ListItem