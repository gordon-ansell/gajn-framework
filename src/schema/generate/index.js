#!/usr/bin/env node

/**
 * @file        Schema generator run.
 * @module      Schema/Generator
 * @author      Gordon Ansell   <contact@gordonansell.com> 
 * @copyright   Gordon Ansell, 2020.
 * @license     MIT
 */

const Generator = require("./generator");

let gen = new Generator();
gen.generate('Person');
