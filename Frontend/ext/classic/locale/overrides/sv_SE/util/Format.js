/* This will change AM/PM to EM/FM
 * Ext.Date.format(new Date('2006/01/15 15:00:00'), 'd/m/y h:i:s A'); -> 15/01/06 03:00:00 FM
 * Ext.Date.parse("2006-01-15 3:20:01 FM", "Y-m-d g:i:s A")           -> Sun Jan 15 2006 15:20:01
 */

if (Ext.util && Ext.util.Format) {

    Ext.define('Ext.locale.sv_SE.util.Format', {
        override: 'Ext.util.Format',
        decimalSeparator: ',',
        thousandSeparator: '.',
        // Swedish Krone
        currencySign: 'kr',
        dateFormat: 'Y-m-d'
    }, function() {
        var originalParse = Ext.Date.parse;
        Ext.Date.parse = function(input, format, strict) {
            return originalParse(input.replace('am', 'em').replace('pm', 'fm').replace('AM', 'EM').replace('PM', 'FM'), format, strict);
        };
    });
}