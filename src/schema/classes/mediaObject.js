/**
 * @file        Schema 'MediaObject'.
 * @module      Schema/MediaObject
 * @author      Gordon Ansell   <contact@gordonansell.com> 
 * @copyright   Gordon Ansell, 2020.
 * @license     MIT
 */

'use strict';

const CreativeWork = require("./creativeWork");

/**
 * Schema 'MediaObject'.
 */
class MediaObject extends CreativeWork
{
    associatedArticle(val) {return this.setProp('associatedArticle', val);}
    bitrate(val) {return this.setProp('bitrate', val);}
    contentSize(val) {return this.setProp('contentSize', val);}
    contentUrl(val) {return this.setProp('contentUrl', val);}
    duration(val) {return this.setProp('duration', val);}
    embedUrl(val) {return this.setProp('embedUrl', val);}
    encodesCreativeWork(val) {return this.setProp('encodesCreativeWork', val);}
    encodingFormat(val) {return this.setProp('encodingFormat', val);}
    endTime(val) {return this.setProp('endTime', val);}
    height(val) {return this.setProp('height', val);}
    playerType(val) {return this.setProp('playerType', val);}
    productionCompany(val) {return this.setProp('productionCompany', val);}
    regionsAllowed(val) {return this.setProp('regionsAllowed', val);}
    subscriptionRequired(val) {return this.setProp('subscriptionRequired', val);}
    startTime(val) {return this.setProp('startTime', val);}
    uploadDate(val) {return this.setProp('uploadDate', val);}
    width(val) {return this.setProp('width', val);}
    
}

module.exports = MediaObject