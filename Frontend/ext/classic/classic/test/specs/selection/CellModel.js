describe("Ext.selection.CellModel", function() {
    
    var grid, view, store, sm, colRef;
    
    function triggerCellMouseEvent(type, rowIdx, cellIdx, button, x, y) {
        var target = findCell(rowIdx, cellIdx);
        jasmine.fireMouseEvent(target, type, x, y, button);
    }
    
    function findCell(rowIdx, cellIdx) {
        return grid.getView().getCellInclusive({
            row: rowIdx,
            column: cellIdx
        }, true);
    }
    
    function makeGrid(columns, cfg, selModelCfg) {
        Ext.define('spec.CellModel', {
            extend: 'Ext.data.Model',
            fields: [
                'field1',
                'field2',
                'field3'
            ]
        });

        sm = new Ext.selection.CellModel(selModelCfg || {});
        
        
        var data = [],
            defaultCols = [],
            i;
        
        if (!columns) {
            for (i = 1; i <= 5; ++i) {
                defaultCols.push({
                    name: 'F' + i,
                    dataIndex: 'field' + i
                });
            }
        }
            
        for (i = 1; i <= 10; ++i) {
            data.push({
                field1: i + '.' + 1,
                field2: i + '.' + 2,
                field3: i + '.' + 3,
                field4: i + '.' + 4,
                field5: i + '.' + 5
            });
        }
        
        store = new Ext.data.Store({
            model: spec.CellModel,
            data: data
        });
        
        grid = new Ext.grid.Panel(Ext.apply({
            columns: columns || defaultCols,
            store: store,
            selModel: sm,
            width: 1000,
            height: 500,
            renderTo: Ext.getBody()
        }, cfg));
        view = grid.getView();
        sm = grid.getSelectionModel();
        colRef = grid.getColumnManager().getColumns();
    }
    
    afterEach(function(){
        Ext.destroy(grid, store);
        sm = grid = store = view = null;
        Ext.undefine('spec.CellModel');
        Ext.data.Model.schema.clear();
    });

    it('should select when right-clicking', function () {
        makeGrid();
        triggerCellMouseEvent('click', 0, 0, 3);

        expect(sm.getSelection().length).toBe(1);
    });

    describe("deselectOnContainerClick", function() {
        it("should default to false", function() {
            makeGrid();
            expect(sm.deselectOnContainerClick).toBe(false);
        });

        describe("deselectOnContainerClick: false", function() {
            it("should not deselect when clicking the container", function() {
                makeGrid(null, null, {
                    deselectOnContainerClick: false
                });
                sm.selectByPosition({
                    row: 0,
                    column: 0
                });
                jasmine.fireMouseEvent(view.getEl(), 'click', 800, 200);
                var pos = sm.getPosition();
                expect(pos.record).toBe(store.getAt(0));
                expect(pos.column).toBe(colRef[0]);
            });
        });

        describe("deselectOnContainerClick: true", function() {
            it("should deselect when clicking the container", function() {
                makeGrid(null, null, {
                    deselectOnContainerClick: true
                });
                sm.selectByPosition({
                    row: 0,
                    column: 0
                });
                jasmine.fireMouseEvent(view.getEl(), 'click', 800, 200);
                expect(sm.getPosition()).toBeNull();
            });
        });
    });
    
    describe("hidden columns", function() {
        it("should take a hidden column into account on click", function() {
            makeGrid([{
                dataIndex: 'field1'
            }, {
                dataIndex: 'field2',
                hidden: true
            }, {
                dataIndex: 'field3'
            }]);
            triggerCellMouseEvent('click', 0, 2);
            var pos = sm.getPosition();    
            expect(pos.column).toBe(colRef[2]);
            expect(pos.record).toBe(grid.getStore().getAt(0));
        });  
    });
    
    describe("store actions", function(){
        it("should have no selection when clearing the store", function(){
            makeGrid();
            sm.selectByPosition({
                row: 1,
                column: 0
            });
            store.removeAll();
            expect(sm.getPosition()).toBeNull();
        });  
        
        it("should update the position when removing records", function() {
            makeGrid();
            var rec = store.getAt(8);
            
            sm.selectByPosition({
                column: 1,
                row: 8
            });
            store.removeAt(0);
            store.removeAt(0);
            store.removeAt(0);
            store.removeAt(0);
            
            var pos = sm.getPosition();
            expect(pos.column).toBe(colRef[1]);
            expect(pos.record).toBe(rec);
        });
        
        it("should update the position on inserting records", function() {
            makeGrid();
            var rec = store.getAt(1);
            
            sm.selectByPosition({
                column: 2,
                row: 1
            });
            store.insert(0, {});
            store.insert(0, {});
            store.insert(0, {});
            store.insert(0, {});
            
            var pos = sm.getPosition();
            expect(pos.column).toBe(colRef[2]);
            expect(pos.record).toBe(rec);
        });
    });

    it("should render cells with the x-grid-cell-selected cls (EXTJSIV-11254)", function() {
        makeGrid();
        sm.select(0);

        grid.getStore().sort([{
            property: 'name',
            direction: 'DESC'
        }]);

        var col = grid.getColumnManager().getHeaderAtIndex(0);
            
        expect(grid.getView().getCell(0, col)).toHaveCls('x-grid-cell-selected');
    });

    describe("column move", function() {
        it("should have the correct position after moving column", function() {
            makeGrid();
            triggerCellMouseEvent('click', 0, 0);
            grid.headerCt.move(0, 3);
            var pos = sm.getCurrentPosition();
            expect(pos.column).toBe(3);
            expect(pos.row).toBe(0);
            expect(pos.record).toBe(grid.getStore().getAt(0));
            expect(pos.columnHeader).toBe(colRef[0]);
        });

        it("should not fire a change event", function() {
            makeGrid();
            triggerCellMouseEvent('click', 0, 0);
            var spy = jasmine.createSpy();
            sm.on('selectionchange', spy);
            grid.headerCt.move(0, 3);
            expect(spy).not.toHaveBeenCalled();
        });
    });

    describe('with DD', function() {
        it('should start dragging', function() {
            makeGrid(null, {
                viewConfig: {
                    plugins: {
                        ptype: 'gridviewdragdrop',
                        dragText: 'Drag and drop to reorganize'
                    }
                }
            });
            var plugin = grid.view.findPlugin('gridviewdragdrop');

            runs(function() {
                triggerCellMouseEvent('mousedown', 0, 0, null, 10, 30);
                jasmine.fireMouseEvent(document.body, 'mousemove', 20, 20);
            });

            waitsFor(function() {
                return plugin.dragZone.proxy.el.isVisible();
            });

            runs (function() {
                var proxyInner;

                // The proxy should contain the configured dragText
                proxyInner = plugin.dragZone.proxy.el.down('.' + Ext.baseCSSPrefix + 'grid-dd-wrap', true);
                expect(proxyInner).not.toBeFalsy();

                // Destroying the grid during a drag should throw no errors.
                grid.destroy();
                jasmine.fireMouseEvent(document.body, 'mousemove', 40, 40);
            });
        });
    });
    
});
