/**
 * @file        Schema 'Offer'.
 * @module      Schema/Offer
 * @author      Gordon Ansell   <contact@gordonansell.com> 
 * @copyright   Gordon Ansell, 2020.
 * @license     MIT
 */

'use strict';

const Thing = require("./thing");

/**
 * Schema 'Offer'.
 */
class Offer extends Thing
{
    acceptedPaymentMethod(val) {return this.setProp('acceptedPaymentMethod', val);}
    addOn(val) {return this.setProp('addOn', val);}
    advanceBookingRequirement(val) {return this.setProp('advanceBookingRequirement', val);}
    aggregateRating(val) {return this.setProp('aggregateRating', val);}
    areaServed(val) {return this.setProp('areaServed', val);}
    availability(val) {return this.setProp('availability', val);}   // @TODO properly.
    availabilityEnds(val) {return this.setProp('availabilityEnds', val);}
    availabilityStarts(val) {return this.setProp('availabilityStarts', val);}
    availableAtOrFrom(val) {return this.setProp('availableAtOrFrom', val);}
    availableDeliveryMethod(val) {return this.setProp('availableDeliveryMethod', val);}
    businessFunction(val) {return this.setProp('businessFunction', val);}
    category(val) {return this.setProp('category', val);}
    deliveryLeadTime(val) {return this.setProp('deliveryLeadTime', val);}
    eligibleCustomerType(val) {return this.setProp('eligibleCustomerType', val);}
    eligibleDuration(val) {return this.setProp('eligibleDuration', val);}
    eligibleQuantity(val) {return this.setProp('eligibleQuantity', val);}
    eligibleRegion(val) {return this.setProp('eligibleRegion', val);}
    eligibleTransactionVolume(val) {return this.setProp('eligibleTransactionVolume', val);}
    gtin12(val) {return this.setProp('gtin12', val);}
    gtin13(val) {return this.setProp('gtin13', val);}
    gtin14(val) {return this.setProp('gtin14', val);}
    gtin8(val) {return this.setProp('gtin8', val);}
    includesObject(val) {return this.setProp('includesObject', val);}
    inventoryLevel(val) {return this.setProp('inventoryLevel', val);}
    itemCondition(val) {return this.setProp('itemCondition', val);}
    itemOffered(val) {return this.setProp('itemOffered', val);}
    mpn(val) {return this.setProp('mpn', val);}
    offeredBy(val) {return this.setProp('offeredBy', val);}
    price(val) {return this.setProp('price', val);}
    priceCurrency(val) {return this.setProp('priceCurrency', val);}
    priceSpecification(val) {return this.setProp('priceSpecification', val);}
    priceValidUntil(val) {return this.setProp('priceValidUntil', val);}
    review(val) {return this.setProp('review', val);}
    seller(val) {return this.setProp('seller', val);}
    serialNumber(val) {return this.setProp('serialNumber', val);}
    sku(val) {return this.setProp('sku', val);}
    validFrom(val) {return this.setProp('validFrom', val);}
    validThrough(val) {return this.setProp('validThrough', val);}
    warranty(val) {return this.setProp('warranty', val);}
}

module.exports = Offer