describe("Ext.grid.selection.SpreadsheetModel", function() {
    
    var grid, view, store, selModel, colRef,
        // Unreliable synthetic events on IE.
        // SelModel tests are not broiwser-dependent though
        smDescribe = Ext.isIE ? xdescribe : describe,
        synchronousLoad = true,
        proxyStoreLoad = Ext.data.ProxyStore.prototype.load,
        loadStore;
    
    function triggerCellMouseEvent(type, rowIdx, cellIdx, button, x, y) {
        var target = findCell(rowIdx, cellIdx);
        jasmine.fireMouseEvent(target, type, x, y, button);
    }
    
    function findCell(rowIdx, cellIdx) {
        return view.getCell(rowIdx, colRef[cellIdx]);
    }

    function isCellSelected(row, col) {
        return view.getSelectionModel().isCellSelected(view, row, col);
    }

    function isColumnSelected(index) {
        var colCells = view.el.query(colRef[index].getCellSelector()),
            len = colCells.length,
            i;

        for (i = 0; i < len; i++) {
            if (!Ext.fly(colCells[i]).hasCls(view.selectedCellCls)) {
                return false;
            }
        }
        return true;
    }

    function isRowSelected(index) {
        return view.getSelectionModel().isSelected(index);
    }

    function clickRowNumberer(index, ctrlKey) {
        var target = findCell(index, 0);
        jasmine.fireMouseEvent(target, 'click', null, null, null, null, ctrlKey);
    }

    function spyOnEvent(object, eventName, fn) {
        var obj = {
            fn: fn || Ext.emptyFn
        },
        spy = spyOn(obj, 'fn');

        object.addListener(eventName, obj.fn);
        return spy;
    }

    function makeGrid(columns, cfg, selModelCfg, storeCfg, locked) {
        Ext.define('spec.SpreadsheetModel', {
            extend: 'Ext.data.Model',
            fields: [
                'field1',
                'field2',
                'field3',
                'field4',
                'field5'
            ]
        });

        selModel = new Ext.grid.selection.SpreadsheetModel(Ext.apply({
            dragSelect: true,
            cellSelect: true,
            columnSelect: true,
            rowSelect: true,
            checkboxSelect: false
        }, selModelCfg));
        
        var data = [],
            defaultCols = [],
            i;
        
        if (!columns) {
            for (i = 1; i <= 5; ++i) {
                defaultCols.push({
                    name: 'F' + i,
                    dataIndex: 'field' + i,

                    // First column locked if locked passed
                    locked: locked && i === 1
                });
            }
        }
            
        for (i = 1; i <= 10; ++i) {
            if (storeCfg && storeCfg.numeric) {
                data.push({
                    field1: i * 10 + 1,
                    field2: i * 10 + 2,
                    field3: i * 10 + 3,
                    field4: i * 10 + 4,
                    field5: i * 10 + 5
                });
            } else {
                data.push({
                    field1: i + '.' + 1,
                    field2: i + '.' + 2,
                    field3: i + '.' + 3,
                    field4: i + '.' + 4,
                    field5: i + '.' + 5
                });
            }
        }

        storeCfg = Ext.apply({
            model: spec.SpreadsheetModel
        }, storeCfg);

        // Apply the generated data to the store, or if a memory proxy, to the proxy
        if (storeCfg.proxy && storeCfg.proxy.type === 'memory' && !storeCfg.proxy.data) {
            storeCfg.proxy.data = data;
        } else if (!('data' in storeCfg)) {
            storeCfg.data = data;
        }

        store = new Ext.data.Store(storeCfg);
        
        grid = new Ext.grid.Panel(Ext.apply({
            columns: columns || defaultCols,
            store: store,
            selModel: selModel,
            width: 600,
            height: 300,
            renderTo: Ext.getBody()
        }, cfg));
        view = grid.getView();
        selModel = grid.getSelectionModel();
        colRef = grid.getColumnManager().getColumns();
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

    afterEach(function(){
        // Undo the overrides.
        Ext.data.ProxyStore.prototype.load = proxyStoreLoad;

        Ext.destroy(grid, store);
        selModel = grid = store = view = null;
        Ext.undefine('spec.SpreadsheetModel');
        Ext.data.Model.schema.clear();
    });

    smDescribe("Non-rendered operation", function() {
        it("should allow reconfiguration before render", function() {
            makeGrid(null, {
                renderTo: null
            });

            // These configs have to work before render
            expect(function() {
                selModel.setRowSelect(false);
                selModel.setRowSelect(true);
                selModel.setColumnSelect(false);
                selModel.setColumnSelect(true);
                selModel.setCellSelect(false);
                selModel.setCellSelect(true);
            }).not.toThrow();
        });
        it("should allow selection of cells before render", function() {
            var cell;

            makeGrid(null, {
                renderTo: null
            });

            selModel.selectCells(cell = new Ext.grid.CellContext(view).setPosition(2, 2), cell);

            grid.render(document.body);
            expect(isCellSelected(2, 2)).toBe(true);
        });
        it("should allow selection of cells before render using array notation", function() {
            makeGrid(null, {
                renderTo: null
            });

            // Maintainer: Array cell specification order is [x, y] (column, row)
            selModel.selectCells([2, 3], [2, 3]);

            grid.render(document.body);

            // Maintainer: isCellSelected param order is (row, column)
            expect(isCellSelected(3, 2)).toBe(true);
        });
        it("should allow selection of records before render", function() {
            makeGrid(null, {
                renderTo: null
            });

            selModel.select(store.getAt(2));

            grid.render(document.body);

            // Should have selected row 2
            expect(view.el.query('.'+view.selectedItemCls).length).toBe(1);
            expect(isRowSelected(2)).toBe(true);
        });
        it("should allow selection of columns before render", function() {
            makeGrid(null, {
                renderTo: null
            });

            selModel.selectColumn(colRef[2]);

            grid.render(document.body);

            // Should have selected all cells under column 2
            expect(view.el.query('.'+view.selectedCellCls).length).toBe(view.el.query(colRef[2].getCellSelector()).length);
            expect(isColumnSelected(2)).toBe(true);
        });
    });

    smDescribe("Select all", function() {
        it("should select all on click of header zero", function() {
            makeGrid();
            var r2c0 = findCell(2, 0);

            jasmine.fireMouseEvent(colRef[0].el.dom, 'click');

            // Should have selected all rows
            expect(view.el.query('.'+view.selectedItemCls).length).toBe(store.getCount());

            jasmine.fireMouseEvent(colRef[0].el.dom, 'click');

            // Should have deselected all rows
            expect(view.el.query('.'+view.selectedItemCls).length).toBe(0);

            jasmine.fireMouseEvent(colRef[0].el.dom, 'click');

            // Should have selected all rows
            expect(view.el.query('.'+view.selectedItemCls).length).toBe(store.getCount());

            // Confirm that row 2 is selected, then click the rownumberer cell in row 2
            expect(selModel.isSelected(2)).toBe(true);
            jasmine.fireMouseEvent(r2c0, 'click', null, null, null, null, true);

            // Should have deselected row 2
            expect(view.el.query('.'+view.selectedItemCls).length).toBe(store.getCount() - 1);
            expect(selModel.isSelected(2)).toBe(false);

            // Now that not all is selected, clicking this should select all again.
            jasmine.fireMouseEvent(colRef[0].el.dom, 'click');

            // Should have selected all cells
            expect(view.el.query('.'+view.selectedItemCls).length).toBe(store.getCount());
        });
    });    

    smDescribe("Column selection", function() {
        it("should select a column on click of a header", function() {
            makeGrid();
            var spy = spyOnEvent(store, "sort").andCallThrough();

            jasmine.fireMouseEvent(colRef[1].el.dom, 'click');

            // Should have selected all cells under column 1
            expect(view.el.query('.'+view.selectedCellCls).length).toBe(view.el.query(colRef[1].getCellSelector()).length);
            expect(isColumnSelected(1)).toBe(true);

            jasmine.fireMouseEvent(colRef[1].el.dom, 'click');

            // Should have deselected all cells
            expect(view.el.query('.'+view.selectedCellCls).length).toBe(0);

            // Activating the header as a column select should NOT sort
            expect(spy).not.toHaveBeenCalled();
        });
        it("should select a column on click of a header and deselect previous columns", function() {
            makeGrid();
            var spy = spyOnEvent(store, "sort").andCallThrough();
            jasmine.fireMouseEvent(colRef[1].el.dom, 'click');

            // Should have selected all cells under column 1
            expect(view.el.query('.'+view.selectedCellCls).length).toBe(view.el.query(colRef[1].getCellSelector()).length);
            expect(isColumnSelected(1)).toBe(true);

            jasmine.fireMouseEvent(colRef[2].el.dom, 'click');

            // Should have selected all cells under column 2
            expect(view.el.query('.'+view.selectedCellCls).length).toBe(view.el.query(colRef[2].getCellSelector()).length);
            expect(isColumnSelected(2)).toBe(true);

            jasmine.fireKeyEvent(colRef[2].el.dom, 'keydown', Ext.event.Event.RIGHT);
            jasmine.fireKeyEvent(colRef[3].el.dom, 'keydown', Ext.event.Event.SPACE);

            // Should have selected all cells under column 3
            expect(view.el.query('.'+view.selectedCellCls).length).toBe(view.el.query(colRef[3].getCellSelector()).length);
            expect(isColumnSelected(3)).toBe(true);

            // Activating the header as a column select should NOT sort
            expect(spy).not.toHaveBeenCalled();
        });
        it("should select a column on CTRL/click of a header and not deselect previous columns", function() {
            makeGrid();
            var spy = spyOnEvent(store, "sort").andCallThrough();
            jasmine.fireMouseEvent(colRef[1].el.dom, 'click');

            // Should have selected all cells under column 1
            expect(view.el.query('.'+view.selectedCellCls).length).toBe(view.el.query(colRef[1].getCellSelector()).length);
            expect(isColumnSelected(1)).toBe(true);

            // CTRL/click
            jasmine.fireMouseEvent(colRef[2].el.dom, 'click', 0, 0, 1, false, true);

            // Should have selected all cells under column 2
            expect(view.el.query('.'+view.selectedCellCls).length).toBe(view.el.query(colRef[1].getCellSelector()).length + view.el.query(colRef[2].getCellSelector()).length);
            expect(isColumnSelected(1)).toBe(true);
            expect(isColumnSelected(2)).toBe(true);

            jasmine.fireKeyEvent(colRef[2].el.dom, 'keydown', Ext.event.Event.RIGHT);
            jasmine.fireKeyEvent(colRef[3].el.dom, 'keydown', Ext.event.Event.SPACE, false, true);

            // Should have selected all cells under column 3
            expect(view.el.query('.'+view.selectedCellCls).length).toBe(view.el.query(colRef[1].getCellSelector()).length + view.el.query(colRef[2].getCellSelector()).length + view.el.query(colRef[3].getCellSelector()).length);
            expect(isColumnSelected(1)).toBe(true);
            expect(isColumnSelected(2)).toBe(true);
            expect(isColumnSelected(3)).toBe(true);

            // Activating the header as a column select should NOT sort
            expect(spy).not.toHaveBeenCalled();
        });
    }); 

    smDescribe("Row selection", function() {
        it("should select a row on click of a rownumberer", function() {
            makeGrid();
            clickRowNumberer(1);

            // Should have selected row 1
            expect(view.el.query('.'+view.selectedItemCls).length).toBe(1);
            expect(isRowSelected(1)).toBe(true);

            jasmine.fireMouseEvent(colRef[1].el.dom, 'click');

            // Should have deselected all rows
            expect(view.el.query('.'+view.selectedItemCls).length).toBe(0);
        });
        it("should select a row on click of a rownumberer and deselect previous rows", function() {
            makeGrid();
            clickRowNumberer(1);

            // Should have selected row 1
            expect(view.el.query('.'+view.selectedItemCls).length).toBe(1);
            expect(isRowSelected(1)).toBe(true);

            clickRowNumberer(2);

            // Should have selected row 2
            expect(view.el.query('.'+view.selectedItemCls).length).toBe(1);
            expect(isRowSelected(2)).toBe(true);

            jasmine.fireKeyEvent(findCell(2, 0), 'keydown', Ext.event.Event.DOWN, null, true);
            jasmine.fireKeyEvent(findCell(3, 0), 'keydown', Ext.event.Event.SPACE);

            // Should have selected row 3
            expect(view.el.query('.'+view.selectedItemCls).length).toBe(1);
            expect(isRowSelected(3)).toBe(true);
        });
        it("should select a rown on CTRL/click of a rownumberer and not deselect previous rows", function() {
            makeGrid();
            clickRowNumberer(1);

            // Should have selected row 1
            expect(view.el.query('.'+view.selectedItemCls).length).toBe(1);
            expect(isRowSelected(1)).toBe(true);

            // CTRL/click
            clickRowNumberer(2, true);

            // Should have selected row 2
            expect(view.el.query('.'+view.selectedItemCls).length).toBe(2);
            expect(isRowSelected(1)).toBe(true);
            expect(isRowSelected(2)).toBe(true);

            // CTRL/DOWN
            jasmine.fireKeyEvent(findCell(2, 0), 'keydown', Ext.event.Event.DOWN, null, true);
            jasmine.fireKeyEvent(findCell(3, 0), 'keydown', Ext.event.Event.SPACE, null, true);

            // Should have selected row 3
            expect(view.el.query('.'+view.selectedItemCls).length).toBe(3);
            expect(isRowSelected(1)).toBe(true);
            expect(isRowSelected(2)).toBe(true);
            expect(isRowSelected(3)).toBe(true);
        });
        it("should fire the selectionchange event when rows are selected and rowSelect is set to false", function() {
            makeGrid();
            clickRowNumberer(1);

            // Should have selected row 1
            expect(view.el.query('.'+view.selectedItemCls).length).toBe(1);
            expect(isRowSelected(1)).toBe(true);
            
            var selChangeSpy = spyOnEvent(grid, 'selectionchange');

            // Disable row selection.
            selModel.setRowSelect(false);

            // Should have deselected all rows
            expect(view.el.query('.'+view.selectedItemCls).length).toBe(0);

            // Should have deselected the selection
            expect(selChangeSpy).toHaveBeenCalled();
        });
        it("should not copy the rownumberer column", function() {
            makeGrid(null, {
                plugins: 'clipboard'
            });
            var clipboard = grid.findPlugin('clipboard'),
                data;

            clickRowNumberer(1);

            // Should have selected row 1
            expect(view.el.query('.'+view.selectedItemCls).length).toBe(1);
            expect(isRowSelected(1)).toBe(true);

            data = clipboard.getData(false, {
                text: 1
            });

            // Only the data should be here, NOT the row number
            expect(data.text).toBe('2.1\t2.2\t2.3\t2.4\t2.5')
        });
    });
    
    describe('Row selection using selectRows', function() {
        it("should select a row and clear previous non-row selections", function() {
            makeGrid();

            // Select a cell rage first.
            // It should drop this selection when we call selectRows
            selModel.selectCells(new Ext.grid.CellContext(view).setPosition(2, 2), new Ext.grid.CellContext(view).setPosition(2, 4));

            // Should have selected the 3 cells spanned
            expect(view.el.query('.'+view.selectedCellCls).length).toBe(3);

            expect( isCellSelected(2, 2) &&
                    isCellSelected(2, 3) &&
                    isCellSelected(2, 4)).toBe(true);

            selModel.selectRows(store.getAt(1));

            // No cells should be selected
            expect(view.el.query('.'+view.selectedCellCls).length).toBe(0);

            // Should have selected row 1
            expect(view.el.query('.'+view.selectedItemCls).length).toBe(1);
            expect(isRowSelected(1)).toBe(true);

            jasmine.fireMouseEvent(colRef[1].el.dom, 'click');

            // Should have deselected all rows
            expect(view.el.query('.'+view.selectedItemCls).length).toBe(0);
        });
        it("should select a row and deselect previous rows", function() {
            makeGrid();

            selModel.selectRows(store.getAt(1));

            // Should have selected row 1
            expect(view.el.query('.'+view.selectedItemCls).length).toBe(1);
            expect(isRowSelected(1)).toBe(true);

            selModel.selectRows(store.getAt(2));

            // Should have selected row 2
            expect(view.el.query('.'+view.selectedItemCls).length).toBe(1);
            expect(isRowSelected(2)).toBe(true);
        });
        it("should select a row and not deselect previous rows", function() {
            makeGrid();

            selModel.selectRows(store.getAt(1));

            // Should have selected row 1
            expect(view.el.query('.'+view.selectedItemCls).length).toBe(1);
            expect(isRowSelected(1)).toBe(true);

            // keepSelection

            selModel.selectRows(store.getAt(2), true);

            // Should have selected row 2
            expect(view.el.query('.'+view.selectedItemCls).length).toBe(2);
            expect(isRowSelected(1)).toBe(true);
            expect(isRowSelected(2)).toBe(true);
        });
        it("should fire the selectionchange event when rows are selected and rowSelect is set to false", function() {
            makeGrid();
            selModel.selectRows(store.getAt(1));

            // Should have selected row 1
            expect(view.el.query('.'+view.selectedItemCls).length).toBe(1);
            expect(isRowSelected(1)).toBe(true);
            
            var selChangeSpy = spyOnEvent(grid, 'selectionchange');

            // Disable row selection.
            selModel.setRowSelect(false);

            // Should have deselected all rows
            expect(view.el.query('.'+view.selectedItemCls).length).toBe(0);

            // Should have deselected the selection
            expect(selChangeSpy).toHaveBeenCalled();
        });
        it("should not copy the rownumberer column", function() {
            makeGrid(null, {
                plugins: 'clipboard'
            });
            var clipboard = grid.findPlugin('clipboard'),
                data;

            selModel.selectRows(store.getAt(1));

            // Should have selected row 1
            expect(view.el.query('.'+view.selectedItemCls).length).toBe(1);
            expect(isRowSelected(1)).toBe(true);

            data = clipboard.getData(false, {
                text: 1
            });

            // Only the data should be here, NOT the row number
            expect(data.text).toBe('2.1\t2.2\t2.3\t2.4\t2.5')
        });
    });
    
    smDescribe("Range selection", function() {
        it("should select a range on drag", function() {
            makeGrid();
            var c2 = findCell(2, 2),
                c4 = findCell(4, 4);

            jasmine.fireMouseEvent(c2, 'mousedown');
            jasmine.fireMouseEvent(c2, 'mousemove');
            jasmine.fireMouseEvent(c4, 'mousemove');
            jasmine.fireMouseEvent(c4, 'mouseup');

            // Should have selected the 9 cells spanned
            expect(view.el.query('.'+view.selectedCellCls).length).toBe(9);

            expect( isCellSelected(2, 2) &&
                    isCellSelected(3, 2) &&
                    isCellSelected(4, 2) &&
                    isCellSelected(2, 3) &&
                    isCellSelected(3, 3) &&
                    isCellSelected(4, 3) &&
                    isCellSelected(2, 4) &&
                    isCellSelected(3, 4) &&
                    isCellSelected(4, 4)).toBe(true);
        });
        it("should select a range in a single row on drag", function() {
            makeGrid();
            var c2 = findCell(2, 2),
                c4 = findCell(2, 4);

            jasmine.fireMouseEvent(c2, 'mousedown');
            jasmine.fireMouseEvent(c2, 'mousemove');
            jasmine.fireMouseEvent(c4, 'mousemove');
            jasmine.fireMouseEvent(c4, 'mouseup');

            // Should have selected the 3 cells spanned
            expect(view.el.query('.'+view.selectedCellCls).length).toBe(3);

            expect( isCellSelected(2, 2) &&
                    isCellSelected(2, 3) &&
                    isCellSelected(2, 4)).toBe(true);
        });
        describe('Range selection using selectCells', function() {
            it('should work when using CellContext objects to describe the range', function() {
                makeGrid();

                selModel.selectCells(new Ext.grid.CellContext(view).setPosition(2, 2), new Ext.grid.CellContext(view).setPosition(2, 4));

                // Should have selected the 3 cells spanned
                expect(view.el.query('.'+view.selectedCellCls).length).toBe(3);

                expect( isCellSelected(2, 2) &&
                        isCellSelected(2, 3) &&
                        isCellSelected(2, 4)).toBe(true);
            });
            it('should work when using [x,y] arrays to describe the range', function() {
                makeGrid();

                // Maintainer: Array cell specification order is [x, y] (column, row)
                selModel.selectCells([2, 2], [2, 4]);

                // Should have selected the 3 cells spanned
                expect(view.el.query('.'+view.selectedCellCls).length).toBe(3);

                // Maintainer: isCellSelected param order is (row, column)
                expect( isCellSelected(2, 2) &&
                        isCellSelected(3, 2) &&
                        isCellSelected(4, 2)).toBe(true);
            });
        });
        it('should not wrap when SHIFT+RIGHT on last cell', function() {
            makeGrid();
            var c5 = findCell(2, 5),
                c4Position;

            jasmine.fireMouseEvent(c5, 'click');

            // Wait for the NavigationModel to focus the last cell
            waitsFor(function() {
                c4Position = view.getNavigationModel().getPosition();

                return c4Position && c4Position.getCell(true) === c5.dom;
            });

            runs(function() {
                jasmine.fireKeyEvent(c5, 'keydown', Ext.event.Event.RIGHT, true)
            });

            // We expect nothing to happen
            waits(100);

            // Should not have moved
            runs(function() {
                expect(view.getNavigationModel().getCell().dom).toBe(c5.dom);
            });
        });
    });

    smDescribe("Single cell selection", function() {
        it("should select a single cell on click", function() {
            makeGrid();

            jasmine.fireMouseEvent(findCell(2, 2), 'click');
            expect(view.el.query('.'+view.selectedCellCls).length).toBe(1);
            expect(isCellSelected(2, 2)).toBe(true);

            jasmine.fireMouseEvent(findCell(5, 5), 'click');
            expect(view.el.query('.'+view.selectedCellCls).length).toBe(1);
            expect(isCellSelected(5, 5)).toBe(true);
        });
    });

    describe("pruneRemoved", function() {
        describe('pruneRemoved: true', function() {
            it('should remove records from selection by default when they are removed from the store', function() {
                //columns, cfg, selModelCfg, storeCfg
                makeGrid(null, {
                    bbar: {
                        xtype: 'pagingtoolbar'
                    }
                }, null, {
                    autoLoad: false,
                    pageSize: 5,
                    proxy: {
                        type: 'memory',
                        enablePaging: true
                    }
                });
                store.proxy.enablePaging = true;

                var tb = grid.down('pagingtoolbar'),
                    selection;

                tb.setStore(store);
                store.loadPage(1);
                selModel.select(0);
                selection = selModel.getSelection();

                // We have selected the first record
                expect(selection.length).toBe(1);
                expect(selection[0] === store.getAt(0)).toBe(true);

                // Row zero has the selected class
                expect(Ext.fly(view.getNode(0)).hasCls(view.selectedItemCls)).toBe(true);

                // Load page 2
                tb.moveNext();

                // First row in new page NOT selected
                expect(Ext.fly(view.getNode(0)).hasCls(view.selectedItemCls)).toBe(false);

                // Go back to page 1
                tb.movePrevious();
                selection = selModel.getSelection();

                // Selection has gone
                expect(selection.length).toBe(0);

                // Row zero must not be selected
                expect(Ext.fly(view.getNode(0)).hasCls(view.selectedItemCls)).toBe(false);
            });
        });

        describe('pruneRemoved: false', function() {
            it('should NOT remove records from selection if pruneRemoved:false when they are removed from the store', function() {
                makeGrid(null, {
                    bbar: {
                        xtype: 'pagingtoolbar'
                    }
                }, {
                    pruneRemoved: false
                }, {
                    autoLoad: false,
                    pageSize: 5,
                    proxy: {
                        type: 'memory',
                        enablePaging: true
                    }
                });
                store.proxy.enablePaging = true;

                var tb = grid.down('pagingtoolbar'),
                    selection;

                tb.setStore(store);
                store.loadPage(1);
                selModel.select(0);
                selection = selModel.getSelection();

                // We have selected the first record
                expect(selection.length).toBe(1);
                expect(selection[0] === store.getAt(0)).toBe(true);

                // Row zero has the selected class
                expect(Ext.fly(view.getNode(0)).hasCls(view.selectedItemCls)).toBe(true);

                // Load page 2
                tb.moveNext();

                // First row in new page NOT selected
                expect(Ext.fly(view.getNode(0)).hasCls(view.selectedItemCls)).toBe(false);

                // Go back to page 1
                tb.movePrevious();
                selection = selModel.getSelection();

                // We have selected the first record
                expect(selection.length).toBe(1);
                expect(selection[0] === store.getAt(0)).toBe(true);

                // Row zero must be selected
                expect(Ext.fly(view.getNode(0)).hasCls(view.selectedItemCls)).toBe(true);
            });
        });
    });

    describe("view model selection", function() {
        var viewModel, spy, columns;

        function createGrid(gridCfg, selModelCfg, storeCfg) {
            selModel = new Ext.selection.RowModel(selModelCfg || {});

            grid = new Ext.grid.Panel(Ext.apply({
                store: new Ext.data.Store(Ext.apply({
                    fields: ['name'],
                    proxy: {
                        type: 'memory',
                        data: [
                            { name: 'Phil' },
                            { name: 'Ben' },
                            { name: 'Evan' },
                            { name: 'Don' },
                            { name: 'Nige' },
                            { name: 'Alex' }
                        ]
                    }
                }, storeCfg)),
                columns: [
                    { text: 'Name',  dataIndex: 'name' }
                ],
                selModel: selModel,
                height: 200,
                width: 200,
                renderTo: Ext.getBody()
            }, gridCfg));
            store = grid.getStore();
            if (!storeCfg || storeCfg.autoLoad !== false) {
                store.load();
            }
            view = grid.getView();
            columns = grid.view.getVisibleColumnManager().getColumns();
        }

        beforeEach(function() {
            spy = jasmine.createSpy();
            viewModel = new Ext.app.ViewModel();
        });

        afterEach(function() {
            spy = selModel = viewModel = null;
        });

        function selectNotify(rec) {
            selModel.select(rec);
            viewModel.notify();
        }

        function byName(name) {
            var index = store.findExact('name', name);
            return store.getAt(index);
        }

        describe("reference", function() {
            beforeEach(function() {
                createGrid({
                    reference: 'userList',
                    viewModel: viewModel
                });
                viewModel.bind('{userList.selection}', spy);
                viewModel.notify();
            });

            it("should publish null by default", function() {
                var args = spy.mostRecentCall.args;
                expect(args[0]).toBeNull();
                expect(args[1]).toBeUndefined();
            });

            it("should publish the value when selected", function() {
                var rec = byName('Ben');
                selectNotify(rec);
                var args = spy.mostRecentCall.args;
                expect(args[0]).toBe(rec);
                expect(args[1]).toBeNull();
            });

            it("should publish when the selection is changed", function() {
                var rec1 = byName('Ben'),
                    rec2 = byName('Nige');

                selectNotify(rec1);
                spy.reset();
                selectNotify(rec2);
                var args = spy.mostRecentCall.args;
                expect(args[0]).toBe(rec2);
                expect(args[1]).toBe(rec1);
            });

            it("should publish when an item is deselected", function() {
                var rec = byName('Ben');
                selectNotify(rec);
                spy.reset();
                selModel.deselect(rec);
                viewModel.notify();
                var args = spy.mostRecentCall.args;
                expect(args[0]).toBeNull();
                expect(args[1]).toBe(rec);
            });
        });

        describe("two way binding", function() {
            beforeEach(function() {
                createGrid({
                    viewModel: viewModel,
                    bind: {
                        selection: '{foo}'
                    }
                });
                viewModel.bind('{foo}', spy);
                viewModel.notify();
            });

            describe("changing the selection", function() {
                it("should trigger the binding when adding a selection", function() {
                    var rec = byName('Don');
                    selectNotify(rec);
                    var args = spy.mostRecentCall.args;
                    expect(args[0]).toBe(rec);
                    expect(args[1]).toBeUndefined();
                });

                it("should trigger the binding when changing the selection", function() {
                    var rec1 = byName('Ben'),
                        rec2 = byName('Nige');

                    selectNotify(rec1);
                    spy.reset();
                    selectNotify(rec2);
                    var args = spy.mostRecentCall.args;
                    expect(args[0]).toBe(rec2);
                    expect(args[1]).toBe(rec1);
                });

                it("should trigger the binding when an item is deselected", function() {
                    var rec = byName('Don');
                    selectNotify(rec);
                    spy.reset();
                    selModel.deselect(rec);
                    viewModel.notify();
                    var args = spy.mostRecentCall.args;
                    expect(args[0]).toBeNull();
                    expect(args[1]).toBe(rec);
                });
            });

            describe("changing the viewmodel value", function() {
                it("should select the record when setting the value", function() {
                    var rec = byName('Phil');
                    viewModel.set('foo', rec);
                    viewModel.notify();
                    expect(selModel.isSelected(rec)).toBe(true);
                });

                it("should select the record when updating the value", function() {
                    var rec1 = byName('Phil'),
                        rec2 = byName('Ben');

                    viewModel.set('foo', rec1);
                    viewModel.notify();
                    viewModel.set('foo', rec2);
                    viewModel.notify();
                    expect(selModel.isSelected(rec1)).toBe(false);
                    expect(selModel.isSelected(rec2)).toBe(true);
                });

                it("should deselect when clearing the value", function() {
                    var rec = byName('Evan');

                    viewModel.set('foo', rec);
                    viewModel.notify();
                    viewModel.set('foo', null);
                    viewModel.notify();
                    expect(selModel.isSelected(rec)).toBe(false);
                });
            });
        });
    });

    describe('Locked grids', function() {
        describe('mouse cell selection', function(){
            it('should track across from locked to normal', function() {
                makeGrid(null, null, null, null, true);
                var c1 = findCell(1, 1),
                    c3 = findCell(3, 3);

                jasmine.fireMouseEvent(c1, 'mousedown');
                jasmine.fireMouseEvent(c1, 'mousemove');
                jasmine.fireMouseEvent(c3, 'mousemove');

                expect(selModel.getSelected().isCells).toBe(true);

                // Should have selected the 9 cells spanned
                expect(view.el.query('.'+view.selectedCellCls).length).toBe(9);

                // Selection object should have a count of 9
                expect(selModel.getSelected().getCount()).toBe(9);

                expect( isCellSelected(1, 1) &&
                    isCellSelected(1, 2) &&
                    isCellSelected(1, 3) &&
                    isCellSelected(2, 1) &&
                    isCellSelected(2, 2) &&
                    isCellSelected(2, 3) &&
                    isCellSelected(3, 1) &&
                    isCellSelected(3, 2) &&
                    isCellSelected(3, 2)).toBe(true);
            });
        });

        describe('mouse row selection', function(){
            it('should track across from locked to normal', function() {
                makeGrid(null, null, null, null, true);
                var c0 = findCell(0, 0),
                    c2 = findCell(2, 2);

                jasmine.fireMouseEvent(c0, 'mousedown');
                jasmine.fireMouseEvent(c0, 'mousemove');
                jasmine.fireMouseEvent(c2, 'mousemove');

                expect(selModel.getSelected().isRows).toBe(true);

                // Should have selected the 6 rows spanned
                expect(view.el.query('.'+view.selectedItemCls).length).toBe(6);

                // Rows 0, 1, 2 should be selected
                expect(isRowSelected(0)).toBe(true);
                expect(isRowSelected(1)).toBe(true);
                expect(isRowSelected(2)).toBe(true);

                // Selection object should have a count of 3
                expect(selModel.getSelected().getCount()).toBe(3);

                expect(selModel.getSelected().contains(store.getAt(0))).toBe(true);
                expect(selModel.getSelected().contains(store.getAt(1))).toBe(true);
                expect(selModel.getSelected().contains(store.getAt(2))).toBe(true);
            });
            
            it('should select a range of rows using click followed by shift+click', function() {
                makeGrid(null, null, null, null, true);
                var c0 = findCell(0, 0),
                    c2 = findCell(2, 0);

                // Click on row 0, then shift+click on row 2
                jasmine.fireMouseEvent(c0, 'click');
                jasmine.fireMouseEvent(c2, 'click', null, null, null, true);

                expect(selModel.getSelected().isRows).toBe(true);

                // Should have selected the 6 rows spanned
                expect(view.el.query('.'+view.selectedItemCls).length).toBe(6);

                // Rows 0, 1, 2 should be selected
                expect(isRowSelected(0)).toBe(true);
                expect(isRowSelected(1)).toBe(true);
                expect(isRowSelected(2)).toBe(true);

                // Selection object should have a count of 3
                expect(selModel.getSelected().getCount()).toBe(3);

                expect(selModel.getSelected().contains(store.getAt(0))).toBe(true);
                expect(selModel.getSelected().contains(store.getAt(1))).toBe(true);
                expect(selModel.getSelected().contains(store.getAt(2))).toBe(true);

                // Column selection should destroy the row selection https://sencha.jira.com/browse/EXTJS-17325
                jasmine.fireMouseEvent(colRef[1].el.dom, 'click');

                expect(selModel.getSelected().isColumns).toBe(true);

                // Should have selected all cells under column 1
                expect(view.el.query('.'+view.selectedCellCls).length).toBe(view.el.query(colRef[1].getCellSelector()).length);
                expect(isColumnSelected(1)).toBe(true);
            });
        });

        describe('locking a selected column', function() {
            it('should successfully deselect', function() {
                makeGrid(null, null, null, null, true);
                
                selModel.selectColumn(colRef[5]);
                expect(isColumnSelected(5)).toBe(true);

                grid.lock(colRef[5]);
                colRef = grid.getColumnManager().getColumns();

                // After refreshing the columns, column 2 will be the moved column 5.
                // It should still be selected.
                expect(isColumnSelected(2)).toBe(true);
            });
        });
        
        describe('copying selected columns from locked grid', function() {
            it('should arrange the column data in column-ordinal order according to the outermost grid', function() {
                makeGrid(null, {
                    plugins: 'clipboard'
                }, null, null, true);
                var clipboard = grid.findPlugin('clipboard'),
                    data;

                // This is column 0 in the normal grid
                selModel.selectColumn(colRef[2]);

                // This is column 1 in the locked grid
                selModel.selectColumn(colRef[1], true);

                // But the clipboard should sort them into the order they are in in the outermost grid
                data = clipboard.getCellData();
                expect(data).toEqual("1.1\t1.2\n2.1\t2.2\n3.1\t3.2\n4.1\t4.2\n5.1\t5.2\n6.1\t6.2\n7.1\t7.2\n8.1\t8.2\n9.1\t9.2\n10.1\t10.2")
            });
        });
    });

    describe('mouse column selection', function() {
        it('should select in both locked and normal sides', function() {
            makeGrid(null, null, null, null, true);

            jasmine.fireMouseEvent(colRef[1].el.dom, 'click');

            expect(selModel.getSelected().isColumns).toBe(true);

            // Should have selected all cells under column 1
            expect(view.el.query('.'+view.selectedCellCls).length).toBe(view.el.query(colRef[1].getCellSelector()).length);
            expect(isColumnSelected(1)).toBe(true);

            // CTRL/click
            jasmine.fireMouseEvent(colRef[2].el.dom, 'click', 0, 0, 0, false, true);

            // Selection object should have a count of 2
            expect(selModel.getSelected().getCount()).toBe(2);

            // Should have selected all cells under columns 1 and  2
            expect(view.el.query('.'+view.selectedCellCls).length).toBe(view.el.query(colRef[1].getCellSelector()).length + view.el.query(colRef[2].getCellSelector()).length);

            // Both columns should be selected
            expect(isColumnSelected(1)).toBe(true);
            expect(isColumnSelected(2)).toBe(true);
        });

        it('should select columns rage using click then shift+click', function() {
            makeGrid(null, null, null, null, true);

            jasmine.fireMouseEvent(colRef[1].el.dom, 'click');

            expect(selModel.getSelected().isColumns).toBe(true);

            // Should have selected all cells under column 1
            expect(view.el.query('.'+view.selectedCellCls).length).toBe(view.el.query(colRef[1].getCellSelector()).length);
            expect(isColumnSelected(1)).toBe(true);

            // SHIFT/click column 4
            jasmine.fireMouseEvent(colRef[4].el.dom, 'click', 0, 0, 0, true);

            // Selection object should have a count of 4
            expect(selModel.getSelected().getCount()).toBe(4);

            // Should have selected all cells under column 1, 2, 3 and 4
            expect(view.el.query('.'+view.selectedCellCls).length).toBe(
                    view.el.query(colRef[1].getCellSelector()).length +
                    view.el.query(colRef[2].getCellSelector()).length +
                    view.el.query(colRef[3].getCellSelector()).length +
                    view.el.query(colRef[4].getCellSelector()).length);

            // All four columns should be selected
            expect(isColumnSelected(1)).toBe(true);
            expect(isColumnSelected(2)).toBe(true);
            expect(isColumnSelected(3)).toBe(true);
            expect(isColumnSelected(4)).toBe(true);
        });
    });

    describe('Buffered store', function() {
        function getData(start, limit) {
            var end = start + limit,
                recs = [],
                i;

            for (i = start; i < end; ++i) {
                recs.push({
                    id: i,
                    title: 'Title' + i
                });
            }
            return recs;
        }

        function satisfyRequests(total) {
            var requests = Ext.Ajax.mockGetAllRequests(),
                request, params, data;

            while (requests.length) {
                request = requests[0];

                params = request.options.params;
                data = getData(params.start, params.limit);

                Ext.Ajax.mockComplete({
                    status: 200,
                    responseText: Ext.encode({
                        total: total || 5000,
                        data: data
                    })
                });

                requests = Ext.Ajax.mockGetAllRequests();
            }
        }
        
        beforeEach(function() {
            MockAjaxManager.addMethods();
        });

        afterEach(function() {
            MockAjaxManager.removeMethods();
        });

        it('should not throw an error', function() {
            makeGrid(null, null, null, {
                buffered: true,
                pageSize: 100,
                proxy: {
                    type: 'ajax',
                    url: 'fakeUrl',
                    reader: {
                        type: 'json',
                        rootProperty: 'data'
                    }
                },
                data: null
            });
            store.loadPage(1);
            satisfyRequests();
        });
    });

    describe('Selection replication', function() {
        var selStart,
            selEnd,
            extStart,
            extEnd,
            r0Data,
            r1Data,
            r2Data,
            r5Data,
            r6Data,
            r7Data;

        beforeEach(function() {
            makeGrid(null, {
                plugins: 'selectionreplicator'
            }, {
                extensible: 'y'
            }, {
                numeric: true
            });
            r0Data = Ext.clone(store.getAt(0).data);
            r1Data = Ext.clone(store.getAt(1).data);
            r2Data = Ext.clone(store.getAt(2).data);
            r5Data = Ext.clone(store.getAt(5).data);
            r6Data = Ext.clone(store.getAt(6).data);
            r7Data = Ext.clone(store.getAt(7).data);
        });
        
        it('should align the extend handle upon column resize', function() {
            // Select cell 1, 1
            jasmine.fireMouseEvent(findCell(1, 1), 'click');

            // Get extender handle position
            var handleX = selModel.extensible.handle.getX();

            // Widen the selected column by 100px
            colRef[1].setWidth(colRef[1].getWidth() + 100);

            // Handle should have moved with it.
            var have = selModel.extensible.handle.getX();
            
            // Need a bit of fuzziness for IE8
            if (Ext.isIE8) {
                expect(have).toBeWithin(2, handleX + 100);
            }
            else {
                expect(have).toBe(handleX + 100);
            }
        });

        describe('multiple selection', function() {
            describe('upwards', function() {
                it('should replicate the selection by incrementing the values', function() {

                    selStart = findCell(3, 2);
                    selEnd = findCell(4, 4);
                    extStart = new Ext.grid.CellContext(grid.view).setPosition(0, 2),
                    extEnd = new Ext.grid.CellContext(grid.view).setPosition(2, 4),

                    // Zero the data in our intended extension areas
                    // because the replication sets it back to original values.
                    store.getAt(0).set({field2: 0, field3: 0, field4: 0});
                    store.getAt(1).set({field2: 0, field3: 0, field4: 0});
                    store.getAt(2).set({field2: 0, field3: 0, field4: 0});

                    jasmine.fireMouseEvent(selStart, 'mousedown');
                    jasmine.fireMouseEvent(selStart, 'mousemove');
                    jasmine.fireMouseEvent(selEnd, 'mousemove');
                    jasmine.fireMouseEvent(selEnd, 'mouseup');
                    // 3,2 to 4,4 will be selected now.
                    // This operation is tested by a test above.

                    // Replicate upwards
                    grid.fireEvent('beforeselectionextend', grid, selModel.getSelected(), {
                        type: 'rows',
                        start: extStart,
                        end: extEnd,
                        rows: -3
                    });

                    // The values should be restored to being incremented by one as in the initial load
                    expect(store.getAt(0).data).toEqual(r0Data);
                    expect(store.getAt(1).data).toEqual(r1Data);
                    expect(store.getAt(2).data).toEqual(r2Data);
                });
            });
            describe('downwards', function() {
                it('should replicate the selection by incrementing the values', function() {

                    selStart = findCell(3, 2);
                    selEnd = findCell(4, 4);
                    extStart = new Ext.grid.CellContext(grid.view).setPosition(5, 2),
                    extEnd = new Ext.grid.CellContext(grid.view).setPosition(7, 4),

                    // Zero the data in our intended extension areas
                    // because the replication sets it back to original values.
                    store.getAt(5).set({field2: 0, field3: 0, field4: 0});
                    store.getAt(6).set({field2: 0, field3: 0, field4: 0});
                    store.getAt(7).set({field2: 0, field3: 0, field4: 0});

                    jasmine.fireMouseEvent(selStart, 'mousedown');
                    jasmine.fireMouseEvent(selStart, 'mousemove');
                    jasmine.fireMouseEvent(selEnd, 'mousemove');
                    jasmine.fireMouseEvent(selEnd, 'mouseup');
                    // 3,2 to 4,4 will be selected now.
                    // This operation is tested by a test above.

                    // Replicate downwards
                    grid.fireEvent('beforeselectionextend', grid, selModel.getSelected(), {
                        type: 'rows',
                        start: extStart,
                        end: extEnd,
                        rows: 3
                    });

                    // The values should be restored to being incremented by one as in the initial load
                    expect(store.getAt(5).data).toEqual(r5Data);
                    expect(store.getAt(6).data).toEqual(r6Data);
                    expect(store.getAt(7).data).toEqual(r7Data);
                });
            });
        });

        describe('single selection', function() {
            describe('upwards', function() {
                it('should replicate the selection by repeating the values', function() {
                    var r3Data = store.getAt(3).data;

                    extStart = new Ext.grid.CellContext(grid.view).setPosition(0, 2),
                    extEnd = new Ext.grid.CellContext(grid.view).setPosition(2, 4),

                    jasmine.fireMouseEvent(findCell(3,0), 'click');
                    // Row 3 will be selected now.
                    // This operation is tested by a test above.

                    // Replicate upwards
                    grid.fireEvent('beforeselectionextend', grid, selModel.getSelected(), {
                        type: 'rows',
                        start: extStart,
                        end: extEnd,
                        rows: -3
                    });

                    // The test is going to insist that the data objects be the same.
                    // So force the IDs here.
                    store.getAt(0).data.id = store.getAt(1).data.id = store.getAt(2).data.id = store.getAt(3).data.id;

                    // The values sselected in record 3 should be repeated in the extension area
                    expect(store.getAt(0).data).toEqual(r3Data);
                    expect(store.getAt(1).data).toEqual(r3Data);
                    expect(store.getAt(2).data).toEqual(r3Data);
                });
            });
            describe('downwards', function() {
                it('should replicate the selection by repeating the values', function() {
                    var r4Data = store.getAt(4).data;

                    extStart = new Ext.grid.CellContext(grid.view).setPosition(5, 2),
                    extEnd = new Ext.grid.CellContext(grid.view).setPosition(7, 4),

                    jasmine.fireMouseEvent(findCell(4, 0), 'click');
                    // Row 4 will be selected now.
                    // This operation is tested by a test above.

                    // Replicate downwards
                    grid.fireEvent('beforeselectionextend', grid, selModel.getSelected(), {
                        type: 'rows',
                        start: extStart,
                        end: extEnd,
                        rows: 3
                    });

                    // The test is going to insist that the data objects be the same.
                    // So force the IDs here.
                    store.getAt(5).data.id = store.getAt(6).data.id = store.getAt(7).data.id = store.getAt(4).data.id;

                    // The values sselected in record 4 should be repeated in the extension area
                    expect(store.getAt(5).data).toEqual(r4Data);
                    expect(store.getAt(6).data).toEqual(r4Data);
                    expect(store.getAt(7).data).toEqual(r4Data);
                });
            });
        });
    });

    describe('reconfigure', function() {
        var newColumnSet;

        beforeEach(function() {
            makeGrid(null, null, {
                checkboxSelect: true
            });
            newColumnSet = Ext.clone(grid.initialConfig.columns);
        });
        it('should re-insert the checkbox and row numberer columns on reconfigure', function() {
            var columns = grid.getVisibleColumnManager().getColumns();

            // There should be the checkbox column and the rpw numberer column in addition to the initial column set
            expect(columns.length).toBe(newColumnSet.length + 2);

            grid.reconfigure(null, newColumnSet);

            // There should be the checkbox column and the rpw numberer column in addition to the initial column set
            expect(columns.length).toBe(newColumnSet.length + 2);
        });
    });
});
