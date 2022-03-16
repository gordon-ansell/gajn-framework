/**
 * @file        Schema 'Organization'.
 * @module      Schema/Organization
 * @author      Gordon Ansell   <contact@gordonansell.com> 
 * @copyright   Gordon Ansell, 2020.
 * @license     MIT
 */

'use strict';

const Thing = require("./thing");

/**
 * Schema 'Organization'.
 */
class Organization extends Thing
{
    address(val) {return this.setProp('address', val);}
    aggregateRating(val) {return this.setProp('aggregateRating', val);}
    alumni(val) {return this.setProp('alumni', val);}
    areaServed(val) {return this.setProp('areaServed', val);}
    award(val) {return this.setProp('award', val);}
    brand(val) {return this.setProp('brand', val);}
    contactPoint(val) {return this.setProp('contactPoint', val);}
    department(val) {return this.setProp('department', val);}
    dissolutionDate(val) {return this.setProp('dissolutionDate', val);}
    duns(val) {return this.setProp('duns', val);}
    email(val) {return this.setProp('email', val);}
    employee(val) {return this.setProp('employee', val);}
    event(val) {return this.setProp('event', val);}
    faxNumber(val) {return this.setProp('faxNumber', val);}
    founder(val) {return this.setProp('founder', val);}
    foundingDate(val) {return this.setProp('foundingDate', val);}
    foundingLocation(val) {return this.setProp('foundingLocation', val);}
    funder(val) {return this.setProp('funder', val);}
    globalLocationNumber(val) {return this.setProp('globalLocationNumber', val);}
    hasOfferCatalog(val) {return this.setProp('hasOfferCatalog', val);}
    hasPOS(val) {return this.setProp('hasPOS', val);}
    interactionStatistic(val) {return this.setProp('interactionStatistic', val);}
    isicV4(val) {return this.setProp('isicV4', val);}
    legalName(val) {return this.setProp('legalName', val);}
    leiCode(val) {return this.setProp('leiCode', val);}
    location(val) {return this.setProp('location', val);}
    logo(val) {return this.setProp('logo', val);}
    makesOffer(val) {return this.setProp('makesOffer', val);}
    member(val) {return this.setProp('member', val);}
    memberOf(val) {return this.setProp('memberOf', val);}
    naics(val) {return this.setProp('naics', val);}
    numberOfEmployees(val) {return this.setProp('numberOfEmployees', val);}
    owns(val) {return this.setProp('owns', val);}
    parentOrganization(val) {return this.setProp('parentOrganization', val);}
    publishingPrinciples(val) {return this.setProp('publishingPrinciples', val);}
    review(val) {return this.setProp('review', val);}
    seeks(val) {return this.setProp('seeks', val);}
    slogan(val) {return this.setProp('slogan', val);}
    sponsor(val) {return this.setProp('sponsor', val);}
    subOrganization(val) {return this.setProp('subOrganization', val);}
    taxID(val) {return this.setProp('taxID', val);}
    telephone(val) {return this.setProp('telephone', val);}
    vatID(val) {return this.setProp('vatID', val);}

}

module.exports = Organization