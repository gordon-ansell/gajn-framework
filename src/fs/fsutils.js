/**
 * Please refer to the following files in the root directory:
 * 
 * README.md        For information about the package.
 * LICENSE          For license details, copyrights and restrictions.
 */
'use strict';
const path = require('path');
const fs = require('fs');
const rimraf = require('rimraf');
const { sanitizeFileRegex, sanitizeExtRegex } = require('../utils/regex');
const GAError = require('../utils/gaError');
const syslog = require('../logger/syslog');
 
/**
 * Delete a folder recursively.
 * 
 * @param   {string}    dir     Directory to clean.
 * 
 * @return  {boolean}           True if it worked else false.              
 */
function deleteFolderRecursive(dir)
{
    try {
        if (fs.existsSync(dir)) {
            fs.readdirSync(dir).forEach((file) => {
                const curPath = path.join(dir, file);
                if (fs.lstatSync(curPath).isDirectory()) { // recurse
                    deleteFolderRecursive(curPath);
                } else { // delete file
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(dir, {recursive: true, maxRetries: 5});
        }
    } catch (err) {
        throw new GAError("Error in deleteFolderRecursive: " + err.message, '', err);
    }
    return true;
}
 
/**
 * Clean a directory.
 * 
 * @param   {string}    dir     Directory to clean.
 * @param   {string}    qual    Qualifier.
 * 
 * @return  {boolean}           True if we cleaned it, else false.
 */
function cleanDir(dir, qual = '*')
{
    if (fs.existsSync(dir)) {
        rimraf.sync(path.join(dir, qual));
        return true;
    }
    return false;
}

/**
 * Copy a directory.
 * 
 * @param   {string}    from    Directory to copy from.
 * @param   {string}    to      Directory to copy to.
 * @param   {object}    opts    Options.   
 */
function copyDir(from, to, opts = {fileNotBeginsWith: ['.']})
{
    if (!fs.existsSync(from)) {
        syslog.warning("Directory does not exist for copy (although this might be ignorable).", from);
        return;
    }

    let fnbwRegex = null;

    if (opts.fileNotBeginsWith) {
        let ap = sanitizeFileRegex(opts.fileNotBeginsWith);
        if (ap != '') {
            fnbwRegex = new RegExp("^(" + ap + ")", 'i');
        }
    }
    
    let fneRegex = null;

    if (opts.fileNotExt) {
        let ap = sanitizeExtRegex(opts.fileNotExt);
        if (ap != '') {
            fneRegex = new RegExp("^(" + ap + ")", 'i');
        }
    }

    let entries = fs.readdirSync(from);

    entries.forEach((entry) => {


        let fromPath = path.join(from, entry);
        let toPath = path.join(to, entry);
        let stats = fs.statSync(fromPath);
        
        let go = true;
        if (stats.isFile() && fnbwRegex != null) {
            if (null !== fnbwRegex.exec(path.basename(fromPath))) {
                go = false;
            }
        }

        if (stats.isFile() && path.extname(fromPath) && fneRegex != null) {
            if (null !== fneRegex.exec(path.extname(fromPath))) {
                go = false;
            }
        }

        if (go) {
        
            if (stats.isFile()) {
                copyFile(fromPath, toPath);
            } else if (stats.isDirectory()) {
                copyDir(fromPath, toPath, opts);
            }
        
        }

    });
}

/**
 * Copy a directory (async).
 * 
 * @param   {string}    from    Directory to copy from.
 * @param   {string}    to      Directory to copy to.
 * @param   {object}    opts    Options.   
 */
async function copyDirAsync(from, to, opts = {fileNotBeginsWith: ['.']})
{
    if (!fs.existsSync(from)) {
        syslog.warning("Directory does not exist for copy (although this might be ignorable).", from);
        return;
    }

    let fnbwRegex = null;

    if (opts.fileNotBeginsWith) {
        let ap = sanitizeFileRegex(opts.fileNotBeginsWith);
        if (ap != '') {
            fnbwRegex = new RegExp("^(" + ap + ")", 'i');
        }
    }
    
    let fneRegex = null;

    if (opts.fileNotExt) {
        let ap = sanitizeExtRegex(opts.fileNotExt);
        if (ap != '') {
            fneRegex = new RegExp("^(" + ap + ")", 'i');
        }
    }

    let entries = fs.readdirSync(from);

    await Promise.all(entries.map(async entry => {

        let fromPath = path.join(from, entry);
        let toPath = path.join(to, entry);
        let stats = fs.statSync(fromPath);
        
        let go = true;
        if (stats.isFile() && fnbwRegex != null) {
            if (null !== fnbwRegex.exec(path.basename(fromPath))) {
                go = false;
            }
        }

        if (stats.isFile() && path.extname(fromPath) && fneRegex != null) {
            if (null !== fneRegex.exec(path.extname(fromPath))) {
                go = false;
            }
        }

        if (go) {
        
            if (stats.isFile()) {
                copyFileAsync(fromPath, toPath);
            } else if (stats.isDirectory()) {
                copyDirAsync(fromPath, toPath, opts);
            }
        
        }

    }));
}

/**
 * Copy a directory (async + progress).
 * 
 * @param   {string}    from    Directory to copy from.
 * @param   {string}    to      Directory to copy to.
 * @param   {object}    opts    Options.   
 */
async function copyDirAsyncProgress(from, to, opts = {fileNotBeginsWith: ['.']})
{
    if (!fs.existsSync(from)) {
        syslog.warning("Directory does not exist for copy (although this might be ignorable).", from);
        return;
    }

    let fnbwRegex = null;

    if (opts.fileNotBeginsWith) {
        let ap = sanitizeFileRegex(opts.fileNotBeginsWith);
        if (ap != '') {
            fnbwRegex = new RegExp("^(" + ap + ")", 'i');
        }
    }
    
    let fneRegex = null;

    if (opts.fileNotExt) {
        let ap = sanitizeExtRegex(opts.fileNotExt);
        if (ap != '') {
            fneRegex = new RegExp("^(" + ap + ")", 'i');
        }
    }

    let entries = fs.readdirSync(from);

    let totalItems = entries.length;
    let count = 0;
    await syslog.printProgress(0);

    await Promise.all(entries.map(async entry => {

        let fromPath = path.join(from, entry);
        let toPath = path.join(to, entry);
        let stats = fs.statSync(fromPath);
        
        let go = true;
        if (stats.isFile() && fnbwRegex != null) {
            if (null !== fnbwRegex.exec(path.basename(fromPath))) {
                go = false;
            }
        }

        if (stats.isFile() && path.extname(fromPath) && fneRegex != null) {
            if (null !== fneRegex.exec(path.extname(fromPath))) {
                go = false;
            }
        }

        if (go) {
        
            if (stats.isFile()) {
                copyFileAsync(fromPath, toPath);
            } else if (stats.isDirectory()) {
                copyDirAsync(fromPath, toPath, opts);
            }
        
        }

        count++;
        await syslog.printProgress((count / totalItems) * 100);

    }));

    syslog.endProgress;
}
 

/**
 * Copy a file.
 * 
 * @param   {string}    from        From file.
 * @param   {string}    to          To file.
 * @param   {number}    mode        Mode for creating directories along the way.
 */
function copyFile(from, to, mode = 0o777) 
{
    mkdirRecurse(path.dirname(to), mode);
    if (fs.existsSync(path.dirname(to))) {
        try {
            fs.copyFileSync(from, to);
        } catch (err) {
            throw new GAError(`Could not copy to ${to}\\n${err}`, '', err);
        }
    } else {
        throw new GAError(`Cannot copy file to ${to} because directory does not exist.`);
    }
}

/**
 * Copy a file (async).
 * 
 * @param   {string}    from        From file.
 * @param   {string}    to          To file.
 * @param   {number}    mode        Mode for creating directories along the way.
 */
async function copyFileAsync(from, to, mode = 0o777) 
{
    mkdirRecurse(path.dirname(to), mode);
    if (fs.existsSync(path.dirname(to))) {
        try {
            fs.copyFileSync(from, to);
        } catch (err) {
            throw new GAError(`Could not copy to ${to}\\n${err}`, '', err);
        }
    } else {
        throw new GAError(`Cannot copy file to ${to} because directory does not exist.`);
    }
}
 
/**
 * Make a directory (rescursively).
 * 
 * @param   {string}    dirPath     Directory path to make.
 * @param   {number}    mode        Permissions.
 * @param   {string}    made        What we've made so far.
 * 
 * @return  {string}    What we made.
 * 
 * Taken from substack/node-mkdirp.
 * James Halliday <mail@substack.net> (http://substack.net)
 */
function mkdirRecurse(dirPath, mode = 0o777, made = null)
{
    // Make sure we have a real path.    
    dirPath = path.resolve(dirPath);

    // Try to make the directory.
    try {
        fs.mkdirSync(dirPath, mode);
        made = made || dirPath;
    } catch (err0) {
        switch (err0.code) {
            // Could not make it, so keep moving up the segments and
            // make the necessary parent directories.
            case 'ENOENT' :
                made = mkdirRecurse(path.dirname(dirPath), mode, made);
                mkdirRecurse(dirPath, mode, made);
                break;

            // In the case of any other error, just see if there's a dir
            // there already.  If so, then hooray!  If not, then something
            // is borked.
            default:
                let stat;
                try {
                    stat = fs.statSync(dirPath);
                }
                catch (err1) {
                    throw new GAError(`Mkdir error: could not get stats for: ${dirPath}\\n${err1.message}`,
                        '', err1);
                }
                if (!stat.isDirectory()) {
                    throw new GAError(`Mkdir error: ${dirPath} is not a diretory:\\n${err0}`);
                }
                break;
        }
    }

    return made;
}

exports.deleteFolderRecursive = deleteFolderRecursive;
exports.cleanDir = cleanDir;
exports.copyDir = copyDir;
exports.copyFile = copyFile;
exports.copyDirAsync = copyDirAsync;
exports.copyFileAsync = copyFileAsync;
exports.copyDirAsyncProgress = copyDirAsyncProgress;
exports.mkdirRecurse = mkdirRecurse;


