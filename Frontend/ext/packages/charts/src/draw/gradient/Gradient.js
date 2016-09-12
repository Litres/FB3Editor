/**
 * @class Ext.draw.gradient.Gradient
 *
 * Creates a gradient.
 */
Ext.define('Ext.draw.gradient.Gradient', {

    requires: ['Ext.draw.Color'],

    isGradient: true,

    config: {
        /**
         * Defines the stops of the gradient.
         */
        stops: []
    },

    applyStops: function (newStops) {
        var stops = [],
            ln = newStops.length,
            i, stop, color;

        for (i = 0; i < ln; i++) {
            stop = newStops[i];
            color = stop.color;
            if (!(color && color.isColor)) {
                color = Ext.draw.Color.fly(color || Ext.draw.Color.NONE);
            }
            stops.push({
                offset: Math.min(1, Math.max(0, 'offset' in stop ? stop.offset : stop.position || 0)),
                color: color.toString()
            });
        }
        stops.sort(function (a, b) {
            return a.offset - b.offset;
        });
        return stops;
    },

    onClassExtended: function (subClass, member) {
        if (!member.alias && member.type) {
            member.alias = 'gradient.' + member.type;
        }
    },

    constructor: function (config) {
        this.initConfig(config);
    },

    /**
     * @method
     * @protected
     * Generates the gradient for the given context.
     * @param {Ext.draw.engine.SvgContext} ctx The context.
     * @param {Object} bbox
     * @return {Object}
     */
    generateGradient: Ext.emptyFn

});
