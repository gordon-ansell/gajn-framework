/**
 * @file        Schema 'LocalBusiness'.
 * @module      Schema/LocalBusiness
 * @author      Gordon Ansell   <contact@gordonansell.com> 
 * @copyright   Gordon Ansell, 2020.
 * @license     MIT
 */

'use strict';

const Organization = require("./organization");

/**
 * Schema 'LocalBusiness'.
 */
class LocalBusiness extends Organization
{
    branchOf(val) {return this.setProp('branchOf', val);}
    currenciesAccepted(val) {return this.setProp('currenciesAccepted', val);}
    openingHours(val) {return this.setProp('openingHours', val);}
    paymentAccepted(val) {return this.setProp('paymentAccepted', val);}
    priceRange(val) {return this.setProp('priceRange', val);}

    // Place.
    additionalProperty(val) {return this.setProp('additionalProperty', val);}
    address(val) {return this.setProp('address', val);}
    aggregateRating(val) {return this.setProp('aggregateRating', val);}
    amenityFeature(val) {return this.setProp('amenityFeature', val);}
    branchCode(val) {return this.setProp('branchCode', val);}
    containedInPlace(val) {return this.setProp('containedInPlace', val);}
    containsPlace(val) {return this.setProp('containsPlace', val);}
    event(val) {return this.setProp('event', val);}
    faxNumber(val) {return this.setProp('faxNumber', val);}
    geo(val) {return this.setProp('geo', val);}
    geoContains(val) {return this.setProp('geoContains', val);}
    geoCoveredBy(val) {return this.setProp('geoCoveredBy', val);}
    geoCovers(val) {return this.setProp('geoCovers', val);}
    geoCrosses(val) {return this.setProp('geoCrosses', val);}
    geoDisjoint(val) {return this.setProp('geoDisjoint', val);}
    geoEquals(val) {return this.setProp('geoEquals', val);}
    geoIntersects(val) {return this.setProp('geoIntersects', val);}
    geoOverlaps(val) {return this.setProp('geoOverlaps', val);}
    geoTouches(val) {return this.setProp('geoTouches', val);}
    geoWithin(val) {return this.setProp('geoWithin', val);}
    globalLocationNumber(val) {return this.setProp('globalLocationNumber', val);}
    hasMap(val) {return this.setProp('hasMap', val);}
    isAccessibleForFree(val) {return this.setProp('isAccessibleForFree', val);}
    isicV4(val) {return this.setProp('isicV4', val);}
    latitude(val) {return this.setProp('latitude', val);}
    logo(val) {return this.setProp('logo', val);}
    longitude(val) {return this.setProp('longitude', val);}
    maximumAttendeeCapacity(val) {return this.setProp('maximumAttendeeCapacity', val);}
    openingHoursSpecification(val) {return this.setProp('openingHoursSpecification', val);}
    photo(val) {return this.setProp('photo', val);}
    publicAccess(val) {return this.setProp('publicAccess', val);}
    review(val) {return this.setProp('review', val);}
    slogan(val) {return this.setProp('slogan', val);}
    smokingAllowed(val) {return this.setProp('smokingAllowed', val);}
    specialOpeningHoursSpecification(val) {return this.setProp('specialOpeningHoursSpecification', val);}
    telephone(val) {return this.setProp('telephone', val);}
}

module.exports = LocalBusiness