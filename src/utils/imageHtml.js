/**
 * Please refer to the following files in the root directory:
 * 
 * README.md        For information about the package.
 * LICENSE          For license details, copyrights and restrictions.
 */
'use strict';

const syslog = require('../logger/syslog');
const { URL } = require('url');
const path = require('path');
const fs = require('fs');
const imageSize = require("image-size");

/**
 * Image html renderer.
 */
class ImageHtml
{
    /**
     * Options.
     * @member {object}
     */
    opts = {};

    /**
     * Meta IDs.
     * @member {array}
     */
    metaIds = [];

    /**
     * Schema lines.
     * @member {string}
     */
    schema = '';

    /**
     * Hostname.
     * @member {string}
     */
    hostname = null;

    /**
     * Biggest image.
     */
    biggestImage = null;

    /**
     * Smallest image.
     */
    smallestImage = null;

    /**
     * Constructor.
     * 
     * @param   {object}    opts        Options.
     * @param   {string}    hostname    Hostname.
     * @return  {ImageHtml} 
     */
    constructor(opts, hostname = null)
    {
        this.opts = opts;
        this.hostname = hostname;
    }

    /**
     * Qualify a URL.
     * 
     * @param   {string}    path    Path to qualify.
     * 
     * @return  {string}
     */
    qualify(path)
    {
        if (path.startsWith('http://') || path.startsWith('https://')) {
            return path;
        }

        return new URL(path, this.hostname).href;
    }

     /**
     * Wrap something in a figure.
     * 
     * @param   {string}    body        Body to wrap.
     * @param   {object}    figureSpec  Figure spec.
     * @param   {string}    caption     Caption.
     * @param   {object}    opts        Options.
     * 
     * @return  {string}
     */
    wrapInFigure(body, figureSpec, caption, opts)
    {
        let ret = '<figure ';

        let fc = opts.figureClass || 'respimg';

        if (fc) {
            if (figureSpec.class) {
                figureSpec.class += ' ' + fc;
            } else {
                figureSpec.class = fc;
            }
        }

        for (let name in figureSpec) {
            ret += ` ${name}="${figureSpec[name]}"`;
        }

        ret += '>' + body + '<figcaption>' + caption + '</figcaption></figure>';

        return ret;
    }

    /**
     * Create a simple construct.
     * 
     * @param   {string|array}      src         Source.
     * @param   {object}            imgSpec     Image spec.
     * @param   {string}            tag         HTML tag to use.
     * @param   {string}            mime        Mime type.
     * @param   {number}            w           Width.
     * @param   {number}            h           Height.
     * @param   {boolean}           rss         Rss?    
     * 
     * @return  {string}
     */
    createConstruct(src, imgSpec, tag = 'img', mime = null, w = null, h = null, rss = false)
    {
        let ret = `<${tag}`;
        let retns = `<${tag}`;      // No script.

        let wantMeta = false;
        let metaSrcs = [];
        let meta = {};

        if (mime) {
            imgSpec.type = mime;
        }

        let srcName = 'src';
        let sizesName = 'sizes';
        if (this.opts.lazyload) {
            srcName = 'data-src';
            sizesName = 'data-sizes';
        } 

        if (imgSpec.sizes) {
            let s = imgSpec.sizes;
            delete imgSpec.sizes;
            imgSpec[sizesName] = s;
        }

        if ('source' == tag) {
            delete imgSpec.alt;
            delete imgSpec.width;
            delete imgSpec.height;
            w = null;
            h = null;
        }

        if ('img' == tag) {
            delete imgSpec.type;
            let sp = src[src.length - 1].split(' ');
            sp.pop();
            imgSpec[srcName] = sp.join(' ');
            if (!imgSpec.alt) {
                imgSpec.alt = "";
            }
        }

        let biggest = null;
        let biggestWidth = 0;
        let biggestHeight = 0;
        let smallest = null;
        let smallestWidth = 99999;
        let smallestHeight = 99999;
        if (Array.isArray(src)) {
            for (let s1 of src) {
                let sp = s1.split(' ');
                let is = imageSize(path.resolve('.' + sp[0]));
                let sz = parseInt(sp[1].replace('w', ''));
                if (sz > biggestWidth) {
                    biggestWidth = sz;
                    biggest = sp[0];
                }
                if (sz < smallestWidth) {
                    smallestWidth = sz;
                    smallest = sp[0]
                }
                if (is.height > biggestHeight) {
                    biggestHeight = is.height;
                }
                if (is.height < smallestHeight) {
                    smallestHeight = is.height;
                }
            }
        } else {
            let is;
            if (-1 !== src.indexOf(' ')) {
                is = imageSize(path.resolve('.' + src.split(' ')[0]));
                biggest = src.split(' ')[0];
                smallest = src.split(' ')[0];
            } else {
                is = imageSize(path.resolve('.' + src));
                biggest = src;
                smallest = src;
            }
            biggestHeight = is.height;
            smallestHeight = is.height;
            biggestWidth = is.width;
            smallestWidth = is.width;
        }

        this.biggestWidth = biggestWidth;
        this.smallestWidth = smallestWidth;
        this.biggestHeight = biggestHeight;
        this.smallestHeight = smallestHeight;

        if (null === this.biggestImage) {
            this.biggestImage = biggest;
        } else {
            let extb = path.extname(this.biggestImage);
            let extn = path.extname(biggest);
            let preferredFormats = ['.jpeg', '.jpg', '.png'];
            if (!preferredFormats.includes(extb) && preferredFormats.includes(extn)) {
                this.biggestImage = biggest;
            }
        }

        if (null === this.smallestImage) {
            this.smallestImage = smallest;
        } else {
            let extb = path.extname(this.smallestImage);
            let extn = path.extname(smallest);
            let preferredFormats = ['.jpeg', '.jpg', '.png'];
            if (!preferredFormats.includes(extb) && preferredFormats.includes(extn)) {
                this.smallestImage = smallest;
            }
        }

        if ("string" == typeof src) {
            if (this.hostname) {
                imgSpec[srcName] = this.qualify(src);
            } else {
                imgSpec[srcName] = src;
            }
            delete imgSpec[sizesName];
            metaSrcs.push(src);
            for (let name in imgSpec) {
                if (!name.startsWith('__')) {
                    if ('@' == name) {
                        wantMeta = true;
                    } else if (name.startsWith('@')) {
                        wantMeta = true;
                        meta[name.substring(1)] = imgSpec[name];
                    } else if ('width' == name) {
                        ret += ` ${name}="${imgSpec[name].replace('px', '')}"`;
                        retns += ` ${name}="${imgSpec[name].replace('px', '')}"`;
                    } else {
                        ret += ` ${name}="${imgSpec[name]}"`;
                        if (name == srcName) {
                            retns += ` src="${imgSpec[name]}"`;
                            if (w) {
                                ret += ` width=${w}`;
                                retns += ` width=${w}`;
                            }
                            if (h) {
                                ret += ` height=${h}`;
                                retns += ` height=${h}`;
                            }
                        } else if ('class' == name) {
                            let cl = imgSpec[name].replace('lazyload', '');
                            if (cl.trim() != "") {
                                retns += ` class="${cl}"`;
                            }
                        } else {
                            retns += ` ${name}="${imgSpec[name]}"`;
                        }
                    }
                }
            }
        } else {
            let stag;
            if (this.opts.lazyload) {
                stag = 'data-srcset';
            } else {
                stag = 'srcset';
            }
            let rawSizes = '';
            if (this.hostname) {
                let qsrc = [];
                for (let u of src) {
                    let sp = u.split(' ');
                    let saved = sp.pop();
                    qsrc.push(this.qualify(sp[0]) + ' ' + saved);
                    if ('' != rawSizes) {
                        rawSizes += ' ';
                    }
                    rawSizes += saved.replace('w', 'px');
                }
                ret += ` ${stag}="` + qsrc.join(', ') + `"`;
                retns += ` srcset="` + qsrc.join(', ') + `"`;
            } else {
                ret += ` ${stag}="` + src.join(', ') + `"`;
                retns += ` srcset="` + src.join(', ') + `"`;
            }
            for (let href of src) {
                let sp = href.split(' ');
                sp.pop();
                metaSrcs.push(sp.join(' '));
            }
            for (let name in imgSpec) {
                if (!name.startsWith('__')) {
                    if ('@' == name) {
                        wantMeta = true;
                    } else if (name.startsWith('@')) {
                        wantMeta = true;
                        meta[name.substring(1)] = imgSpec[name];
                    } else if ('width' == name) {
                        ret += ` ${name}="${imgSpec[name].replace('px', '')}"`;
                        retns += ` ${name}="${imgSpec[name].replace('px', '')}"`;
                    } else if ('data-src' == name || 'src' == name) {
                        if (this.hostname) {
                            ret += ` ${name}="${this.qualify(imgSpec[name])}"`;
                            retns += ` src="${this.qualify(imgSpec[name])}"`;
                        } else {
                            ret += ` ${name}="${imgSpec[name]}"`;
                            retns += ` src="${imgSpec[name]}"`;
                        }
                        if (w) {
                            ret += ` width=${w}`;
                            retns += ` width=${w}`;
                        }
                        if (h) {
                            ret += ` height=${h}`;
                            retns += ` height=${h}`;
                        }

                    } else {
                        ret += ` ${name}="${imgSpec[name]}"`;
                        if ('class' == name) {
                            let cl = imgSpec[name].replace('lazyload', '');
                            if (cl.trim() != "") {
                                retns += ` class="${cl}"`;
                            }
                        } else if (sizesName == name) {
                            retns += ` sizes="${rawSizes}"`;
                        } else {
                            retns += ` ${name}="${imgSpec[name]}"`;
                        }
                    }
                }
            }
        }

        ret += ` />`;
        retns += ` />`;

        if (wantMeta) {
            //let schema = '';
            for (let item of metaSrcs) {
                //this.schema += `<link href="${item}" itemid="#${item}"`;
                this.schema += `<link href="${item}"`;
                this.metaIds.push(item);
                for (let name in meta) {
                    this.schema += ` ${name}="${meta[name]}"`
                }
                this.schema += ' />';
            }
            //ret += schema;
        }

        if (!rss) {
            ret += '<noscript>' + retns + '</noscript>';
            return ret;
        }

        return retns;
    }

    /**
     * Render.
     * 
     * @param   {string|object}     src         Source.
     * @param   {object}            imgSpec     Image spec.
     * @param   {boolean}           complex     Is this a complex construct?
     * @param   {number}            w           Width.
     * @param   {number}            h           Height.
     * 
     * @return  {string}
     */
    render(src, imgSpec, complex = false, w = null, h = null)
    {
        // -----------------------------
        // Initialise.
        // -----------------------------

        let caption = null;
        let link = null;
        let figureSpec = {};
        this.metaIds = [];

        if (imgSpec.link) {
            link = imgSpec.link;
            delete imgSpec.link;
        }

        if (imgSpec.caption) {
            caption = imgSpec.caption;
            delete imgSpec.caption;
            if (imgSpec.class) {
                figureSpec.class = imgSpec.class;
                delete imgSpec.class;
            }
        }

        let rss = false;
        if (imgSpec.rss && imgSpec.rss == true) {
            rss = true;
            delete imgSpec.rss;
        }

        if (this.opts.lazyload) {
            if (imgSpec.sizes) {
                imgSpec['data-sizes'] = imgSpec.sizes;
                delete imgSpec.sizes;
            } else {
                imgSpec['data-sizes'] = "auto";
            }

            if (imgSpec.class) {
                if (!imgSpec.class.includes('lazyload')) {
                    imgSpec.class += ' lazyload';
                }
            } else {
                imgSpec.class = 'lazyload';
            }
        }

        let ret = '';

        if (complex) {

            let count = 1;
            
            for (let mime in src) {
                ret += this.createConstruct(src[mime], imgSpec, 'source', mime, null, null, rss)
                count++;
            }

            //ret += `<img `

            /*
            for (let mime in src) {
                if (count == Object.keys(src).length) {
                    ret += this.createConstruct(src[mime], imgSpec, 'img', null, w, h, rss)
                } else {
                    ret += this.createConstruct(src[mime], imgSpec, 'source', mime, null, null, rss)
                }
                count++;
            }
            */

            if (count > 1) {
                ret = '<picture>' + ret + '</picture>';
            }

        } else {
            ret = this.createConstruct(src, imgSpec, 'img', null, w, h, rss);
        }

        if (link) {
            let l = ('self' == link.trim()) ? this.biggestImage : link;
            ret = `<a class="imglink" target="_blank" title="Open image in new tab." href="${l}">${ret}</a>`;
        }

        if (caption) {
            ret = this.wrapInFigure(ret, figureSpec, caption, this.opts);
        }
        return ret + this.schema;
    }
}

module.exports = ImageHtml;