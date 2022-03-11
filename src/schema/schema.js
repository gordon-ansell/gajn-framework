/**
 * Please refer to the following files in the root directory:
 * 
 * README.md        For information about the package.
 * LICENSE          For license details, copyrights and restrictions.
 */
'use strict';

const path = require('path');
const SchemaObject = require('./schemaObject');
const { URL } = require('url');
const MD5 = require('../utils/md5');
const { slugify } = require('../utils/string');
const debug = require('debug')('Framework:schema.Schema'),
      debugf = require('debug')('Full.Framework:schema.Schema');


/**
 * A schema collection.
 */
class Schema
{
    /**
     * Context.
     * @type    {string}
     */
    static schemaContext = "https://schema.org";

    /**
     * Global images.
     * @type    {object}
     */
    static globalImages = {};

    /**
     * Items in the collection.
     * @member {object}
     */
    items = {};

    /**
     * Raw source for schema.
     * @member {object}
     */
    raw = {};

    /**
     * Images.
     * @member  {object}
     */
    images = {};

    /**
     * Image IDs
     * @member {string[]}
     */
    imageIds = [];

    /**
     * Configs.
     * @member {object}
     */
    config = {};

    /**
     * Context.
     * @member {object}
     */
    ctx = null;

    /**
     * Constructor.
     * 
     * @param   {object}    config      Configs.
     * 
     * @return  {Schema}
     */
    constructor(config)
    {
        this.config = config;
        SchemaObject.url = this.config.hostname;
    }

    /**
     * Set the page/article context.
     * 
     * @param   {object}    ctx         Context.
     * 
     * @return  {Schema}
     */
    setCtx(ctx)
    {
        this.ctx = ctx;
        return this;
    }

    /**
     * Add raw.
     * 
     * @param   {string}    name        Name.
     * @param   {object}    obj         Raw data.
     * 
     * @return  {Schema}
     */
    addRaw(name, obj)
    {
        this.raw[name] = obj;
        return this;
    }

    /**
     * Add global image.
     * 
     * @param   {string}    name        Name.
     * @param   {object}    obj         Raw data.
     * 
     * @return  {Schema}
     */
    static addGlobalImage(name, obj)
    {
        //debug(`Adding global image ${name}: %O`, obj);
        Schema.globalImages[name] = obj;
        return this;
    }

    /**
     * Add image.
     * 
     * @param   {string}    name        Name.
     * @param   {object}    obj         Raw data.
     * 
     * @return  {Schema}
     */
    addImage(name, obj)
    {
        this.images[name] = obj;
        return this;
    }

    /**
     * Dump images.
     * 
     * @return  {void}
     */
    dumpImages(page)
    {
        debug(`-------------------------------------------------------------`);
        debug(`Page ${page}`);
        debug(`-------------------------------------------------------------`);
        for (let name of Object.keys(this.images)) {
            debug(`====> ${name}`);
            let count = 0;
            for (let item of Object.keys(this.images[name])) {
                //debug(`Item ${count}: %O`, this.images[name][item]);
                let i = 0;
                for (let f of this.images[name][item].files) {
                    debug(`File ${count}.${i}: %O`, f);
                    i++;
                }
                count++;
            }
        }
    }

    /**
     * Create a reference.
     * 
     * @param   {string}    tag
     * 
     * @return  {object}
     */
    ref(tag)
    {
        return {"@id": new URL('#' + tag, this.config.hostname)};
    }

    /**
     * Qualify a URL.
     * 
     * @param   {string}    path
     * 
     * @return  {string} 
     */
    qualify(path)
    {
        return new URL(path, this.config.hostname);
    }

    /**
     * Render images.
     * 
     * @param   {string}    page
     * 
     * @return  {void}
     */
    _renderImages(page)
    {
        let mdc = new MD5();
        for (let idx of Object.keys(this.images)) {
            for (let type of Object.keys(this.images[idx])) {
                //debug(`${page}: %O`, this.images[idx][type].files);
                for (let f of this.images[idx][type].files) {
                    //debug(`Processing %s`, f.file);
                    let mdid = mdc.md5(f.file);
                    let obj = new SchemaObject('ImageObject', {}, mdid);
                    obj.setAttrib('contentUrl', this.qualify(f.file));
                    obj.setAttrib('url', this.qualify(f.file));
                    obj.setAttrib('width', f.width);
                    obj.setAttrib('height', f.height);
                    obj.setAttrib('representativeOfPage', true);
                    this.items[mdid] = obj; 
                    this.imageIds.push(mdid);
                }
            }
        }
    }

    /**
     * Create global image object.
     * 
     * @param   {string}    src
     * 
     * @return  {string[]}              IDs
     */
    createGlobalImageObject(src)
    {
        let ret = [];
        let mdc = new MD5();
        if (Schema.globalImages[src]) {
            for (let type of Object.keys(Schema.globalImages[src])) {
                for (let f of Schema.globalImages[src][type].files) {
                    let mdid = mdc.md5(f.file);
                    let obj = new SchemaObject('ImageObject', {}, mdid);
                    obj.setAttrib('contentUrl', this.qualify(f.file));
                    obj.setAttrib('url', this.qualify(f.file));
                    obj.setAttrib('width', f.width);
                    obj.setAttrib('height', f.height);
                    obj.setAttrib('representativeOfPage', true);
                    this.items[mdid] = obj;
                    ret.push(mdid); 
                }
            }
        } else {
            let mdid = mdc.md5(src);
            let obj = new SchemaObject('ImageObject', {}, mdid);
            obj.setAttrib('contentUrl', this.qualify(src));
            obj.setAttrib('url', this.qualify(src));
            this.items[mdid] = obj;
            ret.push(mdid); 
        }
        return ret;
    }

    /**
     * Render the authors.
     * 
     * @param   {object}    authors
     * @param   {string}    page
     * 
     * @return  {void}
     */
    _renderAuthors(authors, page)
    {
        for (let key of Object.keys(authors)) {
            let id = 'author-' + slugify(key);
            let obj = new SchemaObject('Person', {}, id);
            let stink = authors[key];
            for (let f in stink) {
                if ('image' === f) {
                    let ids = this.createGlobalImageObject(stink['image']);
                    for (let id of ids) {
                        obj.appendArrayAttrib('image', this.ref(id));
                    }
                } else if ('url' === f) { 
                    obj.setAttrib('url', this.qualify(stink[f]));
                } else {
                    obj.setAttrib(f, stink[f]);
                }
            }
            this.items[id] = obj;
        }
    }

    /**
     * Get all the image IDs
     * 
     * @return
     */
    getImageIds()
    {
        let ret = [];
        for (let item of this.imageIds) {
            ret.push(this.ref(item));
        }
        return ret;
    }

    /**
     * Render the publisher.
     * 
     * @param   {object}    punlisher
     * @param   {string}    page
     * 
     * @return  {void}
     */
    _renderPublisher(publisher, page)
    {
        let obj = new SchemaObject('Organization', {}, 'publisher');
        for (let key of Object.keys(publisher)) {
            if ('image' === key || 'logo' === key) {
                let ids = this.createGlobalImageObject(publisher[key]);
                for (let id of ids) {
                    obj.appendArrayAttrib(key, this.ref(id));
                }
            } else if ('url' === key) { 
                obj.setAttrib('url', this.qualify(publisher[key]));
            } else {
                obj.setAttrib(key, publisher[key]);
            }
        }
        this.items['publisher'] = obj;
    }

    /**
     * Render the website.
     * 
     * @param   {string}  page
     * 
     * @return  {void}
     */
    _renderWebsite(page)
    {
        if (this.config.site) {
            let site = this.config.site;
            
            let obj = new SchemaObject('WebSite', {}, 'website');

            if (site.authors) {
                this._renderAuthors(site.authors, page); 
            }
            if (site.publisher) {
                this._renderPublisher(site.publisher, page);
                obj.setAttrib('publisher', this.ref('publisher'));
            }
            
            if (site.title) obj.setAttrib('name', site.title);
            if (site.description) obj.setAttrib('description', site.description);
            obj.setAttrib('url', this.config.hostname);
            this.items['website'] = obj;
        }
    }

    /**
     * Render the web page.
     * 
     * @param   {string}    page
     * 
     * @return  {void}
     */
    _renderWebpage(page)
    {
        if (this.ctx) {

            //debug("ctx: %O", this.ctx);

            let obj = new SchemaObject('WebPage', {}, 'webpage');

            if (this.ctx.title) {
                obj.setAttrib('name', this.ctx.title);
            }

            for (let item of ['headline', 'description']) {
                if (this.ctx[item]) {
                    obj.setAttrib(item, this.ctx[item]);
                }
            }

            if (this.ctx.permalink) {
                obj.setAttrib('url', this.qualify(this.ctx.permalink));
            }

            if (!obj.hasAttrib('headline') && this.ctx.title) {
                obj.setAttrib('headline', this.ctx.title)
            }

            if (this.ctx._date) {
                obj.setAttrib('datePublished', this.ctx._date.iso);
            }

            if (this.ctx._modified) {
                obj.setAttrib('dateModified', this.ctx._modified.iso);
            }

            obj.setAttrib('isPartOf', this.ref('website'));

            if (this.raw.breadcrumb) {
                let itemListElement = [];
                for (let item of this.raw.breadcrumb) {
                    let s = {
                        "@type": "ListItem",
                        name: item.title,
                        position: item.num
                    }
                    if (item.url) {
                        //s['@id'] = this.qualify(item.url);
                        s['item'] = {"@type": "WebPage", "@id": this.qualify(item.url)};
                    }
                    itemListElement.push(s);
                }
                this.items['breadcrumb'] = new SchemaObject('BreadcrumbList', {itemListElement: itemListElement}, 'breadcrumb');
                obj.setAttrib('breadcrumb', this.ref('breadcrumb'));
            }

            if (this.ctx.permalink) {
                let action = {"@type": "ReadAction", target: this.qualify(this.ctx.permalink)};
                obj.setAttrib('potentialAction', action);
            }

            if (this.imageIds.length > 0) {
                obj.setAttrib('image', this.getImageIds());
            }

            this.items['webpage'] = obj;
        }
    }

    /**
     * Render the article.
     * 
     * @param   {string}    page
     * 
     * @return  {void}
     */
    _renderArticle(page)
    {
        if (this.ctx) {

            //debug("ctx: %O", this.ctx);

            let type = 'BlogPosting';
            if (this.ctx.type && 'post' !== this.ctx.type) {
                type = 'Article';
            }

            let obj = new SchemaObject(type, {}, 'article');

            if (this.ctx.title) {
                obj.setAttrib('name', this.ctx.title);
            }

            for (let item of ['headline', 'description']) {
                if (this.ctx[item]) {
                    obj.setAttrib(item, this.ctx[item]);
                }
            }

            if (this.ctx.permalink) {
                obj.setAttrib('url', this.qualify(this.ctx.permalink));
            }

            if (!obj.hasAttrib('headline') && this.ctx.title) {
                obj.setAttrib('headline', this.ctx.title)
            }

            if (this.ctx._date) {
                obj.setAttrib('datePublished', this.ctx._date.iso);
            }

            if (this.ctx._modified) {
                obj.setAttrib('dateModified', this.ctx._modified.iso);
            }

            obj.setAttrib('mainEntityOfPage', this.ref('webpage'));

            let author = 'author-' + slugify(this.ctx.author || this.ctx.site.defaultAuthor); 
            obj.setAttrib('author', this.ref(author));

            if (this.ctx.tags) {
                obj.setAttrib('keywords', this.ctx.tags);
            }

            if (this.ctx.wordcount) {
                obj.setAttrib('wordcount', this.ctx.wordcount);
            }

            if (this.ctx.excerpt_text) {
                obj.setAttrib('backstory', this.ctx.excerpt_text);
            }

            if (this.imageIds.length > 0) {
                obj.setAttrib('image', this.getImageIds());
            }

            this.items['article'] = obj;
        }
    }

    /**
     * Render a product.
     * 
     * @param   {string}    page 
     * @param   {object}    productFields
     * 
     * @return  {string}    Product ID.
     */
    _renderProduct(page, productFields, rating = null)
    {
        let id = 'product-' + slugify(productFields.name);
        let obj = new SchemaObject(productFields.type, {}, id);

        for (let idx of Object.keys(productFields)) {
            if ('type' !== idx && !idx.startsWith('__') && !idx.startsWith('@')) {

                if ('brand' === idx) {
                    obj.setAttrib(idx, {'@type': "Organization", name: productFields[idx]});
                } else if ('operatingSystem' === idx) {
                    obj.setAttrib(idx, productFields[idx]);
                } else {
                    obj.setAttrib(idx, productFields[idx]);
                }
            }
        }

        if (rating) {
            let ar = {
                '@type': 'AggregateRating',
                ratingValue: rating,
                bestRating: 5,
                worstRating: 0,
                ratingCount: 1
            };
            obj.setAttrib('aggregateRating', ar);
        }

        this.items[id] = obj;

        return id;
    }

    /**
     * Render a review.
     * 
     * @param   {string}    page 
     * 
     * @return  {void}
     */
    _renderReview(page)
    {
        if (!this.raw.review) {
            return;
        }

        let aggr = null;
        if (this.raw.review.review.aggr) {
            aggr = raw.review.review.aggr;
        }
        let rating = null;
        if (aggr) {
            rating = raw.review.review.rating;
        }

        let pid = null;
        if (this.raw.review.product) {
            pid = this._renderProduct(page, this.raw.review.product, rating);
        }

        let reviewFields = this.raw.review.review;

        let id = 'review-' + slugify(reviewFields.name);

        let obj = new SchemaObject('Review', {}, id);

        for (let idx of Object.keys(reviewFields)) {
            if ('type' !== idx && !idx.startsWith('__') && !idx.startsWith('@')) {

                if ('rating' === idx) {
                    let r = {
                        '@type': "Rating",
                        ratingValue: reviewFields[idx],
                        bestRating: 5,
                        worstRating: 0
                    }
                    obj.setAttrib('reviewRating', r);
                } else {
                    obj.setAttrib(idx, reviewFields[idx]);
                }

            }
        }

        obj.setAttrib('itemReviewed', this.ref(pid));
        this.items[id] = obj;
    }

    /**
     * Render the schema.
     * 
     * @return  {string}
     */
    render(page, replacer = null, space = null)
    {
        this._renderImages(page);
        this._renderWebsite(page);
        this._renderWebpage(page);
        this._renderArticle(page);
        this._renderReview(page);

        //this.dumpImages(page);

        //debug(`${page}: %O`, this.items)

        let ret = {
            "@context": Schema.schemaContext,
            "@graph": []
        }

        for (let idx in this.items) {
            ret['@graph'].push(this.items[idx].attribs);
        }
        return JSON.stringify(ret, replacer, space);
    }
}

module.exports = Schema;