/**
 * Please refer to the following files in the root directory:
 * 
 * README.md        For information about the package.
 * LICENSE          For license details, copyrights and restrictions.
 */
'use strict';

/**
 * Print the progress.
 */
function printProgress(progress, desc)
{
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    let msg = Math.round(progress) + '% ';
    if (desc) {
        msg = desc + ': ' + msg; 
    }
    process.stdout.write(msg);
}

/**
 * End progress.
 */
function endProgress()
{
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
}
 
exports.printProgress = printProgress;
exports.endProgress = endProgress;
 
 