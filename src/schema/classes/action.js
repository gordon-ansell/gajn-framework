/**
 * @file        Schema 'WebPage'.
 * @module      Schema/WebPage
 * @author      Gordon Ansell   <contact@gordonansell.com> 
 * @copyright   Gordon Ansell, 2020.
 * @license     MIT
 */

'use strict';

const Thing = require("./thing");

/**
 * Schema 'Action'.
 */
class Action extends Thing
{
    actionStatus(val) {return this.setProp('actionStatus', val);}
    agent(val) {return this.setProp('agent', val);}
    endTime(val) {return this.setProp('endTime', val);}
    error(val) {return this.setProp('error', val);}
    instrument(val) {return this.setProp('instrument', val);}
    location(val) {return this.setProp('location', val);}
    object(val) {return this.setProp('object', val);}
    participant(val) {return this.setProp('participant', val);}
    result(val) {return this.setProp('result', val);}
    startTime(val) {return this.setProp('startTime', val);}
    target(val) {return this.setProp('target', val);}
}

module.exports = Action