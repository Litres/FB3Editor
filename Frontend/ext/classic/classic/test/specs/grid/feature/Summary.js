describe('Ext.grid.feature.Summary', function () {
    var synchronousLoad = true,
        proxyStoreLoad = Ext.data.ProxyStore.prototype.load,
        loadStore;

    function makeSuite(withLocking) {
        describe(withLocking ? "with locking" : "without locking", function() {
            var grid, view, store, summary, params, selector, 
                data, lockedGrid, normalGrid, lockedView, normalView,
                hideMarkColumn = false;

            function createGrid(gridCfg, summaryCfg, storeCfg, configuredData) {
                data = [{
                    student: 'Student 1',
                    subject: 'Math',
                    mark: 84
                },{
                    student: 'Student 1',
                    subject: 'Science',
                    mark: 72
                },{
                    student: 'Student 2',
                    subject: 'Math',
                    mark: 96
                },{
                    student: 'Student 2',
                    subject: 'Science',
                    mark: 68
                }];

                var storeData = configuredData || data;

                store = new Ext.data.Store(Ext.apply({
                    fields: ['student', 'subject', {
                        name: 'mark',
                        type: 'int'
                    }],
                    data: storeData,
                    autoDestroy: true
                }, storeCfg));

                summary = new Ext.grid.feature.Summary(Ext.apply({
                    ftype: 'summary'
                }, summaryCfg));

                grid = new Ext.grid.Panel(Ext.apply({
                    store: store,
                    columns: [{
                        itemId: 'studentColumn',
                        dataIndex: 'student',
                        locked: withLocking,
                        flex: withLocking ? undefined : 1,
                        width: withLocking ? 500 : undefined,
                        text: 'Name',
                        summaryType: 'count',
                        summaryRenderer: function (value, summaryData, field) {
                            params = arguments;
                            return Ext.String.format('{0} student{1}', value, value !== 1 ? 's' : '');
                        }
                    }, {
                        itemId: 'markColumn',
                        dataIndex: 'mark',
                        text: 'Mark',
                        summaryType: 'average',
                        hidden: hideMarkColumn
                    }],
                    width: 600,
                    height: 300,
                    features: summary,
                    renderTo: Ext.getBody()
                }, gridCfg));

                view = grid.view;
                selector = summary.summaryRowSelector;
                if (withLocking) {
                    lockedGrid = grid.lockedGrid;
                    lockedView = lockedGrid.view;
                    normalGrid = grid.normalGrid;
                    normalView = normalGrid.view;
                }
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

            afterEach(function () {
                // Undo the overrides.
                Ext.data.ProxyStore.prototype.load = proxyStoreLoad;

                grid = view = store = summary = params = Ext.destroy(grid);
                if (withLocking) {
                    lockedGrid = lockedView = normalGrid = normalView = null;
                }
            });

            function getSummary(theView) {
                theView = theView || view;
                return theView.el.down(selector, true) || null;
            }

            function getSummaryContent() {
                var s = '',
                    el;

                if (withLocking) {
                    s += getRowContent(lockedView);
                    s += getRowContent(normalView);
                } else {
                    s += getRowContent(view);
                }

                return s.replace(/\r\n?|\n/g, '').replace(/\s/g, '');
            }

            function getRowContent(view) {
                var el = getSummary(view),
                    s;

                if (el) {
                    s = el.textContent || el.innerText;
                }
                return s || '';
            }

            describe('init', function () {
                it('should give the item a default class', function () {
                    createGrid();
                    if (withLocking) {
                        expect(getSummary(lockedView)).toHaveCls(summary.summaryRowCls);
                        expect(getSummary(normalView)).toHaveCls(summary.summaryRowCls);
                    } else {
                        expect(getSummary()).toHaveCls(summary.summaryRowCls);
                    }
                });

                it('should respect configured value for summaryRowCls', function () {
                    var cls = 'utley';

                    createGrid(null, {
                        summaryRowCls: cls
                    });

                    if (withLocking) {
                        expect(getSummary(lockedView)).toHaveCls(cls);
                        expect(getSummary(normalView)).toHaveCls(cls);
                    } else {
                        expect(getSummary()).toHaveCls(cls);
                    }
                });
            });

            describe('No data', function() {
                it('should size the columns in the summary', function () {
                    var row;
                    createGrid(null, null, null, []);

                    // TableLayout should also flush when no data, just summary rows.
                    if (withLocking) {
                        row = getSummary(lockedView);
                        expect(row.childNodes[0].offsetWidth).toBe(500);

                        row = getSummary(normalView);
                        expect(row.childNodes[0].offsetWidth).toBe(100);
                    } else {
                        row = getSummary();
                        expect(row.childNodes[0].offsetWidth).toBe(498);
                        expect(row.childNodes[1].offsetWidth).toBe(100);
                    }
                });
            });

            describe('summaryRenderer', function () {
                it("should render a column's summary on show of the column", function() {
                    hideMarkColumn = true;
                    createGrid();
                    hideMarkColumn = false;

                    // Only one column, so only that column's summary shown
                    expect(getSummaryContent()).toBe('4students');

                    // When the Mark column is shown, that column's summary should be shown
                    grid.getColumnManager().getColumns()[1].show();
                    expect(getSummaryContent()).toBe('4students80');
                });
                
                it('should be passed the expected function parameters', function () {
                    createGrid();

                    // Params should be:
                    //     value - The calculated value.
                    //     summaryData - Contains all raw summary values for the row.
                    //     field - The name of the field we are calculating
                    //     metaData - The collection of metadata about the current cell.
                    expect(params.length).toBe(4);
                    expect(params[0]).toBe(4);
                    expect(params[1]).toEqual(withLocking ? {
                        studentColumn: 4
                    } : {
                        studentColumn: 4,
                        markColumn: 80
                    });
                    expect(params[2]).toBe('student');
                    expect(params[3].tdCls).toBeDefined();
                });

                it('should not blow out the table cell if the value returned from the renderer is bigger than the allotted width', function () {
                    createGrid({
                        columns: [{
                            itemId: 'studentColumn',
                            dataIndex: 'student',
                            text: 'Name',
                            locked: withLocking,
                            width: 200,
                            summaryType: 'count',
                            summaryRenderer: function (value, summaryData, field) {
                                return 'Lily Rupert Utley Molly Pete';
                            }
                        }, {
                            itemId: 'markColumn',
                            dataIndex: 'mark',
                            text: 'Mark',
                            summaryType: 'average'
                        }]
                    });

                    var rec = store.getAt(0);
                    // For the comparison, just grab the first table cell in the view and compare it to the first table cell within the feature.
                    if (withLocking) {
                        expect(getSummary(lockedView).firstChild.offsetWidth).toBe(lockedView.getCell(rec, grid.down('#studentColumn')).dom.offsetWidth);
                        expect(getSummary(normalView).firstChild.offsetWidth).toBe(normalView.getCell(rec, grid.down('#markColumn')).dom.offsetWidth);
                    } else {
                        expect(getSummary().firstChild.offsetWidth).toBe(view.getCell(rec, grid.down('#studentColumn')).dom.offsetWidth);
                        expect(getSummary().lastChild.offsetWidth).toBe(view.getCell(rec, grid.down('#markColumn')).dom.offsetWidth);
                    }
                });
            });

            describe('no summaryRenderer', function () {
                it('should display the summary result', function () {
                    createGrid({
                        columns: [{
                            id: 'markColumn',
                            dataIndex: 'mark',
                            locked: withLocking,
                            text: 'Mark',
                            summaryType: 'average'
                        }, {
                            dataIndex: 'mark',
                            text: 'Mark',
                            summaryType: 'average'
                        }]
                    });

                    expect(getSummaryContent()).toBe('8080');
                });
            });

            // These aren't great tests, but there isn't really an API for these things
            describe("dock", function() {
                it("should dock top under the headers", function() {
                    createGrid(null, {
                        dock: 'top'
                    });
                    if (withLocking) {
                        expect(lockedGrid.getDockedItems()[1]).toBe(summary.summaryBar);
                        expect(normalGrid.getDockedItems()[1]).toBe(normalGrid.features[0].summaryBar);
                    } else {
                        expect(grid.getDockedItems()[1]).toBe(summary.summaryBar);
                    }
                });

                it("should dock at the bottom under the headers", function() {
                    var item;
                    createGrid(null, {
                        dock: 'bottom'
                    });

                    if (withLocking) {
                        item = lockedGrid.getDockedItems()[1];
                        expect(item).toBe(summary.summaryBar);
                        expect(item.dock).toBe('bottom');

                        item = normalGrid.getDockedItems()[1];
                        expect(item).toBe(normalGrid.features[0].summaryBar);
                        expect(item.dock).toBe('bottom');
                    } else {
                        item = grid.getDockedItems()[1];
                        expect(item).toBe(summary.summaryBar);
                        expect(item.dock).toBe('bottom');
                    }
                });
            });

            describe("toggling the summary row", function() {
                function toggle(visible) {
                    summary.toggleSummaryRow(visible);
                }

                describe("without docking", function() {
                    function expectVisible(visible) {
                        if (withLocking) {
                            if (visible) {
                                expect(getSummary(lockedView)).not.toBeNull();
                                expect(getSummary(normalView)).not.toBeNull();
                            } else {
                                expect(getSummary(lockedView)).toBeNull();
                                expect(getSummary(normalView)).toBeNull();
                            }
                        } else {
                            if (visible) {
                                expect(getSummary()).not.toBeNull();
                            } else {
                                expect(getSummary()).toBeNull();
                            }
                        }
                    }

                    it("should show the summary row by default", function() {
                        createGrid();
                        expectVisible(true);
                    });

                    it("should not render the summary rows if configured with showSummaryRow: false", function() {
                        createGrid(null, {
                            showSummaryRow: false
                        });
                        expectVisible(false);
                    });

                    it("should not show summary rows when toggling off", function() {
                        createGrid();
                        expectVisible(true);
                        toggle();
                        expectVisible(false);
                    });

                    it("should show summary rows when toggling on", function() {
                        createGrid(null, {
                            showSummaryRow: false
                        });
                        expectVisible(false);
                        toggle();
                        expectVisible(true);
                    });

                    it("should leave the summary visible when explicitly passing visible: true", function() {
                        createGrid();
                        toggle(true);
                        expectVisible(true);
                    });

                    it("should leave the summary off when explicitly passed visible: false", function() {
                        createGrid();
                        toggle();
                        toggle(false);
                        expectVisible(false);
                    });

                    it("should update the summary row if the change happened while not visible", function() {
                        var cellSelector, cell, content;

                        createGrid();
                        // Off
                        toggle();
                        store.first().set('mark', 0);
                        toggle();


                        cellSelector = grid.down('#markColumn').getCellSelector();
                        if (withLocking) {
                            cell = Ext.fly(getSummary(normalView)).down(cellSelector);
                            content = cell.down(normalView.innerSelector).dom.innerHTML;
                        } else {
                            cell = Ext.fly(getSummary()).down(cellSelector);
                            content = cell.down(view.innerSelector).dom.innerHTML;
                        }

                        expect(content).toBe('59');
                    });
                });

                describe("with docking", function() {
                    it("should show the summary row by default", function() {
                        createGrid(null, {
                            dock: 'top'
                        });
                        expect(summary.getSummaryBar().isVisible()).toBe(true);
                    });

                    it("should not render the summary rows if configured with showSummaryRow: false", function() {
                        createGrid(null, {
                            dock: 'top',
                            showSummaryRow: false
                        });
                        expect(summary.getSummaryBar().isVisible()).toBe(false);
                    });

                    it("should not show summary rows when toggling off", function() {
                        createGrid(null, {
                            dock: 'top'
                        });
                        expect(summary.getSummaryBar().isVisible()).toBe(true);
                        toggle();
                        expect(summary.getSummaryBar().isVisible()).toBe(false);
                    });

                    it("should show summary rows when toggling on", function() {
                        createGrid(null, {
                            dock: 'top',
                            showSummaryRow: false
                        });
                        expect(summary.getSummaryBar().isVisible()).toBe(false);
                        toggle();
                        expect(summary.getSummaryBar().isVisible()).toBe(true);
                    });

                    it("should leave the summary visible when explicitly passing visible: true", function() {
                        createGrid(null, {
                            dock: 'top'
                        });
                        toggle(true);
                        expect(summary.getSummaryBar().isVisible()).toBe(true);
                    });

                    it("should leave the summary off when explicitly passed visible: false", function() {
                        createGrid(null, {
                            dock: 'top'
                        });
                        toggle();
                        toggle(false);
                        expect(summary.getSummaryBar().isVisible()).toBe(false);
                    });

                    it("should update the summary row when if the change happened while not visible and docked", function() {
                        var cellSelector, cell, content;

                        createGrid(null, {
                            dock: 'top'
                        });
                        // Off
                        toggle();
                        store.first().set('mark', 0);
                        toggle();

                        cellSelector = grid.down('#markColumn').getCellSelector();
                        if (withLocking) {
                            cell = normalGrid.features[0].summaryBar.getEl().down(cellSelector);
                            content = cell.down(normalView.innerSelector).dom.innerHTML;
                        } else {
                            cell = summary.summaryBar.getEl().down(cellSelector);
                            content = cell.down(grid.getView().innerSelector).dom.innerHTML;
                        }
                        
                        expect(content).toBe('59');
                    });
                });
            });
            
            describe('calculated fields', function() {
                it('should work', function() {
                    createGrid({
                        // put calculated column first, so that when the priceEx is set in the summary record
                        // we test that this dependent field is NOT updated
                        columns: [{
                            locked: withLocking,
                            text: 'Price inc',
                            dataIndex: 'priceInc',
                            summaryType: 'sum',
                            formatter: 'number("0.00")',
                            summaryFormatter: 'number("0.00")'
                        }, {
                            text: 'Name',
                            dataIndex: 'text',
                            summaryType: 'none'
                        }, {
                            text: 'Price ex',
                            dataIndex: 'priceEx',
                            summaryType: 'sum'
                        }]
                    }, null, {
                        fields: [{
                            name: 'text',
                            type: 'string'
                        }, {
                            name: 'priceEx',
                            type: 'float'
                        }, {
                            name: 'vat',
                            type: 'float'
                        }, {
                            name: 'priceInc',
                            calculate: function(data) {
                                return data.priceEx * data.vat;
                            },
                            type: 'float'
                        }],
                        data: [{
                            text: 'Foo',
                            priceEx: 100,
                            vat: 1.1
                        }, {
                            text: 'Bar',
                            priceEx: 200,
                            vat: 1.25
                        }, {
                            text: 'Gah',
                            priceEx: 150,
                            vat: 1.25
                        }, {
                            text: 'Meh',
                            priceEx: 99,
                            vat: 1.3
                        }, {
                            text: 'Muh',
                            priceEx: 80,
                            vat: 1.4
                        }]
                    });

                    expect(getSummaryContent()).toBe('788.20629');
                });
            });

            describe('remoteRoot', function () {
                function completeWithData(data) {
                    Ext.Ajax.mockComplete({
                        status: 200,
                        responseText: Ext.JSON.encode(data)
                    });
                }

                beforeEach(function () {
                    MockAjaxManager.addMethods();

                    createGrid(null, {
                        remoteRoot: 'summaryData'
                    }, {
                        remoteSort: true,
                        proxy: {
                            type: 'ajax',
                            url: 'data.json',
                            reader: {
                                type: 'json',
                                rootProperty: 'data'
                            }
                        },
                        grouper: {property: 'student'},
                        data: null
                    });

                    store.load();
                    store.flushLoad();

                    completeWithData({
                        data: data,
                        summaryData: {
                            mark: 42,
                            student: 15
                        },
                        total: 4
                    });
                });

                afterEach(function () {
                    MockAjaxManager.removeMethods();
                });

                it('should correctly render the data in the view', function () {
                    expect(getSummaryContent()).toBe('15students42');
                });

                it('should create a summaryRecord', function () {
                    var record = summary.summaryRecord;

                    expect(record.isModel).toBe(true);
                    expect(record.get('mark')).toBe(42);
                    expect(record.get('student')).toBe(15);
                });
            });

            describe("reacting to store changes", function() {
                function expectContent(dock, expected) {
                    var content;

                    if (dock) {
                        if (withLocking) {
                            content = extractContent(summary.summaryBar, lockedView);
                            content += extractContent(normalGrid.features[0].summaryBar, normalView);
                        } else {
                            content = extractContent(summary.summaryBar);
                        }
                    } else {
                        content = getSummaryContent();
                    }

                    expect(content).toBe(expected);
                }

                function extractContent(bar, theView) {
                    theView = theView || view;
                    var content = '';

                    Ext.Array.forEach(bar.el.query(theView.innerSelector), function(node) {
                        content += node.textContent || node.innerText || '';
                    });
                    return content.replace(/\s/g, '');
                }

                describe("before being rendered", function() {
                    function beforeRenderSuite(withDocking) {
                        describe(withDocking ? "with docking" : "without docking", function() {
                            beforeEach(function() {
                                createGrid({
                                    renderTo: null
                                }, {
                                    dock: withDocking ? 'top' : null
                                });
                            });

                            it("should not cause an exception on update", function() {
                                expect(function() {
                                    store.getAt(0).set('mark', 100);
                                }).not.toThrow();
                            });

                            it("should not cause an exception on add", function() {
                                expect(function() {
                                    store.add({
                                        student: 'Student 5',
                                        subject: 'Math',
                                        mark: 10
                                    });
                                }).not.toThrow();
                            });

                            it("should not cause an exception on remove", function() {
                                expect(function() {
                                    store.removeAt(3);
                                }).not.toThrow();
                            });

                            it("should not cause an exception on removeAll", function() {
                                expect(function() {
                                    store.removeAll();
                                }).not.toThrow();
                            });

                            it("should not cause an exception on load of new data", function() {
                                expect(function() {
                                    store.loadData([{
                                        student: 'Foo',
                                        mark: 75
                                    }, {
                                        student: 'Bar',
                                        mark: 25
                                    }]);
                                }).not.toThrow();
                            });
                        });
                    }
                    beforeRenderSuite(false);
                    beforeRenderSuite(true);
                });

                describe("original store", function() {
                    function makeOriginalStoreSuite(withDocking) {
                        describe(withDocking ? "with docking" : "without docking", function() {
                            beforeEach(function() {
                                createGrid(null, {
                                    dock: withDocking ? 'top' : null
                                });
                            });

                            it("should react to an update", function() {
                                store.getAt(0).set('mark', 100);
                                expectContent(withDocking, '4students84');
                            });

                            it("should react to an add", function() {
                                store.add({
                                    student: 'Student 5',
                                    subject: 'Math',
                                    mark: 10
                                });
                                expectContent(withDocking, '5students66');
                            });

                            it("should react to a remove", function() {
                                store.removeAt(3);
                                expectContent(withDocking, '3students84');
                            });

                            it("should react to a removeAll", function() {
                                store.removeAll();
                                expectContent(withDocking, '0students0');
                            });

                            it("should react to a load of new data", function() {
                                store.loadData([{
                                    student: 'Foo',
                                    mark: 75
                                }, {
                                    student: 'Bar',
                                    mark: 25
                                }]);
                                expectContent(withDocking, '2students50');
                            });
                        });
                    }
                    makeOriginalStoreSuite(false);
                    makeOriginalStoreSuite(true);
                });

                describe("reconfigured store", function() {
                    function makeReconfigureSuite(withDocking) {
                        describe(withDocking ? "with docking" : "without docking", function() {
                            beforeEach(function() {
                                createGrid(null, {
                                    dock: withDocking ? 'top' : null
                                });
                                var oldStore = store;
                                store = new Ext.data.Store({
                                    fields: ['student', 'subject', {
                                        name: 'mark',
                                        type: 'int'
                                    }],
                                    data: [{
                                        student: 'Student 1',
                                        mark: 30
                                    }, {
                                        student: 'Student 2',
                                        mark: 50
                                    }],
                                    autoDestroy: true
                                });
                                grid.reconfigure(store);
                                oldStore.destroy();
                            });

                            it("should react to an update", function() {
                                store.getAt(0).set('mark', 100);
                                expectContent(withDocking, '2students75');
                            });

                            it("should react to an add", function() {
                                store.add({
                                    student: 'Student 3',
                                    mark: 10
                                });
                                expectContent(withDocking, '3students30');
                            });

                            it("should react to a remove", function() {
                                store.removeAt(0);
                                expectContent(withDocking, '1student50');
                            });

                            it("should react to a removeAll", function() {
                                store.removeAll();
                                expectContent(withDocking, '0students0');
                            });

                            it("should react to a load of new data", function() {
                                store.loadData([{
                                    student: 'Foo',
                                    mark: 75
                                }, {
                                    student: 'Bar',
                                    mark: 25
                                }]);
                                expectContent(withDocking, '2students50');
                            });
                        });
                    }
                    makeReconfigureSuite(false);
                    makeReconfigureSuite(true);
                });
            });

            describe("buffered rendering", function() {
                it("should not render the summary row until the last row is in the view", function() {

                    var data = [],
                        i;

                    for (i = 1; i <= 1000; ++i) {
                        data.push({
                            id: i,
                            student: 'Student ' + i,
                            subject: (i % 2 === 0) ? 'Math' : 'Science',
                            mark: i % 100
                        });
                    }

                    createGrid({
                        bufferedRenderer: true
                    }, null, null, data);

                    var theView = withLocking ? lockedView : view;

                    expect(theView.getEl().down(selector)).toBeNull();

                    // Scroll downwards 100px at a time
                    // While the last row is not present, there should be no summary el.
                    // As soon as it is present, check that the summary is there and quit.
                    waitsFor(function() {
                        grid.scrollByDeltaY(100);
                        if (view.all.endIndex === store.getCount() - 1) {
                            expect(theView.getEl().down(selector)).not.toBeNull();
                            return true;
                        }
                        expect(theView.getEl().down(selector)).toBeNull();
                    });
                });
            });
        });
    }

    makeSuite(false);
    makeSuite(true);
});
