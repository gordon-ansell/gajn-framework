/**
 * @file        Schema 'SoftwareApplication'.
 * @module      Schema/SoftwareApplication
 * @author      Gordon Ansell   <contact@gordonansell.com> 
 * @copyright   Gordon Ansell, 2020.
 * @license     MIT
 */

'use strict';

const CreativeWork = require("./creativeWork");

/**
 * Schema 'SoftwareApplication'.
 */
class SoftwareApplication extends CreativeWork
{
    applicationCategory(val) {return this.setProp('applicationCategory', val);}
    applicationSubCategory(val) {return this.setProp('applicationSubCategory', val);}
    applicationSuite(val) {return this.setProp('applicationSuite', val);}
    availableOnDevice(val) {return this.setProp('availableOnDevice', val);}
    countriesNotSupported(val) {return this.setProp('countriesNotSupported', val);}
    countriesSupported(val) {return this.setProp('countriesSupported', val);}
    downloadUrl(val) {return this.setProp('downloadUrl', val);}
    featureList(val) {return this.setProp('featureList', val);}
    fileSize(val) {return this.setProp('fileSize', val);}
    installUrl(val) {return this.setProp('installUrl', val);}
    memoryRequirements(val) {return this.setProp('memoryRequirements', val);}
    operatingSystem(val) {return this.setProp('operatingSystem', val);}
    permissions(val) {return this.setProp('permissions', val);}
    processorRequirements(val) {return this.setProp('processorRequirements', val);}
    releaseNotes(val) {return this.setProp('releaseNotes', val);}
    screenshot(val) {return this.setProp('screenshot', val);}
    softwareAddOn(val) {return this.setProp('softwareAddOn', val);}
    softwareHelp(val) {return this.setProp('softwareHelp', val);}
    softwareRequirements(val) {return this.setProp('softwareRequirements', val);}
    softwareVersion(val) {return this.setProp('softwareVersion', val);}
    storageRequirements(val) {return this.setProp('storageRequirements', val);}
    supportingData(val) {return this.setProp('supportingData', val);}
}

module.exports = SoftwareApplication