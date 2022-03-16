/**
 * @file        Schema 'MusicPlaylist'.
 * @module      Schema/MusicPlaylist
 * @author      Gordon Ansell   <contact@gordonansell.com> 
 * @copyright   Gordon Ansell, 2020.
 * @license     MIT
 */

'use strict';

const CreativeWork = require("./creativeWork");

/**
 * Schema 'MusicPlaylist'.
 */
class MusicPlaylist extends CreativeWork
{
    numTracks(val) {return this.setProp('numTracks', val);}
    track(val) {return this.setProp('track', val);}
}

module.exports = MusicPlaylist