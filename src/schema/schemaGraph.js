/**
 * @file        Schema collection.
 * @module      SchemaCollection
 * @author      Gordon Ansell   <contact@gordonansell.com> 
 * @copyright   Gordon Ansell, 2020.
 * @license     MIT
 */

'use strict';

const GAError = require("../utils/gaError");
const syslog = require("../logger/syslog");

class SchemaError extends GAError {};


class SchemaGraph
{
    /**
     * Live data.
     * @member {object}
     */
    items = {}

    /**
     * Context.
     * @member {string}
     */
    context = "https://schema.org";

    /**
     * Constructor.
     *
     * @param   {string}    context            Context.
     */
    constructor(context = "https://schema.org")
    {
        this.context = context;
    }

    /**
     * Add an item.
     * 
     * @param   {string}    name                Name of item to add.
     * @param   {object}    item                Schema item to add.
     * @param   {boolean}   allowOverwrite      Allow overwrite?
     * @return  {SchemaGraph}                   The schema we just added.
     */
    add(name, item, allowOverwrite = false)
    {
        if ((name in this.items) && !allowOverwrite) {
            syslog.inspect(item, "error");
            throw new SchemaError(`Schema graph already has an item called '${name}'`)
        }
        this.items[name] = item;
        return this;
    }

    /**
     * Set an item.
     * 
     * @param   {string}    name                Name of item to set.
     * @param   {object}    item                Schema item to set.
     * @return  {SchemaGraph}                   The schema we just set.
     */
    set(name, item)
    {
        this.items[name] = item;
        return this;
    }

    /**
     * Get an item.
     * 
     * @param   {object}    item                Schema item to get.
     * @return  {object}                        The schema we just added.
     */
    get(name)
    {
        if (!(name in this.items)) {
            syslog.inspect(this.items, "warning");
            throw new SchemaError(`Schema graph does not have an item called '${name}'`)
        }
        return this.items[name];
    }

    /**
     * Has an item?
     * 
     * @param   {object}    item                Schema item to check.
     * @return  {boolean}
     */
    has(name)
    {
        return (name in this.items);
    }

    /**
     * Resolve the graph.
     * 
     * @param   {boolean}   stringify   Stringify it?
     * @param   {string}    spacer      Spacer.
     * @return  {object}                Full schema.
     */
    resolve(stringify = true, spacer = null)
    {
        let ret = {
            '@context': this.context,
            '@graph': []
        }

        for (let key in this.items) {
            ret['@graph'].push(this.items[key].resolveProps());
        }

        if (stringify) {
            return JSON.stringify(ret, null, spacer);
        } else {
            return ret;
        }
    }
}

module.exports = SchemaGraph;
