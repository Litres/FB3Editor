/**
 *
 */
Ext.define('Ext.container.DockingContainer', {

    /* Begin Definitions */

    requires: ['Ext.util.MixedCollection', 'Ext.Element' ],

    /* End Definitions */

    isDockingContainer: true,
    
    /**
     * @event dockedadd
     * Fires when any {@link Ext.Component} is added or inserted as a docked item.
     * @param {Ext.panel.Panel} this
     * @param {Ext.Component} component The component being added
     * @param {Number} index The index at which the component will be added docked items collection
     */
    
    /**
     * @event dockedremove
     * Fires when any {@link Ext.Component} is removed from the docked items.
     * @param {Ext.panel.Panel} this
     * @param {Ext.Component} component The component being removed
     */

    /**
     * @cfg {Object} defaultDockWeights
     * This object holds the default weights applied to dockedItems that have no weight. These start with a
     * weight of 1, to allow negative weights to insert before top items and are odd numbers
     * so that even weights can be used to get between different dock orders.
     *
     * To make default docking order match border layout, do this:
     *
     *      Ext.panel.Panel.prototype.defaultDockWeights = { top: 1, bottom: 3, left: 5, right: 7 };
     *
     * Changing these defaults as above or individually on this object will effect all Panels.
     * To change the defaults on a single panel, you should replace the entire object:
     *
     *      initComponent: function () {
     *          // NOTE: Don't change members of defaultDockWeights since the object is shared.
     *          this.defaultDockWeights = { top: 1, bottom: 3, left: 5, right: 7 };
     *
     *          this.callParent();
     *      }
     *
     * To change only one of the default values, you do this:
     *
     *      initComponent: function () {
     *          // NOTE: Don't change members of defaultDockWeights since the object is shared.
     *          this.defaultDockWeights = Ext.applyIf({ top: 10 }, this.defaultDockWeights);
     * 
     *          this.callParent();
     *      }
     */
    defaultDockWeights: {
        top:    { render: 1, visual: 1 },
        left:   { render: 3, visual: 5 },
        right:  { render: 5, visual: 7 },
        bottom: { render: 7, visual: 3 }
    },

    /**
     * @private
     * Values to decide which side of the body element docked items must go
     * This overides any weight. A left/top will *always* sort before a right/bottom
     * regardless of any weight value. Weights sort at either side of the "body" dividing point.
     */
    dockOrder: {
        top: -1,
        left: -1,
        right: 1,
        bottom: 1
    },

    /**
     * @private
     * Number of dock 'left' and 'right' items.
     */
    horizontalDocks: 0,

    /**
     * When set to `true`, two elements are added to the panel's element. These are the
     * `{@link #tabGuardBeforeEl}` and `{@link #tabGuardAfterEl}`.
     * @cfg {Boolean} tabGuard
     * @private
     * @since 6.0.0
     */
    tabGuard: false,

    /**
     * This element reference is generated when `{@link #tabGuard}` is `true`. This element
     * is generated after all `dockedItems` in the DOM.
     * @property {Ext.dom.Element} tabGuardAfterEl
     * @private
     * @since 6.0.0
     */

    /**
     * This element reference is generated when `{@link #tabGuard}` is `true`. This element
     * is generated before all `dockedItems` in the DOM.
     * @property {Ext.dom.Element} tabGuardBeforeEl
     * @private
     * @since 6.0.0
     */

    /**
     * @property {String/String[]/Ext.XTemplate} tabGuardTpl
     * This template is used to generate the `tabGuard` elements. It is used once per
     * element (see `{@link #tabGuardBeforeEl}` and `{@link #tabGuardAfterEl}`).
     * @private
     * @since 6.0.0
     */
    tabGuardTpl:
        '<div id="{id}-{tabGuardEl}" data-ref="{tabGuardEl}" tabIndex="0" class="' +
            Ext.baseCSSPrefix + 'tab-guard ' +
            Ext.baseCSSPrefix + 'tab-guard-{tabGuard}" ' +
        '></div>',

    /**
     * Adds docked item(s) to the container.
     *
     * @param {Object/Object[]} items The Component or array of components to add. The components
     * must include a 'dock' parameter on each component to indicate where it should be docked
     * ('top', 'right', 'bottom', 'left').
     * @param {Number} [pos] The index at which the Component will be added
     * @return {Ext.Component[]} The added components.
     */
    addDocked : function(items, pos) {
        var me = this,
            rendered = me.rendered,
            i = 0,
            dockedItems = me.dockedItems,
            lastIndex = dockedItems.getCount(),
            index, instanced,
            item, length;

        items = me.prepareItems(items);
        length = items.length;

        if (rendered) {
            Ext.suspendLayouts();
        }

        if (pos === undefined) {
            pos = lastIndex;
        } else {
            pos = Math.min(pos, lastIndex);
        }

        for (; i < length; i++) {
            item = items[i];
            item.dock = item.dock || 'top';
            if (item.dock === 'left' || item.dock === 'right') {
                me.horizontalDocks++;
            }

            index = pos + i;
            dockedItems.insert(index, item);
            
            instanced = !!item.instancedCmp;
            delete item.instancedCmp;
            item.onAdded(me, index, instanced);
            delete item.$initParent;
            if (me.onDockedAdd !== Ext.emptyFn) {
                me.onDockedAdd(item);
            }
            if (me.hasListeners.dockedadd) {
                me.fireEvent('dockedadd', me, item, index);
            }
        }

        
        if (me.rendered) {
            me.updateLayout();
            Ext.resumeLayouts(true);
        }
        return items;
    },

    destroyDockedItems: function() {
        var dockedItems = this.dockedItems,
            c;

        if (dockedItems) {
            while ((c = dockedItems.first())) {
                this.removeDocked(c, true);
            }
        }
    },

    doRenderDockedItems: function (out, renderData, after) {
        // Careful! This method is bolted on to the frameTpl and renderTpl so all we get for
        // context is the renderData! The "this" pointer is either the frameTpl or the
        // renderTpl instance!

        // Due to framing, we will be called in two different ways: in the frameTpl or in
        // the renderTpl. The frameTpl version enters via doRenderFramingDockedItems which
        // sets "$skipDockedItems" on the renderTpl's renderData.
        //
        var me = renderData.$comp,
            layout = me.componentLayout,
            tabGuard = me.tabGuard && me.getTpl('tabGuardTpl'),
            items, tree;

        if (layout.getDockedItems && !renderData.$skipDockedItems) {
            if (tabGuard && !after) {
                renderData.tabGuard = 'before';
                me.addChildEl(renderData.tabGuardEl = 'tabGuardBeforeEl');

                tabGuard.applyOut(renderData, out);
            }

            items = layout.getDockedItems('render', !after);
            tree = items && layout.getItemsRenderTree(items);

            if (tree) {
                Ext.DomHelper.generateMarkup(tree, out);
            }

            if (tabGuard && after) {
                renderData.tabGuard = 'after';
                me.addChildEl(renderData.tabGuardEl = 'tabGuardAfterEl');

                tabGuard.applyOut(renderData, out);
            }
        }
    },

    /**
     * Finds a docked component by id, itemId or position. Also see {@link #getDockedItems}
     * @param {String/Number} comp The id, itemId or position of the docked component (see {@link Ext.container.Container#getComponent getComponent} for details)
     * @return {Ext.Component} The docked component (if found)
     */
    getDockedComponent: function(comp) {
        if (Ext.isObject(comp)) {
            comp = comp.getItemId();
        }
        return this.dockedItems.get(comp);
    },

    /**
     * Retrieves an array of all currently docked Components.
     *
     * For example to find a toolbar that has been docked at top:
     *
     *     panel.getDockedItems('toolbar[dock="top"]');
     *
     * @param {String} selector A {@link Ext.ComponentQuery ComponentQuery} selector string to filter the returned items.
     * @param {Boolean} beforeBody An optional flag to limit the set of items to only those
     *  before the body (true) or after the body (false). All components are returned by
     *  default.
     * @return {Ext.Component[]} The array of docked components meeting the specified criteria.
     */
    getDockedItems : function(selector, beforeBody) {
        var dockedItems = this.getComponentLayout().getDockedItems('render', beforeBody);

        if (selector && dockedItems.length) {
            dockedItems = Ext.ComponentQuery.query(selector, dockedItems);
        }

        return dockedItems;
    },

    getDockingRefItems: function(deep, containerItems) {
        // deep fetches the docked items and their descendants using '*' and then '* *'
        var selector = deep && '*,* *',
            // start with only the top/left docked items (and maybe their children)
            dockedItems = this.getDockedItems(selector, true),
            items;

        // push container items (and maybe their children) after top/left docked items:
        dockedItems.push.apply(dockedItems, containerItems);

        // push right/bottom docked items (and maybe their children) after container items:
        items = this.getDockedItems(selector, false);
        dockedItems.push.apply(dockedItems, items);

        return dockedItems;
    },

    initDockingItems: function() {
        var me = this,
            items = me.dockedItems;

        if (!items || !items.isMixedCollection) {
            me.dockedItems = new Ext.util.ItemCollection();
            if (items) {
                me.addDocked(items);
            }
        }
    },

    /**
     * Inserts docked item(s) to the panel at the indicated position.
     * @param {Number} pos The index at which the Component will be inserted
     * @param {Object/Object[]} items The Component or array of components to add. The components
     * must include a 'dock' paramater on each component to indicate where it should be docked ('top', 'right',
     * 'bottom', 'left').
     */
    insertDocked : function(pos, items) {
        this.addDocked(items, pos);
    },

    // Placeholder empty functions
    /**
     * @method
     * Invoked after a docked item is added to the Panel.
     * @param {Ext.Component} component
     * @template
     * @protected
     */
    onDockedAdd : Ext.emptyFn,
    /**
     * @method
     * Invoked after a docked item is removed from the Panel.
     * @param {Ext.Component} component
     * @template
     * @protected
     */
    onDockedRemove : Ext.emptyFn,

    /**
     * Removes the docked item from the panel.
     * @param {Ext.Component} item The Component to remove.
     * @param {Boolean} autoDestroy (optional) Destroy the component after removal.
     */
    removeDocked: function(item, autoDestroy) {
        var me = this,
            layout,
            hasLayout;

        autoDestroy = autoDestroy === true || (autoDestroy !== false && me.autoDestroy);
        if (!me.dockedItems.contains(item)) {
            return item;
        }
        if (item.dock === 'left' || item.dock === 'right') {
            me.horizontalDocks--;
        }

        layout = me.componentLayout;
        hasLayout = layout && me.rendered;

        if (hasLayout) {
            layout.onRemove(item);
        }

        me.dockedItems.remove(item);
        // destroying flag is true if the removal is taking place as part of destruction, OR if removal is intended to *cause* destruction
        item.onRemoved(item.destroying || autoDestroy);
        me.onDockedRemove(item);

        if (autoDestroy) {
            item.destroy();
        } else if (hasLayout) {
            // not destroying, make any layout related removals
            layout.afterRemove(item);
        }
        
        if (me.hasListeners.dockedremove) {
            me.fireEvent('dockedremove', me, item);
        }

        if (!me.destroying) {
            me.updateLayout();
        }

        return item;
    },

    /**
     * Moves a docked item to a different side.
     * @param {Ext.Component} item
     * @param {'top'/'right'/'bottom'/'left'} side
     * @private
     */
    moveDocked: function(item, side) {
        var me = this;

        if (me.rendered) {
            Ext.suspendLayouts();
        }

        me.removeDocked(item, false);
        item.dock = side;
        me.addDocked(item);

        if (me.rendered) {
            if (item.frame) {
                // temporarily append the item to the detached body while updating framing
                // elements.  This is so the framing els won't get detected as garbage
                // by element.getById
                Ext.getDetachedBody().appendChild(item.el);
                item.updateFrame();
            }
            Ext.resumeLayouts(true);
        }
    },

    setupDockingRenderTpl: function (renderTpl) {
        renderTpl.renderDockedItems = this.doRenderDockedItems;
    }
});
