describe("Ext.menu.CheckItem", function(){
    var menu, c;

    function makeItem(cfg) {
        menu = Ext.widget({
            xtype: 'menu',
            renderTo: document.body,
            items: [
                Ext.apply({
                    xtype: 'menucheckitem',
                    text: 'foo'
                }, cfg)
            ]
        });
        c = menu.items.getAt(0);
    }
    
    function expectAria(attr, value) {
        jasmine.expectAriaAttr(c, attr, value);
    }
    
    function expectNoAria(attr) {
        jasmine.expectNoAriaAttr(c, attr);
    }

    afterEach(function(){
        Ext.destroy(menu);
        c = null;
    });

    function clickIt(event) {
        jasmine.fireMouseEvent(c, event || 'click');
    }

    describe("initial config", function() {
        describe("normal", function() {
            beforeEach(function() {
                makeItem();
            });
            
            it("should have the checked property as false by default", function(){
                expect(c.checked).toBe(false);    
            });
            
            describe("rendered", function() {
                beforeEach(function() {
                    menu.show();
                });
                
                it("should have itemEl as ariaEl", function() {
                    expect(c.ariaEl).toBe(c.itemEl);
                });
                
                it("should have menuitemcheckbox role", function() {
                    expectAria('role', 'menuitemcheckbox');
                });
                
                it("should not have aria-label", function() {
                    expectNoAria('aria-label');
                });
                
                describe("aria-checked", function() {
                    it("should be false when not checked", function() {
                        expectAria('aria-checked', 'false');
                    });
                    
                    it("should be true when checked", function() {
                        Ext.destroy(menu);
                        
                        makeItem({ checked: true });
                        
                        expectAria('aria-checked', 'true');
                    });
                });
            });
        });
        
        describe("plain", function() {
            beforeEach(function() {
                makeItem({ plain: true });
                
                menu.show();
            });
            
            it("should have el as ariaEl", function() {
                expect(c.ariaEl).toBe(c.el);
            });
            
            it("should have menuitemcheckbox role", function() {
                expectAria('role', 'menuitemcheckbox');
            });
            
            it("should have no aria-label", function() {
                expectNoAria('aria-label');
            });
            
            describe("aria-checked", function() {
                it("should be false when not checked", function() {
                    expectAria('aria-checked', 'false');
                });
                
                it("should be true when checked", function() {
                    Ext.destroy(menu);
                    makeItem({ plain: true, checked: true });
                    menu.show();
                    
                    expectAria('aria-checked', 'true');
                });
            });
        });
        
        describe("with submenu", function() {
            beforeEach(function() {
                makeItem({
                    menu: {
                        items: [{
                            text: 'bar'
                        }]
                    }
                });
                
                menu.show();
            });
            
            it("should have aria-haspopup", function() {
                expectAria('aria-haspopup', 'true');
            });
            
            it("should have aria-owns", function() {
                expectAria('aria-owns', c.menu.id);
            });
            
            it("should have aria-checked", function() {
                expectAria('aria-checked', 'mixed');
            });
            
            it("should have aria-label", function() {
                expectAria('aria-label', 'foo submenu');
            });
        });
    });
    
    describe("setChecked", function() {
        
        it("should set the checked state on the component", function(){
            makeItem();
            c.setChecked(true);
            expect(c.checked).toBe(true);
            
            c.setChecked(false);
            expect(c.checked).toBe(false);
        });
        
        describe("aria-checked attribute", function() {
            beforeEach(function() {
                makeItem();
                menu.show();
                c.setChecked(true);
            });
            
            it("should set aria-checked attribute", function() {
                expectAria('aria-checked', 'true');
            });
        
            it("should reset aria-checked attribute", function() {
                c.setChecked(false);
                
                expectAria('aria-checked', 'false');
            });
        });
        
        describe("element classes", function(){
            it("should add the checkedCls and remove uncheckedCls when checking", function(){
                makeItem();
                c.setChecked(true);
                expect(c.el.hasCls(c.checkedCls)).toBe(true);
                expect(c.el.hasCls(c.uncheckedCls)).toBe(false);
            });  
            
            it("should add the uncheckedCls and remove checkedCls when unchecking", function(){
                makeItem({
                    checked: true
                });
                c.setChecked(false);
                expect(c.el.hasCls(c.uncheckedCls)).toBe(true);
                expect(c.el.hasCls(c.checkedCls)).toBe(false);
            });  
        });
        
        describe("events", function() {
            describe("no state change", function() {
                it("should not fire any events setting checked: false when not checked", function() {
                    var called = false;
                    makeItem();
                    c.on('beforecheckchange', function(){
                        called = true;
                    });
                    c.setChecked(false);
                    expect(called).toBe(false);    
                });  
            
                it("should not fire any events setting checked: true when checked", function() {
                    var called = false;
                    makeItem({
                        checked: true
                    });
                    c.on('beforecheckchange', function(){
                        called = true;
                    });
                    c.setChecked(true);
                    expect(called).toBe(false);
                });    
            }); 
            
            describe("supressEvents", function(){
                it("should not fire beforecheckchange", function(){
                    var called = false;
                    makeItem();
                    c.on('beforecheckchange', function(){
                        called = true;
                    });
                    c.setChecked(true, true);
                    expect(called).toBe(false);   
                });  
                
                it("should not fire checkchange", function(){
                    var called = false;
                    makeItem();
                    c.on('checkchange', function(){
                        called = true;
                    });
                    c.setChecked(true, true);
                    expect(called).toBe(false);   
                }); 
                
                it("should not trigger a checkHandler", function(){
                    var called = false;
                    makeItem({
                        checkHandler: function(){
                            called = true;
                        }
                    });
                    c.setChecked(true, true);
                    expect(called).toBe(false);  
                })
            });
            
            describe("veto", function(){
                it("should not trigger a change if beforecheckchange returns false", function(){
                    makeItem();
                    c.on('beforecheckchange', function(){
                        return false;
                    });
                    c.setChecked(true);
                    expect(c.checked).toBe(false);
                })
            });
            
            describe("params", function(){
                it("should fire beforecheckchange with the item and the new checked state", function(){
                    var comp, state;
                    makeItem();
                    c.on('beforecheckchange', function(arg1, arg2){
                        comp = arg1;
                        state = arg2;
                    });
                    c.setChecked(true);
                    expect(comp).toBe(c);
                    expect(state).toBe(true);
                });  
                
                it("should fire checkchange with the item and the new checked state", function(){
                    var comp, state;
                    makeItem();
                    c.on('checkchange', function(arg1, arg2){
                        comp = arg1;
                        state = arg2;
                    });
                    c.setChecked(true);
                    expect(comp).toBe(c);
                    expect(state).toBe(true);
                });
                
                it("should trigger checkHandler with the item and the new checked state", function(){
                    var comp, state;
                    makeItem({
                        checkHandler: function(arg1, arg2){
                            comp = arg1;
                            state = arg2;
                        }
                    });
                    c.setChecked(true);
                    expect(comp).toBe(c);
                    expect(state).toBe(true);
                });
                
                describe("checkHandler scope", function(){
                    it("should default the scope to the component", function(){
                        var scope;
                        makeItem({
                            checkHandler: function(){
                                scope = this;
                            }
                        });
                        c.setChecked(true);
                        expect(scope).toBe(c);
                    });
                    
                    it("should use a passed scope", function(){
                        var o = {}, 
                            scope;
                            
                        makeItem({
                            scope: o,
                            checkHandler: function(){
                                scope = this;
                            }
                        });
                        c.setChecked(true);
                        expect(scope).toBe(o);
                    });

                    it("should be able to resolve to a ViewController", function(){
                        makeItem({
                            checkHandler: 'doFoo'
                        });

                        var ctrl = new Ext.app.ViewController({
                            doFoo: function(){
                                return true;
                            }
                        });
                        var checkSpy = spyOn(ctrl, "doFoo");

                        var ct = new Ext.container.Container({
                            renderTo: Ext.getBody(),
                            controller: ctrl,
                            items: c
                        });
                        c.setChecked(true);
                        expect(checkSpy).toHaveBeenCalled();

                        ct.destroy();
                        checkSpy = null;
                    });
                });
            });
        });
    });

    describe("handler", function(){
        it("should default the scope to the component", function(){
            var scope;
            makeItem({
                handler: function(){
                    scope = this;
                }
            });
            clickIt();
            expect(scope).toBe(c);
        });

        it("should use a passed scope", function(){
            var o = {},
                scope;

            makeItem({
                scope: o,
                handler: function(){
                    scope = this;
                }
            });
            clickIt();
            expect(scope).toBe(o);
        });

        it("should be able to resolve to a ViewController", function(){
            makeItem({
                handler: 'doFoo'
            });

            var ctrl = new Ext.app.ViewController({
                doFoo: function(){
                    return true;
                }
            });
            var checkSpy = spyOn(ctrl, "doFoo");

            var ct = new Ext.container.Container({
                renderTo: Ext.getBody(),
                controller: ctrl,
                items: menu // the menu is the one that adds onClick listener. without it the checkitem click won't work.
            });

            clickIt();
            expect(checkSpy).toHaveBeenCalled();

            ct.destroy();
            checkSpy = null;
        });
    });

    describe("setText", function() {
        describe("with submenu", function() {
            beforeEach(function() {
                makeItem({
                    menu: {
                        items: [{
                            text: 'bar'
                        }]
                    }
                });
                
                menu.show();
            });
            
            it("should set aria-label", function() {
                c.setText('frob');
                
                expectAria('aria-label', 'frob submenu');
            });
        });
    });
    
    describe("pointer interaction", function() {
        beforeEach(function() {
            makeItem();
            
            menu.show();
        });
        
        // Tests here are asynchronous because we want to catch focus flip-flops,
        // and these tender animals are easily scared
        it("should not close the menu when clicked on textEl", function() {
            runs(function() {
                clickIt();
            });
            
            // Can't wait for something because we want *nothing* to happen.
            waits(50);
            
            runs(function() {
                expect(c.isVisible()).toBe(true);
            });
        });
        
        it("should not close the menu when clicked on checkEl", function() {
            runs(function() {
                clickIt();
            });
            
            waits(50);
            
            runs(function() {
                expect(c.isVisible()).toBe(true);
            });
        });
    });
});
