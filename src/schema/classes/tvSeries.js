/**
 * @file        Schema 'TVSeries'.
 * @module      Schema/TVSeries
 * @author      Gordon Ansell   <contact@gordonansell.com> 
 * @copyright   Gordon Ansell, 2020.
 * @license     MIT
 */

'use strict';

const CreativeWorkSeries = require("./creativeWorkSeries");

class TVSeries extends CreativeWorkSeries
{

    actor(val) {return this.setProp('actor', val);}
    containsSeason(val) {return this.setProp('containsSeason', val);}
    countryOfOrigin(val) {return this.setProp('countryOfOrigin', val);}
    director(val) {return this.setProp('director', val);}
    episode(val) {return this.setProp('episode', val);}
    musicBy(val) {return this.setProp('musicBy', val);}
    numberOfEpisodes(val) {return this.setProp('numberOfEpisodes', val);}
    numberOfSeasons(val) {return this.setProp('numberOfSeasons', val);}
    productionCompany(val) {return this.setProp('productionCompany', val);}
    trailer(val) {return this.setProp('trailer', val);}
}

module.exports = TVSeries;
