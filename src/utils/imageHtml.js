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
const HtmlGenerator = require('../html/htmlGenerator');
const HtmlFigure = require('../html/htmlFigure');
const debug = require('debug')('Framework:utils:ImageHtml'),
      debugf = require('debug')('Full.Framework:utils:ImageHtml');


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

            let base = src[src.length - 1];
            let srch = 'src';
            let load = '';
            let alt = '';
            if (this.opts.lazyload) {
                srch = 'data-src';
                load = ` load="lazy"`;
            }
            if (imgSpec.alt) {
                alt = ` alt="${imgSpec.alt}"`;
            }
            ret += `<img ${srch}="${this.smallestImage}" width="${this.biggestWidth}" height="${this.biggestHeight}" class="${imgSpec.class}"${load}${alt}  />`;

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

    /**
     * Simple render.
     * 
     * @param   {string}            src         Source.
     * @param   {object}            imgSpec     Image spec passed in markdown.
     * 
     * @return  {string}
     */
    renderSimple(src, imgSpec)
    {
        debug(`==> In renderSimple for ${src}`);
        let imgGen = new HtmlGenerator('img');
        let imgGenNoScript = new HtmlGenerator('img');
        let figureGen = null;

        let link = null;
        let rss = false;
        let wantMeta = false;
        let metaSrcs = [];
        let meta = {};

        let srcName = 'src';

        // Extract the libk, if any.
        if (imgSpec.link) {
            debug(`Has link: ${imgSpec.link}`);
            link = imgSpec.link;
            delete imgSpec.link;
        }

        // If we have a caption, this will need a figure.
        if (imgSpec.caption) {
            debug(`Has caption (therfore figure): ${imgSpec.caption}`);
            figureGen = new HtmlFigure();
            figureGen.setCaption(imgSpec.caption);
            delete imgSpec.caption;

            // The class will go on the figure instead of the image.
            if (imgSpec.class) {
                debug(`Has class (needed on figure): ${imgSpec.class}`);
                figureGen.appendAttrib('class', imgSpec.class);
            }

            let cl = (this.opts.figureClass) ? this.opts.figureClass : 'respimg';
            figureGen.appendAttrib('class', cl);
            delete imgSpec.class;
            //debugf(`Figure object initialised with: %O`, figureGen);
        }

        // Are we rendering for RSS?
        if (imgSpec.rss && imgSpec.rss == true) {
            rss = true;
            debug(`Rendering image for RSS.`);
            delete imgSpec.rss;
        } else {
            debug(`NOT rendering image for RSS.`);
        }

        // Are we lazy-loading?
        if (this.opts.lazyload) {
            debugf(`We are lazy-loading ${src}`);
            if (imgSpec.class) {
                if (!imgSpec.class.includes('lazyload')) {
                    imgSpec.class += ' lazyload';
                }
            } else {
                imgSpec.class = 'lazyload';
            }
            srcName = 'data-src';
            imgGen.setAttribute('loading', 'lazy');
        }

        // Do we need to qualify the src?
        if (this.hostname) {
            imgSpec[srcName] = this.qualify(src);
            debugf(`We've qualified the src name as ${imgSpec[srcName]}`);
        } else {
            imgSpec[srcName] = src;
        }

        // Push the src into meta.
        metaSrcs.push(src);

        let hasFigure = false;
        if (null !== figureGen) {
            hasFigure = true;
            debugf(`Figure object just before value loop: %O`, figureGen);
        }

        // Now loop for the rest of the imgSpec and set attributes or do other stuff accordingly.
        for (let name in imgSpec) {

            if (!name.startsWith('__')) {

                // Meta elements all start with @.
                if (name.startsWith('@')) {
                    wantMeta = true;

                    // Specific meta?
                    if (name.length > 1) {
                        meta[name.substring(1)] = imgSpec[name];
                    }   

                // Anything else?
                } else {

                    // Simply save in the first instance.
                    imgGen.appendAttrib(name, imgSpec[name]);

                    // Special things to add if the name is the srcName.
                    if (name === srcName) {
                        imgGenNoScript.setAttrib('src', imgSpec[name]);

                    // Deal with the class.
                    } else if ('class' === name) {
                        let cl = imgSpec[name].replace('lazyload', '').trim();
                        if ('' !== cl) {
                            imgGenNoScript.appendAttrib('class', cl);
                        }

                    // Add what's left to the noscript.
                    } else {
                        imgGenNoScript.appendAttrib(name, imgSpec[name]);
                    }
                }
            }
        }      

        if (hasFigure) {
            if (null !== figureGen) {
                debugf(`Figure object just AFTER value loop: %O`, figureGen);
            } else {
                debug(`SOMETHING HAS GONE WRONG - WE SHOULD HAVE A FIGURE.`);
            }
        }

       let ret = imgGen.render();  

        // Link?
        if (link) {
            let lk = ('self' === link.trim()) ? imgSpec.src : link.trim();
            let linkGen = new HtmlGenerator('a', 
                {class: "imgLink", target: "_blank", title: "Open image in new tab.", href: lk},
                ret
            );
            ret = linkGen.render();
        }

        // Figure?
        if (figureGen) {
            debugf(`Figure object just before we render it: %O`, figureGen);
            ret = figureGen.render(ret);
        }

        // Do we need meta?
        if (wantMeta) {
            for (let item of metaSrcs) {
                this.metaIds.push(item);
                let singleMeta = new HtmlGenerator('link', {href: item, itemid: `#${item}`});
                this.metaIds.push(item);
                for (let name in meta) {
                    singleMeta.setAttrib(name, meta[name]);
                }
                this.schema += singleMeta.render();;
            }
        }

        if (!rss) {
            let nos = new HtmlGenerator('noscript', null, imgGenNoScript);
            return ret + nos.render() + this.schema;
        } else {
            return imgGenNoScript.render() + this.schema;
        }
    }

    /**
     * Render a source statement.
     * 
     * @param   {string[]}  files   Array of files.
     * @param   {string}    sizes   Sizes.
     * 
     * @return  {string}            <source> HTML.
     */
    renderSourceStmt(files, sizes = null)
    {
        let sourceGen = new HtmlGenerator('source');
        sourceGen.setAttrib('type', files[0].mime);

        let setSpec = [];

        // Loop for each file.
        for (let item of files) {

            // Retain the dimensions of the biggest image.
            if (item.width > this.biggestWidth) {
                this.biggestWidth = item.width;
                this.biggest = item.file;
            }
            if (item.height > this.biggestHeight) {
                this.biggestHeight = item.height;
            }

            // If we need to qualify the source, do it here.
            let sourceToUse = item.file;
            if (this.hostname) {
                sourceToUse = this.qualify(item.file);
            }

            // Add to the running array.
            setSpec.push(`${sourceToUse} ${item.width}w`);
        }

        // Set the srcset. If we're lazt loading this will be data-srcset, otherwise just srcset.
        // Deal with sizes whilst we're at it.
        if (this.opts.lazyload) {
            sourceGen.setAttrib('data-srcset', setSpec.join(' '));
            if (null === sizes) {
                sourceGen.setAttrib(`data-sizes`, 'auto');
            } else {
                sourceGen.setAttrib(`data-sizes`, sizes);
            }

            // If we're lazy-loading we just add the smallest image as the srcset.
            let src = files[0].file;
            if (this.hostname) {
                src = this.qualify(src);
            }
            sourceGen.setAttrib('srcset', src);
        } else {
            sourceGen.setAttrib('srcset', setSpec.join(' '));
            if (null !== sizes) {
                sourceGen.setAttrib(`sizes`, sizes);
            }
        }

        // Return the rendered <source>.
        return sourceGen.render();
    }

    /**
     * Complex render, using the image plugin.
     * 
     * @param   {string}            base        Base source file (relative path)
     * @param   {object}            obj         Details of generated files for this image.
     * @param   {object}            imgSpec     Image spec passed in markdown.
     * 
     * @return  {string}
     * 
     * The obj above is as follows:
     * 
     * relative-path-of-source: {
     *      format: {
     *          files: [
     *              {file, width, height, mime},
     *              {file, width, height, mime},
     *              ...
     *          ],
     *          thumbnail: {file, width, height, mime}
     *      }
     * }
     * 
     * files[] is sorted from smallest width to largest width.
     */
    renderComplex(base, obj, imgSpec)
    {
        debug(`==> In renderComplex for ${base}`);

        let imgGen = new HtmlGenerator('img');
        let imgGenNoScript = new HtmlGenerator('img');
        let figureGen = null;

        let link = null;
        let rss = false;
        let wantMeta = false;
        let metaSrcs = [];
        let meta = {};

        let srcName = 'src';

        // Extract the libk, if any.
        if (imgSpec.link) {
            debug(`Has link: ${imgSpec.link}`);
            link = imgSpec.link;
            delete imgSpec.link;
        }

        // If we have a caption, this will need a figure.
        if (imgSpec.caption) {
            debug(`Has caption (therfore figure): ${imgSpec.caption}`);
            figureGen = new HtmlFigure();
            figureGen.setCaption(imgSpec.caption);
            delete imgSpec.caption;

            // The class will go on the figure instead of the image.
            if (imgSpec.class) {
                debug(`Has class (needed on figure): ${imgSpec.class}`);
                figureGen.appendAttrib('class', imgSpec.class);
            }

            let cl = (this.opts.figureClass) ? this.opts.figureClass : 'respimg';
            figureGen.appendAttrib('class', cl);
            delete imgSpec.class;
            //debugf(`Figure object initialised with: %O`, figureGen);
        }

        // Are we rendering for RSS?
        if (imgSpec.rss && imgSpec.rss == true) {
            rss = true;
            debug(`Rendering image for RSS.`);
            delete imgSpec.rss;
        } else {
            debug(`NOT rendering image for RSS.`);
        }

        // Are we lazy-loading?
        if (this.opts.lazyload) {
            debugf(`We are lazy-loading ${base}`);
            if (imgSpec.class) {
                if (!imgSpec.class.includes('lazyload')) {
                    imgSpec.class += ' lazyload';
                }
            } else {
                imgSpec.class = 'lazyload';
            }
            srcName = 'data-src';
            imgGen.setAttribute('loading', 'lazy');
        }

        // Determine the source.
        for (let type in obj) {
            if (this.opts.baseTypes.includes(type)) {
                let last = bj[type].files.length - 1;
                if (this.opts.lazyload) {
                    imgSpec['src'] = obj[type].files[0].file;
                    imgSpec['data-src'] = obj[type].files[last].file;
                } else {
                    imgSpec['src'] = obj[type].files[last].file;
                }
                imgSpec['width'] = obj[type].files[last].width;
                imgSpec['height'] = obj[type].files[last].height;

                break;
            }
        }

        // Do we need to qualify the src?
        if (this.hostname) {
            imgSpec['src'] = this.qualify(imgSpec['src']);
            if (imgSpec['data-src']) {
                imgSpec['data-src'] = this.qualify(imgSpec['data-src']);
            }
        }

        // Push the src into meta.
        //metaSrcs.push(src);

        let hasFigure = false;
        if (null !== figureGen) {
            hasFigure = true;
            debugf(`Figure object just before value loop: %O`, figureGen);
        }

        // Now loop for the rest of the imgSpec and set attributes or do other stuff accordingly.
        for (let name in imgSpec) {

            if (!name.startsWith('__')) {

                // Meta elements all start with @.
                if (name.startsWith('@')) {
                    wantMeta = true;

                    // Specific meta?
                    if (name.length > 1) {
                        meta[name.substring(1)] = imgSpec[name];
                    }   

                // Anything else?
                } else {

                    // Simply save in the first instance.
                    imgGen.appendAttrib(name, imgSpec[name]);

                    // Special things to add if the name is the srcName.
                    if (name === 'src') {
                        imgGenNoScript.setAttrib('src', imgSpec[name]);

                    // Deal with the class.
                    } else if ('class' === name) {
                        let cl = imgSpec[name].replace('lazyload', '').trim();
                        if ('' !== cl) {
                            imgGenNoScript.appendAttrib('class', cl);
                        }

                    // Add what's left to the noscript.
                    } else {
                        imgGenNoScript.appendAttrib(name, imgSpec[name]);
                    }
                }
            }
        }      

        if (hasFigure) {
            if (null !== figureGen) {
                debugf(`Figure object just AFTER value loop: %O`, figureGen);
            } else {
                debug(`SOMETHING HAS GONE WRONG - WE SHOULD HAVE A FIGURE.`);
            }
        }

        let ret = imgGen.render();  

        // Link?
        if (link) {
            let lk = ('self' === link.trim()) ? imgSpec.src : link.trim();
            let linkGen = new HtmlGenerator('a', 
                {class: "imgLink", target: "_blank", title: "Open image in new tab.", href: lk},
                ret
            );
            ret = linkGen.render();
        }

        // Generate the <source> statements.
        let sources = [];
        for (let type of obj) {
            sources.push(this.renderSourceStmt(obj[type].files));
        }

        // Picture.
        let pictureGen = new HtmlGenerator('picture');
        ret = pictureGen.render(sources.join("\n") + "\n" + ret);

        // Figure?
        if (figureGen) {
            debugf(`Figure object just before we render it: %O`, figureGen);
            ret = figureGen.render(ret);
        }

        // Do we need meta?
        if (wantMeta) {
            for (let item of metaSrcs) {
                this.metaIds.push(item);
                let singleMeta = new HtmlGenerator('link', {href: item, itemid: `#${item}`});
                this.metaIds.push(item);
                for (let name in meta) {
                    singleMeta.setAttrib(name, meta[name]);
                }
                this.schema += singleMeta.render();;
            }
        }

        if (!rss) {
            let nos = new HtmlGenerator('noscript', null, imgGenNoScript);
            return ret + nos.render() + this.schema;
        } else {
            return imgGenNoScript.render() + this.schema;
        }
    }
}

module.exports = ImageHtml;