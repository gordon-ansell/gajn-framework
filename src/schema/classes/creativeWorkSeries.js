/**
 * @file        Schema 'CreativeWorkSeries'.
 * @module      Schema/CreativeWorkSeries
 * @author      Gordon Ansell   <contact@gordonansell.com> 
 * @copyright   Gordon Ansell, 2020.
 * @license     MIT
 */

'use strict';

const CreativeWork = require("./creativeWork");

class CreativeWorkSeries extends CreativeWork
{

    endDate(val) {return this.setProp('endDate', val);}
    issn(val) {return this.setProp('issn', val);}
    startDate(val) {return this.setProp('startDate', val);}

}

module.exports = CreativeWorkSeries;
