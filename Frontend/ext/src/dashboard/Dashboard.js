/**
 * This class manages a drag-drop Dashboard similar to the legacy Ext JS Portal example.
 * The user-directed layout of the Dashboard is preserved the Ext JS `stateful` mechanism
 * to preserve potentially dynamic user sizing and collapsed states as well as order of
 * items in their columns.
 */
Ext.define('Ext.dashboard.Dashboard', {
    extend: 'Ext.panel.Panel',
    xtype: 'dashboard',

    requires: [
        'Ext.layout.container.Dashboard',
        'Ext.dashboard.DropZone',
        'Ext.dashboard.Column',
        'Ext.dashboard.Part'
    ],

    isDashboard: true,

    cls: Ext.baseCSSPrefix + 'dashboard',

    bodyCls: Ext.baseCSSPrefix + 'dashboard-body',

    defaultType: 'dashboard-column',

    autoScroll: true,

    layout: null,

    stateful: false,

    idSeed: 1,

    config: {
        /**
         * @cfg {Object} parts
         * An object keyed by `id` for the parts that can be created for this `Dashboard`.
         */
        parts: null
    },

    renderConfig: {
        /**
         * @cfg {Object} maxColumns
         * The maximum number of visible columns.
         */
        maxColumns: 4
    },

    /**
     * @event validatedrop
     */

    /**
     * @event beforedragover
     */

    /**
     * @event dragover
     */

    /**
     * @event beforedrop
     */

    /**
     * @event drop
     */

    initComponent: function () {
        var me = this;

        if (!me.layout) {
            me.layout = {
                type: 'dashboard'
            };
        }

        me.callParent();
    },

    applyParts: function (parts, collection) {
        if (!collection) {
            collection = new Ext.util.Collection({
                decoder: Ext.Factory.part
            });
        }

        var id, part;

        for (id in parts) {
            part = parts[id];
            if (Ext.isString(part)) {
                part = {
                    type: part
                };
            }

            part.id = id;
            part.dashboard = this;
            collection.add(part);
        }

        return collection;
    },

    /** @private */
    getPart: function (type) {
        var parts = this.getParts();
        return parts.getByKey(type);
    },

    addNew: function (type, columnIndex, beforeAfter) {
        var me = this,
            part = me.getPart(type);

        part.displayForm(null, null, function (config) {
            config.type = type;
            me.addView(config, columnIndex, beforeAfter);
        });
    },

    addView: function (instance, columnIndex, beforeAfter) {
        var me = this,
            items = me.items,
            count = items.getCount(),
            index = columnIndex || 0,
            view = instance.id ? instance : me.createView(instance),
            columnWidths = me.columnWidths,
            column;

        if (!count) {
            // if the layout is empty, assert a full initially
            column = me.add(0, me.createColumn({columnWidth : 1}));
            count = 1;
            columnWidths = me.columnWidths = [];
        }

        if (index >= count) {
            index = count - 1;
            beforeAfter = 1; // after
        }

        if (!beforeAfter) {
            column = items.getAt(index);
            if (column) {
                return column.add(view);
            }
        }

        if (beforeAfter > 0) {
            // after...
            ++index;
        }

        column = me.createColumn();
        if (columnWidths) {
            column.columnWidth = columnWidths[index] || (columnWidths[index] = 1);
        }

        if (!column.items) {
            column.items = [];
        }

        column.items.push(view);
        column = me.add(index, column);

        return column.items.first();
    },

    createColumn: function (config) {
        var cycle = this.cycleLayout;
        return Ext.apply({
            items : [],
            bubbleEvents : ['add','remove','move', 'resize'],
            listeners: {
                remove: this.onRemoveItem,
                expand  : cycle,
                collapse : cycle,
                scope: this
            }
        }, config);
    },

    createView: function (config) {
        var me = this,
            type = config.type,
            part = me.getPart(type),
            view = part.createView(config);

        if (!view.id) {
            view.id = me.id + '_' + type + (me.idSeed++);
        }

        view.bubbleEvents = Ext.Array.from(view.bubbleEvents).concat(['expand', 'collapse']);
        view.stateful = me.stateful;
        return view;
    },

    initEvents : function(){
        this.callParent();
        this.dd = new Ext.dashboard.DropZone(this, this.dropConfig);
    },

    /**
     * Readjust column/splitter heights for collapsing child panels
     * @private
     */
    cycleLayout : function() {
         this.updateLayout();
    },

    beforeDestroy : function() {
        if (this.dd) {
            Ext.destroy(this.dd);
        }
        this.callParent();
    },

    //-------------------------------------------------
    // State and Item Persistence

    applyState: function (state) {
        delete state.items;
        var me = this;
        me.callParent([state]);

        var columnWidths = state.columnWidths,
            items = me.items.items,
            length = items.length,
            i, n;

        // Splitters have not been inserted so the length is sans-splitter
        if (columnWidths) {
            n = columnWidths.length;
            me.columnWidths = [];

            for (i = 0; i < length; ++i) {
                me.columnWidths.push(
                    items[i].columnWidth = (i < n) ? columnWidths[i] : (1 / length)
                );
            }
        }
    },

    getState : function() {
        var me = this,
            columnWidths = [],
            items = me.items.items,
            state = me.callParent() || {},
            length = items.length,
            i, item;

        for (i = 0; i < length; ++i) {
            if (!(item = items[i]).isSplitter) {
                columnWidths.push(item.columnWidth);
            }
        }

        state.columnWidths = columnWidths;
        state.idSeed = me.idSeed;
        state.items = me.serializeItems();
        me.columnWidths = columnWidths;

        return state;
    },

    initItems: function () {
        var me = this,
            defaultContent = me.defaultContent,
            state;

        if (me.stateful) {
            state = Ext.state.Manager.get(me.getStateId());
            defaultContent = (state && state.items) || defaultContent;
        }

        if (!me.items && defaultContent) {
            me.items = me.deserializeItems(defaultContent);
        }

        me.callParent();
    },

    deserializeItems: function (serialized) {
        var me = this,
            length = serialized.length,
            columns = [],
            columnWidths = me.columnWidths,
            maxColumns = me.getMaxColumns(),
            column, columnIndex, columnWidth, i, item, partConfig;

        for (i = 0; i < length; ++i) {
            partConfig = serialized[i];
            columnIndex = Math.min(partConfig.columnIndex || 0, maxColumns - 1);
            delete partConfig.columnIndex;

            if (!(column = columns[columnIndex])) {
                columns[columnIndex] = column = me.createColumn();

                columnWidth = columnWidths && columnWidths[columnIndex];
                if (columnWidth) {
                    column.columnWidth = columnWidth;
                }
            }

            item = me.createView(partConfig);
            column.items.push(item);
        }

        for (i = 0, length = columns.length; i < length; ++i) {
            column = columns[i];

            if (!column.columnWidth) {
                column.columnWidth = 1 / length;
            }
        }

        return columns;
    },

    serializeItem: function (item) {
        return Ext.apply({
            type: item.part.id,
            id: item.id,
            columnIndex: item.columnIndex
        }, item._partConfig);
    },

    serializeItems: function () {
        var me = this,
            items = me.items.items,
            length = items.length,
            ret = [],
            columnIndex = 0,
            child, childItems, i, item, j, k;

        for (i = 0; i < length; ++i) {
            item = items[i];

            if (!item.isSplitter) {
                childItems = item.items.items;

                for (j = 0, k = childItems.length; j < k; ++j) {
                    child = childItems[j];
                    child.columnIndex = columnIndex;
                    ret.push(me.serializeItem(child));
                }

                ++columnIndex;
            }
        }

        return ret;
    },

    onRemoveItem: function (column, item) {
        // Removing items from a Dashboard is a persistent action, so we must remove the
        // state data for it or leak it.
        if (item.stateful && !item.isMoving) {
            Ext.state.Manager.clear(item.getStateId());
        }
    }
});
