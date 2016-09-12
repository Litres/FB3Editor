describe("Ext.mixin.Accessible", function() {
    var expectAria = jasmine.expectAriaAttr,
        c, cnt;
    
    function makeComponent(config) {
        config = Ext.apply({
            renderTo: Ext.getBody()
        }, config);
        
        return c = new Ext.Component(config);
    }
    
    function makeContainer(config) {
        config = Ext.apply({
            renderTo: Ext.getBody()
        }, config);
        
        return cnt = new Ext.container.Container(config);
    }
    
    afterEach(function() {
        if (cnt) {
            cnt.destroy();
        }
        
        if (c) {
            c.destroy();
        }
        
        c = cnt = null;
    });
    
    describe("getAriaLabelEl", function() {
        var foo, bar, qux;
        
        beforeEach(function() {
            makeContainer({
                referenceHolder: true,
                items: [{
                    xtype: 'component',
                    reference: 'foo',
                    ariaLabelledBy: function() {
                        return this.reference;
                    }
                }, {
                    xtype: 'container',
                    items: [{
                        xtype: 'component',
                        reference: 'bar',
                        ariaLabelledBy: 'qux'
                    }, {
                        xtype: 'container',
                        items: [{
                            xtype: 'component',
                            reference: 'qux',
                            ariaDescribedBy: ['foo', 'bar']
                        }]
                    }]
                }]
            });
            
            foo = cnt.down('[reference=foo]');
            bar = cnt.down('[reference=bar]');
            qux = cnt.down('[reference=qux]');
        });
        
        it("should support single reference", function() {
            var want = qux.ariaEl.id;
            
            expectAria(bar, 'aria-labelledby', want);
        });
        
        it("should support array of references", function() {
            var want = foo.ariaEl.id + ' ' + bar.ariaEl.id;
            
            expectAria(qux, 'aria-describedby', want);
        });
        
        it("should support function", function() {
            expectAria(foo, 'aria-labelledby', 'foo');
        });
    });
});
