/**
 * @file        Schema 'Comment'.
 * @module      Schema/Comment
 * @author      Gordon Ansell   <contact@gordonansell.com> 
 * @copyright   Gordon Ansell, 2020.
 * @license     MIT
 */

'use strict';

const CreativeWork = require("./creativeWork");

/**
 * Schema 'Comment'.
 */
class Comment extends CreativeWork
{
    downvoteCount(val) {return this.setProp('downvoteCount', val);}
    parentItem(val) {return this.setProp('parentItem', val);}
    upvoteCount(val) {return this.setProp('upvoteCount', val);}
}

module.exports = Comment