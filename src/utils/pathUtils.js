/**
 * Please refer to the following files in the root directory:
 * 
 * README.md        For information about the package.
 * LICENSE          For license details, copyrights and restrictions.
 */
'use strict';

/**
 * Add trailing slash.
 * 
 * @param   {string}    str     String to add trailing slash to.
 * 
 * @return  {string}
 */
function addTrailingSlash(str)
{
    if (!str.endsWith('/')) {
        return str + '/';
    }
    return str;
}

/**
 * Add leading slash.
 * 
 * @param   {string}    str     String to add leading slash to.
 * 
 * @return  {string}
 */
function addLeadingSlash(str)
{
    if (!str.startsWith('/')) {
        return '/' + str;
    }
    return str;
}

/**
 * Add both slashes.
 * 
 * @param   {string}    str     String to frig.
 * 
 * @return  {string}
 */
function addBothSlashes(str)
{
    return addTrailingSlash(addLeadingSlash(str));
}
 
/**
 * Remove trailing slash.
 * 
 * @param   {string}    str     String to remove from.
 * 
 * @return  {string}
 */
function removeTrailingSlash(str)
{
    if (str.endsWith('/')) {
        return str.substr(0, str.length - 1);
    }
    return str;
}

/**
 * Remove leading slash.
 * 
 * @param   {string}    str     String to remove from.
 * 
 * @return  {string}
 */
function removeLeadingSlash(str)
{
    if (str.startsWith('/')) {
        return str.substr(1, str.length - 1);
    }
    return str;
}

/**
 * Remove both slashes.
 * 
 * @param   {string}    str     String to frig.
 * 
 * @return  {string}
 */
function removeBothSlashes(str)
{
    return removeTrailingSlash(removeLeadingSlash(str));
}
  
/**
 * Remove last segment.
 * 
 * @param   {string}    str     String to frig.
 * 
 * @return  {string}
 */
function removeLastSeg(str)
{
    let sp = str.split('/');
    sp.pop();
    return sp.join('/');
}
 
exports.addTrailingSlash = addTrailingSlash;
exports.addLeadingSlash = addLeadingSlash;
exports.addBothSlashes = addBothSlashes;
exports.removeTrailingSlash = removeTrailingSlash;
exports.removeLeadingSlash = removeLeadingSlash;
exports.removeBothSlashes = removeBothSlashes;
exports.removeLastSeg = removeLastSeg;
