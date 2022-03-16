/**
 * @file        Schema 'UnitPriceSpecification'.
 * @module      Schema/UnitPriceSpecification
 * @author      Gordon Ansell   <contact@gordonansell.com> 
 * @copyright   Gordon Ansell, 2020.
 * @license     MIT
 */

'use strict';

const PriceSpecification = require("./priceSpecification");

/**
 * Schema 'UnitPriceSpecification'.
 */
class UnitPriceSpecification extends PriceSpecification
{
    billingIncrement(val) {return this.setProp('billingIncrement', val);}
    priceType(val) {return this.setProp('priceType', val);}
    referenceQuantity(val) {return this.setProp('referenceQuantity', val);}
    unitCode(val) {return this.setProp('unitCode', val);}
    unitText(val) {return this.setProp('unitText', val);}
}

module.exports = UnitPriceSpecification