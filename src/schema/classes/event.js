/**
 * @file        Schema 'Event'.
 * @module      Schema/Event
 * @author      Gordon Ansell   <contact@gordonansell.com> 
 * @copyright   Gordon Ansell, 2020.
 * @license     MIT
 */

'use strict';

const Thing = require("./thing");

/**
 * Schema 'Event'.
 */
class Event extends Thing
{
    about(val) {return this.setProp('about', val);}
    actor(val) {return this.setProp('actor', val);}
    aggregateRating(val) {return this.setProp('aggregateRating', val);}
    attendee(val) {return this.setProp('attendee', val);}
    audience(val) {return this.setProp('audience', val);}
    composer(val) {return this.setProp('composer', val);}
    contributor(val) {return this.setProp('contributor', val);}
    director(val) {return this.setProp('director', val);}
    doortime(val) {return this.setProp('doortime', val);}
    duration(val) {return this.setProp('duration', val);}
    endDate(val) {return this.setProp('endDate', val);}
    eventAttendanceMode(val) {return this.setProp('eventAttendanceMode', val);}
    eventSchedule(val) {return this.setProp('eventSschedule', val);}
    eventStatus(val) {return this.setProp('eventStatus', val);}
    funder(val) {return this.setProp('funder', val);}
    inLanguage(val) {return this.setProp('inLanguage', val);}
    isAccessibleForFree(val) {return this.setProp('isAccessibleForFree', val);}
    location(val) {return this.setProp('location', val);}
    maximumAttendeeCapacity(val) {return this.setProp('maximumAttendeeCapacity', val);}
    maximumPhysicalAttendeeCapacity(val) {return this.setProp('maximumPhysicalAttendeeCapacity', val);}
    maximumVirtualAttendeeCapacity(val) {return this.setProp('maximumVirtualAttendeeCapacity', val);}
    offers(val) {return this.setProp('offers', val);}
    organizer(val) {return this.setProp('organizer', val);}
    performer(val) {return this.setProp('performer', val);}
    previousStartDate(val) {return this.setProp('previousStartDate', val);}
    recordedIn(val) {return this.setProp('recordedIn', val);}
    remainingAttendeeCapacity(val) {return this.setProp('remainingAttendeeCapacity', val);}
    review(val) {return this.setProp('review', val);}
    sponsor(val) {return this.setProp('sponsor', val);}
    startDate(val) {return this.setProp('startDate', val);}
    subEvent(val) {return this.setProp('subEvent', val);}
    superEvent(val) {return this.setProp('superEvent', val);}
    translator(val) {return this.setProp('translator', val);}
    typicalAgeRange(val) {return this.setProp('typicalAgeRange', val);}
    workFeatured(val) {return this.setProp('workFeatured', val);}
    workPerformed(val) {return this.setProp('workPerformed', val);}
}

module.exports = Event