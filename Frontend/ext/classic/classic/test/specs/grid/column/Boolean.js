describe("Ext.grid.column.Boolean", function() {
    
    var grid, store, colRef;

    var Model = Ext.define(null, {
        extend: 'Ext.data.Model',
        fields: [{
            name: 'field',
            defaultValue: undefined
        }]
    });
    
    function getCell(rowIdx, colIdx) {
        return grid.getView().getCellInclusive({
            row: rowIdx,
            column: colIdx
        });
    }
    
    function getCellText(rowIdx, colIdx) {
        var cell = getCell(rowIdx, colIdx);
        return Ext.fly(cell).down(grid.getView().innerSelector).dom.innerHTML;
    }
    
    function makeGrid(value, colCfg) {
        store = new Ext.data.Store({
            model: Model,
            data: [{
                field: value
            }]
        });
        
        grid = new Ext.grid.Panel({
            store: store,
            columns: [Ext.apply({
                xtype: 'booleancolumn',
                text: 'Col',
                dataIndex: 'field',
                flex: 1    
            }, colCfg)],
            width: 400,
            height: 100,
            border: false,
            renderTo: Ext.getBody()
        });
        colRef = grid.getColumnManager().getColumns();
    }
    
    afterEach(function(){
        Ext.destroy(grid, store);
        colRef = store = grid = null;
    });
    
    describe("renderer", function() {
        describe("undefinedText", function() {
            it("should render the undefined text", function() {
                makeGrid(undefined);
                var text = getCellText(0, 0);
                // Normalize the text for cross browser
                if (text === '&nbsp;') {
                    text = '&#160;'
                }
                expect(text).toBe(colRef[0].undefinedText);
            });    
        });
        
        describe("falseText", function() {
            it("should render the falseText if value === false", function() {
                makeGrid(false);
                expect(getCellText(0, 0)).toBe(colRef[0].falseText);
            });
            
            it("should render the falseText if value === 'false'", function() {
                makeGrid('false');
                expect(getCellText(0, 0)).toBe(colRef[0].falseText);
            });
        });
        
        it("should render the trueText otherwise", function() {
            makeGrid(true);
            expect(getCellText(0, 0)).toBe(colRef[0].trueText);
        });
    });

    describe("updating", function() {
        it("should update correctly with html in the true/false text", function() {
            makeGrid(false, {
                trueText: '<div class="foo">isTrue</div>',
                falseText: '<div class="bar">isFalse</div>'
            });
            
            store.first().set('field', true);
            
            var text = getCellText(0, 0).replace(/\"/g, '').toLowerCase();
            expect(text).toBe('<div class=foo>istrue</div>');
            
            store.first().set('field', false);
            
            text = getCellText(0, 0).replace(/\"/g, '').toLowerCase();
            expect(text).toBe('<div class=bar>isfalse</div>');
        });
    })
});
