/**
 * @class Ext.chart.series.sprite.Scatter
 * @extends Ext.chart.series.sprite.Cartesian
 * 
 * Scatter series sprite.
 */
Ext.define('Ext.chart.series.sprite.Scatter', {
    alias: 'sprite.scatterSeries',
    extend: 'Ext.chart.series.sprite.Cartesian',

    renderClipped: function (surface, ctx, clip, clipRect) {
        if (this.cleanRedraw) {
            return;
        }
        var me = this,
            attr = me.attr,
            dataX = attr.dataX,
            dataY = attr.dataY,
            labels = attr.labels,
            series = me.getSeries(),
            isDrawLabels = labels && me.getMarker('labels'),
            matrix = me.attr.matrix,
            xx = matrix.getXX(),
            yy = matrix.getYY(),
            dx = matrix.getDX(),
            dy = matrix.getDY(),
            markerCfg = {}, changes, params,
            xScalingDirection = surface.getInherited().rtl && !attr.flipXY ? -1 : 1,
            left, right, top, bottom,
            x, y, i;

        if (attr.flipXY) {
            left = clipRect[1] - xx * xScalingDirection;
            right = clipRect[1] + clipRect[3] + xx * xScalingDirection;
            top = clipRect[0] - yy;
            bottom = clipRect[0] + clipRect[2] + yy;
        } else {
            left = clipRect[0] - xx * xScalingDirection;
            right = clipRect[0] + clipRect[2] + xx * xScalingDirection;
            top = clipRect[1] - yy;
            bottom = clipRect[1] + clipRect[3] + yy;
        }

        for (i = 0; i < dataX.length; i++) {
            x = dataX[i];
            y = dataY[i];
            x = x * xx + dx;
            y = y * yy + dy;
            if (left <= x && x <= right && top <= y && y <= bottom) {
                if (attr.renderer) {
                    markerCfg = {
                        type: 'items',
                        translationX: x,
                        translationY: y
                    };
                    params = [me, markerCfg, {store: me.getStore()}, i];
                    changes = Ext.callback(attr.renderer, null, params, 0, series);
                    markerCfg = Ext.apply(markerCfg, changes);
                } else {
                    markerCfg.translationX = x;
                    markerCfg.translationY = y;
                }
                me.putMarker('items', markerCfg, i, !attr.renderer);
                if (isDrawLabels && labels[i]) {
                    me.drawLabel(labels[i], x, y, i, clipRect);
                }
            }
        }
    },

    drawLabel: function (text, dataX, dataY, labelId, rect) {
        var me = this,
            attr = me.attr,
            label = me.getMarker('labels'),
            labelTpl = label.getTemplate(),
            labelCfg = me.labelCfg || (me.labelCfg = {}),
            surfaceMatrix = me.surfaceMatrix,
            labelX, labelY,
            labelOverflowPadding = attr.labelOverflowPadding,
            flipXY = attr.flipXY,
            halfHeight, labelBox,
            changes, params;

        labelCfg.text = text;

        labelBox = me.getMarkerBBox('labels', labelId, true);
        if (!labelBox) {
            me.putMarker('labels', labelCfg, labelId);
            labelBox = me.getMarkerBBox('labels', labelId, true);
        }

        if (flipXY) {
            labelCfg.rotationRads = Math.PI * 0.5;
        } else {
            labelCfg.rotationRads = 0;
        }

        halfHeight = labelBox.height / 2;
        labelX = dataX;

        switch (labelTpl.attr.display) {
            case 'under':
                labelY = dataY - halfHeight - labelOverflowPadding;
                break;
            case 'rotate':
                labelX += labelOverflowPadding;
                labelY = dataY - labelOverflowPadding;
                labelCfg.rotationRads = -Math.PI / 4;
                break;
            default: // 'over'
                labelY = dataY + halfHeight + labelOverflowPadding;
        }

        labelCfg.x = surfaceMatrix.x(labelX, labelY);
        labelCfg.y = surfaceMatrix.y(labelX, labelY);

        if (labelTpl.attr.renderer) {
            params = [text, label, labelCfg, {store: me.getStore()}, labelId];
            changes = Ext.callback(labelTpl.attr.renderer, null, params, 0, me.getSeries());
            if (typeof changes === 'string') {
                labelCfg.text = changes;
            } else {
                Ext.apply(labelCfg, changes);
            }
        }

        me.putMarker('labels', labelCfg, labelId);
    }
});
