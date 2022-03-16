/**
 * @file        Schema 'ImageObject'.
 * @module      Schema/ImageObject
 * @author      Gordon Ansell   <contact@gordonansell.com> 
 * @copyright   Gordon Ansell, 2020.
 * @license     MIT
 */

'use strict';

const MediaObject = require("./mediaObject");

/**
 * Schema 'ImageObject'.
 */
class ImageObject extends MediaObject
{
    caption(val) {return this.setProp('caption', val);}
    exifData(val) {return this.setProp('exifData', val);}
    representativeOfPage(val) {return this.setProp('representativeOfPage', val);}
    thumbnail(val) {return this.setProp('thumbnail', val);}
}

module.exports = ImageObject