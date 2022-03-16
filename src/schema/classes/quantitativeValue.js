/**
 * @file        Schema 'QuantitativeValue'.
 * @module      Schema/QuantitativeValue
 * @author      Gordon Ansell   <contact@gordonansell.com> 
 * @copyright   Gordon Ansell, 2020.
 * @license     MIT
 */

'use strict';

const Thing = require("./thing");

/**
 * Schema 'QuantitativeValue'.
 */
class QuantitativeValue extends Thing
{
    additionalProperty(val) {return this.setProp('additionalProperty', val);}
    maxValue(val) {return this.setProp('maxValue', val);}
    minValue(val) {return this.setProp('minValue', val);}
    unitCode(val) {return this.setProp('unitCode', val);}
    unitText(val) {return this.setProp('unitText', val);}
    value(val) {return this.setProp('value', val);}
    valueReference(val) {return this.setProp('valueReference', val);}
}

module.exports = QuantitativeValue