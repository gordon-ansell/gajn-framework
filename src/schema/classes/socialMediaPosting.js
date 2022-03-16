/**
 * @file        Schema 'SocialMediaPosting'.
 * @module      Schema/SocialMediaPosting
 * @author      Gordon Ansell   <contact@gordonansell.com> 
 * @copyright   Gordon Ansell, 2020.
 * @license     MIT
 */

'use strict';

const Article = require("./article");

/**
 * Schema 'SocialMediaPosting'.
 */
class SocialMediaPosting extends Article
{
    sharedContent(val) {return this.setProp('sharedContent', val);}
}

module.exports = SocialMediaPosting