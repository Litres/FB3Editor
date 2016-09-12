describe("Ext.direct.RemotingProvider", function() {
    var RP = Ext.direct.RemotingProvider,
        provider,
        
        api = {
            actions: {
                "TestAction": [{
                    len:  1,
                    name: "echo"
                },{
                    len:  1,
                    name: "directFail"
                }, {
                    name: 'directForm',
                    formHandler: true
                }, {
                    len: 1,
                    name: 'directMetaNamed',
                    metadata: {
                        params: [],
                        strict: false
                    }
                }, {
                    len: 1,
                    name: 'directMetaOrdered',
                    metadata: {
                        len: 2
                    }
                }, {
                    name: 'directMetaFormNamed',
                    formHandler: true,
                    metadata: {
                        params: [],
                        strict: false
                    }
                }, {
                    name: 'directMetaFormOrdered',
                    formHandler: true,
                    metadata: {
                        len: 2
                    }
                }],
                
                "TestAction.Foo": [{
                    len:  0,
                    name: "foo"
                }],
                
                "TestAction.Foo.Bar": [{
                    len:  0,
                    name: "bar"
                }],
                
                "TestAction.Foo.Bar.Baz": [{
                    len:  0,
                    name: "baz"
                }],
                
                "TestAction.Foo.Qux": [{
                    len:  0,
                    name: "qux"
                }]
            },
            
            namespace: "Direct.foo.bar",
            type: "remoting",
            url: "/router",
            id: "foo"
        },
        
        directMethods = {
            echo: function(value) {
                return value;
            },
            
            directFail: function(value) {
                return {
                    type: 'exception'
                };
            },
            
            directForm: function(form) {
                return {
                    success: true,
                    data: form
                };
            },
            
            directMetaNamed: function(data, metadata) {
                return {
                    data: data,
                    metadata: metadata
                }
            },
            
            directMetaOrdered: function(data, metadata) {
                return {
                    data: data,
                    metadata: metadata
                }
            },
            
            directMetaFormNamed: function(form, metadata) {
                return {
                    success: true,
                    data: form,
                    metadata: metadata
                }
            },
            
            directMetaFormOrdered: function(form, metadata) {
                return {
                    success: true,
                    data: form,
                    metadata: metadata
                }
            },
            
            foo: function() {
                return 'foo';
            },
            
            bar: function() {
                return 'bar';
            },
            
            baz: function() {
                return 'baz';
            },
            
            qux: function() {
                return 'qux';
            }
        };
    
    // This simulation stub is *asynchronous*
    function simulateDirectRequest(options) {
        var callback = options.callback,
            scope = options.scope,
            transaction = options.transaction,
            isForm = options.form !== undefined,
            isUpload = options.isUpload,
            arg = {},
            data, tid, action, method, arg, fn, success,
            result, response, xhr, opt, metadata;
        
        if (isForm) {
            data     = options.params;
            tid      = data.extTID;
            action   = data.extAction;
            method   = data.extMethod;
            metadata = data.extMetadata;
            
            // Collect the input field values
            Ext.fly(options.form).select('input').each(function(el, c, idx) { 
                this[el.dom.name] = el.dom.value;
            }, arg);
            arg = [arg];
        }
        else {
            data     = options.jsonData;
            tid      = data.tid;
            action   = data.action;
            method   = data.method;
            arg      = data.data || [];
            metadata = data.metadata;
        }
        
        fn = directMethods[method];
        
        // TODO Come up with something less hacky
        if (/^directMeta/.test(method)) {
            arg.push(metadata);
        }
        
        if (options.timeout === 666) {
            response = {
                type: 'exception',
                tid: tid,
                message: "Can't connect to the server"
            };
            
            success = false;
        }
        else {
            try {
                result   = fn.apply({}, arg);
                response = {
                    type: 'rpc',
                    tid: tid,
                    action: action,
                    method: method,
                    result: result
                };
            }
            catch (e) {
                // Direct exception handling here
                response = {
                    type: 'exception',
                    tid: tid,
                    message: e.toString(),
                    where: 'internal'
                };
            }
            
            // Success only means *communication* success
            success = true;
        }
        
        xhr = {
            responseText: Ext.encode(response)
        };
        
        opt = {
            transaction: transaction
        };
        
        Ext.callback(callback, scope, [opt, success, xhr], 1);
    }
        
    beforeEach(function() {
        provider = new RP(api);
    });
    
    afterEach(function() {
        if (provider) {
            provider.destroy();
        }
        
        Ext.direct.Manager.clearAllMethods();
        
        provider = null;
        
        try {
            delete window.Direct;
        }
        catch (e) {
            window.Direct = undefined;
        }
    });
    
    describe("handles namespaces:", function() {
        var ns;
        
        it("creates namespace for itself if passed a string", function() {
            expect(Direct.foo.bar).toBeDefined();
        });
        
        it("doesn't create nested objects until it's connected", function() {
            expect(Direct.foo.bar).toEqual({});
        });
        
        describe("creates nested namespaces after it's connected:", function() {
            beforeEach(function() {
                provider.connect();
                ns = Direct.foo.bar;
            });
            
            it("creates TestAction", function() {
                expect(ns.TestAction).toBeDefined();
            });
            
            it("creates TestAction.Foo", function() {
                expect(ns.TestAction.Foo).toBeDefined();
            });
            
            it("creates TestAction.Foo.Bar", function() {
                expect(ns.TestAction.Foo.Bar).toBeDefined();
            });
            
            it("creates TestAction.Foo.Bar.Baz", function() {
                expect(ns.TestAction.Foo.Bar.Baz).toBeDefined();
            });
            
            it("creates TestAction.Foo.Qux", function() {
                expect(ns.TestAction.Foo.Qux).toBeDefined();
            });
        });
        
        describe("handles nested namespaces the old way:", function() {
            beforeEach(function() {
                provider.disableNestedActions = true;
                provider.connect();
                ns = Direct.foo.bar;
            });
            
            it("creates TestAction", function() {
                expect(ns.TestAction).toBeDefined();
            });
            
            it("creates TestAction.Foo", function() {
                expect(ns['TestAction.Foo']).toBeDefined();
                // AND
                expect(ns.TestAction.Foo).not.toBeDefined();
            });
            
            it("creates TestAction.Foo.Bar", function() {
                expect(ns['TestAction.Foo.Bar']).toBeDefined();
            });
            
            it("creates TestAction.Foo.Bar.Baz", function() {
                expect(ns['TestAction.Foo.Bar.Baz']).toBeDefined();
            });
            
            it("creates TestAction.Foo.Qux", function() {
                expect(ns['TestAction.Foo.Qux']).toBeDefined();
            });
        });
    });
    
    describe("handles remoting methods:", function() {
        var ns;
        
        function checkFn(fn) {
            expect( Ext.isFunction(fn) ).toBeTruthy();
        };
        
        beforeEach(function() {
            provider.connect();
            ns = Direct.foo.bar;
        });
    
        it("has Foo.foo", function() {
            checkFn(ns.TestAction.Foo.foo);
        });
        
        it("has Foo.Bar.bar", function() {
            checkFn(ns.TestAction.Foo.Bar.bar);
        });
        
        it("has Foo.Bar.Baz.baz", function() {
            checkFn(ns.TestAction.Foo.Bar.Baz.baz);
        });
        
        it("has Foo.Qux.qux", function() {
            checkFn(ns.TestAction.Foo.Qux.qux);
        });
    });

    describe("runs remoting methods:", function() {
        var ns, echo, options, handler;
        
        function echoStatus(result, event) {
            this.echo = event.status;
        }
        
        function echoResult(result, event) {
            if (event.status) {
                this.echo = result;
            }
        }
        
        function echoFormResult(request, result) {
            this.echo = result.result;
        }
        
        function echoResultAndOptions(result, event, success, options) {
            if (success) {
                this.echo = result;
                this.options = options;
            }
        }
        
        function returnFalse() {
            return false;
        }
        
        function checkEcho() {
            return Ext.isDefined(this.echo);
        }
        
        function checkHandler() {
            return !!handler.callCount;
        }
        
        function waitForEcho(fn, desc, timeout) {
            fn      = fn   || checkEcho;
            desc    = desc || 'callback never fired';
            timeout = timeout != null ? timeout : 100;
            
            waitsFor(fn, desc, timeout);
        }
        
        function expectEcho(want) {
            runs(function() {
                expect(this.echo).toEqual(want);
            });
        }
        
        beforeEach(function() {
            echo    = undefined;
            options = undefined;
            
            spyOn(Ext.Ajax, 'request').andCallFake(simulateDirectRequest);
            
            provider.connect();
            ns = Direct.foo.bar;
            
            handler = jasmine.createSpy('event handler');
        });
        
        afterEach(function() {
            handler = undefined;
        });
        
        describe("handles call mechanics", function() {
            describe("call batching", function() {
                afterEach(function() {
                    // Transactions in this suite have no chance of finishing,
                    // so we clean them up manually
                    if (provider.callTask) {
                        provider.callTask.cancel();
                    }
                    
                    Ext.direct.Manager.transactions.clear();
                });
                
                it("should batch calls within specified enableBuffer timeout", function() {
                    var options, baseTid;
                
                    runs(function() {
                        Ext.Ajax.request.andCallFake(function(opt) {
                            options = opt;
                        });

                        baseTid = Ext.direct.Transaction.TRANSACTION_ID;
                    
                        ns.TestAction.echo('foo', Ext.emptyFn);
                        ns.TestAction.echo('bar', Ext.emptyFn);
                    });
                
                    waitsFor(function() { return !!options }, 'options never modified', 20);
                
                    runs(function() {
                        expect(options.jsonData).toEqual([{
                            action: 'TestAction',
                            method: 'echo',
                            type:   'rpc',
                            tid:    baseTid + 1,
                            data:   ['foo']
                        }, {
                            action: 'TestAction',
                            method: 'echo',
                            type:   'rpc',
                            tid:    baseTid + 2,
                            data:   ['bar']
                        }]);
                    });
                });
                
                it("should run calls with specified timeout w/o batching", function() {
                    var options = [],
                        baseTid;
                
                    runs(function() {
                        Ext.Ajax.request.andCallFake(function(opt) {
                            options.push(opt);
                        });

                        provider.enableBuffer = 200;
                        baseTid = Ext.direct.Transaction.TRANSACTION_ID;
                    
                        ns.TestAction.echo('baz', Ext.emptyFn);
                        ns.TestAction.echo('qux', Ext.emptyFn, this, { timeout: 1 });
                    });
                
                    waitsFor(function() { return !!options }, 'options never modified', 20);
                
                    runs(function() {
                        expect(options.length).toBe(1);
                        // AND
                        expect(options[0].jsonData).toEqual({
                            action: 'TestAction',
                            method: 'echo',
                            type:   'rpc',
                            tid:    baseTid + 2,
                            data:   ['qux']
                        });
                    });
                });
                
                it("should run calls instantly with disableBatching", function() {
                    var options = [],
                        baseTid;
                
                    runs(function() {
                        Ext.Ajax.request.andCallFake(function(opt) {
                            options.push(opt);
                        });

                        provider.enableBuffer = 200;
                        baseTid = Ext.direct.Transaction.TRANSACTION_ID;
                        
                        ns.TestAction.echo('baz', Ext.emptyFn);
                        
                        ns.TestAction.echo.$directCfg.method.disableBatching = true;
                        ns.TestAction.echo('qux', Ext.emptyFn);
                    });
                
                    waitsFor(function() { return !!options }, 'options never modified', 20);
                
                    runs(function() {
                        expect(options.length).toBe(1);
                        // AND
                        expect(options[0].jsonData).toEqual({
                            action: 'TestAction',
                            method: 'echo',
                            type:   'rpc',
                            tid:    baseTid + 2,
                            data:   ['qux']
                        });
                    });
                });
                
                it("should run calls instantly with enableBuffer = false", function() {
                    var option, baseTid;
                    
                    Ext.Ajax.request.andCallFake(function(opt) {
                        options = opt;
                    });
                    
                    provider.enableBuffer = false;
                    baseTid = Ext.direct.Transaction.TRANSACTION_ID;
                    
                    ns.TestAction.echo('fred', Ext.emptyFn);
                    
                    expect(options.jsonData).toEqual({
                        action: 'TestAction',
                        method: 'echo',
                        type: 'rpc',
                        tid: baseTid + 1,
                        data: ['fred']
                    });
                });
                
                describe("bufferLimit", function() {
                    var options, baseTid;
                    
                    beforeEach(function() {
                        options = [];
                        
                        Ext.Ajax.request.andCallFake(function(opt) {
                            options.push(opt);
                        });
                    
                        provider.enableBuffer = 200;
                        provider.bufferLimit = 3;
                    
                        baseTid = Ext.direct.Transaction.TRANSACTION_ID;
                    });
                    
                    it("should batch calls up to bufferLimit", function() {
                        runs(function() {
                            ns.TestAction.echo('fee', Ext.emptyFn);
                            ns.TestAction.echo('fie', Ext.emptyFn);
                            ns.TestAction.echo('foe', Ext.emptyFn);
                            ns.TestAction.echo('foo', Ext.emptyFn);
                        });
                        
                        waitsFor(function() {
                            return !!options.length;
                        }, 'options never modified', 20);
                        
                        runs(function() {
                            expect(options.length).toBe(1);
                            
                            expect(options[0].jsonData).toEqual([{
                                action: 'TestAction',
                                method: 'echo',
                                type:   'rpc',
                                tid:    baseTid + 1,
                                data:   ['fee']
                            }, {
                                action: 'TestAction',
                                method: 'echo',
                                type:   'rpc',
                                tid:    baseTid + 2,
                                data:   ['fie']
                            }, {
                                action: 'TestAction',
                                method: 'echo',
                                type:   'rpc',
                                tid:    baseTid + 3,
                                data:   ['foe']
                            }]);
                        });
                    });
                    
                    it("should make 2 batched requests for 6 calls", function() {
                        runs(function() {
                            ns.TestAction.echo('frobbe', Ext.emptyFn);
                            ns.TestAction.echo('throbbe', Ext.emptyFn);
                            ns.TestAction.echo('gurgle', Ext.emptyFn);
                            ns.TestAction.echo('bonzo', Ext.emptyFn);
                            ns.TestAction.echo('mymse', Ext.emptyFn);
                            ns.TestAction.echo('splurge', Ext.emptyFn);
                        });
                        
                        waitsFor(function() {
                            return !!options.length;
                        }, 'options never modified', 20);
                        
                        runs(function() {
                            expect(options.length).toBe(2);
                            
                            expect(options[0].jsonData).toEqual([{
                                action: 'TestAction',
                                method: 'echo',
                                type:   'rpc',
                                tid:    baseTid + 1,
                                data:   ['frobbe']
                            }, {
                                action: 'TestAction',
                                method: 'echo',
                                type:   'rpc',
                                tid:    baseTid + 2,
                                data:   ['throbbe']
                            }, {
                                action: 'TestAction',
                                method: 'echo',
                                type:   'rpc',
                                tid:    baseTid + 3,
                                data:   ['gurgle']
                            }]);
                            
                            expect(options[1].jsonData).toEqual([{
                                action: 'TestAction',
                                method: 'echo',
                                type:   'rpc',
                                tid:    baseTid + 4,
                                data:   ['bonzo']
                            }, {
                                action: 'TestAction',
                                method: 'echo',
                                type:   'rpc',
                                tid:    baseTid + 5,
                                data:   ['mymse']
                            }, {
                                action: 'TestAction',
                                method: 'echo',
                                type:   'rpc',
                                tid:    baseTid + 6,
                                data:   ['splurge']
                            }]);
                        });
                    });
                    
                    it("should make 3 batched requests for 7 calls", function() {
                        runs(function() {
                            ns.TestAction.echo('Grumpy', Ext.emptyFn);
                            ns.TestAction.echo('Sleepy', Ext.emptyFn);
                            ns.TestAction.echo('Dopey', Ext.emptyFn);
                            ns.TestAction.echo('Bashful', Ext.emptyFn);
                            ns.TestAction.echo('Sneezy', Ext.emptyFn);
                            ns.TestAction.echo('Happy', Ext.emptyFn);
                            ns.TestAction.echo('Doc', Ext.emptyFn);
                        });
                        
                        waitsFor(function() {
                            return options.length === 3;
                        }, '3 Ajax requests', 300);
                        
                        runs(function() {
                            expect(options.length).toBe(3);
                            
                            expect(options[0].jsonData).toEqual([{
                                action: 'TestAction',
                                method: 'echo',
                                type:   'rpc',
                                tid:    baseTid + 1,
                                data:   ['Grumpy']
                            }, {
                                action: 'TestAction',
                                method: 'echo',
                                type:   'rpc',
                                tid:    baseTid + 2,
                                data:   ['Sleepy']
                            }, {
                                action: 'TestAction',
                                method: 'echo',
                                type:   'rpc',
                                tid:    baseTid + 3,
                                data:   ['Dopey']
                            }]);
                            
                            expect(options[1].jsonData).toEqual([{
                                action: 'TestAction',
                                method: 'echo',
                                type:   'rpc',
                                tid:    baseTid + 4,
                                data:   ['Bashful']
                            }, {
                                action: 'TestAction',
                                method: 'echo',
                                type:   'rpc',
                                tid:    baseTid + 5,
                                data:   ['Sneezy']
                            }, {
                                action: 'TestAction',
                                method: 'echo',
                                type:   'rpc',
                                tid:    baseTid + 6,
                                data:   ['Happy']
                            }]);
                            
                            expect(options[2].jsonData).toEqual({
                                action: 'TestAction',
                                method: 'echo',
                                type:   'rpc',
                                tid:    baseTid + 7,
                                data:   ['Doc']
                            });
                        });
                    });
                });
            });
            
            describe("call related events", function() {
                it("fires 'beforecall' event", function() {
                    runs(function() {
                        provider.on('beforecall', handler);
                        
                        ns.TestAction.echo('fred', Ext.emptyFn);
                    });
                    
                    waitsFor(checkHandler, 'event handler never fired', 20);
                    
                    runs(function() {
                        expect(handler).toHaveBeenCalled();
                    });

                    waits(35);
                });
                
                it("fires 'call' event", function() {
                    runs(function() {
                        provider.on('call', handler);
                        
                        ns.TestAction.echo('plugh', Ext.emptyFn);
                    });
                    
                    waitsFor(checkHandler, 'event handler never fired', 20);
                    
                    runs(function() {
                        expect(handler).toHaveBeenCalled();
                    });
                    
                    waits(35);
                });
                
                it("cancels request when 'beforecall' handler returns false", function() {
                    runs(function() {
                        handler.andCallFake(returnFalse);
                        
                        provider.on('beforecall', handler);
                        
                        ns.TestAction.echo('mymse', Ext.emptyFn);
                    });
                    
                    waitsFor(checkHandler, 'event handler never fired', 200);
                    
                    // Additional timeout for callbacks to queue and fire
                    waits(20);
                    
                    runs(function() {
                        expect(options).toBeUndefined();
                    });

                    waits(35);
                });
            });
        });
        
        describe("with connection failed", function() {
            it("retries failed transactions", function() {
                var proto = Ext.direct.Transaction.prototype;
                
                runs(function() {
                    spyOn(proto, 'retry').andCallThrough();
                
                    ns.TestAction.echo('foo', Ext.emptyFn, this, { timeout: 666 });
                });
                
                waitsFor(function() {
                    return proto.retry.callCount === 1;
                }, 'transaction.retry() never called', 200);
                
                runs(function() {
                    expect(proto.retry).toHaveBeenCalled();
                });
            });
            
            it("fires exception when retry count is exceeded", function() {
                runs(function() {
                    provider.on('data', handler);
            
                    ns.TestAction.echo('bar', Ext.emptyFn, this, { timeout: 666 });
                });
                
                waitsFor(checkHandler, 'event handler never fired', 200);
                
                runs(function() {
                    expect(handler).toHaveBeenCalled();
                });
            });
            
            describe("handles callback:", function() {
                it("fires 'beforecallback' event", function() {
                    runs(function() {
                        provider.on('beforecallback', handler);
                    
                        ns.TestAction.echo('baz', Ext.emptyFn, this, { timeout: 666 });
                    });
                    
                    waitsFor(checkHandler, 'event handler never fired', 200);
                    
                    runs(function() {
                        expect(handler).toHaveBeenCalled();
                    });
                });
                
                it("cancels callback when 'beforecallback' handler returns false", function() {
                    var cb = jasmine.createSpy('callback');
                    
                    runs(function() {
                        handler.andCallFake(returnFalse);
                        
                        provider.on('beforecallback', handler);
                        
                        ns.TestAction.echo('qux', cb, this, { timeout: 666 });
                    });
                    
                    waitsFor(checkHandler, 'event handler never fired', 200);
                    
                    // Additional timeout for callback to be handled
                    waits(20);
                    
                    runs(function() {
                        expect(handler).toHaveBeenCalled();
                        // AND
                        expect(cb).not.toHaveBeenCalled();
                    });
                });
                
                it("fires callback when retry count is exceeded", function() {
                    runs(function() {
                        ns.TestAction.echo('plugh', echoStatus, this, { timeout: 666 });
                    });
                    
                    waitsFor(checkEcho, 'callback never fired', 200);
                
                    runs(function() {
                        expect(this.echo).toBe(false);
                    });
                });
            });
        });
        
        describe("successfully connected:", function() {
            it("fires 'data' event", function() {
                runs(function() {
                    provider.on('data', handler);
            
                    ns.TestAction.echo('foo', echoResult, this);
                });
                
                waitForEcho();
                
                runs(function() {
                    expect(handler).toHaveBeenCalled();
                });
            });
            
            describe("handles callback:", function() {
                it("fires 'beforecallback' event", function() {
                    runs(function() {
                        provider.on('beforecallback', handler);
                    
                        ns.TestAction.echo('foo', echoResult, this);
                    });
                    
                    waitsFor(checkEcho, 'event handler never fired', 100);
                    
                    runs(function() {
                        expect(handler).toHaveBeenCalled();
                    });
                });
                
                it("cancels callback when 'beforecallback' handler returns false", function() {
                    var cb = jasmine.createSpy('callback');
                    
                    runs(function() {
                        handler.andCallFake(returnFalse);
                        
                        provider.on('beforecallback', handler);
                        
                        ns.TestAction.echo('bar', cb, this);
                    });
                    
                    waitsFor(checkHandler, 'event handler never fired', 100);
                    
                    // Additional timeout for callback to be handled
                    waits(20);
                    
                    runs(function() {
                        expect(handler).toHaveBeenCalled();
                        // AND
                        expect(cb).not.toHaveBeenCalled();
                    });
                });
                
                it('runs w/o additional options', function() {
                    runs(function() {
                        ns.TestAction.echo('foo', echoResult, this);
                    });
                    
                    waitForEcho();
                    
                    expectEcho('foo');
                });
        
                it('runs w/ additional options', function() {
                    runs(function() {
                        ns.TestAction.echo('bar', echoResultAndOptions, this, {
                            victory: 'Huzzah!'
                        });
                    });
                    
                    waitForEcho();
                    
                    runs(function() {
                        expect(this.echo).toEqual('bar');
                        expect(this.options).toBeDefined();
                        expect(this.options.victory).toEqual('Huzzah!');
                    });
                });
        
                it('runs in nested namespaces', function() {
                    runs(function() {
                        ns.TestAction.Foo.foo(echoResult, this);
                    });
                    
                    waitForEcho();
                    
                    expectEcho('foo');
                });
        
                it('runs in deeply nested namespaces', function() {
                    runs(function() {
                        ns.TestAction.Foo.Bar.bar(echoResult, this);
                    });
                    
                    waitForEcho();
                    
                    expectEcho('bar');
                });
        
                it('runs in really truly deeply nested namespaces', function() {
                    runs(function() {
                        ns.TestAction.Foo.Bar.Baz.baz(echoResult, this);
                    });
                    
                    waitForEcho();
                    
                    expectEcho('baz');
                });
            });
            
            describe("metadata", function() {
                it("will pass named metadata", function() {
                    runs(function() {
                        ns.TestAction.directMetaNamed('foo', echoResult, this, {
                            metadata: {
                                bleh: 'blah'
                            }
                        });
                    });
                    
                    waitForEcho();
                    
                    expectEcho({ data: 'foo', metadata: { bleh: 'blah' } });
                });
                
                it("will pass ordered metadata", function() {
                    runs(function() {
                        ns.TestAction.directMetaOrdered('bar', echoResult, this, {
                            metadata: ['blerg', 'blam', 'frob']
                        });
                    });
                    
                    waitForEcho();
                    
                    // Metadata len === 2, so 3rd argument should be cut off
                    expectEcho({ data: 'bar', metadata: ['blerg', 'blam'] });
                });
            })
        });
        
        (Ext.toolkit === 'classic' ? describe : xdescribe)("form calls:", function() {
            var form;
            
            function createForm(config) {
                config = Ext.apply({
                    xtype: 'form',
                    renderTo: document.body,
                    width: 300,
                    height: 200,
                    layout: 'form',
                    
                    api: {
                        submit: 'TestAction.directForm'
                    },
                    
                    items: [{
                        xtype: 'hiddenfield',
                        name: 'hidden_foo',
                        value: 'hide the sacred foo from infoodels!'
                    }, {
                        xtype: 'textfield',
                        name: 'overt_foo',
                        value: 'behold the false, deceitful overt foo'
                    }]
                }, config);
                
                form = Ext.widget(config);
            }
            
            beforeEach(function() {
                createForm();
            });
            
            afterEach(function() {
                if (form) {
                    form.destroy();
                }
            });
            
            describe("submit", function() {
                it("should pass field values to direct fn", function() {
                    runs(function() {
                        form.submit({
                            success: echoFormResult,
                            scope: this
                        });
                    });
                    
                    // Callbacks are a bit slow but 2 sec is enough
                    waitsFor(checkEcho, 'callback that never fired', 2000);
                    
                    runs(function() {
                        expect(this.echo).toEqual({
                            success: true,
                            data: {
                                hidden_foo: 'hide the sacred foo from infoodels!',
                                overt_foo: 'behold the false, deceitful overt foo'
                            }
                        });
                    });
                });
                
                it("should pass extra params to direct fn", function() {
                    runs(function() {
                        form.submit({
                            params: {
                                simple_foo: 'barf!'
                            },
                            success: echoFormResult,
                            scope: this
                        });
                    });
                    
                    waitsFor(checkEcho, 'callback that never fired', 2000);
                    
                    runs(function() {
                        expect(this.echo).toEqual({
                            success: true,
                            data: {
                                hidden_foo: 'hide the sacred foo from infoodels!',
                                overt_foo: 'behold the false, deceitful overt foo',
                                simple_foo: 'barf!'
                            }
                        });
                    });
                });
                
                it("should pass form baseParams to direct fn", function() {
                    runs(function() {
                        form.getForm().baseParams = {
                            MEGA_FOO: 'ALL YOUR FOO ARE BELONG TO US!'
                        };
                        
                        form.submit({
                            success: echoFormResult,
                            scope: this
                        });
                    });
                    
                    waitsFor(checkEcho, 'callback that never fired', 2000);
                    
                    runs(function() {
                        expect(this.echo).toEqual({
                            success: true,
                            data: {
                                hidden_foo: 'hide the sacred foo from infoodels!',
                                overt_foo: 'behold the false, deceitful overt foo',
                                MEGA_FOO: 'ALL YOUR FOO ARE BELONG TO US!'
                            }
                        });
                    });
                });
                
                it("should pass named metadata", function() {
                    runs(function() {
                        form.getForm().api.submit = 'TestAction.directMetaFormNamed';
                        
                        form.getForm().metadata = {
                            foo: 'bargh!'
                        };
                        
                        form.submit({
                            success: echoFormResult,
                            scope: this
                        });
                    });
                    
                    waitsFor(checkEcho, 'callback that never fired', 2000);
                    
                    runs(function() {
                        expect(this.echo).toEqual({
                            success: true,
                            data: {
                                hidden_foo: 'hide the sacred foo from infoodels!',
                                overt_foo: 'behold the false, deceitful overt foo'
                            },
                            
                            // JSONified!
                            metadata: '{"foo":"bargh!"}'
                        });
                    });
                });
                
                it("should pass ordered metadata", function() {
                    runs(function() {
                        form.getForm().api.submit = 'TestAction.directMetaFormOrdered';
                        
                        form.getForm().metadata = ['bram', 'blam', 'qux?'];
                        
                        form.submit({
                            success: echoFormResult,
                            scope: this
                        });
                    });
                    
                    waitsFor(checkEcho, 'callback that never fired', 2000);
                    
                    runs(function() {
                        expect(this.echo).toEqual({
                            success: true,
                            data: {
                                hidden_foo: 'hide the sacred foo from infoodels!',
                                overt_foo: 'behold the false, deceitful overt foo'
                            },
                            
                            // JSONified!
                            metadata: '["bram","blam"]'
                        });
                    });
                });
            });
        });
    });
});
