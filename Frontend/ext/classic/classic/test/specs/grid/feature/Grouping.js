describe('Ext.grid.feature.Grouping', function () {
    var grid, view, store, menu, schema, groupingFeature,
        synchronousLoad = true,
        proxyStoreLoad = Ext.data.ProxyStore.prototype.load,
        loadStore;

    function completeWithData(data) {
        Ext.Ajax.mockComplete({
            status: 200,
            responseText: Ext.JSON.encode(data)
        });
    }

    function makeGrid(storeCfg, featureCfg, gridCfg) {
        synchronousLoad = false;
        grid = new Ext.grid.Panel(Ext.apply({
            renderTo: Ext.getBody(),
            store: new Ext.data.Store(Ext.apply({
                model: spec.Restaurant,
                data : []
            }, storeCfg)),
            width: 200,
            height: 200,
            features: [Ext.apply({
                ftype: 'grouping'
            }, featureCfg)],
            columns: [{
                text: 'Name',
                dataIndex: 'name'
            }, {
                text: 'Cuisine',
                dataIndex: 'cuisine'
            }]
        }, gridCfg));

        store = grid.store;
        view = grid.view;
        groupingFeature = view.summaryFeature;
        synchronousLoad = true;
        store.flushLoad();
    }

    function clickItem(itemId, column) {
        var item;

        showMenu(column);
        item = getMenu().down('#' + itemId);
        jasmine.fireMouseEvent(item.el, 'click');
    }

    function getMenu() {
        return (menu = grid.headerCt.getMenu());
    }

    function getRec(index) {
        return store.getAt(index);
    }

    function findCell(rowIdx, cellIdx) {
        return grid.getView().getCellInclusive({
            row: rowIdx,
            column: cellIdx
        }, true);
    }

    function showMenu(column) {
        var headerCt = grid.headerCt;

        column = column || grid.visibleColumnManager.getColumns()[0];
        headerCt.showMenuBy(null, column.triggerEl, column);
        menu = headerCt.menu;
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
        MockAjaxManager.addMethods();
        // Override so that we can control asynchronous loading
        loadStore = Ext.data.ProxyStore.prototype.load = function() {
            proxyStoreLoad.apply(this, arguments);
            if (synchronousLoad) {
                this.flushLoad.apply(this, arguments);
            }
            return this;
        };

        schema = Ext.data.Model.schema;
        Ext.define('spec.Restaurant', {
            extend: 'Ext.data.Model',
            fields: ['name', 'cuisine']
        });
    });

    afterEach(function(){
        MockAjaxManager.removeMethods();

        // Undo the overrides.
        Ext.data.ProxyStore.prototype.load = proxyStoreLoad;

        Ext.undefine('spec.Restaurant');
        schema.clear(true);
        grid = view = store = menu = schema = groupingFeature = Ext.destroy(grid);
    });

    describe('init', function () {
        it("should have the show in groups header unchecked when there's no groupField", function() {
            grid = new Ext.grid.Panel({
                renderTo : Ext.getBody(),
                store : new Ext.data.Store({
                    model: spec.Restaurant,
                    data : []
                }),
                width : 200,
                height : 200,
                title : 'Restaurants',
                features : {ftype: 'grouping'},
                columns : [{
                    text : 'Name',
                    dataIndex : 'name'
                }, {
                    text : 'Cuisine',
                    dataIndex : 'cuisine'
                }]
            });

            expect(grid.headerCt.getMenu().child('#groupToggleMenuItem').checked).toBe(false);
        });

        it("should have the show in groups header checked when there's a groupField", function() {
            grid = new Ext.grid.Panel({
                renderTo : Ext.getBody(),
                store : new Ext.data.Store({
                    model: spec.Restaurant,
                    groupField: 'cuisine',
                    data : []
                }),
                width : 200,
                height : 200,
                title : 'Restaurants',
                features : {ftype: 'grouping'},
                columns : [{
                    text : 'Name',
                    dataIndex : 'name'
                }, {
                    text : 'Cuisine',
                    dataIndex : 'cuisine'
                }]
            });

            expect(grid.headerCt.getMenu().child('#groupToggleMenuItem').checked).toBe(true);

        });

        it("should retain the direction when grouping is disabled then enabled", function() {
            var groupingFeature = Ext.create('Ext.grid.feature.Grouping', {}),
                viewRefreshed = false;

            grid = new Ext.grid.Panel({
                renderTo : Ext.getBody(),
                store : new Ext.data.Store({
                    model: spec.Restaurant,
                    groupField: 'cuisine',
                    groupDir: 'DESC',
                    data : [
                        { name: "Beardog's",     cuisine: "Home cooking"},
                        { name: "World Service", cuisine: "Poncy"}
                    ]
                }),
                width : 200,
                height : 200,
                title : 'Restaurants',
                features : [groupingFeature],
                columns : [{
                    text : 'Name',
                    dataIndex : 'name'
                }, {
                    text : 'Cuisine',
                    dataIndex : 'cuisine'
                }]
            });

            expect(grid.store.getAt(0).get('cuisine')).toEqual('Poncy');
            expect(grid.store.getAt(1).get('cuisine')).toEqual('Home cooking');

            grid.view.on({
                refresh: function() {
                    viewRefreshed = true;
                },
                single: true
            });
            groupingFeature.disable();

            // Grouping disable should cause view refresh when local sorting.
            expect(viewRefreshed).toBe(true);

            // Order should not have changed.
            expect(grid.store.getAt(0).get('cuisine')).toEqual('Poncy');
            expect(grid.store.getAt(1).get('cuisine')).toEqual('Home cooking');

            groupingFeature.enable();

            // Re-enabling grouping after disabling should preserve the grouping order as DESC
            // https://sencha.jira.com/browse/EXTJS-10361: used to only preserve field, and introduce default ASC.
            expect(grid.store.getAt(0).get('cuisine')).toEqual('Poncy');
            expect(grid.store.getAt(1).get('cuisine')).toEqual('Home cooking');
        });

        it("should clear groupers when the feature is configured as disabled", function(){
            grid = new Ext.grid.Panel({
                renderTo : Ext.getBody(),
                store : new Ext.data.Store({
                    model: spec.Restaurant,
                    groupField: 'cuisine',
                    data : []
                }),
                width : 200,
                height : 200,
                features : [new Ext.grid.feature.Grouping({
                    disabled: true
                })],
                columns : [{
                    text : 'Name',
                    dataIndex : 'name'
                }, {
                    text : 'Cuisine',
                    dataIndex : 'cuisine'
                }]
            });

            expect(grid.getStore().getGrouper()).toBeNull();
        });

        it("should disable the show in groups header when the feature is configured as disabled", function(){
            grid = new Ext.grid.Panel({
                renderTo : Ext.getBody(),
                store : new Ext.data.Store({
                    model: spec.Restaurant,
                    groupField: 'cuisine',
                    data : []
                }),
                width : 200,
                height : 200,
                features : [new Ext.grid.feature.Grouping({
                    disabled: true
                })],
                columns : [{
                    text : 'Name',
                    dataIndex : 'name'
                }, {
                    text : 'Cuisine',
                    dataIndex : 'cuisine'
                }]
            });
            var header = grid.headerCt.items.getAt(0);
            grid.headerCt.showMenuBy(null, header.triggerEl, header);
            expect(grid.headerCt.getMenu().child('#groupToggleMenuItem').isDisabled()).toBe(true);
        });

        describe('view.isGrouping property', function () {
            it('should be set on the view if `groupField` is configured', function () {
                makeGrid({
                    groupField: 'cuisine'
                });

                expect(view.isGrouping).toBe(true);
            });

            it('should not be set on the view if `groupField` is not configured', function () {
                makeGrid();

                expect(view.isGrouping).toBe(false);
            });

            it('should be set on the view if `grouper` is configured', function () {
                makeGrid({
                    grouper: 'cuisine'
                });

                expect(view.isGrouping).toBe(true);
            });

            it('should not be set on the view if `grouper` is not configured', function () {
                makeGrid();

                expect(view.isGrouping).toBe(false);
            });
        });

        it('should not be collapsed', function () {
            makeGrid({
                data: [
                    { name: 'Germanicus', cuisine: 'Roman'},
                    { name: 'Alexander', cuisine: 'Greek'}
                ],
                groupField: 'cuisine'
            });

            expect(groupingFeature.getMetaGroup('Roman').isCollapsed).toBe(false);
            expect(groupingFeature.getMetaGroup('Greek').isCollapsed).toBe(false);
        });
    });

    describe('mouse interaction', function() {
        var lockedGrid,
            data = [
                {projectId: 100, project: 'Ext Forms: Field Anchoring', taskId: 112, description: 'Integrate 2.0 Forms with 2.0 Layouts', estimate: 6, rate: 150, due:'06/24/2007'},
                {projectId: 100, project: 'Ext Forms: Field Anchoring', taskId: 113, description: 'Implement AnchorLayout', estimate: 4, rate: 150, due:'06/25/2007'},
                {projectId: 100, project: 'Ext Forms: Field Anchoring', taskId: 114, description: 'Add support for multiple<br>types of anchors', estimate: 4, rate: 150, due:'06/27/2007'},
                {projectId: 100, project: 'Ext Forms: Field Anchoring', taskId: 115, description: 'Testing and debugging', estimate: 8, rate: 0, due:'06/29/2007'},
                {projectId: 101, project: 'Ext Grid: Single-level Grouping', taskId: 101, description: 'Add required rendering "hooks" to GridView', estimate: 6, rate: 100, due:'07/01/2007'},
                {projectId: 101, project: 'Ext Grid: Single-level Grouping', taskId: 102, description: 'Extend GridView and override rendering functions', estimate: 6, rate: 100, due:'07/03/2007'},
                {projectId: 101, project: 'Ext Grid: Single-level Grouping', taskId: 103, description: 'Extend Store with grouping functionality', estimate: 4, rate: 100, due:'07/04/2007'},
                {projectId: 101, project: 'Ext Grid: Single-level Grouping', taskId: 121, description: 'Default CSS Styling', estimate: 2, rate: 100, due:'07/05/2007'},
                {projectId: 101, project: 'Ext Grid: Single-level Grouping', taskId: 104, description: 'Testing and debugging', estimate: 6, rate: 100, due:'07/06/2007'},
                {projectId: 102, project: 'Ext Grid: Summary Rows', taskId: 105, description: 'Ext Grid plugin integration', estimate: 4, rate: 125, due:'07/01/2007'},
                {projectId: 102, project: 'Ext Grid: Summary Rows', taskId: 106, description: 'Summary creation during rendering phase', estimate: 4, rate: 125, due:'07/02/2007'},
                {projectId: 102, project: 'Ext Grid: Summary Rows', taskId: 107, description: 'Dynamic summary updates in editor grids', estimate: 6, rate: 125, due:'07/05/2007'},
                {projectId: 102, project: 'Ext Grid: Summary Rows', taskId: 108, description: 'Remote summary integration', estimate: 4, rate: 125, due:'07/05/2007'},
                {projectId: 102, project: 'Ext Grid: Summary Rows', taskId: 109, description: 'Summary renderers and calculators', estimate: 4, rate: 125, due:'07/06/2007'},
                {projectId: 102, project: 'Ext Grid: Summary Rows', taskId: 110, description: 'Integrate summaries with GroupingView', estimate: 10, rate: 125, due:'07/11/2007'},
                {projectId: 102, project: 'Ext Grid: Summary Rows', taskId: 111, description: 'Testing and debugging', estimate: 8, rate: 125, due:'07/15/2007'}
            ],
            lockedGridStore,
            showSummary,
            groupSummaryFeature,
            group,
            toggleGroupSummaries = function() {
                showSummary = !showSummary;
                var view = lockedGrid.lockedGrid.getView();
                view.getFeature('group').toggleSummaryRow(showSummary);
                view.refresh();
                view = lockedGrid.normalGrid.getView();
                view.getFeature('group').toggleSummaryRow(showSummary);
                view.refresh();
            },
            viewReady = false;

        afterEach(function() {
            lockedGrid.destroy();
            lockedGridStore.destroy();
            Ext.undefine('spec.Task');
            viewReady = false;
        });

        beforeEach(function() {
            Ext.define('spec.Task', {
                extend: 'Ext.data.Model',
                idProperty: 'taskId',
                fields: [
                    {name: 'projectId', type: 'int'},
                    {name: 'project', type: 'string'},
                    {name: 'taskId', type: 'int'},
                    {name: 'description', type: 'string'},
                    {name: 'estimate', type: 'float'},
                    {name: 'rate', type: 'float'},
                    {name: 'due', type: 'date', dateFormat:'m/d/Y'}
                ]
            });
            lockedGridStore = new Ext.data.Store({
                model: 'spec.Task',
                data: data,
                sorters: {property: 'due', direction: 'ASC'},
                groupField: 'project'
            });

            showSummary = true;
            lockedGrid = new Ext.grid.Panel({
                width: 800,
                height: 450,
                frame: true,
                title: 'Sponsored Projects',
                iconCls: 'icon-grid',
                renderTo: document.body,
                columnLines : true,
                store: lockedGridStore,
                features: [{
                    id: 'group',
                    ftype: 'groupingsummary',
                    groupHeaderTpl: '{name}',
                    hideGroupedHeader: true,
                    enableGroupingMenu: false
                }, {
                    ftype: 'summary',
                    dock: 'bottom'
                }],
                columns: [{
                    text: 'Task',
                    width: 300,
                    locked: true,
                    tdCls: 'task',
                    sortable: true,
                    dataIndex: 'description',

                    // This may have wrapped HTML which causes unpredictable row heights
                    variableRowHeight: true,
                    hideable: false,
                    summaryType: 'count',
                    summaryRenderer: function(value, summaryData, dataIndex) {
                        return ((value === 0 || value > 1) ? '(' + value + ' Tasks)' : '(1 Task)');
                    },
                    field: {
                        xtype: 'textfield'
                    }
                }, {
                    header: 'Project',
                    width: 180,
                    sortable: true,
                    dataIndex: 'project'
                }, {
                    header: 'Schedule',
                    columns: [{
                        header: 'Due Date',
                        width: 125,
                        sortable: true,
                        dataIndex: 'due',
                        summaryType: 'max',
                        renderer: Ext.util.Format.dateRenderer('m/d/Y'),
                        summaryRenderer: Ext.util.Format.dateRenderer('m/d/Y')
                    }, {
                        header: 'Estimate',
                        width: 125,
                        sortable: true,
                        dataIndex: 'estimate',
                        summaryType: 'sum',
                        renderer: function(value, metaData, record, rowIdx, colIdx, store, view){
                            return value + ' hours';
                        },
                        summaryRenderer: function(value, summaryData, dataIndex) {
                            return value + ' hours';
                        }
                    }, {
                        header: 'Rate',
                        width: 125,
                        sortable: true,
                        renderer: Ext.util.Format.usMoney,
                        summaryRenderer: Ext.util.Format.usMoney,
                        dataIndex: 'rate',
                        summaryType: 'average'
                    }, {
                        header: 'Cost',
                        width: 114,
                        flex: true,
                        sortable: false,
                        groupable: false,
                        renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                            return Ext.util.Format.usMoney(record.get('estimate') * record.get('rate'));
                        },
                        summaryType: function(records, values) {
                            var i = 0,
                                length = records.length,
                                total = 0,
                                record;

                            for (; i < length; ++i) {
                                record = records[i];
                                total += record.get('estimate') * record.get('rate');
                            }
                            return total;
                        },
                        summaryRenderer: Ext.util.Format.usMoney
                    }]
                }],
                viewConfig: {
                    listeners: {
                        viewready: function () {
                            viewReady = true;
                        }
                    }
                }
            });
            groupSummaryFeature = lockedGrid.lockedGrid.view.getFeature('group');
        });

        it('should disable grouping without throwing an error', function() {
            // There are TRs for the data rows and summary rows.
            // When disabled, there will be onlt TRs for the data rows
            var trCount = lockedGrid.normalGrid.getView().el.query('tr').length;

            // The normal side does NOT itself have variableRowHeight.
            // But because the locked side does, the normal side must inherit that.
            expect(lockedGrid.normalGrid.getView().hasVariableRowHeight()).toBe(true);

            // Should throw no errors
            groupSummaryFeature.disable();

            // Now there are fewer TRs because there are no summary rows.
            expect(lockedGrid.normalGrid.getView().el.query('tr').length).toBeLessThan(trCount);
        });

        // TODO: figure out why this spec doesn't work in IE.
        (Ext.isIE ? xit : it)('should respond to mouse events', function() {
            var headerCt,
                header;

            waitsFor(function() {
                return viewReady;
            });
            runs(function() {
                // Get the group which contains the first record and collapse it.
                group = groupSummaryFeature.getRecordGroup(lockedGrid.store.getAt(0));
                groupSummaryFeature.collapse(group.getGroupKey());

                // Fewer view items.
                expect(lockedGrid.normalGrid.view.all.getCount()).toBe(13);

                // Hide group summaries
                toggleGroupSummaries();

                // Move Due date to right side
                headerCt = lockedGrid.normalGrid.headerCt;
                header = headerCt.items.items[1];

                header.move(0, 3);

                // Grab the first record in the second group (first group being collapsed)
                var firstInGroup1 = lockedGrid.store.data.findBy(function(r){return r.data.description==='Add required rendering "hooks" to GridView';});

                var firstRowInGroup1 = lockedGrid.normalGrid.view.getNode(firstInGroup1);
                var dataRowOfFirstRowInGroup1 = lockedGrid.normalGrid.view.getRow(firstInGroup1);

                // The first row in group 1 is a wrapper which contains the group header, and then the first data row
                expect(Ext.fly(firstRowInGroup1).hasCls('x-grid-item')).toBe(true);
                expect(Ext.fly(firstRowInGroup1).hasCls('x-grid-item-alt')).toBe(true);

                // Extract the trimmed text content of the data row. Due date "07/01/2007" is now on the right"
                expect((dataRowOfFirstRowInGroup1.innerText || dataRowOfFirstRowInGroup1.textContent).replace(/\r/g,'').replace(/\n/g,'')).toEqual("6 hours$100.00$600.0007/01/2007");

                // Show group summaries
                toggleGroupSummaries();

                var collapsedGroup0Placeholder = lockedGrid.normalGrid.view.all.item(0).dom;
                expect(Ext.fly(collapsedGroup0Placeholder).hasCls('x-grid-item')).toBe(true);

                // Move Due date back to left side
                header.move(3, 0);
            });

            waits(50);

            runs(function() {
                var collapsedGroup0Placeholder = lockedGrid.normalGrid.view.all.item(0).dom;
                var group0SummaryRow = Ext.fly(collapsedGroup0Placeholder).down('tr.x-grid-row-summary', true);

                //Extract the text content of the summary row. The due date should have moved back to the left
                expect((group0SummaryRow.innerText || group0SummaryRow.textContent).replace(/\n/g,'').replace(/\r/g,'')).toBe("06/29/200722 hours$112.50$2,100.00");
            });
        });

        it('should collapse all other groups when CRTL/click on group header', function() {
            waitsFor(function() {
                return viewReady;
            });
            runs(function() {
                var grouping = lockedGrid.lockedGrid.view.findFeature('groupingsummary'),
                    groupStore = grouping.dataSource,
                    firstGroup = grouping.getGroup(lockedGridStore.getAt(0)),
                    firstGroupName = firstGroup.getGroupKey();
                    groupHeader = grouping.getHeaderNode(firstGroupName);

                expect(groupStore.getCount()).toEqual(lockedGridStore.getCount());

                // Collapse first group
                grouping.collapse(firstGroupName);

                // Group store should no longer contain the first group, but should contain one extra "placeholder" record.
                expect(groupStore.getCount()).toEqual(lockedGridStore.getCount() - firstGroup.getRange().length + 1);

                // CTRL/click on the first group's header
                grouping.onGroupClick(lockedGrid.lockedGrid.view, groupHeader, firstGroupName, {ctrlKey: true});

                // Group store should contain placeholders for all other groups (not the first group), plus
                // the first group's records
                expect(groupStore.getCount()).toEqual(Ext.Object.getKeys(grouping.getCache().map).length - 1 + firstGroup.getRange().length);
            });
        });
    });

    describe('reconfiguring and destruction', function () {
        var grouping;

        function makeStore() {
            return new Ext.data.Store({
                model: spec.Restaurant,
                data : [],
                autoDestroy: true
            });
        }

        beforeEach(function () {
            grouping = new Ext.grid.feature.Grouping({});


            grid = new Ext.grid.Panel({
                renderTo : Ext.getBody(),
                store : makeStore(),
                width : 200,
                height : 200,
                features : [grouping],
                columns : [{
                    text : 'Name',
                    dataIndex : 'name'
                }, {
                    text : 'Cuisine',
                    dataIndex : 'cuisine'
                }]
            });
        });

        afterEach(function () {
            Ext.destroy(grouping);
            grouping = null;
        });

        it('should retain the store when the grid is reconfigured with a null store', function(){
            var ds = grouping.dataSource;
            grid.reconfigure(null, [{
                text: 'Foo'
            }]);
            expect(grouping.dataSource).toBe(ds);
        });

        it("should not call the Grouping's dataSource (GroupStore) bindStore method when reconfigured with a new store", function () {
            var store2 = new Ext.data.Store({
                    model: spec.Restaurant,
                    data : []
                }),
                ds;

            ds = grouping.dataSource;
            spyOn(ds, 'bindStore');
            grid.reconfigure(store2);

            expect(ds.bindStore).toHaveBeenCalled();
        });

        it('should create the proper groups when reconfigured with a new store', function () {
            var data = [{
                    name: 'Cheesecake Factory',
                    cuisine: 'American'
                },{
                    name: 'University Cafe',
                    cuisine: 'American'
                },{
                    name: 'Nola\'s',
                    cuisine: 'Cajun'
                },{
                    name: 'House of Bagels',
                    cuisine: 'Bagels'
                },{
                    name: 'The Prolific Oven',
                    cuisine: 'Sandwiches'
                },{
                    name: 'La Strada',
                    cuisine: 'Italian'
                },{
                    name: 'Buca di Beppo',
                    cuisine: 'Italian'
                },{
                    name: 'Pasta?',
                    cuisine: 'Italian'
                }],
                storeCfg = {
                    fields: ['name', 'cuisine'],
                    groupField: 'cuisine',
                    sorters: ['cuisine','name'],
                    data: data
                },
                store = new Ext.data.Store(storeCfg),
                store2 = new Ext.data.Store(storeCfg),
                group;

            grid.reconfigure(store2);
            group = store.getGroups().getByKey('American');

            expect(group).toBeDefined();
            expect(group.items.length).toBe(2);
        });

        it('reconfiguring a grid using buffered rendering and grouping should bind the groupStore to the plugin', function () {
            // This test demonstrates that reconfiguring the grid will properly bind the feature's group
            // store to the plugin.
            //
            // This bug only is reproducible when reconfigure is called on a grid with the buffered
            // renderer plugin and grouping feature. The bug was that the buffered renderer plugin
            // would bind the data store to the plugin rather than the group store (created when
            // there's a grouping feature). See Ext.grid.plugin.BufferedRenderer:bindStore().
            //
            // See EXTJS-11860 and EXTJS-11892.
            var grid = new Ext.grid.Panel({
                width: 100,
                height: 100,
                store: makeStore(),
                features: grouping,
                columns:[{
                    text: 'Name',
                    dataIndex: 'name',
                    width: 100
                }],
                renderTo: Ext.getBody()
            });

            // Pass in a different store.
            grid.reconfigure(makeStore());

            expect(grid.view.bufferedRenderer.store.isFeatureStore).toBe(true);

            grid.destroy();
        });

        it("should unwind all listeners set on the dataSource after grid destruction", function () {
            var ds = grouping.dataSource;
            spyOn(ds, 'bindStore');
            grid.destroy();
            expect(ds.bindStore).toHaveBeenCalledWith(null);
            expect((ds.store || {destroyed : true}).destroyed).toBe(true);
        });

    });

    describe('grouping + RowExpander plugin', function () {
        it('should return the model associated by the data node', function () {
            // The bug was triggered in the UI by mousing over a group title. Internally, the view event
            // is triggering a callback that would call the public viewtable.getRecord() method, and this
            // was failing because it was querying the data store instead of the grouping store. So, for
            // this spec we can simply make sure that calling getRecord returns the model.
            // See EXTJS-13421.
            var grouping = new Ext.grid.feature.Grouping({
                ftype: 'grouping',
                startCollapsed: true
            }),
            view, node;

            grid = new Ext.grid.Panel({
                renderTo: Ext.getBody(),
                store: new Ext.data.Store({
                    model: spec.Restaurant,
                    groupField: 'cuisine',
                    groupDir: 'DESC',
                    data : [
                        { name: "Beardog's",     cuisine: "Home cooking"},
                        { name: "World Service", cuisine: "Poncy"}
                    ]
                }),
                width: 200,
                height: 200,
                title: 'Restaurants',
                deferRowRender: false,
                features: grouping,
                plugins: [{
                    ptype: 'rowexpander',
                    rowBodyTpl: ['<p>{name}</p>']
                }],
                columns: [{
                    text: 'Name',
                    dataIndex: 'name'
                }, {
                    text: 'Cuisine',
                    dataIndex: 'cuisine'
                }]
            });

            view = grid.view;
            node = view.body.down('.x-group-hd-container', true);

            expect(view.getRecord(node).isModel).toBe(true);
        });
    });

    describe('sending to server', function () {
        describe('remoteRoot', function () {
            it('should work when there are no groups', function () {
                // See EXTJS-9425.
                var store = new Ext.data.Store({
                    fields: ['name', 'seniority', 'department'],
                    groupField: 'department',
                    data: {
                        root: []
                    },
                    proxy: {
                        type: 'memory',
                        data: {
                            root: []
                        },
                        reader: {
                            type: 'json',
                            rootProperty: 'root'
                        }
                    }
                }),
                grouping = new Ext.grid.feature.Grouping({
                    ftype: 'grouping',
                    showSummaryRow: true,
                    remoteRoot: 'summaryData'
                }),
                wasCalled = false;

                grid = new Ext.grid.Panel({
                    store: store,
                    width: 500,
                    height: 275,
                    renderTo: Ext.getBody(),
                    columns: [
                        { text: 'Name', dataIndex: 'name' },
                        { text: 'Seniority', dataIndex: 'seniority' }
                    ],
                    features: grouping
                });

                store.proxy.data = {
                    total: 0,
                    summaryData: [{
                        name: 'Test',
                        seniority: 1
                    }],
                    root:[]
                };

                store.load({
                    callback: function () {
                        wasCalled = true;
                    }
                });

                waitsFor(function () {
                    return wasCalled;
                });

                runs(function () {
                    // If the bug still exists a TypeError will be thrown and summaryData will never
                    // be defined and stamped onto the feature's refreshData object.
                    expect(grouping.refreshData.summaryData).toBeDefined();
                });
            });
        });
    });

    describe('use of groupFn', function() {
        var grid,
            grouping;

        beforeEach(function() {
            grid = new Ext.grid.Panel({
                renderTo: document.body,
                width: 600,
                height: 300,
                columns : [{
                    dataIndex : 'text',
                    flex : 1
                }],
                features : [ {ftype: 'grouping'}],
                store : {
                    data : [{
                        text : 'a'
                    }],
                    fields : [ 'text' ],
                    grouper : {
                        groupFn : function (record) {
                            if (record.get('text') === 'a') {
                                return 0;
                            }
                        }
                    },
                    xtype : 'store'
                },
                xtype : 'grid'
            });
            grouping = grid.view.findFeature('grouping');
        });
        afterEach(function() {
            grid.destroy();
        });

        it('should collapse correctly', function() {
            // Collapse the first (and only) group.
            // Should not throw an error: https://sencha.jira.com/browse/EXTJS-13859
            grouping.collapse(grid.store.getGroups().first().getGroupKey());
        });
    });

    describe('stateful', function () {
        var data, grid, view, store, grouping, columns, params, stateId, header, selector;

        function createGrid(gridCfg, groupingCfg, columns, storeCfg) {
            data = [{
                student: 'Student 1',
                subject: 'Math',
                mark: 84,
                allowance: 15.50
            },{
                student: 'Student 1',
                subject: 'Science',
                mark: 72,
                allowance: 10.75
            },{
                student: 'Student 2',
                subject: 'Math',
                mark: 96,
                allowance: 100.75
            },{
                student: 'Student 2',
                subject: 'Science',
                mark: 68,
                allowance: 1.55
            }];

            Ext.define('spec.Grouping', {
                extend: 'Ext.data.Model',
                fields: [
                    'student',
                    'subject',
                    {
                        name: 'mark',
                        type: 'int'
                    },
                    {
                        name: 'allowance',
                        type: 'float'
                    }
                ]
            });

            store = new Ext.data.Store(Ext.apply({
                model: 'spec.Grouping',
                data: data,
                groupField: 'subject',
                autoDestroy: true
            }, storeCfg));

            grouping = new Ext.grid.feature.Grouping(Ext.apply({
                ftype: 'grouping'
            }, groupingCfg));

            columns = columns || [{
                itemId: 'studentColumn',
                dataIndex: 'student',
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
                summaryType: 'average'
            }, {
                itemId: 'noDataIndexColumn',
                summaryType: function (records, values) {
                    var i = 0,
                        length = records.length,
                        total = 0,
                        record;

                    for (; i < length; ++i) {
                        record = records[i];
                        total += record.get('allowance');
                    }
                    return total;
                },
                summaryRenderer: Ext.util.Format.usMoney,
                renderer: function(value, metaData, record, rowIdx, colIdx, store, view) {
                    return Ext.util.Format.usMoney(record.get('allowance'));
                }
            }];

            grid = new Ext.grid.Panel(Ext.apply({
                store: store,
                columns: columns,
                width: 600,
                height: 300,
                features: grouping,
                renderTo: Ext.getBody()
            }, gridCfg));

            view = grid.view;
            selector = grouping.summaryRowSelector;
        }

        function tearDown() {
            grid.destroy();
            // Don't null out stateId here, it needs to remain the same even over the lifetime of the spec.
            grid = view = store = grouping = columns = params = header = null;
            Ext.undefine('spec.Grouping');
            Ext.data.Model.schema.clear();
        }

        // Helper for stateful specs.
        function doGrid(storeCfg) {
            createGrid({
                stateful: true,
                stateId: stateId.toString()
            }, null, null, storeCfg || {});
        }

        function doUITest(storeCfg, dir) {
            var groupField = storeCfg.groupField;

            // Note groupField can be null so the feature doesn't render as grouped.
            doGrid(storeCfg);

            // Trigger grouping.
            header = grid.headerCt.down('[dataIndex="' + (groupField || 'student') + '"]');

            if (!dir) {
                expect(grid.store.isGrouped()).toBe(!!groupField);

                // Trigger the menu.
                jasmine.fireMouseEvent(header.triggerEl.dom, 'click')
                // Click 'Group by this field'.
                jasmine.fireMouseEvent(header.ownerCt.menu.down('#groupMenuItem').itemEl.dom, 'click');
            } else {
                header.sort(dir);
            }

            grid.saveState();

            testStateful(groupField, dir);
            testStateful(groupField, dir);
        }

        function testStateful(groupField, dir) {
            // Refresh a couple of times to ensure that the state is the same.
            tearDown();

            doGrid({
                groupField: groupField
            });

            if (!dir) {
                expect(grid.store.isGrouped()).toBe(true);

                if (groupField) {
                    expect(grid.getState().storeState.grouper.property).toBe(groupField);
                }
            } else {
                expect(grid.getState().storeState.sorters[0].direction).toBe(dir);
            }

            grid.saveState();
        }

        beforeEach(function () {
            new Ext.state.Provider();
            stateId = new Date().getTime();
        });

        afterEach(function () {
            Ext.state.Manager.getProvider().clear();
            tearDown();
        });

        describe('groupField', function () {
            function doGroupFieldTests(groupField) {
                var which = !groupField ? 'not' : '';

                describe('when groupField is ' + which + ' defined', function () {
                    it('should maintain the grouping', function () {
                        doUITest({
                            groupField: groupField
                        }, 'ASC');
                    });

                    it('should maintain the sort direction', function () {
                        doUITest({
                            groupField: groupField
                        }, 'DESC');
                    });

                    describe('autoLoad', function () {
                        it('should render the groups correctly when not auto-loading', function () {
                            doUITest({
                                autoLoad: false,
                                groupField: groupField
                            }, 'ASC');
                        });

                        it('should render the groups correctly when auto-loading', function () {
                            doUITest({
                                autoLoad: true,
                                groupField: groupField
                            }, 'ASC');
                        });
                    });

                    describe('sorting', function () {
                        it('should render the groups correctly when local sorting', function () {
                            doUITest({
                                autoLoad: false,
                                groupField: groupField,
                                remoteSort: false
                            }, 'ASC');
                        });
                    });
                });
            }

            doGroupFieldTests('student');
            doGroupFieldTests(null);
        });

        it('should lookup the correct record for a row when clicked when groups are collapsed', function () {
            // See EXTJS-15190.
            var el, selection;

            doGrid();

            header = grid.headerCt.down('[dataIndex="student"]');

            // Trigger the menu.
            jasmine.fireMouseEvent(header.triggerEl.dom, 'click')
            // Click 'Group by this field'.
            jasmine.fireMouseEvent(header.ownerCt.menu.down('#groupMenuItem').itemEl.dom, 'click');

            grid.saveState();

            tearDown();

            doGrid();

            // Collapse the first group.
            grouping.collapse('Student 1');

            // Get the second row in the Student 2 group.
            el = view.getRowByRecord(grouping.dataSource.getAt(2)).firstChild;

            jasmine.fireMouseEvent(el, 'click')
            selection = grid.selModel.getSelection();

            // Ensure that not only is there a selection but it's the correct one, and also that the row has the correct class.
            expect(Ext.fly(el).up(view.getItemSelector()).hasCls('x-grid-item-selected')).toBe(true);
            expect(selection.length).toBe(1);
            expect(selection[0] === view.getRecord(el)).toBe(true);
        });

        it('should persist the .isGrouping property on the view when grouped', function () {
            // See EXTJS-15190.
            var el, selection;

            doGrid();

            header = grid.headerCt.down('[dataIndex="student"]');

            // Trigger the menu.
            jasmine.fireMouseEvent(header.triggerEl.dom, 'click')
            // Click 'Group by this field'.
            jasmine.fireMouseEvent(header.ownerCt.menu.down('#groupMenuItem').itemEl.dom, 'click');

            expect(view.isGrouping).toBe(true);

            grid.saveState();

            tearDown();

            doGrid();

            expect(view.isGrouping).toBe(true);
        });
    });

    describe('collapsed state', function () {
        // See EXTJS-15755.
        var hdCollapsedCls = Ext.grid.feature.Grouping.prototype.hdCollapsedCls,
            roman, greek, viewBody;

        function makeUI(storeCfg, filterCfg, gridCfg) {
            makeGrid(Ext.apply({
                data: [
                    { name: 'Sulla', cuisine: 'Roman'},
                    { name: 'Pericles', cuisine: 'Greek'}
                ],
                groupField: 'cuisine'
            }, storeCfg), filterCfg, gridCfg);

            viewBody = view.body;

            greek = groupingFeature.getMetaGroup('Greek');
            roman = groupingFeature.getMetaGroup('Roman');
        }


        afterEach(function () {
            roman = greek = viewBody = null;
        });

        describe('init', function () {
            describe('startCollapsed', function () {
                function startCollapsed(bool, isBR) {
                    it('should honor the `startCollapsed` config when ' + bool, function () {
                        // Note that the startCollapsed config will be set to `false` when the groupStore is constructed,
                        // so instead we should inspect the feature's metaGroupCache.
                        makeUI(null, {
                            startCollapsed: bool
                        }, {
                            bufferedRenderer: isBR
                        });

                        expect(roman.isCollapsed).toBe(bool);
                        expect(greek.isCollapsed).toBe(bool);

                        // Query if the first view item has a descendant node that matches the cls that is poked onto
                        // the <tr> of the group header node when the item is collapsed.
                        expect(!!viewBody.down(view.itemSelector).down('.' + hdCollapsedCls)).toBe(bool);
                    });
                }

                // startCollapsed(startCollapsed, bufferedRenderer)
                startCollapsed(false, true);
                startCollapsed(false, false);

                startCollapsed(true, true);
                startCollapsed(true, false);
            });
        });

        describe('collapse state after grid store operations', function () {
            describe('initial collapse state', function () {
                function collapsed(collapseState, filterValue) {
                    it('should retain its collapsed state of ' + filterValue + ' after the grid store is filtered and cleared', function () {
                        makeUI(null, {
                            startCollapsed: collapseState
                        });

                        expect(roman.isCollapsed).toBe(collapseState);
                        expect(greek.isCollapsed).toBe(collapseState);

                        store.addFilter({
                            property: 'cuisine',
                            value: filterValue
                        });

                        store.clearFilter();

                        expect(roman.isCollapsed).toBe(collapseState);
                        expect(greek.isCollapsed).toBe(collapseState);
                    });
                }

                collapsed(true, 'Roman');
                collapsed(false, 'Roman');

                collapsed(true, 'Greek');
                collapsed(false, 'Greek');
            });

            describe('expanding and collapsing', function () {
                // There was a bug in how the collapsed state of feature groups was persisted after a store operation.
                // For instance, when the feature would process the store again, it was expecting the collapsed state
                // to have been poked onto the group object itself, which may no longer be around. We now have a separate,
                // internal metaGroup cache in the feature that stores this information.
                function testIt(group, method, filterValue) {
                    var initialState = method === 'expand';

                    it('should retain its state of ' + !initialState, function () {
                        makeUI(null, {
                            startCollapsed: initialState
                        });

                        groupingFeature[method](group);

                        store.addFilter({
                            property: 'cuisine',
                            value: filterValue
                        });

                        store.clearFilter();

                        expect(groupingFeature.getMetaGroup(group).isCollapsed).toBe(!initialState);
                    });

                    it('should have the ' + (initialState ? 'collapseTip' : 'expandTip') +  ' tooltip', function() {
                        var row;
                        makeUI(null,{
                            startCollapsed: initialState
                        });
                        groupingFeature[method](group);
                        row = view.body.query('.' + groupingFeature.ctCls + '>div div', true)[group === 'Greek' ? 0 : 1];
                        expect(row.getAttribute('data-qtip')).toEqual(initialState ? groupingFeature.collapseTip : groupingFeature.expandTip);
                    });
                }

                describe('when group is expanded before store operations', function () {
                    describe('when expanded group is filtered', function () {
                        testIt('Greek', 'expand', 'Roman');
                        testIt('Roman', 'expand', 'Greek');
                    });

                    describe('when expanded group is not filtered', function () {
                        testIt('Greek', 'expand', 'Greek');
                        testIt('Roman', 'expand', 'Roman');
                    });
                });

                describe('when group is collapsed before store operations', function () {
                    describe('when collapsed group is filtered', function () {
                        testIt('Greek', 'collapse', 'Roman');
                        testIt('Roman', 'collapse', 'Greek');
                    });

                    describe('when collapsed group is not filtered', function () {
                        testIt('Greek', 'collapse', 'Greek');
                        testIt('Roman', 'collapse', 'Roman');
                    });
                });
            });
        });
    });

    describe('referencing the groups and metaGroups', function () {
        // See EXTJS-15755.
        var roman, greek;

        function makeUI(storeCfg, filterCfg) {
            makeGrid(Ext.apply({
                data: [
                    { name: 'Cincinnatus', cuisine: 'Roman'},
                    { name: 'Cleisthenes', cuisine: 'Greek'}
                ],
                groupField: 'cuisine'
            }, storeCfg), filterCfg);

            greek = groupingFeature.getMetaGroup('Greek');
            roman = groupingFeature.getMetaGroup('Roman');
        }

        afterEach(function () {
            roman = greek = null;
        });

        describe('init', function () {
            function doIt(groupField) {
                makeGrid({
                    data: [
                        { name: 'Cincinnatus', cuisine: 'Roman'},
                        { name: 'Cleisthenes', cuisine: 'Greek'}
                    ],
                    groupField: groupField
                });
            }

            function isGrouped(grouped) {
                var word = grouped ? '' : 'not',
                    groupField = grouped ? 'cuisine' : null;

                describe('when store is ' + word + ' grouped', function () {
                    it('should be able to lookup a store group', function () {
                        doIt(groupField);

                        expect(!!groupingFeature.getGroup('Roman')).toBe(grouped);
                        expect(!!groupingFeature.getGroup('Greek')).toBe(grouped);
                    });

                    it('should ' + word + ' be able to lookup a metaGroup', function () {
                        var cache;

                        doIt(groupField);
                        cache = groupingFeature.getCache();

                        expect(!!cache['Roman']).toBe(grouped);
                        expect(!!cache['Greek']).toBe(grouped);
                    });
                });
            }

            isGrouped(true);
            isGrouped(false);
        });

        describe('after store operations', function () {
            function filterIt(method, specName, groupName, bool) {
                // Note that the metaGroups should be present for filtered groups b/c the filter could be cleared.
                it(specName, function () {
                    makeUI();

                    grid.store.addFilter({
                        property: 'cuisine',
                        value: 'Roman'
                    });

                    if (method === 'getGroup') {
                        expect(!!groupingFeature.getGroup(groupName)).toBe(bool);
                    } else {
                        // Note that we can't use .getMetaGroup b/c that will return a new group if the groupName isn't in the cache.
                        expect(groupingFeature.getCache(groupName)[groupName]).toBeDefined();
                    }
                });
            }

            function removeIt(method, specName, groupName) {
                it(specName, function () {
                    makeUI();

                    grid.store.setGrouper(null)

                    if (method === 'getGroup') {
                        expect(groupingFeature.getGroup(groupName)).toBeUndefined();
                    } else {
                        // Note that we can't use .getMetaGroup b/c that will return a new group if the groupName isn't in the cache.
                        expect(groupingFeature.getCache(groupName)[groupName]).toBeUndefined();
                    }
                });
            }

            describe('looking up groups', function () {
                describe('when groups are filtered', function () {
                    filterIt('getGroup', 'should not be able to lookup the group if filtered', 'Greek', false);
                    filterIt('getGroup', 'should be able to lookup the group if not filtered', 'Roman', true);
                });

                describe('when the grouper is removed', function () {
                    removeIt('getGroup', 'should not be able to lookup the group if removed', 'Greek');
                    removeIt('getGroup', 'should not be able to lookup the group if removed', 'Roman');
                });
            });

            describe('looking up metaGroups', function () {
                describe('when groups are filtered', function () {
                    filterIt('getCache', 'should not remove the metaGroup if it is not among the filtered values', 'Greek', false);
                    filterIt('getCache', 'should not remove the metaGroup if it is among the filtered values', 'Roman', false);
                });

                describe('when the grouper is removed', function () {
                    removeIt('getCache', 'should remove the metaGroup if the grouper is removed', 'Greek');
                    removeIt('getCache', 'should remove the metaGroup if the grouper is removed', 'Roman');
                });
            });

            describe('groupFn and types', function () {
                // Note that the bug is caused when a groupFn changes a type such as a Date. In these cases,
                // the group name won't be able to be looked up b/c the data field is a Date object but the
                // the store groups (and by extension the GroupingFeature.metaGroupCache keys) will be strings
                // as converted by the groupFn method on the grouper.
                //
                // As such, the Grouping feature must be smart enough to know that if a group lookup doesn't
                // result in a String that it must call Grouper#getGroupString.
                // See EXTJS-17135.
                var record;

                beforeEach(function () {
                    Ext.define('spec.Movie', {
                        extend: 'Ext.data.Model',
                        fields: ['name', 'type', { name: 'released', type: 'date'}]
                    });
                });

                afterEach(function () {
                    Ext.undefine('spec.Movie');
                    record = null;
                });

                it('should be able to work for complex types', function () {
                    makeGrid({
                        model: 'spec.Movie',
                        grouper: {
                            property: 'released',
                            groupFn: function (record) {
                                return Ext.Date.format(record.get('released'), 'Y-m-d');
                            }
                        },
                        data: [
                            { name: 'Star Wars', genre: 'fantasy', released: new Date('May 25, 1977') },
                            { name: 'The Godfather', genre: 'drama', released: new Date('March 14, 1972') }
                        ]
                    }, null, {
                        width: 400,
                        columns: [{
                            text: 'Name',
                            dataIndex: 'name'
                        }, {
                            text: 'Genre',
                            dataIndex: 'genre'
                        }, {
                            text: 'Released',
                            dataIndex: 'released'
                        }]
                    });

                    // Do something to trigger an event that will refresh the GroupStore.
                    record = store.getAt(0);
                    record.set('genre', 'Sci-Fi');

                    expect(groupingFeature.getGroup(record)).toBeDefined();
                    expect(groupingFeature.getMetaGroup(record)).toBeDefined();
                });
            });
        });
    });

    describe('the metaGroupCache', function () {
        it('should create a metaGroupCache object', function () {
            makeGrid();
            expect(groupingFeature.metaGroupCache).toBeDefined();
        });

        it('should create a metaGroupCache.map object', function () {
            makeGrid();
            expect(groupingFeature.metaGroupCache.map).toEqual({});
        });

        it('should destroy this object when destroyed', function () {
            makeGrid();
            grid.destroy();

            expect(groupingFeature.metaGroupCache).toBe(null);
        });

        describe('preserving state across operations', function () {
            describe('sorting', function () {
                beforeEach(function () {
                    makeGrid({
                        data: [{
                            name: 'Utley',
                            cuisine: 'Please'
                        }],
                        groupField: 'name'
                    });

                    grid.headerCt.visibleColumnManager.getColumns()[0].sort();
                });

                it('should preserve the group', function () {
                    expect(groupingFeature.getCache().Utley).toBeDefined();
                });

                it('should preserve the group in the metaGroupCache map', function () {
                    expect(groupingFeature.getCache().map.Utley).toBeDefined();
                });
            });
        });

        describe('locked grids', function () {
            var lockedGroupingFeature, normalGroupingFeature;

            beforeEach(function () {
                makeGrid(null, null, {
                    enableLocking: true
                });

                lockedGroupingFeature = view.lockedView.summaryFeature;
                normalGroupingFeature = view.normalView.summaryFeature;
            });

            afterEach(function () {
                lockedGroupingFeature = normalGroupingFeature = null;
            });

            it('should share this object with any locking partner', function () {
                expect(lockedGroupingFeature.lockingPartner.metaGroupCache).toBe(lockedGroupingFeature.metaGroupCache);
                expect(normalGroupingFeature.lockingPartner.metaGroupCache).toBe(normalGroupingFeature.metaGroupCache);
            });

            it('should destroy this object and that of its locking partner when destroyed', function () {
                grid.destroy();

                expect(lockedGroupingFeature.metaGroupCache).toBe(null);
                expect(normalGroupingFeature.metaGroupCache).toBe(null);

                expect(lockedGroupingFeature.lockingPartner.metaGroupCache).toBe(null);
                expect(normalGroupingFeature.lockingPartner.metaGroupCache).toBe(null);
            });
        });
    });

    describe('the hideGroupedHeader config', function () {
        it('should default to false', function () {
            makeGrid({
                groupField: 'cuisine'
            });

            expect(groupingFeature.hideGroupedHeader).toBe(false);
        });

        it('should honor a given config', function () {
            makeGrid({
                groupField: 'cuisine'
            }, {
                hideGroupedHeader: true
            });

            expect(groupingFeature.hideGroupedHeader).toBe(true);
        });

        it("should enable both of the Grouping's menu items", function () {
            var menu;

            makeGrid({
                groupField: 'name'
            });

            menu = getMenu();

            expect(menu.down('#groupMenuItem').disabled).toBe(false);
            expect(menu.down('#groupToggleMenuItem').disabled).toBe(false);
        });

        it("should check the 'Show in groups' menu item by default when shown", function () {
            // Note the following Grouping configs must be turned on for the menu item to be in the menu!
            makeGrid({
                groupField: 'name'
            }, {
                enableGroupingMenu: true,
                enableNoGroups: true
            });

            showMenu();
            expect(menu.down('#groupToggleMenuItem').checked).toBe(true);
        });

        it("should disable the 'Show in groups' menu item when it's unchecked", function () {
            makeGrid({
                groupField: 'name'
            });

            showMenu();
            clickItem('groupToggleMenuItem');
            expect(menu.down('#groupToggleMenuItem').disabled).toBe(true);
        });

        describe('when false', function () {
            it('should not hide the column whose dataIndex maps to the store.groupField', function () {
                var groupField =  'cuisine'

                makeGrid({
                    groupField: groupField
                });

                expect(grid.columnManager.getHeaderByDataIndex(groupField).hidden).toBe(false);
            });
        });

        describe('when true', function () {
            var groupField;

            afterEach(function () {
                groupField = null;
            });

            it('should hide the column whose dataIndex maps to the store.groupField', function () {
                groupField =  'cuisine'

                makeGrid({
                    groupField: groupField
                }, {
                    hideGroupedHeader: true
                });

                expect(grid.columnManager.getHeaderByDataIndex(groupField).hidden).toBe(true);
            });

            it('should show the column whose dataIndex maps to the store.groupField when toggled', function () {
                var columnManager;

                groupField =  'cuisine'

                makeGrid({
                    groupField: groupField
                }, {
                    hideGroupedHeader: true
                });

                columnManager = grid.columnManager;

                // First, do a sanity that the column is hidden.
                expect(columnManager.getHeaderByDataIndex(groupField).hidden).toBe(true);

                // Now, let's begin the process of toggling.
                // Unchecking 'Show in groups' shows the hidden column.
                clickItem('groupToggleMenuItem');
                expect(columnManager.getHeaderByDataIndex(groupField).hidden).toBe(false);

                // Clicking 'Group by this field' should hide the target column again.
                clickItem('groupMenuItem', columnManager.getHeaderByDataIndex(groupField));
                expect(columnManager.getHeaderByDataIndex(groupField).hidden).toBe(true);
            });
        });
    });

    function runGroupers(buffered) {
        describe('groupers and ' + (buffered ? 'buffered' : 'data') + ' store', function () {
            var contains = Ext.Array.contains,
                data, groupers, storeCfg;

            beforeEach(function () {
                data = [{
                    cuisine: 'Tuna Delight',
                    name: {
                        first: 'Bob',
                        middle: 'The',
                        last: 'Cat'
                    }
                }, {
                    cuisine: 'Beef Gizzards',
                    name: {
                        first: 'Chuck',
                        middle: 'The',
                        last: 'Cat'
                    }
                }];

                storeCfg = {
                    buffered: buffered,
                    data: !buffered ? data : null
                };

                if (buffered) {
                    storeCfg.pageSize = 20;
                    storeCfg.proxy = {
                        type: 'ajax',
                        url: 'fakeUrl'
                    };
                }
            });

            afterEach(function () {
                data = groupers = storeCfg = null;
            });

            describe('no defined groupers', function () {
                // Note we know that they are indeed grouped (and the UI reflects the grouping) by the fact that
                // there is an entry for the groupField in the metaGroupCache.
                it('should still group on init when grouping by a groupField with a complex type', function () {
                    makeGrid(Ext.apply({
                        groupField: 'name'
                    }, storeCfg));

                    if (buffered) {
                        store.load();
                        completeWithData(data);
                    }

                    expect(groupingFeature.metaGroupCache['name']).toBeDefined();
                });

                it('should still group when grouping by a groupField with a complex type', function () {
                    // Here we're initally grouping by a groupField that maps to a string value and then
                    // switching to a group that maps to a complex type.
                    makeGrid(Ext.apply({
                        groupField: 'cuisine'
                    }, storeCfg));

                    if (buffered) {
                        store.load();
                        completeWithData(data);
                    }

                    // Not specifying a column here will default to column[0].
                    clickItem('groupMenuItem');

                    expect(groupingFeature.metaGroupCache['name']).toBeDefined();
                });
            });

            describe('defined groupers', function () {
                describe('startCollapsed', function () {
                    function doStartCollapsedTests(startCollapsed) {
                        describe('when ' + startCollapsed, function () {
                            describe('init', function () {
                                it('should not have any groupers by default', function () {
                                    makeGrid(storeCfg);

                                    if (buffered) {
                                        store.load();
                                        completeWithData(data);
                                    }

                                    expect(groupingFeature.groupers).toBe(null);
                                });

                                it('should honor configured groupers', function () {
                                    makeGrid(storeCfg, {
                                        groupers: [{
                                            property: 'name',
                                            groupFn: Ext.emptyFn
                                        }, {
                                            property: 'cuisine',
                                            groupFn: Ext.emptyFn
                                        }]
                                    });

                                    groupers = groupingFeature.groupers;

                                    if (buffered) {
                                        store.load();
                                        completeWithData(data);
                                    }

                                    expect(groupers).toBeDefined();
                                    expect(groupers.length).toBe(2);
                                    expect(groupers[0].property).toBe('name');
                                    expect(groupers[1].property).toBe('cuisine');
                                });
                            });

                            describe('after init', function () {
                                // Note: the Grouping feature doesn't completely support a BufferedStore yet so I've
                                // these specs are only testing non-buffered data store.
                                var groupNames = [],
                                    rendererValues = [],
                                    cache;

                                beforeEach(function () {
                                    makeGrid({
                                        groupField: 'name',
                                        data: data
                                    }, {
                                        groupers: [{
                                            property: 'name',
                                            groupFn: function (val) {
                                                var name = val.data.name,
                                                    ret = [name.first, name.middle, name.last].join(' ');

                                                if (!contains(groupNames, ret)) {
                                                    groupNames.push(ret);

                                                }

                                                return ret;
                                            }
                                        }],
                                        startCollapsed: startCollapsed
                                    }, {
                                        columns: [{
                                            text: 'Name',
                                            dataIndex: 'name',
                                            renderer: function (val) {
                                                if (!contains(rendererValues, val)) {
                                                    rendererValues.push(val);
                                                }

                                                return [val.first, val.middle, val.last].join(' ');
                                            }
                                        }]
                                    });

                                    cache = groupingFeature.metaGroupCache;
                                });

                                afterEach(function () {
                                    groupNames.length = rendererValues.length = 0;
                                    cache = null;
                                });

                                describe('metaGroupCache', function () {
                                    it('should have a named reference to each group that was determined by the groupFn', function () {
                                        expect(!!cache[groupNames[0]]).toBe(true);
                                        expect(!!cache[groupNames[1]]).toBe(true);
                                    });

                                    describe('tpl values', function () {
                                        var name = 'Chuck The Cat';

                                        it('should have a "name" value computed by the column renderer', function () {
                                            expect(cache.name).toBe(name);
                                        });

                                        it('should have a "renderedGroupValue" value computed by the column renderer', function () {
                                            expect(cache.renderedGroupValue).toBe(name);
                                        });

                                        it('should have the same value for "name" and "renderedGroupValue"', function () {
                                            expect(cache.name).toBe(cache.renderedGroupValue);
                                        });

                                        it('should have a "groupValue" value determined by looking up the groupField on the record', function () {
                                            // Note that the local var "name" is hard-coded to the last group.
                                            expect(cache.groupValue).toBe(getRec(1).get(cache.groupField));
                                        });
                                    });
                                });

                                describe('column renderers', function () {
                                    it('should be passed a complex data type as the value', function () {
                                        expect(Ext.isObject(rendererValues[0])).toBe(true);
                                        expect(Ext.isObject(rendererValues[1])).toBe(true);
                                    });
                                });

                                describe('the UI', function () {
                                    var cells;

                                    afterEach(function () {
                                        cells = null;
                                    });

                                    describe('group container rows', function () {
                                        it('should create a group container row for each group with the correct group name', function () {
                                            cells = view.body.query('.' + groupingFeature.ctCls, true);

                                            expect((cells[0].textContent || cells[0].innerText).replace(/\s/g, '')).toBe('Name:BobTheCat');
                                            expect((cells[1].textContent || cells[1].innerText).replace(/\s/g, '')).toBe('Name:ChuckTheCat');
                                        });
                                    });

                                    if (!startCollapsed) {
                                        describe('data rows', function () {
                                            it('should correctly render the cell value', function () {
                                                cells = view.body.query('.x-grid-row');

                                                expect((cells[0].textContent || cells[0].innerText).replace(/\s/g, '')).toBe('BobTheCat');
                                                expect((cells[1].textContent || cells[1].innerText).replace(/\s/g, '')).toBe('ChuckTheCat');
                                            });
                                        });
                                    }
                                });
                            });
                        });
                    }

                    doStartCollapsedTests(true);
                    doStartCollapsedTests(false);
                });

                describe('grouping via the UI', function () {
                    // Here we're just testing that the internal cache values update when the UI is clicked.
                    //
                    // Note: the Grouping feature doesn't completely support a BufferedStore yet so I've
                    // these specs are only testing non-buffered data store.
                    beforeEach(function () {
                        makeGrid({
                            groupField: 'cuisine',
                            data: data
                        }, {
                            groupers: [{
                                property: 'name',
                                groupFn: function (val) {
                                    var name = val.data.name;

                                    return [name.first, name.middle, name.last].join(' ');
                                }
                            }]
                        }, {
                            columns: [{
                                text: 'Name',
                                dataIndex: 'name',
                                renderer: function (val) {
                                    return [val.first, val.middle, val.last].join(' ');
                                }
                            }, {
                                text: 'Cuisine',
                                dataIndex: 'cuisine'
                            }]
                        });
                    });

                    describe('the "Group by this field" menu item', function () {
                        function doTest() {
                            // Sanity.
                            expect(groupingFeature.metaGroupCache.groupField).toBe('cuisine');
                            expect(groupingFeature.metaGroupCache.groupValue).toBe(data[0].cuisine);

                            // Not specifying a column here will default to column[0].
                            clickItem('groupMenuItem');

                            waits(100);

                            runs(function () {
                            expect(groupingFeature.metaGroupCache.groupField).toBe('name');
                            expect(groupingFeature.metaGroupCache.groupValue).toBe(data[1].name);
                            });
                        }

                        it('should work when grouping by a complex data type', function () {
                            doTest();
                        });

                        it('should work when toggling', function () {
                            doTest();
                            clickItem('groupMenuItem', grid.columns[1]);
                            doTest();
                        });
                    });

                    describe('the "Show in groups" check menu item', function () {
                        function doTest() {
                            // Not specifying a column here will default to column[0].
                            clickItem('groupMenuItem');

                            expect(groupingFeature.metaGroupCache.groupField).toBe('name');
                            expect(groupingFeature.metaGroupCache.groupValue).toBe(data[1].name);
                        }

                        it('should work when toggling', function () {
                            doTest();
                            clickItem('groupToggleMenuItem', grid.columns[1]);
                            doTest();
                        });
                    });
                });
            });
        });
    }

    runGroupers(true);
    runGroupers(false);

    describe('groupKey values', function () {
        var key;

        function initGrid(groupKey) {
            makeGrid({
                data: [
                    { name: 'Pericles', cuisine: groupKey},
                    { name: 'Sulla', cuisine: 'Roman'}
                ],
                groupField: 'cuisine'
            });
        }

        afterEach(function () {
            key = null;
        });

        describe('non-empty string values', function () {
            beforeEach(function () {
                key = '5th Century Athens';
            });

            it('should work for string values', function () {
                initGrid(key);
                expect(store.getGroups().getAt(0).getGroupKey()).toBe(key);
            });

            it('should create a metaGroup', function () {
                initGrid(key);
                expect(!!groupingFeature.metaGroupCache[key]).toBe(true);
            });
        });

        describe('empty string values', function () {
            beforeEach(function () {
                key = '';
            });

            it('should work for empty string', function () {
                initGrid('');
                expect(store.getGroups().getAt(0).getGroupKey()).toBe('');
            });

            it('should create a metaGroup', function () {
                initGrid('');
                expect(!!groupingFeature.metaGroupCache[key]).toBe(true);
            });
        });

        describe('null values', function () {
            beforeEach(function () {
                key = null;
            });

            it('should work for null values', function () {
                initGrid(key);
                expect(store.getGroups().getAt(0).getGroupKey()).toBe('');
            });

            it('should create a metaGroup with an empty string key', function () {
                initGrid(key);
                expect(!!groupingFeature.metaGroupCache['']).toBe(true);
            });
        });

        describe('undefined values', function () {
            beforeEach(function () {
                key = undefined;
            });

            it('should work for undefined values', function () {
                initGrid(key);
                expect(store.getGroups().getAt(0).getGroupKey()).toBe('');
            });

            it('should create a metaGroup with an empty string key', function () {
                initGrid(key);
                expect(!!groupingFeature.metaGroupCache['']).toBe(true);
            });
        });
    });

    describe('clearing the bound data store', function () {
        // See EXTJS-1582.
        var store, view;

        beforeEach(function () {
            grid = Ext.create('Ext.grid.Panel', {
                renderTo : Ext.getBody(),
                store : Ext.create('Ext.data.Store', {
                    model: spec.Restaurant,
                    groupField: 'cuisine',
                    groupDir: 'DESC',
                    data : [
                        { name: "Beardog's", cuisine: "Home cooking"},
                        { name: "World Service", cuisine: "Poncy"}
                    ]
                }),
                width : 200,
                height : 200,
                title : 'Restaurants',
                deferRowRender: false,
                features : [{
                    ftype: 'grouping'
                }],
                columns : [{
                    text : 'Name',
                    dataIndex : 'name'
                }, {
                    text : 'Cuisine',
                    dataIndex : 'cuisine'
                }]
            });

            store = grid.store;
            view = grid.view;
        });

        afterEach(function () {
            store = view = null;
        });

        it('should work', function () {
            expect(function () {
                store.removeAll();
            }).not.toThrow();
        });

        it('should clear the view', function () {
            expect(view.all.count).toBe(store.getCount());
            store.removeAll();
            expect(view.all.count).toBe(0);
        });
    });

    describe('update operations on the GroupStore', function () {
        describe('operating on the last field in a group', function () {
            function createGrid(groupField) {
                makeGrid({
                    model: spec.Restaurant,
                    groupField: groupField || 'cuisine',
                    data : [
                        { name: "Beardog's", cuisine: true}
                    ],
                    filters: [{
                        property: 'cuisine',
                        value: true
                    }]
                });

                expect(store.data.length).toBe(1);
            }

            function test(str, prop) {
                describe(str, function () {
                    it('should work when filtering the store', function () {
                        createGrid(prop);

                        expect(function () {
                            store.filter('cuisine', false);
                        }).not.toThrow();

                        expect(store.data.length).toBe(0);
                    });

                    it('should work when setting the model', function () {
                        createGrid(prop);

                        expect(function () {
                            store.getAt(0).set('cuisine', false);
                        }).not.toThrow();

                        expect(store.data.length).toBe(0);
                    });
                });
            }

            test('when updated field is different than groupField', 'name');
            test('when updated field is the same as the groupField');
        });
    });

    describe("reconfiguring", function() {
        it("should update the view when a record is added after reconfiguring with a grouped store", function() {
            // https://sencha.jira.com/browse/EXTJS-16592

            var storeCfg = {
                    fields: ['name', 'type'],
                    data: [{
                        'name': 'Larry',
                        'type': 'user'
                    }, {
                        'name': 'Curly',
                        'type': 'employee'
                    }]
                },
                groupStoreCfg = Ext.apply({ groupField: 'type' }, storeCfg),
                store = new Ext.data.Store(storeCfg),
                groupStore = new Ext.data.Store(groupStoreCfg);

            var grid = Ext.create({
                xtype: 'grid',
                renderTo: document.body,
                columns: [{
                    dataIndex: 'name',
                    text: 'Name'
                }],
                features: {
                    ftype: 'grouping'
                },
                store: store
            });

            grid.reconfigure(groupStore);

            grid.getStore().add({
                name: 'Moe',
                type: 'employee'
            });

            expect(grid.getView().getNodes().length).toBe(3);

            grid.destroy();
        });
    });

    describe('on store reload', function () {
        var data;

        beforeEach(function () {
            data = [{
                cuisine: 'Tuna Delight',
                name: 'Bob The Cat'
            }, {
                cuisine: 'Beef Gizzards',
                name: 'Chuck The Cat'
            }];
        });

        afterEach(function () {
            data = null;
        });

        it('should maintain the groupKey property to lookup the current group', function () {
            // Note: To trigger this bug the group must be collapsed before the store is reloaded and
            // then collapsed again. At this point, the feature was keeping a reference to the old
            // destroyed group. Let's test that this is no longer the case.
            //
            // The reference to the group was poked onto the metaGroup's placeholder record which is
            // accessed when the group is collapsed. Instead, we're now caching the groupKey.
            var groupField = 'Beef Gizzards',
                groupKey;

            makeGrid({
                data: data,
                groupField: 'cuisine'
            });

            // Toggle.
            groupingFeature.collapse(groupField);
            groupingFeature.expand(groupField);
            groupKey = groupingFeature.getMetaGroup(groupField).placeholder.groupKey;

            store.load();
            completeWithData(data);

            groupingFeature.collapse(groupField);

            expect(groupingFeature.getMetaGroup(groupField).placeholder.groupKey).toBe(groupKey);
        });
    });

    describe('adding new record to group', function () {
        describe('inserting in first position', function () {
            // See EXTJS-17051.

            function doTheGrid(isBR) {
                makeGrid({
                    model: spec.Restaurant,
                    groupField: 'cuisine',
                    sorters: {
                        property: 'name',
                        direction: 'ASC'
                    },
                    data: [
                        { name: "Chicks' Ciao", cuisine: "Fine Dining"},
                        { name: "Molly's Table", cuisine: "Fine Dining"},
                        { name: "Pete's Place", cuisine: "Fine Dining"},
                        { name: "World of Utley", cuisine: "Fine Dining"},
                        { name: "Lily's Leapers", cuisine: "Fine Dining"},
                        { name: "Who? Roo?", cuisine: "Fine Dining"}
                    ]
                }, null, {
                    height: 500,
                    bufferedRenderer: isBR
                });

                store.insert(0, {
                    name: "Beardog's",
                    cuisine: "Fine Dining"
                });
            }

            function doTests(isBR) {
                it('should not create a new group in store, buffered rendering = ' + isBR, function () {
                    doTheGrid(isBR);
                    expect(store.getGroups().length).toBe(1);
                });

                it('should not create a new group in view, buffered rendering = ' + isBR, function () {
                    doTheGrid(isBR);
                    expect(view.body.el.query('.x-grid-group-hd').length).toBe(1);
                });
            }

            doTests(true);
            doTests(false);
        });
    });
});

