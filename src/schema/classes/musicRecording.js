/**
 * @file        Schema 'MusicRecording'.
 * @module      Schema/MusicRecording
 * @author      Gordon Ansell   <contact@gordonansell.com> 
 * @copyright   Gordon Ansell, 2020.
 * @license     MIT
 */

'use strict';

const CreativeWork = require("./creativeWork");

/**
 * Schema 'MusicRecording'.
 */
class MusicRecording extends CreativeWork
{
    byArtist(val) {return this.setProp('byArtist', val);}
    duration(val) {return this.setProp('duration', val);}
    inAlbum(val) {return this.setProp('inAlbum', val);}
    inPlaylist(val) {return this.setProp('inPlaylist', val);}
    isrcCode(val) {return this.setProp('isrcCode', val);}
    recordingOf(val) {return this.setProp('recordingOf', val);}
}

module.exports = MusicRecording