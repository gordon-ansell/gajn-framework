/**
 * Please refer to the following files in the root directory:
 * 
 * README.md        For information about the package.
 * LICENSE          For license details, copyrights and restrictions.
 */
'use strict';

const syslog = require('../logger/syslog');

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
     * Metadata.
     */

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
     * 
     * @return  {string}
     */
    createConstruct(src, imgSpec, tag = 'img', mime = null)
    {
        let ret = `<${tag}`;

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

        if ("string" == typeof src) {
            if (this.hostname) {
                imgSpec[srcName] = this.config.qualify(src);
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
                    } else {
                        ret += ` ${name}="${imgSpec[name]}"`;
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
            if (this.hostname) {
                let qsrc = [];
                for (let u of src) {
                    let sp = href.split(' ');
                    let saved = sp.pop;
                    qsrc.push(this.config.qualify(sp[0]) + ' ' + saved);
                }
                ret += ` ${stag}="` + qsrc.join(', ') + `"`;
            } else {
                ret += ` ${stag}="` + src.join(', ') + `"`;
            }
            for (let href of src) {
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
                    } else {
                        ret += ` ${name}="${imgSpec[name]}"`;
                    }
                }
            }
        }

        ret += ` />`;

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

        return ret;
    }

    /**
     * Render.
     * 
     * @param   {string|object}     src         Source.
     * @param   {object}            imgSpec     Image spec.
     * @param   {boolean}           complex     Is this a complex construct?
     * 
     * @return  {string}
     */
    render(src, imgSpec, complex = false)
    {

        // -----------------------------
        // Initialise.
        // -----------------------------

        let caption = null;
        let figureSpec = {};
        this.metaIds = [];

        if (imgSpec.caption) {
            caption = imgSpec.caption;
            delete imgSpec.caption;
            if (imgSpec.class) {
                figureSpec.class = imgSpec.class;
                delete imgSpec.class;
            }
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
                if (count == Object.keys(src).length) {
                    ret += this.createConstruct(src[mime], imgSpec, 'img')
                } else {
                    ret += this.createConstruct(src[mime], imgSpec, 'source', mime)
                }
                count++;
            }

            if (count > 1) {
                ret = '<picture>' + ret + '</picture>';
            }

        } else {
            ret = this.createConstruct(src, imgSpec, 'img');
        }

        if (caption) {
            ret = this.wrapInFigure(ret, figureSpec, caption, this.opts);
        }
        return ret + this.schema;
    }
}

module.exports = ImageHtml;