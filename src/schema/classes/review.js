/**
 * @file        Schema 'Review'.
 * @module      Schema/Review
 * @author      Gordon Ansell   <contact@gordonansell.com> 
 * @copyright   Gordon Ansell, 2020.
 * @license     MIT
 */

'use strict';

const CreativeWork = require("./creativeWork");

/**
 * Schema 'Review'.
 */
class Review extends CreativeWork
{
    itemReviewed(val) {return this.setProp('itemReviewed', val);}
    reviewAspect(val) {return this.setProp('reviewAspect', val);}
    reviewBody(val) {return this.setProp('reviewBody', val);}
    reviewRating(val) {return this.setProp('reviewRating', val);}
}

module.exports = Review