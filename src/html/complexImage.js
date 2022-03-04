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
const syslog = require('../logger/syslog');
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
        if ('string' !== typeof(raw)) {
            syslog.inspect(raw, "error", "Passed in to qualify.");
            throw new GAError(`ComplexImage:qualify needs a string, you passed a ${typeof(raw)} with value '${raw}'.`);
        }

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
     * Render a source statement.
     * 
     * @param   {string[]}  files       Array of files.
     * @param   {string}    sizes       Sizes.
     * 
     * @return  {string}                <source> HTML.
     */
    renderSourceStmt(files, sizes = null)
    {
        let metaSrcs = [];
        let savedSizes = [];
        let setSpec = [];

        // Standard.
        let sourceGen = new HtmlGenerator('source');
        sourceGen.setAttrib('type', files[0].mime);

        // <noscript>.
        let sourceGenNoScript = new HtmlGenerator('source');
        sourceGenNoScript.setAttrib('type', files[0].mime);


        // Loop for each file.
        for (let item of files.filter(f => f.width !== this.config.placeholderWidth)) {

            // Skip the placeholder.
            /*
            if (item.width === this.config.placeholderWidth) {
                continue;
            }
            */

            // If we need to qualify the source, do it here.
            let qsrc = this.qualify(item.file);

            // Save for meta.
            metaSrcs.push(qsrc);

            // ... and files.
            this.files.push(qsrc);

            // Add to the running array.
            setSpec.push(`${qsrc} ${item.width}w`);

            // Save the size as we might need it for <noscript>.
            savedSizes.push(`${item.width}px`);
        }

        // Set the srcset. If we're lazt loading this will be data-srcset, otherwise just srcset.
        // Deal with sizes whilst we're at it.
        if (this.lazyload) {
            sourceGen.setAttrib('data-srcset', setSpec.join(', '));
            sourceGenNoScript.setAttrib('srcset', setSpec.join(', '));

            if (null === sizes) {
                sourceGen.setAttrib(`data-sizes`, 'auto');
                sourceGenNoScript.setAttrib(`sizes`, savedSizes.join(', '));
            } else {
                sourceGen.setAttrib(`data-sizes`, sizes);
                sourceGenNoScript.setAttrib(`sizes`, sizes);
            }

            // If we're lazy-loading we just add the smallest image as the srcset.
            let src = this.qualify(files[0].file);
            sourceGen.setAttrib('srcset', src);
        } else {
            sourceGen.setAttrib('srcset', setSpec.join(', '));
            if (null !== sizes) {
                sourceGen.setAttrib(`sizes`, sizes);
            }
        }

        // Save the meta sources.
        if (metaSrcs.length > 0) {
            for (let item of metaSrcs) {
                let linkGen = new HtmlGenerator('link', {href: item});
                this.metaIds.push(item);
                linkGen.addAttrib('itemprop', 'image');
                this.schema += linkGen.render();
            }
        }

        // Return the rendered <source> (and possible <noscript>).
        if (this.lazyload && !this.rss) {
            return sourceGen.render() + '<noscript>' + sourceGenNoScript.render() + '</noscript>';
        } else {
            return sourceGen.render();
        }
    }

    /**
     * Render the image.
     * 
     * @param   {string|object} src         Source: may be a simple URL or an object.
     * @param   {object}        attribs     Passed image attributes.
     * @param   {string|null}   base        The base image (if src is an object).
     * 
     * If 'src' is an object, it'll be like this:
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
            this.imgGen.appendAttrib('class', 'lazyload', false, 'lazyload');
            this.imgGen.appendAttrib('loading', 'lazy', false, 'lazy');
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
            if (attribs.class) {
                this.figureGen.appendAttrib('class', attribs.class);
            }

        } else if (attribs.class) {
            // There's no figure so all the classes go on the img.
            this.imgGen.appendAttrib('class', attribs.class, false, 'attribs.class');
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
        
        let link = null;
        if (attribs.link) {
            //this.aGen = new HtmlGenerator('a', {class: 'imglink', target: '_blank', title: 'Open image in new tab.'});
            link = attribs.link;
            delete attribs.link;
        }

        // =====================================================================================
        // Save the sizes if we have it specified.
        // =====================================================================================
        
        let sizes = null;
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

            /*
            if (!isNaN(name)) {
                continue;
            }
            */

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
        let savedBiggestLink = null;

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

            // Save the meta for later.
            metaSrcs.push(qsrc);

            // Render the image.
            ret = this.imgGen.render();

            // Add the <noscript> if we're lazy loading.
            if (this.lazyload && !this.rss) {
                ret += '<noscript>' + this.imgGenNoScript.render() + '</noscript>';
            }

        // If this complex.
        } else {

            // Generate the source statements.
            let sources = [];
            for (let type of Object.keys(src)) {
                sources.push(this.renderSourceStmt(src[type].files, sizes));
            }

            // Extract the first base type we find.
            let using = null;
            for (let name of Object.keys(src)) {
                if (this.config.baseTypes.includes(name)) {
                    using = name;
                    break;
                }
            }

            // Check we have something.
            if (null === using) {
                throw new GAError(`Could not extract a base type from the image set (in ComplexImage).`);
            } 

            // Use the base type to extract the image details.
            let last = src[using].files.length - 1;
            let imageSrc = src[using].files[0].file;
            let biggest = src[using].files[last];
            let biggestFile = this.qualify(biggest.file);
            savedBiggestLink = biggestFile;

            if (this.lazyload) {
                // Standard.
                this.imgGen.setAttrib('src', this.qualify(imageSrc));
                this.imgGen.setAttrib('data-src', biggestFile);
                this.imgGen.setAttrib('width', biggest.width);
                this.imgGen.setAttrib('height', biggest.height);

                // And the <noscript>.
                this.imgGenNoScript.setAttrib('src', biggestFile);
                this.imgGenNoScript.setAttrib('width', biggest.width);
                this.imgGenNoScript.setAttrib('height', biggest.height);

            // What, no lazy-loading?
            } else {
                this.imgGen.setAttrib('src', biggestFile);
                this.imgGen.setAttrib('width', biggest.width);
                this.imgGen.setAttrib('height', biggest.height);
            }

            // Render stuff.
            let pictureGen = new HtmlGenerator('picture');

            let tmpRet = sources.join('\n') + this.imgGen.render();

            if (this.lazyload && !this.rss) {
                tmpRet += '<noscript>' + this.imgGenNoScript.render() + '</noscript>';
            }

            ret = pictureGen.render(tmpRet);

            // Add the base to the meta and files.
            this.files.push(this.qualify(base));
        }

        // Add the link if necessary.
        if (null !== this.aGen) {
            if ('self' === link) {
                if (null === base) {
                    this.aGen.setAttrib('href', this.qualify(src));
                } else {
                    this.aGen.setAttrib('href', savedBiggestLink);
                }
            } else {
                this.aGen.setAttrib('href', this.qualify(link));
            }
            ret = this.aGen.render(ret);
        }

        // Add the figure if necessary.
        if (null !== this.figureGen) {
            ret = this.figureGen.render(ret);
        }

        // =====================================================================================
        // Deal with metadata for schema.
        // =====================================================================================

        if (wantMeta) {
            for (let item of metaSrcs) {
                let linkGen = new HtmlGenerator('link', {href: item});
                this.metaIds.push(item);
                for (let name in meta) {
                    linkGen.addAttrib(name, meta[name]);
                }
                this.schema += linkGen.render();
            }
        }

        // =====================================================================================
        // Return the HTML string.
        // =====================================================================================

        return ret + this.schema;
    }
}

module.exports = ComplexImage