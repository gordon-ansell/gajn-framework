/**
 * @file        Schema 'MusicAlbum'.
 * @module      Schema/MusicAlbum
 * @author      Gordon Ansell   <contact@gordonansell.com> 
 * @copyright   Gordon Ansell, 2020.
 * @license     MIT
 */

'use strict';

const MusicPlaylist = require("./musicPlaylist");

/**
 * Schema 'MusicAlbum'.
 */
class MusicAlbum extends MusicPlaylist
{
    albumProductionType(val) {return this.setProp('albumProductionType', val);}
    albumRelease(val) {return this.setProp('albumRelease', val);}
    albumReleaseType(val) {return this.setProp('albumReleaseType', val);}
    byArtist(val) {return this.setProp('byArtist', val);}
}

module.exports = MusicAlbum