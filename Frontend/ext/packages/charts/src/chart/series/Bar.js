/**
 * @class Ext.chart.series.Bar
 * @extends Ext.chart.series.StackedCartesian
 * 
 * Creates a Bar or Column Chart (depending on the value of the
 * {@link Ext.chart.CartesianChart#flipXY flipXY} config).
 *
 * Note: 'bar' series is meant to be used with the
 * {@link Ext.chart.axis.Category 'category'} axis as its x-axis.
 * 
 *     @example
 *     Ext.create({
 *        xtype: 'cartesian', 
 *        renderTo: document.body,
 *        width: 600,
 *        height: 400,
 *        store: {
 *            fields: ['name', 'value'],
 *            data: [{
 *                name: 'metric one',
 *                value: 10
 *            }, {
 *                name: 'metric two',
 *                value: 7
 *            }, {
 *                name: 'metric three',
 *                value: 5
 *            }, {
 *                name: 'metric four',
 *                value: 2
 *            }, {
 *                name: 'metric five',
 *                value: 27
 *            }]
 *        },
 *        axes: [{
 *            type: 'numeric',
 *            position: 'left',
 *            title: {
 *                text: 'Sample Values',
 *                fontSize: 15
 *            },
 *            fields: 'value'
 *        }, {
 *            type: 'category',
 *            position: 'bottom',
 *            title: {
 *                text: 'Sample Values',
 *                fontSize: 15
 *            },
 *            fields: 'name'
 *        }],
 *        series: {
 *            type: 'bar',
 *            subStyle: {
 *                fill: ['#388FAD'],
 *                stroke: '#1F6D91'
 *            },
 *            xField: 'name',
 *            yField: 'value'
 *        }
 *     });
 */
Ext.define('Ext.chart.series.Bar', {

    extend: 'Ext.chart.series.StackedCartesian',

    alias: 'series.bar',
    type: 'bar',
    seriesType: 'barSeries',

    requires: [
        'Ext.chart.series.sprite.Bar',
        'Ext.draw.sprite.Rect'
    ],

    config: {
        /**
         * @private
         * @cfg {Object} itemInstancing Sprite template used for series.
         */
        itemInstancing: {
            type: 'rect',
            fx: {
                customDurations: {
                    x: 0,
                    y: 0,
                    width: 0,
                    height: 0,
                    radius: 0
                }
            }
        }
    },

    getItemForPoint: function (x, y) {
        if (this.getSprites()) {
            var me = this,
                chart = me.getChart(),
                padding = chart.getInnerPadding(),
                isRtl = chart.getInherited().rtl;

            // Convert the coordinates because the "items" sprites that draw the bars ignore the chart's InnerPadding.
            // See also Ext.chart.series.sprite.Bar.getIndexNearPoint(x,y) regarding the series's vertical coordinate system.
            arguments[0] = x + (isRtl ? padding.right : -padding.left);
            arguments[1] = y + padding.bottom;
            return me.callParent(arguments);
        }
    },

    updateXAxis: function (axis) {
        axis.setLabelInSpan(true);
        this.callParent(arguments);
    },

    updateHidden: function (hidden) {
        this.callParent(arguments);
        this.updateStacked();
    },

    updateStacked: function (stacked) {
        var me = this,
            sprites = me.getSprites(),
            ln = sprites.length,
            visible = [],
            attributes = {}, i;

        for (i = 0; i < ln; i++) {
            if (!sprites[i].attr.hidden) {
                visible.push(sprites[i]);
            }
        }
        ln = visible.length;

        if (me.getStacked()) {
            attributes.groupCount = 1;
            attributes.groupOffset = 0;
            for (i = 0; i < ln; i++) {
                visible[i].setAttributes(attributes);
            }
        } else {
            attributes.groupCount = visible.length;
            for (i = 0; i < ln; i++) {
                attributes.groupOffset = i;
                visible[i].setAttributes(attributes);
            }
        }
        me.callParent(arguments);
    }
});
