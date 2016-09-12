/**
 * @private
 *
 * Scroll position implementation
 */
Ext.define('Ext.util.translatable.ScrollPosition', {
    extend: 'Ext.util.translatable.Dom',

    type: 'scrollposition',

    config: {
        useWrapper: true
    },

    getWrapper: function() {
        var wrapper = this.wrapper,
            element = this.getElement(),
            container;

        if (!wrapper) {
            container = element.getParent();

            if (!container) {
                return null;
            }

            if (container.hasCls(Ext.baseCSSPrefix + 'translatable-hboxfix')) {
                container = container.getParent();
            }

            if (this.getUseWrapper()) {
                wrapper = element.wrap();
            }
            else {
                wrapper = container;
            }

            element.addCls(Ext.baseCSSPrefix + 'translatable');
            wrapper.addCls(Ext.baseCSSPrefix + 'translatable-container');

            this.wrapper = wrapper;

            wrapper.on('painted', function() {
                if (!this.isAnimating) {
                    this.refresh();
                }
            }, this);

            this.refresh();
        }

        return wrapper;
    },

    doTranslate: function(x, y) {
        var wrapper = this.getWrapper(),
            dom;

        if (wrapper) {
            dom = wrapper.dom;

            if (typeof x == 'number') {
                dom.scrollLeft = 500000 - x;
            }

            if (typeof y == 'number') {
                dom.scrollTop = 500000 - y;
            }
        }
    },

    destroy: function() {
        var me = this,
            element = me.getElement(),
            wrapper = me.wrapper;

        if (wrapper) {
            if (!element.destroyed) {
                if (me.getUseWrapper()) {
                    wrapper.doReplaceWith(element);
                }
                element.removeCls(Ext.baseCSSPrefix + 'translatable');
            }
            if (!wrapper.destroyed) {
                wrapper.removeCls(Ext.baseCSSPrefix + 'translatable-container');
                wrapper.un('painted', 'refresh', me);
            }

            delete me.wrapper;
            delete me._element;
        }

        me.callParent();
    }

});
