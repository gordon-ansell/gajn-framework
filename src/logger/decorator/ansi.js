/**
 * Please refer to the following files in the root directory:
 * 
 * README.md        For information about the package.
 * LICENSE          For license details, copyrights and restrictions.
 */
//'use strict';

/**
 * ANSI formatting codes.
 */

// Reset.
exports.STYLE_NONE = '0';
exports.RESET = '0';

// Styles.
exports.STYLE_INTENSITY_BRIGHT = '1';
exports.STYLE_BOLD = '1';
exports.STYLE_INTENSITY_FAINT = '2';
exports.STYLE_ITALIC = '3';
exports.STYLE_UNDERLINE = '4';
exports.STYLE_BLINK = '5';
exports.STYLE_BLINK_RAPID = '6';
exports.STYLE_NEGATIVE = '7';
exports.STYLE_CONCEAL = '8';
exports.STYLE_STRIKETHROUGH = '9';
exports.STYLE_INTENSITY_NORMAL = '22';
exports.STYLE_BOLD_OFF = '22';
exports.STYLE_ITALIC_OFF = '23';
exports.STYLE_UNDERLINE_OFF = '24';
exports.STYLE_STEADY = '5';
exports.STYLE_BLINK_OFF = '5';
exports.STYLE_POSITIVE = '27';
exports.STYLE_REVEAL = '28';
exports.STYLE_STRIKETHROUGH_OFF = '29';

// Foreground.
exports.COLOR_FG_BLACK = '30';
exports.COLOR_FG_RED = '31';
exports.COLOR_FG_GREEN = '32';
exports.COLOR_FG_YELLOW = '33';
exports.COLOR_FG_BLUE = '34';
exports.COLOR_FG_PURPLE = '35';
exports.COLOR_FG_CYAN = '36';
exports.COLOR_FG_WHITE = '37';
exports.COLOR_FG_RESET = '39';

// Background.
exports.COLOR_BG_BLACK = '40';
exports.COLOR_BG_RED = '41';
exports.COLOR_BG_GREEN = '42';
exports.COLOR_BG_YELLOW = '43';
exports.COLOR_BG_BLUE = '44';
exports.COLOR_BG_PURPLE = '45';
exports.COLOR_BG_CYAN = '46';
exports.COLOR_BG_WHITE = '47';
exports.COLOR_BG_RESET = '49';

// These are not widely supported.
exports.STYLE_FRAMED = '51';
exports.STYLE_ENCIRCLED = '52';
exports.STYLE_OVERLINED = '53';
exports.STYLE_FRAMED_ENCIRCLED_OFF = '54';
exports.STYLE_OVERLINED_OFF = '55';

// These are non-standard,
exports.COLOR_FG_BLACK_BRIGHT = '90';
exports.COLOR_FG_RED_BRIGHT = '91';
exports.COLOR_FG_GREEN_BRIGHT = '92';
exports.COLOR_FG_YELLOW_BRIGHT = '93';
exports.COLOR_FG_BLUE_BRIGHT = '94';
exports.COLOR_FG_PURPLE_BRIGHT = '95';
exports.COLOR_FG_CYAN_BRIGHT = '96';
exports.COLOR_FG_WHITE_BRIGHT = '97';
exports.COLOR_BG_BLACK_BRIGHT = '100';

exports.COLOR_BG_RED_BRIGHT = '101';
exports.COLOR_BG_GREEN_BRIGHT = '102';
exports.COLOR_BG_YELLOW_BRIGHT = '103';
exports.COLOR_BG_BLUE_BRIGHT = '104';
exports.COLOR_BG_PURPLE_BRIGHT = '105';
exports.COLOR_BG_CYAN_BRIGHT = '106';
exports.COLOR_BG_WHITE_BRIGHT = '107';

// Escape.
exports.ESCAPE = "\033";

/**
 * Print out one particular codeset.
 * 
 * @param   {string}      codeset     Codeset to print.
 * @return  {string}                  Full codeset.
 */
function cs(codeset)
{
    return this.ESCAPE + '[' + codeset + 'm';
}

exports.cs = cs;
 
