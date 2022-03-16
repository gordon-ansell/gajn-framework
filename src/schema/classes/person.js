/**
 * @file        Schema 'Person'.
 * @module      Schema/Person
 * @author      Gordon Ansell   <contact@gordonansell.com> 
 * @copyright   Gordon Ansell, 2020.
 * @license     MIT
 */

'use strict';

const Thing = require("./thing");

/**
 * Schema 'Person'.
 */
class Person extends Thing
{
    additionalName(val) {return this.setProp('additionalName', val);}
    address(val) {return this.setProp('address', val);}
    affiliation(val) {return this.setProp('affiliation', val);}
    alumniOf(val) {return this.setProp('alumniOf', val);}
    award(val) {return this.setProp('award', val);}
    birthDate(val) {return this.setProp('birthDate', val);}
    birthPlace(val) {return this.setProp('birthPlace', val);}
    brand(val) {return this.setProp('brand', val);}
    children(val) {return this.setProp('children', val);}
    colleague(val) {return this.setProp('colleague', val);}
    contactPoint(val) {return this.setProp('contactPoint', val);}
    deathDate(val) {return this.setProp('deathDate', val);}
    deathPlace(val) {return this.setProp('deathPlace', val);}
    duns(val) {return this.setProp('duns', val);}
    email(val) {return this.setProp('email', val);}
    familyName(val) {return this.setProp('familyName', val);}
    faxNumber(val) {return this.setProp('faxNumber', val);}
    follows(val) {return this.setProp('follows', val);}
    funder(val) {return this.setProp('funder', val);}
    givenName(val) {return this.setProp('givenName', val);}
    globalLocationNumber(val) {return this.setProp('globalLocationNumber', val);}
    hasOccupation(val) {return this.setProp('hasOccupation', val);}
    hasOfferCatalog(val) {return this.setProp('hasOfferCatalog', val);}
    hasPOS(val) {return this.setProp('hasPOS', val);}
    height(val) {return this.setProp('height', val);}
    homeLocation(val) {return this.setProp('homeLocation', val);}
    honorificPrefix(val) {return this.setProp('honorificPrefix', val);}
    honorificSuffix(val) {return this.setProp('honorificSuffix', val);}
    interactionStatistic(val) {return this.setProp('interactionStatistic', val);}
    isicV4(val) {return this.setProp('isicV4', val);}
    knows(val) {return this.setProp('knows', val);}
    makesOffer(val) {return this.setProp('makesOffer', val);}
    memberOf(val) {return this.setProp('memberOf', val);}
    naics(val) {return this.setProp('naics', val);}
    nationality(val) {return this.setProp('nationality', val);}
    netWorth(val) {return this.setProp('netWorth', val);}
    owns(val) {return this.setProp('owns', val);}
    parent(val) {return this.setProp('parent', val);}
    performerIn(val) {return this.setProp('performerIn', val);}
    publishingPrinciples(val) {return this.setProp('publishingPrinciples', val);}
    relatedTo(val) {return this.setProp('relatedTo', val);}
    seeks(val) {return this.setProp('seeks', val);}
    sibling(val) {return this.setProp('sibling', val);}
    sponsor(val) {return this.setProp('sponsor', val);}
    spouse(val) {return this.setProp('spouse', val);}
    taxID(val) {return this.setProp('taxID', val);}
    telephone(val) {return this.setProp('telephone', val);}
    vatID(val) {return this.setProp('vatID', val);}
    weight(val) {return this.setProp('weight', val);}
    workLocation(val) {return this.setProp('workLocation', val);}
    worksFor(val) {return this.setProp('worksFor', val);}    
}

module.exports = Person