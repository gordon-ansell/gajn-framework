/**
 * @file        Schema 'Product'.
 * @module      Schema/Product
 * @author      Gordon Ansell   <contact@gordonansell.com> 
 * @copyright   Gordon Ansell, 2020.
 * @license     MIT
 */

'use strict';

const Thing = require("./thing");

/**
 * Schema 'Product'.
 */
class Product extends Thing
{
    additionalProperty(val) {return this.setProp('additionalProperty', val);}
    aggregateRating(val) {return this.setProp('aggregateRating', val);}
    audience(val) {return this.setProp('audience', val);}
    award(val) {return this.setProp('award', val);}
    awards(val) {return this.setProp('awards', val);}
    brand(val) {return this.setProp('brand', val);}
    category(val) {return this.setProp('category', val);}
    color(val) {return this.setProp('color', val);}
    depth(val) {return this.setProp('depth', val);}
    gtin12(val) {return this.setProp('gtin12', val);}
    gtin13(val) {return this.setProp('gtin13', val);}
    gtin14(val) {return this.setProp('gtin14', val);}
    gtin8(val) {return this.setProp('gtin8', val);}
    height(val) {return this.setProp('height', val);}
    isAccessoryOrSparePartFor(val) {return this.setProp('isAccessoryOrSparePartFor', val);}
    isConsumableFor(val) {return this.setProp('isConsumableFor', val);}
    isRelatedTo(val) {return this.setProp('isRelatedTo', val);}
    isSimilarTo(val) {return this.setProp('isSimilarTo', val);}
    itemCondition(val) {return this.setProp('itemCondition', val);}
    logo(val) {return this.setProp('logo', val);}
    manufacturer(val) {return this.setProp('manufacturer', val);}
    material(val) {return this.setProp('material', val);}
    model(val) {return this.setProp('model', val);}
    mpn(val) {return this.setProp('mpn', val);}
    offers(val) {return this.setProp('offers', val);}
    productID(val) {return this.setProp('productID', val);}
    productionDate(val) {return this.setProp('productionDate', val);}
    purchaseDate(val) {return this.setProp('purchaseDate', val);}
    releaseDate(val) {return this.setProp('releaseDate', val);}
    review(val) {return this.setProp('review', val);}
    reviews(val) {return this.setProp('reviews', val);}
    sku(val) {return this.setProp('sku', val);}
    slogan(val) {return this.setProp('slogan', val);}
    weight(val) {return this.setProp('weight', val);}
    width(val) {return this.setProp('width', val);}
}

module.exports = Product