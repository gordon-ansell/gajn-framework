/**
 * @file        Schema 'Thing'.
 * @module      Schema/Thing
 * @author      Gordon Ansell   <contact@gordonansell.com> 
 * @copyright   Gordon Ansell, 2020.
 * @license     MIT
 */

'use strict';

const SchemaBase = require("../schemaBase");

/**
 * Schema 'Thing'.
 */
class Thing extends SchemaBase
{
    additionalType(val) {return this.setProp('additionalType', val);}
    alternateName(val) {return this.setProp('alternateName', val);}
    description(val) {return this.setProp('description', val);}
    disambiguationDescription(val) {return this.setProp('disambiguationDescription', val);}
    identifier(val) {return this.setProp('identifier', val);}
    image(val) {return this.setProp('image', val);}
    mainEntityOfPage(val) {return this.setProp('mainEntityOfPage', val);}
    name(val) {return this.setProp('name', val);}
    potentialAction(val) {return this.setProp('potentialAction', val);}
    sameAs(val) {return this.setProp('sameAs', val);}
    subjectOf(val) {return this.setProp('subjectOf', val);}
    url(val) {return this.setProp('url', val);}
}

module.exports = Thing