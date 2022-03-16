/**
 * @file        Schema 'Movie'.
 * @module      Schema/Movie
 * @author      Gordon Ansell   <contact@gordonansell.com> 
 * @copyright   Gordon Ansell, 2020.
 * @license     MIT
 */

'use strict';

const CreativeWork = require("./creativeWork");

/**
 * Schema 'Movie'.
 */
class Movie extends CreativeWork
{
    actor(val) {return this.setProp('actor', val);}
    countryOfOrigin(val) {return this.setProp('countryOfOrigin', val);}
    director(val) {return this.setProp('director', val);}
    duration(val) {return this.setProp('duration', val);}
    musicBy(val) {return this.setProp('musicBy', val);}
    productionCompany(val) {return this.setProp('productionCompany', val);}
    trailer(val) {return this.setProp('trailer', val);}    
}

module.exports = Movie