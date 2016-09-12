describe("grid-celledit", function(){
    var webkitIt = Ext.isWebKit ? it : xit,
        grid, GridEventModel = Ext.define(null, {
            extend: 'Ext.data.Model',
            fields: [
                'field1',
                'field2',
                'field3',
                'field4',
                'field5',
                'field6',
                'field7',
                'field8',
                'field9',
                'field10'
            ]
        }),
        synchronousLoad = true,
        proxyStoreLoad = Ext.data.ProxyStore.prototype.load,
        loadStore;

    function findCell(rowIdx, cellIdx) {
        return grid.getView().getCellInclusive({
            row: rowIdx,
            column: cellIdx
        }, true);
    }
    
    function triggerCellMouseEvent(type, rowIdx, cellIdx, button, x, y) {
        var target = findCell(rowIdx, cellIdx);

        jasmine.fireMouseEvent(target, type, x, y, button);
    }
    
    function triggerCellKeyEvent(type, rowIdx, cellIdx, key) {
        var target = findCell(rowIdx, cellIdx);
        jasmine.fireKeyEvent(target, type, key);
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
    });

    afterEach(function() {
        // Undo the overrides.
        Ext.data.ProxyStore.prototype.load = proxyStoreLoad;
    });

    function createSuite(buffered) {
        describe(buffered ? "with buffered rendering" : "without buffered rendering", function() {
            var colRef = [],
                view, store, plugin, editorFocus;

            var TAB = 9,
                ENTER = 13,
                ESC = 27,
                PAGE_UP = 33,
                PAGE_DOWN = 34,
                END = 35,
                HOME = 36,
                LEFT = 37,
                UP = 38,
                RIGHT = 39,
                DOWN = 40;
            
            function startEditing(row, column, skipWait) {
                runs(function() {
                    triggerCellMouseEvent('dblclick', row, column);
                });
                
                if (!skipWait) {
                    waitsFor(function() {
                        return !!plugin.activeEditor;
                    }, 'editing to start', 1000);
                    
                    runs(function() {
                        jasmine.waitForFocus(plugin.getActiveEditor().field);
                    });
                }
            }
            
            function triggerEditorKey(key) {
                var target = plugin.getActiveEditor().field.inputEl.dom;
                jasmine.fireKeyEvent(target, 'keydown', key);
                jasmine.fireKeyEvent(target, 'keyup', key);
                jasmine.fireKeyEvent(target, 'keypress', key);
            }

            function getRec(index) {
                return store.getAt(index);
            }
            
            function makeGrid(columns, pluginCfg, gridCfg) {               
                var data = [],
                    defaultCols = [],
                    i;
                
                if (!columns) {
                    for (i = 1; i <= 5; ++i) {
                        defaultCols.push({
                            name: 'F' + i,
                            dataIndex: 'field' + i,
                            field: {
                                xtype: 'textfield',
                                id: 'field' + i,
                                name: 'field' + i
                            }
                        });
                    }
                }
                    
                for (i = 1; i <= 10; ++i) {
                    data.push({
                        field1: i + '.' + 1,
                        field2: i + '.' + 2,
                        field3: i + '.' + 3,
                        field4: i + '.' + 4,
                        field5: i + '.' + 5,
                        field6: i + '.' + 6,
                        field7: i + '.' + 7,
                        field8: i + '.' + 8,
                        field9: i + '.' + 9,
                        field10: i + '.' + 10
                    });
                }
                
                store = new Ext.data.Store({
                    model: GridEventModel,
                    data: data
                });
                
                if (pluginCfg !== null) {
                    plugin = new Ext.grid.plugin.CellEditing(pluginCfg);
                }

                grid = new Ext.grid.Panel(Ext.apply({
                    columns: columns || defaultCols,
                    store: store,
                    selType: 'cellmodel',
                    plugins: plugin ? [plugin] : undefined,
                    width: 1000,
                    height: 500,
                    bufferedRenderer: buffered,
                    viewConfig: {
                        mouseOverOutBuffer: 0
                    },
                    renderTo: Ext.getBody()
                }, gridCfg));
                view = grid.getView();
                colRef = grid.getColumnManager().getColumns();
            }
            
            afterEach(function() {
                Ext.destroy(grid, store);
                plugin = grid = store = view = null;
                colRef.length = 0;
                Ext.data.Model.schema.clear();
            });

            describe("plugin configuration", function() {
                it("should be able to add the plugin after rendering the grid", function() {
                    makeGrid(null, null);
                    plugin = new Ext.grid.plugin.CellEditing();
                    grid.addPlugin(plugin);
                    triggerCellMouseEvent('dblclick', 0, 0);
                    expect(plugin.editing).toBe(true);
                    expect(plugin.getActiveColumn()).toBe(colRef[0]);
                    expect(plugin.getActiveRecord()).toBe(store.getAt(0));
                });
            });

            describe("resolveListenerScope", function() {
                it("should resolve the scope to the grid", function() {
                    var fooScope = {
                        someFn: function() {}
                    };

                    spyOn(fooScope, 'someFn');

                    makeGrid(null, {
                        listeners: {
                            'beforeedit': 'someFn'
                        }
                    });
                    grid.resolveSatelliteListenerScope = function() {
                        return fooScope;
                    };
                    triggerCellMouseEvent('dblclick', 0, 0);
                    expect(fooScope.someFn).toHaveBeenCalled();
                });
            });

            describe("basic editing", function(){
                var editorParentNode;

                beforeEach(function(){
                    makeGrid();
                    editorParentNode = view.getCellByPosition({
                        row: 0,
                        column: 0
                    }, true);
                });

                // https://sencha.jira.com/browse/EXTJS-18773
                it('should scroll a record that is outside the rendered block into view and edit it', function() {
                    var data = [],
                        i;

                    for (i = 11; i <= 1000; ++i) {
                        data.push({
                            field1: i + '.' + 1,
                            field2: i + '.' + 2,
                            field3: i + '.' + 3,
                            field4: i + '.' + 4,
                            field5: i + '.' + 5,
                            field6: i + '.' + 6,
                            field7: i + '.' + 7,
                            field8: i + '.' + 8,
                            field9: i + '.' + 9,
                            field10: i + '.' + 10
                        });
                    }
                    store.add(data);
                    plugin.startEdit(900, 0);
                    expect(plugin.editing).toBe(true);
                    expect(plugin.getEditor(plugin.context.record, plugin.context.column).isVisible()).toBe(true);
                    expect(plugin.getActiveColumn()).toBe(colRef[0]);
                    expect(plugin.getActiveRecord()).toBe(store.getAt(900));
                });

                it("should trigger the edit on cell interaction", function(){
                    triggerCellMouseEvent('dblclick', 0, 0);
                    expect(plugin.editing).toBe(true);
                    expect(plugin.getActiveColumn()).toBe(colRef[0]);
                    expect(plugin.getActiveRecord()).toBe(store.getAt(0));

                    // CellEditors should be rendered into the grid view which they are editing, and should scroll along with the view.
                    expect(plugin.getActiveEditor().el.dom.parentNode).toBe(editorParentNode);
                });  
                
                it("should be able to be trigger by passing a position", function(){
                    plugin.startEditByPosition({
                        row: 0,
                        column: 2
                    });
                    expect(plugin.editing).toBe(true);
                    expect(plugin.getActiveColumn()).toBe(colRef[2]);
                    expect(plugin.getActiveRecord()).toBe(store.getAt(0));
                });
                
                it("should be able to be trigger by passing a record/header", function(){
                    plugin.startEdit(store.getAt(1), colRef[3]);
                    expect(plugin.editing).toBe(true);
                    expect(plugin.getActiveColumn()).toBe(colRef[3]);
                    expect(plugin.getActiveRecord()).toBe(store.getAt(1));
                });
                
                it("should use the specified column field", function(){
                    triggerCellMouseEvent('dblclick', 0, 0);
                    expect(plugin.getActiveEditor().field.getId()).toBe('field1');
                });
                
                it("should get the underlying record value", function(){
                    triggerCellMouseEvent('dblclick', 0, 1);
                    expect(plugin.getActiveEditor().field.getValue()).toBe('1.2');    
                });
                
                it("should cancel editing on removing a column", function(){
                    var col0Editor;

                    triggerCellMouseEvent('dblclick', 0, 0);
                    col0Editor = plugin.getActiveEditor();
                    expect(col0Editor.isVisible()).toBe(true);

                    grid.headerCt.remove(colRef[0]);

                    // That editor must have been blurred and hidden
                    expect(col0Editor.isVisible()).toBe(false);
                });

                it("should continue editing after a refresh", function(){
                    triggerCellMouseEvent('dblclick', 0, 0);

                    // Editing must have started.
                    expect(plugin.editing).toBe(true); 
                    expect(plugin.getActiveEditor().isVisible()).toBe(true);    
                    expect(plugin.getActiveEditor().field.getValue()).toBe('1.1');    

                    // No refresh the grid
                    grid.view.refresh();

                    // Wait for *sometimes* asynchronous blur/focus events to get done
                    waits(100);

                    // Editor must be there undamaged
                    runs(function() {
                        expect(plugin.editing).toBe(true); 
                        expect(plugin.getActiveEditor().isVisible()).toBe(true);    
                        expect(plugin.getActiveEditor().field.getValue()).toBe('1.1');    
                    });
                });
            });

            describe("clean up", function() {
                function makeCleanupSuite(withLocking) {
                    describe(withLocking ? "with locking" : "without locking", function() {
                        var CM;

                        beforeEach(function() {
                            CM = Ext.ComponentManager;
                        });

                        afterEach(function() {
                            CM = null;
                        });

                        describe("not activated", function() {
                            function makeRenderSuite(beforeRender) {
                                describe(beforeRender ? "before render" : "after render", function() {
                                    it("should destroy an editor instance", function() {
                                        var count = CM.getCount();

                                        makeGrid([{
                                            dataIndex: 'field1',
                                            locked: withLocking,
                                            editor: new Ext.form.field.Text()
                                        }, {
                                            dataIndex: 'field2'
                                        }], {}, {
                                            renderTo: beforeRender ? null : Ext.getBody()
                                        });
                                        grid.destroy();
                                        expect(CM.getCount()).toBe(count);
                                    });

                                    it("should destroy a field instance", function() {
                                        var count = CM.getCount();

                                        makeGrid([{
                                            dataIndex: 'field1',
                                            locked: withLocking,
                                            field: new Ext.form.field.Text()
                                        }, {
                                            dataIndex: 'field2'
                                        }], {}, {
                                            renderTo: beforeRender ? null : Ext.getBody()
                                        });
                                        grid.destroy();
                                        expect(CM.getCount()).toBe(count);
                                    });

                                    it("should not leave an instance with an editor config", function() {
                                        var count = CM.getCount();

                                        makeGrid([{
                                            dataIndex: 'field1',
                                            locked: withLocking,
                                            editor: {
                                                xtype: 'textfield'
                                            }
                                        }, {
                                            dataIndex: 'field2'
                                        }], {}, {
                                            renderTo: beforeRender ? null : Ext.getBody()
                                        });
                                        grid.destroy();
                                        expect(CM.getCount()).toBe(count);
                                    });

                                    it("should not leave an instance with a field config", function() {
                                        var count = CM.getCount();

                                        makeGrid([{
                                            dataIndex: 'field1',
                                            locked: withLocking,
                                            field: {
                                                xtype: 'textfield'
                                            }
                                        }, {
                                            dataIndex: 'field2'
                                        }], {}, {
                                            renderTo: beforeRender ? null : Ext.getBody()
                                        });
                                        grid.destroy();
                                        expect(CM.getCount()).toBe(count);
                                    });
                                });
                            }
                            makeRenderSuite(false);
                            makeRenderSuite(true);
                        });

                        describe("after activation", function() {
                            it("should destroy an editor instance", function() {
                                var count = CM.getCount();

                                makeGrid([{
                                    dataIndex: 'field1',
                                    locked: withLocking,
                                    editor: new Ext.form.field.Text()
                                }, {
                                    dataIndex: 'field2'
                                }]);
                                triggerCellMouseEvent('click', 0, 0);
                                grid.destroy();
                                expect(CM.getCount()).toBe(count);
                            });

                            it("should destroy a field instance", function() {
                                var count = CM.getCount();

                                makeGrid([{
                                    dataIndex: 'field1',
                                    locked: withLocking,
                                    field: new Ext.form.field.Text()
                                }, {
                                    dataIndex: 'field2'
                                }]);
                                triggerCellMouseEvent('click', 0, 0);
                                grid.destroy();
                                expect(CM.getCount()).toBe(count);
                            });

                            it("should destroy an editor config", function() {
                                var count = CM.getCount();

                                makeGrid([{
                                    dataIndex: 'field1',
                                    locked: withLocking,
                                    editor: {
                                        xtype: 'textfield'
                                    }
                                }, {
                                    dataIndex: 'field2'
                                }]);
                                triggerCellMouseEvent('click', 0, 0);
                                grid.destroy();
                                expect(CM.getCount()).toBe(count);
                            });

                            it("should destroy a field instance", function() {
                                var count = CM.getCount();

                                makeGrid([{
                                    dataIndex: 'field1',
                                    locked: withLocking,
                                    field: {
                                        xtype: 'textfield'
                                    }
                                }, {
                                    dataIndex: 'field2'
                                }]);
                                triggerCellMouseEvent('click', 0, 0);
                                grid.destroy();
                                expect(CM.getCount()).toBe(count);
                            });
                        });
                    });
                }
                makeCleanupSuite(false);
                makeCleanupSuite(true);
            });
            
            describe('non-editable cells', function () {
                function makeCols(){
                    var i = 1,
                        cols = [];

                    for (; i <= 10; i++) {
                        if (i % 2 === 0) {
                            cols.push(new Ext.grid.column.Column({
                                name: 'F' + i,
                                dataIndex: 'field' + i,
                                field: {
                                    xtype: 'textfield',
                                    id: 'field' + i,
                                    name: 'field' + i
                                }
                            }));
                        } else {
                            cols.push(new Ext.grid.column.Column({
                                name: 'F' + i,
                                dataIndex: 'field' + i
                            }));
                        }

                        colRef[i - 1] = cols[i - 1];
                    }

                    return cols;
                }

                it('should not trigger a call to .startEdit() if a non-editable cell is clicked', function () {
                    makeGrid(
                        makeCols()
                    );

                    spyOn(plugin, 'startEdit');
                    triggerCellMouseEvent('dblclick', 0, 0);

                    expect(plugin.startEdit).not.toHaveBeenCalled();
                });  

                describe('using checkboxmodel as selType', function () {
                    beforeEach(function () {
                        makeGrid(
                            makeCols(),
                            { clicksToEdit: 1 },
                            {selType: 'checkboxmodel'}
                        );
                    });

                    it('should not trigger a call to startEdit() if the checkboxmodel is clicked', function () {
                        spyOn(plugin, 'startEdit');
                        triggerCellMouseEvent('click', 0, 0);

                        expect(plugin.startEdit).not.toHaveBeenCalled();
                    });  

                    xit('should move to the next editable cell when tabbing', function () {
                        triggerCellMouseEvent('click', 0, 2);
                        triggerEditorKey(TAB);

                        expect(plugin.getActiveColumn()).toBe(colRef[3]);
                    });
                });  
            });

            describe("events", function() {
                beforeEach(function() {
                    makeGrid();
                });
                
                describe("beforeedit", function(){
                    it("should fire the event", function() {
                        var called = false;
                        
                        runs(function() {
                            plugin.on('beforeedit', function() {
                                called = true;
                            });
                            
                            startEditing(0, 0);
                        });
                        
                        runs(function() {
                            expect(called).toBe(true);
                        });
                    });
                    
                    it("should fire the event with the plugin & an event context", function() {
                        var p, context;
                        
                        runs(function() {
                            plugin.on('beforeedit', function(a1, a2) {
                                p = a1;
                                context = a2;
                            });
                            
                            startEditing(0, 0);
                        });
                        
                        runs(function() {
                            expect(p).toBe(plugin);
                            expect(context.colIdx).toBe(0);
                            expect(context.column).toBe(colRef[0]);
                            expect(context.field).toBe('field1');
                            expect(context.grid).toBe(grid);
                            expect(context.originalValue).toBe('1.1');
                            expect(context.record).toBe(getRec(0));
                            expect(context.row).toBe(view.getRow(0));
                            expect(context.rowIdx).toBe(0);
                            expect(context.store).toBe(store);
                            expect(context.value).toBe('1.1');
                        });
                    });

                    it("should prevent editing if false is returned from the plugin's beforeedit event", function() {
                        runs(function() {
                            plugin.on('beforeedit', function(plugin, context) {
                                // Only allow editing on rows other than the first
                                return context.rowIdx > 0;
                            });
                            
                            startEditing(0, 0, true);
                        });
                        
                        runs(function() {
                            expect(plugin.editing).toBeFalsy();
                            
                            // Editing must still start on other rows
                            startEditing(1, 0);
                        });
                        
                        runs(function() {
                            expect(plugin.editing).toBeTruthy();
                        });
                    });
                    
                    it("should prevent editing if false is returned from the CellEditor's beforestartedit event", function() {
                        runs(function() {
                            plugin.getEditor(store.getAt(0), colRef[0]).on('beforestartedit', function(editor, boundEl, value) {
                                // Only allow editing on rows other than the first
                                return editor.context.rowIdx > 0;
                            });
                            
                            startEditing(0, 0, true);
                        });
                        
                        runs(function() {
                            expect(plugin.editing).toBeFalsy();
                            
                            // Editing must still start on other rows
                            startEditing(1, 0);
                        });
                        
                        runs(function() {
                            expect(plugin.editing).toBeTruthy();
                        });
                    });
                    
                    it("should prevent editing if context.cancel is set", function() {
                        runs(function() {
                            plugin.on('beforeedit', function(p, context){
                                context.cancel = true;
                            });
                            
                            startEditing(0, 0, true);
                        });
                        
                        runs(function() {
                            expect(plugin.editing).toBeFalsy();
                        });
                    });
                });  
                
                describe("canceledit", function() {
                    it("should fire the event when editing is cancelled", function() {
                        var called = false;
                        
                        runs(function() {
                            plugin.on('canceledit', function(p, context){
                                called = true;
                            });
                            
                            startEditing(0, 0);
                        });
                        
                        runs(function() {
                            // Cancellation is synchronous so we don't have to wait
                            plugin.cancelEdit();
                            
                            expect(called).toBe(true);
                            expect(plugin.editing).toBe(false);
                        });
                    });
                    
                    it("should pass the plugin and the context", function() {
                        var p, context;
                        
                        runs(function() {
                            plugin.on('canceledit', function(a1, a2){
                                p = a1;
                                context = a2;
                            });
                            
                            startEditing(0, 0);
                        });
                        
                        runs(function() {
                            plugin.cancelEdit();
                            
                            expect(p).toBe(plugin);
                            expect(context.colIdx).toBe(0);
                            expect(context.column).toBe(colRef[0]);
                            expect(context.field).toBe('field1');
                            expect(context.grid).toBe(grid);
                            expect(context.originalValue).toBe('1.1');
                            expect(context.record).toBe(getRec(0));
                            expect(context.row).toBe(view.getRow(0));
                            expect(context.rowIdx).toBe(0);
                            expect(context.store).toBe(store);
                            expect(context.value).toBe('1.1');
                        });
                    });
                });
                
                describe("validateedit", function() {
                    it("should fire the validateedit event before edit", function() {
                        var calledFirst = false,
                            editFired = false;
                        
                        runs(function() {
                            plugin.on('validateedit', function() {
                                calledFirst = !editFired;
                            });
                            
                            plugin.on('edit', function(p, context) {
                                editFired = true;
                            });
                            
                            startEditing(0, 0);
                        });
                        
                        runs(function() {
                            plugin.completeEdit();
                            
                            expect(calledFirst).toBe(true);
                        });
                    });  
                    
                    it("should pass the plugin and the context", function(){
                        var p, context;
                        
                        runs(function() {
                            plugin.on('validateedit', function(a1, a2){
                                p = a1;
                                context = a2;
                            });
                            startEditing(0, 0);
                        });
                        
                        runs(function() {
                            plugin.getActiveEditor().field.setValue('foo');
                            plugin.completeEdit();
                            
                            expect(p).toBe(plugin);
                            expect(context.colIdx).toBe(0);
                            expect(context.column).toBe(colRef[0]);
                            expect(context.field).toBe('field1');
                            expect(context.grid).toBe(grid);
                            expect(context.originalValue).toBe('1.1');
                            expect(context.record).toBe(getRec(0));
                            expect(context.row).toBe(view.getRow(0));
                            expect(context.rowIdx).toBe(0);
                            expect(context.store).toBe(store);
                            expect(context.value).toBe('foo');

                            // The flag set in beforeitemupdate listener of the editor
                            // should not still be set
                            expect(view.refreshing).toBe(false);
                        });
                    }); 
                    
                    it("should cancel the edit if we return false", function(){
                        var called = false;
                        
                        runs(function() {
                            plugin.on('validateedit', function(){
                                return false;
                            });
                            plugin.on('edit', function(p, context){
                                called = true;
                            });
                            
                            startEditing(0, 0);
                        });
                        
                        runs(function() {
                            plugin.completeEdit();
                            
                            expect(plugin.editing).toBe(false);
                            expect(called).toBe(false);
                        });
                    });
                    
                    it("should cancel the edit if we set context.cancel", function(){
                        var called = false;

                        plugin.on('validateedit', function(p, context){
                            context.cancel = true;
                        });
                        plugin.on('edit', function(p, context){
                            called = true;
                        });
                        triggerCellMouseEvent('dblclick', 0, 0);
                        plugin.completeEdit();
                        expect(plugin.editing).toBe(false);
                        expect(called).toBe(false);
                    });
                });
                
                describe("edit", function(){
                    it("should fire the edit event", function(){
                        var called = false;

                        plugin.on('edit', function(p, context){
                            called = true;
                        });
                        triggerCellMouseEvent('dblclick', 0, 0);
                        plugin.completeEdit();
                        expect(plugin.editing).toBe(false);
                        expect(called).toBe(true);
                    });  
                    
                    it("should pass the plugin and the context", function(){
                        var p, context;

                        plugin.on('edit', function(a1, a2){
                            p = a1;
                            context = a2;
                        });
                        triggerCellMouseEvent('dblclick', 0, 0);
                        plugin.getActiveEditor().field.setValue('foo');
                        plugin.completeEdit();
                        expect(p).toBe(plugin);
                        expect(context.colIdx).toBe(0);
                        expect(context.column).toBe(colRef[0]);
                        expect(context.field).toBe('field1');
                        expect(context.grid).toBe(grid);
                        expect(context.originalValue).toBe('1.1');
                        expect(context.record).toBe(getRec(0));
                        expect(context.row).toBe(view.getRow(0));
                        expect(context.rowIdx).toBe(0);
                        expect(context.store).toBe(store);
                        expect(context.value).toBe('foo');
                    });
                    
                    it("should update the value in the model", function(){

                        triggerCellMouseEvent('dblclick', 0, 0);
                        plugin.getActiveEditor().field.setValue('foo');
                        plugin.completeEdit();
                        expect(getRec(0).get('field1')).toBe('foo');
                    });
                });

                describe('beforerefresh', function () {
                    it('should check for the presence of dom.parentNode before executing beforeViewRefresh callback', function () {
                        // See EXTJSIV-12487 && EXTJSIV-11713.
                        var column = grid.visibleColumnManager.getColumns()[0],
                            dummy = jasmine.createSpy('dummy');

                        store.on('sort', dummy);

                        plugin.startEdit(0, 0);

                        // dom.parentNode will be removed in CellEditor.beforeViewRefresh().
                        column.sort();
                        // Sorting again (and refreshing the view) would trigger the bug.
                        column.sort();

                        expect(dummy.callCount).toBe(2);

                        store.un('sort', dummy);
                    });
                });
            });

            describe("positioning", function() {
                function getCellXY(rowIdx, colIdx) {
                    return Ext.fly(view.getCell(store.getAt(rowIdx), colRef[colIdx])).getXY();
                }

                it("should position correctly on first render", function() {
                    makeGrid();
                    triggerCellMouseEvent('dblclick', 0, 3);
                    expect(plugin.getActiveEditor().getXY()).toEqual(getCellXY(0, 3));
                });

                it("should position correctly on subsequent shows", function() {
                    makeGrid();
                    triggerCellMouseEvent('dblclick', 0, 3);
                    plugin.getActiveEditor().completeEdit();
                    triggerCellMouseEvent('dblclick', 0, 0);
                    expect(plugin.getActiveEditor().getXY()).toEqual(getCellXY(0, 0));
                    plugin.completeEdit();
                    triggerCellMouseEvent('dblclick', 2, 1);
                    expect(plugin.getActiveEditor().getXY()).toEqual(getCellXY(2, 1));
                });
            });
            
            describe("dynamic editors", function(){
                beforeEach(function() {
                    // Suppress console warnings about Trigger field being deprecated
                    spyOn(Ext.log, 'warn');
                });
                
                it("should allow the editor to change dynamically", function(){
                    makeGrid();
                    colRef[0].setEditor(new Ext.form.field.Trigger());
                    triggerCellMouseEvent('dblclick', 0, 0);
                    expect(plugin.getActiveEditor().field.getXType()).toBe('triggerfield');
                });
                
                it("should allow the editor to change in the beforeedit event", function() {
                    makeGrid();
                    plugin.on('beforeedit', function(){
                        colRef[0].setEditor(new Ext.form.field.Trigger());
                    });  
                    triggerCellMouseEvent('dblclick', 0, 0);
                    expect(plugin.getActiveEditor().field.getXType()).toBe('triggerfield');
                });
                
                it("should allow us to set an editor if one wasn't there before", function() {
                    var called = false;
                    makeGrid([{
                        dataIndex: 'field1'
                    }, {
                        dataIndex: 'field2',
                        field: 'textfield'
                    }]);
                    colRef = grid.getColumnManager().getColumns();
                    colRef[0].setEditor(new Ext.form.field.Text());
                    plugin.on('beforeedit', function() {
                        called = true;
                    });
                    triggerCellMouseEvent('dblclick', 0, 0);
                    expect(called).toBe(true);
                });
                
                it("should allow us to clear out an editor", function() {
                    var called = false;
                    makeGrid();
                    colRef[0].setEditor(null);
                    plugin.on('beforeedit', function() {
                        called = true;
                    });
                    triggerCellMouseEvent('dblclick', 0, 0);
                    expect(called).toBe(false);
                });
                
                it("should destroy the old field", function() {
                    var field = new Ext.form.field.Text();
                    
                    makeGrid([{
                        dataIndex: 'field1',
                        field: field
                    }]);    
                    colRef = grid.getColumnManager().getColumns();
                    colRef[0].setEditor(new Ext.form.field.Text());
                    expect(field.destroyed).toBe(true);
                });
            });
            
            describe("hidden columns", function(){
                beforeEach(function(){
                    makeGrid([{
                        dataIndex: 'field1',
                        field: {
                            xtype: 'textfield',
                            itemId: 'field1'
                        }
                    }, {
                        hidden: true,
                        dataIndex: 'field2',
                        field: {
                            xtype: 'textfield',
                            itemId: 'field2'
                        }
                    }, {
                        hidden: true,
                        dataIndex: 'field3',
                        field: {
                            xtype: 'textfield',
                            itemId: 'field3'
                        }
                    }, {
                        dataIndex: 'field4',
                        field: {
                            xtype: 'textfield',
                            itemId: 'field4'
                        }
                    }, {
                        dataIndex: 'field5',
                        field: {
                            xtype: 'textfield',
                            itemId: 'field5'
                        }
                    }, {
                        hidden: true,
                        dataIndex: 'field6',
                        field: {
                            xtype: 'textfield',
                            itemId: 'field6'
                        }
                    }, {
                        dataIndex: 'field7',
                        field: {
                            xtype: 'textfield',
                            itemId: 'field7'
                        }
                    }]);
                    colRef = grid.getColumnManager().getColumns();
                });
                
                it("should start the edit before any hidden columns", function(){
                    var c;
                    plugin.on('beforeedit', function(p, context){
                        c = context;
                    });
                    triggerCellMouseEvent('dblclick', 0, 0);
                    expect(c.column).toBe(colRef[0]);
                    expect(c.value).toBe('1.1');
                });
                
                it("should start the edit in between hidden columns", function(){
                    var c;
                    plugin.on('beforeedit', function(p, context){
                        c = context;
                    });
                    triggerCellMouseEvent('dblclick', 0, 3);
                    expect(c.column).toBe(colRef[3]);
                    expect(c.value).toBe('1.4');
                });
                
                it("should start the edit after hidden columns", function(){
                    var c;
                    plugin.on('beforeedit', function(p, context){
                        c = context;
                    });
                    triggerCellMouseEvent('dblclick', 0, 6);
                    expect(c.column).toBe(colRef[6]);
                    expect(c.value).toBe('1.7');
                });
                
                describe("calling on a hidden column", function() {
                    it("should choose the next visible column when called on a hidden column", function() {
                        var c;
                        plugin.on('beforeedit', function(p, context){
                            c = context;
                        });
                        plugin.startEditByPosition({
                            row: 0,
                            column: 1
                        });
                        expect(c.column).toBe(colRef[3]);
                    });
                    
                    it("should use a previous visible column if next is not available", function() {
                        colRef[6].hide();
                        var c;
                        plugin.on('beforeedit', function(p, context){
                            c = context;
                        });
                        plugin.startEditByPosition({
                            row: 0,
                            column: 5
                        });
                        expect(c.column).toBe(colRef[4]);
                    });
                });
                
                describe("dynamic", function(){
                    it("should trigger an edit after showing the column", function(){
                        colRef[2].show();
                        var c;
                        plugin.on('beforeedit', function(p, context){
                            c = context;
                        });
                        triggerCellMouseEvent('dblclick', 0, 2);
                        expect(c.column).toBe(colRef[2]);
                        expect(c.value).toBe('1.3');
                    });  
                    
                    it("should trigger an edit after hiding a column", function(){
                        colRef[3].hide();
                        var c;
                        plugin.on('beforeedit', function(p, context){
                            c = context;
                        });
                        triggerCellMouseEvent('dblclick', 0, 4);
                        expect(c.column).toBe(colRef[4]);
                        expect(c.value).toBe('1.5');
                    });  
                });
            });
            
            describe("locking", function(){
                beforeEach(function(){
                    makeGrid([{
                        locked: true,
                        dataIndex: 'field1',
                        field: {
                            xtype: 'textfield'
                        }
                    }, {
                        locked: true,
                        dataIndex: 'field2',
                        field: {
                            xtype: 'textfield'
                        }
                    }, {
                        dataIndex: 'field3',
                        field: {
                            xtype: 'textfield'
                        }
                    }, {
                        dataIndex: 'field4',
                        field: {
                            xtype: 'textfield'
                        }
                    }]);
                    colRef = grid.getColumnManager().getColumns();
                });
                
                // The API clones the plugins, need to do weird
                // stuff to actually access the events. Gross.
                it("should trigger an edit on the locked part", function(){
                    var context,
                        activeView = grid.lockedGrid.getView();

                    plugin = grid.plugins[0];
                    plugin.on('beforeedit', function(a1, a2){
                        context = a2;
                    });
                    triggerCellMouseEvent('dblclick', 0, 0);
                    expect(context.colIdx).toBe(0);
                    expect(context.column).toBe(colRef[0]);
                    expect(context.field).toBe('field1');
                    expect(context.grid).toBe(grid.lockedGrid);
                    expect(context.originalValue).toBe('1.1');
                    expect(context.record).toBe(getRec(0));
                    expect(context.row).toBe(activeView.getRow(0));
                    expect(context.rowIdx).toBe(0);
                    expect(context.store).toBe(store);
                    expect(context.value).toBe('1.1');

                    // CellEditors should be rendered into the grid view which they are editing, and should scroll along with the view.
                    expect(plugin.getActiveEditor().el.dom.parentNode).toBe(context.cell);
                });

                it("should trigger an edit on the unlocked part", function(){
                    var context,
                        activeView = grid.normalGrid.getView();

                    plugin = grid.plugins[0];
                    plugin.on('beforeedit', function(a1, a2){
                        context = a2;
                    });
                    triggerCellMouseEvent('dblclick', 0, 3);
                    // Local col idx
                    expect(context.colIdx).toBe(1);
                    expect(context.column).toBe(colRef[3]);
                    expect(context.field).toBe('field4');
                    expect(context.grid).toBe(grid.normalGrid);
                    expect(context.originalValue).toBe('1.4');
                    expect(context.record).toBe(getRec(0));
                    expect(context.row).toBe(activeView.getRow(0));
                    expect(context.rowIdx).toBe(0);
                    expect(context.store).toBe(store);
                    expect(context.value).toBe('1.4');

                    // CellEditors should be rendered into the grid view which they are editing, and should scroll along with the view.
                    expect(plugin.getActiveEditor().el.dom.parentNode).toBe(context.cell);
                });

                it("should move the editor when a column is locked", function(){
                    var context,
                        activeView = grid.normalGrid.getView();

                    plugin = grid.plugins[0];
                    plugin.on({
                        beforeedit: function(a1, a2){
                            context = a2;
                        }
                    });
                    triggerCellMouseEvent('dblclick', 0, 2);

                    // CellEditors should be rendered into the grid view which they are editing, and should scroll along with the view.
                    expect(plugin.getActiveEditor().el.dom.parentNode).toBe(context.cell);

                    plugin.completeEdit();

                    grid.lock(colRef[2]);
                    activeView = grid.lockedGrid.getView();

                    // Edit the same column. It's now in the locked side.
                    // Everything should still work
                    triggerCellMouseEvent('dblclick', 0, 2);
                    // Local col idx
                    expect(context.colIdx).toBe(2);
                    expect(context.column).toBe(colRef[2]);
                    expect(context.field).toBe('field3');
                    expect(context.grid).toBe(grid.lockedGrid);
                    expect(context.originalValue).toBe('1.3');
                    expect(context.record).toBe(getRec(0));
                    expect(context.row).toBe(activeView.getRow(activeView.all.first()));
                    expect(context.rowIdx).toBe(0);
                    expect(context.store).toBe(store);
                    expect(context.value).toBe('1.3');

                    // CellEditors should be rendered into the grid view which they are editing, and should scroll along with the view.
                    expect(plugin.getActiveEditor().el.dom.parentNode).toBe(context.cell);
                });
            });
            
            describe("reconfigure", function() {
                var old;
                beforeEach(function() {
                    makeGrid();
                    old = [];
                    Ext.Array.forEach(grid.getColumnManager().getColumns(), function(col) {
                        old.push(col.getEditor());    
                    });
                    grid.reconfigure(null, [{
                        dataIndex: 'field1',
                        field: {
                            id: 'newEd'
                        }
                    }, {
                        dataIndex: 'field2'
                    }]);
                    colRef = grid.getColumnManager().getColumns();
                });
                
                it("should destroy old editors", function() {
                    Ext.Array.forEach(old, function(item){
                        expect(item.destroyed).toBe(true);    
                    });
                });
                
                it("should update columns with no editors", function() {
                    triggerCellMouseEvent('dblclick', 0, 1);
                    expect(plugin.editing).toBeFalsy();
                });  
                
                it("should use new editors", function() {
                    triggerCellMouseEvent('dblclick', 0, 0);
                    expect(plugin.getActiveEditor().field.getId()).toBe('newEd');
                    expect(plugin.editing).toBe(true);
                });
            });
            
            describe("key handling", function() {
                beforeEach(function() {
                    makeGrid();
                });
                
                it("should move to the next cell when tabbing", function() {
                    startEditing(0, 0);
                    
                    runs(function() {
                        plugin.getActiveEditor().field.setValue('foobar');
                        triggerEditorKey(TAB);
                    });

                    // https://sencha.jira.com/browse/EXTJS-17224
                    // We need to wait for the beforeitemupdate to push the CellEditor out
                    // And the asynchronous blur to happen to test this bug.
                    waits(100);

                    // New editor should be visible and focused
                    waitsFor(function() {
                        // The next editor must be the active one and must be focused
                        return plugin.getActiveColumn() === colRef[1] && Ext.Element.getActiveElement() === plugin.getActiveEditor().field.inputEl.dom;
                    });
                });
                
                it("should move to the next row if at the last cell", function() {
                    startEditing(0, 4);
                    
                    runs(function() {
                        triggerEditorKey(TAB);
                    });
                    
                    waitsFor(function() {
                        return plugin.getActiveColumn() === colRef[0] &&
                               plugin.getActiveRecord() === getRec(1);
                   });
                });
                
                it("should complete the edit on enter", function() {
                    startEditing(1, 1);
                    
                    runs(function() {
                        plugin.getActiveEditor().field.setValue('foo');
                        plugin.getActiveEditor().specialKeyDelay = 0;
                        
                        triggerEditorKey(ENTER);
                        
                        expect(getRec(1).get('field2')).toBe('foo');
                    });
                });
                
                it("should cancel the edit on ESC", function() {
                    startEditing(1, 1);
                    
                    runs(function() {
                        plugin.getActiveEditor().field.setValue('foo');
                        plugin.getActiveEditor().specialKeyDelay = 0;
                        triggerEditorKey(ESC);
                        expect(getRec(1).get('field2')).toBe('2.2');
                    });
                });
                
                it('should navigate to the other side when tabbing at a locking boundary', function() {
                    grid.destroy();
                    makeGrid([{
                        locked: true,
                        dataIndex: 'field1',
                        field: {
                            xtype: 'textfield'
                        }
                    }, {
                        dataIndex: 'field4',
                        field: {
                            xtype: 'textfield'
                        }
                    }]);

                    startEditing(0, 0);
                    
                    runs(function() {

                        // We should be editing in the locked side
                        expect(plugin.getActiveEditor().context.view === grid.lockedGrid.view).toBe(true);
                        expect(plugin.getActiveEditor().context.isEqual(grid.lockedGrid.view.actionPosition)).toBe(true);

                        // This should Tab into the normal side
                        triggerEditorKey(TAB);
                    });

                    // Wait for the active editor's context's view to be the normal view
                    waitsFor(function() {
                        return plugin.getActiveEditor().context.view === grid.normalGrid.view;
                    });
                    runs(function() {
                        // locked grid's actiobPosition is null indicating that it does not contain the action position
                        // even though it is actionable mode
                        expect(grid.lockedGrid.view.actionPosition).toBeNull();
                        expect(plugin.getActiveEditor().context.isEqual(grid.normalGrid.view.actionPosition)).toBe(true);
                    });
                });
            });
            
            describe("misc", function() {
                it("should not have the editors participate as part of a form", function() {
                    makeGrid(undefined, undefined, {
                        renderTo: null
                    });
                    var form = new Ext.form.Panel({
                        renderTo: Ext.getBody(),
                        items: [{
                            name: 'foo',
                            xtype: 'textfield',
                            value: 'v1'
                        }, {
                            name: 'bar',
                            xtype: 'textfield',
                            value: 'v2'
                        }, grid]
                    });
                        
                    triggerCellMouseEvent('dblclick', 0, 0);
                        
                    var values = form.getForm().getValues();
                    expect(values).toEqual({
                        foo: 'v1',
                        bar: 'v2'
                    });
                        
                    form.destroy();
                });  
            });

            describe("locking with group headers", function() {
                it("should start edit after moving a locked column to a group header in the unlocked view (EXTJSIV-11294)", function() {
                    makeGrid([{ 
                        dataIndex: 'name', 
                        locked: true, 
                        editor: 'textfield' 
                    }, {
                        itemId: 'ct',
                        columns: [{ 
                            dataIndex: 'email', 
                            flex: 1 
                        }, {
                            dataIndex: 'phone' 
                        }] 
                    }]);

                    var headerCt = grid.headerCt;

                    grid.unlock(headerCt.getHeaderAtIndex(0), 1, grid.down('#ct'));
                    plugin = grid.view.editingPlugin;
                    plugin.startEdit(0, 1);
                    expect(plugin.editing).toBe(true);
                    expect(plugin.getActiveColumn()).toBe(headerCt.getHeaderAtIndex(1));
                    expect(plugin.getActiveRecord()).toBe(store.getAt(0));
                });
            });

            describe('Autorepeat TAB in ungrouped grid', function() {
                function isEditing(rowIndex, columnIndex) {
                    return plugin.editing && plugin.activeColumn === colRef[columnIndex] && plugin.activeRecord === store.getAt(rowIndex);
                }

                var buttonFocused = false;

                beforeEach(function() {
                    makeGrid();
                    grid.addDocked({
                        dock: 'top',
                        xtype: 'toolbar',
                        items: [{
                            text: "button",
                            listeners: {
                                focus: function() {
                                    buttonFocused = true;
                                }
                            }
                        }]
                    });
                    // Make last column non editable
                    delete colRef[4].field;
                });

                // Only Webkit is good enough to run these fast event firing tests
                webkitIt('should not lose track of editing position during repeated tabbing', function() {
                    // Begin editing 1.1

                    triggerCellMouseEvent('dblclick', 0, 0);
                    waitsFor(function() {
                        return isEditing(0, 0);
                    });
                    runs(function() {
                        expect(plugin.editing).toBe(true);
                        // Tab to 1.2
                        jasmine.fireKeyEvent(Ext.Element.getActiveElement(), 'keydown', TAB);
                    });
                    waitsFor(function() {
                        return isEditing(0, 1);
                    }, 'move to cell 0, 1');
                    runs(function() {
                        // Tab to 1.3
                        jasmine.fireKeyEvent(Ext.Element.getActiveElement(), 'keydown', TAB);
                    });
                    waitsFor(function() {
                        return isEditing(0, 2);
                    }, 'move to cell 0, 2');
                    runs(function() {
                        // Tab to 1.4
                        jasmine.fireKeyEvent(Ext.Element.getActiveElement(), 'keydown', TAB);
                    });
                    waitsFor(function() {
                        return isEditing(0, 3);
                    }, 'move to cell 0, 3');
                    runs(function() {
                        // Tab to 1.5. This is not editiable, so will skip to 1, 0
                        jasmine.fireKeyEvent(Ext.Element.getActiveElement(), 'keydown', TAB);
                    });
                    waitsFor(function() {
                        return isEditing(1, 0);
                    }, 'move to cell 1, 0');
                    runs(function() {
                        // Tab to 2.2
                        jasmine.fireKeyEvent(Ext.Element.getActiveElement(), 'keydown', TAB);
                    });
                    waitsFor(function() {
                        return isEditing(1, 1);
                    }, 'move to cell 1, 1');
                    runs(function() {
                        // Tab to 2.3
                        jasmine.fireKeyEvent(Ext.Element.getActiveElement(), 'keydown', TAB);
                    });
                    waitsFor(function() {
                        return isEditing(1, 2);
                    }, 'move to cell 1, 2');
                    runs(function() {
                        // Tab to 2.4
                        jasmine.fireKeyEvent(Ext.Element.getActiveElement(), 'keydown', TAB);
                    });
                    waitsFor(function() {
                        return isEditing(1, 3);
                    }, 'move to cell 1, 3');
                    runs(function() {
                        // Tab to 2.5. This is not editiable, so will skip to 2, 0
                        jasmine.fireKeyEvent(Ext.Element.getActiveElement(), 'keydown', TAB);
                    });
                    waitsFor(function() {
                        return isEditing(2, 0);
                    }, 'move to cell 2, 0');
                    runs(function() {

                        // Focus sohuld not have escaped from the grid into the button
                        expect(buttonFocused).toBe(false);

                        // Check that the navigation did exactly what we expected
                        expect(plugin.getActiveColumn()).toBe(colRef[0]);
                        expect(plugin.getActiveRecord()).toBe(store.getAt(2));
                    });
                }); // eo: it
            });

            describe('Autorepeat TAB in grouped grid', function() {
                webkitIt("should not lose track of editing position when autotabbing over group headers", function() {
                    makeGrid([{
                        dataIndex: 'field1',
                        editor: 'textfield'
                    }, {
                        dataIndex: 'field2',
                        editor: 'textfield'
                    }, {
                        dataIndex: 'field3',
                        editor: 'textfield'
                    }], {}, {
                        features: {
                            ftype: 'grouping'
                        }
                    });
                    plugin.startEdit(0, 0);
                    expect(plugin.editing).toBe(true);

                    // Check we are at 0,0
                    expect(plugin.getActiveColumn()).toBe(colRef[0]);
                    expect(plugin.getActiveRecord()).toBe(store.getAt(0));

                    // To 0,1
                    jasmine.fireKeyEvent(Ext.Element.getActiveElement(), 'keydown', TAB);
                    waits(20);
                    runs(function() {
                        // To 0,2
                        jasmine.fireKeyEvent(Ext.Element.getActiveElement(), 'keydown', TAB);
                    });
                    waits(20);
                    runs(function() {
                        // To 1,0
                        jasmine.fireKeyEvent(Ext.Element.getActiveElement(), 'keydown', TAB);
                    });
                    waits(20);
                    runs(function() {
                        expect(plugin.getActiveColumn()).toBe(colRef[0]);
                        expect(plugin.getActiveRecord()).toBe(store.getAt(1));
                    });
                });
            });

            describe('refreshing view', function() {
                beforeEach(function(){
                    // Must wait for async focus events from previous suite to complete.
                    waits(10);
                    
                    runs(function() {
                        makeGrid();
                    });
                });

                it('CellEditor should survive a refresh in active state', function() {
                    var refreshCounter;

                    plugin.startEdit(0, 0);
                    expect(plugin.editing).toBe(true);
                    expect(plugin.getActiveEditor().isVisible()).toBe(true);

                    refreshCounter = view.refreshCounter;
                    view.refresh();
                    
                    // A refresh must have taken place
                    expect(view.refreshCounter).toEqual(refreshCounter + 1);

                    // Editing must still be active
                    expect(plugin.editing).toBe(true);
                    expect(plugin.getActiveEditor().isVisible()).toBe(true);
                });
            });

            describe('Dragging out of an active cell editor in a locking view, and mouseup in the locking partner view', function() {
                it('should not throw an error when dragging out of an active cell editor in a locking view, and mouseup in the locking partner view', function() {
                    makeGrid([{
                        locked: true,
                        dataIndex: 'field1',
                        field: {
                            xtype: 'textfield'
                        }
                    }, {
                        locked: true,
                        dataIndex: 'field2',
                        field: {
                            xtype: 'textfield'
                        }
                    }, {
                        dataIndex: 'field3',
                        field: {
                            xtype: 'textfield'
                        }
                    }, {
                        dataIndex: 'field4',
                        field: {
                            xtype: 'textfield'
                        }
                    }]);
                    plugin = grid.view.editingPlugin;
                    colRef = grid.getColumnManager().getColumns();
                    var cell00 = findCell(0, 0),
                        cell00xy = Ext.fly(cell00).getAnchorXY('c'),
                        inputField,
                        editorxy;

                    plugin.startEdit(0, 0);
                    expect(plugin.editing).toBe(true);
                    expect(plugin.getActiveEditor().isVisible()).toBe(true);

                    // Mousedown in the input field, and drag accross to the other side
                    inputField = plugin.getActiveEditor().field.inputEl.dom;
                    editorxy = Ext.fly(inputField).getAnchorXY('c');
                    jasmine.fireMouseEvent(inputField, 'mousedown', editorxy[0], editorxy[1]);
                    jasmine.fireMouseEvent(inputField, 'mousemove', editorxy[0], editorxy[1]);
                    jasmine.fireMouseEvent(cell00, 'mousemove', cell00xy[0], cell00xy[1]);
                    jasmine.fireMouseEvent(cell00, 'mouseup', cell00xy[0], cell00xy[1]);
                });
            });

            describe('Single column editing using a single editor', function() {
                function isEditing(rowIndex, columnIndex) {
                    return plugin.editing && plugin.activeColumn === colRef[columnIndex] && plugin.activeRecord === store.getAt(rowIndex);
                }

                webkitIt('should use the same editor for same typed cells, and not blur between edits', function() {
                    grid = new Ext.grid.property.Grid({
                        renderTo: document.body,
                        width: 300,
                        source: {
                            '(name)': 'Properties Grid',
                            autoFitColumns: true,
                            borderWidth: 1,
                            created: Ext.Date.parse('10/15/2006', 'm/d/Y'),
                            grouping: false,
                            productionQuality: false,
                            tested: false,
                            version: 0.01
                        }
                    });
                    colRef = grid.getColumnManager().getColumns();
                    plugin = grid.view.editingPlugin;
                    store = grid.store;

                    var activeEditor,
                        lastActiveEditor;

                    plugin.startEdit(3, 1);
                    
                    waitsFor(function() {
                        return isEditing(3, 1);
                    }, 'move to cell 3, 1');
                    
                    runs(function() {
                        expect(plugin.editing).toBe(true);
                        activeEditor = plugin.getActiveEditor();
                        expect(activeEditor.isVisible()).toBe(true);

                        // Tab down from "created" to "grouping"
                        jasmine.fireKeyEvent(activeEditor.field.inputEl, 'keydown', TAB);
                    });

                    waitsFor(function() {
                        return isEditing(4, 1);
                    }, 'move to cell 4, 1');
                    
                    runs(function() {

                        // A different editor should be active on "grouping".
                        expect(plugin.getActiveEditor()).not.toBe(activeEditor);
                        activeEditor = plugin.getActiveEditor();
                        expect(activeEditor.isVisible()).toBe(true);
                        expect(activeEditor.field.getValue()).toEqual(false);
                        activeEditor.on({
                            complete: function() {
                                lastActiveEditor = activeEditor;
                            }
                        });

                        // Tab down from "grouping" to "productionQuality"
                        jasmine.fireKeyEvent(activeEditor.field.inputEl, 'keydown', TAB);
                    });

                    waitsFor(function() {
                        return isEditing(5, 1);
                    }, 'move to cell 5, 1');
                    
                    runs(function() {

                        // The same editor should be active on "productionQuality", and it should not have blurred
                        expect(plugin.getActiveEditor()).toBe(activeEditor);
                        expect(activeEditor.isVisible()).toBe(true);
                        expect(activeEditor.field.getValue()).toEqual(false);

                        // Tab down from "productionQuality" to "QA"
                        jasmine.fireKeyEvent(activeEditor.field.inputEl, 'keydown', TAB);
                    });

                    waitsFor(function() {
                        return isEditing(6, 1);
                    }, 'move to cell 6, 1');
                    
                    runs(function() {

                        // The same editor should be active on "QA", and it should not have blurred
                        expect(plugin.getActiveEditor()).toBe(activeEditor);
                        expect(activeEditor.isVisible()).toBe(true);
                        expect(activeEditor.field.getValue()).toEqual(false);

                        // Tab down from "QA" to "version"
                        jasmine.fireKeyEvent(activeEditor.field.inputEl, 'keydown', TAB);
                    });

                    waitsFor(function() {
                        return isEditing(7, 1);
                    }, 'move to cell 7, 1');

                    runs(function() {

                        // A different editor should be active on "version"
                        expect(plugin.getActiveEditor()).not.toBe(activeEditor);

                        // To avoid focus leaving the panel, it's hidden only after the new editor takes focus.
                        activeEditor = plugin.getActiveEditor();
                        expect(activeEditor.isVisible()).toBe(true);
                        expect(activeEditor.field.getValue()).toEqual(0.01);

                        // At this time, the previously active editor should have been hidden
                        expect(lastActiveEditor.isVisible()).toBe(false);
                    });
                });
            });

            describe("with combos", function() {
                it("should retain the value when tabbing and not modifying the value after reusing the editor", function() {
                    makeGrid([{
                        dataIndex: 'field1',
                        editor: {
                            xtype: 'combobox',
                            store: ['Foo', 'Bar', 'Baz']
                        }
                    }]);
                    plugin.startEditByPosition({
                        row: 0,
                        column: 0
                    });
                    var field = plugin.getActiveEditor().field;
                    jasmine.waitForFocus(field);
                    runs(function() {
                        // Trigger combo to expand, then down to last value
                        jasmine.fireKeyEvent(field.inputEl, 'keydown', Ext.event.Event.DOWN);
                        jasmine.fireKeyEvent(field.inputEl, 'keydown', Ext.event.Event.DOWN);
                        jasmine.fireKeyEvent(field.inputEl, 'keydown', Ext.event.Event.DOWN);
                        // Begin edit on next field
                        jasmine.fireKeyEvent(field.inputEl, 'keydown', Ext.event.Event.TAB);
                        expect(store.getAt(0).get('field1')).toBe('Baz');
                    });
                    jasmine.waitForFocus(field);
                    runs(function() {
                        jasmine.fireKeyEvent(field.inputEl, 'keydown', Ext.event.Event.TAB);
                        expect(store.getAt(1).get('field1')).toBe('2.1');
                    });
                });
        });
        });
    }
    createSuite(false);
    createSuite(true);

    describe("misc", function() {
        describe("property grid editing with textfield and triggerfield - blurring test", function() {
            var tree, cellEditing;

            beforeEach(function() {
                tree = new Ext.tree.Panel({
                    height:100,
                    root:{
                        text: 'node1',
                        expanded: true,
                        children: [{
                            text:'node2',
                            leaf:true
                        }]
                    },
                    width: 200,
                    viewConfig: {
                        plugins: {
                            pluginId: 'ddPlug',
                            ptype: 'treeviewdragdrop'
                        }
                    },
                    renderTo: document.body
                });

                grid = new Ext.grid.property.Grid({
                    width: 200,
                    height: 200,
                    renderTo: document.body,
                    source: {
                        text: "abc",
                        autoFitColumns: true
                    }
                });
                cellEditing = grid.findPlugin('cellediting');
            });
            afterEach(function() {
                Ext.destroy(tree, grid);
            });

            webkitIt("should blur and hide the cell editor on focusing the tree", function() {
                var cell01_editor;

                // Wait until the grid has rendered rows
                waitsFor(function() {
                    return grid.view.all.getCount();
                });
                runs(function() {
                    // Invoke the textfield editor
                    triggerCellMouseEvent('click', 0, 1);
                });

                // Wait for editing to begin
                waitsFor(function() {
                    cell01_editor = cellEditing.editors.items[0];
                    return cell01_editor.isVisible() && cell01_editor.editing;
                });
                
                runs(function() {
                    // Focus the tree. Should blur and hide the editor
                    tree.getView().getNavigationModel().setPosition(0);
                });

                // Wait for the blur handler to hide the editor
                waitsFor(function() {
                    return cell01_editor.isVisible() === false;
                }, 'grid cell editor to hide');

                runs(function() {
                    jasmine.fireMouseEvent(tree.view.getNode(1), 'mouseup');

                    // Invoke the triggerfield editor
                    triggerCellMouseEvent('click', 1, 1);
                    expect(cellEditing.editors.items[1].isVisible()).toBe(true);

                    // Focus the tree. Should blur and hide the editor
                    tree.getNavigationModel().setPosition(0, 0);
                });

                // Wait for the blur handler to hide the editor
                waitsFor(function() {
                    return cellEditing.editors.items[1].isVisible() === false;
                }, 'second grid cell editor to hide');
                runs(function() {
                    jasmine.fireMouseEvent(tree.view.getNode(1), 'mouseup');
                });
            });
        });
    });
});