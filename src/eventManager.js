/**
 * Please refer to the following files in the root directory:
 * 
 * README.md        For information about the package.
 * LICENSE          For license details, copyrights and restrictions.
 */
'use strict';

const GAError = require("./utils/gaError");
const syslog = require("./logger/syslog");

/**
 * Event manager class.
 */
class EventManager
{
    // Private events.
    #events = {};

    // Valid events.
    #validEvents = [];

    /**
     * Constructor.
     * 
     * @param   {string[]}  ev          Array of valid event names. 
     * 
     * @return  {EventManager}
     */
    constructor (ev) 
    {
        if (ev) {
            this.setValidEvents(ev);
        }
    }

    /**
     * Set the valid events.
     * 
     * @param   {string[]}  ev          Array of valid event names. 
     * 
     * @return  {EventManager}
     */
    setValidEvents(ev)
    {
        this.#validEvents = ev;
        return this;
    }

    /**
     * Get the valid events.
     * 
     * @return  {string[]}
     */
    get validEvents()
    {
        return this.#validEvents;
    }

    /**
     * Add a plugin to an event.
     * 
     * @param   {string}    event       Event.
     * @param   {function}  func        Function to call.
     * @param   {number}    pri         Priority.
     */
    on(event, func, pri)
    {
        if (!this.#validEvents.includes(event)) {
            throw new GAError(`'${event}' is an invalid event name.`);
        }
        if (typeof func != "function") {
            throw new GAError("Event 'on' must be passed a function (${event}).");
        }
        if (!pri) {
            pri = 50;
        }
        if (!this.#events[event]) {
            this.#events[event] = [];
        }
        this.#events[event].push({func: func, pri: pri});
    }

    /**
     * Emit an event.
     * 
     * @param   {string}    event       Event.
     * @param   {any}       args        Arguments. 
     */
    async emit(event, ...args)
    {
        syslog.trace(`Called emit for event '${event}'.`, 'EventManager');

        if (!this.#validEvents.includes(event)) {
            throw new GAError(`'${event}' is an invalid event name.`);
        }
        if (!this.#events[event]) {
            syslog.trace(`There are no user tied to event '${event}'.`, 'EventManager');
            return;
        }

        syslog.trace(`Emitting event '${event}'.`, 'EventManager');

        let sorted = this.#events[event].sort((a, b) => {
            if (a.pri < b.pri) {
                return -1;
            }
            if (b.pri < a.pri) {
                return 1;
            }
            return 0;    
        });

        let pri = {};

        for (let cb of sorted) {
            if (!pri[cb.pri]) {
                pri[cb.pri] = [];
            }
            pri[cb.pri].push(cb.func);
        }

        for (let key in pri) {
            let funcs = pri[key];
            await Promise.all(funcs.map(async f => {
                try {
                    await f.call(this, ...args);
                } catch (err) {
                    throw new GAError(`Event function call failed for ${event}.`, '', err);
                }
            }));
        }

        syslog.trace(`Emitted event '${event}'.`, 'EventManager');
    }

}

module.exports = EventManager;
