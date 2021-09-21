/**
 * Please refer to the following files in the root directory:
 * 
 * README.md        For information about the package.
 * LICENSE          For license details, copyrights and restrictions.
 */
'use strict';
 
/**
 * Duration.
 * 
 * @param   {number}     mins    Raw duration in minutes.
 * 
 * @return  {string[]}           [pt, txt]
 */
function duration(mins)
{
    let pt;
    let txt;

    if (mins < 60) {
        pt = 'PT' + mins + 'M';
        txt = mins + ' minutes';
    } else {
        let hrs = Math.floor(mins / 60);
        let m = mins - (hrs * 60);
        pt = 'PT' + hrs + 'H' + m + 'M';
        txt = hrs + ' hours ' + m + ' minutes ';
    }

    return [pt, txt];
}

module.exports = duration;
 