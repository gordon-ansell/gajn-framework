/**
 * @file        Schema 'WebPage'.
 * @module      Schema/WebPage
 * @author      Gordon Ansell   <contact@gordonansell.com> 
 * @copyright   Gordon Ansell, 2020.
 * @license     MIT
 */

'use strict';

const CreativeWork = require("./creativeWork");

/**
 * Schema 'WebPage'.
 */
class WebPage extends CreativeWork
{
    breadcrumb(val) {return this.setProp('breadcrumb', val);}
    lastReviewed(val) {return this.setProp('lastReviewed', val);}
    mainContentOfPage(val) {return this.setProp('mainContentOfPage', val);}
    primaryImageOfPage(val) {return this.setProp('primaryImageOfPage', val);}
    relatedLink(val) {return this.setProp('relatedLink', val);}
    reviewedBy(val) {return this.setProp('reviewedBy', val);}
    significantLink(val) {return this.setProp('significantLink', val);}
    speakable(val) {return this.setProp('speakable', val);}
    specialty(val) {return this.setProp('specialty', val);}
}

module.exports = WebPage