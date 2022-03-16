/**
 * @file        Schema 'Article'.
 * @module      Schema/Article
 * @author      Gordon Ansell   <contact@gordonansell.com> 
 * @copyright   Gordon Ansell, 2020.
 * @license     MIT
 */

'use strict';

const CreativeWork = require("./creativeWork");

/**
 * Schema 'Article'.
 */
class Article extends CreativeWork
{
    articleBody(val) {return this.setProp('articleBody', val);}
    articleSection(val) {return this.setProp('articleSection', val);}
    backstory(val) {return this.setProp('backstory', val);}
    pageEnd(val) {return this.setProp('pageEnd', val);}
    pageStart(val) {return this.setProp('pageStart', val);}
    pagination(val) {return this.setProp('pagination', val);}
    speakable(val) {return this.setProp('speakable', val);}
    wordCount(val) {return this.setProp('wordCount', val);}
}

module.exports = Article