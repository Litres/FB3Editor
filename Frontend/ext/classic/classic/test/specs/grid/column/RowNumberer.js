describe('Ext.grid.column.RowNumberer', function () {
    var panel, store,
        synchronousLoad = true,
        proxyStoreLoad = Ext.data.ProxyStore.prototype.load,
        loadStore;

    function createGrid(gridCfg, storeCfg) {
        store = new Ext.data.Store(Ext.apply({
            fields: ['name', 'email', 'phone'],
            data: [
                { 'name': 'Lisa',  'email':'lisa@simpsons.com',  'phone':'555-111-1224'  },
                { 'name': 'Bart',  'email':'bart@simpsons.com',  'phone':'555-222-1234'  },
                { 'name': 'Homer', 'email':'homer@simpsons.com', 'phone':'555-222-1244'  },
                { 'name': 'Marge', 'email':'marge@simpsons.com', 'phone':'555-222-1254'  }
            ],
            autoDestroy: true
        }, storeCfg));

        panel = new Ext.grid.Panel(Ext.apply({
            store: store,
            columns: [
                { xtype: 'rownumberer'},
                { header: 'Name',  dataIndex: 'name', width: 100 },
                { header: 'Email', dataIndex: 'email', width: 100 },
                { header: 'Phone', dataIndex: 'phone', width: 100 }
            ],
            height: 200,
            width: 400
        }, gridCfg));
    }

    function createTree(treeCfg, storeCfg) {
        store = new Ext.data.TreeStore(Ext.apply({
            root: {
                expanded: true,
                children: [{
                    text: 'detention',
                    leaf: true
                }, {
                    text: 'homework',
                    expanded: true,
                    children: [{
                        text: 'book report',
                        leaf: true
                    }, {
                        text: 'algebra',
                        leaf: true
                    }]
                }, {
                    text: 'buy lottery tickets',
                    leaf: true
                }]
            }
        }, storeCfg));

        panel = new Ext.tree.Panel(Ext.apply({
            width: 200,
            height: 150,
            store: store,
            rootVisible: false,
            hideHeaders: true,
            columns: [{
                xtype: 'rownumberer'
            }, {
                text: 'Data',
                dataIndex: 'text',
                flex: 1
            }]
        }, treeCfg));
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

        Ext.destroy(panel);
        panel = store = null;
    });

    describe('grids', function () {
        it('should create numbered rows', function () {
            var view;

            createGrid({
                renderTo: Ext.getBody()
            });

            view = panel.view;

            expect(Ext.fly(view.getNode(0)).down('td', true)).toHaveCls('x-grid-cell-row-numberer');
            expect(Ext.fly(view.getNode(0)).down('.x-grid-cell-inner', true).innerHTML).toBe('1');
            expect(Ext.fly(view.getNode(1)).down('.x-grid-cell-inner', true).innerHTML).toBe('2');
        });

        describe('beforeRender method', function () {
            it('should lookup up the rowbody feature by tablepanel', function () {
                // See EXTJSIV-11504.
                createGrid();

                expect(function () {
                    panel.columns[0].beforeRender();
                }).not.toThrow();
            });
        });

        it("should be able to survive a full row update", function() {
            createGrid();
            var rec = store.first();
            rec.set('name', 'Foo');
            expect(function() {
                rec.commit();
            }).not.toThrow();
        });
    });

    describe('trees', function () {
        it('should create numbered rows', function () {
            var view;

            createTree({
                renderTo: Ext.getBody()
            });

            view = panel.view;

            expect(Ext.fly(view.getNode(0)).down('td', true)).toHaveCls('x-grid-cell-row-numberer');
            expect(Ext.fly(view.getNode(0)).down('.x-grid-cell-inner', true).innerHTML).toBe('1');
            expect(Ext.fly(view.getNode(1)).down('.x-grid-cell-inner', true).innerHTML).toBe('2');
        });

        describe('beforeRender method', function () {
            it('should lookup up the rowbody feature by tablepanel', function () {
                // See EXTJSIV-11504.
                createTree();

                expect(function () {
                    panel.columns[0].beforeRender();
                }).not.toThrow();
            });
        });
    });
});
