/**
 * @file        Schema 'PriceSpecification'.
 * @module      Schema/PriceSpecification
 * @author      Gordon Ansell   <contact@gordonansell.com> 
 * @copyright   Gordon Ansell, 2020.
 * @license     MIT
 */

'use strict';

const Thing = require("./thing");

/**
 * Schema 'PriceSpecification'.
 */
class PriceSpecification extends Thing
{
    eligibleQuantity(val) {return this.setProp('eligibleQuantity', val);}
    eligibleTransactionVolume(val) {return this.setProp('eligibleTransactionVolume', val);}
    maxPrice(val) {return this.setProp('maxPrice', val);}
    minPrice(val) {return this.setProp('minPrice', val);}
    price(val) {return this.setProp('price', val);}
    priceCurrency(val) {return this.setProp('priceCurrency', val);}
    validFrom(val) {return this.setProp('validFrom', val);}
    validThrough(val) {return this.setProp('validThrough', val);}
    valueAddedTaxIncluded(val) {return this.setProp('valueAddedTaxIncluded', val);}
}

module.exports = PriceSpecification