/**
 * @file        Schema 'Blog'.
 * @module      Schema/Blog
 * @author      Gordon Ansell   <contact@gordonansell.com> 
 * @copyright   Gordon Ansell, 2020.
 * @license     MIT
 */

'use strict';

const CreativeWork = require("./creativeWork");

/**
 * Schema 'Blog'.
 */
class Blog extends CreativeWork
{
    blogPost(val) {return this.setProp('blogPost', val);}
    issn(val) {return this.setProp('issn', val);}
}

module.exports = Blog