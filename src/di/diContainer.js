/**
 * Please refer to the following files in the root directory:
 * 
 * README.md        For information about the package.
 * LICENSE          For license details, copyrights and restrictions.
 */
'use strict';

const { DependencyInjectionIDAlreadyExists,
        DependencyInjectionClassAlreadyExists } = require('./diExceptions');

const syslog = require('../logger/syslog');

/**
 * Dependency injection container (service manager).
 */
class DIContainer
{
    /**
     * Class map.
     * @type {Map} 
     */
    #classMap = new Map();

    /**
     * Reverse class map.
     * @type {Map} 
     */
    #reverseClassMap = new Map();

    /**
     * Callable map.
     * @type {Map} 
     */
    #callableMap = new Map();

    /**
     * Value map.
     * @type {Map} 
     */
    #valueMap = new Map();

    /**
     * Instances.
     * @type {Map} 
     */
    #instances = new Map();

    /**
     * See if something with the passed ID is registered.
     * 
     * @param   {string}      id      ID to check.
     * 
     * @return  {bool}
     */
    has(id)
    {
        if (this.#classMap.has(id)) {
            return true;
        }
        return false;
    }

    /**
     * Register something specifying a type.
     * 
     * @param   {string}        type        Type to register: class
     * @param   {string}        id          ID to register it as.
     * @param   {mixed}         thing       Thing to register.
     * @param   {bool}          singleton   Is this a singelton?
     * @param   {array}         args        Arguments.
     * 
     * @return  {DIContainer}                    
     */
    registerByType(type, id, thing, singleton = false, args = [])
    {
        if (this.has(id)) {
            throw new DependencyInjectionIDAlreadyExists(`DI entry with ID '${id}' already exists.`);
        }

        if ('class' === type) {
            if (this.#reverseClassMap.has(thing)) {
                throw new DependencyInjectionClassAlreadyExists(`Class '${thing}' is already defined in the DI container, 
                    with ID '${this.#reverseClassMap.get(thing)}'.`);
            }         
            this.#classMap.set(id, {class: thing, singleton: singleton, args: args});
            this.#reverseClassMap.set(thing, id);   
            syslog.trace(`DI registered class '${thing}' with ID '${id}'.`, 'DIContainer');
        } else if ('callable' === type) {
            this.#callableMap.set(id, {callable: thing, args: args});
            syslog.trace(`DI registered callable '${thing}' with ID '${id}'.`, 'DIContainer');
        }
    }
}

module.exports = DIContainer;