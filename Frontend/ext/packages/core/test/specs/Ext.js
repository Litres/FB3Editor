describe("Ext", function() {

    describe("Ext.global", function() {
        it("should return the global scope", function() {
            expect(Ext.global).toBe((function(){ return this;}).call());
        });
    });

    describe("Ext.apply", function() {
        var origin, o;

        beforeEach(function() {
            origin = {
                name: 'value',
                something: 'cool',
                items: [1,2,3],
                method: function() {
                    this.myMethodCalled = true;
                },
                toString: function() {
                    this.myToStringCalled = true;
                }
            };
        });

        it("should copy normal properties", function() {
            Ext.apply(origin, {
                name: 'newName',
                items: [4,5,6],
                otherThing: 'not cool',
                isCool: false
            });

            expect(origin.name).toEqual('newName');
            expect(origin.items).toEqual([4,5,6]);
            expect(origin.something).toEqual('cool');
            expect(origin.otherThing).toEqual('not cool');
            expect(origin.isCool).toEqual(false);
        });

        it("should copy functions", function() {
            Ext.apply(origin, {
                method: function() {
                    this.newMethodCalled = true;
                }
            });

            origin.method();

            expect(origin.myMethodCalled).not.toBeDefined();
            expect(origin.newMethodCalled).toBeTruthy();
        });

        it("should copy non-enumerables", function() {
            Ext.apply(origin, {
                toString: function() {
                    this.newToStringCalled = true;
                }
            });

            origin.toString();

            expect(origin.myToStringCalled).not.toBeDefined();
            expect(origin.newToStringCalled).toBeTruthy();
        });

        it("should apply properties and return an object", function() {
            o = Ext.apply({}, {
                foo: 1,
                bar: 2
            });

            expect(o).toEqual({
                foo: 1,
                bar: 2
            });
        });

        it("should change the reference of the object", function() {
            o = {};
            Ext.apply(o, {
                opt1: 'x',
                opt2: 'y'
            });

            expect(o).toEqual({
                opt1: 'x',
                opt2: 'y'
            });
        });

        it("should overwrite properties", function() {
            o = Ext.apply({
                foo: 1,
                baz: 4
            }, {
                foo: 2,
                bar: 3
            });

            expect(o).toEqual({
                foo: 2,
                bar: 3,
                baz: 4
            });
        });

        it("should use default", function() {
            o = {};

            Ext.apply(o, {
                foo: 'new',
                exist: true
            }, {
                foo: 'old',
                def: true
            });

            expect(o).toEqual({
                foo: 'new',
                def: true,
                exist: true
            });
        });

        it("should override all defaults", function() {
            o = Ext.apply({}, {
                foo: 'foo',
                bar: 'bar'
            }, {
                foo: 'oldFoo',
                bar: 'oldBar'
            });

            expect(o).toEqual( {
                foo: 'foo',
                bar: 'bar'
            });
        });

        it("should return null if null is passed as first argument", function() {
           expect(Ext.apply(null, {})).toBeNull();
        });

        it("should return the object if second argument is not defined", function() {
            o = {
                foo: 1
            };
            expect(Ext.apply(o)).toEqual(o);
        });

        it("should override valueOf", function() {
            o = Ext.apply({}, {valueOf: 1});

            expect(o.valueOf).toEqual(1);
        });

        it("should override toString", function() {
            o = Ext.apply({}, {toString: 3});

            expect(o.toString).toEqual(3);

        });
    });

    describe("Ext.emptyFn", function() {
        it("should return undefined without params", function() {
            expect(Ext.emptyFn()).toBeUndefined();
        });

        it("should return undefined if you pass params", function() {
           expect(Ext.emptyFn('aaaa', 'bbbbb')).toBeUndefined();
        });
    });
    
    describe("Ext.iterate", function() {
        var itFn;

        beforeEach(function() {
            itFn = jasmine.createSpy();
        });

        describe("iterate object", function() {
            var o;

            beforeEach(function() {
                o = {
                    n1: 11,
                    n2: 13,
                    n3: 18
                };
            });

            describe("if itFn does not return false", function() {
                beforeEach(function() {
                    Ext.iterate(o, itFn);
                });

                it("should call the iterate function 3 times", function () {
                    expect(itFn.callCount).toEqual(3);
                });

                it("should call the iterate function with correct arguments", function () {
                    expect(itFn.calls[0].args).toEqual(["n1", 11, o]);
                    expect(itFn.calls[1].args).toEqual(["n2", 13, o]);
                    expect(itFn.calls[2].args).toEqual(["n3", 18, o]);
                });
            });

            describe("if itFn return false", function() {
                beforeEach(function() {
                    itFn.andReturn(false);
                    Ext.iterate(o, itFn);
                });

                it("should stop iteration if function return false", function() {
                    itFn.andReturn(false);

                    expect(itFn.calls.length).toEqual(1);
                });
            });
        });

        describe("do nothing on an empty object", function() {
            var o;

            beforeEach(function() {
                o = {};
                Ext.iterate(o, itFn);
            });

            it("should not call the iterate function", function () {
                expect(itFn).not.toHaveBeenCalled();
            });

        });

        describe("iterate array", function() {
            var arr;

            beforeEach(function() {
                arr = [6, 7, 8, 9];
            });

            describe("if itFn does not return false", function() {
                beforeEach(function() {
                    Ext.iterate(arr, itFn);
                });

                it("should call the iterate function 4 times", function () {
                    expect(itFn.callCount).toEqual(4);
                });

                it("should call the iterate function with correct arguments", function () {
                    expect(itFn.calls[0].args).toEqual([6, 0, arr]);
                    expect(itFn.calls[1].args).toEqual([7, 1, arr]);
                    expect(itFn.calls[2].args).toEqual([8, 2, arr]);
                    expect(itFn.calls[3].args).toEqual([9, 3, arr]);
                });
             });

            describe("if itFn return false", function() {
                beforeEach(function() {
                    itFn.andReturn(false);
                    Ext.iterate(arr, itFn);
                });

                it("should stop iteration if function return false", function() {
                    itFn.andReturn(false);

                    expect(itFn.calls.length).toEqual(1);
                });
            });
        });

        describe("do nothing on an empty array", function() {
            var arr;

            beforeEach(function() {
                arr = [];
                Ext.iterate(arr, itFn);
            });

            it("should not call the iterate function", function () {
                expect(itFn).not.toHaveBeenCalled();
            });

        });
    });

    describe("Ext.applyIf", function(){
        var o;

        it("should apply properties and return an object with an empty destination object", function() {
            o = Ext.applyIf({}, {
                foo: 'foo',
                bar: 'bar'
            });

            expect(o).toEqual( {
                foo: 'foo',
                bar: 'bar'
            });
        });

        it("should not override default properties", function() {
            o = Ext.applyIf({
                foo: 'foo'
            }, {
                foo: 'oldFoo'
            });

            expect(o).toEqual({
                foo: 'foo'
            });
        });

        it("should not override default properties with mixing properties", function() {
            o = Ext.applyIf({
                foo: 1,
                bar: 2
            }, {
                bar: 3,
                baz: 4
            });

            expect(o).toEqual({
                foo: 1,
                bar: 2,
                baz: 4
            });
        });

          it("should change the reference of the object", function() {
            o = {};
            Ext.applyIf(o, {
                foo: 2
            }, {
                foo: 1
            });

            expect(o).toEqual({
                foo: 2
            });
        });

        it("should return null if null is passed as first argument", function() {
           expect(Ext.applyIf(null, {})).toBeNull();
        });

        it("should return the object if second argument is no defined", function() {
            o = {
                foo: 1
            };

            expect(Ext.applyIf(o)).toEqual(o);
        });
    });


    describe("Ext.extend", function() {
        describe("class creation", function () {
            var Child, Parent, baz;

            Parent = Ext.extend(Object, {
                constructor: function(config){
                    Ext.apply(this, config);
                    this.foobar = false;
                }
            });

            Child = Ext.extend(Parent, {
                constructor: function(){
                    Child.superclass.constructor.apply(this, arguments);
                    this.foobar = true;
                }
            });

            baz = new Child({
                sencha: 'isAwesome'
            });

            it("should throw an error if superclass isn't defined", function() {
                expect(function() {
                    Ext.extend(undefined, {});
                }).toThrow("Attempting to extend from a class which has not been loaded on the page.");
            });

            it("should create a superclass that refers to its (usually unreachable) parent prototype", function() {
                expect(baz.superclass).toEqual(Parent.prototype);
            });

            it("should add override method", function() {
                expect(typeof baz.override === 'function').toBe(true);
            });

            it("should override redefined methods", function() {
                expect(baz.foobar).toBe(true);
            });

            it("should keep new properties", function() {
                expect(baz.sencha).toEqual('isAwesome');
            });
        });

        describe("constructors", function () {
            // Extending Object
            var A = function () {
                A.superclass.constructor.call(this);
                this.data = 'a';
            };
            Ext.extend(A, Object, {});

            // Extending class created via 3 argument form using 3 arg form
            var B = function () {
                B.superclass.constructor.call(this);
                this.data += 'b';
            };
            Ext.extend(B, A, {});

            // Extending class produced via 3 argument form using 2 argument form
            var C = Ext.extend(B, {
                constructor: function () {
                    C.superclass.constructor.call(this);
                    this.data += 'c';
                }
            });

            // Extending class produced via 2 argument form using 2 argument form
            var D = Ext.extend(C, {
                constructor: function () {
                    D.superclass.constructor.call(this);
                    this.data += 'd';
                }
            });

            // Extending again using 3 argument form
            var E = function () {
                E.superclass.constructor.call(this);
                this.data += 'e';
            };
            Ext.extend(E, D, {});

            it("should call each constructor ", function () {
                var instance = new E();
                expect(instance.data).toBe('abcde');
            });

            it("should correctly set the constructor", function () {
                expect(E.superclass.constructor).toEqual(D.prototype.constructor);
                expect(D.superclass.constructor).toEqual(C.prototype.constructor);
                expect(C.superclass.constructor).toEqual(B);
                expect(B.superclass.constructor).toEqual(A);
            });
        });

        describe("derive from Ext.define'd base", function () {
            var A = Ext.define(null, {
                constructor: function () {
                    this.data = 'a';
                }
            });

            // Extending class created via 3 argument form using 3 arg form
            var B = function () {
                B.superclass.constructor.call(this);
                this.data += 'b';
            };
            Ext.extend(B, A, {});

            // Extending class produced via 3 argument form using 2 argument form
            var C = Ext.extend(B, {
                constructor: function () {
                    C.superclass.constructor.call(this);
                    this.data += 'c';
                }
            });

            // Extending class produced via 2 argument form using 2 argument form
            var D = Ext.extend(C, {
                constructor: function () {
                    D.superclass.constructor.call(this);
                    this.data += 'd';
                }
            });

            // Extending again using 3 argument form
            var E = function () {
                E.superclass.constructor.call(this);
                this.data += 'e';
            };
            Ext.extend(E, D, {});

            it("should call each constructor ", function () {
                var instance = new E();
                expect(instance.data).toBe('abcde');
            });

            it("should correctly set the constructor", function () {
                expect(E.superclass.constructor).toEqual(D.prototype.constructor);
                expect(D.superclass.constructor).toEqual(C.prototype.constructor);
                expect(C.superclass.constructor).toEqual(B);
                expect(B.superclass.constructor).toEqual(A.prototype.constructor);
            });
        });
    });

    describe("Ext.override", function(){
        describe("on a raw JS class", function() {
            it("should override existing methods and add new methods to the prototype", function(){
                var Cls = function() {},
                    fn1 = function() {},
                    fn2 = function() {},
                    fn3 = function() {},
                    fn4 = function() {};

                Cls.prototype.foo = fn1;
                Cls.prototype.baz = fn2;

                Ext.override(Cls, {
                    foo: fn3,
                    bar: fn4
                });

                expect(Cls.prototype.foo).toBe(fn3);
                expect(Cls.prototype.bar).toBe(fn4);
                expect(Cls.prototype.baz).toBe(fn2);
            });
        });

        describe("on an Ext class", function() {
            it("should overwrite existing methods", function() {
                var fn1 = function() {},
                    fn2 = function() {};

                var Cls = Ext.define(null, {
                    foo: fn1
                });

                expect(Cls.prototype.foo).toBe(fn1);

                Ext.override(Cls, {
                    foo: fn2
                });

                expect(Cls.prototype.foo).toBe(fn2);
            });

            it("should add new methods", function() {
                var fn1 = function() {},
                    fn2 = function() {};

                var Cls = Ext.define(null, {
                    foo: fn1
                });

                expect(Cls.prototype.bar).toBeUndefined();

                Ext.override(Cls, {
                    bar: fn2
                });

                expect(Cls.prototype.foo).toBe(fn1);
                expect(Cls.prototype.bar).toBe(fn2);
            });

            it("should be able to override privates", function() {
                var fn1 = function() {},
                    fn2 = function() {};

                var Cls = Ext.define(null, {
                    privates: {
                        foo: fn1
                    }
                });

                expect(Cls.prototype.foo).toBe(fn1);

                Ext.override(Cls, {
                    privates: {
                        foo: fn2
                    }
                });

                expect(Cls.prototype.foo).toBe(fn2);
            });

            it("should be able to override statics", function() {
                var fn1 = function() {},
                    fn2 = function() {};

                var Cls = Ext.define(null, {
                    statics: {
                        foo: fn1
                    }
                });

                expect(Cls.foo).toBe(fn1);

                Ext.override(Cls, {
                    statics: {
                        foo: fn2
                    }
                });

                expect(Cls.foo).toBe(fn2);
            });

            it("should be able to override static privates", function() {
                var fn1 = function() {},
                    fn2 = function() {};

                var Cls = Ext.define(null, {
                    privates: {
                        statics: {
                            foo: fn1
                        }
                    }
                });

                expect(Cls.foo).toBe(fn1);

                Ext.override(Cls, {
                    privates: {
                        statics: {
                            foo: fn2
                        }
                    }
                });

                expect(Cls.foo).toBe(fn2);
            });

            it("should be able to callParent()", function() {
                var Cls = Ext.define(null, {
                    doIt: function() {
                        return 100;
                    }
                });

                Ext.override(Cls, {
                    doIt: function() {
                        return this.callParent() + 1;
                    }
                });

                var o = new Cls();
                expect(o.doIt()).toBe(101);
            });
        });

        describe("on an Ext class instance", function() {
            it("should write methods to the instance, but not the prototype", function() {
                var fn1 = function() {},
                    fn2 = function() {};

                var Cls = Ext.define(null, {
                    foo: fn1
                });

                var o = new Cls();

                Ext.override(o, {
                    foo: fn2
                });

                expect(o.foo).toBe(fn2);
                expect(o.self.prototype.foo).toBe(fn1);
            });

            it("should add new methods to the instance, not the prototype", function() {
                var fn1 = function() {};

                var Cls = Ext.define(null, {});

                var o = new Cls();

                Ext.override(o, {
                    foo: fn1
                });

                expect(o.foo).toBe(fn1);
                expect(o.self.prototype.foo).toBeUndefined();
            });

            it("should be able to override privates", function() {
                var fn1 = function() {},
                    fn2 = function() {};

                var Cls = Ext.define(null, {
                    privates: {
                        foo: fn1
                    }
                });

                var o = new Cls();

                Ext.override(o, {
                    privates: {
                        foo: fn2
                    }
                });

                expect(o.foo).toBe(fn2);
                expect(o.self.prototype.foo).toBe(fn1);
            });

            it("should be able to callParent()", function() {
                var Cls = Ext.define(null, {
                    doIt: function() {
                        return 100;
                    }
                });

                var o = new Cls();

                Ext.override(o, {
                    doIt: function() {
                        return this.callParent() + 1;
                    }
                });
                expect(o.doIt()).toBe(101);
            });
        });
    });

    describe("Ext.valueFrom", function() {
        var value, defaultValue;

        describe("with allowBlank", function() {
            describe("and an empty string", function() {
                it("should return the value", function() {
                    expect(Ext.valueFrom('', 'aaa', true)).toBe('');
                });
            });

            describe("and a string", function() {
                it("should return the value", function() {
                    expect(Ext.valueFrom('bbb', 'aaa', true)).toBe('bbb');
                });
            });

            describe("and an undefined value", function() {
                it("should return the default value", function() {
                    expect(Ext.valueFrom(undefined, 'aaa', true)).toBe('aaa');
                });
            });

            describe("and a null value", function() {
                it("should return the default value", function() {
                    expect(Ext.valueFrom(null, 'aaa', true)).toBe('aaa');
                });
            });

            describe("and a 0 value", function() {
                it("should return the value", function() {
                    expect(Ext.valueFrom(0, 'aaa', true)).toBe(0);
                });
            });
        });

        describe("without allowBlank", function() {
            describe("and an empty string", function() {
                it("should return the default value", function() {
                    expect(Ext.valueFrom('', 'aaa')).toBe('aaa');
                });
            });

            describe("and a string", function() {
                it("should return the value", function() {
                    expect(Ext.valueFrom('bbb', 'aaa')).toBe('bbb');
                });
            });

            describe("and an undefined value", function() {
                it("should return the default value", function() {
                    expect(Ext.valueFrom(undefined, 'aaa')).toBe('aaa');
                });
            });

            describe("and a null value", function() {
                it("should return the default value", function() {
                    expect(Ext.valueFrom(null, 'aaa')).toBe('aaa');
                });
            });

            describe("and a 0 value", function() {
                it("should return the value", function() {
                    expect(Ext.valueFrom(0, 'aaa')).toBe(0);
                });
            });
        });
    });

    describe("Ext.typeOf", function() {
        
        it("should return null", function() {
            expect(Ext.typeOf(null)).toEqual('null');
        });
        
        it("should return undefined", function() {
            expect(Ext.typeOf(undefined)).toEqual('undefined');
            expect(Ext.typeOf(window.someWeirdPropertyThatDoesntExist)).toEqual('undefined');
        });


        it("should return string", function() {
            expect(Ext.typeOf('')).toEqual('string');
            expect(Ext.typeOf('something')).toEqual('string');
            expect(Ext.typeOf('1.2')).toEqual('string');
        });

        it("should return number", function() {
            expect(Ext.typeOf(1)).toEqual('number');
            expect(Ext.typeOf(1.2)).toEqual('number');
            expect(Ext.typeOf(new Number(1.2))).toEqual('number');
        });


        it("should return boolean", function() {
            expect(Ext.typeOf(true)).toEqual('boolean');
            expect(Ext.typeOf(false)).toEqual('boolean');
            expect(Ext.typeOf(new Boolean(true))).toEqual('boolean');
        });
        

        it("should return array", function() {
            expect(Ext.typeOf([1,2,3])).toEqual('array');
            expect(Ext.typeOf(new Array(1,2,3))).toEqual('array');
        });
        
        it("should return function", function() {
            expect(Ext.typeOf(function(){})).toEqual('function');
            expect(Ext.typeOf(new Function())).toEqual('function');
            expect(Ext.typeOf(Object)).toEqual('function');
            expect(Ext.typeOf(Array)).toEqual('function');
            expect(Ext.typeOf(Number)).toEqual('function');
            expect(Ext.typeOf(Function)).toEqual('function');
            expect(Ext.typeOf(Boolean)).toEqual('function');
            expect(Ext.typeOf(String)).toEqual('function');
            expect(Ext.typeOf(Date)).toEqual('function');
            expect(Ext.typeOf(Ext.typeOf)).toEqual('function');

            // In IE certain native functions come back as objects, e.g. alert, prompt and document.getElementById. It
            // isn't clear exactly what correct behaviour should be in those cases as attempting to treat them like
            // normal functions can causes various problems. Some, like document.getElementBy, have call and apply
            // methods so in most cases will behave like any other function. It might be possible to detect them by
            // using something like this:
            //
            // if (typeof obj === 'object' && !obj.toString && obj.call && obj.apply && (obj + '')) {...}
        });
        
        it("should return regexp", function() {
            expect(Ext.typeOf(/test/)).toEqual('regexp');
            expect(Ext.typeOf(new RegExp('test'))).toEqual('regexp');
        });

        it("should return date", function() {
            expect(Ext.typeOf(new Date())).toEqual('date');
        });
        
        it("should return textnode", function() {
            expect(Ext.typeOf(document.createTextNode('tada'))).toEqual('textnode');
            expect(Ext.typeOf(document.createTextNode(' '))).toEqual('whitespace');
            expect(Ext.typeOf(document.createTextNode('         '))).toEqual('whitespace');
        });

        it("should return element", function() {
            expect(Ext.typeOf(document.getElementsByTagName('body')[0])).toEqual('element');
            expect(Ext.typeOf(document.createElement('button'))).toEqual('element');
            expect(Ext.typeOf(new Image())).toEqual('element');
        });

        it("should return object", function() {
            expect(Ext.typeOf({some: 'stuff'})).toEqual('object');
            expect(Ext.typeOf(new Object())).toEqual('object');
            expect(Ext.typeOf(window)).toEqual('object');
        });

    });

    describe("Ext.isIterable", function() {
        var LengthyClass = function(){},
            ClassWithItem = function(){},
            LengthyItemClass = function(){};

        LengthyClass.prototype.length = 1;
        ClassWithItem.prototype.item = function(){};
        LengthyItemClass.prototype.length = 1;
        LengthyItemClass.prototype.item = function(){};

        it("should return true with an arguments object", function() {
            expect(Ext.isIterable(arguments)).toBe(true);
        });

        it("should return true with empty array", function() {
            expect(Ext.isIterable([])).toBe(true);
        });

        it("should return true with filled array", function() {
            expect(Ext.isIterable([1, 2, 3, 4])).toBe(true);
        });

        it("should return false with boolean true", function() {
            expect(Ext.isIterable(true)).toBe(false);
        });

        it("should return false with boolean false", function() {
            expect(Ext.isIterable(false)).toBe(false);
        });

        it("should return false with string", function() {
            expect(Ext.isIterable("foo")).toBe(false);
        });

        it("should return false with empty string", function() {
            expect(Ext.isIterable("")).toBe(false);
        });

        it("should return false with number", function() {
            expect(Ext.isIterable(1)).toBe(false);
        });

        it("should return false with null", function() {
            expect(Ext.isIterable(null)).toBe(false);
        });

        it("should return false with undefined", function() {
            expect(Ext.isIterable(undefined)).toBe(false);
        });

        it("should return false with date", function() {
            expect(Ext.isIterable(new Date())).toBe(false);
        });

        it("should return false with empty object", function() {
            expect(Ext.isIterable({})).toBe(false);
        });

        it("should return true with node list", function() {
            expect(Ext.isIterable(document.getElementsByTagName('body'))).toBe(true);
        });

        it("should return true with html collection", function() {
            expect(Ext.isIterable(document.images)).toBe(true);
        });
        
        it("should return false for a function", function(){
            expect(Ext.isIterable(function(){})).toBe(false);
        });

        it('should return false for objects with a length property', function() {
            expect(Ext.isIterable({length:1})).toBe(false);
        });

        it('should return false for objects with an item property', function() {
            expect(Ext.isIterable({item: function(){}})).toBe(false);
        });
        
        it('should return false for objects with a length prototype property', function() {
            expect(Ext.isIterable(new LengthyClass())).toBe(false);
        });
        
        it('should return false for objects with an item prototype property', function() {
            expect(Ext.isIterable(new ClassWithItem())).toBe(false);
        });
        
        it('should return false for objects with item and length prototype properties', function() {
            expect(Ext.isIterable(new LengthyItemClass())).toBe(false);
        });

        it('should return true for arguments object', function() {
            expect(Ext.isIterable(arguments)).toBe(true);
        });

        describe('stylesheets', function() {
            var styleEl;

            beforeEach(function() {
                // if the test index page has no stylesheets, then document.styleSheets
                // will be undefined.  Create a style element to make sure
                // document.styleSheets is a StyleSheetList
                styleEl = document.createElement('style');
                document.body.appendChild(styleEl);
            });

            afterEach(function() {
                document.body.removeChild(styleEl);
            });

            it('should return true for StyleSheetList', function() {
                expect(Ext.isIterable(document.styleSheets)).toBe(true);
            });

            it('should return true for CSSRuleList', function() {
                expect(Ext.isIterable(document.styleSheets[0].cssRules || document.styleSheets[0].rules)).toBe(true);
            });
        });
    });

    describe("Ext.isArray", function() {
        it("should return true with empty array", function() {
            expect(Ext.isArray([])).toBe(true);
        });

        it("should return true with filled array", function() {
            expect(Ext.isArray([1, 2, 3, 4])).toBe(true);
        });

        it("should return false with boolean true", function() {
            expect(Ext.isArray(true)).toBe(false);
        });

        it("should return false with boolean false", function() {
            expect(Ext.isArray(false)).toBe(false);
        });

        it("should return false with string", function() {
            expect(Ext.isArray("foo")).toBe(false);
        });

        it("should return false with empty string", function() {
            expect(Ext.isArray("")).toBe(false);
        });

        it("should return false with number", function() {
            expect(Ext.isArray(1)).toBe(false);
        });

        it("should return false with null", function() {
            expect(Ext.isArray(null)).toBe(false);
        });

        it("should return false with undefined", function() {
            expect(Ext.isArray(undefined)).toBe(false);
        });

        it("should return false with date", function() {
            expect(Ext.isArray(new Date())).toBe(false);
        });

        it("should return false with empty object", function() {
            expect(Ext.isArray({})).toBe(false);
        });

        it("should return false with node list", function() {
            expect(Ext.isArray(document.getElementsByTagName('body'))).toBe(false);
        });

        it("should return false with custom class that has a length property", function() {
            var C = Ext.extend(Object, {
                length: 1
            });
            expect(Ext.isArray(new C())).toBe(false);
        });

        it("should return false with element", function() {
           expect(Ext.isArray(document.body)).toBe(false);
        });
    });

    describe("Ext.isBoolean", function() {
        it("should return false with empty array", function() {
            expect(Ext.isBoolean([])).toBe(false);
        });

        it("should return false with filled array", function() {
            expect(Ext.isBoolean([1, 2, 3, 4])).toBe(false);
        });

        it("should return true with boolean true", function() {
            expect(Ext.isBoolean(true)).toBe(true);
        });

        it("should return true with boolean false", function() {
            expect(Ext.isBoolean(false)).toBe(true);
        });

        it("should return false with string", function() {
            expect(Ext.isBoolean("foo")).toBe(false);
        });

        it("should return false with empty string", function() {
            expect(Ext.isBoolean("")).toBe(false);
        });

        it("should return false with number", function() {
            expect(Ext.isBoolean(1)).toBe(false);
        });

        it("should return false with null", function() {
            expect(Ext.isBoolean(null)).toBe(false);
        });

        it("should return false with undefined", function() {
            expect(Ext.isBoolean(undefined)).toBe(false);
        });

        it("should return false with date", function() {
            expect(Ext.isBoolean(new Date())).toBe(false);
        });

        it("should return false with empty object", function() {
            expect(Ext.isBoolean({})).toBe(false);
        });

        it("should return false with node list", function() {
            expect(Ext.isBoolean(document.getElementsByTagName('body'))).toBe(false);
        });

        it("should return false with element", function() {
           expect(Ext.isArray(document.body)).toBe(false);
        });
    });

    describe("Ext.isDate", function() {
        it("should return false with empty array", function() {
            expect(Ext.isDate([])).toBe(false);
        });

        it("should return false with filled array", function() {
            expect(Ext.isDate([1, 2, 3, 4])).toBe(false);
        });

        it("should return false with boolean true", function() {
            expect(Ext.isDate(true)).toBe(false);
        });

        it("should return false with boolean false", function() {
            expect(Ext.isDate(false)).toBe(false);
        });

        it("should return false with string", function() {
            expect(Ext.isDate("foo")).toBe(false);
        });

        it("should return false with empty string", function() {
            expect(Ext.isDate("")).toBe(false);
        });

        it("should return false with number", function() {
            expect(Ext.isDate(1)).toBe(false);
        });

        it("should return false with null", function() {
            expect(Ext.isDate(null)).toBe(false);
        });

        it("should return false with undefined", function() {
            expect(Ext.isDate(undefined)).toBe(false);
        });

        it("should return true with date", function() {
            expect(Ext.isDate(new Date())).toBe(true);
        });

        it("should return false with empty object", function() {
            expect(Ext.isDate({})).toBe(false);
        });

        it("should return false with node list", function() {
            expect(Ext.isDate(document.getElementsByTagName('body'))).toBe(false);
        });

        it("should return false with element", function() {
            expect(Ext.isDate(document.body)).toBe(false);
        });
    });

    describe("Ext.isDefined", function() {
        it("should return true with empty array", function() {
            expect(Ext.isDefined([])).toBe(true);
        });

        it("should return true with filled array", function() {
            expect(Ext.isDefined([1, 2, 3, 4])).toBe(true);
        });

        it("should return true with boolean true", function() {
            expect(Ext.isDefined(true)).toBe(true);
        });

        it("should return true with boolean false", function() {
            expect(Ext.isDefined(false)).toBe(true);
        });

        it("should return true with string", function() {
            expect(Ext.isDefined("foo")).toBe(true);
        });

        it("should return true with empty string", function() {
            expect(Ext.isDefined("")).toBe(true);
        });

        it("should return true with number", function() {
            expect(Ext.isDefined(1)).toBe(true);
        });

        it("should return true with null", function() {
            expect(Ext.isDefined(null)).toBe(true);
        });

        it("should return false with undefined", function() {
            expect(Ext.isDefined(undefined)).toBe(false);
        });

        it("should return true with date", function() {
            expect(Ext.isDefined(new Date())).toBe(true);
        });

        it("should return true with empty object", function() {
            expect(Ext.isDefined({})).toBe(true);
        });

        it("should return true with node list", function() {
            expect(Ext.isDefined(document.getElementsByTagName('body'))).toBe(true);
        });

        it("should return true with element", function() {
           expect(Ext.isDefined(document.body)).toBe(true);
        });
    });

    describe("Ext.isElement", function() {
        it("should return false with empty array", function() {
            expect(Ext.isElement([])).toBe(false);
        });

        it("should return false with filled array", function() {
            expect(Ext.isElement([1, 2, 3, 4])).toBe(false);
        });

        it("should return false with boolean true", function() {
            expect(Ext.isElement(true)).toBe(false);
        });

        it("should return false with boolean false", function() {
            expect(Ext.isElement(false)).toBe(false);
        });

        it("should return false with string", function() {
            expect(Ext.isElement("foo")).toBe(false);
        });

        it("should return false with empty string", function() {
            expect(Ext.isElement("")).toBe(false);
        });

        it("should return false with number", function() {
            expect(Ext.isElement(1)).toBe(false);
        });

        it("should return false with null", function() {
            expect(Ext.isElement(null)).toBe(false);
        });

        it("should return false with undefined", function() {
            expect(Ext.isElement(undefined)).toBe(false);
        });

        it("should return false with date", function() {
            expect(Ext.isElement(new Date())).toBe(false);
        });

        it("should return false with empty object", function() {
            expect(Ext.isElement({})).toBe(false);
        });

        it("should return false with node list", function() {
            expect(Ext.isElement(document.getElementsByTagName('body'))).toBe(false);
        });

        it("should return true with element", function() {
           expect(Ext.isElement(document.body)).toBe(true);
        });

        it("should return false with TextNode", function() {
            var textNode = document.createTextNode('foobar');
            document.body.appendChild(textNode);
            expect(Ext.isElement(textNode)).toBe(false);
            document.body.removeChild(textNode);
        });
    });

    describe("Ext.isEmpty", function() {
        it("should return true with empty array", function() {
            expect(Ext.isEmpty([])).toBe(true);
        });

        it("should return false with filled array", function() {
            expect(Ext.isEmpty([1, 2, 3, 4])).toBe(false);
        });

        it("should return false with boolean true", function() {
            expect(Ext.isEmpty(true)).toBe(false);
        });

        it("should return false with boolean false", function() {
            expect(Ext.isEmpty(false)).toBe(false);
        });

        it("should return false with string", function() {
            expect(Ext.isEmpty("foo")).toBe(false);
        });

        it("should return true with empty string", function() {
            expect(Ext.isEmpty("")).toBe(true);
        });

        it("should return true with empty string with allowBlank", function() {
            expect(Ext.isEmpty("", true)).toBe(false);
        });

        it("should return false with number", function() {
            expect(Ext.isEmpty(1)).toBe(false);
        });

        it("should return true with null", function() {
            expect(Ext.isEmpty(null)).toBe(true);
        });

        it("should return true with undefined", function() {
            expect(Ext.isEmpty(undefined)).toBe(true);
        });

        it("should return false with date", function() {
            expect(Ext.isEmpty(new Date())).toBe(false);
        });

        it("should return false with empty object", function() {
            expect(Ext.isEmpty({})).toBe(false);
        });
    });

    describe("Ext.isFunction", function() {
        it("should return true with anonymous function", function() {
            expect(Ext.isFunction(function(){})).toBe(true);
        });

        it("should return true with new Function syntax", function() {
            expect(Ext.isFunction(Ext.functionFactory('return "";'))).toBe(true);
        });

        it("should return true with static function", function() {
            expect(Ext.isFunction(Ext.emptyFn)).toBe(true);
        });

        it("should return true with instance function", function() {
            var stupidClass = function() {},
                testObject;
            stupidClass.prototype.testMe = function() {};
            testObject = new stupidClass();

            expect(Ext.isFunction(testObject.testMe)).toBe(true);
        });

        it("should return true with function on object", function() {
            var o = {
                fn: function() {
                }
            };

            expect(Ext.isFunction(o.fn)).toBe(true);
        });

        it("should return false with empty array", function() {
            expect(Ext.isFunction([])).toBe(false);
        });

        it("should return false with filled array", function() {
            expect(Ext.isFunction([1, 2, 3, 4])).toBe(false);
        });

        it("should return false with boolean true", function() {
            expect(Ext.isFunction(true)).toBe(false);
        });

        it("should return false with boolean false", function() {
            expect(Ext.isFunction(false)).toBe(false);
        });

        it("should return false with string", function() {
            expect(Ext.isFunction("foo")).toBe(false);
        });

        it("should return false with empty string", function() {
            expect(Ext.isFunction("")).toBe(false);
        });

        it("should return false with number", function() {
            expect(Ext.isFunction(1)).toBe(false);
        });

        it("should return false with null", function() {
            expect(Ext.isFunction(null)).toBe(false);
        });

        it("should return false with undefined", function() {
            expect(Ext.isFunction(undefined)).toBe(false);
        });

        it("should return false with date", function() {
            expect(Ext.isFunction(new Date())).toBe(false);
        });

        it("should return false with empty object", function() {
            expect(Ext.isFunction({})).toBe(false);
        });

        it("should return false with node list", function() {
            expect(Ext.isFunction(document.getElementsByTagName('body'))).toBe(false);
        });
        
        it("should return true with a function from a document where Ext isn't loaded", function() {
            var iframe = document.createElement('iframe'),
                win, doc;

            iframe.src = 'about:blank';
            document.body.appendChild(iframe);
            
            doc = iframe.contentDocument ? iframe.contentDocument : (iframe.contentWindow.document || iframe.document);
            win = iframe.contentWindow || iframe.window;
            
            doc.open();
            doc.write('<html><head><script type="text/javascript">function customFn() {}</script></head><body></body></html>');
            doc.close();
            
            expect(Ext.isFunction(win.customFn)).toBe(true);
            document.body.removeChild(iframe);
            iframe = doc = win = null;
        });
    });

    describe("Ext.isNumber", function() {
        it("should return true with zero", function() {
            expect(Ext.isNumber(0)).toBe(true);
        });

        it("should return true with non zero", function() {
            expect(Ext.isNumber(4)).toBe(true);
        });

        it("should return true with negative integer", function() {
            expect(Ext.isNumber(-3)).toBe(true);
        });

        it("should return true with float", function() {
            expect(Ext.isNumber(1.75)).toBe(true);
        });

        it("should return true with negative float", function() {
            expect(Ext.isNumber(-4.75)).toBe(true);
        });

        it("should return true with Number.MAX_VALUE", function() {
            expect(Ext.isNumber(Number.MAX_VALUE)).toBe(true);
        });

        it("should return true with Number.MIN_VALUE", function() {
            expect(Ext.isNumber(Number.MIN_VALUE)).toBe(true);
        });

        it("should return true with Math.PI", function() {
            expect(Ext.isNumber(Math.PI)).toBe(true);
        });

        it("should return true with Number() contructor", function() {
            expect(Ext.isNumber(Number('3.1'))).toBe(true);
        });

        it("should return false with NaN", function() {
            expect(Ext.isNumber(Number.NaN)).toBe(false);
        });

        it("should return false with Number.POSITIVE_INFINITY", function() {
            expect(Ext.isNumber(Number.POSITIVE_INFINITY)).toBe(false);
        });

        it("should return false with Number.NEGATIVE_INFINITY", function() {
            expect(Ext.isNumber(Number.NEGATIVE_INFINITY)).toBe(false);
        });

        it("should return false with empty array", function() {
            expect(Ext.isNumber([])).toBe(false);
        });

        it("should return false with filled array", function() {
            expect(Ext.isNumber([1, 2, 3, 4])).toBe(false);
        });

        it("should return false with boolean true", function() {
            expect(Ext.isNumber(true)).toBe(false);
        });

        it("should return false with boolean false", function() {
            expect(Ext.isNumber(false)).toBe(false);
        });

        it("should return false with string", function() {
            expect(Ext.isNumber("foo")).toBe(false);
        });

        it("should return false with empty string", function() {
            expect(Ext.isNumber("")).toBe(false);
        });

        it("should return false with string containing a number", function() {
            expect(Ext.isNumber("1.0")).toBe(false);
        });

        it("should return false with undefined", function() {
            expect(Ext.isNumber(undefined)).toBe(false);
        });

        it("should return false with date", function() {
            expect(Ext.isNumber(new Date())).toBe(false);
        });

        it("should return false with empty object", function() {
            expect(Ext.isNumber({})).toBe(false);
        });

        it("should return false with node list", function() {
            expect(Ext.isNumber(document.getElementsByTagName('body'))).toBe(false);
        });
    });

    describe("Ext.isNumeric", function() {
        it("should return true with zero", function() {
            expect(Ext.isNumeric(0)).toBe(true);
        });

        it("should return true with non zero", function() {
            expect(Ext.isNumeric(4)).toBe(true);
        });

        it("should return true with negative integer", function() {
            expect(Ext.isNumeric(-3)).toBe(true);
        });

        it("should return true with float", function() {
            expect(Ext.isNumeric(1.75)).toBe(true);
        });

        it("should return true with negative float", function() {
            expect(Ext.isNumeric(-4.75)).toBe(true);
        });

        it("should return true with Number.MAX_VALUE", function() {
            expect(Ext.isNumeric(Number.MAX_VALUE)).toBe(true);
        });

        it("should return true with Number.MIN_VALUE", function() {
            expect(Ext.isNumeric(Number.MIN_VALUE)).toBe(true);
        });

        it("should return true with Math.PI", function() {
            expect(Ext.isNumeric(Math.PI)).toBe(true);
        });

        it("should return true with Number() contructor", function() {
            expect(Ext.isNumeric(Number('3.1'))).toBe(true);
        });

        it("should return false with NaN", function() {
            expect(Ext.isNumeric(Number.NaN)).toBe(false);
        });

        it("should return false with Number.POSITIVE_INFINITY", function() {
            expect(Ext.isNumeric(Number.POSITIVE_INFINITY)).toBe(false);
        });

        it("should return false with Number.NEGATIVE_INFINITY", function() {
            expect(Ext.isNumeric(Number.NEGATIVE_INFINITY)).toBe(false);
        });

        it("should return false with empty array", function() {
            expect(Ext.isNumeric([])).toBe(false);
        });

        it("should return false with filled array", function() {
            expect(Ext.isNumeric([1, 2, 3, 4])).toBe(false);
        });

        it("should return false with boolean true", function() {
            expect(Ext.isNumeric(true)).toBe(false);
        });

        it("should return false with boolean false", function() {
            expect(Ext.isNumeric(false)).toBe(false);
        });

        it("should return false with string", function() {
            expect(Ext.isNumeric("foo")).toBe(false);
        });

        it("should return false with empty string", function() {
            expect(Ext.isNumeric("")).toBe(false);
        });

        it("should return true with string containing a number", function() {
            expect(Ext.isNumeric("1.0")).toBe(true);
        });

        it("should return false with undefined", function() {
            expect(Ext.isNumeric(undefined)).toBe(false);
        });

        it("should return false with date", function() {
            expect(Ext.isNumeric(new Date())).toBe(false);
        });

        it("should return false with empty object", function() {
            expect(Ext.isNumeric({})).toBe(false);
        });

        it("should return false with node list", function() {
            expect(Ext.isNumeric(document.getElementsByTagName('body'))).toBe(false);
        });
    });

    describe("Ext.isObject", function() {
        it("should return false with empty array", function() {
            expect(Ext.isObject([])).toBe(false);
        });

        it("should return false with filled array", function() {
            expect(Ext.isObject([1, 2, 3, 4])).toBe(false);
        });

        it("should return false with boolean true", function() {
            expect(Ext.isObject(true)).toBe(false);
        });

        it("should return false with boolean false", function() {
            expect(Ext.isObject(false)).toBe(false);
        });

        it("should return false with string", function() {
            expect(Ext.isObject("foo")).toBe(false);
        });

        it("should return false with empty string", function() {
            expect(Ext.isObject("")).toBe(false);
        });

        it("should return false with number", function() {
            expect(Ext.isObject(1)).toBe(false);
        });

        it("should return false with null", function() {
            expect(Ext.isObject(null)).toBe(false);
        });

        it("should return false with undefined", function() {
            expect(Ext.isObject(undefined)).toBe(false);
        });

        it("should return false with date", function() {
            expect(Ext.isObject(new Date())).toBe(false);
        });

        it("should return true with empty object", function() {
            expect(Ext.isObject({})).toBe(true);
        });

        it("should return false with a DOM node", function() {
            expect(Ext.isObject(document.body)).toBe(false);
        });

        it("should return false with a Text node", function() {
            expect(Ext.isObject(document.createTextNode('test'))).toBe(false);
        });

        it("should return true with object with properties", function() {
            expect(Ext.isObject({
                foo: 1
            })).toBe(true);
        });

        it("should return true with object instance", function() {
            var stupidClass = function() {};

            expect(Ext.isObject(new stupidClass())).toBe(true);
        });

        it("should return true with new Object syntax", function() {
            expect(Ext.isObject(new Object())).toBe(true);
        });

        it("should return false with dom element", function() {
            expect(Ext.isObject(document.body)).toBe(false);
        });
    });

    describe("Ext.isPrimitive", function() {
        it("should return true with integer", function() {
            expect(Ext.isPrimitive(1)).toBe(true);
        });

        it("should return true with negative integer", function() {
            expect(Ext.isPrimitive(-21)).toBe(true);
        });

        it("should return true with float", function() {
            expect(Ext.isPrimitive(2.1)).toBe(true);
        });

        it("should return true with negative float", function() {
            expect(Ext.isPrimitive(-12.1)).toBe(true);
        });

        it("should return true with Number.MAX_VALUE", function() {
            expect(Ext.isPrimitive(Number.MAX_VALUE)).toBe(true);
        });

        it("should return true with Math.PI", function() {
            expect(Ext.isPrimitive(Math.PI)).toBe(true);
        });

        it("should return true with empty string", function() {
            expect(Ext.isPrimitive("")).toBe(true);
        });

        it("should return true with non empty string", function() {
            expect(Ext.isPrimitive("foo")).toBe(true);
        });

        it("should return true with boolean true", function() {
            expect(Ext.isPrimitive(true)).toBe(true);
        });

        it("should return true with boolean false", function() {
            expect(Ext.isPrimitive(false)).toBe(true);
        });

        it("should return false with null", function() {
            expect(Ext.isPrimitive(null)).toBe(false);
        });

        it("should return false with undefined", function() {
            expect(Ext.isPrimitive(undefined)).toBe(false);
        });

        it("should return false with object", function() {
            expect(Ext.isPrimitive({})).toBe(false);
        });

        it("should return false with object instance", function() {
            var stupidClass = function() {};
            expect(Ext.isPrimitive(new stupidClass())).toBe(false);
        });

        it("should return false with array", function() {
            expect(Ext.isPrimitive([])).toBe(false);
        });
    });

    describe("Ext.isString", function() {
        it("should return true with empty string", function() {
            expect(Ext.isString("")).toBe(true);
        });

        it("should return true with non empty string", function() {
            expect(Ext.isString("foo")).toBe(true);
        });

        it("should return true with String() syntax", function() {
            expect(Ext.isString(String(""))).toBe(true);
        });

        it("should return false with new String() syntax", function() { //should return an object that wraps the primitive
            expect(Ext.isString(new String(""))).toBe(false);
        });

        it("should return false with number", function() {
            expect(Ext.isString(1)).toBe(false);
        });

        it("should return false with boolean", function() {
            expect(Ext.isString(true)).toBe(false);
        });

        it("should return false with null", function() {
            expect(Ext.isString(null)).toBe(false);
        });

        it("should return false with undefined", function() {
            expect(Ext.isString(undefined)).toBe(false);
        });

        it("should return false with array", function() {
            expect(Ext.isString([])).toBe(false);
        });

        it("should return false with object", function() {
            expect(Ext.isString({})).toBe(false);
        });
    });

    describe("Ext.isTextNode", function() {
        it("should return false with empty array", function() {
            expect(Ext.isTextNode([])).toBe(false);
        });

        it("should return false with filled array", function() {
            expect(Ext.isTextNode([1, 2, 3, 4])).toBe(false);
        });

        it("should return false with boolean true", function() {
            expect(Ext.isTextNode(true)).toBe(false);
        });

        it("should return false with boolean false", function() {
            expect(Ext.isTextNode(false)).toBe(false);
        });

        it("should return false with string", function() {
            expect(Ext.isTextNode("foo")).toBe(false);
        });

        it("should return false with empty string", function() {
            expect(Ext.isTextNode("")).toBe(false);
        });

        it("should return false with number", function() {
            expect(Ext.isTextNode(1)).toBe(false);
        });

        it("should return false with null", function() {
            expect(Ext.isTextNode(null)).toBe(false);
        });

        it("should return false with undefined", function() {
            expect(Ext.isTextNode(undefined)).toBe(false);
        });

        it("should return false with date", function() {
            expect(Ext.isTextNode(new Date())).toBe(false);
        });

        it("should return false with empty object", function() {
            expect(Ext.isTextNode({})).toBe(false);
        });

        it("should return false with node list", function() {
            expect(Ext.isTextNode(document.getElementsByTagName('body'))).toBe(false);
        });

        it("should return false with element", function() {
           expect(Ext.isTextNode(document.body)).toBe(false);
        });

        it("should return true with TextNode", function() {
            var textNode = document.createTextNode('foobar');
            document.body.appendChild(textNode);
            expect(Ext.isTextNode(textNode)).toBe(true);
            document.body.removeChild(textNode);
        });
    });

    describe("Ext.clone", function() {
        var clone;

        afterEach(function() {
            clone = null;
        });

        it("should clone an array", function() {
            var array = [2,'5',[1,3,4]];
            clone = Ext.clone(array);
            expect(clone).toEqual(array);
            expect(clone).not.toBe(array);
        });

        it("should clone an object", function() {
            var object = {
                fn: function() {
                    return 1;
                },
                b: 2
            };
            clone = Ext.clone(object);
            expect(clone).toEqual(object);
            expect(clone).not.toBe(object);
        });

        it("should clone a date", function(){
            var date = new Date();
            clone = Ext.clone(date);
            expect(clone).toEqual(date);
            expect(clone).not.toBe(date);
        });

        it("should clone a dom node", function(){
            var node = document.createElement('DIV');
            document.body.appendChild(node);
            clone = Ext.clone(node);
            expect(clone.tagName).toEqual(clone.tagName);
            expect(clone.innerHTML).toEqual(clone.innerHTML);
            expect(clone).not.toBe(node);
            document.body.removeChild(node);
        });
        
        it("should return null for null items", function() {
        	expect(Ext.clone(null)).toBeNull();
        });
        
        it("should return undefined for undefined items", function() {
        	expect(Ext.clone(undefined)).toBeUndefined();
        });

        it("should not copy Ext.enumerable properties onto cloned object", function() {
            expect(Ext.clone({}).hasOwnProperty('toString')).toBe(false);
        });

        it("should copy same-named Ext.enumerable property onto cloned object", function() {
            expect(Ext.clone({toString: true}).hasOwnProperty('toString')).toBe(true);
            expect(Ext.clone({toString: true}).hasOwnProperty('valueOf')).toBe(false);
        });
    });

    describe('getUniqueGlobalNamespace', function() {
        it("should return an unique global namespace", function() {
            expect(Ext.getUniqueGlobalNamespace()).toBe("ExtBox1");
            try {
                delete window.ExtBox1;
            } catch(e) {
                window.ExtBox1 = undefined;
            }
        });
    });

    describe("elevateFunction", function() {
        // Note that there could be other timers called by the framework that could call the
        // Ext.elevateFunction wrapper. As such, we need to be sure that our function has been
        // called and not worry about any other timers that could have been queued up. We use
        // the local `elevated` var for this purpose.
        var elevated = false;

        beforeEach(function() {
            Ext.elevateFunction = function(fn, scope, args) {
                var ret;

                elevated = true;
                ret = fn.apply(scope, args || []);
                elevated = false;
                return ret;
            };
        });

        afterEach(function() {
            Ext.elevateFunction = null;
            elevated = false;
        });

        it("should call the elevateFunction when the onReadyEvent fires", function() {
            var Ready = Ext.env.Ready,
                fakeEvent = { type: 'load' },
                args;

            spyOn(Ext, 'elevateFunction');
            Ready.onReadyEvent(fakeEvent);
            expect(Ext.elevateFunction.callCount).toBe(1);
            args = Ext.elevateFunction.mostRecentCall.args;
            expect(args[0]).toBe(Ready.doReadyEvent);
            expect(args[1]).toBe(Ready);
            expect(args[2].length).toBe(1);
            expect(args[2][0]).toBe(fakeEvent);
        });

        it("should call the elevateFunction when a delegated dom event is fired", function() {
            var domPublisher = Ext.event.publisher.Dom.instance,
                fakeEvent = { type: 'click' },
                args;

            spyOn(Ext, 'elevateFunction');
            domPublisher.onDelegatedEvent(fakeEvent);
            expect(Ext.elevateFunction.callCount).toBe(1);
            args = Ext.elevateFunction.mostRecentCall.args;
            expect(args[0]).toBe(domPublisher.self.prototype.doDelegatedEvent);
            expect(args[1]).toBe(domPublisher);
            expect(args[2].length).toBe(1);
            expect(args[2][0]).toBe(fakeEvent);
        });

        it("should call the elevateFunction when a direct dom event is fired", function() {
            var domPublisher = Ext.event.publisher.Dom.instance,
                fakeEvent = { type: 'click' },
                args;

            spyOn(Ext, 'elevateFunction');
            domPublisher.onDirectEvent(fakeEvent);
            expect(Ext.elevateFunction.callCount).toBe(1);
            args = Ext.elevateFunction.mostRecentCall.args;
            expect(args[0]).toBe(domPublisher.self.prototype.doDirectEvent);
            expect(args[1]).toBe(domPublisher);
            expect(args[2].length).toBe(2);
            expect(args[2][0]).toBe(fakeEvent);
            expect(args[2][1]).toBe(false);
        });

        it("should call the elevateFunction when a direct capture dom event is fired", function() {
            var domPublisher = Ext.event.publisher.Dom.instance,
                fakeEvent = { type: 'click' },
                args;

            spyOn(Ext, 'elevateFunction');
            domPublisher.onDirectCaptureEvent(fakeEvent);
            expect(Ext.elevateFunction.callCount).toBe(1);
            args = Ext.elevateFunction.mostRecentCall.args;
            expect(args[0]).toBe(domPublisher.self.prototype.doDirectEvent);
            expect(args[1]).toBe(domPublisher);
            expect(args[2].length).toBe(2);
            expect(args[2][0]).toBe(fakeEvent);
            expect(args[2][1]).toBe(true);
        });

        it("should call the elevateFunction when Gesture#onTargetTouchMove is called", function() {
            var gesturePublisher = Ext.event.publisher.Gesture.instance,
                fakeEvent = { type: 'click' },
                args;

            spyOn(Ext, 'elevateFunction');
            gesturePublisher.onTargetTouchMove(fakeEvent);
            expect(Ext.elevateFunction.callCount).toBe(1);
            args = Ext.elevateFunction.mostRecentCall.args;
            expect(args[0]).toBe(gesturePublisher.self.prototype.doTargetTouchMove);
            expect(args[1]).toBe(gesturePublisher);
            expect(args[2].length).toBe(1);
            expect(args[2][0]).toBe(fakeEvent);
        });

        it("should call the elevateFunction when Gesture#onTargetTouchEnd is called", function() {
            var gesturePublisher = Ext.event.publisher.Gesture.instance,
                fakeEvent = { type: 'click' },
                args;

            spyOn(Ext, 'elevateFunction');
            gesturePublisher.onTargetTouchEnd(fakeEvent);
            expect(Ext.elevateFunction.callCount).toBe(1);
            args = Ext.elevateFunction.mostRecentCall.args;
            expect(args[0]).toBe(gesturePublisher.self.prototype.doTargetTouchEnd);
            expect(args[1]).toBe(gesturePublisher);
            expect(args[2].length).toBe(1);
            expect(args[2][0]).toBe(fakeEvent);
        });

        describe('timer callbacks', function () {
            var called = false,
                elevatedCalled = false,
                fn;

            beforeEach(function () {
                fn = function () {
                    elevatedCalled = elevated;
                    called = true;
                    expect(elevated).toBe(true);
                };
            });

            afterEach(function () {
                fn = null;
                called = elevatedCalled = false;
            });

            it("should call the elevateFunction when a buffered function is called", function() {
                var bufferedFn, args;

                runs(function() {
                    bufferedFn = Ext.Function.createBuffered(fn, 1, fakeScope, ['foo', 'bar']);
                    spyOn(Ext, 'elevateFunction').andCallThrough();
                    bufferedFn();
                });

                waitsFor(function() {
                    return called;
                });

                runs(function() {
                    expect(elevatedCalled).toBe(true);
                    expect(elevated).toBe(false);
                    args = Ext.elevateFunction.mostRecentCall.args;
                    expect(args[0]).toBe(fn);
                    expect(args[1]).toBe(fakeScope);
                    expect(args[2]).toEqual(['foo', 'bar']);
                });
            });

            it("should call the elevateFunction when a delayed function is called", function() {
                var delayedFn, args;

                runs(function() {
                    delayedFn = Ext.Function.createDelayed(fn, 1);
                    spyOn(Ext, 'elevateFunction').andCallThrough();
                    delayedFn('foo', 'bar');
                });

                waitsFor(function() {
                    return called;
                });

                runs(function() {
                    expect(elevatedCalled).toBe(true);
                    expect(elevated).toBe(false);
                    args = Ext.elevateFunction.mostRecentCall.args;
                    // not the original function - createDelayed uses a bound fn
                    expect(args[0] instanceof Function).toBe(true);
                    expect(args[1]).toBe(window);
                    expect(args[2]).toEqual(['foo', 'bar']);
                });
            });

            it("should call the elevateFunction when a throttled function is called", function() {
                var throttledFn, args;

                runs(function() {
                    throttledFn = Ext.Function.createThrottled(fn, 1, fakeScope);
                    spyOn(Ext, 'elevateFunction').andCallThrough();
                    throttledFn('foo', 'bar');
                });

                waitsFor(function() {
                    return called;
                });

                runs(function() {
                    expect(elevatedCalled).toBe(true);
                    expect(elevated).toBe(false);
                    args = Ext.elevateFunction.mostRecentCall.args;
                    // not the original function - createDelayed uses a bound fn
                    expect(args[0]).toBe(fn);
                    expect(args[1]).toBe(fakeScope);
                    expect(args[2]).toEqual(['foo', 'bar']);
                });
            });

            it("should call the elevateFunction when Ext.defer() is called", function() {
                var args;

                runs(function() {
                    Ext.defer(fn, 1, fakeScope, ['foo', 'bar']);
                    spyOn(Ext, 'elevateFunction').andCallThrough();
                });

                waitsFor(function() {
                    return called;
                });

                runs(function() {
                    expect(elevatedCalled).toBe(true);
                    expect(elevated).toBe(false);
                    args = Ext.elevateFunction.mostRecentCall.args;
                    // not the original function - defer uses a bound fn
                    expect(args[0] instanceof Function).toBe(true);
                    expect(args[1]).toBeUndefined();
                    expect(args[2]).toBeUndefined();
                });
            });

            it("should call the elevateFunction when Ext.interval() is called", function() {
                var args, interval;

                fn = Ext.Function.createSequence(fn, function () {
                    clearInterval(interval);
                });

                runs(function() {
                    interval = Ext.interval(fn, 100, fakeScope, ['foo', 'bar']);
                    spyOn(Ext, 'elevateFunction').andCallThrough();
                });

                waitsFor(function() {
                    return called;
                });

                runs(function() {
                    expect(elevatedCalled).toBe(true);
                    expect(elevated).toBe(false);
                    args = Ext.elevateFunction.mostRecentCall.args;
                    // not the original function - interval uses a bound fn
                    expect(args[0] instanceof Function).toBe(true);
                    expect(args[1]).toBeUndefined();
                    expect(args[2]).toBeUndefined();
                });
            });

            it("should call the elevateFunction when a requestAnimationFrame callback is called", function() {
                runs(function() {
                    spyOn(Ext, 'elevateFunction').andCallThrough();
                    Ext.Function.requestAnimationFrame(fn);
                });

                waitsFor(function() {
                    return called;
                });

                runs(function() {
                    expect(called).toBe(true);
                    expect(elevatedCalled).toBe(true);
                    expect(elevated).toBe(false);
                });
            });

            it("should call the elevateFunction when a createAnimationFrame callback is called", function() {
                var animFn, args;

                runs(function() {
                    animFn = Ext.Function.createAnimationFrame(fn, fakeScope);
                    spyOn(Ext, 'elevateFunction').andCallThrough();
                    animFn('foo', 'bar');
                });

                waitsFor(function() {
                    return called;
                });

                runs(function() {
                    expect(elevatedCalled).toBe(true);
                    expect(elevated).toBe(false);
                    args = Ext.elevateFunction.mostRecentCall.args;
                    // createAnimationFrame calls through to requestAnimationFrame, so the
                    // original fn/scope/args are not the ones passed to elevateFunction
                    expect(args[0] instanceof Function).toBe(true);
                    expect(args[1]).toBeUndefined();
                    expect(args[2]).toBeUndefined();
                });
            });
        });

        it("should call the elevate function when an Ext.callback function is called", function() {
            var called = false,
                animFn, args;

            function fn() {
                called = true;
            }

            runs(function() {
                spyOn(Ext, 'elevateFunction').andCallThrough();
                Ext.callback(fn, fakeScope);
            });

            waitsFor(function() {
                return called;
            });

            runs(function() {
                expect(Ext.elevateFunction.callCount).toBe(1);
                args = Ext.elevateFunction.mostRecentCall.args;
                expect(args[0]).toBe(fn);
                expect(args[1]).toBe(fakeScope);
            });
        });

        it("should call the elevate function when an Ext.callback function is called with args", function() {
            var called = false,
                animFn, args;

            function fn() {
                called = true;
            }

            runs(function() {
                spyOn(Ext, 'elevateFunction').andCallThrough();
                Ext.callback(fn, fakeScope, ['foo', 'bar']);
            });

            waitsFor(function() {
                return called;
            });

            runs(function() {
                expect(Ext.elevateFunction.callCount).toBe(1);
                args = Ext.elevateFunction.mostRecentCall.args;
                expect(args[0]).toBe(fn);
                expect(args[1]).toBe(fakeScope);
                expect(args[2]).toEqual(['foo', 'bar']);
            });
        });
    });
});
