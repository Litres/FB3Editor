describe("Ext.data.reader.Reader", function() {
    var reader, proxy;
    
    afterEach(function() {
        Ext.data.Model.schema.clear();
        Ext.undefine('spec.User');
    });
    
    function makeReader(cfg) {
        Ext.define('spec.User', {
            extend: 'Ext.data.Model',
            fields: ['id']
        });

        proxy = {
            setModel: Ext.emptyFn
        };
        
        cfg = Ext.apply({
            rootProperty: null,
            totalProperty: null,
            messageProperty: null,
            successProperty: null,
            proxy: proxy
        }, cfg);
        
        reader = new Ext.data.reader.Reader(cfg);
        
        reader.buildExtractors = Ext.emptyFn;
        reader.setModel(spec.User);
        
        return reader;
    }
    
    it("should have the nullResultSet defined on the prototype", function() {
        expect(Ext.data.reader.Reader.prototype.nullResultSet).toBeDefined();    
    });
    
    describe("reading", function() {
        var response, responseData;

        beforeEach(function() {
            makeReader();
        });

        function doRead() {
            return reader.read(response);
        }

        describe("if there is a responseText property", function() {
            beforeEach(function() {
                response = {
                    responseText: 'something'
                };

                responseData = {
                    something: 'else'
                };

                spyOn(reader, 'readRecords').andReturn({});
                spyOn(reader, 'getResponseData').andCallFake(function() {
                    return responseData;
                });

                doRead();
            });

            it("should first call getResponseData with the response object", function() {
                expect(reader.getResponseData).toHaveBeenCalledWith(response);
            });
        });

        describe("if there is no responseText property", function() {
            beforeEach(function() {
                spyOn(reader, 'readRecords').andReturn({});
                spyOn(reader, 'getResponseData').andCallFake(function() {
                    return responseData;
                });

                response = "something";

                doRead();
            });

            it("should not call getResponseData", function() {
                expect(reader.getResponseData).not.toHaveBeenCalled();
            });

            it("should call readRecords with the response", function() {
                expect(reader.readRecords.mostRecentCall.args[0]).toBe(response);
            });
        });

        describe("if the response was falsy", function() {
            var nullSet = Ext.data.reader.Reader.prototype.nullResultSet;
            
            it("should return the nullResultSet if the response is undefined", function() {
                response = undefined;

                expect(doRead()).toBe(nullSet);
            });

            it("should return the nullResultSet if the response is null", function() {
                response = null;

                expect(doRead()).toBe(nullSet);
            });

            it("should return the nullResultSet if the response is false", function() {
                response = false;

                expect(doRead()).toBe(nullSet);
            });
        });
    });
        
    describe("transform", function() {
        it("should invoke the transform function", function() {
            var o = {
                id: 1
            };
            
            var transformFn = function(data) {
                data[0] = {id: 2};
                return data;
            };
            
            makeReader({
                transform: transformFn
            });
            
            reader.extractData = function(root, readOptions) {return root;};
            var rec = reader.readRecords([o]).getRecords()[0];
            
            expect(rec.id).not.toEqual(o.id);
            expect(rec.id).toEqual(2);
        });
        
        it("should invoke the transform function with the specified scope", function() {
            var o = {
                id: 1
            };
            
            var mockScope = {};
            
            var transformFn = function(data) {
                expect(this).toEqual(mockScope);
                data[0] = {id: 2}
                return data;
            };
            
            makeReader({
                transform: {
                    fn: transformFn,
                    scope: mockScope
                }
            });
            
            reader.extractData = function(root, readOptions) {return root;};
            var rec = reader.readRecords([o]).getRecords()[0];
            
            expect(rec.id).not.toEqual(o.id);
            expect(rec.id).toEqual(2);
        });
        
        it("should accept method name instead of function", function() {
            var o = {
                id: 1
            };
            
            var transformFn = function(data) {
                data[0] = {id: 2};
                return data;
            };
            
            makeReader({
                fooFn: transformFn,
                transform: 'fooFn'
            });
            
            reader.extractData = function(root, readOptions) {return root;};
            var rec = reader.readRecords([o]).getRecords()[0];
            
            expect(rec.id).not.toEqual(o.id);
            expect(rec.id).toEqual(2);
        });
    });
        
    describe("raw data", function() {
        beforeEach(function() {
            makeReader();
        });
        
        it("should NOT keep rawData by default", function() {
            reader.readRecords([{ foo: 'bar' }]);
            
            expect(reader.rawData).not.toBeDefined();
        });
        
        it("should keep rawData when told to", function() {
            reader.setKeepRawData(true);
            reader.readRecords([{ foo: 'bar' }]);
            
            expect(reader.rawData).toEqual([{ foo: 'bar' }]);
        });
    });

    describe("onMetaChange", function() {
        var meta;

        beforeEach(function() {
            makeReader();
            
            meta = {
                root           : 'someRootProperty',
                totalProperty  : 'someTotalProperty',
                successProperty: 'someSuccessProperty'
            };

            spyOn(reader, 'buildExtractors').andCallThrough();
        });

        afterEach(function() {
            Ext.data.Model.schema.clear();
            Ext.undefine('spec.User');
        });
        
        it("should set the root property", function() {
            reader.onMetaChange(meta);

            expect(reader.getRootProperty()).toBe('someRootProperty');
        });

        it("should set the totalProperty", function() {
            reader.onMetaChange(meta);

            expect(reader.getTotalProperty()).toBe('someTotalProperty');
        });

        it("should set the successProperty", function() {
            reader.onMetaChange(meta);

            expect(reader.getSuccessProperty()).toBe('someSuccessProperty');
        });

        it("should rebuild the extractor functions", function() {
            reader.onMetaChange(meta);

            expect(reader.buildExtractors).toHaveBeenCalled();
        });

        describe("if fields are present in the meta data", function() {
            beforeEach(function() {
                Ext.apply(meta, {
                    fields: [
                        {name: 'uniqueId', type: 'int'},
                        {name: 'name',     type: 'string'}
                    ]
                });

                spyOn(proxy, 'setModel').andReturn();
            });

            it("should create a new model with fields", function() {
                var fields = reader.getModel().getFields();
                
                expect(fields.length).toBe(1);
                expect(fields.items[0].getName()).toBe('id');
                
                reader.onMetaChange(meta);

                fields = reader.getModel().getFields();
                expect(fields.length).toBe(3);
                expect(fields.items[0].getName()).toBe('uniqueId');
                expect(fields.items[1].getName()).toBe('name');
            });
        });

        describe("if fields are not present in the meta data", function() {
            it("should leave the existing model in place", function() {
                var model = reader.getModel();
                reader.onMetaChange(meta);
                expect(reader.getModel()).toBe(model);
            });
        });
    });
});
