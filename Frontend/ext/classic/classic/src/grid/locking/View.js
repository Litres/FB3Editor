/**
 * This class is used internally to provide a single interface when using
 * a locking grid. Internally, the locking grid creates two separate grids,
 * so this class is used to map calls appropriately.
 * @private
 */
Ext.define('Ext.grid.locking.View', {
    alternateClassName: 'Ext.grid.LockingView',
    requires: [
        'Ext.view.AbstractView',
        'Ext.view.Table'
    ],

    mixins: [
        'Ext.util.Observable',
        'Ext.util.StoreHolder',
        'Ext.util.Focusable'
    ],

    /**
     * @property {Boolean} isLockingView
     * `true` in this class to identify an object as an instantiated LockingView, or subclass thereof.
     */
    isLockingView: true,

    loadMask: true,

    eventRelayRe: /^(beforeitem|beforecontainer|item|container|cell|refresh)/,

    constructor: function(config){
        var ext = Ext,
            me = this,
            lockedView,
            normalView;

        me.ownerGrid = config.ownerGrid;
        me.ownerGrid.view = me;

        // A single NavigationModel is configured into both views.
        me.navigationModel = config.locked.xtype === 'treepanel' ? new ext.tree.NavigationModel(me) : new ext.grid.NavigationModel(me);

        // Disable store binding for the two child views.
        // The store is bound to the *this* locking View.
        // This avoids the store being bound to two views (with duplicated layouts on each store mutation)
        // and also avoids the store being bound to the selection model twice.
        config.locked.viewConfig.bindStore = ext.emptyFn;
        config.normal.viewConfig.bindStore = me.subViewBindStore;
        config.normal.viewConfig.isNormalView = config.locked.viewConfig.isLockedView = true;

        // Override the point at which first refresh is kicked off.
        // The initial refresh of both sides must take place within a layout suspension
        // to coalescse the resulting layouts into one.
        config.locked.viewConfig.beforeLayout = config.normal.viewConfig.beforeLayout = me.beforeLayout;

        // Share the same NavigationModel
        config.locked.viewConfig.navigationModel = config.normal.viewConfig.navigationModel = me.navigationModel;

        me.lockedGrid = me.ownerGrid.lockedGrid = ext.ComponentManager.create(config.locked);

        me.lockedView = lockedView = me.lockedGrid.getView();

        // The normal view uses the same selection model
        me.selModel = config.normal.viewConfig.selModel = lockedView.getSelectionModel();

        if (me.lockedGrid.isTree) {
            // Tree must not animate because the partner grid is unable to animate
            me.lockedView.animate = false;

            // When this is a locked tree, the normal side is just a gridpanel, so needs the flat NodeStore
            config.normal.store = lockedView.store;

            // Match configs between sides
            config.normal.viewConfig.stripeRows = me.lockedView.stripeRows;
            config.normal.rowLines = me.lockedGrid.rowLines;
        }

        // Set up a bidirectional relationship between the two sides of the locked view.
        // Inject lockingGrid and normalGrid into owning panel.
        // This is because during constraction, it must be possible for descendant components
        // to navigate up to the owning lockable panel and then down into either side.
        me.normalGrid = me.ownerGrid.normalGrid = ext.ComponentManager.create(config.normal);
        lockedView.lockingPartner = normalView = me.normalView = me.normalGrid.getView();
        normalView.lockingPartner = lockedView;

        me.loadMask = (config.loadMask !== undefined) ? config.loadMask : me.loadMask;

        me.mixins.observable.constructor.call(me);

        // Relay both view's events.
        me.lockedViewEventRelayers = me.relayEvents(lockedView, ext.view.Table.events);

        // Relay extra events from only the normal view.
        // These are events that both sides fire (selection events), so avoid firing them twice.
        me.normalViewEventRelayers = me.relayEvents(normalView, ext.view.Table.events.concat(ext.view.Table.normalSideEvents));

        normalView.on({
            scope: me,
            itemmouseleave: me.onItemMouseLeave,
            itemmouseenter: me.onItemMouseEnter
        });

        lockedView.on({
            scope: me,
            itemmouseleave: me.onItemMouseLeave,
            itemmouseenter: me.onItemMouseEnter
        });

        me.ownerGrid.on({
            render: me.onPanelRender,
            scope: me
        });

        me.loadingText = normalView.loadingText;
        me.loadingCls = normalView.loadingCls;
        me.loadingUseMsg = normalView.loadingUseMsg;

        me.itemSelector = me.getItemSelector();

        // Share the items arrey with the normal view.
        // Certain methods need access to the start/end/count
        me.all = normalView.all;

        // Bind to the data source. Cache it by the property name "dataSource".
        // The store property is public and must reference the provided store.
        // We relay each call into both normal and locked views bracketed by a layout suspension.
        me.bindStore(normalView.dataSource, true, 'dataSource');
    },

    // This is injected into the two child views as the bindStore implementation.
    // Subviews in a lockable asseembly do not bind to stores.
    subViewBindStore: function(store) {
        var me = this,
            selModel;

        if (me.destroying || me.destroyed) {
            return;
        }

        selModel = me.getSelectionModel();
        selModel.bindStore(store);
        selModel.bindComponent(me);
    },

    // Called in the context of a child view when the first child view begins its layout run
    beforeLayout: function() {
        // Access the Lockable object
        var me = this.ownerCt.ownerLockable.view,
            lockedView = me.lockedGrid.view,
            normalView = me.normalGrid.view;

        if (!me.relayingOperation) {

            // Perform the first refresh just before the first layout
            // Locked grid may be hidden if it began with no columns, so do not refresh it,
            if (me.lockedGrid.isVisible()) {
                if (lockedView.refreshNeeded) {
                    lockedView.doFirstRefresh(lockedView.dataSource);
                }
            }
            if (normalView.refreshNeeded) {
                normalView.doFirstRefresh(normalView.dataSource);
            }
        }
    },

    onPanelRender: function() {
        var me = this,
            mask = me.loadMask,
            cfg = {
                target: me.ownerGrid,
                msg: me.loadingText,
                msgCls: me.loadingCls,
                useMsg: me.loadingUseMsg,
                store: me.ownerGrid.store
            };

        // Because this is used as a View, it should have an el. Use the owning Lockable's body.
        // It also has to fire a render event so that Editing plugins can attach listeners
        me.el = me.ownerGrid.getTargetEl();
        me.rendered = true;

        me.initFocusableEvents();

        me.fireEvent('render', me);

        if (mask) {
            // either a config object 
            if (Ext.isObject(mask)) {
                cfg = Ext.apply(cfg, mask);
            }
            // Attach the LoadMask to a *Component* so that it can be sensitive to resizing during long loads.
            // If this DataView is floating, then mask this DataView.
            // Otherwise, mask its owning Container (or this, if there *is* no owning Container).
            // LoadMask captures the element upon render.
            me.loadMask = new Ext.LoadMask(cfg);
        }
    },

    getRefOwner: function() {
        return this.ownerGrid;
    },

    // Implement the same API as Ext.view.Table.
    // This will return the topmost, unified visible column manager
    getVisibleColumnManager: function() {
        // ownerGrid refers to the topmost responsible Ext.panel.Grid.
        // This could be this view's ownerCt, or if part of a locking arrangement, the locking grid
        return this.ownerGrid.getVisibleColumnManager();
    },

    getTopLevelVisibleColumnManager: function() {
        // ownerGrid refers to the topmost responsible Ext.panel.Grid.
        // This could be this view's ownerCt, or if part of a locking arrangement, the locking grid
        return this.ownerGrid.getVisibleColumnManager();
    },

    getGridColumns: function() {
        return this.getVisibleColumnManager().getColumns();
    },

    getEl: function(column){
        return this.getViewForColumn(column).getEl();
    },

    getCellSelector: function() {
        return this.normalView.getCellSelector();
    },

    getItemSelector: function () {
        return this.normalView.getItemSelector();
    },

    getViewForColumn: function(column) {
        var view = this.lockedView,
            inLocked;

        view.headerCt.cascade(function(col){
            if (col === column) {
                inLocked = true;
                return false;
            }
        });

        return inLocked ? view : this.normalView;
    },

    onItemMouseEnter: function(view, record){
        var me = this,
            locked = me.lockedView,
            other = me.normalView,
            item;

        if (view.trackOver) {
            if (view !== locked) {
                other = locked;
            }
            item = other.getNode(record);
            other.highlightItem(item);
        }
    },

    onItemMouseLeave: function(view, record){
        var me = this,
            locked = me.lockedView,
            other = me.normalView;

        if (view.trackOver) {
            if (view !== locked) {
                other = locked;
            }
            other.clearHighlight();
        }
    },

    relayFn: function(name, args){
        args = args || [];

        var me = this,
            view = me.lockedView;

        // Flag that we are already manipulating the view pair, so resulting excursions
        // back into this class can avoid breaking the sequence.
        me.relayingOperation = true;
        view[name].apply(view, args);
        view = me.normalView;
        view[name].apply(view, args);
        me.relayingOperation = false;
    },

    getSelectionModel: function(){
        return this.normalView.getSelectionModel();
    },

    getNavigationModel: function() {
        return this.navigationModel;
    },

    getStore: function(){
        return this.ownerGrid.store;
    },

    /**
     * Changes the data store bound to this view and refreshes it.
     * @param {Ext.data.Store} store The store to bind to this view
     * @since 3.4.0
     */
    onBindStore : function(store, initial, propName) {
        var me = this,
            lockedView = me.lockedView,
            normalView = me.normalView;

        // If we have already achieved our first layout, refresh immediately.
        // If we have bound to the Store before the first layout, then onBoxReady will
        // call doFirstRefresh
        if (normalView.componentLayoutCounter && !(lockedView.blockRefresh && normalView.blockRefresh)) {
            Ext.suspendLayouts();
            lockedView.doFirstRefresh(store);
            normalView.doFirstRefresh(store);
            Ext.resumeLayouts(true);
        }
    },

    getStoreListeners: function() {
        var me = this;
        return {
            // Give view listeners the highest priority, since they need to relay things to
            // children first
            priority: 1000,
            refresh: me.onDataRefresh,
            replace: me.onReplace,
            add: me.onAdd,
            remove: me.onRemove,
            update: me.onUpdate,
            clear: me.onDataRefresh,
            beginupdate: me.onBeginUpdate,
            endupdate: me.onEndUpdate
        };
    },

    onBeginUpdate: function() {
        Ext.suspendLayouts();
        this.relayFn('onBeginUpdate', arguments);
        Ext.resumeLayouts(true);
    },
    
    onEndUpdate: function() {
        Ext.suspendLayouts();
        this.relayFn('onEndUpdate', arguments);
        Ext.resumeLayouts(true);
    },

    onDataRefresh: function() {
        Ext.suspendLayouts();
        this.relayFn('onDataRefresh', arguments);
        Ext.resumeLayouts(true);
    },

    onReplace: function() {
        Ext.suspendLayouts();
        this.relayFn('onReplace', arguments);
        Ext.resumeLayouts(true);
    },

    onAdd: function() {
        Ext.suspendLayouts();
        this.relayFn('onAdd', arguments);
        Ext.resumeLayouts(true);
    },

    onRemove: function() {
        Ext.suspendLayouts();
        this.relayFn('onRemove', arguments);
        Ext.resumeLayouts(true);
    },

    /**
     * Toggles ARIA actionable mode on/off
     * @param {Boolean} enabled
     * @return {Boolean} Returns `false` if the request failed.
     * @private
     */
    setActionableMode: function(enabled, position) {
        var result,
            targetView;

        if (enabled) {
            if (!position) {
                position = this.getNavigationModel().getPosition();
            }
            if (position) {
                position = position.clone();

                // Drill down to the side that we're actioning
                position.view = targetView = position.column.getView();

                // Attempt to switch the focused view to actionable.
                result = targetView.setActionableMode(enabled, position);

                // If successful, and the partner is visible, switch that too.
                if (result !== false && targetView.lockingPartner.grid.isVisible()) {
                    targetView.lockingPartner.setActionableMode(enabled, position);

                    // If the partner side refused to cooperate, the whole locking.View must not enter actionable mode
                    if (!targetView.lockingPartner.actionableMode) {
                        targetView.setActionableMode(false);
                        result = false;
                    }
                }
                return result;
            } else {
                return false;
            }
        } else {
            this.relayFn('setActionableMode', [false]);
        }
    },

    onUpdate: function() {
        Ext.suspendLayouts();
        this.relayFn('onUpdate', arguments);
        Ext.resumeLayouts(true);
    },

    refresh: function() {
        Ext.suspendLayouts();
        this.relayFn('refresh', arguments);
        Ext.resumeLayouts(true);
    },

    refreshView: function() {
        Ext.suspendLayouts();
        this.relayFn('refreshView', arguments);
        Ext.resumeLayouts(true);
    },

    getNode: function(nodeInfo) {
        // default to the normal view
        return this.normalView.getNode(nodeInfo);
    },

    getRow: function(nodeInfo) {
        // default to the normal view
        return this.normalView.getRow(nodeInfo);
    },

    getCell: function(record, column) {
        var view = this.getViewForColumn(column),
            row = view.getRow(record);
            
        return Ext.fly(row).down(column.getCellSelector());
    },

    indexOf: function(record) {
        var result = this.lockedView.indexOf(record);
        if (!result) {
            result = this.normalView.indexOf(record);
        }
        return result;
    },

    focus: function() {
        // Delegate to the view of first visible child tablepanel of the owning lockable assembly.
        var target = this.ownerGrid.down('>tablepanel:not(hidden)>tableview');

        if (target) {
            target.focus();
        }
    },

    focusRow: function(row) {
        var view,
            // Access lastFocused directly because getter nulls it if the record is no longer in view
            // and all we are interested in is the lastFocused View.
            lastFocused = this.getNavigationModel().lastFocused;
    
        view = lastFocused ? lastFocused.view : this.normalView;
        view.focusRow(row);
    },

    focusCell: function(position) {
        position.view.focusCell(position);
    },

    onRowFocus: function() {
        this.relayFn('onRowFocus', arguments);
    },

    isVisible: function(deep) {
        return this.ownerGrid.isVisible(deep);
    },

    getFocusEl: function() {
        var view,
            // Access lastFocused directly because getter nulls it if the record is no longer in view
            // and all we are interested in is the lastFocused View.
            lastFocused = this.getNavigationModel().lastFocused;
    
        view = lastFocused ? lastFocused.view : this.normalView;
        return view.getFocusEl();
    },

    // Old API. Used by tests now to test coercion of navigation from hidden column to closest visible.
    // Position.column includes all columns including hidden ones.
    getCellInclusive: function(pos, returnDom) {
        var col = pos.column,
            lockedSize = this.lockedGrid.getColumnManager().getColumns().length;
            
        // Normalize view
        if (col >= lockedSize) {
            // Make a copy so we don't mutate the passed object
            pos = Ext.apply({}, pos);
            pos.column -= lockedSize;
            return this.normalView.getCellInclusive(pos, returnDom);
        } else {
            return this.lockedView.getCellInclusive(pos, returnDom);
        }
    },

    getHeaderByCell: function(cell) {
        if (cell) {
            return this.getVisibleColumnManager().getHeaderById(cell.getAttribute('data-columnId'));
        }
        return false;
    },

    onRowSelect: function() {
        this.relayFn('onRowSelect', arguments);
    },

    onRowDeselect: function() {
        this.relayFn('onRowDeselect', arguments);
    },

    onCellSelect: function(cellContext) {
        // Pass a contextless cell descriptor to the child view
        cellContext.column.getView().onCellSelect({
            record: cellContext.record,
            column: cellContext.column
        });
    },

    onCellDeselect: function(cellContext) {
        // Pass a contextless cell descriptor to the child view
        cellContext.column.getView().onCellDeselect({
            record: cellContext.record,
            column: cellContext.column
        });
    },

    getCellByPosition: function(pos, returnDom) {
        var me = this,
            view = pos.view,
            col = pos.column;

        // Access the real Ext.view.Table for the specified Column
        if (view === me) {
            pos = new Ext.grid.CellContext(col.getView()).setPosition(pos.record, pos.column);
        }
        return view.getCellByPosition(pos, returnDom);
    },

    getRecord: function(node) {
        var result = this.lockedView.getRecord(node);
        if (!result) {
            result = this.normalView.getRecord(node);
        }
        return result;
    },
    
    scrollBy: function(){
        var normal = this.normalView;
        normal.scrollBy.apply(normal, arguments);
    },

    ensureVisible: function() {
        var normal = this.normalView;
        normal.ensureVisible.apply(normal, arguments);
    },

    disable: function() {
        this.relayFn('disable', arguments);
    },

    enable: function() {
        this.relayFn('enable', arguments);
    },

    addElListener: function() {
        this.relayFn('addElListener', arguments);
    },

    refreshNode: function(){
        this.relayFn('refreshNode', arguments);
    },

    addRowCls: function(){
        this.relayFn('addRowCls', arguments);
    },

    removeRowCls: function(){
        this.relayFn('removeRowCls', arguments);
    },
    
    destroy: function() {
        var me = this;
        
        me.rendered = false;

        // Unbind from the dataSource we bound to in constructor
        me.bindStore(null, false, 'dataSource');
        
        Ext.destroy(me.lockedViewEventRelayers, me.normalViewEventRelayers);
        me.lockedViewEventRelayers = me.normalViewEventRelayers = null;

        me.callParent();
        
        Ext.destroy(me.loadMask, me.navigationModel, me.selModel);
        
        me.lockedView.lockingPartner = me.normalView.lockingPartner = null;
        me.lockedGrid = me.lockedView = me.normalGrid = me.normalView = null;
        me.loadMask = me.navigationModel = me.selModel = me.headerCt = null;
        me.ownerGrid = me.storeListeners = null;
    }

}, function() {
    this.borrow(Ext.Component, ['up']);
    this.borrow(Ext.view.AbstractView, ['doFirstRefresh', 'applyFirstRefresh']);
    this.borrow(Ext.view.Table, ['cellSelector', 'selectedCellCls', 'selectedItemCls']);
});
