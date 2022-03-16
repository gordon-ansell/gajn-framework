/**
 * @file        Schema 'CreativeWork'.
 * @module      Schema/CreativeWork
 * @author      Gordon Ansell   <contact@gordonansell.com> 
 * @copyright   Gordon Ansell, 2020.
 * @license     MIT
 */

'use strict';

const Thing = require("./thing");

/**
 * Schema 'CreativeWork'.
 */
class CreativeWork extends Thing
{
    about(val) {return this.setProp('about', val);}
    abstract(val) {return this.setProp('abstract', val);}
    accessMode(val) {return this.setProp('accessMode', val);}
    accessModeSufficient(val) {return this.setProp('accessModeSufficient', val);}
    accessibilityAPI(val) {return this.setProp('accessibilityAPI', val);}
    accessibilityControl(val) {return this.setProp('accessibilityControl', val);}
    accessibilityFeature(val) {return this.setProp('accessibilityFeature', val);}
    accessibilityHazard(val) {return this.setProp('accessibilityHazard', val);}
    accessibilitySummary(val) {return this.setProp('accessibilitySummary', val);}
    accountablePerson(val) {return this.setProp('accountablePerson', val);}
    acquireLicensePage(val) {return this.setProp('acquireLicensePage', val);}
    aggregateRating(val) {return this.setProp('aggregateRating', val);}
    alternativeHeadline(val) {return this.setProp('alternativeHeadline', val);}
    assesses(val) {return this.setProp('assesses', val);}
    associatedMedia(val) {return this.setProp('associatedMedia', val);}
    audience(val) {return this.setProp('audience', val);}
    audio(val) {return this.setProp('audio', val);}
    author(val) {return this.setProp('author', val);}
    award(val) {return this.setProp('award', val);}

    character(val) {return this.setProp('character', val);}
    citation(val) {return this.setProp('citation', val);}
    comment(val) {return this.setProp('comment', val);}
    commentCount(val) {return this.setProp('commentCount', val);}
    conditionsOfAccess(val) {return this.setProp('conditionsOfAccess', val);}
    contentLocation(val) {return this.setProp('contentLocation', val);}
    contentRating(val) {return this.setProp('contentRating', val);}
    contentReferenceTime(val) {return this.setProp('contentReferenceTime', val);}
    contributor(val) {return this.setProp('contributor', val);}
    copyrightHolder(val) {return this.setProp('copyrightHolder', val);}
    copyrightYear(val) {return this.setProp('copyrightYear', val);}
    correction(val) {return this.setProp('correction', val);}
    creativeWorkStatus(val) {return this.setProp('creativeWorkStatus', val);}
    creator(val) {return this.setProp('creator', val);}

    dateCreated(val) {return this.setProp('dateCreated', val);}
    dateModified(val) {return this.setProp('dateModified', val);}
    datePublished(val) {return this.setProp('datePublished', val);}
    discussionUrl(val) {return this.setProp('discussionUrl', val);}

    editEIDR(val) {return this.setProp('editEIDR', val);}
    editor(val) {return this.setProp('editor', val);}
    educationalAlignment(val) {return this.setProp('educationalAlignment', val);}
    educationalLevel(val) {return this.setProp('educationalLevel', val);}
    educationalUse(val) {return this.setProp('educationalUse', val);}
    encoding(val) {return this.setProp('encoding', val);}
    encodingFormat(val) {return this.setProp('encodingFormat', val);}
    exampleOfWork(val) {return this.setProp('exampleOfWork', val);}
    expires(val) {return this.setProp('expires', val);}

    funder(val) {return this.setProp('funder', val);}

    genre(val) {return this.setProp('genre', val);}

    hasPart(val) {return this.setProp('hasPart', val);}
    headline(val) {return this.setProp('headline', val);}

    inLanguage(val) {return this.setProp('inLanguage', val);}
    interactionStatistic(val) {return this.setProp('interactionStatistic', val);}
    interactivityType(val) {return this.setProp('interactivityType', val);}
    isAccessibleForFree(val) {return this.setProp('isAccessibleForFree', val);}
    isBasedOn(val) {return this.setProp('isBasedOn', val);}
    isFamilyFriendly(val) {return this.setProp('isFamilyFriendly', val);}
    isPartOf(val) {return this.setProp('isPartOf', val);}

    keywords(val) {return this.setProp('keywords', val);}

    learningResourceType(val) {return this.setProp('learningResourceType', val);}
    license(val) {return this.setProp('license', val);}
    locationCreated(val) {return this.setProp('locationCreated', val);}

    mainEntity(val) {return this.setProp('mainEntity', val);}
    maintainer(val) {return this.setProp('maintainer', val);}
    material(val) {return this.setProp('material', val);}
    materialExtent(val) {return this.setProp('materialExtent', val);}
    mentions(val) {return this.setProp('mentions', val);}

    offers(val) {return this.setProp('offers', val);}

    pattern(val) {return this.setProp('pattern', val);}
    position(val) {return this.setProp('position', val);}
    producer(val) {return this.setProp('producer', val);}
    provider(val) {return this.setProp('provider', val);}
    publisher(val) {return this.setProp('publisher', val);}
    publisherImprint(val) {return this.setProp('publisherImprint', val);}
    publishingPrinciples(val) {return this.setProp('publishingPrinciples', val);}

    recordedAt(val) {return this.setProp('recordedAt', val);}
    releasedEvent(val) {return this.setProp('releasedEvent', val);}
    review(val) {return this.setProp('review', val);}

    schemaVersion(val) {return this.setProp('schemaVersion', val);}
    sdDatePublished(val) {return this.setProp('sdDatePublished', val);}
    sdLicense(val) {return this.setProp('sdLicense', val);}
    sdPublisher(val) {return this.setProp('sdPublisher', val);}
    size(val) {return this.setProp('size', val);}
    sourceOrganization(val) {return this.setProp('sourceOrganization', val);}
    spatial(val) {return this.setProp('spatial', val);}
    spatialCoverage(val) {return this.setProp('spatialCoverage', val);}
    sponsor(val) {return this.setProp('sponsor', val);}

    teaches(val) {return this.setProp('teaches', val);}
    temporal(val) {return this.setProp('temporal', val);}
    temporalCoverage(val) {return this.setProp('temporalCoverage', val);}
    text(val) {return this.setProp('text', val);}
    thumbnailUrl(val) {return this.setProp('thumbnailUrl', val);}
    timeRequired(val) {return this.setProp('timeRequired', val);}
    translationOfWork(val) {return this.setProp('translationOfWork', val);}
    translator(val) {return this.setProp('translator', val);}

    usageInfo(val) {return this.setProp('usageInfo', val);}

    version(val) {return this.setProp('version', val);}
    video(val) {return this.setProp('video', val);}

    workExample(val) {return this.setProp('workExample', val);}
    workTranslation(val) {return this.setProp('workTranslation', val);}
}

module.exports = CreativeWork