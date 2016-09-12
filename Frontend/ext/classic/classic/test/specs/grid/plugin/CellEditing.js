describe('Ext.grid.plugin.CellEditing', function () {
    var store, plugin, grid, view, record, column, field,
        TAB = 9,
        synchronousLoad = true,
        proxyStoreLoad = Ext.data.ProxyStore.prototype.load,
        loadStore;

    function makeGrid(pluginCfg, gridCfg, storeCfg, locked) {
        store = new Ext.data.Store(Ext.apply({
            fields: ['name', 'email', 'phone'],
            data: [
                {'name': 'Lisa', 'email': 'lisa@simpsons.com', 'phone': '555-111-1224', 'age': 14},
                {'name': 'Bart', 'email': 'bart@simpsons.com', 'phone': '555-222-1234', 'age': 12},
                {'name': 'Homer', 'email': 'homer@simpsons.com', 'phone': '555-222-1244', 'age': 44},
                {'name': 'Marge', 'email': 'marge@simpsons.com', 'phone': '555-222-1254', 'age': 41}
            ],
            autoDestroy: true
        }, storeCfg));

        plugin = new Ext.grid.plugin.CellEditing(pluginCfg);

        grid = new Ext.grid.Panel(Ext.apply({
            columns: [
                {header: 'Name',  dataIndex: 'name', editor: 'textfield', locked: locked},
                {header: 'Email', dataIndex: 'email', flex:1,
                    editor: {
                        xtype: 'textareafield',
                        allowBlank: false,
                        grow: true
                    }
                },
                {header: 'Phone', dataIndex: 'phone', editor: 'textfield'},
                {header: 'Age', dataIndex: 'age', editor: 'textfield'}
            ],
            store: store,
            selModel: 'cellmodel',
            plugins: [plugin],
            width: 200,
            height: 400,
            renderTo: Ext.getBody()
        }, gridCfg));

        view = grid.view;
    }

    function startEdit(recId, colId) {
        record = store.getAt(recId || 0);
        column = grid.columns[colId || 0];
        plugin.startEdit(record, column);
        field = column.field;
    }

    function triggerEditorKey(target, key) {
        // Ext.supports.SpecialKeyDownRepeat changes the event Ext.form.field.Base listens for!
        jasmine.fireKeyEvent(target, Ext.supports.SpecialKeyDownRepeat ? 'keydown' : 'keypress', key);
    }

    beforeEach(function() {
        // Override so that we can control asynchronous loading
        loadStore = Ext.data.ProxyStore.prototype.load = function() {
            proxyStoreLoad.apply(this, arguments);
            if (synchronousLoad) {
                this.flushLoad.apply(this, arguments);
            }
            return this;
        };

        MockAjaxManager.addMethods();
    });

    afterEach(function() {
        // Undo the overrides.
        Ext.data.ProxyStore.prototype.load = proxyStoreLoad;

        tearDown();
        MockAjaxManager.removeMethods();
    });

    function tearDown() {
        store = plugin = grid = view = record = column = field = Ext.destroy(grid);
    }

    describe('finding the cell editing plugin in a locking grid', function() {
        beforeEach(function() {
            makeGrid({pluginId:'test-cell-editing'}, null, null, true);
        });

        it('should find it by id', function() {
            expect(grid.getPlugin('test-cell-editing')).toBe(plugin);
        });
        it('should find it by ptype', function() {
            expect(grid.findPlugin('cellediting')).toBe(plugin);
        });
    });

    describe('effect of hiding columns on cell editing selection', function () {
        // These specs show that hiding columns pre- or post- cell edit will not place the x-grid-cell-selected class on the wrong
        // cell in the wrong column when the row is updated since Ext.view.Table:renderCell is now looking up the cell context by
        // header rather than by index. See EXTJSIV-11653.
        var wasEdited = false,
            columnManager, cell;

        beforeEach(function () {
            makeGrid({
                listeners: {
                    edit: function (editor) {
                        wasEdited = true;
                    }
                }
            }, {
                selType: 'cellmodel'
            });

            columnManager = grid.getColumnManager();
        });

        afterEach(function () {
            wasEdited = false;
            columnManager = null;
        });

        it('should give the edited cell the selected class after initially hiding columns', function () {
            // First hide the columns.
            columnManager.getColumns()[0].hide();
            columnManager.getColumns()[1].hide();

            // Then do the edit.
            record = grid.store.getAt(0);
            column = columnManager.getColumns()[2];
            cell = grid.view.getCell(record, column);

            jasmine.fireMouseEvent(cell, 'dblclick');
            plugin.getEditor(record, column).setValue('111-111-1111');
            plugin.completeEdit();

            waitsFor(function () {
                return wasEdited;
            });

            runs(function () {
                // Finally show that the selected cell is in the correct column.
                cell = Ext.fly(grid.view.getNode(record)).down('.x-grid-cell-selected');
                expect(cell.hasCls('x-grid-cell-' + column.id)).toBe(true);
            });
        });

        it('should move the selected cell along with its column when other columns are hidden', function () {
            record = grid.store.getAt(0);
            column = columnManager.columns[2];
            cell = grid.view.getCell(record, column);

            jasmine.fireMouseEvent(cell, 'dblclick');
            plugin.getEditor(record, column).setValue('111-111-1111');
            plugin.completeEdit();

            waitsFor(function () {
                return wasEdited;
            });

            runs(function () {
                // First simply show that the selected cell is in the correct column.
                cell = Ext.fly(grid.view.getNode(record)).down('.x-grid-cell-selected');
                expect(cell.hasCls('x-grid-cell-' + column.id)).toBe(true);

                columnManager.columns[0].hide();

                // Now show that the selected cell is still in the correct column.
                cell = Ext.fly(grid.view.getNode(record)).down('.x-grid-cell-selected');
                expect(cell.hasCls('x-grid-cell-' + column.id)).toBe(true);
            });
        });
    });

    describe('events', function () {
        var editorContext, cancelEditFired;

        afterEach(function () {
            editorContext = null;
        });

        describe('beforeedit', function () {
            it('should retain changes to the editing context in the event handler', function () {
                // See EXTJSIV-11643.
                makeGrid({
                    listeners: {
                        beforeedit: function (editor, context) {
                            context.value = 'motley';
                            editorContext = context;
                        }
                    }
                });

                startEdit();

                expect(editorContext.value).toBe('motley');
            });
        });

        describe('canceledit', function () {
            beforeEach(function () {

                // Must wait for async focus events from previous suite to complete.
                waits(10);
                
                runs(function() {
                    cancelEditFired = false;

                    makeGrid({
                        listeners: {
                            canceledit: function (editor, context) {
                                cancelEditFired = true;
                                editorContext = context;
                            }
                        }
                    });

                    startEdit();
                });
            });

            it('should be able to get the original value when canceling the edit by the plugin', function() {
                expect(plugin.editing).toBe(true);

                // Note that the columnmove and columnresize events go through plugin.cancelEdit().
                column.getEditor().setValue('baz');
                plugin.cancelEdit();

                expect(cancelEditFired).toBe(true);
                expect(editorContext.originalValue).toBe('Lisa');
            });

            it('should be able to get the edited value when canceling the edit by the plugin', function() {
                expect(plugin.editing).toBe(true);

                // Note that the columnmove and columnresize events go through plugin.cancelEdit().
                column.getEditor().setValue('foo');
                plugin.cancelEdit();

                expect(cancelEditFired).toBe(true);
                expect(editorContext.value).toBe('foo');
            });

            it('should have different values for edited value and original value when canceling', function() {
                expect(plugin.editing).toBe(true);

                column.getEditor().setValue('foo');
                plugin.cancelEdit();

                expect(cancelEditFired).toBe(true);
                expect(editorContext.value).not.toBe(editorContext.originalValue);
            });

            it('should be able to get the edited value when canceling the edit by the editor', function() {
                expect(plugin.editing).toBe(true);

                // Note that the canceledit event goes through editor.cancelEdit().
                column.getEditor().setValue('bar');
                plugin.getEditor(record, column).cancelEdit();

                expect(cancelEditFired).toBe(true);
                expect(editorContext.value).not.toBe(editorContext.originalValue);
                expect(editorContext.value).toBe('bar');
            });

            describe('falsey values', function () {
                it('should be able to capture falsey values when canceled by the plugin', function() {
                    expect(plugin.editing).toBe(true);

                    // Note that the columnmove and columnresize events go through plugin.cancelEdit().
                    column.getEditor().setValue('');
                    plugin.cancelEdit();

                    expect(cancelEditFired).toBe(true);
                    expect(editorContext.value).toBe('');
                });

                it('should be able to capture falsey values for the editedValue when canceled by the editor', function() {
                    expect(plugin.editing).toBe(true);

                    // Note that the canceledit event goes through editor.cancelEdit().
                    column.getEditor().setValue('');
                    plugin.getEditor(record, column).cancelEdit();

                    waitsFor(function() {
                        return cancelEditFired;
                    });
                    runs(function() {
                        expect(editorContext.value).toBe('');
                    });
                });
            });
        });

        describe('selecting ranges', function () {
            // See EXTJS-16608.
            var selModel;

            function fireEvent(rowNum, eventName, shift) {
                jasmine.fireMouseEvent(view.getNode(rowNum).getElementsByTagName('td')[0],eventName, null, null, null, !!shift);
            }

            function expectSelected(rec) {
                var i, len;

                if (arguments.length === 1) {
                    if (typeof rec == 'number') {
                        rec = store.getAt(rec);
                    }
                    expect(selModel.isSelected(rec)).toBe(true);
                } else {
                    for (i = 0, len = arguments.length; i < len; ++i) {
                        expectSelected(arguments[i]);
                    }
                }
            }

            afterEach(function () {
                selModel = null;
            });

            function selectRange(eventName) {
                describe('MULTI', function () {
                    beforeEach(function () {
                        makeGrid({
                            clicksToEdit: eventName === 'click' ? 1: 2
                        }, {
                            selModel: {
                                type: 'rowmodel',
                                mode: 'MULTI'
                            }
                        });

                        selModel = grid.selModel;
                    });

                    it('should select a range if we have a selection start point and shift is pressed', function () {
                        fireEvent(0, eventName);
                        fireEvent(3, eventName, true);
                        expectSelected(0, 1, 2, 3);
                    });

                    it('should maintain selection with a complex sequence', function() {
                        fireEvent(0, eventName);
                        expectSelected(0);
                        fireEvent(2, eventName, true);
                        expectSelected(0, 1, 2);
                        fireEvent(3, eventName);
                        expectSelected(3);
                        fireEvent(1, eventName, true);
                        expectSelected(1, 2, 3);

                        fireEvent(2, eventName);
                        expectSelected(2);
                        fireEvent(0, eventName, true);
                        expectSelected(0, 1, 2);
                        fireEvent(3, eventName, true);
                        expectSelected(2, 3);
                    });
                });
            }

            selectRange('click');
            selectRange('dblclick');
        });
    });

    describe('sorting', function () {
        it('should complete the edit when focusing the column', function () {
            makeGrid();
            startEdit();
            column.focus();

            expect(plugin.editing).toBe(false);
        });
    });

    describe('making multiple selections with checkbox model', function () {
        var store, selModel;

        afterEach(function () {
            store = selModel = null;
        });

        it('should keep existing selections when editing a cell in an previously-selected row', function () {
            makeGrid(null, {
                selModel: new Ext.selection.CheckboxModel({})
            });

            store = grid.store;
            selModel = grid.selModel;

            // Select all models in the store.
            selModel.select(store.data.items);

            // Now edit a cell.
            startEdit(2);

            // All the previous selections should still be selected.
            expect(selModel.getSelection().length).toBe(store.data.length);
        });

        it('should expect that the correct records have been selected', function () {
            var contains = Ext.Array.contains,
                selections;

            makeGrid(null, {
                selModel: new Ext.selection.CheckboxModel({})
            });

            store = grid.store;
            selModel = grid.selModel;

            // Make some selections.
            selModel.select([store.getAt(1), store.getAt(3)]);

            // Now edit a cell in an unselected row.
            // As of 5.0.1, it should NOT select, but should preserve existing MULTI selections: https://sencha.jira.com/browse/EXTJS-14472
            startEdit();

            selections = selModel.getSelection();

            expect(contains(selections, store.getAt(0))).toBe(false);
            expect(contains(selections, store.getAt(1))).toBe(true);
            expect(contains(selections, store.getAt(2))).toBe(false);
            expect(contains(selections, store.getAt(3))).toBe(true);
        });

        it('should keep existing selections when editing a cell in an unselected row', function () {
            makeGrid(null, {
                selModel: new Ext.selection.CheckboxModel({})
            });

            store = grid.store;
            selModel = grid.selModel;

            // Make some selections.
            selModel.select([store.getAt(0), store.getAt(1)]);

            // Now edit a cell in an unselected row.
            // As of 5.0.1, it should NOT select, but should preserve existing MULTI selections: https://sencha.jira.com/browse/EXTJS-14472
            startEdit(3, 0);

            // The selections should now also include the row that contains the cell being edited.
            expect(selModel.getSelection().length).toBe(2);
        });
    });

    describe('setting value while remote querying', function () {
        // These tests simulates a test case where a value is entered in the editor (either as .value or .rawValue) and then
        // is tabbed out of the editor (and completing the edit) before the response returns and the combo store is loaded.
        // See EXTJS-13127.
        //
        // There is a lot of coverage for combos, but we also needed to test the behavior of combos as cell editors. There have
        // been bugs where raw values have been retained by the editor across tabs, i.e., if 'foo' is entered in the editor that
        // same value will be retained as the user tabs through the grid (although this only seems to happen in grids where only
        // a single column is editable, as tested below). Also, there have been bugs where the same editor value (.value) has been
        // been written to each model as the user tabs (obviously not good). The following tests cover both of these scenarios.
        //
        // In addition, the tests cover what should happen if a value or raw value is set prior to or during the combo store load,
        // both when forceSelection is on and off. In either case (of forceSelection), we have decided that the value should be
        // allowed because the combo store hasn't been loaded yet. The contract with forceSelection is with the combo store, and if
        // the user chooses to enter a value before said store is loaded then we cannot do anything about that as we cannot look
        // anything up.

        var comboStore, ed;

        function createUI(forceSelection) {
            comboStore = new Ext.data.Store({
                fields: ['id', 'state', 'nickname'],
                proxy: {
                    type: 'ajax',
                    url: 'fake',
                    reader: {
                        type: 'array'
                    }
                }
            });

            makeGrid(null, {
                columns: [{
                    header: 'State',
                    dataIndex: 'id',
                    renderer: function (value, metaData, record) {
                        return record.get('state');
                    },
                    editor: {
                        xtype: 'combo',
                        store: comboStore,
                        queryMode: 'remote',
                        typeAhead: true,
                        minChars: 2,
                        displayField: 'state',
                        valueField: 'id',
                        forceSelection: forceSelection
                    }
                }]
            }, {
                fields: ['id', 'state', 'nickname'],
                data: [
                    ['AL', 'Alabama', 'The Heart of Dixie'],
                    ['AK', 'Alaska', 'The Land of the Midnight Sun'],
                    ['AR', 'Arkansas', 'The Natural State'],
                    ['AZ', 'Arizona', 'The Grand Canyon State']
                ],
                proxy: {
                    type: 'memory',
                    reader: {
                        type: 'array'
                    }
                }
            });
        }

        describe('only one editable column', function () {
            function initiateTests(expectation, loadStore) {
                describe(expectation, function () {
                    function forceSelection(force) {
                        describe('forceSelection = ' + force, function () {
                            beforeEach(function () {
                                createUI(force);
                            });

                            afterEach(function () {
                                Ext.destroy(comboStore);
                                comboStore = ed = null;
                            });

                            function setup(force, method) {
                                // Initiate the edit.
                                jasmine.fireMouseEvent(grid.view.getNode(store.getAt(0)).getElementsByTagName('td')[0], 'dblclick');
                                ed = plugin.getActiveEditor();

                                if (loadStore) {
                                    comboStore.load();
                                }


                                // Simulate the load which happens when text is typed into the editor.
                                // Let's then tab out to complete the edit.
                                if (method === 'setRawValue') {
                                    ed.field.setRawValue('ben');
                                } else {
                                    ed.setValue('ben');
                                }

                                jasmine.fireKeyEvent(ed.field.inputEl, 'keydown', 9);
                            }

                            function setValue(raw) {
                                var method = raw ? 'setRawValue' : 'setValue';

                                describe(method, function () {
                                    it('should write the value to the model', function () {
                                        var val = 'ben';

                                        setup(force, method);

                                        if (force && method === 'setRawValue') {
                                            val = 'AL';
                                        }

                                        record = store.getAt(0);
                                        expect(record.get('id')).toBe(val);
                                        expect(record.get('state')).toBe('Alabama');
                                    });

                                    it('should not set any other fields in the model across tabs', function () {
                                        // There have been bugs which caused the same value to be set in different models across tabs.
                                        setup(force, method);

                                        record = store.getAt(1);
                                        expect(record.get('id')).toBe('AK');
                                        expect(record.get('state')).toBe('Alaska');

                                        record = store.getAt(2);
                                        jasmine.fireKeyEvent(ed.field.inputEl, 'keydown', 9);
                                        expect(record.get('state')).toBe('Arkansas');
                                        expect(record.get('nickname')).toBe('The Natural State');

                                        record = store.getAt(3);
                                        jasmine.fireKeyEvent(ed.field.inputEl, 'keydown', 9);
                                        expect(record.get('state')).toBe('Arizona');
                                        expect(record.get('nickname')).toBe('The Grand Canyon State');
                                    });

                                    it('should give the editor different values across tabs', function () {
                                        // There have been bugs which caused the editor to keep the same value across tabs.
                                        setup(force, method);

                                        // It should not propagate the user-inputted value.

                                        // Let's make sure the editor has the correct value...
                                        expect(ed.getValue()).toBe('AK');
                                        expect(ed.field.getRawValue()).toBe('');

                                        jasmine.fireKeyEvent(ed.field.inputEl, 'keydown', 9);
                                        expect(ed.getValue()).toBe('AR');

                                        jasmine.fireKeyEvent(ed.field.inputEl, 'keydown', 9);
                                        expect(ed.getValue()).toBe('AZ');
                                    });

                                    it('should not give the editor a raw value because the combo store has not been loaded', function () {
                                        // There have been bugs which caused the editor to keep the same raw value across tabs.
                                        setup(force, method);

                                        expect(ed.field.getRawValue()).toBe('');

                                        jasmine.fireKeyEvent(ed.field.inputEl, 'keydown', 9);
                                        expect(ed.field.getRawValue()).toBe('');

                                        jasmine.fireKeyEvent(ed.field.inputEl, 'keydown', 9);
                                        expect(ed.field.getRawValue()).toBe('');
                                    });
                                });
                            }

                            setValue(false);
                            setValue(true);
                        });
                    }

                    forceSelection(false);
                    forceSelection(true);
                });
            }

            initiateTests('before store load is initiated', false);
            initiateTests('while store is loading', true);

            describe('when tabbing (down/up to the contiguous row)', function () {
                var activeEditor;

                beforeEach(function () {
                    makeGrid({
                        clicksToEdit: 1
                    }, {
                        columns: [
                            {header: 'Name',  dataIndex: 'name', editor: 'textfield'},
                            {header: 'Email', dataIndex: 'email', flex:1},
                            {header: 'Phone', dataIndex: 'phone'},
                            {header: 'Age', dataIndex: 'age'}
                        ],
                        selModel: 'rowmodel'
                    });

                    startEdit();

                    activeEditor = plugin.activeEditor;

                    // Spy on afterHide to count *successful* hides.
                    // hide may be called when already hidden during CellEditing tabbing sequence.
                    spyOn(activeEditor, 'afterHide').andCallThrough();

                    jasmine.fireKeyEvent(column.field.inputEl, 'keydown', 9);
                });

                afterEach(function () {
                    activeEditor = null;
                });

                it('should not complete', function () {
                    expect(activeEditor).not.toBe(null);
                    expect(plugin.activeColumn).not.toBe(null);
                    expect(plugin.activeRecord).not.toBe(null);
                });

                it('should hide the editor', function () {
                    expect(activeEditor).not.toBe(null);
                    expect(activeEditor.isVisible()).toBe(true);

                    // CellEditing is just part of actionable mode.
                    // Actionable mode does not know that you are going to focus to the same editor.
                    // It just desctivates the old row, activates the new row, and focuses the first tabbable element.
                    // Deactivating a row will hide the editors.
                    // So the "name" editor will have been hidden when that row was deactivated.
                    expect(activeEditor.afterHide.callCount).toBe(1);
                });
            });
        });
    });

    describe('clicksToEdit', function () {
        describe('2 clicks', function () {
            beforeEach(function () {
                makeGrid();
            });

            it('should default to 2', function () {
                expect(plugin.clicksToEdit).toBe(2);
            });

            it('should begin editing when double-clicked', function () {
                record = grid.store.getAt(0);
                node = grid.view.getNodeByRecord(record);
                jasmine.fireMouseEvent(Ext.fly(node).down('.x-grid-cell'), 'dblclick');

                expect(plugin.activeEditor).not.toBeFalsy();
            });

            it('should not begin editing when single-clicked', function () {
                record = grid.store.getAt(0);
                node = grid.view.getNodeByRecord(record);
                jasmine.fireMouseEvent(Ext.fly(node).down('.x-grid-cell'), 'click');

                expect(plugin.activeEditor).toBeFalsy();
            });

            describe('editing a new cell', function () {
                var cells, boundEl;

                afterEach(function () {
                    cells = boundEl = null;
                });

                it('should update the activeEditor to point to the new cell, adjacent', function () {
                    record = grid.store.getAt(0);
                    node = grid.view.getNodeByRecord(record);
                    cells = Ext.fly(node).query('.x-grid-cell');

                    boundEl = cells[0];
                    jasmine.fireMouseEvent(boundEl, 'dblclick');

                    expect(plugin.activeEditor.boundEl.dom).toBe(boundEl);

                    // Update the boundEl to our new cell.
                    boundEl = cells[1];
                    jasmine.fireMouseEvent(boundEl, 'dblclick');

                    expect(plugin.activeEditor.boundEl.dom).toBe(boundEl);
                });

                it('should update the activeEditor to point to the new cell, below', function () {
                    record = grid.store.getAt(0);
                    node = grid.view.getNodeByRecord(record);
                    boundEl = Ext.fly(node).down('.x-grid-cell').dom;

                    jasmine.fireMouseEvent(boundEl, 'dblclick');

                    expect(plugin.activeEditor.boundEl.dom).toBe(boundEl);

                    record = grid.store.getAt(1);
                    node = grid.view.getNodeByRecord(record);

                    // Update the boundEl to our new cell.
                    boundEl = Ext.fly(node).down('.x-grid-cell').dom;

                    jasmine.fireMouseEvent(boundEl, 'dblclick');

                    expect(plugin.activeEditor.boundEl.dom).toBe(boundEl);
                });
            });
        });

        describe('1 click', function () {
            beforeEach(function () {
                makeGrid({
                    clicksToEdit: 1
                });
            });

            it('should honor a different number than the default', function () {
                expect(plugin.clicksToEdit).toBe(1);
            });

            it('should begin editing when single-clicked', function () {
                record = grid.store.getAt(0);
                node = grid.view.getNodeByRecord(record);
                jasmine.fireMouseEvent(Ext.fly(node).down('.x-grid-cell'), 'click');

                expect(plugin.activeEditor).not.toBeFalsy();
            });

            // Note: I'm disabling this for IE b/c certain versions (esp. 10 & 11) could not distinguish
            // between single- and double-click.
            if (!Ext.isIE) {
                it('should not begin editing when double-clicked', function () {
                    record = grid.store.getAt(0);
                    node = grid.view.getNodeByRecord(record);
                    jasmine.fireMouseEvent(Ext.fly(node).down('.x-grid-cell'), 'dblclick');

                    expect(plugin.activeEditor).toBeFalsy();
                });
            }

            describe('editing a new cell', function () {
                var cells, boundEl;

                afterEach(function () {
                    cells = boundEl = null;
                });

                it('should update the activeEditor to point to the new cell, adjacent', function () {
                    record = grid.store.getAt(0);
                    node = grid.view.getNodeByRecord(record);
                    cells = Ext.fly(node).query('.x-grid-cell');

                    boundEl = cells[0];
                    jasmine.fireMouseEvent(boundEl, 'click');

                    expect(plugin.activeEditor.boundEl.dom).toBe(boundEl);

                    // Update the boundEl to our new cell.
                    boundEl = cells[1];
                    jasmine.fireMouseEvent(boundEl, 'click');

                    expect(plugin.activeEditor.boundEl.dom).toBe(boundEl);
                });

                it('should update the activeEditor to point to the new cell, below', function () {
                    record = grid.store.getAt(0);
                    node = grid.view.getNodeByRecord(record);
                    boundEl = Ext.fly(node).down('.x-grid-cell').dom;

                    jasmine.fireMouseEvent(boundEl, 'click');

                    expect(plugin.activeEditor.boundEl.dom).toBe(boundEl);

                    record = grid.store.getAt(1);
                    node = grid.view.getNodeByRecord(record);

                    // Update the boundEl to our new cell.
                    boundEl = Ext.fly(node).down('.x-grid-cell').dom;

                    jasmine.fireMouseEvent(boundEl, 'click');

                    expect(plugin.activeEditor.boundEl.dom).toBe(boundEl);
                });
            });
        });
    });

    describe('the CellEditor', function () {
        beforeEach(function () {
            makeGrid();
            startEdit();
        });

        it('should get an ownerCmp reference to the grid', function () {
            waitsFor(function() {
                return plugin.activeEditor && plugin.activeEditor.ownerCmp === grid;
            });
        });

        it('should be able to lookup up its owner in the component hierarchy chain', function () {
            waitsFor(function() {
                return plugin.activeEditor && plugin.activeEditor.up('grid') === grid;
            });
        });

        describe('positioning the editor', function () {
            it('should default to "l-l!"', function () {
                field = column.field;

                expect(field.xtype).toBe('textfield');
                waitsFor(function() {
                    return plugin.activeEditor && plugin.activeEditor.alignment === 'l-l!';
                });
            });

            it('should constrain to the view if the editor goes out of bounds', function () {
                // Wait for the beforeEach's startEdit to get started
                waitsFor(function() {
                    return plugin.activeEditor && plugin.activeEditor.field.hasFocus;
                }, 'editor to focus', 1000);

                // Need to be able to correctly startEdit while editing to move edit location
                runs(function() {
                    startEdit(0, 1);
                });

                waitsFor(function() {
                    return field.hasFocus && field.getRegion().top === Ext.fly(plugin.activeEditor.container).getRegion().top;
                }, 'something funky to happen', 1000);
            });

            it('should not reposition when shown', function () {
                plugin.completeEdit();

                spyOn(Ext.AbstractComponent.prototype, 'setPosition');

                startEdit(0, 1);

                expect(plugin.activeEditor.setPosition).not.toHaveBeenCalled();
            });

            it('should not reposition when within a draggable container', function () {
                // See EXTJS-15532.
                var win;

                tearDown();

                makeGrid(null, {
                    renderTo: null
                });

                win = new Ext.window.Window({
                    items: grid
                }).show();

                startEdit();

                spyOn(plugin.activeEditor, 'setPosition');

                jasmine.fireMouseEvent(win.el.dom, 'mousedown');
                jasmine.fireMouseEvent(win.el.dom, 'mousemove', win.x, win.y);
                jasmine.fireMouseEvent(win.el.dom, 'mousemove', (win.x - 100), (win.y - 100));
                jasmine.fireMouseEvent(win.el.dom, 'mouseup', 400);

                expect(plugin.activeEditor.setPosition).not.toHaveBeenCalled();

                win.destroy();
            });
        });

        describe('as textfield', function () {
            it('should start the edit when ENTER is pressed', function () {
                var node = view.body.query('td', true)[0];

                // Wait for the beforeEach's startEdit to take effect
                waitsFor(function() {
                    return plugin.activeEditor && plugin.activeEditor.field.hasFocus;
                }, 'beforeEach startEdit to take effect');

                // First complete the edit (we start an edit in the top-level beforeEach).
                runs(function() {
                    grid.setActionableMode(false);
                });

                // Wait for it to clear itself up and focus to return to the cell
                waitsFor(function() {
                    return plugin.activeEditor == null && plugin.editing === false && Ext.Element.getActiveElement() === node;
                }, 'actionable mode to end and cell to regain focus');

                runs(function() {
                    jasmine.fireKeyEvent(node, 'keydown', 13);
                });
                
                waitsFor(function() {
                    return plugin.activeEditor && plugin.editing === true;
                }, 'editing to start on the focused cell');
            });

            describe('when currently editing', function() {
                it('should complete the edit when ENTER is pressed', function() {
                    var str = 'Utley is Top Dog',
                        model = store.getAt(0);

                    expect(model.get('name')).toBe('Lisa');
                    field.setValue(str);

                    jasmine.fireKeyEvent(field.inputEl.dom, 'keydown', 13);

                    waitsFor(function() {
                        return model.get('name') === str;
                    }, 'model to be set', 1000);

                    runs(function() {
                        expect(model.get('name')).toBe(str);
                    });
                });

                it('should cancel the edit when ESCAPE is pressed', function() {
                    jasmine.pressKey(field, 'esc');

                    waitsFor(function() {
                        return !plugin.editing;
                    }, 'editing to stop', 1000);

                    runs(function() {
                        expect(plugin.editing).toBe(false);
                    });
                });
            });
        });

        describe('as textarea', function () {
            beforeEach(function () {
                startEdit(0, 1);
            });

            it('should start the edit when ENTER is pressed', function () {
                var node = view.body.query('td', true)[1];

                // Wait for the beforeEach's startEdit to take effect
                waitsFor(function() {
                    return plugin.activeEditor && plugin.activeEditor.field.hasFocus && view.actionableMode === true;
                }, 'beforeEach startEdit to take effect');

                // First complete the edit (we start an edit in the top-level beforeEach).
                runs(function() {
                    grid.setActionableMode(false);
                });

                // Wait for it to clear itself up and focus to return to the cell
                waitsFor(function() {
                    return plugin.activeEditor == null && plugin.editing === false && Ext.Element.getActiveElement() === node;
                }, 'actionable mode to end and cell to regain focus');

                runs(function() {
                    jasmine.fireKeyEvent(node, 'keydown', 13);
                });
                
                waitsFor(function() {
                    return plugin.activeEditor && plugin.editing === true;
                }, 'editing to start on the focused cell');
            });

            describe('when currently editing', function () {
                it('should not complete the edit when ENTER is pressed', function () {
                    spyOn(plugin, 'completeEdit');

                    // Wait for the beforeEach's startEdit to take effect
                    waitsFor(function() {
                        return plugin.activeEditor && plugin.activeEditor.field.hasFocus;
                    }, 'beforeEach startEdit to take effect');

                    // First complete the edit (we start an edit in the top-level beforeEach).
                    runs(function() {
                        triggerEditorKey(field.inputEl, 13);

                        expect(plugin.completeEdit).not.toHaveBeenCalled();
                    });
                });

                it('should not cancel the edit when ENTER is pressed', function () {
                    spyOn(plugin, 'cancelEdit');

                    // Wait for the beforeEach's startEdit to take effect
                    waitsFor(function() {
                        return plugin.activeEditor && plugin.activeEditor.field.hasFocus;
                    }, 'beforeEach startEdit to take effect');

                    // First complete the edit (we start an edit in the top-level beforeEach).
                    runs(function() {
                        triggerEditorKey(field.inputEl, 13);

                        expect(plugin.cancelEdit).not.toHaveBeenCalled();
                    });
                });

                it('should cancel the edit when ESCAPE is pressed', function () {
                    spyOn(plugin, 'cancelEdit');

                    // Wait for the beforeEach's startEdit to take effect
                    waitsFor(function() {
                        return plugin.activeEditor && plugin.activeEditor.field.hasFocus;
                    }, 'beforeEach startEdit to take effect');

                    // First complete the edit (we start an edit in the top-level beforeEach).
                    runs(function() {
                        triggerEditorKey(field.inputEl, 27);
                    });

                    waitsFor(function () {
                        return !plugin.editing;
                    }, 'ESC keydown to have terminated editing');

                    runs(function () {
                        expect(plugin.editing).toBe(false);
                    });
                });

                describe('grow and auto-sizing', function () {
                    var str = 'Attention all planets of the Solar Federation!\nAttention all planets of the Solar Federation!\nWe have assumed control!';

                    it('should auto-size when written to', function () {
                        spyOn(field, 'autoSize');

                        field.setValue(str);

                        expect(field.autoSize).toHaveBeenCalled();
                    });

                    it('should grow', function () {
                        var previousHeight = field.getHeight();

                        field.setValue(str);

                        expect(field.getHeight()).toBeGreaterThan(previousHeight);
                    });
                });
            });
        });
    });

    describe('key mappings', function () {
        it('should not stop propagation on the enter key', function () {
            var EM = Ext.EventManager;

            spyOn(EM, 'stopPropagation');
            spyOn(EM, 'preventDefault');

            makeGrid();
            startEdit(0, 1);

            triggerEditorKey(column.field.inputEl, 13);

            expect(EM.stopPropagation).not.toHaveBeenCalled();
            expect(EM.preventDefault).not.toHaveBeenCalled();
        });
    });

    describe('in a collapsed container', function () {
        // To reproduce the bug:
        //      1. Start edit
        //      2. Collapse the fieldset
        //      3. Create the new editor (or any component that contains an editor)
        //      4. Show the fieldset
        //      5. Try to start edit
        //
        // See EXTJS-12752.
        var fieldset, editor_1, editor_2;

        beforeEach(function () {
            fieldset = new Ext.form.FieldSet({
                collapsible: true,
                items: makeGrid({
                    renderTo: null
                }),
                width: 500,
                renderTo: Ext.getBody()
            });

            startEdit();
        });

        afterEach(function () {
            Ext.destroy(fieldset, editor_1, editor_2);
            fieldset = editor_1 = editor_2 = null;
        });

        it('should not set its hierarchicallyHidden property in response to any hierarchyEvents', function () {
            waitsFor(function() {
                return (editor_1 = plugin.activeEditor) && editor_1.field.hasFocus;
            }, 'editing to start');
            
            runs(function() {

                // We have to fake a blur here.
                plugin.completeEdit();

                fieldset.toggle();

                editor_2 = new Ext.grid.CellEditor({
                    field: 'textfield',
                    renderTo: Ext.getBody()
                });

                fieldset.toggle();

                plugin.startEdit(record, column);
            });

            waitsFor(function() {
                return editor_1.hidden === false;
            }, 'editor_1 to show');

            runs(function() {
                expect(editor_1.hierarchicallyHidden).toBe(false);
            });
        });

        it('should show the CellEditor when the edit is started', function () {
            waitsFor(function() {
                return (editor_1 = plugin.activeEditor) && editor_1.field.hasFocus;
            }, 'editing to start');
            
            runs(function() {

                // We have to fake a blur here.
                plugin.completeEdit();

                fieldset.toggle();

                editor_2 = new Ext.grid.CellEditor({
                    field: 'textfield',
                    renderTo: Ext.getBody()
                });

                fieldset.toggle();

                plugin.startEdit(record, column);
            });

            waitsFor(function() {
                return editor_1.hidden === false;
            }, 'editor_1 to show');
        });
    });

    describe('selectOnFocus', function () {
        // I could not get the following spec to pass in the following browsers, although the test case does work.
        // The dom.select() method in FF seems to be asynchronous (possibly for Opera as well), and IE 11 always
        // returned an empty string for the text selection even though it claims to support window.getSelection().
        ((Ext.isGecko || Ext.isOpera || Ext.isIE11) ? xit : it)('should select the text in the cell when initiating an edit', function () {
            // See EXTJS-12364.
            var node;

            function getSelectionText() {
                var text;

                if (!Ext.isIE) {
                    text = window.getSelection().toString();
                } else if (document.selection) {
                    text = document.selection.createRange().text;
                }

                return text;
            }

            makeGrid(null, {
                columns: [
                    {header: 'Name',  dataIndex: 'name',
                        editor: {
                            xtype: 'textfield',
                            selectOnFocus: true
                        }
                    },
                    {header: 'Email', dataIndex: 'email', flex:1,
                        editor: {
                            xtype: 'textfield',
                            selectOnFocus: true
                        }
                    },
                    {header: 'Phone', dataIndex: 'phone', editor: 'textfield'},
                    {header: 'Age', dataIndex: 'age', editor: 'textfield'}
                ]
            });

            node = grid.view.getNode(grid.store.getAt(1));
            jasmine.fireMouseEvent(node.getElementsByTagName('td')[0], 'dblclick');

            expect(getSelectionText()).toBe('Bart');
        });
    });

    describe('not completing the edit', function () {
        beforeEach(function() {

            // Must wait for async focus events from previous suite to complete.
            waits(10);
        });
        it('should preserve the correct editing context', function () {
            var listener = function () {
                return false;
            }, ed, context;

            makeGrid(null, {
                columns: [
                    {header: 'Name',  dataIndex: 'name',
                        editor: {
                            xtype: 'textfield',
                            selectOnFocus: true
                        }
                    },
                    {header: 'Email', dataIndex: 'email', flex:1,
                        editor: {
                            xtype: 'textfield',
                            selectOnFocus: true
                        }
                    },
                    {header: 'Phone', dataIndex: 'phone', editor: 'textfield'},
                    {header: 'Age', dataIndex: 'age', editor: 'textfield'}
                ]
            });

            startEdit(0, 1);
            waitsFor(function() {
                ed = plugin.activeEditor;
                return !!ed;
            }, 'editing to start at cell(0, 1)');
            runs(function() {
                context = plugin.context;

                ed.on('beforecomplete', listener);
                ed.setValue('derp');
                // Cancel edit.
                triggerEditorKey(ed.field.inputEl, 27);

                expect(plugin.context).toBe(context);
            });
        });
    });

    describe('operations that refresh the view', function () {
        var ed;

        afterEach(function () {
            ed = null;
        });

        describe('when editing and tabbing', function () {
            function doIt(autoSync) {
                it('should not complete the edit in the new position, autoSync ' + autoSync, function () {
                    makeGrid(null, null, {
                        autoSync: autoSync
                    });

                    record = grid.store.getAt(0);
                    column = grid.columns[0];

                    plugin.startEdit(record, column);
                    ed = plugin.activeEditor;
                    ed.setValue('Pete the Dog was here');

                    // Now let's tab and check that the editor is still shown and active.
                    jasmine.fireKeyEvent(ed.field.inputEl, 'keydown', 9);

                    waitsFor(function () {
                        return !!plugin.activeEditor.editing;
                    }, 'editing to start', 1000);

                    runs(function () {
                        // ed is the old editor
                        expect(ed.editing).toBe(false);
                        expect(plugin.activeEditor.editing).toBe(true);
                        expect(plugin.activeColumn.dataIndex).toBe('email');
                    });
                });
            }

            doIt(true);
            doIt(false);
        });

        describe('when editing and syncing', function () {
            it('should not complete the edit in the current position', function () {
                makeGrid();

                record = grid.store.getAt(0);
                column = grid.columns[0];

                plugin.startEdit(record, column);
                ed = plugin.activeEditor;
                ed.setValue('Pete the Dog was here');
                store.sync();

                waitsFor(function () {
                    return !!plugin.activeEditor.editing;
                }, 'editing to start', 1000);

                runs(function () {
                    expect(ed.editing).toBe(true);
                    expect(plugin.activeColumn.dataIndex).toBe('name');
                });
            });
        });
    });
});
