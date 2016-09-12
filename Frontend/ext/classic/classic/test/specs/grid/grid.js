describe("grid-general", function() {
    var grid, store,
        synchronousLoad = true,
        proxyStoreLoad = Ext.data.ProxyStore.prototype.load,
        loadStore;

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

        grid = store = Ext.destroy(grid, store);
    });

    var scrollbarWidth = Ext.getScrollbarSize().width,
        transformStyleName = 'webkitTransform' in document.documentElement.style ? 'webkitTransform' : 'transform',
        scrollbarsTakeSpace = !!scrollbarWidth,
        // Some tests should only be run if the UI shows space-taking scrollbars.
        // Specifically, those tests which test that the presence or not of a scrollbar in one dimension
        // affects the presence of a scrollbar in the other dimension.
        visibleScrollbarsIt = scrollbarsTakeSpace ? it : xit;

        function getViewTop(el) {
            var dom = Ext.getDom(el),
                transform;

            if (Ext.supports.CssTransforms && !Ext.isIE9m) {
                transform = dom.style[transformStyleName];
                return transform ? parseInt(transform.split(',')[1], 10) : 0;
            } else {
                return parseInt(dom.style.top || '0', 10);
            }
        }

    function createSuite(buffered) {
        describe(buffered ? "with buffered rendering" : "without buffered rendering", function() {
            var GridModel = Ext.define(null, {
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
                }), view, colRef;

            function makeStore(data) {
                if (!data && data !== null) {
                    data = [{
                        field1: 1,
                        field2: 2,
                        field3: 3,
                        field4: 4,
                        field5: 5,
                        field6: 6,
                        field7: 7,
                        field8: 8,
                        field9: 9,
                        field10: 10
                    }];
                }
                store = new Ext.data.Store({
                    model: GridModel,
                    data: data
                });
                return store;
            }

            function makeGrid(columns, data, cfg, options, locked) {
                options = options || {};
                cfg = cfg || {};

                var i, dataCount, dataRow;

                if (!options.preventColumnCreate && !columns) {
                    columns = [];
                    for (i = 1; i < 11; i++) {
                        columns.push({
                            dataIndex: 'field' + i,
                            text: 'Field ' + i,
                            width: 90,
                            // First column gets locked if we are doing locking tests.
                            locked: locked && i === 1
                        });
                    }
                }

                // Could pass number of required records
                if (typeof data === 'number') {
                    dataCount = data;
                    data = [];
                    for (i = 0; i < dataCount; i++) {
                        dataRow = {
                            id: 'rec' + i
                        };
                        for (var j = 0; j < columns.length; j++) {
                            dataRow[columns[j].dataIndex] = (i + 1) + ', ' + (j + 1);
                        }
                        data.push(dataRow);
                    }
                }

                if (!options.preventStoreCreate) {
                    makeStore(data);
                }

                grid = new Ext.grid.Panel(Ext.apply({
                    columns: columns,
                    store: store,
                    trailingBufferZone: 1000,
                    leadingBufferZone: 1000,
                    width: 1000,
                    height: 500,
                    border: false,
                    bodyStyle: !cfg.border ? 'border: 0' : '',
                    bufferedRenderer: buffered,
                    viewConfig: Ext.apply({
                        mouseOverOutBuffer: 0
                    }, cfg.viewConfig)
                }, cfg));

                // Don't use renderTo since that may throw and we won't set "grid"
                // and will then leak the component
                if (cfg.renderTo === undefined) {
                    grid.render(Ext.getBody());
                }

                view = grid.getView();
                colRef = grid.getColumnManager().getColumns();
            }

            afterEach(function () {
                view = colRef = null;
                Ext.data.Model.schema.clear();
            });

            function getCellText(row, col) {
                var cell = view.getCell(store.getAt(row), colRef[col]),
                    selectorView = grid.lockedGrid ? grid.lockedGrid.getView() : view;

                return cell.down(selectorView.innerSelector).dom.innerHTML;
            }

            describe("misc tests", function() {
                // EXTJS-16436
                it('should not throw an exception when scrollable:false', function() {
                    // Spec will fail if an error is thrown
                    makeGrid(null, undefined, {
                        scrollable: false
                    });
                });
                
                // EXTJS-14858
                it("should not throw an exception when hiding a column in a locked grid during initComponent", function() {
                    var Plug = Ext.define(null, {
                        extend: 'Ext.AbstractPlugin',

                        init: function(cmp) {
                            cmp.hide();
                        }
                    });

                    makeGrid([{
                        plugins: [new Plug()],
                        locked: true
                    }, {

                    }]);
                });
                // https://sencha.jira.com/browse/EXTJS-14879
                it('should invalidate cached element data when grid DOM is updated', function() {
                    makeGrid();
                    grid.columns[0].hasCustomRenderer = true;
                    Ext.fly(grid.view.all.item(0, true)).addCls('foo-bar');
                    expect(Ext.fly(grid.view.all.item(0, true)).hasCls('foo-bar')).toBe(true);
                    store.getAt(0).set('field1', 'CHANGED');

                    // After the update, the new state has to be synched.
                    expect(Ext.fly(grid.view.all.item(0, true)).hasCls('foo-bar')).toBe(false);
                });

                it("should not throw an error when the store is loaded in the afterrender of an earlier sibling", function() {
                    makeGrid(null, undefined, {
                        renderTo: null
                    });

                    var ct;
                    expect(function() {
                        ct = new Ext.container.Container({
                            renderTo: Ext.getBody(),
                            items: [{
                                xtype: 'component',
                                html: 'Foo',
                                listeners: {
                                    afterrender: function() {
                                        var proxy = new Ext.data.proxy.Ajax({
                                            url: 'foo'
                                        });

                                        spyOn(proxy, 'read').andReturn();
                                        store.setProxy(proxy);
                                        store.load();

                                    }
                                }
                            }, grid]
                        });
                    }).not.toThrow();
                    Ext.destroy(ct);
                });

                it("should not throw an error when the store is loaded in the afterrender event", function() {
                    makeGrid(null, [], {
                        listeners: {
                            afterrender: function() {
                                var proxy = new Ext.data.proxy.Ajax({
                                        url: 'foo'
                                    });

                                spyOn(proxy, 'read').andReturn();
                                store.setProxy(proxy);
                                expect(function() {
                                    store.load();
                                }).not.toThrow();
                            }
                        }
                    });
                });
            });

            describe("autoSizeColumn", function() {
                function getPadding() {
                    var cell = grid.getView().getEl().down(colRef[0].getCellInnerSelector()),
                        right = Ext.supports.ScrollWidthInlinePaddingBug ? parseInt(cell.getStyle('padding-right'), 10) : 0;
                    return parseInt(cell.getStyle('padding-left'), 10) + right;
                }

                it("should size the column when passed a header", function() {
                    makeGrid(null, [{
                        field1: '<div style="width: 125px;>a</div>'
                    }, {
                        field1: '<div style="width: 450px;>b</div>'
                    }, {
                        field1: '<div style="width: 375px;>c</div>'
                    }]);
                    grid.getView().autoSizeColumn(colRef[0]);
                    expect(colRef[0].getWidth()).toBe(451 + getPadding());
                });

                it("should size the column when passed a header index", function() {
                    makeGrid(null, [{
                        field1: '<div style="width: 125px;>a</div>'
                    }, {
                        field1: '<div style="width: 450px;>b</div>'
                    }, {
                        field1: '<div style="width: 375px;>c</div>'
                    }]);
                    grid.getView().autoSizeColumn(0);
                    expect(colRef[0].getWidth()).toBe(451 + getPadding());
                });
            });

            describe("sizing", function() {
                it("should allow for a minHeight on the view with a shrink wrapped grid", function() {
                    makeGrid(null, undefined, {
                        height: undefined,
                        viewConfig: {
                            minHeight: 100
                        }
                    });
                    expect(view.getHeight()).toBe(100);
                    expect(grid.getHeight()).toBe(100 + grid.headerCt.getHeight());
                });
            });

            describe("getRowClass", function() {
                var spy;

                beforeEach(function() {
                    spy = jasmine.createSpy();
                    makeGrid(null, 3, {
                        viewConfig: {
                            getRowClass: spy.andCallFake(function(rec) {
                                return 'customCls' + store.indexOf(rec) + ' testCls';
                            })
                        }
                    });
                });

                afterEach(function() {
                    spy = null;
                });

                function getRow(index) {
                    var node = view.getNode(index);
                    return Ext.fly(node).down(view.rowSelector);
                }

                it("should be called for each rendered row", function() {
                    expect(spy.callCount).toBe(3);
                    expect(spy.calls[0].args[0]).toBe(store.getAt(0));
                    expect(spy.calls[0].args[1]).toBe(0);
                    expect(spy.calls[1].args[0]).toBe(store.getAt(1));
                    expect(spy.calls[1].args[1]).toBe(1);
                    expect(spy.calls[2].args[0]).toBe(store.getAt(2));
                    expect(spy.calls[2].args[1]).toBe(2);
                });

                it("should be called when refreshing the view", function() {
                    spy.reset();
                    view.refresh();
                    expect(spy.calls[0].args[0]).toBe(store.getAt(0));
                    expect(spy.calls[0].args[1]).toBe(0);
                    expect(spy.calls[1].args[0]).toBe(store.getAt(1));
                    expect(spy.calls[1].args[1]).toBe(1);
                    expect(spy.calls[2].args[0]).toBe(store.getAt(2));
                    expect(spy.calls[2].args[1]).toBe(2);
                });

                it("should be called when adding a new record", function() {
                    spy.reset();
                    store.add({});
                    expect(spy.callCount).toBe(1);
                    expect(spy.mostRecentCall.args[0]).toBe(store.getAt(3));
                    expect(spy.mostRecentCall.args[1]).toBe(3);
                });

                it("should be called when inserting a new record", function() {
                    spy.reset();
                    store.insert(0, {});
                    expect(spy.callCount).toBe(1);
                    expect(spy.mostRecentCall.args[0]).toBe(store.getAt(0));
                    expect(spy.mostRecentCall.args[1]).toBe(0);
                });

                it("should be called when the row is updating", function() {
                    spy.reset();
                    store.getAt(0).set('field1', 'new value');
                    expect(spy.callCount).toBe(1);
                    expect(spy.mostRecentCall.args[0]).toBe(store.getAt(0));
                    expect(spy.mostRecentCall.args[1]).toBe(0);
                });

                it("should add the class to the row element", function() {
                    expect(getRow(0).hasCls('customCls0')).toBe(true);
                    expect(getRow(1).hasCls('customCls1')).toBe(true);
                    expect(getRow(2).hasCls('customCls2')).toBe(true);
                });

                it("should be able to add multiple class names", function() {
                    expect(getRow(0).hasCls('customCls0')).toBe(true);
                    expect(getRow(0).hasCls('testCls')).toBe(true);
                    expect(getRow(1).hasCls('customCls1')).toBe(true);
                    expect(getRow(1).hasCls('testCls')).toBe(true);
                    expect(getRow(2).hasCls('customCls2')).toBe(true);
                    expect(getRow(2).hasCls('testCls')).toBe(true);
                });
            });

            describe("emptyText", function() {

                function getEmpty() {
                    return grid.getEl().down('.' + grid.emptyCls) || null;
                }

                describe("when to display", function() {
                    it("should display on first refresh with deferEmptyText: false", function() {
                        makeGrid(null, null, {
                            viewConfig: {
                                emptyText: 'Foo',
                                deferEmptyText: false
                            }
                        });
                        expect(getEmpty()).not.toBeNull();
                    });

                    it("should not display on first refresh with deferEmptyText: true", function() {
                        makeGrid(null, null, {
                            viewConfig: {
                                emptyText: 'Foo',
                                deferEmptyText: true
                            }
                        });
                        expect(getEmpty()).toBeNull();
                    });

                    it("should display on subsequent refreshes with deferEmptyText: true", function() {
                        makeGrid(null, null, {
                            viewConfig: {
                                emptyText: 'Foo',
                                deferEmptyText: true
                            }
                        });
                        grid.getView().refresh();
                        expect(getEmpty()).not.toBeNull();
                    });

                    it("should display when removing the last record", function() {
                        makeGrid(null, 1, {
                            viewConfig: {
                                emptyText: 'Foo',
                                deferEmptyText: true
                            }
                        });
                        store.removeAt(0);
                        expect(getEmpty()).not.toBeNull();
                    });

                    it("should display when removing all records", function() {
                        makeGrid(null, 5, {
                            viewConfig: {
                                emptyText: 'Foo',
                                deferEmptyText: true
                            }
                        });
                        store.removeAll();
                        expect(getEmpty()).not.toBeNull();
                    });
                });

                describe("config", function() {
                    describe("emptyCls", function() {
                        it("should use the passed emptyCls", function() {
                            makeGrid(null, null, {
                                emptyCls: 'foo',
                                viewConfig: {
                                    emptyText: 'Foo',
                                    deferEmptyText: false
                                }
                            });
                            expect(getEmpty().hasCls('foo')).toBe(true);
                        });
                    });

                    describe("emptyText", function() {
                        it("should use the passed emptyText", function() {
                            makeGrid(null, null, {
                                viewConfig: {
                                    emptyText: 'Foo',
                                    deferEmptyText: false
                                }
                            });
                            expect(getEmpty().dom).hasHTML('Foo');
                        });
                    });
                });

                describe("size", function() {
                    it("should set the grid height correctly based on the emptyText when auto heighting", function() {
                        makeGrid(null, null, {
                            height: null,
                            hideHeaders: true,
                            viewConfig: {
                                emptyText: '<div style="width: 50px; height: 100px;">a</div>',
                                deferEmptyText: false
                            }
                        });
                        var otherParts = grid.body.getBorderWidth('tb') + grid.el.down(view.bodySelector).getHeight();
                        expect(grid.getHeight()).toBe(100 + getEmpty().getPadding('tb') + otherParts);
                    });
                });

                describe("scrolling", function() {
                    it("should keep a horizontal scrollbar if columns are larger than the grid width", function() {
                        makeGrid([{
                            width: 800
                        }, {
                            width: 800
                        }], 0, {
                            viewConfig: {
                                emptyText: '<div style="width: 50px; height: 100px;">a</div>',
                                deferEmptyText: false
                            }
                        });
                        expect(view.getEl().dom.scrollWidth).toBe(1600);
                    });
                });
            });

            describe("stripeRows", function() {
                var stripeCls = Ext.view.Table.prototype.altRowCls;

                describe("with stripeRows: false", function() {
                    function expectNotStriped() {
                        Ext.Array.forEach(grid.getView().getNodes(), function(node) {
                            expect(Ext.fly(node).hasCls(stripeCls)).toBe(false);
                        });
                    }

                    beforeEach(function() {
                        makeGrid(null, 11, {
                            viewConfig: {
                                stripeRows: false
                            }
                        });
                    });

                    it("should not stripe rows on initial render", function() {
                        expectNotStriped();
                    });

                    it("should not stripe rows when adding records", function() {
                        store.add([{}, {}, {}, {}, {}]);
                        expectNotStriped();
                    });

                    it("should not stripe rows when removing records", function() {
                        store.removeAt(0);
                        expectNotStriped();
                    });

                    it("should not stripe rows when updating records", function() {
                        store.getAt(0).set('field1', 'foo');
                        expectNotStriped();
                    });

                    it("should not stripe rows on refresh", function() {
                        grid.getView().refresh();
                        expectNotStriped();
                    });
                });

                describe("with stripeRows: true", function() {
                    beforeEach(function() {
                        makeGrid(null, 11, {
                            viewConfig: {
                                stripeRows: true
                            }
                        });
                    });

                    function expectStriped() {
                        Ext.Array.forEach(grid.getView().getNodes(), function(node, index) {
                            if (index % 2 === 1) {
                                expect(Ext.fly(node).hasCls(stripeCls)).toBe(true);
                            } else {
                                expect(Ext.fly(node).hasCls(stripeCls)).toBe(false);
                            }
                        });
                    }

                    it("should stripe rows on initial render", function() {
                        expectStriped();
                    });

                    it("should stripe rows when appending records", function() {
                        store.add([{}, {}, {}, {}, {}]);
                        expectStriped();
                    });

                    it("should stripe rows when inserting records", function() {
                        store.insert(0, {});
                        expectStriped();
                    }); 

                    it("should stripe when removing records", function() {
                        store.removeAt(0);
                        expectStriped();
                    });

                    it("should retain the stripe class when updating records", function() {
                        store.getAt(1).set('field1', 'foo');
                        expectStriped();
                    });

                    it("should stripe when a record update causes the position to change", function() {
                        store.sort('field1');
                        store.getAt(0).set('field1', '999999999');
                        expectStriped();
                    });

                    it("should stripe on refresh", function() {
                        store.suspendEvents();
                        var numbers = [70, 72, 75, 27, 82, 70, 53, 42, 87, 19, 23];

                        store.each(function(rec, index) {
                            rec.set('field1', numbers[index]);
                        });
                        store.sort('field1');
                        store.resumeEvents();
                        grid.getView().refresh();
                        expectStriped();
                    });
                });
            });

            describe("forceFit", function() {
                var data; 
                beforeEach(function() {
                    data = [];

                    for (var i = 0; i < 50; i++) {
                        data.push({
                            field1: (i + 1) + ', ' + 1,
                            field2: (i + 1) + ', ' + 2,
                            field3: (i + 1) + ', ' + 3,
                            field4: (i + 1) + ', ' + 4,
                            field5: (i + 1) + ', ' + 5,
                            field6: (i + 1) + ', ' + 6,
                            field7: (i + 1) + ', ' + 7,
                            field8: (i + 1) + ', ' + 8,
                            field9: (i + 1) + ', ' + 9,
                            field10: (i + 1) + ', ' + 10
                        });
                    }
                });

                afterEach(function() {
                    data = null;
                });

                describe("starting with no overflow", function() {
                    beforeEach(function() {
                        makeGrid(null, undefined, {
                            forceFit: true,
                            width: 400,
                            height: 200
                        });
                    });

                    it('should size the columns to fit within the grid body', function() {
                        var emptyStore = new Ext.data.Store({
                            autoDestroy: false,
                            model: GridModel,
                            data: []
                        });

                        expect(grid.headerCt.getTableWidth()).toBe(grid.body.getWidth() - grid.body.getBorderWidth('lr'));

                        // Cause overflow by adding 50 new rows
                        store.add(data);

                        // Now should fit within the scrollbar
                        expect(grid.headerCt.getTableWidth()).toBe(grid.body.getWidth() - grid.body.getBorderWidth('lr') - Ext.getScrollbarSize().width);

                        // Avoid destruction when we unbind
                        store.autoDestroy = false;

                        // Reconfigure with an empty store
                        grid.reconfigure(emptyStore);

                        // Reconfigure back to full store
                        grid.reconfigure(store);

                        // Now should fit within the scrollbar
                        expect(grid.headerCt.getTableWidth()).toBe(grid.body.getWidth() - grid.body.getBorderWidth('lr') - Ext.getScrollbarSize().width);
                        Ext.destroy(emptyStore);
                    });
                });

                describe("with overflow", function() {
                    beforeEach(function() {
                        makeGrid(null, data, {
                            forceFit: true,
                            width: 400,
                            height: 200
                        });
                    });

                    it('should size the columns to fit within the grid body, inside the scrollbar', function() {
                        expect(grid.headerCt.getTableWidth()).toBe(grid.body.getWidth() - grid.body.getBorderWidth('lr') - Ext.getScrollbarSize().width);
                    });
                });
            });

            describe("basic settings", function() {
                describe("columns", function() {
                    describe("without locking", function() {
                        it("should be able to configure without columns", function() {
                            expect(function() {
                                makeGrid(null, undefined, null, {preventColumnCreate: true});
                            }).not.toThrow();
                        });
                    });

                    describe("with locking", function() {
                        it("should be able to configure without columns", function() {
                            expect(function() {
                                makeGrid(null, undefined, {enableLocking: true}, {preventColumnCreate: true});
                            }).not.toThrow();
                        });
                    });
                });

                // Note: Arguably, these specs should not be in grid since itemSelector is a view config, but the bug only
                // occurred in a locking grid. See EXTJS-15563.
                describe('itemSelector', function () {
                    var itemSelector = Ext.view.Table.prototype.itemSelector;

                    describe('without locking', function () {
                        it('should be able to lookup the itemSelector on the view', function () {
                            makeGrid();
                            expect(view.itemSelector).toBe(itemSelector);
                        });
                    });

                    describe('with locking', function () {
                        it('should be able to lookup the itemSelector on the LockingView', function () {
                            makeGrid(null, undefined, null, null, true);
                            expect(view.itemSelector).toBe(itemSelector);
                        });
                    });
                });

                describe("css classes", function() {
                    it("should add the x-grid cls", function() {
                        makeGrid();
                        expect(grid.el.hasCls('x-grid')).toBe(true);
                    });

                    it("should add the x-grid cls when specifying a custom cls", function() {
                        makeGrid(undefined, undefined, {
                            cls: 'foo'
                        });
                        expect(grid.el.hasCls('x-grid')).toBe(true);
                        expect(grid.el.hasCls('foo')).toBe(true);
                    });
                });

                describe("markDirty", function() {
                    var dirtyCls;

                    function makeDirtyGrid(markDirty, preventRender, columns) {
                        makeGrid(columns, undefined, {
                            renderTo: preventRender ? null : Ext.getBody(),
                            viewConfig: {
                                markDirty: markDirty,
                                mouseOverOutBuffer: 0
                            }
                        });
                        dirtyCls = grid.getView().dirtyCls;
                    }

                    afterEach(function() {
                        dirtyCls = null;
                    });

                    function getCell(record, column) {
                        return grid.getView().getCell(record, column);
                    }

                    describe("with markDirty: false", function() {
                        it("should not render a cell with the dirtyCls initially", function() {
                            makeDirtyGrid(false, true);
                            store.first().set('field1', 'bleh');
                            grid.render(Ext.getBody());

                            expect(grid.getEl().select('.' + dirtyCls).getCount()).toBe(0);
                        });

                        it("should not add the dirtyCls when updated with a simple cell updater", function() {
                            makeDirtyGrid(false);
                            store.first().set('field1', 'bleh');
                            expect(grid.getEl().select('.' + dirtyCls).getCount()).toBe(0);
                        });

                        it("should not add the dirtyCls when updated with a renderer", function() {
                            makeDirtyGrid(false, false, [{
                                dataIndex: '',
                                renderer: function(v, meta, rec) {
                                    return rec.get('field1') + rec.get('field2');
                                }
                            }]);
                            store.first().set('field1', 'bleh');
                            expect(grid.getEl().select('.' + dirtyCls).getCount()).toBe(0);
                        });
                    });

                    describe("with markDirty: true", function() {
                        it("should not render a cell with the dirtyCls initially if not dirty", function() {
                            makeDirtyGrid(true, true);
                            grid.render(Ext.getBody());
                            
                            var rec = store.first();
                            for (var i = 0; i < colRef.length; ++i) {
                                expect(getCell(rec, colRef[i])).not.toHaveCls(dirtyCls);
                            }
                        });

                        it("should render a cell with the dirtyCls initially if the cell is dirty", function() {
                            makeDirtyGrid(true, true);
                            store.first().set('field1', 'bleh');
                            grid.render(Ext.getBody());
                            
                            var rec = store.first();
                            expect(getCell(rec, colRef[0])).toHaveCls(dirtyCls);
                            for (var i = 1; i < colRef.length; ++i) {
                                expect(getCell(rec, colRef[i])).not.toHaveCls(dirtyCls);
                            }
                        });

                        it("should add the dirtyCls to updated cells", function() {
                            makeDirtyGrid(true);
                            var rec = store.first();
                            rec.set('field1', 'bleh');
                            expect(getCell(rec, colRef[0])).toHaveCls(dirtyCls);
                            rec.set('field4', 'qwerty');
                            expect(getCell(rec, colRef[3])).toHaveCls(dirtyCls);
                        });

                        it("should remove the dirtyCls when the cell is no longer dirty", function() {
                            makeDirtyGrid(true);
                            var rec = store.first(),
                                val = rec.get('field1');

                            rec.set('field1', 'asdf');
                            expect(getCell(rec, colRef[0])).toHaveCls(dirtyCls);
                            rec.set('field1', val);
                            expect(getCell(rec, colRef[0])).not.toHaveCls(dirtyCls);
                        });

                        it("should remove the dirtyCls on commit", function() {
                            makeDirtyGrid(true);
                            var rec = store.first();

                            rec.set('field1', 'foo');
                            rec.set('field2', 'bar');
                            expect(getCell(rec, colRef[0])).toHaveCls(dirtyCls);
                            expect(getCell(rec, colRef[1])).toHaveCls(dirtyCls);

                            rec.set('field3', 'baz');
                            expect(getCell(rec, colRef[2])).toHaveCls(dirtyCls);

                            rec.commit();

                            expect(getCell(rec, colRef[0])).not.toHaveCls(dirtyCls);
                            expect(getCell(rec, colRef[1])).not.toHaveCls(dirtyCls);
                            expect(getCell(rec, colRef[2])).not.toHaveCls(dirtyCls);
                        });

                        it("should remove the dirtyCls on reject", function() {
                            makeDirtyGrid(true);
                            var rec = store.first();

                            rec.set('field1', 'foo');
                            rec.set('field2', 'bar');
                            expect(getCell(rec, colRef[0])).toHaveCls(dirtyCls);
                            expect(getCell(rec, colRef[1])).toHaveCls(dirtyCls);

                            rec.set('field3', 'baz');
                            expect(getCell(rec, colRef[2])).toHaveCls(dirtyCls);

                            rec.reject();

                            expect(getCell(rec, colRef[0])).not.toHaveCls(dirtyCls);
                            expect(getCell(rec, colRef[1])).not.toHaveCls(dirtyCls);
                            expect(getCell(rec, colRef[2])).not.toHaveCls(dirtyCls);
                        });
                    });
                });
            });

            describe("selection", function() {
                function describeSelectionSuite(withLocking) {
                    describe(withLocking ? "with locking" : "without locking", function() {
                        var sm;
                        beforeEach(function() {
                            sm = new Ext.selection.RowModel();
                            makeGrid([{
                                dataIndex: 'field1',
                                locked: withLocking
                            }, {
                                dataIndex: 'field2'
                            }], undefined, {
                                selModel: sm
                            });
                        });

                        afterEach(function() {
                            sm = null;
                        });

                        it("should bind the store to the selection model", function() {
                            expect(sm.getStore()).toBe(grid.getStore());
                        });

                        it("should add the selectedItemCls when selected", function() {
                            var cls;
                            sm.select(0);
                            if (withLocking) {
                                view = grid.normalGrid.getView();
                                cls = view.selectedItemCls;

                                expect(grid.lockedGrid.getView().getNode(0)).toHaveCls(cls);
                                expect(view.getNode(0)).toHaveCls(cls);
                            } else {
                                view = grid.getView();
                                cls = view.selectedItemCls;

                                expect(view.getNode(0)).toHaveCls(cls);
                            }
                        });

                        it("should remove the selectedItemCls when deselected", function() {
                            var cls;
                            sm.select(0);
                            sm.deselect(0);

                            if (withLocking) {
                                view = grid.normalGrid.getView();
                                cls = view.selectedItemCls;

                                expect(grid.lockedGrid.getView().getNode(0)).not.toHaveCls(cls);
                                expect(view.getNode(0)).not.toHaveCls(cls);
                            } else {
                                view = grid.getView();
                                cls = view.selectedItemCls;

                                expect(view.getNode(0)).not.toHaveCls(cls);
                            }
                        });

                        it("should retain the selectedItemCls when updating a row", function() {
                            var cls;
                            sm.select(0);
                            store.first().commit();
                            if (withLocking) {
                                view = grid.normalGrid.getView();
                                cls = view.selectedItemCls;

                                expect(grid.lockedGrid.getView().getNode(0)).toHaveCls(cls);
                                expect(view.getNode(0)).toHaveCls(cls);
                            } else {
                                view = grid.getView();
                                cls = view.selectedItemCls;

                                expect(view.getNode(0)).toHaveCls(cls);
                            }
                        });
                    });
                }

                describeSelectionSuite(false);
                describeSelectionSuite(true);
            });
            
            describe("renderers", function(){
                describe("scope", function() {
                    it("should use the grid as the default scope", function(){
                        var scope;
                        makeGrid([{
                            dataIndex: 'field1',
                            text: 'Field1',
                            renderer: function(){
                                scope = this;
                            }    
                        }]);    
                        expect(scope).toBe(grid);
                    });
                    
                    it("should use the passed scope", function(){
                        var o = {},
                            scope;
                            
                        makeGrid([{
                            dataIndex: 'field1',
                            text: 'Field1',
                            scope: o,
                            renderer: function(){
                                scope = this;
                            }    
                        }]);    
                        expect(scope).toBe(o);
                    });
                });
                
                describe("params", function(){
                    var args;
                    beforeEach(function(){
                        makeGrid([{
                            dataIndex: 'field1',
                            renderer: function(){
                                args = Array.prototype.slice.call(arguments, 0, arguments.length);
                            }    
                        }]);
                    });
                    
                    it("should pass the value as the first param", function(){
                        expect(args[0]).toBe(1);
                    });
                    
                    it("should pass a meta object as the second param", function(){
                        expect(Ext.isObject(args[1])).toBe(true);
                    });
                    
                    it("should pass the record as the third param", function(){
                        expect(args[2]).toBe(store.getAt(0));
                    });
                    
                    it("should pass the recordIndex as the fourth param", function(){
                        expect(args[3]).toBe(0);
                    });
                    
                    it("should pass the cellIndex as the fifth param", function(){
                        expect(args[4]).toBe(0);
                    });
                    
                    it("should pass the store as the sixth param", function(){
                        expect(args[5]).toBe(store);
                    });
                    
                    it("should pass the view as the seventh param", function(){
                        expect(args[6]).toBe(grid.getView());
                    });
                });
                
                describe("cellIndex", function(){
                    it("should pass the local index when dealing with locked columns", function(){
                        var indexes = [],
                            fn = function(){
                                indexes.push(arguments[4]);
                            };
                            
                        makeGrid([{
                            locked: true,
                            dataIndex: 'field1',
                            renderer: fn    
                        }, {
                            locked: true,
                            dataIndex: 'field2',
                            renderer: fn    
                        }, {
                            dataIndex: 'field3',
                            renderer: fn   
                        }, {
                            dataIndex: 'field4',
                            renderer: fn   
                        }]);
                        expect(indexes).toEqual([0, 1, 0, 1]);
                    });
                    
                    it("should take into account hidden columns when passing cellIdx", function(){
                        var values = [],
                            indexes = [],
                            fn = function(v){
                                values.push(v);
                                indexes.push(arguments[4]);
                            };
                            
                        makeGrid([{
                            dataIndex: 'field1',
                            renderer: fn    
                        }, {
                            hidden: true,
                            dataIndex: 'field2',
                            renderer: fn    
                        }, {
                            dataIndex: 'field3',
                            renderer: fn   
                        }, {
                            hidden: true,
                            dataIndex: 'field4',
                            renderer: fn   
                        }, {
                            dataIndex: 'field5',
                            renderer: fn
                        }]);
                        expect(indexes).toEqual([0, 2, 4]);
                        expect(values).toEqual([1, 3, 5]);
                    });
                });
                
                it("should accept a string formatter that maps to Ext.util.Format", function() {
                    var oldFormat = Ext.util.Format.capitalize,
                        called;
                        
                    Ext.util.Format.capitalize = function () {
                        called = true;    
                    };

                    makeGrid([{
                        dataIndex: 'field1',
                        formatter: 'capitalize'
                    }]);

                    expect(called).toBe(true);

                    Ext.util.Format.capitalize = oldFormat;
                });

                it("should accept a scoped formatter", function() {
                    var called = 0;

                    var formatter = function (v, a1) {
                        called = v + a1;
                    };

                    makeGrid([{
                        dataIndex: 'field1',
                        formatter: 'this.foo(2)'
                    }], undefined, {
                        defaultListenerScope: true,
                        foo: formatter
                    });

                    expect(called).toBe(3);
                });

                it("should treat dynamic renderers as needed to run in all cases", function() {
                    var x = 0;

                    var VC = Ext.define(null, {
                        extend: 'Ext.app.ViewController',
                        doRender: function() {
                            return 'x' + ++x;
                        }
                    });

                    makeGrid([{
                        dataIndex: 'field1'
                    }, {
                        renderer: 'doRender'
                    }],
                    1, // ONE row of data, so that the first call of the custom renderer
                       // increments x to one, and the second call renders 2.
                    {
                        controller: new VC()
                    });

                    var rec = store.getAt(0);
                    expect(getCellText(0, 1)).toBe('x1');
                    rec.set('field1', 'foo');
                    expect(getCellText(0, 1)).toBe('x2');
                });
            });
            
            describe("model operations", function() {
                describe("destroy", function() {
                    it("should remove the model when destroy is called", function() {
                        makeGrid([{
                            dataIndex: 'field1'
                        }], [{
                            field1: 'foo'
                        }, {
                            field1: 'bar'
                        }, {
                            field1: 'baz'
                        }]);
                        store.first().erase();
                        expect(grid.getView().getNodes().length).toBe(2);
                    });  
                });  
            });
            
            describe("reconfigure", function() {
                function makeReconfigureSuite(beforeRender) {
                    function makeReconfigureGrid(columns, data, cfg, options, locked) {
                        cfg = cfg || {};
                        if (beforeRender) {
                            cfg.renderTo = null;
                        }
                        makeGrid(columns, data, cfg, options, locked);
                    }

                    function reconfigure() {
                        grid.reconfigure.apply(grid, arguments);
                        if (beforeRender) {
                            grid.render(Ext.getBody());
                        }
                    }

                    describe(beforeRender ? "before render" : "after render", function() {
                        describe("store only", function() {
                            describe("without locking", function() {
                                function expectNodeLength(n) {
                                    expect(view.getNodes().length).toBe(n);
                                }

                                describe("with no store", function() {
                                    beforeEach(function() {
                                        makeReconfigureGrid([{
                                            dataIndex: 'field1'
                                        }], undefined, null, {preventStoreCreate: true});
                                        reconfigure(makeStore());
                                    });

                                    it("should render data from the new store", function() {
                                        expectNodeLength(1);
                                    });

                                    it("should react to store", function() {
                                        store.add({});
                                        expectNodeLength(2);
                                    });

                                    it("should react to store remove", function() {
                                        store.removeAt(0);
                                        expectNodeLength(0);
                                    });

                                    it("should react to store update", function() {
                                        store.getAt(0).set('field1', 'Foo');
                                        expect(getCellText(0, 0)).toBe('Foo');
                                    });

                                    it("should react to store load", function() {
                                        store.loadData([{}, {}, {}, {}, {}, {}]);
                                        expectNodeLength(6);
                                    });

                                    it("should bind to the selection model", function() {
                                        expect(grid.getView().getSelectionModel().getStore()).toBe(store);
                                    });
                                });

                                describe("with an existing store", function() {
                                    var oldStore;

                                    beforeEach(function() {
                                        makeReconfigureGrid([{
                                            dataIndex: 'field1'
                                        }], 20);
                                        oldStore = store;
                                        reconfigure(makeStore());
                                    });

                                    afterEach(function() {
                                        oldStore = Ext.destroy(oldStore);
                                    });

                                    it("should render data from the new store", function() {
                                        expectNodeLength(1);
                                    });

                                    it("should react to store", function() {
                                        store.add({});
                                        expectNodeLength(2);
                                    });

                                    it("should react to store remove", function() {
                                        store.removeAt(0);
                                        expectNodeLength(0);
                                    });

                                    it("should react to store update", function() {
                                        store.getAt(0).set('field1', 'Foo');
                                        expect(getCellText(0, 0)).toBe('Foo');
                                    });

                                    it("should react to store load", function() {
                                        store.loadData([{}, {}, {}, {}, {}, {}]);
                                        expectNodeLength(6);
                                    });

                                    it("should bind the new store to the loadMask", function() {
                                        expect(grid.getView().loadMask.store).toBe(store);
                                    });

                                    it("should bind to the selection model", function() {
                                        expect(grid.getView().getSelectionModel().getStore()).toBe(store);
                                    });

                                    it("should not react to the old store", function() {
                                        oldStore.add([{}, {}, {}, {}, {}, {}]);
                                        expectNodeLength(1);
                                        oldStore.removeAt(0);
                                        expectNodeLength(1);
                                        oldStore.getAt(0).set('field1', 'Foo');
                                        expect(getCellText(0, 0)).toBe('1');
                                        oldStore.loadData([{}, {}, {}, {}, {}, {}, {}, {}, {}]);
                                        expectNodeLength(1);
                                    });
                                });
                            });

                            describe("with locking", function() {
                                function expectNodeLength(n) {
                                    expect(grid.lockedGrid.getView().getNodes().length).toBe(n);
                                    expect(grid.normalGrid.getView().getNodes().length).toBe(n);
                                }

                                describe("with no store", function() {
                                    beforeEach(function() {
                                        makeReconfigureGrid([{
                                            locked: true,
                                            dataIndex: 'field1'
                                        }, {
                                            dataIndex: 'field2'
                                        }], undefined, null, {preventStoreCreate: true});
                                        reconfigure(makeStore());
                                    });

                                    it("should render data from the new store", function() {
                                        expectNodeLength(1);
                                    });

                                    it("should react to store", function() {
                                        store.add({});
                                        expectNodeLength(2);
                                    });

                                    it("should react to store remove", function() {
                                        store.removeAt(0);
                                        expectNodeLength(0);
                                    });

                                    it("should react to store update", function() {
                                        store.getAt(0).set('field1', 'Foo');
                                        expect(getCellText(0, 0)).toBe('Foo');
                                    });

                                    it("should react to store load", function() {
                                        store.loadData([{}, {}, {}, {}, {}, {}]);
                                        expectNodeLength(6);
                                    });

                                    it("should bind to the selection model", function() {
                                        expect(grid.getView().getSelectionModel().getStore()).toBe(store);
                                    });
                                });

                                describe("with an existing store", function() {
                                    var oldStore;

                                    beforeEach(function() {
                                        makeReconfigureGrid([{
                                            locked: true,
                                            dataIndex: 'field1'
                                        }, {
                                            dataIndex: 'field2'
                                        }], 20);
                                        oldStore = store;
                                        reconfigure(makeStore());
                                    });

                                    afterEach(function() {
                                        oldStore = Ext.destroy(oldStore);
                                    });

                                    it("should render data from the new store", function() {
                                        expectNodeLength(1);
                                    });

                                    it("should react to store", function() {
                                        store.add({});
                                        expectNodeLength(2);
                                    });

                                    it("should react to store remove", function() {
                                        store.removeAt(0);
                                        expectNodeLength(0);
                                    });

                                    it("should react to store update", function() {
                                        store.getAt(0).set('field1', 'Foo');
                                        expect(getCellText(0, 0)).toBe('Foo');
                                    });

                                    it("should react to store load", function() {
                                        store.loadData([{}, {}, {}, {}, {}, {}]);
                                        expectNodeLength(6);
                                    });

                                    it("should bind the new store to the loadMask", function() {
                                        expect(grid.getView().loadMask.store).toBe(store);
                                    });

                                    it("should bind to the selection model", function() {
                                        expect(grid.getView().getSelectionModel().getStore()).toBe(store);
                                    });

                                    it("should not react to the old store", function() {
                                        oldStore.add([{}, {}, {}, {}, {}, {}]);
                                        expectNodeLength(1);
                                        oldStore.removeAt(0);
                                        expectNodeLength(1);
                                        oldStore.getAt(0).set('field1', 'Foo');
                                        expect(getCellText(0, 0)).toBe('1');
                                        oldStore.loadData([{}, {}, {}, {}, {}, {}, {}, {}, {}]);
                                        expectNodeLength(1);
                                    });
                                });
                            });
                        });

                        describe("columns only", function() {
                            var oldCols;

                            afterEach(function() {
                                oldCols = null;
                            });

                            describe("without locking", function() {
                                describe("with no columns", function() {
                                    beforeEach(function() {
                                        makeReconfigureGrid(null, undefined, null, {preventColumnCreate: true});
                                        oldCols = colRef;
                                        reconfigure(null, [{
                                            dataIndex: 'field2'
                                        }, {
                                            dataIndex: 'field7'
                                        }]);
                                        colRef = grid.getVisibleColumnManager().getColumns();
                                    });

                                    it("should add the new columns and render the contents", function() {
                                        expect(colRef.length).toBe(2);
                                        expect(getCellText(0, 0)).toBe('2');
                                        expect(getCellText(0, 1)).toBe('7');
                                    });
                                });

                                describe("with existing columns", function() {
                                    beforeEach(function() {
                                        makeReconfigureGrid([{
                                            dataIndex: 'field1'
                                        }]);
                                        oldCols = colRef;
                                        reconfigure(null, [{
                                            dataIndex: 'field2'
                                        }, {
                                            dataIndex: 'field7'
                                        }]);
                                        colRef = grid.getVisibleColumnManager().getColumns();
                                    });

                                    it("should add the new columns and render the contents", function() {
                                        expect(colRef.length).toBe(2);
                                        expect(getCellText(0, 0)).toBe('2');
                                        expect(getCellText(0, 1)).toBe('7');
                                    });

                                    it("should destroy old columns", function() {
                                        expect(oldCols[0].destroyed).toBe(true);
                                    });
                                });

                                it("should only refresh after the columns have been rendered", function() {
                                    var spy = jasmine.createSpy(),
                                        renderCount, refreshCounter, view;

                                    makeReconfigureGrid();
                                    view = grid.getView();
                                    refreshCounter = view.refreshCounter || 0;
                                    view.on('refresh', function() {
                                        renderCount = spy.callCount;
                                    });

                                    reconfigure(null, [{
                                        dataIndex: 'field2',
                                        listeners: {
                                            afterrender: spy
                                        }
                                    }, {
                                        dataIndex: 'field7',
                                        listeners: {
                                            afterrender: spy
                                        }
                                    }]);
                                    expect(renderCount).toBe(2);
                                    expect(view.refreshCounter).toBe(refreshCounter + 1);
                                });
                            });

                            describe("with locking", function() {
                                describe("with no columns", function() {
                                    beforeEach(function() {
                                        makeReconfigureGrid(null, undefined, {enableLocking: true}, {preventColumnCreate: true});
                                        oldCols = colRef;
                                        reconfigure(null, [{
                                            locked: true,
                                            dataIndex: 'field2'
                                        }, {
                                            dataIndex: 'field7'
                                        }]);
                                        colRef = grid.getVisibleColumnManager().getColumns();
                                    });

                                    it("should add the new columns and render the contents", function() {
                                        expect(colRef.length).toBe(2);
                                        expect(getCellText(0, 0)).toBe('2');
                                        expect(getCellText(0, 1)).toBe('7');
                                    });

                                    it("should process locked/unlocked columns", function() {
                                        expect(grid.lockedGrid.getVisibleColumnManager().getColumns().length).toBe(1);
                                        expect(grid.normalGrid.getVisibleColumnManager().getColumns().length).toBe(1);
                                    });
                                });

                                describe("with existing columns", function() {
                                    beforeEach(function() {
                                        makeReconfigureGrid([{
                                            locked: true,
                                            dataIndex: 'field1'
                                        }, {
                                            dataIndex: 'field3'
                                        }]);
                                        oldCols = colRef;
                                        reconfigure(null, [{
                                            locked: true,
                                            dataIndex: 'field2'
                                        }, {
                                            dataIndex: 'field7'
                                        }]);
                                        colRef = grid.getVisibleColumnManager().getColumns();
                                    });

                                    it("should add the new columns and render the contents", function() {
                                        expect(colRef.length).toBe(2);
                                        expect(getCellText(0, 0)).toBe('2');
                                        expect(getCellText(0, 1)).toBe('7');
                                    });

                                    it("should process locked/unlocked columns", function() {
                                        expect(grid.lockedGrid.getVisibleColumnManager().getColumns().length).toBe(1);
                                        expect(grid.normalGrid.getVisibleColumnManager().getColumns().length).toBe(1);
                                    });

                                    it("should destroy old columns", function() {
                                        expect(oldCols[0].destroyed).toBe(true);
                                        expect(oldCols[1].destroyed).toBe(true);
                                    });
                                });

                                it("should only refresh after the columns have been rendered", function() {
                                    var spy = jasmine.createSpy(),
                                        renderCount, refreshCounter, view;

                                    makeReconfigureGrid([{
                                        locked: true,
                                        dataIndex: 'field1'
                                    }, {
                                        dataIndex: 'field3'
                                    }]);

                                    view = grid.lockedGrid.getView();
                                    refreshCounter = view.refreshCounter || 0;

                                    view.on('refresh', function() {
                                        renderCount = spy.callCount;
                                    });


                                    reconfigure(null, [{
                                        locked: true,
                                        dataIndex: 'field2',
                                        listeners: {
                                            afterrender: spy
                                        }
                                    }, {
                                        dataIndex: 'field7',
                                        listeners: {
                                            afterrender: spy
                                        }
                                    }]);
                                    expect(renderCount).toBe(2);
                                    expect(view.refreshCounter).toBe(refreshCounter + 1);
                                });
                            });
                        });

                        describe("store & columns", function() {
                            var oldCols, oldStore;

                            afterEach(function() {
                                Ext.destroy(oldStore);
                                oldStore = oldCols = null;
                            });

                            describe("without locking", function() {
                                function expectNodeLength(n) {
                                    expect(view.getNodes().length).toBe(n);
                                }

                                describe("with no store and no columns", function() {
                                    beforeEach(function() {
                                        makeReconfigureGrid(null,  undefined, null, {preventStoreCreate: true, preventColumnCreate: true});
                                        oldCols = colRef;
                                        oldStore = store;
                                        reconfigure(makeStore(), [{
                                            dataIndex: 'field2'
                                        }, {
                                            dataIndex: 'field7'
                                        }]);
                                        colRef = grid.getVisibleColumnManager().getColumns();
                                    });

                                    it("should render data from the new store", function() {
                                        expectNodeLength(1);
                                    });

                                    it("should react to store", function() {
                                        store.add({});
                                        expectNodeLength(2);
                                    });

                                    it("should react to store remove", function() {
                                        store.removeAt(0);
                                        expectNodeLength(0);
                                    });

                                    it("should react to store update", function() {
                                        store.getAt(0).set('field2', 'Foo');
                                        expect(getCellText(0, 0)).toBe('Foo');
                                    });

                                    it("should react to store load", function() {
                                        store.loadData([{}, {}, {}, {}, {}, {}]);
                                        expectNodeLength(6);
                                    });

                                    it("should bind to the selection model", function() {
                                        expect(grid.getView().getSelectionModel().getStore()).toBe(store);
                                    });

                                    it("should add the new columns and render the contents", function() {
                                        expect(colRef.length).toBe(2);
                                        expect(getCellText(0, 0)).toBe('2');
                                        expect(getCellText(0, 1)).toBe('7');
                                    });
                                });

                                describe("with an existing store and no columns", function() {
                                    beforeEach(function() {
                                        makeReconfigureGrid(null,  undefined, null, {preventColumnCreate: true});
                                        oldCols = colRef;
                                        oldStore = store;
                                        reconfigure(makeStore(), [{
                                            dataIndex: 'field2'
                                        }, {
                                            dataIndex: 'field7'
                                        }]);
                                        colRef = grid.getVisibleColumnManager().getColumns();
                                    });

                                    it("should render data from the new store", function() {
                                        expectNodeLength(1);
                                    });

                                    it("should react to store", function() {
                                        store.add({});
                                        expectNodeLength(2);
                                    });

                                    it("should react to store remove", function() {
                                        store.removeAt(0);
                                        expectNodeLength(0);
                                    });

                                    it("should react to store update", function() {
                                        store.getAt(0).set('field2', 'Foo');
                                        expect(getCellText(0, 0)).toBe('Foo');
                                    });

                                    it("should react to store load", function() {
                                        store.loadData([{}, {}, {}, {}, {}, {}]);
                                        expectNodeLength(6);
                                    });

                                    it("should bind to the selection model", function() {
                                        expect(grid.getView().getSelectionModel().getStore()).toBe(store);
                                    });

                                    it("should not react to the old store", function() {
                                        oldStore.add([{}, {}, {}, {}, {}, {}]);
                                        expectNodeLength(1);
                                        oldStore.removeAt(0);
                                        expectNodeLength(1);
                                        oldStore.getAt(0).set('field1', 'Foo');
                                        expect(getCellText(0, 0)).toBe('2');
                                        oldStore.loadData([{}, {}, {}, {}, {}, {}, {}, {}, {}]);
                                        expectNodeLength(1);
                                    });

                                    it("should add the new columns and render the contents", function() {
                                        expect(colRef.length).toBe(2);
                                        expect(getCellText(0, 0)).toBe('2');
                                        expect(getCellText(0, 1)).toBe('7');
                                    });
                                });

                                describe("with no store and existing columns", function() {
                                    beforeEach(function() {
                                        makeReconfigureGrid([{
                                            dataIndex: 'field1'
                                        }],  undefined, null, {preventStoreCreate: true});
                                        oldCols = colRef;
                                        oldStore = store;
                                        reconfigure(makeStore(), [{
                                            dataIndex: 'field2'
                                        }, {
                                            dataIndex: 'field7'
                                        }]);
                                        colRef = grid.getVisibleColumnManager().getColumns();
                                    });

                                    it("should render data from the new store", function() {
                                        expectNodeLength(1);
                                    });

                                    it("should react to store", function() {
                                        store.add({});
                                        expectNodeLength(2);
                                    });

                                    it("should react to store remove", function() {
                                        store.removeAt(0);
                                        expectNodeLength(0);
                                    });

                                    it("should react to store update", function() {
                                        store.getAt(0).set('field2', 'Foo');
                                        expect(getCellText(0, 0)).toBe('Foo');
                                    });

                                    it("should react to store load", function() {
                                        store.loadData([{}, {}, {}, {}, {}, {}]);
                                        expectNodeLength(6);
                                    });

                                    it("should bind to the selection model", function() {
                                        expect(grid.getView().getSelectionModel().getStore()).toBe(store);
                                    });

                                    it("should add the new columns and render the contents", function() {
                                        expect(colRef.length).toBe(2);
                                        expect(getCellText(0, 0)).toBe('2');
                                        expect(getCellText(0, 1)).toBe('7');
                                    });

                                    it("should destroy old columns", function() {
                                        expect(oldCols[0].destroyed).toBe(true);
                                    });
                                });

                                describe("with an existing store and existing columns", function() {
                                    beforeEach(function() {
                                        makeReconfigureGrid([{
                                            dataIndex: 'field1'
                                        }]);
                                        oldCols = colRef;
                                        oldStore = store;
                                        reconfigure(makeStore(), [{
                                            dataIndex: 'field2'
                                        }, {
                                            dataIndex: 'field7'
                                        }]);
                                        colRef = grid.getVisibleColumnManager().getColumns();
                                    });

                                    it("should render data from the new store", function() {
                                        expectNodeLength(1);
                                    });

                                    it("should react to store", function() {
                                        store.add({});
                                        expectNodeLength(2);
                                    });

                                    it("should react to store remove", function() {
                                        store.removeAt(0);
                                        expectNodeLength(0);
                                    });

                                    it("should react to store update", function() {
                                        store.getAt(0).set('field2', 'Foo');
                                        expect(getCellText(0, 0)).toBe('Foo');
                                    });

                                    it("should react to store load", function() {
                                        store.loadData([{}, {}, {}, {}, {}, {}]);
                                        expectNodeLength(6);
                                    });

                                    it("should bind to the selection model", function() {
                                        expect(grid.getView().getSelectionModel().getStore()).toBe(store);
                                    });

                                    it("should not react to the old store", function() {
                                        oldStore.add([{}, {}, {}, {}, {}, {}]);
                                        expectNodeLength(1);
                                        oldStore.removeAt(0);
                                        expectNodeLength(1);
                                        oldStore.getAt(0).set('field1', 'Foo');
                                        expect(getCellText(0, 0)).toBe('2');
                                        oldStore.loadData([{}, {}, {}, {}, {}, {}, {}, {}, {}]);
                                        expectNodeLength(1);
                                    });

                                    it("should add the new columns and render the contents", function() {
                                        expect(colRef.length).toBe(2);
                                        expect(getCellText(0, 0)).toBe('2');
                                        expect(getCellText(0, 1)).toBe('7');
                                    });

                                    it("should destroy old columns", function() {
                                        expect(oldCols[0].destroyed).toBe(true);
                                    });
                                });

                                it("should only refresh after the columns have been rendered", function() {
                                    var spy = jasmine.createSpy(),
                                        renderCount, refreshCounter, view;

                                    makeReconfigureGrid();

                                    oldStore = store;
                                    view = grid.getView();
                                    refreshCounter = view.refreshCounter || 0;

                                    view.on('refresh', function() {
                                        renderCount = spy.callCount;
                                    });
          
                                    reconfigure(store, [{
                                        dataIndex: 'field2',
                                        listeners: {
                                            afterrender: spy
                                        }
                                    }, {
                                        dataIndex: 'field7',
                                        listeners: {
                                            afterrender: spy
                                        }
                                    }]);
                                    expect(renderCount).toBe(2);
                                    expect(view.refreshCounter).toBe(refreshCounter + 1);
                                });
                            });

                            describe("with locking", function() {
                                function expectNodeLength(n) {
                                    expect(grid.lockedGrid.getView().getNodes().length).toBe(n);
                                    expect(grid.normalGrid.getView().getNodes().length).toBe(n);
                                }

                                describe("with no store and no columns", function() {
                                    beforeEach(function() {
                                        makeReconfigureGrid(null,  undefined, {enableLocking: true}, {preventStoreCreate: true, preventColumnCreate: true});
                                        oldCols = colRef;
                                        oldStore = store;
                                        reconfigure(makeStore(), [{
                                            locked: true,
                                            dataIndex: 'field2'
                                        }, {
                                            dataIndex: 'field7'
                                        }]);
                                        colRef = grid.getVisibleColumnManager().getColumns();
                                    });

                                    it("should render data from the new store", function() {
                                        expectNodeLength(1);
                                    });

                                    it("should react to store", function() {
                                        store.add({});
                                        expectNodeLength(2);
                                    });

                                    it("should react to store remove", function() {
                                        store.removeAt(0);
                                        expectNodeLength(0);
                                    });

                                    it("should react to store update", function() {
                                        store.getAt(0).set('field2', 'Foo');
                                        expect(getCellText(0, 0)).toBe('Foo');
                                    });

                                    it("should react to store load", function() {
                                        store.loadData([{}, {}, {}, {}, {}, {}]);
                                        expectNodeLength(6);
                                    });

                                    it("should bind to the selection model", function() {
                                        expect(grid.getView().getSelectionModel().getStore()).toBe(store);
                                    });

                                    it("should add the new columns and render the contents", function() {
                                        expect(colRef.length).toBe(2);
                                        expect(getCellText(0, 0)).toBe('2');
                                        expect(getCellText(0, 1)).toBe('7');
                                    });

                                    it("should process locked/unlocked columns", function() {
                                        expect(grid.lockedGrid.getVisibleColumnManager().getColumns().length).toBe(1);
                                        expect(grid.normalGrid.getVisibleColumnManager().getColumns().length).toBe(1);
                                    });
                                });

                                describe("with an existing store and no columns", function() {
                                    beforeEach(function() {
                                        makeReconfigureGrid(null,  undefined, {enableLocking: true}, {preventColumnCreate: true});
                                        oldCols = colRef;
                                        oldStore = store;
                                        reconfigure(makeStore(), [{
                                            locked: true,
                                            dataIndex: 'field2'
                                        }, {
                                            dataIndex: 'field7'
                                        }]);
                                        colRef = grid.getVisibleColumnManager().getColumns();
                                    });

                                    it("should render data from the new store", function() {
                                        expectNodeLength(1);
                                    });

                                    it("should react to store", function() {
                                        store.add({});
                                        expectNodeLength(2);
                                    });

                                    it("should react to store remove", function() {
                                        store.removeAt(0);
                                        expectNodeLength(0);
                                    });

                                    it("should react to store update", function() {
                                        store.getAt(0).set('field2', 'Foo');
                                        expect(getCellText(0, 0)).toBe('Foo');
                                    });

                                    it("should react to store load", function() {
                                        store.loadData([{}, {}, {}, {}, {}, {}]);
                                        expectNodeLength(6);
                                    });

                                    it("should bind to the selection model", function() {
                                        expect(grid.getView().getSelectionModel().getStore()).toBe(store);
                                    });

                                    it("should not react to the old store", function() {
                                        oldStore.add([{}, {}, {}, {}, {}, {}]);
                                        expectNodeLength(1);
                                        oldStore.removeAt(0);
                                        expectNodeLength(1);
                                        oldStore.getAt(0).set('field1', 'Foo');
                                        expect(getCellText(0, 0)).toBe('2');
                                        oldStore.loadData([{}, {}, {}, {}, {}, {}, {}, {}, {}]);
                                        expectNodeLength(1);
                                    });

                                    it("should add the new columns and render the contents", function() {
                                        expect(colRef.length).toBe(2);
                                        expect(getCellText(0, 0)).toBe('2');
                                        expect(getCellText(0, 1)).toBe('7');
                                    });

                                    it("should process locked/unlocked columns", function() {
                                        expect(grid.lockedGrid.getVisibleColumnManager().getColumns().length).toBe(1);
                                        expect(grid.normalGrid.getVisibleColumnManager().getColumns().length).toBe(1);
                                    });
                                });

                                describe("with no store and existing columns", function() {
                                    beforeEach(function() {
                                        makeReconfigureGrid([{
                                            locked: true,
                                            dataIndex: 'field1'
                                        }, {
                                            dataIndex: 'field3'
                                        }],  undefined, null, {preventStoreCreate: true});
                                        oldCols = colRef;
                                        oldStore = store;
                                        reconfigure(makeStore(), [{
                                            locked: true,
                                            dataIndex: 'field2'
                                        }, {
                                            dataIndex: 'field7'
                                        }]);
                                        colRef = grid.getVisibleColumnManager().getColumns();
                                    });

                                    it("should render data from the new store", function() {
                                        expectNodeLength(1);
                                    });

                                    it("should react to store", function() {
                                        store.add({});
                                        expectNodeLength(2);
                                    });

                                    it("should react to store remove", function() {
                                        store.removeAt(0);
                                        expectNodeLength(0);
                                    });

                                    it("should react to store update", function() {
                                        store.getAt(0).set('field2', 'Foo');
                                        expect(getCellText(0, 0)).toBe('Foo');
                                    });

                                    it("should react to store load", function() {
                                        store.loadData([{}, {}, {}, {}, {}, {}]);
                                        expectNodeLength(6);
                                    });

                                    it("should bind to the selection model", function() {
                                        expect(grid.getView().getSelectionModel().getStore()).toBe(store);
                                    });

                                    it("should add the new columns and render the contents", function() {
                                        expect(colRef.length).toBe(2);
                                        expect(getCellText(0, 0)).toBe('2');
                                        expect(getCellText(0, 1)).toBe('7');
                                    });

                                    it("should process locked/unlocked columns", function() {
                                        expect(grid.lockedGrid.getVisibleColumnManager().getColumns().length).toBe(1);
                                        expect(grid.normalGrid.getVisibleColumnManager().getColumns().length).toBe(1);
                                    });

                                    it("should destroy old columns", function() {
                                        expect(oldCols[0].destroyed).toBe(true);
                                        expect(oldCols[1].destroyed).toBe(true);
                                    });
                                });

                                describe("with an existing store and existing columns", function() {
                                    beforeEach(function() {
                                        makeReconfigureGrid([{
                                            locked: true,
                                            dataIndex: 'field1'
                                        }, {
                                            dataIndex: 'field3'
                                        }]);
                                        oldCols = colRef;
                                        oldStore = store;
                                        reconfigure(makeStore(), [{
                                            locked: true,
                                            dataIndex: 'field2'
                                        }, {
                                            dataIndex: 'field7'
                                        }]);
                                        colRef = grid.getVisibleColumnManager().getColumns();
                                    });

                                    it("should render data from the new store", function() {
                                        expectNodeLength(1);
                                    });

                                    it("should react to store", function() {
                                        store.add({});
                                        expectNodeLength(2);
                                    });

                                    it("should react to store remove", function() {
                                        store.removeAt(0);
                                        expectNodeLength(0);
                                    });

                                    it("should react to store update", function() {
                                        store.getAt(0).set('field2', 'Foo');
                                        expect(getCellText(0, 0)).toBe('Foo');
                                    });

                                    it("should react to store load", function() {
                                        store.loadData([{}, {}, {}, {}, {}, {}]);
                                        expectNodeLength(6);
                                    });

                                    it("should bind to the selection model", function() {
                                        expect(grid.getView().getSelectionModel().getStore()).toBe(store);
                                    });

                                    it("should not react to the old store", function() {
                                        oldStore.add([{}, {}, {}, {}, {}, {}]);
                                        expectNodeLength(1);
                                        oldStore.removeAt(0);
                                        expectNodeLength(1);
                                        oldStore.getAt(0).set('field1', 'Foo');
                                        expect(getCellText(0, 0)).toBe('2');
                                        oldStore.loadData([{}, {}, {}, {}, {}, {}, {}, {}, {}]);
                                        expectNodeLength(1);
                                    });

                                    it("should add the new columns and render the contents", function() {
                                        expect(colRef.length).toBe(2);
                                        expect(getCellText(0, 0)).toBe('2');
                                        expect(getCellText(0, 1)).toBe('7');
                                    });

                                    it("should process locked/unlocked columns", function() {
                                        expect(grid.lockedGrid.getVisibleColumnManager().getColumns().length).toBe(1);
                                        expect(grid.normalGrid.getVisibleColumnManager().getColumns().length).toBe(1);
                                    });

                                    it("should destroy old columns", function() {
                                        expect(oldCols[0].destroyed).toBe(true);
                                        expect(oldCols[1].destroyed).toBe(true);
                                    });
                                });

                                it("should only refresh after the columns have been rendered", function() {
                                    var spy = jasmine.createSpy(),
                                        renderCount, refreshCounter, view;

                                    makeReconfigureGrid([{
                                        locked: true,
                                        dataIndex: 'field1'
                                    }, {
                                        dataIndex: 'field3'
                                    }]);
                                    oldStore = store;

                                    view = grid.lockedGrid.getView();
                                    refreshCounter = view.refreshCounter || 0;

                                    view.on('refresh', function() {
                                        renderCount = spy.callCount;
                                    });
          
                                    reconfigure(makeStore(), [{
                                        locked: true,
                                        dataIndex: 'field2',
                                        listeners: {
                                            afterrender: spy
                                        }
                                    }, {
                                        dataIndex: 'field7',
                                        listeners: {
                                            afterrender: spy
                                        }
                                    }]);
                                    expect(renderCount).toBe(2);
                                    expect(view.refreshCounter).toBe(refreshCounter + 1);
                                });
                            });
                        });
                    });
                }

                makeReconfigureSuite(false);
                makeReconfigureSuite(true);

                it("should only refresh the view once", function() {
                    var count = 0;
                    makeGrid([{
                        dataIndex: 'field1'
                    }]);
                    grid.getView().on('refresh', function() {
                        ++count;
                    });
                    grid.reconfigure(null, [{
                        dataIndex: 'field2'
                    }, {
                        dataIndex: 'field3'
                    }, {
                        dataIndex: 'field4'
                    }, {
                        dataIndex: 'field5'
                    }, {
                        dataIndex: 'field6'
                    }, {
                        dataIndex: 'field7'
                    }]);
                    expect(count).toBe(1);
                });
            });

            if (buffered) {
                describe('buffered row rendering', function() {
                    var view,
                        rows,
                        bufferedRenderer,
                        data,
                        scrollTop,
                        viewSize,
                        rowHeight;

                    beforeEach(function() {

                        // Important
                        // The scrollHeight matching must allow a 1px deviation.
                        // ScrollHeight is sometimes reported as 1px more than the actual content height.
                        var i, j,
                            row;

                        data = [];
                        for (i = 0; i < 100; i++) {
                            row = {};
                            for (j = 1; j < 11; j++) {
                                row['field' + j] = 'r' + i + ',f' + j;
                            }
                            data.push(row);
                        }

                        // Grid and data must be exactly the right shape for the tests to perform as expected!
                        // Enforce buffer zone defaults so that the rendered viewSize is reasonable.
                        // makeGrid function defeats buffered rendering by imposing large buffer zones.
                        makeGrid(null, data, {
                            width: 1000,
                            height: 500,
                            border: false,
                            trailingBufferZone: Ext.grid.plugin.BufferedRenderer.prototype.trailingBufferZone,
                            leadingBufferZone: Ext.grid.plugin.BufferedRenderer.prototype.leadingBufferZone
                        });
                        view = grid.getView();
                        rows = view.all;
                        bufferedRenderer = view.bufferedRenderer;

                        // Get as close to 15 visible rows as possible
                        grid.setHeight(bufferedRenderer.rowHeight * 15 + grid.headerCt.getHeight());
                        viewSize = bufferedRenderer.viewSize;
                    });

                    it('should handle removing range above the rendered view', function() {
                        var oldRowStartIndex;

                        rowHeight = bufferedRenderer.rowHeight;

                        expect(rows.getCount()).toBe(viewSize);

                        // Constant row height, so we know the scroll range
                        expect(view.el.dom.scrollHeight).toBeWithin(1, rowHeight * store.getCount());

                        bufferedRenderer.scrollTo(64);
                        scrollTop = view.getScrollY();
                        oldRowStartIndex = rows.startIndex;

                        store.removeAt(0, 10);

                        // Rendered block has chunked upwards by 10
                        expect(rows.startIndex).toBe(oldRowStartIndex - 10);

                        // Constant row height, so we know the scroll range
                        expect(view.el.dom.scrollHeight).toBe(rowHeight * store.getCount());

                        // Operation should bump us up the scroll range
                        expect(view.getScrollY()).toBeLessThan(scrollTop);

                        // Operation should not affect the rendered row count
                        expect(rows.getCount()).toBe(viewSize);

                        // The table should be positioned according to the start index of the rendered view
                        expect(getViewTop(view.body)).toBe(rows.startIndex * rowHeight - view.body.getBorderWidth('t'));
                    });

                    it('should handle removing range which intersects the top of the rendered view', function() {
                        rowHeight = bufferedRenderer.rowHeight;

                        // Constant row height, so we know the scroll range
                        expect(view.el.dom.scrollHeight).toBeWithin(1, rowHeight * store.getCount());

                        bufferedRenderer.scrollTo(64);
                        scrollTop = view.getScrollY();

                        store.removeAt(rows.startIndex - 10, 20);

                        // Constant row height, so we know the scroll range
                        expect(view.el.dom.scrollHeight).toBeWithin(1, rowHeight * store.getCount());

                        // Operation should bump us up the scroll range
                        expect(view.getScrollY()).toBeLessThan(scrollTop);

                        // Operation should not affect the rendered row count
                        expect(rows.getCount()).toBe(viewSize);

                        // The table should be positioned according to the start index of the rendered view
                        expect(getViewTop(view.body)).toBe(rows.startIndex * rowHeight - view.body.getBorderWidth('t'));
                    });

                    it('should handle removing range wholly within the rendered view', function() {
                        rowHeight = bufferedRenderer.rowHeight;

                        // Constant row height, so we know the scroll range
                        expect(view.el.dom.scrollHeight).toBeWithin(1, rowHeight * store.getCount());

                        bufferedRenderer.scrollTo(64);
                        scrollTop = view.getScrollY();

                        store.removeAt(52, 10);

                        // Constant row height, so we know the scroll range
                        expect(view.el.dom.scrollHeight).toBe(rowHeight * store.getCount());

                        // Operation should not affect scrollTop
                        expect(view.getScrollY()).toBe(scrollTop);

                        // Operation should not affect the rendered row count
                        expect(rows.getCount()).toBe(viewSize);

                        // The table should be positioned according to the start index of the rendered view
                        expect(getViewTop(view.body)).toBe(rows.startIndex * rowHeight - view.body.getBorderWidth('t'));
                    });

                    it('should handle removing range which intersects the bottom of the rendered view', function() {
                        rowHeight = bufferedRenderer.rowHeight;

                        // Constant row height, so we know the scroll range
                        expect(view.el.dom.scrollHeight).toBeWithin(1, rowHeight * store.getCount());

                        bufferedRenderer.scrollTo(64);
                        scrollTop = view.getScrollY();

                        store.removeAt(rows.endIndex - 10, 20);

                        // Constant row height, so we know the scroll range
                        expect(view.el.dom.scrollHeight).toBeWithin(1, rowHeight * store.getCount());

                        // Operation should not affect scrollTop
                        expect(view.getScrollY()).toBe(scrollTop);

                        // Operation should not affect the rendered row count
                        expect(rows.getCount()).toBe(viewSize);

                        // The table should be positioned according to the start index of the rendered view
                        expect(getViewTop(view.body)).toBe(rows.startIndex * rowHeight - view.body.getBorderWidth('t'));
                    });

                    it('should handle removing range which removes everything from halfway down rendered view', function() {
                        rowHeight = bufferedRenderer.rowHeight;

                        // Constant row height, so we know the scroll range
                        expect(view.el.dom.scrollHeight).toBeWithin(1, rowHeight * store.getCount());

                        bufferedRenderer.scrollTo(64);
                        scrollTop = view.getScrollY();

                        // RemoveAt's second input, the number to remove is sanity checked.
                        // This will remove everything from the middle of the view
                        store.removeAt(Math.floor((rows.endIndex - rows.startIndex) / 2), 1000);

                        // Constant row height, so we know the scroll range.
                        expect(view.el.dom.scrollHeight).toBeWithin(1, rowHeight * store.getCount());

                        // Fewer rows than viewSize now left in store
                        expect(rows.getCount()).toBe(store.getCount());

                        // The table should be positioned according to the start index of the rendered view
                        expect(getViewTop(view.body)).toBe(0);
                    });


                    it('should handle removing range which removes from top to halfway down rendered view', function() {
                        rowHeight = bufferedRenderer.rowHeight;

                        // Constant row height, so we know the scroll range
                        expect(view.el.dom.scrollHeight).toBeWithin(1, rowHeight * store.getCount());

                        bufferedRenderer.scrollTo(64);
                        scrollTop = view.getScrollY();

                        // RemoveAt's second input, the number to remove is sanity checked.
                        // This will remove everything from the middle of the view
                        store.removeAt(0, Math.floor(rows.startIndex + viewSize / 2));

                        // Constant row height, so we know the scroll range.
                        // Use toBeWithin matcher here.
                        // When there's no need for a stretcher, and the table creates the scroll range
                        // it appears to be 1 greater than the table's offsetHeight.
                        expect(view.el.dom.scrollHeight).toBeWithin(1, rowHeight * store.getCount());

                        // Fewer rows than viewSize now left in store
                        expect(rows.getCount()).toBe(store.getCount());

                        // Operation should bump us to the top
                        expect(view.getScrollY()).toBe(0);

                        // The table should be positioned according to the start index of the rendered view
                        expect(getViewTop(view.body)).toBe(0);
                    });

                    it('should handle removing range below the rendered view', function() {
                        rowHeight = bufferedRenderer.rowHeight;

                        // Constant row height, so we know the scroll range
                        expect(view.el.dom.scrollHeight).toBeWithin(1, rowHeight * store.getCount());

                        bufferedRenderer.scrollTo(64);//was 50
                        scrollTop = view.getScrollY();

                        store.removeAt(rows.endIndex + 10, 10);

                        // Constant row height, so we know the scroll range
                        expect(view.el.dom.scrollHeight).toBe(rowHeight * store.getCount());

                        // Operation should not affect scrollTop
                        expect(view.getScrollY()).toBe(scrollTop);

                        // Operation should not affect the rendered row count
                        expect(rows.getCount()).toBe(viewSize);

                        // The table should be positioned according to the start index of the rendered view
                        expect(getViewTop(view.body)).toBe(rows.startIndex * rowHeight - view.body.getBorderWidth('t'));
                    });

                    it('should handle removing range which encompasses the rendered view and leaves less than view size rows remaining', function() {
                        rowHeight = bufferedRenderer.rowHeight;

                        // Constant row height, so we know the scroll range
                        expect(view.el.dom.scrollHeight).toBeWithin(1, rowHeight * store.getCount());

                        bufferedRenderer.scrollTo(44);//was 30
                        scrollTop = view.getScrollY();

                        store.removeAt(5, 90);

                        // No scrolling now with only 10 rows left!
                        expect(view.el.dom.scrollHeight).toBeWithin(1, view.el.dom.clientHeight);

                        // Obviously... no scrolling with only 10 rows left!
                        expect(view.getScrollY()).toBe(0);

                        // Operation should not affect the rendered row count
                        expect(rows.getCount()).toBe(10);

                        // The table should be positioned according to the start index of the rendered view
                        expect(getViewTop(view.body)).toBe(0);
                    });

                    it('should handle removing range which encompasses the rendered view', function() {
                        rowHeight = bufferedRenderer.rowHeight;

                        // Constant row height, so we know the scroll range
                        expect(view.el.dom.scrollHeight).toBeWithin(1, rowHeight * store.getCount());

                        bufferedRenderer.scrollTo(44);
                        scrollTop = view.getScrollY();

                        store.removeAt(rows.startIndex - 1, viewSize + 2);

                        // Constant row height, so we know the scroll range
                        expect(bufferedRenderer.bodyTop + view.body.dom.offsetHeight - 1).toBe(rowHeight * store.getCount());

                        // Operation should not affect scrollTop
                        expect(view.el.dom.scrollTop).toBe(scrollTop);

                        // We hit the end, so there's a bit lacking at the top
                        expect(rows.getCount()).toBeLessThan(viewSize);

                        // The table should be positioned according to the start index of the rendered view
                        expect(getViewTop(view.body)).toBe(Math.max(rows.startIndex * rowHeight, 0));
                    });

                    it('should handle removing range which leaves less than the viewSize rows in store', function() {
                        rowHeight = bufferedRenderer.rowHeight;

                        // Constant row height, so we know the scroll range
                        expect(view.el.dom.scrollHeight).toBeWithin(1, rowHeight * store.getCount());

                        bufferedRenderer.scrollTo(34);
                        scrollTop = view.getScrollY();

                        store.removeAt(0, store.getCount() - 10);

                        // No scrolling now with only 10 rows left!
                        expect(view.el.dom.scrollHeight).toBe(view.el.dom.clientHeight);

                        // Obviously... no scrolling with only 10 rows left!
                        expect(view.getScrollY()).toBe(0);

                        // View can only contain 10 rows
                        expect(rows.getCount()).toBe(10);

                        // The table should be at top
                        expect(getViewTop(view.body)).toBe(0);
                    });
                    
                    it('Should prepend to the rendered block when inserting at position 0', function() {
                        var cell00;
                        scrollTop = view.getScrollY();
                        
                        store.insert(0, {
                            field1: 'Test'
                        });
                        
                        cell00 = Ext.getDom(view.getCellByPosition({
                            row: 0,
                            column: 0
                        }));

                        // Operation should bump us down the scroll range
                        expect(view.getScrollY()).toBeGreaterThan(scrollTop);

                        // View item must be added
                        expect(Ext.String.trim(cell00.textContent || cell00.innerText)).toBe('Test');

                        // The table should be at top
                        expect(getViewTop(view.body)).toBe(0);
                    });

                    it('should handle adding range above the rendered view', function() {
                        var oldRowStartIndex;

                        rowHeight = bufferedRenderer.rowHeight;

                        expect(rows.getCount()).toBe(viewSize);

                        // Constant row height, so we know the scroll range
                        expect(view.el.dom.scrollHeight).toBeWithin(1, rowHeight * store.getCount());

                        bufferedRenderer.scrollTo(64);
                        scrollTop = view.el.dom.scrollTop;
                        oldRowStartIndex = rows.startIndex;

                        // Insert 10 rows above the rendered block
                        store.insert(0, [
                            {}, {}, {}, {}, {}, {}, {}, {}, {}, {}
                        ]);

                        // Rendered block has chunked upwards by 10
                        expect(rows.startIndex).toBe(oldRowStartIndex + 10);

                        // Constant row height, so we know the scroll range
                        expect(view.el.dom.scrollHeight).toBe(rowHeight * store.getCount());

                        // Operation should bump us down the scroll range
                        expect(view.el.dom.scrollTop).toBeGreaterThan(scrollTop);

                        // Operation should not affect the rendered row count
                        expect(rows.getCount()).toBe(viewSize);

                        // The table should be positioned according to the start index of the rendered view
                        expect(getViewTop(view.body)).toBe(rows.startIndex * rowHeight - view.body.getBorderWidth('t'));
                    });

                    it('should render rows when buffered block is less than the view size', function() {
                        var v = viewSize,
                            targetViewSize = v - 10;

                        // We need less than viewSize rows to be there
                        store.removeAt(targetViewSize, store.getCount() - targetViewSize);

                        // Now there are the number of rows we require (ten less than  viewSize for the grid height)
                        // And we're at the top
                        expect(rows.getCount()).toBe(targetViewSize);
                        expect(bufferedRenderer.scrollTop).toBe(0);
                        expect(bufferedRenderer.position).toBe(0);
                        
                        store.add({});
                        
                        // Must has added a row
                        expect(rows.getCount()).toBe(targetViewSize + 1);
                        expect(bufferedRenderer.scrollTop).toBe(0);
                        expect(bufferedRenderer.position).toBe(0);
                    });
                });

                describe('initial correction of viewSize', function() {
                    describe('when rowHeight is smaller than expected and viewSize has to grow', function() {
                        var i,
                            data,
                            columns,
                            empty = new String(); // Truthy empty string so that renderer does not insert &nbsp;

                        beforeEach(function() {
                            data = [];
                            // We need a lot of rows so that we get to add more than the original default viewSize
                            for (i = 0; i < 200; i++) {
                                data.push({
                                    field0: 'r' + i + ',f0'
                                });
                            }

                            columns = [{
                                dataIndex: 'field0',
                                text: 'Field 0',
                                width: 90,

                                // Empty cell. Should only be paddingTop+paddingBottom high
                                renderer: function() {
                                    return empty;
                                }
                            }];
                        });
                        
                        it('should append new rows to the view', function() {
                            // Make like mobile dev, and only overhang 1 row each side
                            // Make it tall enough so that the default viewSize of 100 will leave
                            // the view short, and BufferedRenderer will have to add rows.
                            makeGrid(columns, data, {
                                height: 900,
                                border: false,

                                // We want to get spies in before render
                                renderTo: null,
                                trailingBufferZone: 1,
                                leadingBufferZone: 1
                            });
                            var getRangeSpy = spyOn(store, 'getRange').andCallThrough();

                            grid.render(document.body);

                            // Only one refresh. The initial refresh which inserts the default viewSize.
                            // The way we have it set up, this will be a shortfall, and rows will have to be appended.
                            expect(view.refreshCounter).toBe(1);

                            // The rendered row count should have been bumped up to the calculated viewSize
                            expect(view.all.getCount()).toBe(view.bufferedRenderer.viewSize);
                            
                            // Two calls to Store#getRange should have been made...
                            expect(getRangeSpy.callCount).toBe(2);

                            // First call gets the default view size
                            expect(getRangeSpy.calls[0].args).toEqual([0, Ext.grid.plugin.BufferedRenderer.prototype.viewSize - 1]);

                            // Then we top up the view with the missing rows.
                            // Second getRange will have been called with options, so slice to just test start and end indices
                            expect(Ext.Array.slice(getRangeSpy.calls[1].args, 0, 2)).toEqual([Ext.grid.plugin.BufferedRenderer.prototype.viewSize, view.bufferedRenderer.viewSize - 1]);
                        });
                    });

                    describe('when rowHeight is larger than expected and viewSize has to shrink', function() {
                        var i,
                            data,
                            columns;

                        beforeEach(function() {
                            data = [];
                            // We need a lot of rows so that we get to add more than the original default viewSize
                            for (i = 0; i < 200; i++) {
                                data.push({
                                    field0: 'r' + i + ',f0'
                                });
                            }

                            columns = [{
                                dataIndex: 'field0',
                                text: 'Field 0',
                                width: 90,

                                // Extra tall cell to make the initially rendered view too large.
                                renderer: function() {
                                    return '<div style="height:30px"></div>';
                                }
                            }];
                        });
                        
                        it('should append new rows to the view', function() {
                            // Make like mobile dev, and only overhang 1 row each side
                            // Make it tall enough so that the default viewSize of 100 will leave
                            // the view short, and BufferedRenderer will have to add rows.
                            makeGrid(columns, data, {
                                height: 200,
                                border: false,

                                // We want to get spies in before render
                                renderTo: null,
                                trailingBufferZone: 1,
                                leadingBufferZone: 1
                            });
                            var getRangeSpy = spyOn(store, 'getRange').andCallThrough(),
                                removeRangeSpy = spyOn(view.all, 'removeRange').andCallThrough();

                            grid.render(document.body);

                            // Only one refresh. The initial refresh which inserts the default viewSize.
                            // The way we have it set up, this will be a to many, and rows will have to be removed.
                            expect(view.refreshCounter).toBe(1);

                            // The rendered row count should have been shrunk to the calculated viewSize
                            expect(view.all.getCount()).toBe(view.bufferedRenderer.viewSize);
                            
                            // One calls to Store#getRange should have been made...
                            expect(getRangeSpy.callCount).toBe(1);

                            // First call gets the default view size
                            expect(getRangeSpy.calls[0].args).toEqual([0, Ext.grid.plugin.BufferedRenderer.prototype.viewSize - 1]);

                            // Remove removes from the end of the viewSize to the default rendered viewSize
                            // Will have been called with third param, so slice args.
                            expect(Ext.Array.slice(removeRangeSpy.calls[0].args, 0, 2)).toEqual([view.bufferedRenderer.viewSize, Ext.grid.plugin.BufferedRenderer.prototype.viewSize - 1]);
                        });
                    });
                });
            }

            describe('shrinkwrap height', function() {
                var data, columns;

                beforeEach(function() {
                    var i, j,
                        row;

                    data = [];
                    for (i = 0; i < 100; i++) {
                        row = {};
                        for (j = 1; j < 11; j++) {
                            row['field' + j] = 'r' + i + ',f' + j;
                        }
                        data.push(row);
                    }
                    
                    columns = [];
                    for (i = 1; i < 11; i++) {
                        columns.push({
                            dataIndex: 'field' + i,
                            text: 'Field ' + i,
                            width: 90
                        });
                    }
                    columns[0].flex = 1;
                });

                it('should allow unconstrained height grids to expand to accommodate content', function() {
                    makeGrid(columns, data, {
                        height: undefined,
                        border: false
                    });
                    
                    // View and Grid should be stretched vertically to accommodate content.
                    // Flexed column should mean that the horizontal content fits exactly.
                    // All widths should be equal since we configured NO BORDERS.
                    expect(view.getWidth()).toBe(grid.getWidth());
                    expect(view.getHeight()).toBe(grid.getHeight() - grid.body.getBorderWidth('tb') - grid.headerCt.getHeight());
                    expect(view.el.dom.clientWidth).toBe(grid.getWidth());
                    expect(view.el.dom.clientHeight).toBe(view.getHeight());
                });

                it('should reduce height if shrinkwrap height violates height constraint', function() {
                    makeGrid(columns, data, {
                        maxHeight: 100,
                        border: false
                    });
                    
                    // The width of the View still fits because of the flexed column
                    expect(view.getWidth()).toBe(grid.getWidth());

                    // If this system displays scrollbars...
                    // The presence of the vertical scrollbar should mean clientWidth is less than View's full width
                    if (Ext.getScrollbarSize().width) {
                        expect(view.el.dom.clientWidth).toBeLessThan(grid.getWidth());
                    }

                    // The height constraint means that the clientHeight is less than the view's scrollable height
                    expect(view.el.dom.clientHeight).toBeLessThan(view.el.dom.scrollHeight);
                });
            });

            describe("locking columns", function(){
                it("should synchronize horizontal scrollbar presence between locked and normal side.", function(){
                    var indexes = [],
                        fn = function(){
                            indexes.push(arguments[4]);
                        };

                    makeGrid([{
                        locked: true,
                        dataIndex: 'field1',
                        renderer: fn    
                    }, {
                        locked: true,
                        dataIndex: 'field2',
                        renderer: fn    
                    }, {
                        dataIndex: 'field3',
                        renderer: fn   
                    }, {
                        dataIndex: 'field4',
                        renderer: fn   
                    }], undefined, {
                        width: 600,
                        height: 200
                    });

                    // The client height should be the same - scrollbars at the bottom should be synched. Either both there or none there.
                    // In this case, there should be none there.
                    expect(grid.lockedGrid.getView().getTargetEl().dom.clientHeight).toEqual(grid.normalGrid.getView().getTargetEl().dom.clientHeight);

                    // View's client height is the same as the offset height because there is no horizontal scrollbar    
                    expect(grid.lockedGrid.getView().getTargetEl().dom.clientHeight).toEqual(grid.lockedGrid.getView().getTargetEl().dom.offsetHeight);

                    // Create horizontal overflow
                    grid.getColumnManager().getColumns()[3].setWidth(500);

                    // The client height should be the same - scrollbars at the bottom should be synched. Either both there or none there.
                    // In this case, both should have scrollbars.
                    expect(grid.lockedGrid.getView().getTargetEl().dom.clientHeight).toEqual(grid.normalGrid.getView().getTargetEl().dom.clientHeight);

                    // View's client height has been reduced by horizontal scrollbar appearing due to overflow in normal side (if scrollbars take up space)
                    if (scrollbarWidth && Ext.supports.touchScroll !== 2) {
                        expect(grid.lockedGrid.getView().getTargetEl().dom.clientHeight).toBeLessThan(grid.lockedGrid.getView().getTargetEl().dom.offsetHeight);
                        expect(grid.normalGrid.getView().getTargetEl().dom.clientHeight).toBeLessThan(grid.normalGrid.getView().getTargetEl().dom.offsetHeight);
                    }
                });

                it('should unbind locking view from its store', function() {
                    makeGrid([{
                        locked: true,
                        dataIndex: 'field1'
                    }, {
                        locked: true,
                        dataIndex: 'field2'
                    }, {
                        dataIndex: 'field3'
                    }, {
                        dataIndex: 'field4'
                    }], undefined, {
                        width: 600,
                        height: 200
                    });

                    expect(store.hasListeners.refresh).toBeDefined();

                    grid.destroy();

                    // After destroy, there are no listeners
                    expect(store.hasListeners.refresh).toBeUndefined();
                });

                describe('loadMask', function () {
                    function returnSucessFalse() {
                        while (Ext.Ajax.mockGetAllRequests().length) {
                            Ext.Ajax.mockComplete({
                                status: 200,
                                responseText: Ext.encode({
                                    success: false
                                })
                            });
                        }
                    }

                    describe('Proxy throws exception during load', function() {
                        beforeEach(function() {
                            MockAjaxManager.addMethods();
                        });

                        afterEach(function() {
                            MockAjaxManager.removeMethods();
                        });

                        it('should hide the load mask if the load fails with an exception', function() {
                            makeGrid(null, undefined, {
                                store: {
                                    proxy: {
                                        type: 'ajax',
                                        url: 'fakeUrl',
                                        reader: {
                                            type: 'json'
                                        }
                                    }
                                }
                            }, {
                                preventStoreCreate: true
                            });
                            grid.store.loadPage(1);

                            // While waiting, the mask should be visible
                            expect(grid.view.loadMask.isVisible()).toBe(true);

                            returnSucessFalse();

                            // The success: false should
                            // have thrown an exception which should hide the mask
                            expect(grid.view.loadMask.isVisible()).toBe(false);
                        });
                    });

                    it('should raise a load mask by default (no loadMask config specified)', function () {
                        makeGrid([{
                            locked: true,
                            dataIndex: 'field1'
                        }, {
                            locked: true,
                            dataIndex: 'field2'
                        }, {
                            dataIndex: 'field3'
                        }, {
                            dataIndex: 'field4'
                        }], undefined, {
                            width: 600,
                            height: 200
                        });

                        expect(grid.view.loadMask instanceof Ext.LoadMask).toBe(true);
                    });

                    it('should not raise a load mask when set as false in viewConfig', function () {
                        makeGrid([{
                            locked: true,
                            dataIndex: 'field1'
                        }, {
                            locked: true,
                            dataIndex: 'field2'
                        }, {
                            dataIndex: 'field3'
                        }, {
                            dataIndex: 'field4'
                        }], undefined, {
                            viewConfig: {
                                loadMask: false
                            }
                        });

                        expect(grid.view.loadMask).toBe(false);
                    });

                    it('should raise a load mask when set on the grid', function () {
                        makeGrid([{
                            locked: true,
                            dataIndex: 'field1'
                        }, {
                            locked: true,
                            dataIndex: 'field2'
                        }, {
                            dataIndex: 'field3'
                        }, {
                            dataIndex: 'field4'
                        }], undefined, {
                            loadMask: true
                        });

                        expect(grid.loadMask).toBe(true);
                        expect(grid.view.loadMask instanceof Ext.LoadMask).toBe(true);
                    });

                    it('should respect the viewConfig definition as final (loadMask == true)', function () {
                        makeGrid([{
                            locked: true,
                            dataIndex: 'field1'
                        }, {
                            locked: true,
                            dataIndex: 'field2'
                        }, {
                            dataIndex: 'field3'
                        }, {
                            dataIndex: 'field4'
                        }], undefined, {
                            loadMask: false,
                            viewConfig: {
                                loadMask: true
                            }
                        });

                        expect(grid.loadMask).toBe(false);
                        expect(grid.view.loadMask instanceof Ext.LoadMask).toBe(true);
                    });

                    it('should respect the viewConfig definition as final (loadMask == false)', function () {
                        makeGrid([{
                            locked: true,
                            dataIndex: 'field1'
                        }, {
                            locked: true,
                            dataIndex: 'field2'
                        }, {
                            dataIndex: 'field3'
                        }, {
                            dataIndex: 'field4'
                        }], undefined, {
                            loadMask: true,
                            viewConfig: {
                                loadMask: false
                            }
                        });

                        expect(grid.loadMask).toBe(true);
                        expect(grid.view.loadMask).toBe(false);
                    });
                });

                describe('reconfiguring', function () {
                    describe('with CheckboxModel', function () {
                        it('should invalidate the lockedGrid.width so it shrinkwraps', function () {
                            // See EXTJS-13408.
                            var activeHeader;

                            this.addMatchers({
                                toBeAtLeast: function (expected) {
                                    return expected <= this.actual;
                                }
                            });

                            // Let's make it simpler to measure the width by not having any locked columns.
                            // EnableLocking will have the checkbox column added to the lockedGrid partner.
                            makeGrid(null, undefined, {
                                enableLocking: true,
                                selModel: new Ext.selection.CheckboxModel()
                            });

                            grid.reconfigure(store, [{
                                dataIndex: 'field1'
                            }, {
                                dataIndex: 'field2'
                            }, {
                                dataIndex: 'field3'
                            }]);
                        
                            var borderWidth = grid.lockedGrid.el.getBorderWidth('lr');

                            // First, verify that the width of the lockedGrid is the width of the checkbox
                            // column after reconfigure.
                            expect(grid.lockedGrid.width).toBe(Ext.selection.CheckboxModel.prototype.headerWidth + borderWidth);

                            activeHeader = grid.normalGrid.columnManager.getLast();

                            // Call lock and pass in the active header.
                            grid.lock(activeHeader);

                            // We now expect the locked grid to be at least the width of the checkbox column
                            // plus the newly-locked column.
                            expect(grid.lockedGrid.width).toBe(Ext.selection.CheckboxModel.prototype.headerWidth + activeHeader.width + borderWidth);
                        });
                    });
                });

                describe('variable row height', function() {
                    var normalRows, lockedRows, i;

                    it("should match the row heights between locked sides", function() {
                        makeGrid([{
                            dataIndex: 'name',
                            locked: true,
                            variableRowHeight: true
                        }, {
                            dataIndex: 'email',
                            width: 200
                        }, {
                            dataIndex: 'phone',
                            width: 200
                        }], [{
                            field1: '1<br>'
                        }, {
                            field1: '2<br>1'
                        }, {
                            field1: '3<br>1'
                        }, {
                            field1: '4<br>1'
                        }]);

                        normalRows = grid.normalGrid.getView().all;
                        lockedRows = grid.lockedGrid.getView().all;

                        // Row heights must be synched between the sides.
                        // Check that they are all equal.
                        for (i = normalRows.startIndex; i <= normalRows.endIndex; i++) {
                            expect(normalRows.item(i, true).offsetHeight).toEqual(lockedRows.item(i, true).offsetHeight);
                        }

                        // Move the variableRowHeight "Name" column into the normal grid
                        grid.unlock(grid.getColumnManager().getHeaderAtIndex(0));

                        if (buffered) {
                            expect(grid.normalGrid.view.bufferedRenderer.variableRowHeight).toBe(true);

                            // Hide the variableRowHeight "Name" column
                            grid.normalGrid.getVisibleColumnManager().getColumns()[0].hide();

                            // Now that the only variableRowHeight column is hidden, the buffered renderer should know about that.
                            expect(grid.normalGrid.view.bufferedRenderer.variableRowHeight).toBe(false);            
                        }
                    });
                });
            });

            describe('ensureVisible', function() {
                var success,
                    record,
                    htmlEl,
                    detectedScope,
                    rec100,
                    rec400;

                // Each test uses a grid with 500 rows
                beforeEach(function() {
                    success = false;
                    makeGrid(null, 500);
                    rec100 = store.getAt(100);
                    rec400 = store.getAt(400);
                });
                it('should scroll into view when using record ID', function() {
                    grid.ensureVisible('rec400', {
                        callback: function(passedSuccess, passedRecord, passedHtmlEl) {
                            success = passedSuccess;
                            record = passedRecord;
                            htmlEl = passedHtmlEl;
                            detectedScope = this;
                        },
                        select: true
                    });
                    waitsFor(function() {
                        return success;
                    });
                    runs(function() {
                        // Default scope is the grid
                        expect(detectedScope).toBe(grid);

                        expect(record).toBe(rec400);

                        // Table row scrolled to must be correct
                        expect(htmlEl).toBe(view.getNode(rec400));

                        // The select option was passed
                        expect(grid.getSelectionModel().getSelection()[0]).toBe(rec400);

                        // The bottom of the row should be within view
                        expect(Ext.fly(htmlEl).getBox().bottom).toBeLessThanOrEqual(view.getBox().bottom);

                        grid.ensureVisible('rec100', {
                            callback: function(passedSuccess, passedRecord, passedHtmlEl) {
                                success = passedSuccess;
                                record = passedRecord;
                                htmlEl = passedHtmlEl;
                                detectedScope = this;
                            }
                        });
                        waitsFor(function() {
                            return success;
                        });

                        runs(function() {
                            // Default scope is the grid
                            expect(detectedScope).toBe(grid);

                            expect(record).toBe(rec100);

                            // Table row scrolled to must be correct
                            expect(htmlEl).toBe(view.getNode(rec100));

                            // The top of the row should be within view
                            expect(Ext.fly(htmlEl).getBox().top).toBeGreaterThanOrEqual(view.getBox().top);
                        });
                    });
                });
                it('should scroll into view when using record', function() {
                    var o = {};

                    grid.ensureVisible(rec400, {
                        callback: function(passedSuccess, passedRecord, passedHtmlEl) {
                            success = passedSuccess;
                            record = passedRecord;
                            htmlEl = passedHtmlEl;
                            detectedScope = this;
                        },
                        scope: o
                    });
                    waitsFor(function() {
                        return success;
                    });
                    runs(function() {
                        // Use passed scope
                        expect(detectedScope).toBe(o);

                        expect(record).toBe(rec400);

                        // Table row scrolled to must be correct
                        expect(htmlEl).toBe(view.getNode(rec400));

                        // The bottom of the row should be within view
                        expect(Ext.fly(htmlEl).getBox().bottom).toBeLessThanOrEqual(view.getBox().bottom);

                        grid.ensureVisible(rec100, {
                            callback: function(passedSuccess, passedRecord, passedHtmlEl) {
                                success = passedSuccess;
                                record = passedRecord;
                                htmlEl = passedHtmlEl;
                                detectedScope = this;
                            },
                            scope: o
                        });
                        waitsFor(function() {
                            return success;
                        });
                        
                        runs(function() {
                            // Use passed scope
                            expect(detectedScope).toBe(o);

                            expect(record).toBe(rec100);

                            // Table row scrolled to must be correct
                            expect(htmlEl).toBe(view.getNode(rec100));

                            // The top of the row should be within view
                            expect(Ext.fly(view.getNode(rec100)).getBox().top).toBeGreaterThanOrEqual(view.getBox().top);
                        });
                    });
                });
                it('should scroll into view when using record index', function() {
                    grid.ensureVisible(400, {
                        callback: function(passedSuccess, passedRecord, passedHtmlEl) {
                            success = passedSuccess;
                            record = passedRecord;
                            htmlEl = passedHtmlEl;
                        }
                    });
                    waitsFor(function() {
                        return success;
                    });
                    runs(function() {
                        expect(record).toBe(rec400);

                        // Table row scrolled to must be correct
                        expect(htmlEl).toBe(view.getNode(rec400));

                        // The bottom of the row should be within view
                        expect(Ext.fly(htmlEl).getBox().bottom).toBeLessThanOrEqual(view.getBox().bottom);

                        grid.ensureVisible(100, {
                            callback: function(passedSuccess, passedRecord, passedHtmlEl) {
                                success = passedSuccess;
                                record = passedRecord;
                                htmlEl = passedHtmlEl;
                                detectedScope = this;
                            }
                        });
                        waitsFor(function() {
                            return success;
                        });
                        
                        runs(function() {
                            expect(record).toBe(rec100);

                            // Table row scrolled to must be correct
                            expect(htmlEl).toBe(view.getNode(rec100));

                            // The top of the row should be within view
                            expect(Ext.fly(htmlEl).getBox().top).toBeGreaterThanOrEqual(view.getBox().top);
                        });
                    });
                });
            });

            describe("scrollbars", function() {
                function makeScrollSuite(withLocking) {
                    describe(withLocking ? "with locking" : "without locking", function() {
                        var gridRef,
                            originalScrollBarSize,
                            singleRowHeight,
                            maxRowsBeforeScroll,
                            scrollRowSize,
                            borderWidth,
                            colRef,
                            lockedIsVariable,
                            maxRowsBeforeScrollWithHorizontalScrollBar;

                        beforeEach(function() {
                            lockedIsVariable = false;
                            originalScrollBarSize = Ext.grid.ColumnLayout.prototype.scrollbarWidth;
                            // Create nice round numbers for calculations so that we can hardcode expected flexed widths
                            Ext.grid.ColumnLayout.prototype.scrollbarWidth = scrollbarsTakeSpace ? 20 : 0;

                            if (!singleRowHeight) {
                                // Do this the first time, calculate the height of a single row &
                                // the amount of rows we an have without a vertical scroll
                                borderWidth = 0;

                                makeScrollGrid([{
                                    dataIndex: 'field1',
                                    width: 100
                                }], 10);

                                var measureView = (withLocking ? grid.normalGrid : grid).getView(),
                                    viewHeight = measureView.getHeight(),
                                    measureNode = Ext.fly(measureView.getNode(0));

                                singleRowHeight = measureNode.getHeight();
                                
                                // In IE8 we're adding bottom border on all the rows to work around
                                // the lack of :last-child selector, and we compensate that by setting
                                // a negative top margin that equals the border width, so that top and
                                // bottom borders overlap on adjacent rows. Negative margin does not
                                // affect the row's reported height though so we have to compensate
                                // for that effectively invisible additional border width here.
                                // Note that this code mostly duplicates the actual row height
                                // calculation performed in BufferedRenderer.getScrollHeight(),
                                // and the same compensation is applied there as well.
                                if (Ext.isIE8) {
                                    singleRowHeight -= measureNode.getBorderWidth('b');
                                }
                                
                                maxRowsBeforeScroll = Math.floor(viewHeight / singleRowHeight);
                                viewHeight -= Ext.getScrollbarSize().width;
                                maxRowsBeforeScrollWithHorizontalScrollBar = Math.floor(viewHeight / singleRowHeight);
                                scrollRowSize = maxRowsBeforeScroll + 100;
                        
                                if (withLocking) {
                                    borderWidth = parseInt(grid.lockedGrid.getEl().getStyle('border-right-width'), 10);
                                }

                                grid.destroy();
                                store.destroy();
                                gridRef = colRef = null;
                            }
                        });

                        afterEach(function() {
                            Ext.grid.ColumnLayout.prototype.scrollbarWidth = originalScrollBarSize;
                            gridRef = colRef = null;
                            lockedIsVariable = false;
                        });

                        function makeScrollGrid(columns, data, cfg) {
                            var lockedColWidth = 100;

                            if (Ext.isNumber(data)) {
                                data = makeRows(data);
                            }
                            Ext.Array.forEach(columns, function(column, i) {
                                if (!column.dataIndex) {
                                    column.dataIndex = 'field' + (i + 1);
                                }
                            });
                            if (withLocking) {
                                columns.unshift({
                                    width: lockedColWidth,
                                    dataIndex: 'field10',
                                    locked: true,
                                    variableRowHeight: lockedIsVariable
                                });
                                cfg = cfg || {};
                                cfg.width = 1000 + borderWidth + lockedColWidth;
                            }
                            makeGrid(columns, data, cfg);
                            gridRef = withLocking ? grid.normalGrid : grid;
                            colRef = gridRef.getColumnManager().getColumns();
                        }

                        function expectScroll(vertical, horizontal) {
                            var dom = gridRef.getView().getEl().dom;

                            // In Mac OS X, scrollbars can be invisible until user hovers mouse cursor
                            // over the scrolled area. This is hard to test so we just assume that
                            // in Mac browsers scrollbars can have 0 width.
                            if (vertical !== undefined) {
                                if (vertical) {
                                    if (Ext.isMac) {
                                        expect(dom.scrollHeight).toBeGreaterThanOrEqual(dom.clientHeight);
                                    }
                                    else {
                                        expect(dom.scrollHeight).toBeGreaterThan(dom.clientHeight);
                                    }
                                }
                                else {
                                    expect(dom.scrollHeight).toBeLessThanOrEqual(dom.clientHeight);
                                }
                            }

                            if (horizontal !== undefined) {
                                if (horizontal) {
                                    if (Ext.isMac) {
                                        expect(dom.scrollWidth).toBeGreaterThanOrEqual(dom.clientWidth);
                                    }
                                    else {
                                        expect(dom.scrollWidth).toBeGreaterThan(dom.clientWidth);
                                    }
                                }
                                else {
                                    expect(dom.scrollWidth).toBeLessThanOrEqual(dom.clientWidth);
                                }
                            }
                        }

                        function expectColumnWidths(sizes, manager) {
                            manager = manager || gridRef.getVisibleColumnManager();
                            var columns = manager.getColumns(),
                                len = columns.length,
                                i;

                            for (i = 0; i < len; ++i) {
                                expect(columns[i].getWidth()).toBe(sizes[i]);
                            }

                        }

                        function makeRows(n) {
                            var data = [],
                                i;

                            for (i = 1; i <= n; ++i) {
                                data.push({
                                    field1: i + '.1',
                                    field2: i + '.2',
                                    field3: i + '.3',
                                    field4: i + '.4',
                                    field5: i + '.5',
                                    field6: i + '.6',
                                    field7: i + '.7',
                                    field8: i + '.8',
                                    field9: i + '.9',
                                    field10: i + '.10'

                                });
                            }

                            return data;
                        }

                        function makeRowDiv(times) {
                            return '<div style="height:' + (singleRowHeight * times) + 'px;">x</div>';
                        }

                        describe("basic initial rendering functionality", function() {
                            describe("fixed width columns", function() {
                                it("should not show scrollbars if neither dimensions overflows", function() {
                                    makeScrollGrid([{
                                        width: 100
                                    }, {
                                        width: 300
                                    }], 1);
                                    expectScroll(false, false);
                                    expectColumnWidths([100, 300]);
                                });

                                it("should show a vertical scrollbar if y overflows", function() {
                                    makeScrollGrid([{
                                        width: 100
                                    }, {
                                        width: 300
                                    }], scrollRowSize);
                                    expectScroll(true, false);
                                    expectColumnWidths([100, 300]);
                                });

                                it("should show a horizontal scrollbar if x overflows", function() {
                                    makeScrollGrid([{
                                        width: 600
                                    }, {
                                        width: 600
                                    }], 1);
                                    expectScroll(false, true);
                                    expectColumnWidths([600, 600]);
                                });

                                it("should show both scrollbars if x & y overflow", function() {
                                    makeScrollGrid([{
                                        width: 600
                                    }, {
                                        width: 600
                                    }], scrollRowSize);
                                    expectScroll(true, true);
                                    expectColumnWidths([600, 600]);
                                });

                                visibleScrollbarsIt("should show a vertical scrollbar if triggered by a horizontal scrollbar", function() {
                                    makeScrollGrid([{
                                        width: 600
                                    }, {
                                        width: 600
                                    }], maxRowsBeforeScroll);
                                    expectScroll(true, true);
                                    expectColumnWidths([600, 600]);
                                });

                                visibleScrollbarsIt("should show a horizontal scrollbar if triggered by a vertical scrollbar", function() {
                                    makeScrollGrid([{
                                        width: 499
                                    }, {
                                        width: 499
                                    }], scrollRowSize);
                                    expectScroll(true, true);
                                    expectColumnWidths([499, 499]);
                                });
                            });

                            describe("flexed columns", function() {
                                it("should not show scrollbars if neither dimension overflows", function() {
                                    makeScrollGrid([{
                                        flex: 1
                                    }, {
                                        flex: 1
                                    }], 1);
                                    expectScroll(false, false);
                                    expectColumnWidths([500, 500]);
                                });

                                it("should not show scrollbars if neither dimension overflows with hideHeaders: true and border: true", function() {
                                    makeScrollGrid([{
                                        flex: 1
                                    }, {
                                        flex: 1
                                    }], 1, {
                                        hideHeaders: true,
                                        border: true
                                    });
                                    expectScroll(false, false);

                                    // Even though headerCt is squeezed out of visibilty, it must have measurable left/right border widths
                                    expectColumnWidths([499, 499]);
                                });

                                it("should show a vertical scrollbar if y overflows", function() {
                                    makeScrollGrid([{
                                        flex: 1
                                    }, {
                                        flex: 1
                                    }], scrollRowSize);
                                    expectScroll(true, false);
                                    expectColumnWidths(scrollbarsTakeSpace ? [490, 490] : [500, 500]);
                                });

                                it("should show a vertical scrollbar if y overflows with hideHeaders: true and border: true", function() {
                                    makeScrollGrid([{
                                        flex: 1
                                    }, {
                                        flex: 1
                                    }], scrollRowSize, {
                                        hideHeaders: true,
                                        border: true
                                    });
                                    expectScroll(true, false);
                                    expectColumnWidths(scrollbarsTakeSpace ? [489, 489] : [499, 499]);
                                });

                                describe("min width constraint", function() {
                                    // This is essentially the same as combined width + flex, since hitting
                                    // a min width is essentially the same as setting a fixed size, but
                                    // may hit different parts of the code.
                                    
                                    it("should show a horizontal scrollbar if x overflows", function() {
                                        makeScrollGrid([{
                                            flex: 1,
                                            minWidth: 600
                                        }, {
                                            flex: 1,
                                            minWidth: 600
                                        }]);
                                        expectScroll(false, true);
                                        expectColumnWidths([600, 600]);
                                    });

                                    it("should show both scrollbars if x & y overflow", function() {
                                        makeScrollGrid([{
                                            flex: 1,
                                            minWidth: 600
                                        }, {
                                            flex: 1,
                                            minWidth: 600
                                        }], scrollRowSize);
                                        expectScroll(true, true);
                                        expectColumnWidths([600, 600]);
                                    });

                                    visibleScrollbarsIt("should show a vertical scrollbar if triggered by a horizontal scrollbar", function() {
                                        makeScrollGrid([{
                                            flex: 1,
                                            minWidth: 600
                                        }, {
                                            flex: 1,
                                            minWidth: 600
                                        }], maxRowsBeforeScroll);
                                        expectScroll(true, true);
                                        expectColumnWidths([600, 600]);
                                    });

                                    visibleScrollbarsIt("should show a horizontal scrollbar if triggered by a vertical scrollbar", function() {
                                        makeScrollGrid([{
                                            flex: 1,
                                            minWidth: 499
                                        }, {
                                            flex: 1,
                                            minWidth: 499
                                        }], scrollRowSize);
                                        expectScroll(true, true);
                                        expectColumnWidths([499, 499]);
                                    });
                                });
                            });

                            describe("fixed width + flexed columns", function() {
                                it("should not show scrollbars if neither dimensions overflows", function() {
                                    makeScrollGrid([{
                                        width: 100
                                    }, {
                                        flex: 1
                                    }], 1);
                                    expectScroll(false, false);
                                    expectColumnWidths([100, 900]);
                                });

                                it("should show a vertical scrollbar if y overflows", function() {
                                    makeScrollGrid([{
                                        width: 100
                                    }, {
                                        flex: 1
                                    }], scrollRowSize);
                                    expectScroll(true, false);
                                    expectColumnWidths(scrollbarsTakeSpace ? [100, 880] : [100, 900]);
                                });

                                it("should adjust the width of all flex columns if a scrollbar shows", function() {
                                    makeScrollGrid([{
                                        width: 200
                                    }, {
                                        flex: 1
                                    }, {
                                        flex: 1
                                    }, {
                                        flex: 1
                                    }], scrollRowSize);
                                    expectScroll(true, false);
                                    expectColumnWidths(scrollbarsTakeSpace ? [200, 260, 260, 260]: [200, 267, 267, 266]);
                                });
                            });
                        });

                        describe("resizing the grid", function() {
                            function changeHeight(numRows) {
                                grid.setHeight(grid.getHeight() + numRows * singleRowHeight);
                            }

                            function changeWidth(width) {
                                grid.setWidth(grid.getWidth() + width);
                            }

                            describe("fixed width columns", function() {
                                describe("vertically", function() {
                                    it("should not show a vertical scrollbar if resize does not cause overflow", function() {
                                        makeScrollGrid([{
                                            width: 100
                                        }, {
                                            width: 300
                                        }], 1);
                                        expectScroll(false, false);
                                        changeHeight(-10);
                                        expectScroll(false, false);
                                    });

                                    it("should retain a vertical scrollbar if resize does not cause underflow", function() {
                                        makeScrollGrid([{
                                            width: 100
                                        }, {
                                            width: 300
                                        }], scrollRowSize);
                                        expectScroll(true, false);
                                        changeHeight(-10);
                                        expectScroll(true, false);
                                    });

                                    it("should show a vertical scrollbar if y overflows", function() {
                                        makeScrollGrid([{
                                            width: 100
                                        }, {
                                            width: 300
                                        }], maxRowsBeforeScroll);
                                        expectScroll(false, false);
                                        changeHeight(-10);
                                        expectScroll(true, false);
                                    });

                                    it("should not show a vertical scrollbar if y underflows", function() {
                                        makeScrollGrid([{
                                            width: 100
                                        }, {
                                            width: 300
                                        }], maxRowsBeforeScroll + 5);
                                        expectScroll(true, false);
                                        changeHeight(10);
                                        expectScroll(false, false);
                                    });

                                    visibleScrollbarsIt("should show a horizontal scrollbar if triggered by a vertical scrollbar", function() {
                                        makeScrollGrid([{
                                            width: 495
                                        }, {
                                            width: 495
                                        }], maxRowsBeforeScroll);
                                        expectScroll(false, false);
                                        changeHeight(-1);
                                        expectScroll(true, true);
                                    });

                                    // // EXTJS-15789
                                    xit("should not show a horizontal scrollbar if triggered by a vertical scrollbar", function() {
                                        makeScrollGrid([{
                                            width: 495
                                        }, {
                                            width: 495
                                        }], maxRowsBeforeScroll);
                                        changeHeight(-1);
                                        expectScroll(true, true);
                                        changeHeight(1);
                                        expectScroll(false, false);
                                    });
                                });

                                describe("horizontally", function() {
                                    it("should not show a horizontal scrollbar if resize does not cause overflow", function() {
                                        makeScrollGrid([{
                                            width: 100
                                        }, {
                                            width: 300
                                        }], 1);
                                        expectScroll(false, false);
                                        changeWidth(200);
                                        expectScroll(false, false);
                                    });

                                    it("should retain a horizontal scrollbar if resize does not cause underflow", function() {
                                        makeScrollGrid([{
                                            width: 600
                                        }, {
                                            width: 600
                                        }], 1);
                                        expectScroll(false, true);
                                        changeWidth(-100);
                                        expectScroll(false, true);
                                    });

                                    it("should show a horizontal scrollbar if x overflows", function() {
                                        makeScrollGrid([{
                                            width: 400
                                        }, {
                                            width: 400
                                        }], 1);
                                        expectScroll(false, false);
                                        changeWidth(-400);
                                        expectScroll(false, true);
                                    });

                                    it("should not show a horizontal scrollbar if x underflows", function() {
                                        makeScrollGrid([{
                                            width: 600
                                        }, {
                                            width: 600
                                        }], 1);
                                        expectScroll(false, true);
                                        changeWidth(400);
                                        expectScroll(false, false);
                                    });

                                    visibleScrollbarsIt("should show a vertical scrollbar if triggered by a horizontal scrollbar", function() {
                                        makeScrollGrid([{
                                            width: 495
                                        }, {
                                            width: 495
                                        }], maxRowsBeforeScroll);
                                        expectScroll(false, false);
                                        changeWidth(-50);
                                        expectScroll(true, true);
                                    });

                                    visibleScrollbarsIt("should not show a vertical scrollbar if triggered by a horizontal scrollbar", function() {
                                        // C reate a grid with horizontal scrollbar which has no vertical scrollbar.
                                        makeScrollGrid([{
                                            width: 505
                                        }, {
                                            width: 505
                                        }], maxRowsBeforeScroll, {
                                            height: null
                                        });

                                        // Introduce the vertical scrollbar but only by 5px so that eliminating the vertical scrollbar
                                        // will eliminate the need for it.
                                        grid.setHeight(grid.getHeight() - 5);
                                        expectScroll(true, true);

                                        // Release the width constraint so that the horizontal scrollbar disappears.
                                        // contentHeight now fits
                                        changeWidth(50);
                                        view.el.setDisplayed(false);
                                        waits(1);

                                        // Allow the reflow before showing and then measuring.
                                        runs(function() {
                                            view.el.setDisplayed(true);
                                            expectScroll(false, false);
                                        });
                                    });
                                });
                            });

                            describe("flexed columns", function() {
                                describe("vertically", function() {
                                    it("should not show a vertical scrollbar if resize does not cause overflow", function() {
                                        makeScrollGrid([{
                                            flex: 1
                                        }, {
                                            flex: 1
                                        }], 1);
                                        expectScroll(false, false);
                                        expectColumnWidths([500, 500]);
                                        changeHeight(-10);
                                        expectScroll(false, false);
                                        expectColumnWidths([500, 500]);
                                    });

                                    it("should retain a vertical scrollbar if resize does not cause underflow", function() {
                                        makeScrollGrid([{
                                            flex: 1
                                        }, {
                                            flex: 1
                                        }], scrollRowSize);
                                        expectScroll(true, false);
                                        expectColumnWidths(scrollbarsTakeSpace ? [490, 490] : [500, 500]);
                                        changeHeight(-10);
                                        expectScroll(true, false);
                                        expectColumnWidths(scrollbarsTakeSpace ? [490, 490] : [500, 500]);
                                    });

                                    it("should show a vertical scrollbar if y overflows", function() {
                                        makeScrollGrid([{
                                            flex: 1
                                        }, {
                                            flex: 1
                                        }], maxRowsBeforeScroll);
                                        expectScroll(false, false);
                                        expectColumnWidths([500, 500]);
                                        changeHeight(-10);
                                        expectScroll(true, false);
                                        expectColumnWidths(scrollbarsTakeSpace ? [490, 490] : [500, 500]);
                                    });

                                    it("should not show a vertical scrollbar if y underflows", function() {
                                        makeScrollGrid([{
                                            flex: 1
                                        }, {
                                            flex: 1
                                        }], maxRowsBeforeScroll + 5);
                                        expectScroll(true, false);
                                        expectColumnWidths(scrollbarsTakeSpace ? [490, 490] : [500, 500]);
                                        changeHeight(10);
                                        expectScroll(false, false);
                                        expectColumnWidths([500, 500]);
                                    });
                                });
                                // Horizontally omitted
                            });

                            describe("fixed width + flexed columns", function() {
                                describe("vertically", function() {
                                    it("should not show a vertical scrollbar if resize does not cause overflow", function() {
                                        makeScrollGrid([{
                                            width: 300
                                        }, {
                                            flex: 1
                                        }], 1);
                                        expectScroll(false, false);
                                        expectColumnWidths([300, 700]);
                                        changeHeight(-10);
                                        expectScroll(false, false);
                                        expectColumnWidths([300, 700]);
                                    });

                                    it("should retain a vertical scrollbar if resize does not cause underflow", function() {
                                        makeScrollGrid([{
                                            width: 300
                                        }, {
                                            flex: 1
                                        }], scrollRowSize);
                                        expectScroll(true, false);
                                        expectColumnWidths(scrollbarsTakeSpace ? [300, 680] : [300, 700]);
                                        changeHeight(-10);
                                        expectScroll(true, false);
                                        expectColumnWidths(scrollbarsTakeSpace ? [300, 680] : [300, 700]);
                                    });

                                    it("should show a vertical scrollbar if y overflows", function() {
                                        makeScrollGrid([{
                                            width: 300
                                        }, {
                                            flex: 1
                                        }], maxRowsBeforeScroll);
                                        expectScroll(false, false);
                                        expectColumnWidths([300, 700]);
                                        changeHeight(-10);
                                        expectScroll(true, false);
                                        expectColumnWidths(scrollbarsTakeSpace ? [300, 680] : [300, 700]);
                                    });

                                    it("should not show a vertical scrollbar if y underflows", function() {
                                        makeScrollGrid([{
                                            width: 300
                                        }, {
                                            flex: 1
                                        }], maxRowsBeforeScroll + 5);
                                        expectScroll(true, false);
                                        expectColumnWidths(scrollbarsTakeSpace ? [300, 680] : [300, 700]);
                                        changeHeight(10);
                                        expectScroll(false, false);
                                        expectColumnWidths([300, 700]);
                                    });
                                });
                                // Horizontally omitted
                            });
                        });

                        describe("column operations", function() {
                            var minColWidth = Ext.grid.plugin.HeaderResizer.prototype.minColWidth;

                            describe("resizing", function() {
                                describe("fixed width columns", function() {
                                    it("should show a horizontal scrollbar if resizing causes overflow", function() {
                                        makeScrollGrid([{
                                            width: 100
                                        }, {
                                            width: 300
                                        }], 1);
                                        expectScroll(false, false);
                                        colRef[0].setWidth(800);
                                        expectScroll(false, true);
                                    });

                                    it("should not show a horizontal scrollbar if resizing causes underflow", function() {
                                        makeScrollGrid([{
                                            width: 600
                                        }, {
                                            width: 600
                                        }], 1);
                                        expectScroll(false, true);
                                        colRef[0].setWidth(300);
                                        expectScroll(false, false);
                                    });

                                    it("should show a vertical scrollbar if resizing causes overflow", function() {
                                        makeScrollGrid([{
                                            width: 600
                                        }, {
                                            width: 300
                                        }], maxRowsBeforeScroll);
                                        expectScroll(false, false);
                                        colRef[0].setWidth(800);
                                        expectScroll(scrollbarsTakeSpace, true);
                                    });

                                    it("should not show a vertical scrollbar if resizing causes underflow", function() {
                                        makeScrollGrid([{
                                            width: 600
                                        }, {
                                            width: 600
                                        }], maxRowsBeforeScroll);
                                        expectScroll(scrollbarsTakeSpace, true);
                                        colRef[0].setWidth(300);
                                        expectScroll(false, false);
                                    });
                                });

                                // Intentionally leaving out flex only

                                describe("fixed width + flexed columns", function() {
                                    it("should show a horizontal scrollbar if resizing causes overflow", function() {
                                        makeScrollGrid([{
                                            width: 300
                                        }, {
                                            flex: 1
                                        }], 1);
                                        expectScroll(false, false);
                                        expectColumnWidths([300, 700]);
                                        colRef[0].setWidth(1200);
                                        expectScroll(false, true);
                                        expectColumnWidths([1200, minColWidth]);
                                    });

                                    it("should not show a horizontal scrollbar if resizing causes underflow", function() {
                                        makeScrollGrid([{
                                            width: 600
                                        }, {
                                            width: 600
                                        }, {
                                            flex: 1
                                        }], 1);
                                        expectScroll(false, true);
                                        expectColumnWidths([600, 600, minColWidth]);
                                        colRef[0].setWidth(200);
                                        expectScroll(false, false);
                                        expectColumnWidths([200, 600, 200]);
                                    });

                                    it("should show a vertical scrollbar if resizing causes overflow", function() {
                                        makeScrollGrid([{
                                            width: 300
                                        }, {
                                            flex: 1
                                        }], maxRowsBeforeScroll);
                                        expectScroll(false, false);
                                        expectColumnWidths([300, 700]);
                                        colRef[0].setWidth(1200);
                                        expectScroll(scrollbarsTakeSpace, true);
                                        expectColumnWidths([1200, minColWidth]);
                                    });

                                    it("should not show a vertical scrollbar if resizing causes underflow", function() {
                                        makeScrollGrid([{
                                            width: 600
                                        }, {
                                            width: 600
                                        }, {
                                            flex: 1
                                        }], maxRowsBeforeScroll, {
                                            height: null
                                        });
                                        grid.setHeight(grid.getHeight() - 5);
                                        expectScroll(true, true);
                                        expectColumnWidths([600, 600, minColWidth]);
                                        colRef[0].setWidth(200);
                                        view.el.setDisplayed(false);
                                        waits(1);

                                        // Allow the reflow before showing and then measuring.
                                        runs(function() {
                                            view.el.setDisplayed(true);
                                            expectScroll(!scrollbarsTakeSpace, false);
                                            expectColumnWidths([200, 600, 200]);
                                        });
                                    });
                                });
                            });

                            describe("adding", function() {
                                function addCol(col) {
                                    gridRef.headerCt.add(col);
                                }
                                describe("fixed width columns", function() {
                                    it("should show a horizontal scrollbar if adding causes overflow", function() {
                                        makeScrollGrid([{
                                            width: 100
                                        }, {
                                            width: 300
                                        }], 1);
                                        expectScroll(false, false);
                                        addCol({
                                            width: 700
                                        });
                                        expectScroll(false, true);
                                    });

                                    it("should not show a horizontal scrollbar if adding does not cause overflow", function() {
                                        makeScrollGrid([{
                                            width: 100
                                        }, {
                                            width: 300
                                        }], 1);
                                        expectScroll(false, false);
                                        addCol({
                                            width: 300
                                        });
                                        expectScroll(false, false);
                                    });

                                    it("should show a vertical scrollbar if adding causes overflow", function() {
                                        makeScrollGrid([{
                                            width: 600
                                        }, {
                                            width: 300
                                        }], maxRowsBeforeScroll);
                                        expectScroll(false, false);
                                        addCol({
                                            width: 200
                                        });
                                        expectScroll(scrollbarsTakeSpace, true);
                                    });

                                    describe("with variableRowHeight", function() {
                                        visibleScrollbarsIt("should show a vertical scrollbar if adding causes overflow", function() {
                                            var data = makeRows(maxRowsBeforeScroll);
                                            data[0].field3 = makeRowDiv(2);
                                            makeScrollGrid([{
                                                width: 100
                                            }, {
                                                width: 300
                                            }], data);
                                            expectScroll(false, false);
                                            addCol({
                                                width: 200,
                                                variableRowHeight: true,
                                                dataIndex: 'field3'
                                            });
                                            expectScroll(true, false);
                                        });

                                        visibleScrollbarsIt("should show a horizontal scrollbar if adding triggered a vertical scrollbar", function() {
                                            var data = makeRows(maxRowsBeforeScroll);
                                            data[0].field3 = makeRowDiv(2);
                                            makeScrollGrid([{
                                                width: 330
                                            }, {
                                                width: 330
                                            }], data);
                                            expectScroll(false, false);
                                            addCol({
                                                width: 330,
                                                variableRowHeight: true,
                                                dataIndex: 'field3'
                                            });
                                            expectScroll(true, true);
                                        });
                                    });
                                });

                                // Intentionally leaving out flex only
                                
                                describe("fixed width + flexed columns", function() {
                                    it("should show a horizontal scrollbar if adding causes overflow", function() {
                                        makeScrollGrid([{
                                            width: 300
                                        }, {
                                            flex: 1
                                        }], 1);
                                        expectScroll(false, false);
                                        expectColumnWidths([300, 700]);
                                        addCol({
                                            width: 800
                                        });
                                        expectScroll(false, true);
                                        expectColumnWidths([300, minColWidth, 800]);
                                    });

                                    it("should not show a horizontal scrollbar if adding does not cause overflow", function() {
                                        makeScrollGrid([{
                                            width: 300
                                        }, {
                                            flex: 1
                                        }], 1);
                                        expectScroll(false, false);
                                        expectColumnWidths([300, 700]);
                                        addCol({
                                            width: 300
                                        });
                                        expectScroll(false, false);
                                        expectColumnWidths([300, 400, 300]);
                                    });

                                    it("should show a vertical scrollbar if adding causes overflow", function() {
                                        makeScrollGrid([{
                                            width: 300
                                        }, {
                                            flex: 1
                                        }], maxRowsBeforeScroll);
                                        expectScroll(false, false);
                                        expectColumnWidths([300, 700]);
                                        addCol({
                                            width: 800
                                        });
                                        expectScroll(scrollbarsTakeSpace, true);
                                        expectColumnWidths([300, minColWidth, 800]);
                                    });

                                    describe("with variableRowHeight", function() {
                                        it("should show a vertical scrollbar if adding causes overflow", function() {
                                            var data = makeRows(maxRowsBeforeScroll);
                                            data[0].field3 = makeRowDiv(2);
                                            makeScrollGrid([{
                                                width: 300
                                            }, {
                                                flex: 1
                                            }], data);
                                            expectScroll(false, false);
                                            expectColumnWidths([300, 700]);
                                            addCol({
                                                width: 200,
                                                variableRowHeight: true,
                                                dataIndex: 'field3'
                                            });
                                            expectScroll(true, false);
                                            expectColumnWidths([300, scrollbarsTakeSpace ? 480 : 500, 200]);
                                        });
                                    });
                                });
                            });

                            describe("showing", function() {
                                describe("fixed width columns", function() {
                                    it("should show a horizontal scrollbar if adding causes overflow", function() {
                                        makeScrollGrid([{
                                            width: 100
                                        }, {
                                            width: 700,
                                            hidden: true
                                        }, {
                                            width: 300
                                        }], 1);
                                        expectScroll(false, false);
                                        colRef[1].show();
                                        expectScroll(false, true);
                                    });

                                    it("should not show a horizontal scrollbar if adding does not cause overflow", function() {
                                        makeScrollGrid([{
                                            width: 100
                                        }, {
                                            width: 300,
                                            hidden: true
                                        }, {
                                            width: 300
                                        }], 1);
                                        expectScroll(false, false);
                                        colRef[1].show();
                                        expectScroll(false, false);
                                    });

                                    it("should show a vertical scrollbar if adding causes overflow", function() {
                                        makeScrollGrid([{
                                            width: 600
                                        }, {
                                            width: 200,
                                            hidden: true
                                        }, {
                                            width: 300
                                        }], maxRowsBeforeScroll);
                                        expectScroll(false, false);
                                        colRef[1].show();
                                        expectScroll(scrollbarsTakeSpace, true);
                                    });

                                    describe("with variableRowHeight", function() {
                                        visibleScrollbarsIt("should show a vertical scrollbar if showing causes overflow", function() {
                                            var data = makeRows(maxRowsBeforeScroll);
                                            data[0].field3 = makeRowDiv(2);
                                            makeScrollGrid([{
                                                width: 100
                                            }, {
                                                width: 300
                                            }, {
                                                width: 200,
                                                variableRowHeight: true,
                                                hidden: true
                                            }], data);
                                            expectScroll(false, false);
                                            colRef[2].show();
                                            expectScroll(true, false);
                                        });

                                        visibleScrollbarsIt("should show a horizontal scrollbar if showing triggered a vertical scrollbar", function() {
                                            var data = makeRows(maxRowsBeforeScroll);
                                            data[0].field3 = makeRowDiv(2);
                                            makeScrollGrid([{
                                                width: 330
                                            }, {
                                                width: 330
                                            }, {
                                                width: 330,
                                                variableRowHeight: true,
                                                hidden: true
                                            }], data);
                                            expectScroll(false, false);
                                            colRef[2].show();
                                            expectScroll(true, true);
                                        });
                                    });
                                });

                                // Intentionally leaving out flex only
                                
                                describe("fixed width + flexed columns", function() {
                                    it("should show a horizontal scrollbar if adding causes overflow", function() {
                                        makeScrollGrid([{
                                            width: 300
                                        }, {
                                            width: 800,
                                            hidden: true
                                        }, {
                                            flex: 1
                                        }], 1);
                                        expectScroll(false, false);
                                        expectColumnWidths([300, 700]);
                                        colRef[1].show();
                                        expectScroll(false, true);
                                        expectColumnWidths([300, 800, minColWidth]);
                                    });

                                    it("should not show a horizontal scrollbar if adding does not cause overflow", function() {
                                        makeScrollGrid([{
                                            width: 300
                                        }, {
                                            width: 300,
                                            hidden: true
                                        }, {
                                            flex: 1
                                        }], 1);
                                        expectScroll(false, false);
                                        expectColumnWidths([300, 700]);
                                        colRef[1].show();
                                        expectScroll(false, false);
                                        expectColumnWidths([300, 300, 400]);
                                    });

                                    it("should show a vertical scrollbar if adding causes overflow", function() {
                                        makeScrollGrid([{
                                            width: 300
                                        }, {
                                            width: 800,
                                            hidden: true
                                        }, {
                                            flex: 1
                                        }], maxRowsBeforeScroll);
                                        expectScroll(false, false);
                                        expectColumnWidths([300, 700]);
                                        colRef[1].show();
                                        expectScroll(scrollbarsTakeSpace, true);
                                        expectColumnWidths([300, 800, minColWidth]);
                                    });

                                    describe("with variableRowHeight", function() {
                                        it("should show a vertical scrollbar if showing causes overflow", function() {
                                            var data = makeRows(maxRowsBeforeScroll);
                                            data[0].field3 = makeRowDiv(2);
                                            makeScrollGrid([{
                                                width: 300
                                            }, {
                                                flex: 1
                                            }, {
                                                width: 200,
                                                variableRowHeight: true,
                                                hidden: true
                                            }], data);
                                            expectScroll(false, false);
                                            expectColumnWidths([300, 700]);
                                            colRef[2].show();
                                            expectScroll(true, false);
                                            expectColumnWidths([300, scrollbarsTakeSpace ? 480 : 500, 200]);
                                        });
                                    });
                                });
                            });

                            describe("removing", function() {
                                describe("fixed width columns", function() {
                                    it("should not show a horizontal scrollbar if removing causes underflow", function() {
                                        makeScrollGrid([{
                                            width: 100
                                        }, {
                                            width: 300
                                        }, {
                                            width: 700
                                        }], 1);
                                        expectScroll(false, true);
                                        colRef[2].destroy();
                                        expectScroll(false, false);
                                    });

                                    it("should retain a horizontal scrollbar if removing does not cause underflow", function() {
                                        makeScrollGrid([{
                                            width: 600
                                        }, {
                                            width: 600
                                        }, {
                                            width: 600
                                        }], 1);
                                        expectScroll(false, true);
                                        colRef[2].destroy();
                                        expectScroll(false, true);
                                    });

                                    it("should not show a vertical scrollbar if removing causes underflow", function() {
                                        makeScrollGrid([{
                                            width: 600
                                        }, {
                                            width: 300
                                        }, {
                                            width: 200
                                        }], maxRowsBeforeScroll);
                                        expectScroll(scrollbarsTakeSpace, true);
                                        colRef[2].destroy();
                                        expectScroll(false, false);
                                    });

                                    describe("with variableRowHeight", function() {
                                        it("should not show a vertical scrollbar if removing causes underflow", function() {
                                            var data = makeRows(maxRowsBeforeScroll);
                                            data[0].field3 = makeRowDiv(2);
                                            makeScrollGrid([{
                                                width: 100
                                            }, {
                                                width: 300
                                            }, {
                                                width: 200,
                                                variableRowHeight: true
                                            }], data);
                                            expectScroll(true, false);
                                            colRef[2].destroy();
                                            expectScroll(false, false);
                                        });

                                        visibleScrollbarsIt("should not show a horizontal scrollbar if removing triggered a vertical scrollbar removal", function() {
                                            var data = makeRows(maxRowsBeforeScroll);
                                            data[0].field3 = makeRowDiv(2);
                                            makeScrollGrid([{
                                                width: 330
                                            }, {
                                                width: 330
                                            }, {
                                                width: 330,
                                                variableRowHeight: true
                                            }], data);
                                            expectScroll(true, true);
                                            colRef[2].destroy();
                                            expectScroll(false, false);
                                        });
                                    });
                                });

                                // Intentionally leaving out flex only
                                
                                describe("fixed width + flexed columns", function() {
                                    it("should not show a horizontal scrollbar if removing causes underflow", function() {
                                        makeScrollGrid([{
                                            width: 300
                                        }, {
                                            flex: 1
                                        }, {
                                            width: 800
                                        }], 1);
                                        expectScroll(false, true);
                                        expectColumnWidths([300, minColWidth, 800]);
                                        colRef[2].destroy();
                                        expectScroll(false, false);
                                        expectColumnWidths([300, 700]);
                                    });

                                    it("should show a horizontal scrollbar if removing does not cause underflow", function() {
                                        makeScrollGrid([{
                                            width: 600
                                        }, {
                                            width: 600
                                        }, {
                                            flex: 1
                                        }, {
                                            width: 600
                                        }], 1);
                                        expectScroll(false, true);
                                        expectColumnWidths([600, 600, minColWidth, 600]);
                                        colRef[3].destroy();
                                        expectScroll(false, true);
                                        expectColumnWidths([600, 600, minColWidth]);
                                    });

                                    it("should not show a vertical scrollbar if removing causes underflow", function() {
                                        makeScrollGrid([{
                                            width: 300
                                        }, {
                                            flex: 1
                                        }, {
                                            width: 800
                                        }], maxRowsBeforeScroll);
                                        expectScroll(scrollbarsTakeSpace, true);
                                        expectColumnWidths([300, minColWidth, 800]);
                                        colRef[2].destroy();
                                        view.el.setDisplayed(false);
                                        waits(1);

                                        // Allow the reflow before showing and then measuring.
                                        runs(function() {
                                            view.el.setDisplayed(true);
                                            expectScroll(false, false);
                                            expectColumnWidths([300, 700]);
                                        });
                                    });

                                    describe("with variableRowHeight", function() {
                                        it("should not show a vertical scrollbar if removing causes underflow", function() {
                                            var data = makeRows(maxRowsBeforeScroll);
                                            data[0].field3 = makeRowDiv(2);
                                            makeScrollGrid([{
                                                width: 300
                                            }, {
                                                flex: 1
                                            }, {
                                                width: 200,
                                                variableRowHeight: true
                                            }], data);
                                            expectScroll(true, false);
                                            expectColumnWidths([300, scrollbarsTakeSpace ? 480 : 500, 200]);
                                            colRef[2].destroy();
                                            expectScroll(false, false);
                                            expectColumnWidths([300, 700]);
                                        });
                                    });
                                });
                            });

                            describe("hiding", function() {
                                describe("fixed width columns", function() {
                                    it("should not show a horizontal scrollbar if hiding causes underflow", function() {
                                        makeScrollGrid([{
                                            width: 100
                                        }, {
                                            width: 300
                                        }, {
                                            width: 700
                                        }], 1);
                                        expectScroll(false, true);
                                        colRef[2].hide();
                                        expectScroll(false, false);
                                    });

                                    it("should retain a horizontal scrollbar if hiding does not cause underflow", function() {
                                        makeScrollGrid([{
                                            width: 600
                                        }, {
                                            width: 600
                                        }, {
                                            width: 600
                                        }], 1);
                                        expectScroll(false, true);
                                        colRef[2].hide();
                                        expectScroll(false, true);
                                    });

                                    it("should not show a vertical scrollbar if hiding causes underflow", function() {
                                        makeScrollGrid([{
                                            width: 600
                                        }, {
                                            width: 300
                                        }, {
                                            width: 200
                                        }], maxRowsBeforeScroll);
                                        expectScroll(scrollbarsTakeSpace, true);
                                        colRef[2].hide();
                                        view.el.setDisplayed(false);
                                        waits(1);

                                        // Allow the reflow before showing and then measuring.
                                        runs(function() {
                                            view.el.setDisplayed(true);
                                            expectScroll(false, false);
                                        });
                                    });

                                    describe("with variableRowHeight", function() {
                                        it("should not show a vertical scrollbar if hiding causes underflow", function() {
                                            var data = makeRows(maxRowsBeforeScroll);
                                            data[0].field3 = makeRowDiv(2);
                                            makeScrollGrid([{
                                                width: 100
                                            }, {
                                                width: 300
                                            }, {
                                                width: 200,
                                                variableRowHeight: true
                                            }], data);
                                            expectScroll(true, false);
                                            colRef[2].hide();
                                            view.el.setDisplayed(false);
                                            waits(1);

                                            // Allow the reflow before showing and then measuring.
                                            runs(function() {
                                                view.el.setDisplayed(true);
                                                expectScroll(false, false);
                                            });
                                        });

                                        visibleScrollbarsIt("should not show a horizontal scrollbar if hiding triggered a vertical scrollbar removal", function() {
                                            var data = makeRows(maxRowsBeforeScroll);
                                            data[0].field3 = makeRowDiv(2);
                                            makeScrollGrid([{
                                                width: 330
                                            }, {
                                                width: 330
                                            }, {
                                                width: 330,
                                                variableRowHeight: true
                                            }], data);
                                            expectScroll(true, true);
                                            colRef[2].hide();
                                            expectScroll(false, false);
                                        });
                                    });
                                });

                                // Intentionally leaving out flex only
                                
                                describe("fixed width + flexed columns", function() {
                                    it("should not show a horizontal scrollbar if hiding causes underflow", function() {
                                        makeScrollGrid([{
                                            width: 300
                                        }, {
                                            flex: 1
                                        }, {
                                            width: 800
                                        }], 1);
                                        expectScroll(false, true);
                                        expectColumnWidths([300, minColWidth, 800]);
                                        colRef[2].hide();
                                        expectScroll(false, false);
                                        expectColumnWidths([300, 700]);
                                    });

                                    it("should show a horizontal scrollbar if hiding does not cause underflow", function() {
                                        makeScrollGrid([{
                                            width: 600
                                        }, {
                                            width: 600
                                        }, {
                                            flex: 1
                                        }, {
                                            width: 600
                                        }], 1);
                                        expectScroll(false, true);
                                        expectColumnWidths([600, 600, minColWidth, 600]);
                                        colRef[3].hide();
                                        expectScroll(false, true);
                                        expectColumnWidths([600, 600, minColWidth]);
                                    });

                                    it("should not show a vertical scrollbar if hiding causes underflow", function() {
                                        makeScrollGrid([{
                                            width: 300
                                        }, {
                                            flex: 1
                                        }, {
                                            width: 800
                                        }], maxRowsBeforeScroll);
                                        expectScroll(scrollbarsTakeSpace, true);
                                        expectColumnWidths([300, minColWidth, 800]);
                                        colRef[2].hide();
                                        view.el.setDisplayed(false);
                                        waits(1);

                                        // Allow the reflow before showing and then measuring.
                                        runs(function() {
                                            view.el.setDisplayed(true);
                                            expectScroll(false, false);
                                            expectColumnWidths([300, 700]);
                                        });
                                    });

                                    describe("with variableRowHeight", function() {
                                        it("should not show a vertical scrollbar if hiding causes underflow", function() {
                                            var data = makeRows(maxRowsBeforeScroll);
                                            data[0].field3 = makeRowDiv(2);
                                            makeScrollGrid([{
                                                width: 300
                                            }, {
                                                flex: 1
                                            }, {
                                                width: 200,
                                                variableRowHeight: true
                                            }], data);
                                            expectScroll(true, false);
                                            expectColumnWidths([300, scrollbarsTakeSpace ? 480 : 500, 200]);
                                            colRef[2].hide();
                                            view.el.setDisplayed(false);
                                            waits(1);

                                            // Allow the reflow before showing and then measuring.
                                            runs(function() {
                                                view.el.setDisplayed(true);
                                                expectScroll(false, false);
                                                expectColumnWidths([300, 700]);
                                            });
                                        });
                                    });
                                });
                            });
                        });

                        describe("store operations", function() {
                            describe("adding records", function() {
                                describe("fixed width columns", function() {
                                    it("should not show a vertical scrollbar if adding does not cause overflow", function() {
                                        makeScrollGrid([{
                                            width: 100
                                        }, {
                                            width: 300
                                        }], 1);
                                        expectScroll(false, false);
                                        store.add({});
                                        expectScroll(false, false);
                                    });

                                    it("should retain a vertical scrollbar if overflow exists", function() {
                                        makeScrollGrid([{
                                            width: 100
                                        }, {
                                            width: 300
                                        }], scrollRowSize);
                                        expectScroll(true, false);
                                        store.add({});
                                        expectScroll(true, false);
                                    });

                                    it("should show a vertical scrollbar if adding causes an overflow", function() {
                                        makeScrollGrid([{
                                            width: 100
                                        }, {
                                            width: 300
                                        }], maxRowsBeforeScroll);
                                        expectScroll(false, false);
                                        store.add({});
                                        expectScroll(true, false);
                                    });

                                    visibleScrollbarsIt("should show a vertical scrollbar if triggered by a horizontal scrollbar", function() {
                                        makeScrollGrid([{
                                            width: 600
                                        }, {
                                            width: 600
                                        }], maxRowsBeforeScrollWithHorizontalScrollBar, {
                                            height: null
                                        });
                                        // Make the grid just height enough so that there's a horizontal scrollbar, but no vertical
                                        grid.setHeight(grid.getHeight() + 5);
                                        expectScroll(false, true);
                                        store.add({});
                                        expectScroll(true, true);
                                    });

                                    visibleScrollbarsIt("should show a horizontal scrollbar if triggered by a vertical scrollbar", function() {
                                        makeScrollGrid([{
                                            width: 495
                                        }, {
                                            width: 495
                                        }], maxRowsBeforeScroll);
                                        expectScroll(false, false);
                                        store.add({});
                                        expectScroll(true, true);
                                    });
                                });

                                describe("flexed columns", function() {
                                    it("should not show a vertical scrollbar if adding does not cause overflow", function() {
                                        makeScrollGrid([{
                                            flex: 1
                                        }, {
                                            flex: 1
                                        }], 1);
                                        expectScroll(false, false);
                                        expectColumnWidths([500, 500]);
                                        store.add({});
                                        expectScroll(false, false);
                                        expectColumnWidths([500, 500]);
                                    });

                                    it("should retain a vertical scrollbar if overflow exists", function() {
                                        makeScrollGrid([{
                                            flex: 1
                                        }, {
                                            flex: 1
                                        }], scrollRowSize);
                                        expectScroll(true, false);
                                        expectColumnWidths(scrollbarsTakeSpace ? [490, 490] : [500, 500]);
                                        store.add({});
                                        expectScroll(true, false);
                                        expectColumnWidths(scrollbarsTakeSpace ? [490, 490] : [500, 500]);
                                    });

                                    it("should show a vertical scrollbar if adding causes an overflow", function() {
                                        makeScrollGrid([{
                                            flex: 1
                                        }, {
                                            flex: 1
                                        }], maxRowsBeforeScroll);
                                        expectScroll(false, false);
                                        expectColumnWidths([500, 500]);
                                        store.add({});
                                        expectScroll(true, false);
                                        expectColumnWidths(scrollbarsTakeSpace ? [490, 490] : [500, 500]);
                                    });
                                });

                                describe("fixed width + flexed columns", function() {
                                    it("should not show a vertical scrollbar if adding does not cause overflow", function() {
                                        makeScrollGrid([{
                                            width: 300
                                        }, {
                                            flex: 1
                                        }], 1);
                                        expectScroll(false, false);
                                        expectColumnWidths([300, 700]);
                                        store.add({});
                                        expectScroll(false, false);
                                        expectColumnWidths([300, 700]);
                                    });

                                    it("should retain a vertical scrollbar if overflow exists", function() {
                                        makeScrollGrid([{
                                            width: 300
                                        }, {
                                            flex: 1
                                        }], scrollRowSize);
                                        expectScroll(true, false);
                                        expectColumnWidths(scrollbarsTakeSpace ? [300, 680] : [300, 700]);
                                        store.add({});
                                        expectScroll(true, false);
                                        expectColumnWidths(scrollbarsTakeSpace ? [300, 680] : [300, 700]);
                                    });

                                    it("should show a vertical scrollbar if adding causes an overflow", function() {
                                        makeScrollGrid([{
                                            width: 300
                                        }, {
                                            flex: 1
                                        }], maxRowsBeforeScroll);
                                        expectScroll(false, false);
                                        expectColumnWidths([300, 700]);
                                        store.add({});
                                        expectScroll(true, false);
                                        expectColumnWidths(scrollbarsTakeSpace ? [300, 680] : [300, 700]);
                                    });
                                });
                            });

                            describe("removing records", function() {
                                describe("fixed width columns", function() {
                                    it("should not show a vertical scrollbar if there is no overflow", function() {
                                        makeScrollGrid([{
                                            width: 100
                                        }, {
                                            width: 300
                                        }], 2);
                                        expectScroll(false, false);
                                        store.removeAt(0);
                                        expectScroll(false, false);
                                    });

                                    it("should retain a vertical scrollbar if overflow exists", function() {
                                        makeScrollGrid([{
                                            width: 100
                                        }, {
                                            width: 300
                                        }], scrollRowSize);
                                        expectScroll(true, false);
                                        store.removeAt(0);
                                        expectScroll(true, false);
                                    });

                                    it("should not show a vertical scrollbar if removing causes underflow", function() {
                                        makeScrollGrid([{
                                            width: 100
                                        }, {
                                            width: 300
                                        }], maxRowsBeforeScroll + 1);
                                        expectScroll(true, false);
                                        store.removeAt(0);
                                        expectScroll(false, false);
                                    });

                                    visibleScrollbarsIt("should not show a vertical scrollbar if triggered by a horizontal scrollbar", function() {
                                        makeScrollGrid([{
                                            width: 600
                                        }, {
                                            width: 600
                                        }], maxRowsBeforeScrollWithHorizontalScrollBar + 1, {
                                            height: null
                                        });
                                        grid.setHeight(grid.getHeight() - 5);
                                        expectScroll(true, true);
                                        store.removeAt(0);
                                        view.el.setDisplayed(false);
                                        waits(1);

                                        // Allow the reflow before showing and then measuring.
                                        runs(function() {
                                            view.el.setDisplayed(true);
                                            expectScroll(false, true);
                                        });
                                    });

                                    // EXTJS-1578
                                    xit("should not show a horizontal scrollbar if triggered by a vertical scrollbar", function() {
                                        makeScrollGrid([{
                                            width: 495
                                        }, {
                                            width: 495
                                        }], maxRowsBeforeScroll + 1);
                                        expectScroll(true, true);
                                        store.removeAt(0);
                                        expectScroll(false, false);
                                    });
                                });

                                describe("flexed columns", function() {
                                    it("should not show a vertical scrollbar if there is no overflow", function() {
                                        makeScrollGrid([{
                                            flex: 1
                                        }, {
                                            flex: 1
                                        }], 2);
                                        expectScroll(false, false);
                                        expectColumnWidths([500, 500]);
                                        store.removeAt(0);
                                        expectScroll(false, false);
                                        expectColumnWidths([500, 500]);
                                    });

                                    it("should retain a vertical scrollbar if overflow exists", function() {
                                        makeScrollGrid([{
                                            flex: 1
                                        }, {
                                            flex: 1
                                        }], scrollRowSize);
                                        expectScroll(true, false);
                                        expectColumnWidths(scrollbarsTakeSpace ? [490, 490] : [500, 500]);
                                        store.removeAt(0);
                                        expectScroll(true, false);
                                        expectColumnWidths(scrollbarsTakeSpace ? [490, 490] : [500, 500]);
                                    });

                                    it("should not show a vertical scrollbar if removing causes underflow", function() {
                                        makeScrollGrid([{
                                            flex: 1
                                        }, {
                                            flex: 1
                                        }], maxRowsBeforeScroll + 1, {
                                            height: null
                                        });
                                        // Make the grid just height enough so that there is a vertical scrollbar
                                        grid.setHeight(grid.getHeight() - 5);
                                        expectScroll(true, false);
                                        expectColumnWidths(scrollbarsTakeSpace ? [490, 490] : [500, 500]);
                                        store.removeAt(0);

                                        // Layout resulting from remove which recalculates column widths runs on idle, so allow that to happen
                                        waits(1);
                                        runs(function() {
                                            expectScroll(false, false);
                                            expectColumnWidths([500, 500]);
                                        });
                                    });
                                });

                                describe("fixed width + flexed columns", function() {
                                    it("should not show a vertical scrollbar if there is no overflow", function() {
                                        makeScrollGrid([{
                                            width: 400
                                        }, {
                                            flex: 1
                                        }], 2);
                                        expectScroll(false, false);
                                        expectColumnWidths([400, 600]);
                                        store.removeAt(0);
                                        expectScroll(false, false);
                                        expectColumnWidths([400, 600]);
                                    });

                                    it("should retain a vertical scrollbar if overflow exists", function() {
                                        makeScrollGrid([{
                                            width: 400
                                        }, {
                                            flex: 1
                                        }], scrollRowSize);
                                        expectScroll(true, false);
                                        expectColumnWidths(scrollbarsTakeSpace ? [400, 580] : [400, 600]);
                                        store.removeAt(0);
                                        expectScroll(true, false);
                                        expectColumnWidths(scrollbarsTakeSpace ? [400, 580] : [400, 600]);
                                    });

                                    it("should not show a vertical scrollbar if removing causes underflow", function() {
                                        makeScrollGrid([{
                                            width: 300
                                        }, {
                                            flex: 1
                                        }], maxRowsBeforeScroll + 1, {
                                            height: null
                                        });
                                        // Make the grid just height enough so that there is a vertical scrollbar
                                        grid.setHeight(grid.getHeight() - 5);
                                        expectScroll(true, false);
                                        expectColumnWidths(scrollbarsTakeSpace ? [300, 680] : [300, 700]);
                                        store.removeAt(0);
                                        expectScroll(false, false);
                                        expectColumnWidths([300, 700]);
                                    });
                                });
                            });

                            describe("updating records with variableRowHeight", function() {
                                describe("fixed width columns", function() {
                                    it("should not show a vertical scrollbar if there is no overflow", function() {
                                        makeScrollGrid([{
                                            width: 100,
                                            variableRowHeight: true
                                        }, {
                                            width: 300
                                        }], 1);
                                        expectScroll(false, false);
                                        store.first().set('field1', makeRowDiv(2));
                                        expectScroll(false, false);
                                    });

                                    it("should retain a vertical scrollbar if overflow exists", function() {
                                        makeScrollGrid([{
                                            width: 100,
                                            variableRowHeight: true
                                        }, {
                                            width: 300
                                        }], scrollRowSize);
                                        expectScroll(true, false);
                                        store.first().set('field1', makeRowDiv(2));
                                        expectScroll(true, false);
                                    });

                                    describe("making content larger", function() {
                                        it("should show a vertical scrollbar if the update causes an overflow", function() {
                                            makeScrollGrid([{
                                                width: 100,
                                                variableRowHeight: true
                                            }, {
                                                width: 300
                                            }], maxRowsBeforeScroll);
                                            expectScroll(false, false);
                                            store.first().set('field1', makeRowDiv(2));
                                            expectScroll(true, false);
                                        });

                                        visibleScrollbarsIt("should show a vertical scrollbar if triggered by a horizontal scrollbar", function() {
                                            makeScrollGrid([{
                                                width: 600,
                                                variableRowHeight: true
                                            }, {
                                                width: 600
                                            }], maxRowsBeforeScrollWithHorizontalScrollBar, {
                                                height: null
                                            });
                                            // Make the grid just height enough so that there's a horizontal scrollbar, but no vertical
                                            grid.setHeight(grid.getHeight() + 5);
                                            expectScroll(false, true);
                                            store.first().set('field1', makeRowDiv(2));
                                            expectScroll(true, true);
                                        });

                                        visibleScrollbarsIt("should show a horizontal scrollbar if triggered by a vertical scrollbar", function() {
                                            makeScrollGrid([{
                                                width: 495
                                            }, {
                                                width: 495
                                            }], maxRowsBeforeScroll);
                                            expectScroll(false, false);
                                            store.first().set('field1', makeRowDiv(2));
                                            expectScroll(true, true);
                                        });
                                    });

                                    describe("making content smaller", function() {
                                        it("should not show a vertical scrollbar if the update causes an underflow", function() {
                                            var data = makeRows(maxRowsBeforeScroll);
                                            data[0].field1 = makeRowDiv(3);
                                            makeScrollGrid([{
                                                width: 100,
                                                variableRowHeight: true
                                            }, {
                                                width: 300
                                            }], data);
                                            expectScroll(true, false);
                                            store.first().set('field1', '1.1');
                                            expectScroll(false, false);
                                        });

                                        visibleScrollbarsIt("should not show a vertical scrollbar if triggered by a horizontal scrollbar", function() {
                                            makeScrollGrid([{
                                                width: 600,
                                                variableRowHeight: true
                                            }, {
                                                width: 600
                                            }], maxRowsBeforeScroll, {
                                                height: null
                                            });
                                            grid.setHeight(grid.getHeight());
                                            expectScroll(false, true);
                                            store.first().set('field1', makeRowDiv(3));
                                            expectScroll(true, true);
                                            store.first().set('field1', '1.1');
                                            expectScroll(false, true);
                                        });

                                        visibleScrollbarsIt("should not show a horizontal scrollbar if triggered by a vertical scrollbar", function() {
                                            var data = makeRows(maxRowsBeforeScrollWithHorizontalScrollBar);
                                            data[0].field1 = makeRowDiv(3);
                                            makeScrollGrid([{
                                                width: 495
                                            }, {
                                                width: 495
                                            }], maxRowsBeforeScroll, {
                                                height: null
                                            });
                                            grid.setHeight(grid.getHeight() + 5);
                                            store.first().set('field1', makeRowDiv(3));
                                            expectScroll(true, true);
                                            store.first().set('field1', '1.1');
                                            view.el.setDisplayed(false);
                                            waits(1);

                                            // Allow the reflow before showing and then measuring.
                                            runs(function() {
                                                view.el.setDisplayed(true);
                                                expectScroll(false, false);
                                            });
                                        });
                                    });
                                });

                                describe("flexed columns", function() {
                                    it("should not show a vertical scrollbar if there is no overflow", function() {
                                        makeScrollGrid([{
                                            flex: 1,
                                            variableRowHeight: true
                                        }, {
                                            flex: 1
                                        }], 1);
                                        expectScroll(false, false);
                                        expectColumnWidths([500, 500]);
                                        store.first().set('field1', makeRowDiv(2));
                                        expectScroll(false, false);
                                    });

                                    it("should retain a vertical scrollbar if overflow exists", function() {
                                        makeScrollGrid([{
                                            flex: 1,
                                            variableRowHeight: true
                                        }, {
                                            flex: 1
                                        }], scrollRowSize);
                                        expectScroll(true, false);
                                        expectColumnWidths(scrollbarsTakeSpace ? [490, 490] : [500, 500]);
                                        store.first().set('field1', makeRowDiv(2));
                                        expectScroll(true, false);
                                        expectColumnWidths(scrollbarsTakeSpace ? [490, 490] : [500, 500]);
                                    });

                                    it("should show a vertical scrollbar if the update causes an overflow", function() {
                                        makeScrollGrid([{
                                            flex: 1,
                                            variableRowHeight: true
                                        }, {
                                            flex: 1
                                        }], maxRowsBeforeScroll, {
                                            height: null
                                        });
                                        grid.setHeight(grid.getHeight() + 5);
                                        expectScroll(false, false);
                                        expectColumnWidths([500, 500]);
                                        store.first().set('field1', makeRowDiv(2));
                                        expectScroll(true, false);
                                        expectColumnWidths(scrollbarsTakeSpace ? [490, 490] : [500, 500]);
                                    });

                                    it("should not show a vertical scrollbar if the update causes an underflow", function() {
                                        makeScrollGrid([{
                                            flex: 1,
                                            variableRowHeight: true
                                        }, {
                                            flex: 1
                                        }], maxRowsBeforeScroll, {
                                            height: null
                                        });
                                        grid.setHeight(grid.getHeight() + 5);
                                        store.first().set('field1', makeRowDiv(2));
                                        expectScroll(true, false);
                                        expectColumnWidths(scrollbarsTakeSpace ? [490, 490] : [500, 500]);
                                        store.first().set('field1', '1.1');
                                        expectScroll(false, false);
                                        expectColumnWidths([500, 500]);
                                    });
                                });

                                describe("fixed width + flexed columns", function() {
                                    it("should not show a vertical scrollbar if there is no overflow", function() {
                                        makeScrollGrid([{
                                            width: 300,
                                            variableRowHeight: true
                                        }, {
                                            flex: 1
                                        }], 1);
                                        expectScroll(false, false);
                                        expectColumnWidths([300, 700]);
                                        store.first().set('field1', makeRowDiv(2));
                                        expectScroll(false, false);
                                    });

                                    it("should retain a vertical scrollbar if overflow exists", function() {
                                        makeScrollGrid([{
                                            width: 300,
                                            variableRowHeight: true
                                        }, {
                                            flex: 1
                                        }], scrollRowSize);
                                        expectScroll(true, false);
                                        expectColumnWidths(scrollbarsTakeSpace ? [300, 680] : [300, 700]);
                                        store.first().set('field1', makeRowDiv(2));
                                        expectScroll(true, false);
                                        expectColumnWidths(scrollbarsTakeSpace ? [300, 680] : [300, 700]);
                                    });

                                    it("should show a vertical scrollbar if the update causes an overflow", function() {
                                        makeScrollGrid([{
                                            width: 300,
                                            variableRowHeight: true
                                        }, {
                                            flex: 1
                                        }], maxRowsBeforeScroll, {
                                            height: null
                                        });
                                        grid.setHeight(grid.getHeight() + 5);
                                        expectScroll(false, false);
                                        expectColumnWidths([300, 700]);
                                        store.first().set('field1', makeRowDiv(2));
                                        expectScroll(true, false);
                                        expectColumnWidths(scrollbarsTakeSpace ? [300, 680] : [300, 700]);
                                    });

                                    it("should not show a vertical scrollbar if the update causes an underflow", function() {
                                        makeScrollGrid([{
                                            width: 300,
                                            variableRowHeight: true
                                        }, {
                                            flex: 1
                                        }], maxRowsBeforeScroll, {
                                            height: null
                                        });
                                        grid.setHeight(grid.getHeight() + 5);
                                        store.first().set('field1', makeRowDiv(2));
                                        expectScroll(true, false);
                                        expectColumnWidths(scrollbarsTakeSpace ? [300, 680] : [300, 700]);
                                        store.first().set('field1', '1.1');
                                        expectScroll(false, false);
                                        expectColumnWidths([300, 700]);
                                    });
                                });
                            });

                            describe("loading new content", function() {
                                describe("fixed width columns", function() {
                                    it("should not show a vertical scrollbar if there is no overflow", function() {
                                        makeScrollGrid([{
                                            width: 100
                                        }, {
                                            width: 300
                                        }], 1);
                                        expectScroll(false, false);
                                        store.loadData(makeRows(2));
                                        expect(false, false);
                                    });

                                    it("should retain a vertical scrollbar if overflow exists", function() {
                                        makeScrollGrid([{
                                            width: 100
                                        }, {
                                            width: 300
                                        }], scrollRowSize);
                                        expectScroll(true, false);
                                        store.loadData(makeRows(scrollRowSize + 20));
                                        expect(true, false);
                                    });

                                    it("should not show a vertical scrollbar if the new content does not require it", function() {
                                        makeScrollGrid([{
                                            width: 100
                                        }, {
                                            width: 300
                                        }], scrollRowSize);
                                        expectScroll(true, false);
                                        store.loadData(makeRows(1));
                                        expectScroll(false, false);
                                    });

                                    it("should not show a horizontal and vertical scrollbar if the new content does not require it", function() {
                                        makeScrollGrid([{
                                            width: 495
                                        }, {
                                            width: 495
                                        }], maxRowsBeforeScroll - 1);
                                        expectScroll(false, false);
                                        store.loadData(makeRows(1));
                                        expectScroll(false, false);
                                    });

                                    it("should show a vertical scrollbar if the old content did not require it", function() {
                                        makeScrollGrid([{
                                            width: 100
                                        }, {
                                            width: 300
                                        }], 1);
                                        expectScroll(false, false);
                                        store.loadData(makeRows(scrollRowSize));
                                        expectScroll(true, false);
                                    });

                                    it("should show a horizontal and vertical scrollbar if the old content did not require it", function() {
                                        makeScrollGrid([{
                                            width: 495
                                        }, {
                                            width: 495
                                        }], 1);
                                        expectScroll(false, false);
                                        store.loadData(makeRows(scrollRowSize + 1));
                                        // Horizontal overflow does not happen unless the vertical scrollbar took up the remaining 10px
                                        expectScroll(true, scrollbarsTakeSpace);
                                    });
                                });

                                describe("flexed columns", function() {
                                    it("should not show a vertical scrollbar if there is no overflow", function() {
                                        makeScrollGrid([{
                                            flex: 1
                                        }, {
                                            flex: 1
                                        }], 1);
                                        expectScroll(false, false);
                                        expectColumnWidths([500, 500]);
                                        store.loadData(makeRows(2));
                                        expect(false, false);
                                        expectColumnWidths([500, 500]);
                                    });

                                    it("should retain a vertical scrollbar if overflow exists", function() {
                                        makeScrollGrid([{
                                            flex: 1
                                        }, {
                                            flex: 1
                                        }], scrollRowSize);
                                        expectScroll(true, false);
                                        expectColumnWidths(scrollbarsTakeSpace ? [490, 490] : [500, 500]);
                                        store.loadData(makeRows(scrollRowSize + 20));
                                        expect(true, false);
                                        expectColumnWidths(scrollbarsTakeSpace ? [490, 490] : [500, 500]);
                                    });

                                    it("should not show a vertical scrollbar if the new content does not require it", function() {
                                        makeScrollGrid([{
                                            flex: 1
                                        }, {
                                            flex: 1
                                        }], scrollRowSize);
                                        expectScroll(true, false);
                                        expectColumnWidths(scrollbarsTakeSpace ? [490, 490] : [500, 500]);
                                        store.loadData(makeRows(1));
                                        expectScroll(false, false);
                                        expectColumnWidths([500, 500]);
                                    });

                                    it("should show a vertical scrollbar if the old content did not require it", function() {
                                        makeScrollGrid([{
                                            flex: 1
                                        }, {
                                            flex: 1
                                        }], 1);
                                        expectScroll(false, false);
                                        expectColumnWidths([500, 500]);
                                        store.loadData(makeRows(scrollRowSize));
                                        expectScroll(true, false);
                                        expectColumnWidths(scrollbarsTakeSpace ? [490, 490] : [500, 500]);
                                    });
                                });

                                describe("fixed width + flexed columns", function() {
                                    it("should not show a vertical scrollbar if there is no overflow", function() {
                                        makeScrollGrid([{
                                            width: 300
                                        }, {
                                            flex: 1
                                        }], 1);
                                        expectScroll(false, false);
                                        expectColumnWidths([300, 700]);
                                        store.loadData(makeRows(2));
                                        expect(false, false);
                                        expectColumnWidths([300, 700]);
                                    });

                                    it("should retain a vertical scrollbar if overflow exists", function() {
                                        makeScrollGrid([{
                                            width: 300
                                        }, {
                                            flex: 1
                                        }], scrollRowSize);
                                        expectScroll(true, false);
                                        expectColumnWidths(scrollbarsTakeSpace ? [300, 680] : [300, 700]);
                                        store.loadData(makeRows(scrollRowSize + 20));
                                        expect(true, false);
                                        expectColumnWidths(scrollbarsTakeSpace ? [300, 680] : [300, 700]);
                                    });

                                    it("should not show a vertical scrollbar if the new content does not require it", function() {
                                        makeScrollGrid([{
                                            width: 300
                                        }, {
                                            flex: 1
                                        }], scrollRowSize);
                                        expectScroll(true, false);
                                        expectColumnWidths(scrollbarsTakeSpace ? [300, 680] : [300, 700]);
                                        store.loadData(makeRows(1));
                                        expectScroll(false, false);
                                        expectColumnWidths([300, 700]);
                                    });

                                    it("should show a vertical scrollbar if the old content did not require it", function() {
                                        makeScrollGrid([{
                                            width: 300
                                        }, {
                                            flex: 1
                                        }], 1);
                                        expectScroll(false, false);
                                        expectColumnWidths([300, 700]);
                                        store.loadData(makeRows(scrollRowSize));
                                        expectScroll(true, false);
                                        expectColumnWidths(scrollbarsTakeSpace ? [300, 680] : [300, 700]);
                                    });
                                });
                            });
                        });

                        describe("header sizing", function() {
                            function expectHeaderWidth(width) {
                                expect(gridRef.headerCt.getLayout().innerCt.getWidth()).toBe(width);
                            }

                            describe("with no vertical and no horizontal scroll", function() {
                                visibleScrollbarsIt("should stretch to the grid size", function() {
                                    makeScrollGrid([{
                                        width: 300
                                    }], 1);
                                    expectHeaderWidth(1000);
                                });
                            });

                            describe("with no vertical and horizontal scroll", function() {
                                visibleScrollbarsIt("it should stretch to the full column size", function() {
                                    makeScrollGrid([{
                                        width: 600
                                    }, {
                                        width: 600
                                    }], 1);
                                    expectHeaderWidth(1200);
                                });
                            });

                            describe("with vertical and no horizontal scroll", function() {
                                visibleScrollbarsIt("should stretch to the grid size", function() {
                                    makeScrollGrid([{
                                        width: 300
                                    }], 100);
                                    expectHeaderWidth(1000);
                                });
                            });

                            describe("with vertical and horizontal scroll", function() {
                                visibleScrollbarsIt("should account for the vertical scrollbar", function() {
                                    makeScrollGrid([{
                                        width: 600
                                    }, {
                                        width: 600
                                    }], 100);
                                    expectHeaderWidth(1220);
                                });

                                // EXTJS-15789
                                xdescribe("when the vertical scroll is caused by a horizontal scrollbar", function() {
                                    visibleScrollbarsIt("should account for the vertical scrollbar", function() {
                                        makeScrollGrid([{
                                            width: 600
                                        }, {
                                            width: 600
                                        }], maxRowsBeforeScroll);
                                        expectHeaderWidth(1220);
                                    });
                                });

                                describe("when the horizontal scroll is caused by a vertical scrollbar", function() {
                                    visibleScrollbarsIt("should account for the vertical scrollbar", function() {
                                        makeScrollGrid([{
                                            width: 495
                                        }, {
                                            width: 495
                                        }], scrollRowSize);
                                        expectHeaderWidth(1010);
                                    });
                                });
                            });
                        });

                        if (withLocking) {
                            describe("locked side horizontal scroll place holder", function() {
                                function expectLockedScroll(scroll) {
                                    var overflowX = grid.lockedGrid.getView().getScrollable().getX();

                                    expect(overflowX).toBe(scroll ? 'scroll' : true);
                                }

                                it("should show the placeholder when the normal side overflows", function() {
                                    makeScrollGrid([{
                                        width: 600
                                    }, {
                                        width: 600
                                    }], 1);
                                    // Will only turn the locked side's overflowX to 'scroll' if it has to match a space-taking scrollbar on the normal side
                                    expectLockedScroll(scrollbarsTakeSpace);
                                });

                                it("should not show the placeholder when the normal side does not overflow", function() {
                                    makeScrollGrid([{
                                        width: 100
                                    }, {
                                        width: 300
                                    }], 1);
                                    expectLockedScroll(false);
                                });

                                it("should show the placeholder when a resize causes an overflow", function() {
                                    makeScrollGrid([{
                                        width: 400
                                    }, {
                                        width: 400
                                    }], 1);
                                    expectLockedScroll(false);
                                    grid.setWidth(grid.getWidth() - 400);
                                    // Will only turn the locked side's overflowX to 'scroll' if it has to match a space-taking scrollbar on the normal side
                                    expectLockedScroll(scrollbarsTakeSpace);
                                });

                                it("should not show the placeholder when a resize causes an underflow", function() {
                                    makeScrollGrid([{
                                        width: 600
                                    }, {
                                        width: 600
                                    }], 1);
                                    // Will only turn the locked side's overflowX to 'scroll' if it has to match a space-taking scrollbar on the normal side
                                    expectLockedScroll(scrollbarsTakeSpace);
                                    grid.setWidth(grid.getWidth() + 400);
                                    expectLockedScroll(false);
                                });

                                describe("column operations", function() {
                                    it("should show the placeholder when an add causes an overflow", function() {
                                        makeScrollGrid([{
                                            width: 400
                                        }, {
                                            width: 400
                                        }], 1);
                                        expectLockedScroll(false);
                                        grid.normalGrid.headerCt.add({
                                            width: 400,
                                            dataIndex: 'field3'
                                        });
                                        // Will only turn the locked side's overflowX to 'scroll' if it has to match a space-taking scrollbar on the normal side
                                        expectLockedScroll(scrollbarsTakeSpace);
                                    });

                                    it("should show the placeholder when a show causes an overflow", function() {
                                        makeScrollGrid([{
                                            width: 400
                                        }, {
                                            width: 400
                                        }, {
                                            width: 400,
                                            hidden: true
                                        }], 1);
                                        expectLockedScroll(false);
                                        colRef[2].show();
                                        // Will only turn the locked side's overflowX to 'scroll' if it has to match a space-taking scrollbar on the normal side
                                        expectLockedScroll(scrollbarsTakeSpace);
                                    });

                                    it("should not show the placeholder when a remove causes an underflow", function() {
                                        makeScrollGrid([{
                                            width: 400
                                        }, {
                                            width: 400
                                        }, {
                                            width: 400
                                        }], 1);
                                        // Will only turn the locked side's overflowX to 'scroll' if it has to match a space-taking scrollbar on the normal side
                                        expectLockedScroll(scrollbarsTakeSpace);
                                        colRef[2].destroy();
                                        expectLockedScroll(false);
                                    });

                                    it("should show the placeholder when a hide causes an underflow", function() {
                                        makeScrollGrid([{
                                            width: 400
                                        }, {
                                            width: 400
                                        }, {
                                            width: 400
                                        }], 1);
                                        // Will only turn the locked side's overflowX to 'scroll' if it has to match a space-taking scrollbar on the normal side
                                        expectLockedScroll(scrollbarsTakeSpace);
                                        colRef[2].hide();
                                        expectLockedScroll(false);
                                    });
                                });

                                describe("store operation", function() {
                                    describe("adding", function() {
                                        it("should not show the placeholder when the add does not trigger an overflow", function() {
                                            makeScrollGrid([{
                                                width: 495
                                            }, {
                                                width: 495
                                            }], 1);
                                            expectLockedScroll(false);
                                            store.add({});
                                            expectLockedScroll(false);
                                        });

                                        it("should retain the placeholder when the add does not trigger an underflow", function() {
                                            makeScrollGrid([{
                                                width: 495
                                            }, {
                                                width: 495
                                            }], scrollRowSize);
                                            // Will only turn the locked side's overflowX to 'scroll' if it has to match a space-taking scrollbar on the normal side
                                            expectLockedScroll(scrollbarsTakeSpace);
                                            store.add({});
                                            // Will only turn the locked side's overflowX to 'scroll' if it has to match a space-taking scrollbar on the normal side
                                            expectLockedScroll(scrollbarsTakeSpace);
                                        });

                                        it("should show the placeholder when an add causes an overflow via a vertical scrollbar", function() {
                                            makeScrollGrid([{
                                                width: 495
                                            }, {
                                                width: 495
                                            }], maxRowsBeforeScroll);
                                            expectLockedScroll(false);
                                            store.add({});
                                            // Will only turn the locked side's overflowX to 'scroll' if it has to match a space-taking scrollbar on the normal side
                                            expectLockedScroll(scrollbarsTakeSpace);
                                        });
                                    });

                                    describe("removing", function() {
                                        it("should not show the placeholder when there is no overflow", function() {
                                            makeScrollGrid([{
                                                width: 495
                                            }, {
                                                width: 495
                                            }], maxRowsBeforeScroll);
                                            expectLockedScroll(false);
                                            store.removeAt(0);
                                            expectLockedScroll(false);
                                        });

                                        it("should retain the placeholder when the remove does not trigger an underflow", function() {
                                            makeScrollGrid([{
                                                width: 495
                                            }, {
                                                width: 495
                                            }], scrollRowSize);
                                            // Will only turn the locked side's overflowX to 'scroll' if it has to match a space-taking scrollbar on the normal side
                                            expectLockedScroll(scrollbarsTakeSpace);
                                            store.removeAt(0);
                                            // Will only turn the locked side's overflowX to 'scroll' if it has to match a space-taking scrollbar on the normal side
                                            expectLockedScroll(scrollbarsTakeSpace);
                                        });

                                        it("should not show the placeholder when a remove causes an underflow via a vertical scrollbar", function() {
                                            makeScrollGrid([{
                                                width: 495
                                            }, {
                                                width: 495
                                            }], maxRowsBeforeScroll + 1);
                                            // Will only turn the locked side's overflowX to 'scroll' if it has to match a space-taking scrollbar on the normal side
                                            expectLockedScroll(scrollbarsTakeSpace);
                                            store.removeAt(0);
                                            expectLockedScroll(false);
                                        });
                                    });

                                    describe("update via variableRowHeight", function() {
                                        it("should not show the placeholder when there is no overflow", function() {
                                            makeScrollGrid([{
                                                width: 495
                                            }, {
                                                width: 495
                                            }], 1);
                                            expectLockedScroll(false);
                                            store.first().set('field1', makeRowDiv(2));
                                            expectLockedScroll(false);
                                        });

                                        it("should retain the placeholder when the update does not cause an overflow", function() {
                                            makeScrollGrid([{
                                                width: 495
                                            }, {
                                                width: 495
                                            }], maxRowsBeforeScroll, {
                                                height: null,
                                                viewConfig: {
                                                    variableRowHeight: true
                                                }
                                            });
                                            grid.setHeight(grid.getHeight() + 5);
                                            store.first().set('field1', makeRowDiv(2));
                                            // Will only turn the locked side's overflowX to 'scroll' if it has to match a space-taking scrollbar on the normal side
                                            expectLockedScroll(scrollbarsTakeSpace);
                                            store.first().set('field1', '1.1');
                                            expectLockedScroll(false);
                                        });

                                        it("should show the placeholder when an update causes an overflow via a vertical scrollbar", function() {
                                            makeScrollGrid([{
                                                width: 495
                                            }, {
                                                width: 495
                                            }], maxRowsBeforeScroll, {
                                                height: null,
                                                viewConfig: {
                                                    variableRowHeight: true
                                                }
                                            });
                                            grid.setHeight(grid.getHeight() + 5);
                                            expectLockedScroll(false);
                                            store.first().set('field1', makeRowDiv(2));
                                            // Will only turn the locked side's overflowX to 'scroll' if it has to match a space-taking scrollbar on the normal side
                                            expectLockedScroll(scrollbarsTakeSpace);
                                        });

                                        it("should not show the placeholder when an update causes an underflow via a vertical scrollbar", function() {
                                            var data = makeRows(maxRowsBeforeScroll);
                                            data[0].field1 = makeRowDiv(2);
                                            makeScrollGrid([{
                                                width: 495
                                            }, {
                                                width: 495
                                            }], maxRowsBeforeScroll, {
                                                height: null,
                                                viewConfig: {
                                                    variableRowHeight: true
                                                }
                                            });
                                            grid.setHeight(grid.getHeight() + 5);
                                            store.first().set('field1', makeRowDiv(2));
                                            // Will only turn the locked side's overflowX to 'scroll' if it has to match a space-taking scrollbar on the normal side
                                            expectLockedScroll(scrollbarsTakeSpace);
                                            store.first().set('field1', '1.1');
                                            expectLockedScroll(false);
                                        });
                                    });

                                    describe("loading new content", function() {
                                        it("should not show the placeholder if there is no overflow", function() {
                                            makeScrollGrid([{
                                                width: 495
                                            }, {
                                                width: 495
                                            }], 1);
                                            expectLockedScroll(false);
                                            store.loadData(makeRows(2));
                                            expectLockedScroll(false);
                                        });

                                        it("should retain the placeholder if there is no underflow", function() {
                                            makeScrollGrid([{
                                                width: 495
                                            }, {
                                                width: 495
                                            }], scrollRowSize);
                                            // Will only turn the locked side's overflowX to 'scroll' if it has to match a space-taking scrollbar on the normal side
                                            expectLockedScroll(scrollbarsTakeSpace);
                                            store.loadData(makeRows(scrollRowSize + 10));
                                            // Will only turn the locked side's overflowX to 'scroll' if it has to match a space-taking scrollbar on the normal side
                                            expectLockedScroll(scrollbarsTakeSpace);
                                        });

                                        it("should not show the placeholder when load causes an underflow", function() {
                                            makeScrollGrid([{
                                                width: 495
                                            }, {
                                                width: 495
                                            }], scrollRowSize);
                                            // Will only turn the locked side's overflowX to 'scroll' if it has to match a space-taking scrollbar on the normal side
                                            expectLockedScroll(scrollbarsTakeSpace);
                                            store.loadData(makeRows(1));
                                            expectLockedScroll(false);
                                        });

                                        it("should show the placeholder when load causes an overflow", function() {
                                            makeScrollGrid([{
                                                width: 495
                                            }, {
                                                width: 495
                                            }], 1);
                                            expectLockedScroll(false);
                                            store.loadData(makeRows(scrollRowSize));
                                            // Will only turn the locked side's overflowX to 'scroll' if it has to match a space-taking scrollbar on the normal side
                                            expectLockedScroll(scrollbarsTakeSpace);
                                        });
                                    });
                                });
                            });

                            describe("scrollbars caused by height synchronization", function() {
                                beforeEach(function() {
                                    lockedIsVariable = true;
                                });

                                it("should show a vertical scrollbar if the locked content cause overflow", function() {
                                    var data = makeRows(maxRowsBeforeScroll);
                                    data[0].field10 = makeRowDiv(2);
                                    makeScrollGrid([{
                                        width: 100
                                    }, {
                                        width: 300
                                    }], data);
                                    expectScroll(true, false);
                                });

                                it("should show a vertical scrollbar if adding causes overflow", function() {
                                    makeScrollGrid([{
                                        width: 100
                                    }, {
                                        width: 300
                                    }], maxRowsBeforeScroll - 1);
                                    expectScroll(false, false);
                                    store.add({
                                        field10: makeRowDiv(2)
                                    });
                                    expectScroll(true, false);
                                });

                                it("should not show a vertical scrollbar if remving causes underflow", function() {
                                    var data = makeRows(maxRowsBeforeScroll);
                                    data[0].field10 = makeRowDiv(2);
                                    makeScrollGrid([{
                                        width: 100
                                    }, {
                                        width: 300
                                    }], data);
                                    expectScroll(true, false);
                                    store.removeAt(0);
                                    expectScroll(false, false);
                                });

                                it("should show a vertical scrollbar if update causes an overflow", function() {
                                    makeScrollGrid([{
                                        width: 100
                                    }, {
                                        width: 300
                                    }], maxRowsBeforeScroll);
                                    expectScroll(false, false);
                                    store.first().set('field10', makeRowDiv(2));
                                    expectScroll(true, false);
                                });

                                it("should not show a vertical scrollbar if update causes an underflow", function() {
                                    var data = makeRows(maxRowsBeforeScroll);
                                    data[0].field10 = makeRowDiv(2);
                                    makeScrollGrid([{
                                        width: 100
                                    }, {
                                        width: 300
                                    }], data);
                                    expectScroll(true, false);
                                    store.first().set('field10', '1.1');
                                    expectScroll(false, false);
                                });
                            });
                        }
                    });
                }
                makeScrollSuite(false);
                makeScrollSuite(true);
            });

            describe('disable/enable grids', function() {
                it('should disable single grids', function() {
                    makeGrid();
                    grid.disable();

                    expect(grid.isMasked()).toBe(true);
                    expect(grid.headerCt.disabled).toBe(true);
                    expect(grid.headerCt.isMasked()).toBeFalsy();
                    expect(grid.headerCt.el.dom.getAttribute('tabIndex')).toBe('-1');
                    
                    grid.enable();
                    expect(grid.isMasked()).toBeFalsy();
                    expect(grid.headerCt.disabled).toBe(false);
                    expect(grid.headerCt.isMasked()).toBeFalsy();
                    expect(grid.headerCt.el.dom.getAttribute('tabIndex')).toBe('0');
                });
                
                it('should disable locking grids', function() {
                    makeGrid(null, undefined, null, null, true);
                    grid.disable();

                    // Outermost grid should be masked
                    expect(grid.isMasked()).toBe(true);

                    // Locked side
                    expect(grid.lockedGrid.isMasked()).toBeFalsy();
                    expect(grid.lockedGrid.headerCt.disabled).toBe(true);
                    expect(grid.lockedGrid.headerCt.isMasked()).toBeFalsy();
                    expect(grid.lockedGrid.headerCt.el.dom.getAttribute('tabIndex')).toBe('-1');

                    // Normal side
                    expect(grid.normalGrid.isMasked()).toBeFalsy();
                    expect(grid.normalGrid.headerCt.disabled).toBe(true);
                    expect(grid.normalGrid.headerCt.isMasked()).toBeFalsy();
                    expect(grid.normalGrid.headerCt.el.dom.getAttribute('tabIndex')).toBe('-1');
                    
                    grid.enable();

                    // Outermost grid should not be masked
                    expect(grid.isMasked()).toBeFalsy();

                    // Locked side
                    expect(grid.lockedGrid.isMasked()).toBeFalsy();
                    expect(grid.lockedGrid.headerCt.disabled).toBe(false);
                    expect(grid.lockedGrid.headerCt.isMasked()).toBeFalsy();
                    expect(grid.lockedGrid.headerCt.el.dom.getAttribute('tabIndex')).toBe('0');

                    // Normal side
                    expect(grid.normalGrid.isMasked()).toBeFalsy();
                    expect(grid.normalGrid.headerCt.disabled).toBe(false);
                    expect(grid.normalGrid.headerCt.isMasked()).toBeFalsy();
                    expect(grid.normalGrid.headerCt.el.dom.getAttribute('tabIndex')).toBe('0');
                });
            });

            describe('disable/enable grid views', function() {
                it('should only disable the view when view.disable is called', function() {
                    makeGrid();
                    grid.view.disable();

                    expect(grid.disabled).toBe(false);
                    expect(grid.isMasked()).toBeFalsy();
                    expect(grid.view.disabled).toBe(true);
                    expect(grid.view.isMasked()).toBe(true);

                    grid.view.enable();

                    expect(grid.disabled).toBe(false);
                    expect(grid.isMasked()).toBeFalsy();
                    expect(grid.view.disabled).toBe(false);
                    expect(grid.view.isMasked()).toBeFalsy();
                });

                it('should disable both views in a locking grid when view.disable is alled on a locking grid', function() {
                    makeGrid(null, undefined, null, null, true);
                    grid.view.disable();
                    
                    expect(grid.disabled).toBe(false);
                    expect(grid.isMasked()).toBeFalsy();

                    expect(grid.normalGrid.disabled).toBe(false);
                    expect(grid.normalGrid.isMasked()).toBeFalsy();
                    expect(grid.normalGrid.headerCt.disabled).toBe(false);
                    expect(grid.normalGrid.headerCt.isMasked()).toBeFalsy();

                    expect(grid.lockedGrid.disabled).toBe(false);
                    expect(grid.lockedGrid.isMasked()).toBeFalsy();
                    expect(grid.lockedGrid.headerCt.disabled).toBe(false);
                    expect(grid.lockedGrid.headerCt.isMasked()).toBeFalsy();
                    
                    expect(grid.normalGrid.view.disabled).toBe(true);
                    expect(grid.normalGrid.view.isMasked()).toBeTruthy();
                    expect(grid.lockedGrid.view.disabled).toBe(true);
                    expect(grid.lockedGrid.view.isMasked()).toBeTruthy();

                    grid.view.enable();
                    
                    expect(grid.disabled).toBe(false);
                    expect(grid.isMasked()).toBeFalsy();

                    expect(grid.normalGrid.disabled).toBe(false);
                    expect(grid.normalGrid.isMasked()).toBeFalsy();
                    expect(grid.normalGrid.headerCt.disabled).toBe(false);
                    expect(grid.normalGrid.headerCt.isMasked()).toBeFalsy();

                    expect(grid.lockedGrid.disabled).toBe(false);
                    expect(grid.lockedGrid.isMasked()).toBeFalsy();
                    expect(grid.lockedGrid.headerCt.disabled).toBe(false);
                    expect(grid.lockedGrid.headerCt.isMasked()).toBeFalsy();
                    
                    expect(grid.normalGrid.view.disabled).toBe(false);
                    expect(grid.normalGrid.view.isMasked()).toBeFalsy();
                    expect(grid.lockedGrid.view.disabled).toBe(false);
                    expect(grid.lockedGrid.view.isMasked()).toBeFalsy();
                });
            });
        });
        
        if (buffered) {
            describe('cellWrap: true column width changing halfway down buffer rendered large dataset', function() {
                var i,
                    data = [],
                    lorem = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.",
                    loremLen = lorem.length,
                    minLen = loremLen - 100,
                    store,
                    grid,
                    view,
                    bufferedRenderer,
                    rrSpy;

                for (i = 0; i < 500; i++) {
                    data.push(['Row ' + (i + 1), lorem.substr(0, Ext.Number.randomInt(minLen, loremLen))]);
                }
                afterEach(function() {
                    Ext.destroy(store, grid);
                });

                it('should adjust view body position if column width change causes body to move out of view', function() {
                    store = new Ext.data.ArrayStore({
                        data: data,
                        fields: ['row', 'lorem']
                    });

                    grid = new Ext.grid.Panel({
                        height: 300,
                        width: 400,
                        title: 'Test',
                        store: store,
                        buffered: true,
                        columns: [{
                            text: 'Row',
                            dataIndex: 'row',
                            width: 50
                        }, {
                            text: 'Lorem',
                            dataIndex: 'lorem',
                            flex: 1,
                            cellWrap: true
                        }],
                        renderTo: document.body
                    });
                    view = grid.view;
                    bufferedRenderer = view.bufferedRenderer;
                    bufferedRenderer.scrollTo(100);

                    rrSpy = spyOn(bufferedRenderer, "renderRange").andCallThrough();

                    // Widen and then shrink that first column
                    grid.getVisibleColumnManager().getColumns()[0].setWidth(150);
                    grid.getVisibleColumnManager().getColumns()[0].setWidth(50);

                    // BufferedRenderer#setViewSize just adds/remove records
                    expect(rrSpy.callCount).toBe(0);

                    // Body top must be above the top of the viewport
                    expect(bufferedRenderer.bodyTop).toBeLessThan(bufferedRenderer.scrollTop);

                    // The body bottom must be below the bottom of the viewport
                    expect(bufferedRenderer.bodyTop + view.body.dom.offsetHeight).toBeGreaterThan(bufferedRenderer.scrollTop + view.el.dom.clientHeight);

                    // Remove all but the last record
                    store.removeAt(0, 498);

                    // BufferedRenderer#setViewSize just adds/remove records
                    expect(rrSpy.callCount).toBe(0);

                    // Should move the rendered range to top if the viewSize >= storeCount
                    expect(bufferedRenderer.bodyTop).toBe(0);
                });
                
                it("should not refresh if the rendered view is positioned at the start", function() {
                    store = new Ext.data.ArrayStore({
                        data: data,
                        fields: ['row', 'lorem']
                    });

                    grid = new Ext.grid.Panel({
                        height: 300,
                        width: 400,
                        title: 'Test',
                        store: store,
                        buffered: true,
                        columns: [{
                            text: 'Row',
                            dataIndex: 'row',
                            width: 50
                        }, {
                            text: 'Lorem',
                            dataIndex: 'lorem',
                            flex: 1,
                            cellWrap: true
                        }],
                        renderTo: document.body
                    });
                    view = grid.view;
                    bufferedRenderer = view.bufferedRenderer;
                    rrSpy = spyOn(bufferedRenderer, "renderRange").andCallThrough();

                    // Widen and then shrink that first column
                    grid.getVisibleColumnManager().getColumns()[0].setWidth(150);
                    grid.getVisibleColumnManager().getColumns()[0].setWidth(50);

                    // Nothing happened
                    expect(bufferedRenderer.bodyTop).toBe(0);
                    expect(rrSpy.callCount).toBe(0);
                });
            });
        }
    }
    createSuite(false);
    createSuite(true);

    describe('Locking configuration', function () {
        var store;

        function createGrid(cfg) {
            grid = new Ext.grid.Panel(Ext.apply({
                title: 'Test',
                height: 300,
                width: 400,
                renderTo: document.body,
                store: store,
                columns: [{
                    text: 'Row',
                    dataIndex: 'row',
                    locked: true,
                    width: 50
                }, {
                    text: 'Lorem',
                    dataIndex: 'lorem'
                }]
            }, cfg));
        }

        beforeEach(function () {
            store = new Ext.data.ArrayStore({
                data: [
                    [ 1, 'Lorem'],
                    [ 2, 'Ipsum'],
                    [ 3, 'Dolor']
                ],
                fields: ['row', 'lorem']
            })
        });

        describe('on init', function () {
            beforeEach(function () {
                createGrid({
                    enableColumnHide: true,
                    rowLines: true,
                    enableColumnMove: false,
                    normalGridConfig: {
                        enableColumnHide: false
                    },
                    lockedGridConfig: {
                        rowLines: false
                    }
                });
            });

            it('should pass down configs to normalGrid', function () {
                expect(grid.enableColumnMove).toBe(false);
                expect(grid.normalGrid.enableColumnMove).toBe(false);
            });

            it('should pass down configs to lockedGrid', function () {
                expect(grid.enableColumnMove).toBe(false);
                expect(grid.lockedGrid.enableColumnMove).toBe(false);
            });

            it('should not pass down configs specified in normalGridConfig', function () {
                expect(grid.enableColumnHide).toBe(true);
                expect(grid.normalGrid.enableColumnHide).toBe(false);
            });

            it('should not pass down configs specified in lockedGridConfig', function () {
                expect(grid.rowLines).toBe(true);
                expect(grid.lockedGrid.rowLines).toBe(false);
            });
        });

        describe('when stateful', function () {
            afterEach(function () {
                Ext.state.Manager.set(grid.getStateId(), null);
            });

            describe('retaining state across page loads', function () {
                function makeGrid(stateId) {
                    createGrid({
                        columns: [{
                            text: 'Row',
                            dataIndex: 'row',
                            locked: true,
                            width: 50
                        }, {
                            text: 'Lorem',
                            stateId: stateId || null,
                            dataIndex: 'lorem'
                        }],
                        stateful: true,
                        stateId: 'foo'
                    });
                }

                function saveAndRecreate(stateId) {
                    grid.saveState();
                    Ext.destroy(grid);

                    // After page refresh.
                    makeGrid(stateId);
                }

                function testStateId(stateId) {
                    var maybe = !!stateId ? '' : 'not';

                    describe('when columns are ' + maybe + ' configured with a stateId', function () {
                        function testLockingPartner(which) {
                            describe(which + ' locking partner', function () {
                                var partner = which + 'Grid';

                                beforeEach(function () {
                                    makeGrid(stateId);
                                });

                                it('should retain column width', function () {
                                    grid[partner].columnManager.getColumns()[0].setWidth(250);
                                    saveAndRecreate(stateId);

                                    expect(grid[partner].columnManager.getColumns()[0].getWidth()).toBe(250);
                                });

                                it('should retain column visibility', function () {
                                    grid[partner].columnManager.getColumns()[0].hide();
                                    saveAndRecreate(stateId);

                                    expect(grid[partner].columnManager.getColumns()[0].hidden).toBe(true);
                                });

                                it('should retain the column sort', function () {
                                    var column = grid[partner].columnManager.getColumns()[0];

                                    column.sort();
                                    expect(column.sortState).toBe('ASC');

                                    // Let's sort again.
                                    column.sort();

                                    saveAndRecreate(stateId);

                                    expect(grid[partner].columnManager.getColumns()[0].sortState).toBe('DESC');
                                });
                            });
                        }

                        testLockingPartner('locked');
                        testLockingPartner('normal');
                    });
                }

                testStateId('theOwlHouse');
                testStateId(null);
            });
        });
    });

    describe('BufferedStore asynchronous loading timing with rendering and preserveScrollOnReload: true', function() {
        var view,
            bufferedRenderer,
            scroller,
            scrollSize,
            scrollEventCount,
            scrollRequestCount,
            TestModel = Ext.define(null, {
                extend: 'Ext.data.Model',
                fields: [
                    'title', 'forumtitle', 'forumid', 'username', {
                        name: 'replycount',
                        type: 'int'
                    }, {
                        name: 'lastpost',
                        mapping: 'lastpost',
                        type: 'date',
                        dateFormat: 'timestamp'
                    },
                    'lastposter', 'excerpt', 'threadid'
                ],
                idProperty: 'threadid'
            });

        function getData(start, limit) {
            var end = start + limit,
                recs = [],
                i;

            for (i = start; i < end; ++i) {
                recs.push({
                    threadid: i,
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

        function satisfyRequestsForPages(pages, total) {
            var requests = Ext.Ajax.mockGetAllRequests(),
                i, len, request, params, data;

            for (i = 0, len = requests.length; i < len; i++) {
                request = requests[i];
                params = request.options.params;
                
                if (Ext.Array.contains(pages, params.page)) {
                    data = getData(params.start, params.limit);

                    Ext.Ajax.mockComplete({
                        status: 200,
                        responseText: Ext.encode({
                            total: total || 5000,
                            data: data
                        })
                    }, request.id);
                }
            }
        }

        beforeEach(function() {
            MockAjaxManager.addMethods();

            store = new Ext.data.BufferedStore({
                model: TestModel,
                pageSize: 50,
                trailingBufferZone: 50,
                leadingBufferZone: 50,
                proxy: {
                    type: 'ajax',
                    url: 'fakeUrl',
                    reader: {
                        type: 'json',
                        rootProperty: 'data'
                    }
                }
            });
            store.loadPage(1);
            satisfyRequests();

            scrollEventCount = 0;
            grid = new Ext.grid.Panel({
                columns: [{
                    text: 'Title',
                    dataIndex: 'title'
                }],
                store: store,
                width: 600,
                height: 300,
                border: false,
                viewConfig: {
                    preserveScrollOnReload: true,
                    mouseOverOutBuffer: 0,
                    listeners: {
                        scroll: function() {
                            scrollEventCount++;
                        }
                    }
                },
                renderTo: document.body,
                selModel: {
                    pruneRemoved: false
                }
            });
            view = grid.getView();
            bufferedRenderer = view.bufferedRenderer;
            scroller = view.getScrollable();
            scrollSize = (bufferedRenderer.viewSize * 2 + store.leadingBufferZone + store.trailingBufferZone) * bufferedRenderer.rowHeight;

            // Load inline in the scroll event
            bufferedRenderer.scrollToLoadBuffer = 0;
            
            scrollRequestCount = 0;
        });

        afterEach(function() {
            MockAjaxManager.removeMethods();
        });

        it('should render maintain selection when returning to a page with a previously selected record in it', function() {

            // Select record 0.
            // We plan to evict this page, but maintain that record as selected.
            view.getSelectionModel().select(0);

            // It should tolerate the focused record being evicted from the page cache.
            view.getNavigationModel().setPosition(0, 0);

            // Scroll to new areas of dataset.
            // Satisfy page requests as they arrive so that
            // old pages are evicted.
            waitsFor(function() {
                satisfyRequests();

                if (scrollEventCount === scrollRequestCount) {
                    // Scroll, until page 1 has been evicted
                    if (!store.data.peekPage(1)) {
                        return true;
                    }
                    view.scrollBy(null, 100);
                    scrollRequestCount++;
                }
            }, 'Page one to have been purged from the PageCache', 20000);

            runs(function() {
                scrollEventCount = 0;
                scroller.scrollTo(0, 0);
            });
            
            waitsFor(function() {
                return scrollEventCount === 1;
            }, 'A scroll event to fire', 20000);
            runs(function() {
                satisfyRequests();

                // First record still selected
                expect(view.all.item(0).hasCls(Ext.baseCSSPrefix + 'grid-item-selected')).toBe(true);
            });
        });

        it('should render page 1, and page 1 should still be in the page cache when returning to page 1 after scrolling down', function() {
            // Scroll to new areas of dataset.
            // Will queue a lot of page requests which we will satisfy in a while
            waitsFor(function() {
                //  Scroll until we have 20 page requests outstanding
                if (Ext.Ajax.mockGetAllRequests().length > 20) {
                    return true;
                }

                if (scrollEventCount === scrollRequestCount) {
                    view.scrollBy(null, scrollSize);
                    scrollRequestCount++;
                }
            });

            runs(function() {
                scrollEventCount = 0;
                scroller.scrollTo(0, 0);
            });
            
            waitsFor(function() {
                return scrollEventCount === 1;
            });
            runs(function() {
                satisfyRequests();

                // Page 1 should be rendered at position zero since we scrolled back to the top
                expect(getViewTop(view.body)).toBe(0);

                // Page 1 should still be in the page map, NOT purged out by the arrival of all
                // the other pages from the visited areas of the dataset.
                expect(store.data.hasPage(1)).toBe(true);
            });
        });

        it('Page 1 should still be rendered, and page 1 should still be in the page cache when returning to page 1 after scrolling down with only buffer zone pages loaded into store during scroll', function() {
            // Scroll to new areas of dataset.
            // Will queue a lot of page requests which we will satisfy in a while
            waitsFor(function() {
                //  Scroll until we have 20 page requests outstanding
                if (Ext.Ajax.mockGetAllRequests().length > 20) {
                    return true;
                }

                if (scrollEventCount === scrollRequestCount) {
                    view.scrollBy(null, scrollSize);
                    scrollRequestCount++;
                }
            });

            runs(function() {
                scrollEventCount = 0;
                scroller.scrollTo(0, 0);
            });
            
            waitsFor(function() {
                return scrollEventCount === 1;
            });
            runs(function() {
                // Only satisfy requests for non-rendered buffer zone pages so that no rendering is done and
                // page 1 is left undisturbed in the rendered block.
                satisfyRequestsForPages([3, 6, 7, 10, 11, 13, 14, 17, 18, 21, 22, 25]);

                // Page 1 should be rendered at position zero since we scrolled back to the top
                expect(getViewTop(view.body)).toBe(0);

                // Page 1 should still be in the page map, NOT purged out by the arrival of all
                // the other pages from the visited areas of the dataset.
                expect(store.data.hasPage(1)).toBe(true);
            });
        });

        it('should refresh the same rendered block on buffered store reload with preserveScrollOnReload: true', function() {
            var scrollDone,
                refreshed,
                startRow, endRow;

            expect(view.refreshCounter).toBe(1);

            bufferedRenderer.scrollTo(1000, {
                select: true,
                focus: true,
                callback: function() {
                    scrollDone = true;
                }
            });

            waitsFor(function() {
                satisfyRequests();
                return scrollDone;
            }, 'scroll to finish');

            runs(function() {
                startRow = view.all.startIndex;
                endRow = view.all.endIndex;
                store.on({
                    refresh: function() {
                        refreshed = true;
                    },
                    single: true
                });
                store.reload();
            });

            waitsFor(function() {
                satisfyRequests();
                return refreshed;
            }, 'store to reload');

            runs(function() {
                expect(view.refreshCounter).toBe(2);
                expect(view.all.startIndex).toBe(startRow);
                expect(view.all.endIndex).toBe(endRow);
            });
        });
    });

    describe('BufferedStore asynchronous loading timing with rendering and preserveScrollOnReload: false', function() {
        var view,
            bufferedRenderer,
            scroller,
            scrollSize,
            scrollEventCount,
            scrollRequestCount,
            TestModel = Ext.define(null, {
                extend: 'Ext.data.Model',
                fields: [
                    'title', 'forumtitle', 'forumid', 'username', {
                        name: 'replycount',
                        type: 'int'
                    }, {
                        name: 'lastpost',
                        mapping: 'lastpost',
                        type: 'date',
                        dateFormat: 'timestamp'
                    },
                    'lastposter', 'excerpt', 'threadid'
                ],
                idProperty: 'threadid'
            });

        function getData(start, limit) {
            var end = start + limit,
                recs = [],
                i;

            for (i = start; i < end; ++i) {
                recs.push({
                    threadid: i,
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

        function satisfyRequestsForPages(pages, total) {
            var requests = Ext.Ajax.mockGetAllRequests(),
                i, len, request, params, data;

            for (i = 0, len = requests.length; i < len; i++) {
                request = requests[i];
                params = request.options.params;
                
                if (Ext.Array.contains(pages, params.page)) {
                    data = getData(params.start, params.limit);

                    Ext.Ajax.mockComplete({
                        status: 200,
                        responseText: Ext.encode({
                            total: total || 5000,
                            data: data
                        })
                    }, request.id);
                }
            }
        }

        beforeEach(function() {
            MockAjaxManager.addMethods();

            store = new Ext.data.BufferedStore({
                model: TestModel,
                pageSize: 50,
                trailingBufferZone: 50,
                leadingBufferZone: 50,
                proxy: {
                    type: 'ajax',
                    url: 'fakeUrl',
                    reader: {
                        type: 'json',
                        rootProperty: 'data'
                    }
                }
            });
            store.loadPage(1);
            satisfyRequests();

            scrollEventCount = 0;
            grid = new Ext.grid.Panel({
                columns: [{
                    text: 'Title',
                    dataIndex: 'title'
                }],
                store: store,
                width: 600,
                height: 300,
                border: false,
                viewConfig: {
                    preserveScrollOnReload: false,
                    mouseOverOutBuffer: 0,
                    listeners: {
                        scroll: function() {
                            scrollEventCount++;
                        }
                    }
                },
                renderTo: document.body,
                selModel: {
                    pruneRemoved: false
                }
            });
            view = grid.getView();
            bufferedRenderer = view.bufferedRenderer;
            scroller = view.getScrollable();
            scrollSize = (bufferedRenderer.viewSize * 2 + store.leadingBufferZone + store.trailingBufferZone) * bufferedRenderer.rowHeight;

            // Load inline in the scroll event
            bufferedRenderer.scrollToLoadBuffer = 0;
            
            scrollRequestCount = 0;
        });

        afterEach(function() {
            MockAjaxManager.removeMethods();
        });

        it('should refresh from page 1 on buffered store reload with preserveScrollOnReload: false', function() {
            var scrollDone,
                refreshed,
                startRow, endRow;

            expect(view.refreshCounter).toBe(1);

            bufferedRenderer.scrollTo(1000, {
                select: true,
                focus: true,
                callback: function() {
                    scrollDone = true;
                }
            });

            waitsFor(function() {
                satisfyRequests();
                return scrollDone;
            }, 'scroll to finish');

            runs(function() {
                startRow = view.all.startIndex;
                endRow = view.all.endIndex;
                store.on({
                    refresh: function() {
                        refreshed = true;
                    },
                    single: true
                });
                store.reload();
            });

            waitsFor(function() {
                satisfyRequests();
                return refreshed;
            }, 'store to reload');

            runs(function() {
                expect(view.refreshCounter).toBe(2);
                expect(view.all.startIndex).toBe(0);
                expect(view.all.endIndex).toBe(bufferedRenderer.viewSize - 1);
            });
        });
    });

    describe('paging grid with buffered renderer', function() {
        var grid;

        afterEach(function() {
            grid.destroy();
        });

        it('should refresh the view on each page change', function() {
            var store, ptoolbar;
            
            runs(function() {
                function getRandomDate() {
                    var from = new Date(1900, 0, 1).getTime();
                    var to = new Date().getTime();
                    return new Date(from + Math.random() * (to - from));
                }

                function createFakeData(count) {
                    var firstNames   = ['Ed', 'Tommy', 'Aaron', 'Abe'];
                    var lastNames    = ['Spencer', 'Maintz', 'Conran', 'Elias'];

                    var data = [];
                    for (var i = 0; i < count ; i++) {
                        var dob = getRandomDate();           
                        var firstNameId = Math.floor(Math.random() * firstNames.length);
                        var lastNameId  = Math.floor(Math.random() * lastNames.length);
                        var name        = Ext.String.format("{0} {1}", firstNames[firstNameId], lastNames[lastNameId]);

                        data.push([name, dob]);
                    }
                    return data;
                }

                // create the Data Store
                store = Ext.create('Ext.data.Store', {
                    fields: [
                        'Name', 'dob'
                    ],
                    autoLoad: true,
                    proxy: {
                        type: 'memory',
                        enablePaging: true,
                        data: createFakeData(100),
                        reader: {
                            type: 'array'
                        }
                    },
                    pageSize: 20
                });

                grid = Ext.create('Ext.grid.Panel', {
                    store: store,
                    columns: [
                        {text: "Name", width:120, dataIndex: 'Name'},
                        {text: "dob", flex: 1, dataIndex: 'dob'}
                    ],                    
                    dockedItems: [
                        ptoolbar = Ext.create('Ext.toolbar.Paging', {
                            dock: 'bottom',
                            store: store
                        })
                    ],
                    renderTo: document.body,
                    width: 500,
                    height: 200,
                    plugins: [{
                        ptype: 'bufferedrenderer'
                    }]
                });
            });

            // Wait for first refresh.
            waitsFor(function() {
                return grid.view.all.getCount() === 20;
            });
            
            runs(function() {
                var refreshCount = grid.view.refreshCounter;

                grid.view.scrollTo(0,100);

                // Wait for the scroll event to get into the BufferedRenderer                
                waitsFor(function() {
                    return grid.view.bufferedRenderer.scrollTop === 100;
                });

                runs(function() {
                    jasmine.fireMouseEvent(ptoolbar.down('#next').el, 'click');

                    // Should be one more page refresh
                    expect(grid.view.refreshCounter).toBe(refreshCount + 1);

                    // A new full page of 20 records should be there
                    expect(grid.view.all.getCount()).toBe(20);

                    // Should have scrolled to top on view refresh
                    expect(grid.view.getScrollY()).toBe(0);
                });
            });
        });
    });

    describe('Locking a column when grid configured with enableLocking, but no locked columns', function() {
        it('should not throw an error, and should maintain scroll position', function() {
            var scrollY;

            grid = new Ext.grid.Panel({
                renderTo: Ext.getBody(),
                width: 400,
                height: 400,
                title: 'Lock a column',
                columns: [{
                    dataIndex: 'name',
                    text: 'Name'
                }, {
                    dataIndex: 'age',
                    text: 'Age'
                }],

                enableLocking: true,

                store: {
                    fields: [{
                        name: 'name',
                        type: 'string'
                    }, {
                        name: 'age',
                        type: 'int'
                    }],
                    data: (function() {
                        var data = [];
                        var len = 44; // <-- 43 records does not trigger error
                        while (len--) {
                            data.unshift({
                                name: 'User ' + len,
                                age: Ext.Number.randomInt(0, 100)
                            });
                        }
                        return data;
                    })()
                },
                bbar: ['->', Ext.versions.extjs.version]
            });

            // Scroll to end (ensureVisible sanitzes the inputs)
            grid.ensureVisible(100);

            // Locked grid is hidden because there are no locked columns
            expect(grid.lockedGrid.isVisible()).toBe(false);

            // Cache vertical scroll pos
            scrollY = grid.normalGrid.view.getScrollY();

            grid.lock(grid.getVisibleColumnManager().getColumns()[1]);

            // Should result in showing the locked grid
            expect(grid.lockedGrid.isVisible()).toBe(true);

            // Scroll position should be preserved
            expect(grid.lockedGrid.view.getScrollY()).toBe(scrollY);
        });
    });
});
