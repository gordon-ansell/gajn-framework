/**
 * Please refer to the following files in the root directory:
 * 
 * README.md        For information about the package.
 * LICENSE          For license details, copyrights and restrictions.
 */
'use strict';

const dateformat = require('dateformat');

/**
 * Multi date object.
 */
class MultiDate
{
    // Date properties.
    type = undefined;
    day = undefined;
    dispDate = undefined;
    dispTime = undefined;
    dispDt = undefined;
    iso = undefined;
    monthName = undefined;
    month = undefined;
    ms = undefined;
    obj = undefined;
    utc = undefined;
    year = undefined;

    /**
     * Constructor.
     * 
     * @param   {string}    raw         Raw input.
     * @param   {string}    type        Type of date.
     * @param   {string}    dispDate    Display date format.
     * @param   {string}    dispTime    Display time format.
     */
    constructor(raw, type, dispDate = "dS mmmm yyyy", dispTime = "HH:MM")
    {
        this.type = type;

        let dobj = new Date(raw);

        this.iso = dobj.toISOString();
        this.utc = dobj.toUTCString();
        this.ms = dobj.getTime();
        this.dispDate = dateformat(dobj, dispDate);
        this.dispTime = dateformat(dobj, dispTime);
        this.dispDt = dateformat(dobj, dispDate) + ", " + dateformat(dobj, dispTime);
        this.year = dobj.getFullYear();
        this.monthName = dobj.toLocaleString('default', { month: 'long' });
        this.month = dobj.getMonth();
        this.day = dobj.getDate();
        this.obj = dobj;
    }
}

module.exports = MultiDate;

