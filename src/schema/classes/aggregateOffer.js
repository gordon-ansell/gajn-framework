/**
 * @file        Schema 'AggregateOffer'.
 * @module      Schema/AggregateOffer
 * @author      Gordon Ansell   <contact@gordonansell.com> 
 * @copyright   Gordon Ansell, 2020.
 * @license     MIT
 */

'use strict';

const Offer = require("./offer");

/**
 * Schema 'Offer'.
 */
class AggregateOffer extends Offer
{
    highPrice(val) {return this.setProp('highPrice', val);}
    lowPrice(val) {return this.setProp('lowPrice', val);}
    offerCount(val) {return this.setProp('offerCount', val);}
    offers(val) {return this.setProp('offers', val);}
}

module.exports = AggregateOffer