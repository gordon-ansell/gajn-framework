/**
 * @file        Schema 'Question'.
 * @module      Schema/Question
 * @author      Gordon Ansell   <contact@gordonansell.com> 
 * @copyright   Gordon Ansell, 2020.
 * @license     MIT
 */

'use strict';

const Comment = require("./comment");

/**
 * Schema 'Question'.
 */
class Question extends Comment
{
    acceptedAnswer(val) {return this.setProp('acceptedAnswer', val);}
    answerCount(val) {return this.setProp('answerCount', val);}
    eduQuestionType(val) {return this.setProp('eduQuestionType', val);}
    suggestedAnswer(val) {return this.setProp('suggestedAnswer', val);}
}

module.exports = Question