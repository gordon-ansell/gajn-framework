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

            let bc = {
                "@type": 'BreadcrumbList',
                "@id": this.qualify('#breadcrumb'),
                itemListElement: []
            }
            if (this.raw.breadcrumb) {
                for (let item of this.raw.breadcrumb) {
                    let s = {
                        "@type": "ListItem",
                        "@id": this.qualify(item.url), 
                        name: item.title,
                        url: this.qualify(item.url),
                        position: item.num
                    }
                    bc.itemListElement.push(s);
                }
                this.items['breadcrumb'] = bc;
                obj.setAttrib('breadcrumb', this.ref('breadcrumb'));
            }

            this.items['webpage'] = obj;
        }
    }

    /**
     * Render the schema.
     * 
     * @return  {string}
     */
    render(page)
    {
        this._renderImages(page);
        this._renderWebsite(page);
        this._renderWebpage(page);

        //this.dumpImages(page);

        //debug(`${page}: %O`, this.items)

        let ret = {
            "@context": Schema.schemaContext,
            "@graph": []
        }

        for (let idx in this.items) {
            ret['@graph'].push(this.items[idx].attribs);
        }
        return JSON.stringify(ret, null, '   ');
    }
}

module.exports = Schema;