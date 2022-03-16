/**
 * @file        Schema generator.
 * @module      Schema/Generator
 * @author      Gordon Ansell   <contact@gordonansell.com> 
 * @copyright   Gordon Ansell, 2020.
 * @license     MIT
 */

'use strict';

const { syslog } = require("js-framework");
const fetch = require('node-fetch');

/**
 * Generator class,
 */
class Generator
{
    /**
     * Constructor.
     * 
     * @param   {string}    source      Source file.
     */
    constructor(source)
    {
        if (source) {
            this.source = source;
        } else {
            this.source = "https://raw.githubusercontent.com/schemaorg/schemaorg/main/data/releases/9.0/schemaorg-all-https.jsonld"
        }
    }

    /**
     * Read the main data.
     */
    async readMain()
    {
        let settings = { method: "Get" };

        let data;

        await fetch(this.source, settings)
            .then(res => res.json())
            .then((json) => {
                data = json;
            }
        );

        let graph = data['@graph'];

        let parsed = {};

        for (let item of graph) {
            let id = item['@id'].replace("https://schema.org/", '');

            let st = {};

            for (let key in item) {
                if (key == '@type') {
                    st.type = item[key];
                } else if (key == 'rdfs:subClassOf') {
                    let inher = [];

                    if (!Array.isArray(item[key])) item[key] = [item[key]];

                    for (let sco in item[key]) {
                        inher.push(item[key][sco]['@id'].replace("https://schema.org/", ""));
                    }
                    st.inherits = inher;
                }
            }

            parsed[id] = st;
        }

        this.mainData = parsed;
    }

    /**
     * Read a class.
     * 
     * @param   {string}    cls     Class to read.
     */
    async readCls(cls)
    {
        let settings = { method: "Get" };
        let url = "https://raw.githubusercontent.com/charlestati/schema-org-json-schemas/master/schemas/";
        url += cls + ".schema.json";

        let data;

        await fetch(url, settings)
            .catch(err => console.log(err))
            .then(res => res.json())
            .then((json) => {
                data = json;
            }
        );

        let ret = [];

        if (data.properties) {
            for (let key in data.properties) {

                let thisOne = [];                
                let p = data.properties[key];

                if (p['$ref'])  {
                    thisOne.push(p['$ref'].replace('http://schema.org/', ''))
                }

                ret[key] = thisOne;

            }
        }

        return ret;
    }

    /**
     * Create the templates.
     * 
     * @param   {object}    obj         Object to create for.
     */
    tpl(obj)
    {
        syslog.inspect(obj);
        let lines = [];
        let lines2 = [];
        if (obj.props) {
            for (let key in obj.props) {
                let l = key + "(val) {return this.setProp('" + key + "', val);}"
                lines.push(l);

                l = key + ': ' + obj.props[key];
                lines2.push(l);
            }
        }

        console.log ("============================================");
        for (let l of lines) {
            console.log(l);
        }
        console.log ("============================================");
        for (let l of lines2) {
            console.log(l);
        }
        console.log ("============================================");
    }

    /**
     * Generate.
     * 
     * @param   {string}    cls         Class to generate.
     */
    async generate(cls)
    {
        await this.readMain();

        let indata = await this.readCls(cls);

        this.mainData[cls].props = indata;

        this.tpl(this.mainData[cls]);

        //syslog.inspect(this.mainData[cls]);
    }
}

module.exports = Generator
