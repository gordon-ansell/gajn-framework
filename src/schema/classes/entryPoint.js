/**
 * @file        Schema 'Event'.
 * @module      Schema/Event
 * @author      Gordon Ansell   <contact@gordonansell.com> 
 * @copyright   Gordon Ansell, 2020.
 * @license     MIT
 */

'use strict';

const Thing = require("./thing");

/**
 * Schema 'EntryPoint'.
 */
class EntryPoint extends Thing
{
    actionApplication(val) {return this.setProp('actionApplication', val);}
    actionPlatform(val) {return this.setProp('actionPlatform', val);}
    contentType(val) {return this.setProp('contentType', val);}
    encodingType(val) {return this.setProp('encodingType', val);}
    httpMethod(val) {return this.setProp('httpMethod', val);}
    urlTemplate(val) {return this.setProp('urlTemplate', val);}
}

module.exports = EntryPoint