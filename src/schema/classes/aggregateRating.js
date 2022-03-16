/**
 * @file        Schema 'AggregateRating'.
 * @module      Schema/AggregateRating
 * @author      Gordon Ansell   <contact@gordonansell.com> 
 * @copyright   Gordon Ansell, 2020.
 * @license     MIT
 */

'use strict';

const Rating = require("./rating");

/**
 * Schema 'AggregateRating'.
 */
class AggregateRating extends Rating
{
    itemReviewed(val) {return this.setProp('itemReviewed', val);}
    ratingCount(val) {return this.setProp('ratingCount', val);}
    reviewCount(val) {return this.setProp('reviewCount', val);}
}

module.exports = AggregateRating