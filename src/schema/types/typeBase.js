/**
 * @file        Schema base type.
 * @module      TypeBase
 * @author      Gordon Ansell   <contact@gordonansell.com> 
 * @copyright   Gordon Ansell, 2020.
 * @license     MIT
 */

'use strict';

const path = require('path');
const url = require('url');
const YamlFile = require("../../yamlFile");
const GAError = require("../utils/gaError");
const syslog = require("../logger/syslog");

class SchemaError extends GAError {};

/**
 * Base type class.
 */
class TypeBase
{
    /**
     * Context.
     * @type    {string}
     */
    static context = "https://schema.org";

    /**
     * Value.
     * @type    {string}
     */
    _val = {};    

    /**
     * Allowed values.
     * @type    {string[]}
     */
    _allowed = [];

    /**
     * Prefix.
     * @param   {string}
     */
    _prefix = '';     

    /**
     * Suffix.
     * @param   {string}
     */
    _suffix = '';     

    /**
     * Input text.
     * @param   {string}
     */
    _txt = '';     

    /**
     * Input type.
     * @param   {string}
     */
    _type = '';     

    /**
     * Schema type specifications.
     * @type    {object}
     * @static
     */
    static allSpecs = null;

    /**
     * Constructor.
     * 
     * @param   {string}    type    Type.
     * @param   {string}    txt     The text of the type.
     */
    constructor(type, txt)
    {
        this._txt = txt;
        this._type = type;

        let specs = TypeBase.getSpecsForType(type);

        this._allowed = specs.allowed;

        if (specs.prefix) {
            this._prefix = specs.prefix;
        } else {
            this._prefix = '';
        }

        if (specs.suffix) {
            this._suffix = specs.suffix;
        } else {
            this._suffix = '';
        }

        this._check();
    }

    /**
     * Check.
     */
    _check()
    {
        let txt = this._txt;
        let working;

        let ct = TypeBase.context;
        let ct1;
        if (ct.startsWith('https://')) {
            ct1 = ct.replace('https://', 'http://');
        } else {
            ct1 = ct.replace('http://', 'https://');
        }

        if (txt.startsWith(ct)) {
            working = txt.replace(ct, '');
        } else if (txt.startsWith(ct1)) {
            working = txt.replace(ct1, '');
        } else {
            working = txt;
        }

        if (working.charAt(0) == path.sep) {
            working = working.slice(1);
        }

        if (this._prefix && this._prefix != '') {
            if (working.startsWith(this._prefix)) {
                working = working.slice(this._prefix.length);
            }
        }

        if (this._suffix && this._suffix != '') {
            if (!working.endsWith(this._suffix)) {
                working = working.slice(-(this._suffix.length));;
            }
        }

        if (!this._allowed.includes(working)) {
            syslog.inspect(this._allowed);
            throw new SchemaError(`'${txt}' (extracted: '${working}') is an invalid value for type ${this._type}.`)
        }

        this._val = url.resolve(TypeBase.context, this._prefix + working + this._suffix);
    }

    /**
     * Resolve.
     * 
     * @return  {string}        Resolved type.
     */
    resolve()
    {
        return this._val;
    }

    /**
     * Get the specifications.
     * 
     * @return  {object}            Schema specifications.
     */
    static getSpecs()
    {
        if (TypeBase.allSpecs == null) {
            let fn = path.join(path.dirname(path.dirname(path.dirname(__filename))), 'data', 'types.yaml');
            let yamlFile = new YamlFile(fn);
            TypeBase.allSpecs = yamlFile.parse();

        }
        return TypeBase.allSpecs;
    }

    /**
     * Get the specs for a type.
     * 
     * @param   {string}    type    Type to get specs for.
     * @return  {object}            Specs.
     * 
     * @throws  {GreenHatSchemaError}   If they're not found.
     */
    static getSpecsForType(type)
    {
        let typeSpecs = this.getSpecs().types;
        if (!type in typeSpecs) {
            throw new SchemaError(`No schema type definition specs found for '${type}'.`)
        }

        return typeSpecs[type];
    }
}

module.exports = TypeBase;
