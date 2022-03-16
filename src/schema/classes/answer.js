/**
 * @file        Schema 'Answer'.
 * @module      Schema/Answer
 * @author      Gordon Ansell   <contact@gordonansell.com> 
 * @copyright   Gordon Ansell, 2020.
 * @license     MIT
 */

'use strict';

const Comment = require("./comment");

/**
 * Schema 'Answer'.
 */
class Answer extends Comment
{
    answerExplanation(val) {return this.setProp('answerExplanation', val);}
}

module.exports = Answer