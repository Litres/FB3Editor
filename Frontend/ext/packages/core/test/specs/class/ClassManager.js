describe("Ext.ClassManager", function() {
    var manager = Ext.ClassManager,
        cls, emptyFn = function(){};



    beforeEach(function() {
        manager.enableNamespaceParseCache = false;
        window.My = {
            awesome: {
                Class: function(){console.log(11);},
                Class1: function(){console.log(12);},
                Class2: function(){console.log(13);}
            },
            cool: {
                AnotherClass: function(){console.log(21);},
                AnotherClass1: function(){console.log(22);},
                AnotherClass2: function(){console.log(23);}
            }
        };
    });

    afterEach(function() {
        try {
            delete window.Something;
            delete window.My;
            delete window.I;
            delete window.Test;
        } catch (e) {
            window.Something = undefined;
            window.My = undefined;
            window.I = undefined;
            window.Test = undefined;
        }
        manager.enableNamespaceParseCache = true;
    });

    describe("exist", function() {
        it("should return whether a single class exists", function() {
            expect(manager.isCreated('My.notexisting.Class')).toBe(false);
            expect(manager.isCreated('My.awesome.Class')).toBe(true);
        });
    });

    describe("loader preprocessor", function() {
        beforeEach(function() {
            cls = function(){};
        });

        it("should load and replace string class names with objects", function() {
            var data = {
                    extend: 'My.awesome.Class',
                    mixins: {
                        name1: My.cool.AnotherClass,
                        name2: 'My.cool.AnotherClass1'
                    }
                },
                expected = {
                    extend: My.awesome.Class,
                    mixins: {
                        name1: My.cool.AnotherClass,
                        name2: My.cool.AnotherClass1
                    }
                },
                classNames;


            spyOn(Ext.Loader, 'require').andCallFake(function(classes, fn) {
                classNames = classes;
                fn();
            });

            Ext.Class.getPreprocessor('loader').fn(cls, data, emptyFn, emptyFn);

            expect(Ext.Loader.require).toHaveBeenCalled();
            expect(classNames).toEqual(['My.awesome.Class', 'My.cool.AnotherClass1']);
            expect(data).toEqual(expected);
        });
    });

    describe("create", function() {
        var subClass, parentClass, mixinClass1, mixinClass2, subSubClass;

        beforeEach(function() {
            mixinClass1 = manager.create('I.am.the.MixinClass1', {
                config: {
                    mixinConfig: 'mixinConfig'
                },

                constructor: function() {
                    this.mixinConstructor1Called = true;
                },

                mixinProperty1: 'mixinProperty1',

                mixinMethod1: function() {
                    this.mixinMethodCalled = true;
                }
            });

            mixinClass2 = manager.create('I.am.the.MixinClass2', {
                constructor: function() {
                    this.mixinConstructor2Called = true;
                },

                mixinProperty2: 'mixinProperty2',

                mixinMethod2: function() {
                    this.mixinMethodCalled = true;
                }
            });

            parentClass = manager.create('I.am.the.ParentClass', {
                alias: ['parentclass', 'superclass'],

                mixins: {
                    mixin1: 'I.am.the.MixinClass1'
                },

                config: {
                    name: 'parentClass',
                    isCool: false,
                    members: {
                        abe: 'Abraham Elias',
                        ed: 'Ed Spencer'
                    },
                    hobbies: ['football', 'bowling']
                },

                onClassExtended: function(subClass, data) {
                    subClass.onClassExtendedCalled = true;
                },

                constructor: function(config) {
                    this.initConfig(config);

                    this.parentConstructorCalled = true;

                    this.mixins.mixin1.constructor.apply(this, arguments);
                },

                parentProperty: 'parentProperty',

                parentMethod: function() {
                    this.parentMethodCalled = true;
                }
            });

            subClass = manager.create('I.am.the.SubClass', {
                alias: 'subclass',

                extend: 'I.am.the.ParentClass',

                mixins: {
                    mixin1: 'I.am.the.MixinClass1',
                    mixin2: 'I.am.the.MixinClass2'
                },
                config: {
                    name: 'subClass',
                    isCool: true,
                    members: {
                        jacky: 'Jacky Nguyen',
                        tommy: 'Tommy Maintz'
                    },
                    hobbies: ['sleeping', 'eating', 'movies'],
                    isSpecial: true
                },
                constructor: function() {
                    this.subConstrutorCalled = true;

                    this.superclass.constructor.apply(this, arguments);

                    this.mixins.mixin2.constructor.apply(this, arguments);
                },
                myOwnMethod: function() {
                    this.myOwnMethodCalled = true;
                }
            });
        });
        
        afterEach(function() {
            Ext.undefine('I.am.the.MixinClass1');
            Ext.undefine('I.am.the.MixinClass2');
            Ext.undefine('I.am.the.ParentClass');
            Ext.undefine('I.am.the.SubClass');
        });

        it("should create the namespace", function() {
            expect(I).toBeDefined();
            expect(I.am).toBeDefined();
            expect(I.am.the).toBeDefined();
            expect(I.am.the.SubClass).toBeDefined();
        });

        it("should get className", function() {
            expect(Ext.getClassName(subClass)).toEqual('I.am.the.SubClass');
        });

        describe("addStatics", function() {
            it("single with name - value arguments", function() {
                var called = false;

                subClass.addStatics({
                    staticMethod: function(){
                        called = true;
                    }
                });

                expect(subClass.staticMethod).toBeDefined();
                subClass.staticMethod();

                expect(called).toBeTruthy();
            });

            it("multiple with object map argument", function() {
                subClass.addStatics({
                    staticProperty: 'something',
                    staticMethod: function(){}
                });

                expect(subClass.staticProperty).toEqual('something');
                expect(subClass.staticMethod).toBeDefined();
            });
        });

        describe("mixin", function() {
            it("should have all properties of mixins", function() {
                var obj = new subClass();
                expect(obj.mixinProperty1).toEqual('mixinProperty1');
                expect(obj.mixinProperty2).toEqual('mixinProperty2');
                expect(obj.mixinMethod1).toBeDefined();
                expect(obj.mixinMethod2).toBeDefined();
                expect(obj.config.mixinConfig).toEqual('mixinConfig');
            });
        });

        describe("config", function() {
            it("should merge properly", function() {
                var obj = new subClass();

                expect(obj.config).toEqual({
                    mixinConfig: 'mixinConfig',
                    name: 'subClass',
                    isCool: true,
                    members: {
                        abe: 'Abraham Elias',
                        ed: 'Ed Spencer',
                        jacky: 'Jacky Nguyen',
                        tommy: 'Tommy Maintz'
                    },
                    hobbies: ['sleeping', 'eating', 'movies'],
                    isSpecial: true
                });
            });

            it("should apply default config", function() {
                var obj = new subClass();

                expect(obj.getName()).toEqual('subClass');
                expect(obj.getIsCool()).toEqual(true);
                expect(obj.getHobbies()).toEqual(['sleeping', 'eating', 'movies']);
            });

            it("should apply with supplied config", function() {
                var obj = new subClass({
                    name: 'newName',
                    isCool: false,
                    members: {
                        aaron: 'Aaron Conran'
                    }
                });

                expect(obj.getName()).toEqual('newName');
                expect(obj.getIsCool()).toEqual(false);
                expect(obj.getMembers().aaron).toEqual('Aaron Conran');
            });
        });

        describe("overriden methods", function() {
            it("should call self constructor", function() {
                var obj = new subClass();
                expect(obj.subConstrutorCalled).toBeTruthy();
            });

            it("should call parent constructor", function() {
                var obj = new subClass();
                expect(obj.parentConstructorCalled).toBeTruthy();
            });

            it("should call mixins constructors", function() {
                var obj = new subClass();
                expect(obj.mixinConstructor1Called).toBeTruthy();
                expect(obj.mixinConstructor2Called).toBeTruthy();
            });
        });

        describe("alias", function() {
            it("should store alias", function() {
                expect(manager.getByAlias('subclass')).toBe(subClass);
            });

            it("should store multiple aliases", function() {
                expect(manager.getByAlias('parentclass')).toBe(parentClass);
                expect(manager.getByAlias('superclass')).toBe(parentClass);
            });
        });
    });

    describe('define', function () {
        it('should allow anonymous classes', function () {
            var T = Ext.define(null, function (Self) {
                return {
                    constructor: function () {
                        this.foo = 1;
                        this.T = Self;
                    }
                }
            });
            
            var obj = new T();
            
            expect(obj.foo).toBe(1);
            expect(T).toBe(obj.self);
            expect(obj.T).toBe(T);
            expect(obj.$className).toBeNull();
        })
    });

    describe("instantiate", function() {
        beforeEach(function() {
            manager.create('Test.stuff.Person', {
                alias: 'person',

                constructor: function(name, age, sex) {
                    this.name = name;
                    this.age = age;
                    this.sex = sex;
                },

                eat: function(food) {
                    this.eatenFood = food;
                }
            });

            manager.create('Test.stuff.Developer', {
                alias: 'developer',

                extend: 'Test.stuff.Person',

                constructor: function(isGeek, name, age, sex) {
                    this.isGeek = isGeek;

                    return this.superclass.constructor.apply(this, arguments);
                },

                code: function(language) {
                    this.languageCoded = language;
                    this.eat('bugs');
                }
            });
        });

        afterEach(function() {
            Ext.undefine('Test.stuff.Person');
            Ext.undefine('Test.stuff.Developer');
        });

        it("should create the instance by full class name", function() {
            var me = Ext.create('Test.stuff.Person', 'Jacky', 24, 'male');
            expect(me instanceof Test.stuff.Person).toBe(true);
        });

        it("should create the instance by alias", function() {
            var me = manager.instantiateByAlias('person', 'Jacky', 24, 'male');
            expect(me instanceof Test.stuff.Person).toBe(true);
        });

        it("should pass all arguments to the constructor", function() {
            var me = manager.instantiateByAlias('person', 'Jacky', 24, 'male');
            expect(me.name).toBe('Jacky');
            expect(me.age).toBe(24);
            expect(me.sex).toBe('male');
        });

        it("should have all methods in prototype", function() {
            var me = manager.instantiateByAlias('person', 'Jacky', 24, 'male');
            me.eat('rice');

            expect(me.eatenFood).toBe('rice');
        });

        it("should works with inheritance", function() {
            var me = manager.instantiateByAlias('developer', true, 'Jacky', 24, 'male');
            me.code('javascript');

            expect(me.languageCoded).toBe('javascript');
            expect(me.eatenFood).toBe('bugs');
        });
    });

    describe("post-processors", function() {
        afterEach(function() {
            Ext.undefine('Something.Cool');
        });

        xdescribe("uses", function() {
            //expect(Something.Cool).toBeDefined();
            //expect(Something.Cool instanceof test).toBeTruthy();
        });

        describe("singleton", function() {
            it("should create the instance namespace and return the class", function() {
                var test = Ext.define('Something.Cool', {
                    singleton: true,
                    someMethod: function() {
                        this.someMethodCalled = true;
                    },
                    someProperty: 'something'
                });

                expect(Something.Cool).toBeDefined();
                expect(Something.Cool instanceof test).toBeTruthy();
            });
        });

        describe("alias xtype", function() {
            it("should set xtype as a static class property", function() {
                var test = Ext.define('Something.Cool', {
                    alias: 'widget.cool'
                });

                expect(Something.Cool.xtype).toEqual('cool');
            });
        });

        describe("alternate", function() {
            it("should create the alternate with a string for alternateClassName property", function() {
                Ext.define('Something.Cool', {
                    alternateClassName: 'Something.CoolAsWell',

                    someMethod: function() {
                        this.someMethodCalled = true;
                    },

                    someProperty: 'something'
                });

                expect(Something.CoolAsWell).toBeDefined();
                expect(Something.CoolAsWell).toBe(Something.Cool);
            });

            it("should create the alternate with an array for alternateClassName property", function() {
                Ext.define('Something.Cool', {
                    alternateClassName: ['Something.CoolAsWell', 'Something.AlsoCool']
                });

                expect(Something.CoolAsWell).toBe(Something.Cool);
                expect(Something.AlsoCool).toBe(Something.Cool);
            });
        });
    });

    describe("Ext.namespace", function() {
        var w = window;

        function undo (name) {
            if (Ext.isIE8) {
                w[name] = undefined;
            } else {
                delete w[name];
            }
        }

        it("should create a single top level namespace", function() {
            Ext.namespace('FooTest1');

            expect(w.FooTest1).toBeDefined();

            undo('FooTest1');
        });

        it("should create multiple top level namespace", function() {
            Ext.namespace('FooTest2', 'FooTest3', 'FooTest4');

            expect(w.FooTest2).toBeDefined();
            expect(w.FooTest3).toBeDefined();
            expect(w.FooTest4).toBeDefined();

            undo('FooTest2');
            undo('FooTest3');
            undo('FooTest4');
        });

        it("should create a chain of namespaces, starting from a top level", function() {
            Ext.namespace('FooTest5', 'FooTest5.ns1', 'FooTest5.ns1.ns2', 'FooTest5.ns1.ns2.ns3');

            expect(w.FooTest5).toBeDefined();
            expect(w.FooTest5.ns1).toBeDefined();
            expect(w.FooTest5.ns1.ns2).toBeDefined();
            expect(w.FooTest5.ns1.ns2.ns3).toBeDefined();

            undo('FooTest5');
        });

        it("should create lower level namespaces without first defining the top level", function() {
            Ext.namespace('FooTest6.ns1', 'FooTest7.ns2');

            expect(w.FooTest6).toBeDefined();
            expect(w.FooTest6.ns1).toBeDefined();
            expect(w.FooTest7).toBeDefined();
            expect(w.FooTest7.ns2).toBeDefined();

            undo('FooTest6');
            undo('FooTest7');
        });

        it("should create a lower level namespace without defining the middle level", function() {
            Ext.namespace('FooTest8', 'FooTest8.ns1.ns2');

            expect(w.FooTest8).toBeDefined();
            expect(w.FooTest8.ns1).toBeDefined();
            expect(w.FooTest8.ns1.ns2).toBeDefined();

            undo('FooTest8');
        });

        it ("should not overwritte existing namespace", function() {
            Ext.namespace('FooTest9');

            FooTest9.prop1 = 'foo';

            Ext.namespace('FooTest9');

            expect(FooTest9.prop1).toEqual("foo");

            undo('FooTest9');
        });
    });
});
