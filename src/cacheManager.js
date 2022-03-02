/**
 * Please refer to the following files in the root directory:
 * 
 * README.md        For information about the package.
 * LICENSE          For license details, copyrights and restrictions.
 */
'use strict';

const GAError = require("./utils/gaError");
const syslog = require("./logger/syslog");
const fsutils = require("./fs/fsutils");
const merge = require("./utils/merge");
const fs = require('fs');
const path = require('path');
const debug = require('debug')('Framework:CacheManager'),
      debugf = require('debug')('Full.Framework:CacheManager');


/**
 * Cache manager class.
 */
class CacheManager
{
    /**
     * Path to cache log.
     * @member {string}
     */
    #cacheLogPath = null;

    /**
     * Options.
     * @member  {object}
     */
    #options = {};

    /**
     * Cache log file.
     * @member {Map}
     */
    #cacheLog = null;

    /**
     * Default options.
     * @member {object}
     */
    #defaultOptions = {basePath: null};

    /**
     * Constructor.
     * 
     * @param   {string}    cacheLogPath        Path to the cache log. 
     * @param   {object}    options             Options.
     * 
     * @return  {CacheManager}
     */
    constructor(cacheLogPath, options = {}) 
    {
        this.#cacheLogPath = cacheLogPath;
        this.#options = merge.merge(this.#defaultOptions, options);

        this.loadMap();
    }

    /**
     * Load the map from the source file.
     * 
     * @return {CacheManager}
     */
    loadMap()
    {
        if (!fs.existsSync(this.#cacheLogPath)) {
            debug(`No map file found at ${this.#cacheLogPath}.`);
            this.#cacheLog = new Map();
        } else {
            debug(`Found map file at ${this.#cacheLogPath}.`);
            let serialised = fs.readFileSync(this.#cacheLogPath, 'utf8');
            this.#cacheLog = new Map(JSON.parse(serialised));
        }
        return this;
    }

    /**
     * Save the map.
     * 
     * @return {CacheManager}
     */
    saveMap()
    {
        let serialised = JSON.stringify(Array.from(this.#cacheLog.entries()));
        fsutils.mkdirRecurse(path.dirname(this.#cacheLogPath));
        fs.writeFileSync(this.#cacheLogPath, serialised, 'utf8');
        debug(`Wrote map file to disk.`);
        return this;
    }

    /**
     * See if we have a particular key.
     * 
     * @param   {string}    key     Key to test.
     * 
     * @return  {boolean}
     */
    has(key) 
    {
        return this.#cacheLog.has(key);
    }

    /**
     * Get a value for a key.
     * 
     * @param   {string}    key     Key to get value for.
     * 
     * @return  {mixed}
     */
    get(key)
    {
        if (this.has(key)) {
            return this.#cacheLog.get(key);
        }
        return false;
    }

    /**
     * Set a value for a key.
     *
     * @param   {string}  key  Key to set.
     * @param   {mixed}   val  Value to set.
     *
     * @return  {CacheManager}
     */
    _set(key, val)
    {
        this.#cacheLog.set(key, val);
        return this;
    }

    /**
     * Clear all keys.
     * 
     * @param   {boolean}   write   Write out too?
     * 
     * @return  {CacheManager}
     */
    clear(write = false)
    {
        this.#cacheLog.clear();
        if (write) {
            this.saveMap;
        }
        return this;
    }

    /**
     * Do a cache check.
     * 
     * @param   {string}    key     Key to check.
     * @param   {boolean}   save    Save immediately if changed.
     * @param   {boolean}   upd     Update if necessary?
     * 
     * @return  {boolean}           True means the file is new or was modified.
     */
    check(key, save = false, upd = true)
    {
        // If we have no key, this is a new entry.
        if (!this.has(key)) {

            debug(`Key does not yet exist for asset: ${key}`);

            let fn = key;
            if (this.#options.basePath) {
                fn = path.join(this.#options.basePath, key);
            }

            if (!fs.existsSync(fn)) {
                throw new GAError(`No physical file found for cache key, yet cache key exists. File is: ${fn}.`);
            }

            let stats = fs.statSync(fn);

            let cd = {
                modified: stats.mtimeMs,
                size: stats.size
            };
    
            this._set(key, cd);

            debug(`Created key for asset: ${key}`);

            if (save) {
                this.saveMap();
            }

            return true;

        // We do have a key ...
        } else {        
        
            debug(`Key already exists for asset: ${key}`);

            let fn = key;

            if (this.#options.basePath) {
                fn = path.join(this.#options.basePath, key);
            }

            let current = this.get(key);

            // We have a key and the file exists ...
            if (fs.existsSync(fn)) {
                let stats = fs.statSync(fn);

                // If the file has changed ...
                if (stats.mtimeMs > current.modified || stats.size != current.size) {

                    debug(`Asset has expired for key: ${key}`);

                    if (upd) {
                        let cd = {
                            modified: stats.mtimeMs,
                            size: stats.size
                        };
                        this._set(key, cd);
                        debug(`Updated cache details for asset: ${key}`);

                        if (save) {
                            this.saveMap();
                        }
                    }
                    return true;
                
                // If the file has not changed ...
                } else {
                    debug(`Asset has not changed for key: ${key}`);
                    return false;
                }
            
            // We have a key but the file does not exist.
            } else {
                this.#cacheLog.delete(key);
                debug(`File for asset no longer exists so will delete cache: ${key}`);
                if (save) {
                    this.saveMap();
                }
                return false;
            }

        }

    }

}

module.exports = CacheManager;
