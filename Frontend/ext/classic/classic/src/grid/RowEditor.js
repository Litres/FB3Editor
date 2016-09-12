// Currently has the following issues:
// - Does not handle postEditValue
// - Fields without editors need to sync with their values in Store
// - starting to edit another record while already editing and dirty should probably prevent it
// - aggregating validation messages
// - tabIndex is not managed bc we leave elements in dom, and simply move via positioning
// - layout issues when changing sizes/width while hidden (layout bug)

/**
 * Internal utility class used to provide row editing functionality. For developers, they should use
 * the RowEditing plugin to use this functionality with a grid.
 *
 * @private
 */
Ext.define('Ext.grid.RowEditor', {
    extend: 'Ext.form.Panel',
    alias: 'widget.roweditor',
    requires: [
        'Ext.tip.ToolTip',
        'Ext.util.KeyNav',
        'Ext.grid.RowEditorButtons'
    ],

    //<locale>
    saveBtnText  : 'Update',
    //</locale>
    //<locale>
    cancelBtnText: 'Cancel',
    //</locale>
    //<locale>
    errorsText: 'Errors',
    //</locale>
    //<locale>
    dirtyText: 'You need to commit or cancel your changes',
    //</locale>

    lastScrollLeft: 0,
    lastScrollTop: 0,

    border: false,

    _wrapCls: Ext.baseCSSPrefix + 'grid-row-editor-wrap',

    errorCls: Ext.baseCSSPrefix + 'grid-row-editor-errors-item',
    buttonUI: 'default',

    // Change the hideMode to offsets so that we get accurate measurements when
    // the roweditor is hidden for laying out things like a TriggerField.
    hideMode: 'offsets',

    _cachedNode : false,

    initComponent: function() {
        var me = this,
            grid = me.editingPlugin.grid,
            Container = Ext.container.Container,
            form, normalCt, lockedCt;

        me.cls = Ext.baseCSSPrefix + 'grid-editor ' + Ext.baseCSSPrefix + 'grid-row-editor';

        me.layout = {
            type: 'hbox',
            align: 'middle'
        };

        me.lockable = grid.lockable;

        // Create field containing structure for when editing a lockable grid.
        if (me.lockable) {
            me.items = [
                // Locked columns container shrinkwraps the fields
                lockedCt = me.lockedColumnContainer = new Container({
                    id: grid.id + '-locked-editor-cells',
                    scrollable: {
                        x: false,
                        y: false
                    },
                    layout: {
                        type: 'hbox',
                        align: 'middle'
                    },
                    // Locked grid has a border, we must be exactly the same width
                    margin: '0 1 0 0'
                }),

                // Normal columns container flexes the remaining RowEditor width
                normalCt = me.normalColumnContainer = new Container({
                    // not user scrollable, but needs a Scroller instance for syncing with view
                    scrollable: {
                        x: false,
                        y: false
                    },
                    flex: 1,
                    id: grid.id + '-normal-editor-cells',
                    layout: {
                        type: 'hbox',
                        align: 'middle'
                    }
                })
            ];

            // keep horizontal position of fields in sync with view's horizontal scroll position
            lockedCt.getScrollable().addPartner(grid.lockedGrid.view.getScrollable(), 'x');
            normalCt.getScrollable().addPartner(grid.normalGrid.view.getScrollable(), 'x');
        } else {
            // initialize a scroller instance for maintaining horizontal scroll position
            me.setScrollable({
                x: false,
                y: false
            });

            // keep horizontal position of fields in sync with view's horizontal scroll position
            me.getScrollable().addPartner(grid.view.getScrollable(), 'x');

            me.lockedColumnContainer = me.normalColumnContainer = me;
        }

        me.callParent();

        if (me.fields) {
            me.addFieldsForColumn(me.fields, true);
            me.insertColumnEditor(me.fields);
            delete me.fields;
        }

        me.mon(Ext.GlobalEvents, {
            scope: me,
            show: me.repositionIfVisible
        });

        form = me.getForm();
        form.trackResetOnLoad = true;
        form.on('validitychange', me.onValidityChange, me);
        form.on('errorchange', me.onErrorChange, me);
    },

    //
    // Grid listener added when this is rendered.
    // Keep our containing element sized correctly
    //
    onGridResize: function() {
        var me = this,
            clientWidth = me.getClientWidth(),
            grid = me.editingPlugin.grid,
            gridBody = grid.body,
            btns = me.getFloatingButtons();

        me.wrapEl.setLocalX(gridBody.getOffsetsTo(grid)[0] + gridBody.getBorderWidth('l') - grid.el.getBorderWidth('l'));
        
        me.setWidth(clientWidth);
        btns.setLocalX((clientWidth - btns.getWidth()) / 2);
        if (me.lockable) {
            me.lockedColumnContainer.setWidth(grid.lockedGrid.view.el.dom.clientWidth);
        }
    },
    
    syncAllFieldWidths: function() {
        var me = this,
            editors = me.query('[isEditorComponent]'),
            len = editors.length,
            column, i;

        // In a locked grid, a RowEditor uses 2 inner containers, so need to use CQ to retrieve
        // configured editors which were stamped with the isEditorComponent property in Editing.createColumnField
        for (i = 0; i < len; ++i) {
            column = editors[i].column;
            if (column.isVisible()) {
                me.onColumnShow(column);
            }
        }    
    },

    syncFieldWidth: function(column) {
        var field = column.getEditor(),
            width;

        field._marginWidth = (field._marginWidth || field.el.getMargin('lr'));
        width = column.getWidth() - field._marginWidth;
        field.setWidth(width);
        if (field.xtype === 'displayfield') {
            // displayfield must have the width set on the inputEl for ellipsis to work
            field.inputWidth = width;
        }
    },

    onValidityChange: function(form, valid) {
        this.updateButton(valid);
    },

    onErrorChange: function() {
        var me = this,
            valid;

        if (me.errorSummary && me.isVisible()) {
            valid = me.getForm().isValid();
            me[valid ? 'hideToolTip' : 'showToolTip']();
        }
    },

    updateButton: function(valid){
        var buttons = this.floatingButtons; 
        if (buttons) {
            buttons.child('#update').setDisabled(!valid);
        } else {
            // set flag so we can disabled when created if needed
            this.updateButtonDisabled = !valid;
        }
    },

    afterRender: function() {
        var me = this,
            plugin = me.editingPlugin,
            grid = plugin.grid,
            view = grid.lockable ? grid.normalGrid.view : grid.view;

        me.callParent(arguments);

        // The scrollingViewEl is the TableView which scrolls
        me.scrollingView = view;
        me.scrollingViewEl = view.el;
        view.on('scroll', me.onViewScroll, me);

        // Prevent from bubbling click events to the grid view
        me.mon(me.el, {
            click: Ext.emptyFn,
            stopPropagation: true
        });

        // Ensure that the editor width always matches the total header width
        me.mon(grid, 'resize', me.onGridResize, me);

        if (me.lockable) {
            grid.lockedGrid.view.on('resize', 'onGridResize', me);
        }

        me.el.swallowEvent([
            'keypress',
            'keydown'
        ]);

        me.initKeyNav();

        me.mon(plugin.view, {
            beforerefresh: me.onBeforeViewRefresh,
            refresh: me.onViewRefresh,
            itemremove: me.onViewItemRemove,
            scope: me
        });

        // Prevent trying to reposition while we set everything up
        me.preventReposition = true;
        me.syncAllFieldWidths();
        delete me.preventReposition;    
    },

    initKeyNav: function() {
        var me = this,
            plugin = me.editingPlugin;

        me.keyNav = new Ext.util.KeyNav(me.el, {
            tab: {
                fn: me.onFieldTab,
                scope: me
            },
            enter: plugin.onEnterKey,
            esc: plugin.onEscKey,
            scope: plugin
        });
    },

    onBeforeViewRefresh: function(view) {
        var me = this,
            viewDom = view.el.dom;

        if (me.el.dom.parentNode === viewDom) {
            viewDom.removeChild(me.el.dom);
        }
    },

    onViewRefresh: function(view) {
        var me = this,
            context = me.context,
            row;

        // Ignore refresh caused by the completion process
        if (!me.completing) {
            // Recover our row node after a view refresh
            if (context && (row = view.getRow(context.record))) {
                context.row = row;
                me.reposition();
                if (me.tooltip && me.tooltip.isVisible()) {
                    me.tooltip.setTarget(context.row);
                }
            } else {
                me.editingPlugin.cancelEdit();
            }
        }
    },

    onViewItemRemove: function(records, index, items, view) {
        var me = this,
            grid,
            store,
            gridView,
            context,
            record,
            plugin;
        // If the itemremove is due to refreshing, ignore it.
        // If the row for the current context record has gone after the
        // refresh, editing will be canceled there. See onViewRefresh above.
        if (!view.refreshing) {
            plugin = me.editingPlugin;
            grid = plugin.grid;
            store = grid.getStore();
            gridView = me.editingPlugin.view;
            context = this.context;
            // Checking if this is a deleted record or an element being derendered
            if (store.getById(me.getRecord().getId()) && !me._cachedNode) {
                // if this is an items being derendered and is also being edited
                // the flag _cachedNode will be set to true and an itemadd event will
                // be added to monitor when the editor should be reactivated.
                if (plugin.editing) {
                    this._cachedNode = true;
                    this.mon(gridView, {
                        itemadd: me.onViewItemAdd,
                        scope: me
                    });
                }
            } else if (!me._cachedNode) {
                this.activeField = null;
                this.editingPlugin.cancelEdit();
            }
        }
    },

    onViewItemAdd: function(records, index, items, view) {
        var me = this,
            gridView,
            plugin = me.editingPlugin;
        
        // Checks if BufferedRenderer is adding the items 
        // if there was an item being edited, and it belongs to this batch
        // then update the row and node associations.
        if (me._cachedNode && plugin.editing) {
            gridView = plugin.view;
            // Checks if there is an array of records being added
            // and if within this array, any record matches the one being edited before
            // if it does, the editor context is updated, the itemadd
            // event listener is removed and _cachedNode is cleared.

            for (var i=0;i<records.length;i++){
                if (records[i] === me.context.record){
                    me.context.node = items[i];
                    me.context.row = gridView.getRow(items[i]);
                    me.context.cell = gridView.getCellByPosition(me.context, true);
                    me.clearCache();
                    break;
                }
            }
        }
    },

    onViewScroll: function() {
        var me = this,
            viewEl = me.editingPlugin.view.el,
            scrollingView = me.scrollingView,
            scrollTop  = scrollingView.getScrollY(),
            scrollLeft = scrollingView.getScrollX(),
            scrollTopChanged = scrollTop !== me.lastScrollTop,
            row;

        me.lastScrollTop  = scrollTop;
        me.lastScrollLeft = scrollLeft;
        if (me.isVisible()) {
            row = Ext.getDom(me.context.row);

            // Only reposition if the row is in the DOM (buffered rendering may mean the context row is not there)
            if (row && viewEl.contains(row)) {
                // This makes sure the Editor is repositioned if it was scrolled out of buffer range
                if(me.getLocalY()) {
                    me.setLocalY(0);
                }

                if (scrollTopChanged) {
                    // The row element in the context may be stale due to buffered rendering removing out-of-view rows, then re-inserting newly rendered ones
                    me.context.row = row;
                    me.reposition(null, true);
                    if ((me.tooltip && me.tooltip.isVisible()) || me.hiddenTip) {
                        me.repositionTip();
                    }
                    me.syncEditorClip();
                }
            }
            // If row is NOT in the DOM, ensure the editor is out of sight
            else {
                me.setLocalY(-400);
            }
        }
    },

    onColumnResize: function(column, width) {
        var me = this;

        if (me.rendered && !me.editingPlugin.reconfiguring) {
            // Need to ensure our lockable/normal horizontal scrollrange is set
            me.onGridResize();
            me.onViewScroll();
            if (!column.isGroupHeader) {
                me.syncFieldWidth(column);
                me.repositionIfVisible();
            }
        }
    },

    onColumnHide: function(column) {
        if (!this.editingPlugin.reconfiguring && !column.isGroupHeader) {
            column.getEditor().hide();
            this.repositionIfVisible();
        }
    },

    onColumnShow: function(column) {
        var me = this;

        if (me.rendered && !me.editingPlugin.reconfiguring && !column.isGroupHeader && column.getEditor) {
            column.getEditor().show();
            me.syncFieldWidth(column);
            if (!me.preventReposition) {
                this.repositionIfVisible();
            }
        }
    },

    onColumnMove: function(column, fromIdx, toIdx) {
        var me = this,
            locked = column.isLocked(),
            fieldContainer = locked ? me.lockedColumnContainer : me.normalColumnContainer,
            columns, i, len, after, offset;

        // If moving a group, move each leaf header
        if (column.isGroupHeader) {
            Ext.suspendLayouts();
            after = toIdx > fromIdx;
            offset = after ? 1 : 0;
            columns = column.getGridColumns();
            for (i = 0, len = columns.length; i < len; ++i) {    
                column = columns[i];
                toIdx = column.getIndex();
                if (after) {
                    ++offset;
                }
                me.setColumnEditor(column, toIdx + offset, fieldContainer);
            }
            Ext.resumeLayouts(true);
        } else {
            me.setColumnEditor(column, column.getIndex(), fieldContainer);
        }
    },

    setColumnEditor: function(column, idx, fieldContainer) {
        this.addFieldsForColumn(column);
        fieldContainer.insert(idx, column.getEditor());
    },

    onColumnAdd: function(column) {

        // If a column header added, process its leaves
        if (column.isGroupHeader) {
            column = column.getGridColumns();
        }
        //this.preventReposition = true;
        this.addFieldsForColumn(column);
        this.insertColumnEditor(column);
        this.preventReposition = false;
    },

    insertColumnEditor: function(column) {
        var me = this,
            field,
            fieldContainer,
            len, i;

        if (Ext.isArray(column)) {
            for (i = 0, len = column.length; i < len; i++) {
                me.insertColumnEditor(column[i]);
            }
            return;
        }

        if (!column.getEditor) {
            return;
        }

        fieldContainer = column.isLocked() ? me.lockedColumnContainer : me.normalColumnContainer;

        // Insert the column's field into the editor panel.
        fieldContainer.insert(column.getIndex(), field = column.getEditor());

        // Ensure the view scrolls the field into view on focus
        field.on('focus', me.onFieldFocus, me);

        me.needsSyncFieldWidths = true;
    },

    onFieldFocus: function(field) {
        // Cache the active field so that we can restore focus into its cell onHide

        // Makes the cursor always be placed at the end of the textfield
        // when the field is being edited for the first time (IE only).
        if(Ext.isIE) {
            field.inputEl.dom.value = field.inputEl.dom.value;
        }
        this.activeField = field;
        this.context.setColumn(field.column);

        // skipFocusScroll should be true right after the editor has been started
        if(!this.skipFocusScroll) {
            field.column.getView().getScrollable().scrollIntoView(field.el);
        } else {
            this.skipFocusScroll = null;
        }
    },

    onFieldTab: function(e) {
        var me = this,
            activeField = me.activeField,
            rowIdx = me.context.rowIdx,
            forwards = !e.shiftKey,
            target = activeField[forwards ? 'nextNode' : 'previousNode'](':focusable');

        // No field to TAB to, navigate forwards or backwards
        if (!target || !target.isDescendant(me)) {
            // Tabbing out of a dirty editor - wrap to the update button
            if (me.isDirty()) {
                e.preventDefault();
                me.floatingButtons.child('#update').focus();
            } else {
                // Editor is clean - navigate to next or previous row
                rowIdx = rowIdx + (forwards ? 1 : -1);
                if (rowIdx >= 0 && rowIdx <= me.view.dataSource.getCount()) {

                    if (forwards) {
                        target = me.down(':focusable:not([isButton]):first');

                        // If going back to the first column, scroll back to field.
                        // If we're in a locking view, this has to be done programatically to avoid jarring
                        // when navigating from the locked back into the normal side
                        activeField.column.getView().getScrollable().scrollIntoView(activeField.ownerCt.child(':focusable').el);
                    } else {
                        target = me.down(':focusable:not([isButton]):last');
                    }
                    me.editingPlugin.startEdit(rowIdx, target.column);
                }
            }
        }
    },

    destroyColumnEditor: function(column) {
        var field;
        if (column.hasEditor() && (field = column.getEditor())) {
            field.destroy();
        }
    },

    getFloatingButtons: function() {
        var me = this,
            btns = me.floatingButtons;

        if (!btns) {
            me.floatingButtons = btns = new Ext.grid.RowEditorButtons({
                ownerCmp: me,
                rowEditor: me
            });
        }
        return btns;
    },

    repositionIfVisible: function(c) {
        var me = this,
            view = me.view;

        // If we're showing ourselves, jump out
        // If the component we're showing doesn't contain the view
        if (c && (c === me || !c.el.isAncestor(view.el))) {
            return;
        }

        if (me.isVisible() && view.isVisible(true)) {
            me.reposition();
        }
    },

    isLayoutChild: function(ownerCandidate) {
        // RowEditor is not a floating component, but won't be laid out by the grid
        return false;
    },

    getRefOwner: function() {
        return this.editingPlugin.grid;
    },

    getRefItems: function(deep) {
        var me = this,
            result;

        if (me.lockable) {
            // refItems must include ALL children. Must include the two containers
            // because we don't know what is being searched for.
            result = [me.lockedColumnContainer];
            result.push.apply(result, me.lockedColumnContainer.getRefItems(deep));
            result.push(me.normalColumnContainer);
            result.push.apply(result, me.normalColumnContainer.getRefItems(deep));
        } else {
            result = me.callParent(arguments);
        }
        result.push.apply(result, me.getFloatingButtons().getRefItems(deep));
        return result;
    },

    reposition: function(animateConfig, fromScrollHandler) {
        var me = this,
            context = me.context,
            row = context && context.row,
            wrapEl = me.wrapEl,
            rowTop,
            localY,
            deltaY,
            afterPosition;

        // Position this editor if the context row is rendered (buffered rendering may mean that it's not in the DOM at all)
        if (row && Ext.isElement(row)) {

            deltaY = me.syncButtonPosition(me.getScrollDelta());

            rowTop = me.calculateLocalRowTop(row);
            localY = me.calculateEditorTop(rowTop);

            // If not being called from scroll handler...
            // If the editor's top will end up above the fold
            // or the bottom will end up below the fold,
            // organize an afterPosition handler which will bring it into view and focus the correct input field
            if (!fromScrollHandler) {
                afterPosition = function() {
                    if (deltaY) {
                        me.scrollingViewEl.scrollBy(0, deltaY, true);
                    }
                    me.focusColumnField(context.column);
                };
            }

            me.syncEditorClip();

            // Get the y position of the row relative to its top-most static parent.
            // offsetTop will be relative to the table, and is incorrect
            // when mixed with certain grid features (e.g., grouping).
            if (animateConfig) {
                wrapEl.animate(Ext.applyIf({
                    to: {
                        top: localY
                    },
                    duration: animateConfig.duration || 125,
                    callback: afterPosition
                }, animateConfig));
            } else {
                wrapEl.setLocalY(localY);
                if (afterPosition) {
                    afterPosition();
                }
            }
        }
    },

    /**
     * @private
     * Returns the scroll delta required to scroll the context row into view in order to make
     * the whole of this editor visible.
     * @return {Number} the scroll delta. Zero if scrolling is not required.
     */
    getScrollDelta: function() {
        var me = this,
            scrollingViewDom = me.scrollingViewEl.dom,
            context = me.context,
            body = me.body,
            deltaY = 0;

        if (context) {
            deltaY = Ext.fly(context.row).getOffsetsTo(scrollingViewDom)[1];
            if (deltaY < 0) {
                deltaY -= body.getBorderPadding().beforeY;
            }
            else if (deltaY > 0) {
                deltaY = Math.max(deltaY + me.getHeight() + me.floatingButtons.getHeight() -
                    scrollingViewDom.clientHeight - body.getBorderWidth('b'), 0);
                if (deltaY > 0) {
                    deltaY -= body.getBorderPadding().afterY;
                }
            }
        }
        return deltaY;
    },

    //
    // Calculates the top pixel position of the passed row within the view's scroll space.
    // So in a large, scrolled grid, this could be several thousand pixels.
    //
    calculateLocalRowTop: function(row) {
        var grid = this.editingPlugin.grid;
        return Ext.fly(row).getOffsetsTo(grid)[1] - grid.el.getBorderWidth('t') + this.lastScrollTop;
    },

    // Given the top pixel position of a row in the scroll space,
    // calculate the editor top position in the view's encapsulating element.
    // This will only ever be in the visible range of the view's element.
    calculateEditorTop: function(rowTop) {
        return rowTop - this.body.getBorderPadding().beforeY - this.lastScrollTop;
    },

    getClientWidth: function() {
        var me = this,
            grid = me.editingPlugin.grid,
            result;

        if (me.lockable) {
            result =
               grid.lockedGrid.getWidth() +
               grid.normalGrid.view.el.dom.clientWidth;
        }
        else {
            result = grid.view.el.dom.clientWidth;
        }
        return result;
    },

    getEditor: function(fieldInfo) {
        var me = this;

        if (Ext.isNumber(fieldInfo)) {
            // In a locked grid, a RowEditor uses 2 inner containers, so need to use CQ to retrieve
            // configured editors which were stamped with the isEditorComponent property in Editing.createColumnField
            return me.query('[isEditorComponent]')[fieldInfo];
        } else if (fieldInfo.isHeader && !fieldInfo.isGroupHeader) {
            return fieldInfo.getEditor();
        }
    },    

    addFieldsForColumn: function(column, initial) {
        var me = this,
            i,
            length, field;

        if (Ext.isArray(column)) {
            for (i = 0, length = column.length; i < length; i++) {
                me.addFieldsForColumn(column[i], initial);
            }
            return;
        }

        if (column.getEditor) {

            // Get a default display field if necessary
            field = column.getEditor(null, me.getDefaultFieldCfg());

            if (column.align === 'right') {
                field.fieldStyle = 'text-align:right';
            }

            if (column.xtype === 'actioncolumn') {
                field.fieldCls += ' ' + Ext.baseCSSPrefix + 'form-action-col-field';
            }

            if (me.isVisible() && me.context) {
                if (field.is('displayfield')) {
                    me.renderColumnData(field, me.context.record, column);
                } else {
                    field.suspendEvents();
                    field.setValue(me.context.record.get(column.dataIndex));
                    field.resumeEvents();
                }
            }
            if (column.hidden) {
                me.onColumnHide(column);
            } else if (column.rendered && !initial) {
                // Setting after initial render
                me.onColumnShow(column);
            }
        }
    },
    
    getDefaultFieldCfg: function() {
        return {
            xtype: 'displayfield',
            // Override Field's implementation so that the default display fields will not return values. This is done because
            // the display field will pick up column renderers from the grid.
            getModelData: function() {
                return null;
            }
        };
    },

    loadRecord: function(record) {
        var me     = this,
            form   = me.getForm(),
            fields = form.getFields(),
            items  = fields.items,
            length = items.length,
            i, displayFields,
            isValid, item;

        // temporarily suspend events on form fields before loading record to prevent the fields' change events from firing
        for (i = 0; i < length; i++) {
            item = items[i];
            item.suspendEvents();
            item.resetToInitialValue();
        }

        form.loadRecord(record);

        for (i = 0; i < length; i++) {
            items[i].resumeEvents();
        }

        // Because we suspend the events, none of the field events will get propagated to
        // the form, so the valid state won't be correct.
        if (form.hasInvalidField() === form.wasValid) {
            delete form.wasValid;
        }
        isValid = form.isValid();
        if (me.errorSummary) {
            if (isValid) {
                me.hideToolTip();
            } else {
                me.showToolTip();
            }
        }
        me.updateButton(isValid);

        // render display fields so they honor the column renderer/template
        displayFields = me.query('>displayfield');
        length = displayFields.length;

        for (i = 0; i < length; i++) {
            me.renderColumnData(displayFields[i], record);
        }
    },

    renderColumnData: function(field, record, activeColumn) {
        var me = this,
            grid = me.editingPlugin.grid,
            headerCt = grid.headerCt,
            view = me.scrollingView,
            store = view.dataSource,
            column = activeColumn || field.column,
            value = record.get(column.dataIndex),
            renderer = column.editRenderer || column.renderer,
            metaData,
            rowIdx,
            colIdx,
            scope = (column.usingDefaultRenderer && !column.scope) ? column : column.scope;

        // honor our column's renderer (TemplateHeader sets renderer for us!)
        if (renderer) {
            metaData = { tdCls: '', style: '' };
            rowIdx = store.indexOf(record);
            colIdx = headerCt.getHeaderIndex(column);

            value = renderer.call(
                scope || headerCt.ownerCt,
                value,
                metaData,
                record,
                rowIdx,
                colIdx,
                store,
                view
            );
        }

        field.setRawValue(value);
    },

    beforeEdit: function() {
        var me = this,
            scrollDelta;

        if (me.isVisible() && me.errorSummary && !me.autoCancel && me.isDirty()) {

            // Scroll the visible RowEditor that is in error state back into view
            scrollDelta = me.getScrollDelta();
            if (scrollDelta) {
                me.scrollingViewEl.scrollBy(0, scrollDelta, true);
            }
            me.showToolTip();
            return false;
        }
    },

    /**
     * Start editing the specified grid at the specified position.
     * @param {Ext.data.Model} record The Store data record which backs the row to be edited.
     * @param {Ext.data.Model} columnHeader The Column object defining the column to be focused
     */
    startEdit: function(record, columnHeader) {
        var me = this,
            editingPlugin = me.editingPlugin,
            grid = editingPlugin.grid,
            context = me.context = editingPlugin.context,
            alreadyVisible = me.isVisible(),
            wrapEl = me.wrapEl;

        if (me._cachedNode) {
            me.clearCache();
        }
        // Ensure that the render operation does not lay out
        // The show call will update the layout
        Ext.suspendLayouts();

        if (!me.rendered) {
            me.width = me.getClientWidth();
            me.render(grid.el, grid.el.dom.firstChild);
            // The wrapEl is a container for the editor and buttons.  We use a wrap el
            // (instead of rendering the buttons inside the editor) so that the editor and
            // buttons can be clipped separately when overflowing.
            // See https://sencha.jira.com/browse/EXTJS-13851
            wrapEl = me.wrapEl = me.el.wrap();
            // Change the visibilityMode to offsets so that we get accurate measurements
            // when the roweditor is hidden for laying out things like a TriggerField.
            wrapEl.setVisibilityMode(3);

            wrapEl.addCls(me._wrapCls);
            me.getFloatingButtons().render(wrapEl);
            // On first show we need to ensure that we have the scroll positions cached
            me.onViewScroll();
        }

        me.setLocalY(0);
        
        // Select at the clicked position.
        context.grid.getSelectionModel().selectByPosition({
            row: record,
            column: columnHeader
        });

        // Make sure the container el is correctly sized.
        me.onGridResize();

        // Reload the record data
        me.loadRecord(record);

        // Layout the form with the new content if we are already visible.
        // Otherwise, just allow resumption, and the show will update the layout.
        Ext.resumeLayouts(alreadyVisible);
        if (alreadyVisible) {
            me.reposition(true);
        } else {
            // this will prevent the onFieldFocus method from calling
            // scrollIntoView right after startEdit as this will be
            // handled by the Editing plugin.
            me.skipFocusScroll = true;
            
            me.show();
        }
    },

    // determines the amount by which the row editor will overflow, and flips the buttons
    // to the top of the editor if the required scroll amount is greater than the available
    // scroll space. Returns the scrollDelta required to scroll the editor into view after
    // adjusting the button position.
    syncButtonPosition: function(scrollDelta) {
        var me = this,
            floatingButtons = me.getFloatingButtons(),
            scrollingView = me.scrollingView,
            overflow = me.getScrollDelta() - (scrollingView.getScrollable().getSize().y -
                scrollingView.getScrollY() - me.scrollingViewEl.dom.clientHeight);

        if (overflow > 0) {
            if (!me._buttonsOnTop) {
                floatingButtons.setButtonPosition('top');
                me._buttonsOnTop = true;
            }
            scrollDelta = 0;
        } else if (me._buttonsOnTop !== false) {
            floatingButtons.setButtonPosition('bottom');
            me._buttonsOnTop = false;
        }
        // Ensure button Y position is synced with Editor height even if button
        // orientation doesn't change
        else {
            floatingButtons.setButtonPosition(floatingButtons.position);
        }

        return scrollDelta;
    },

    // since the editor is rendered to the grid el, it must be clipped when scrolled
    // outside of the grid view area so that it does not overlap the scrollbar or docked items
    // Since safari's clip implementation does not accept negative values we cannot clip
    // both buttons and editor by setting clip on a single element, because it will result
    // in the buttons being hidden when they are positioned above the editor.
    // See https://sencha.jira.com/browse/EXTJS-13851
    // To work around this we render the buttons and editor to a wrapping element and clip
    // them separately.
    syncEditorClip: function() {
        var me = this,
            overflow = me.getScrollDelta(),
            el = me.el,
            floatingButtons = me.floatingButtons,
            btnEl = floatingButtons.el,
            max = Math.max,
            body, btnHeight, editorHeight;

        if (overflow) {
            // The editor is overflowing outside of the view area, either above or below
            me.isOverflowing = true;
            body = me.body;
            btnHeight = floatingButtons.getHeight();
            editorHeight = me.getHeight();

            max = Math.max;

            if (overflow > 0) {
                // editor is overflowing the bottom of the view
                if (me._buttonsOnTop) {
                    overflow -= (btnHeight - body.getBorderWidth('b'));
                    me.clipBottom(el, max(editorHeight - overflow), 0);
                    overflow -= (editorHeight - body.getBorderWidth('t'));
                    if (overflow > 0) {
                        me.clipBottom(btnEl, max(btnHeight - overflow, 0));
                    } else {
                        me.clearClip(btnEl);
                    }
                } else {
                    me.clipBottom(btnEl, max(btnHeight - overflow, 0));
                    overflow -= (btnHeight - body.getBorderWidth('b'));
                    if (overflow > 0) {
                        me.clipBottom(el, max(editorHeight - overflow, 0));
                    } else {
                        me.clearClip(el);
                    }
                }
            } else if (overflow < 0) {
                // editor is overflowing the top of the view
                overflow = Math.abs(overflow);
                me.clipTop(el, overflow);


                overflow -= (editorHeight - body.getBorderWidth('b'));
                if (overflow > 0) {
                    me.clipTop(btnEl, overflow);
                } else {
                    me.clearClip(btnEl);
                }
            }
        } else if (me.isOverflowing) {
            me.clearClip(btnEl);
            me.clearClip(el);
            me.isOverflowing = false;
        }
    },

    focusColumnField: function(column) {
        var field, didFocus;
        
        if (column && !column.destroyed) {   
            if (column.isVisible()) {
                field = this.getEditor(column);   
                if (field && field.isFocusable(true)) {
                    didFocus = true;
                    field.focus();
                }
            }
            if (!didFocus) {
                this.focusColumnField(column.next());
            }
        }
    },

    cancelEdit: function() {
        var me     = this,
            form   = me.getForm(),
            fields = form.getFields(),
            items  = fields.items,
            length = items.length,
            i;

        if (me._cachedNode) {
            me.clearCache();
        }
        me.hide();
        form.clearInvalid();

        // temporarily suspend events on form fields before reseting the form to prevent the fields' change events from firing
        for (i = 0; i < length; i++) {
            items[i].suspendEvents();
        }

        form.reset();

        for (i = 0; i < length; i++) {
            items[i].resumeEvents();
        }
    },

    /*
    * @private
    */
    clearCache : function() {
        var me = this;
        me.mun(me.editingPlugin.view, {
            itemadd : me.onViewItemAdd,
            scope: me
        });
        me._cachedNode = false;
    },

    completeEdit: function() {
        var me = this,
            form = me.getForm();

        if (!form.isValid()) {
            return false;
        }

        me.completing = true;
        form.updateRecord(me.context.record);
        me.hide();
        me.completing = false;
        return true;
    },

    onShow: function() {
        var me = this;

        me.wrapEl.show();
        me.callParent(arguments);
        if (me.needsSyncFieldWidths) {
            me.suspendLayouts();
            me.syncAllFieldWidths();
            me.resumeLayouts(true);
        }
        delete me.needsSyncFieldWidths;

        me.reposition();
    },

    onHide: function() {
        var me = this,
            context = me.context,
            column,
            focusContext,
            activeEl = Ext.Element.getActiveElement();

        // If they used ESC or ENTER in a Field
        if (me.el.contains(activeEl)) {
            column = me.activeField.column;
        }
        // If they used a button
        else {
            column = context.column;
        }
        focusContext = new Ext.grid.CellContext(column.getView()).setPosition(me.context.record, column);
        focusContext.view.getNavigationModel().setPosition(focusContext);
        me.activeField = null;

        me.wrapEl.hide();
        me.callParent(arguments);
        if (me.tooltip) {
            me.hideToolTip();
        }
    },

    onResize: function(width, height) {
        this.wrapEl.setSize(width, height);
    },

    isDirty: function() {
        return this.getForm().isDirty();
    },

    getToolTip: function() {
        var me = this,
            tip = me.tooltip,
            grid = me.editingPlugin.grid;

        if (!tip) {
            me.tooltip = tip = new Ext.tip.ToolTip({
                cls: Ext.baseCSSPrefix + 'grid-row-editor-errors',
                title: me.errorsText,
                autoHide: false,
                closable: true,
                closeAction: 'disable',
                anchor: 'left',
                anchorToTarget: true,
                constrainPosition: true,
                constrainTo: document.body
            });
            grid.add(tip);

            // Layout may change the grid's positioning.
            me.mon(grid, {
                afterlayout: me.onGridLayout,
                scope: me
            });
        }
        return tip;
    },

    hideToolTip: function() {
        var me = this,
            tip = me.getToolTip();
        if (tip.rendered) {
            tip.disable();
        }
        me.hiddenTip = false;
    },

    showToolTip: function() {
        var me = this,
            tip = me.getToolTip();

        tip.update(me.getErrors());
        me.repositionTip();
        tip.enable();
    },

    onGridLayout: function() {
        if (this.tooltip && this.tooltip.isVisible()) {
            this.repositionTip();
        }
    },

    repositionTip: function() {
        var me = this,
            tip = me.getToolTip(),
            context = me.context,
            row = Ext.get(context.row),
            viewEl = me.scrollingViewEl,
            viewHeight = viewEl.dom.clientHeight,
            viewTop = viewEl.getY(),
            viewBottom = viewTop + viewHeight,
            rowHeight = row.getHeight(),
            rowTop = row.getY(),
            rowBottom = rowTop + rowHeight;

        if (rowBottom > viewTop && rowTop < viewBottom) {

            // Use the ToolTip's anchoring to get the left/right positioning correct with
            // respect to space available on the default (right) side.
            tip.anchorTarget = viewEl;
            tip.mouseOffset = [0, row.getOffsetsTo(viewEl)[1]];

            // The tip will realign itself based upon its new offset
            tip.show();
            me.hiddenTip = false;
        } else {
            tip.hide();
            me.hiddenTip = true;
        }
    },

    getErrors: function() {
        var me        = this,
            errors    = [],
            fields    = me.query('>[isFormField]'),
            length    = fields.length,
            i, fieldErrors, field;

        for (i = 0; i < length; i++) {
            field = fields[i];
            fieldErrors = field.getErrors();
            if (fieldErrors.length) {
                errors.push(me.createErrorListItem(fieldErrors[0], field.column.text));
            }
        }

        // Only complain about unsaved changes if all the fields are valid
        if (!errors.length && !me.autoCancel && me.isDirty()) {
            errors[0] = me.createErrorListItem(me.dirtyText);
        }

        return '<ul class="' + Ext.baseCSSPrefix + 'list-plain">' + errors.join('') + '</ul>';
    },

    createErrorListItem: function(e, name) {
        e = name ? name + ': ' + e : e;
        return '<li class="' + this.errorCls + '">' + e + '</li>';
    },

    beforeDestroy: function(){
        Ext.destroy(this.floatingButtons, this.tooltip);
        this.callParent();    
    },

    clipBottom: function(el, value) {
        el.setStyle('clip', 'rect(0 auto ' + value + 'px 0)');
    },

    clipTop: function(el, value) {
        el.setStyle('clip', 'rect(' + value + 'px, auto, auto, 0)');
    },

    clearClip: function(el) {
        el.setStyle(
            'clip',
            Ext.isIE8 ? 'rect(-1000px auto 1000px auto)' : 'auto'
        );
    }
});
