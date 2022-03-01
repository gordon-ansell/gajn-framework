/**
 * Please refer to the following files in the root directory:
 * 
 * README.md        For information about the package.
 * LICENSE          For license details, copyrights and restrictions.
 */
'use strict';

const GAError = require('../utils/gaError');
const { URL } = require('url');
const path = require('path');
const HtmlGenerator = require('./htmlGenerator');
const HtmlFigure = require('./htmlFigure');
const debug = require('debug')('Framework:html:ComplexImage'),
      debugf = require('debug')('Full.Framework:html:ComplexImage');


/**
 * Complex image renderer.
 * 
 * This will include <img> statements, but may also include <picture>, <figure>
 * and <source> statements with their <noscript< equivalents. Finally, it saves
 * metadata to be used with structured data <link> definitions.
 */
class ComplexImage
{
    /**
     * Configs.
     * @member {object}
     */
    config = null;

    /**
     * Hostname.
     * @member {string}
     */
    hostname = null;

    /**
     * Site path.
     * @member {string}
     */
    sitePath = null;

    /**
     * Are we lazy-loading?
     * @member {boolean}
     */
    lazyload = false;

    /**
     * Figure class.
     * @member {string}
     */
    figureClass = null;

    /**
     * The structures we may use.
     */
    imgGen = null;
    imgGenNoScript = null;
    pictureGen = null;
    figureGen = null;
    aGen = null;

    /**
     * List of files used.
     * @member {string[]}
     */
    files = [];

    /**
     * Schema.
     * @member {string}
     */
    schema = '';

    /**
     * Meta IDs.
     * @member  {array}
     */
    metaIds = [];

    /**
     * RSS call?
     * @member {boolean}
     */
    rss = false;

    /**
     * Constructor.
     * 
     * @param   {boolean}   lazyload    Are we lazy loading?
     * @param   {string}    figureClass Special for figures.
     * @param   {string}    sitePath    Site path.
     * @param   {string}    hostname    Hostname.
     * @param   {object}    config      Image configs.
     * 
     * @return  {ComplexImage}
     */
    constructor (lazyload, figureClass = null, sitePath = null, hostname = null, config = null)
    {
        this.lazyload = lazyload;
        this.figureClass = figureClass;
        this.hostname = hostname;
        this.sitePath = sitePath;
        this.config = config;

        if (!this.figureClass) {
            this.figureClass = 'respimg';
        }
    }

    /**
     * Qualify an image.
     * 
     * @param   {string}    raw         Raw relative path to qualify.
     * 
     * @return  {string} 
     */
    qualify(raw)
    {
        if (raw.startsWith('http://') || raw.startsWith('https')) {
            return raw;
        }

        if (this.sitePath) {
            raw = raw.replace(this.sitePath, '');
        }

        if (!this.hostname) {
            return raw;
        }

        return new URL(raw, this.hostname).href;
    }

    /**
     * Render the image.
     * 
     * @param   {string|object} src         Source: may be a simple URL or an object.
     * @param   {object}        attribs     Passed image attributes.
     * @param   {string|null}   base        The base image (if src is an object).
     */
    render(src, attribs = {}, base = null)
    {
        // Some debugging.
        if (null === this.config) {
            debug(`Processing ComplexImage for ${src} (simple)`);
        } else {
            debug(`Processing ComplexImage for ${base} (complex)`);
        }

        // Generate an class for the image HTML.
        this.imgGen = new HtmlGenerator('img');

        // =====================================================================================
        // Deal with the class, lazy-loading and potentially the <figure> construct.
        // =====================================================================================

        // See if we're lazy-loading. If so we'll need a <noscript> for ths image.
        if (this.lazyload) {
            this.imgGenNoScript = new HtmlGenerator('img');

            // If we're lazy-loading we'll need the class (if any) on the <noscript>
            // regardless of anything else.
            if (attribs.class) {
                this.imgGenNoScript.appendAttrib('class', attribs.class);
            }

            // We also need to tell the image to lazyload.
            this.imgGen.appendAttrib('class', 'lazyload');
            this.imgGen.appendAttrib('loading', 'lazy');
        }

        // See if we'll need a figure.
        if (attribs.caption) {
            this.figureGen = new HtmlFigure();
            this.figureGen.setCaption(attribs.caption);

            // Do we need a specific figure class?
            if (this.figureClass) {
                this.figureGen.appendAttrib('class', this.figureClass);
            }

            // The class attributes go on the figure instead of the img.
            this.figureGen.appendAttrib('class', attribs.class);

        } else {
            // There's no figure so all the classes go on the img.
            this.imgGen.appendAttrib('class', attribs.class);
        }

        // We've sorted out all the class stuff at this point, so we can get rid of the class from attribs.
        if (attribs.class) {
            delete attribs.class;
        }

        // =====================================================================================
        // Make a note if this is an RSS call.
        // =====================================================================================

        if (attribs.rss) {
            this.rss = true;
            delete attribs.rss;
        }

        // =====================================================================================
        // Is there a link on this image?
        // =====================================================================================
        
        if (attribs.link) {
            this.aGen = new HtmlGenerator('a');
            delete attribs.link;
        }

        // =====================================================================================
        // Save the sizes if we have it specified.
        // =====================================================================================
        
        let sizes = 'auto';
        if (attribs.sizes) {
            sizes = attribs.sizes;
            delete attribs.sizes;
        }

        // =====================================================================================
        // Loop for the rest of the attribs, saving meta along the way.
        // =====================================================================================

        // We'll store the meta sources here.
        let wantMeta = false;
        let metaSrcs = [];
        let meta = {};

        // Loop for remaining attribs.
        for (let name in attribs) {

            if (name.startsWith('__')) {
                continue;
            }

            if ('@' === name[0]) {
                wantMeta = true;
                if (name.length > 1) {
                    meta[name.substring(1)] = attribs[name];
                }
            } else {
                this.imgGen.setAttrib(name, attribs[name]);
                if (this.lazyload) {
                    this.imgGenNoScript.setAttrib(name, attribs[name]);
                }
            }
        }

        // =====================================================================================
        // Finalise the structures.
        // =====================================================================================

        // Return variable.
        let ret = '';

        // If this is simple.
        if (null === base) {
            // Load in the src.
            let qsrc = this.qualify(src);
            this.imgGen.setAttrib('src', qsrc);
            if (this.lazyload) {
                this.imgGenNoScript.setAttrib('src', qsrc);
            }

            // Save the src for later reference.
            this.files.push(qsrc);

            // Render the image.
            ret = this.imgGen.render();

            // Add the <noscript> if we're lazy loading.
            if (this.lazyload) {
                ret += '<noscript>' + this.imgGenNoScript.render() + '</noscript>';
            }
        }

        // Add the link if necessary.
        if (null !== this.aGen) {
            if ('self' === link) {
                this.aGen.setAttrib('href', this.qualify(src));
            } else {
                this.aGen.setAttrib('href', this.qualify(link));
            }
            ret = this.aGen.render(ret);
        }

        // Add the figure if necessary.
        if (null !== this.figureGen) {
            ret = this.figureGen.render(ret);
        }

        // Return.
        return ret;
    }
}

module.exports = ComplexImage