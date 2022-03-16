/**
 * @file        Schema 'VideoObject'.
 * @module      Schema/VideoObject
 * @author      Gordon Ansell   <contact@gordonansell.com> 
 * @copyright   Gordon Ansell, 2020.
 * @license     MIT
 */

'use strict';

const MediaObject = require("./mediaObject");

/**
 * Schema 'VideoObject'.
 */
class VideoObject extends MediaObject
{
    actor(val) {return this.setProp('actor', val);}
    caption(val) {return this.setProp('caption', val);}
    director(val) {return this.setProp('director', val);}
    musicBy(val) {return this.setProp('musicBy', val);}
    thumbnail(val) {return this.setProp('thumbnail', val);}
    transcript(val) {return this.setProp('transcript', val);}
    videoFrameSize(val) {return this.setProp('videoFrameSize', val);}
    videoQuality(val) {return this.setProp('videoQuality', val);}
}

module.exports = VideoObject