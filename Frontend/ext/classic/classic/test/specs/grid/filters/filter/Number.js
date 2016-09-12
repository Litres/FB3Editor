describe('Ext.grid.filters.filter.Number', function () {
    var grid, store, plugin, columnFilter, headerCt, menu, rootMenuItem,
        synchronousLoad = true,
        proxyStoreLoad = Ext.data.ProxyStore.prototype.load,
        loadStore;

    function createGrid(listCfg, storeCfg, gridCfg) {
        synchronousLoad = false;
        store = new Ext.data.Store(Ext.apply({
            fields:['name', 'email', 'phone'],
            data: [
                { name: 'Lisa',  email: 'lisa@simpsons.com',  phone: '555-111-1224', age: 14  },
                { name: 'Bart',  email: 'bart@simpsons.com',  phone: '555-222-1234', age: 12  },
                { name: 'Homer', email: 'homer@simpsons.com', phone: '555-222-1244', age: 44  },
                { name: 'Marge', email: 'marge@simpsons.com', phone: '555-222-1254', age: 42  }
            ]
        }, storeCfg));

        grid = new Ext.grid.Panel(Ext.apply({
            title: 'Simpsons',
            store: store,
            autoLoad: true,
            columns: [{
                dataIndex: 'name',
                width: 100
            }, {
                dataIndex: 'email',
                width: 100
            }, {
                dataIndex: 'phone',
                width: 100,
                hidden: true
            }, {
                dataIndex: 'age',
                filter: Ext.apply({
                    type: 'number',
                    updateBuffer: 0
                }, listCfg),
                width: 100
            }],

            // We need programmatic mouseover events to be handled inline so we can test effects.
            viewConfig: {
                mouseOverOutBuffer: false,
                deferHighlight: false
            },
            plugins: [{
                ptype: 'gridfilters'
            }],
            height: 200,
            width: 400,
            renderTo: Ext.getBody()
        }, gridCfg));

        columnFilter = grid.columnManager.getHeaderByDataIndex('age').filter;
        plugin = grid.filters;
        synchronousLoad = true;
        store.flushLoad();
    }

    function showMenu() {
        var header = grid.getColumnManager().getLast();

        // Show the grid menu.
        headerCt = grid.headerCt;
        headerCt.showMenuBy(null, header.triggerEl.dom, header);

        // Show the filter menu.
        rootMenuItem = headerCt.menu.items.last();
        rootMenuItem.activated = true;
        rootMenuItem.expandMenu(null, 0);

        menu = rootMenuItem.menu;
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

        store.destroy();
        grid = store = plugin = columnFilter = menu = headerCt = rootMenuItem = Ext.destroy(grid);
    });

    describe('init', function () {
        it('should add a menu separator to the menu', function () {
            createGrid();
            showMenu();

            expect(menu.down('menuseparator')).not.toBeNull();
        });
    });

    describe('setValue', function () {
        it('should filter the store regardless of whether the menu has been created', function () {
            createGrid();

            expect(store.data.length).toBe(4);
            columnFilter.setValue({eq: 44});
            expect(store.data.length).toBe(1);
        });

        describe("0", function() {
            beforeEach(function() {
                createGrid();
                columnFilter.createMenu();
            });

            it("should accept 0 for lt", function() {
                columnFilter.setValue({
                    lt: 0
                });
                var filter = store.getFilters().first();
                expect(filter.getOperator()).toBe('lt');
                expect(filter.getValue()).toBe(0);
            });

            it("should accept 0 for eq", function() {
                columnFilter.setValue({
                    eq: 0
                });
                var filter = store.getFilters().first();
                expect(filter.getOperator()).toBe('eq');
                expect(filter.getValue()).toBe(0);
            });

            it("should accept 0 for gt", function() {
                columnFilter.setValue({
                    gt: 0
                });
                var filter = store.getFilters().first();
                expect(filter.getOperator()).toBe('gt');
                expect(filter.getValue()).toBe(0);
            });
        });
    });

    describe('events', function () {
        describe('keyup', function () {
            it('should hide the menu', function () {
                var field;

                createGrid();
                showMenu();

                field = columnFilter.fields.eq;
                field.setValue(5);
                jasmine.fireKeyEvent(field.inputEl, 'keyup', 13);

                waitsFor(function() {
                    return menu.hidden;
                });

                runs(function () {
                    expect(menu.hidden).toBe(true);
                });
            });
        });
    });

    describe('updateBuffer', function () {
        // NOTE that teses tests were failing randomly, almost exclusively on older builds of
        // FF and older IE, with times coming in anywhere from 50 - 100 ms below the expected
        // thresholds.  Because of this, we're going to set our expectations even lower for
        // these browsers (haha i made a joke).
        var field, ms, startTime, endTime;

        beforeEach(function () {
            spyOn(Ext.grid.filters.filter.Number.prototype, 'setValue').andCallFake(function () {
                endTime = new Date().getTime();
            });
        });

        afterEach(function () {
            field = ms = startTime = endTime = null;
        });

        it('should default to 500ms', function () {
            ms = 500;

            expect(ms).toBe(Ext.grid.filters.filter.Base.prototype.config.updateBuffer);

            createGrid({
                updateBuffer: ms
            });
            showMenu();

            field = columnFilter.fields.eq;
            startTime = new Date().getTime();
            jasmine.fireKeyEvent(field.inputEl, 'keyup', 83);

            waitsFor(function () {
                return endTime;
            });

            runs(function () {
                expect(endTime - startTime).toBeAtLeast(ms - 100);
            });
        });

        it('should honor a configured updateBuffer', function () {
            // Let's choose something well below the default and then just check to make
            // sure that's it's less than the default. This is safe since we don't know
            // exactly when the callback will be fired, but it still demonstrates that
            // the updateBuffer config is variable.
            ms = 250;
            createGrid({
                updateBuffer: ms
            });

            expect(columnFilter.getUpdateBuffer()).toBe(ms);
            showMenu();

            field = columnFilter.fields.eq;
            startTime = new Date().getTime();
            jasmine.fireKeyEvent(field.inputEl, 'keyup', 83);

            waitsFor(function () {
                return endTime;
            });

            runs(function () {
                var timer = (endTime - startTime);

                expect(endTime - startTime).toBeAtLeast(ms - 100);
                expect(timer).toBeLE(Ext.grid.filters.filter.Base.prototype.config.updateBuffer);
            });
        });
    });

    describe('showing the menu', function () {
        function setActive(state) {
            it('should not add a filter to the store when shown', function () {
                createGrid({
                    active: state,
                    value: [{
                        on: new Date()
                    }]
                });

                spyOn(columnFilter, 'addStoreFilter');

                showMenu();
                expect(columnFilter.addStoreFilter).not.toHaveBeenCalled();
            });
        }

        setActive(true);
        setActive(false);
    });

    describe('clearing filters', function () {
        it('should not recheck the root menu item ("Filters") when showing menu after clearing filters', function () {
            createGrid();
            showMenu();

            columnFilter.setValue({eq: 44});
            expect(rootMenuItem.checked).toBe(true);

            // Now, let's hide the menu and clear the filters, which will deactivate all the filters.
            // Note that it's not enough to check the root menu item's checked state, we must show the menu again.
            headerCt.getMenu().hide();
            plugin.clearFilters();
            showMenu();

            expect(rootMenuItem.checked).toBe(false);
        });
    });

    describe('entering invalid text', function () {
        it('should not add a store filter and activate the filter', function () {
            var field, filterCollection;

            createGrid();
            showMenu();

            filterCollection = grid.getStore().getFilters();
            field = columnFilter.fields.lt;

            // Sanity.
            expect(filterCollection.length).toBe(0);
            expect(columnFilter.active).toBe(false);

            // Simulate a paste.
            field.setRawValue('invalid text');
            // Simulate C-v.
            jasmine.fireKeyEvent(field.inputEl.dom, 'keyup', 86, null, true);

            expect(filterCollection.length).toBe(0);
            expect(columnFilter.active).toBe(false);
        });
    });

    describe('the UI and the active state', function () {
        function setActive(active) {
            describe('when ' + active, function () {
                var maybe = !active ? 'not' : '';

                it('should ' + maybe + ' check the Filters menu item', function () {
                    createGrid({
                        active: active
                    });

                    showMenu();

                    expect(rootMenuItem.checked).toBe(active);
                });

                it('should set any field values that map to a configured value', function () {
                    var fields;

                    createGrid({
                        active: active,
                        value: {
                            gt: 10,
                            lt: 20
                        }
                    });

                    showMenu();
                    fields = columnFilter.fields;

                    expect(fields.gt.inputEl.getValue()).toBe('10');
                    expect(fields.lt.inputEl.getValue()).toBe('20');
                    expect(fields.eq.inputEl.getValue()).toBe(Ext.supports.Placeholder ? '' : 'Enter Number...');
                });

                describe('when a store filter is created', function () {
                    it('should not update the filter collection twice', function () {
                        var called = 0;

                        createGrid({
                            active: active
                        }, {
                            listeners: {
                                filterchange: function () {
                                    ++called;
                                }
                            }
                        });

                        showMenu();
                        columnFilter.setValue({
                            eq: 5
                        });

                        expect(called).toBe(1);
                    });
                });
            });
        }

        setActive(true);
        setActive(false);
    });

    describe('activate and deactivate', function () {
        describe('activating', function () {
            describe('when activating after instantiation', function () {
                function runTest(val) {
                    it('should work for both truthy and falsey values', function () {
                        var len;

                        createGrid({
                            active: false,
                            value: {
                                eq: val
                            }
                        });

                        len = store.data.length;
                        showMenu();
                        expect(store.data.length).toBe(len);

                        columnFilter.setActive(true);

                        expect(store.data.length).toBe(0);
                    });
                }

                runTest(0);
                runTest(5);
            });

            describe('when toggling', function () {
                function runTest(val) {
                    it('should work for both truthy and falsey values', function () {
                        createGrid();

                        showMenu();

                        columnFilter.setValue({
                            eq: val
                        });

                        columnFilter.setActive(false);
                        columnFilter.setActive(true);

                        expect(store.data.length).toBe(0);
                    });
                }

                runTest(0);
                runTest(5);
            });
        });

        describe('deactivating', function () {
            describe('when deactivating after instantiation', function () {
                function runTest(val) {
                    it('should work for both truthy and falsey values', function () {
                        var len;

                        createGrid({
                            value: {
                                eq: val
                            }
                        });

                        showMenu();
                        expect(store.data.length).toBe(0);

                        columnFilter.setActive(false);

                        expect(store.data.length > 0).toBe(true);
                    });
                }

                runTest(0);
                runTest(5);
            });

            describe('when toggling', function () {
                function runTest(val) {
                    it('should work for both truthy and falsey values', function () {
                        var len;

                        createGrid();

                        len = store.data.length;
                        showMenu();

                        columnFilter.setValue({
                            eq: val
                        });

                        expect(store.data.length).toBe(0);

                        columnFilter.setActive(false);

                        expect(store.data.length).toBe(len);
                    });
                }

                runTest(0);
                runTest(5);
            });
        });
    });
});

