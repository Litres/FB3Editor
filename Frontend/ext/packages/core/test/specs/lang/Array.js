describe("Ext.Array", function() {
    var array;

    describe("indexOf", function() {
        describe("without from argument", function() {
            beforeEach(function() {
                array = [1, 2, 3, 4, 5, 6];
            });

            afterEach(function(){
                array = null;
            });

            it("should always return -1 on an empty array", function(){
                expect(Ext.Array.indexOf([], 1)).toEqual(-1);
            });

            it("should return -1 if them it doesn't exist", function() {
                expect(Ext.Array.indexOf(array, 7)).toEqual(-1);
            });

            it("should return the matching index if found", function() {
                expect(Ext.Array.indexOf(array, 4)).toEqual(3);
            });

            it("should return the first matching index if found", function(){
                array.push(1);
                expect(Ext.Array.indexOf(array, 1)).toEqual(0);
            });
        });

        describe("with from argument", function() {
            beforeEach(function() {
                array = [1, 2, 3, 4, 5, 6, 7];
            });

            it("should return the matched index if found", function() {
                expect(Ext.Array.indexOf(array, 5, 3)).toEqual(4);
                expect(Ext.Array.indexOf(array, 5, 4)).toEqual(4);
            });

            it("should return -1 if the item doesn't exist after the passed from value", function() {
                expect(Ext.Array.indexOf(array, 5, 5)).toEqual(-1);
            });
        });

    });
    describe("removing items", function() {
        var myArray;

        describe("remove", function() {
            describe("with an empty array", function() {
                beforeEach(function() {
                    myArray = [];
                });

                it("should not cause an exception", function() {
                    expect(function() {
                        Ext.Array.remove(myArray, 1);
                    }).not.toRaiseExtError();

                    expect(myArray).toEqual([]);
                });

                it("should return the passed array", function() {
                    expect(Ext.Array.remove(myArray, 1)).toBe(myArray);
                });
            });

            describe("with a filled array", function() {
                beforeEach(function() {
                    myArray = [1, 2, 3, 4, 5];
                });

                it("should remove the item", function() {
                    Ext.Array.remove(myArray, 1);
                    expect(myArray).toEqual([2, 3, 4, 5]);
                });

                it("should return the array", function() {
                    expect(Ext.Array.remove(myArray, 1)).toBe(myArray);
                });

                it("should update the index of the following items", function() {
                    Ext.Array.remove(myArray, 1);
                    expect(myArray[0]).toBe(2);
                    expect(myArray[1]).toBe(3);
                    expect(myArray[2]).toBe(4);
                    expect(myArray[3]).toBe(5);
                });

                it("should update the collection length", function() {
                    Ext.Array.remove(myArray, 1);
                    expect(myArray.length).toBe(4);
                });

                it("should remove only using a strict type check", function() {
                    Ext.Array.remove(myArray, '1');
                    expect(myArray).toEqual([1, 2, 3, 4, 5]);
                });

                it("should only remove the first occurrence", function() {
                    var a = {},
                        b = {};

                    myArray = [a, b, a, b, a, b];
                    Ext.Array.remove(myArray, b);
                    expect(myArray).toEqual([a, a, b, a, b]);
                });
            });
        });

        describe("removeAt", function() {
            beforeEach(function() {
                myArray = [1, 2, 3, 4, 5];
            });

            describe("invalid indexes", function() {
                describe("index less than 0", function() {
                    it("should not cause an exception", function() {
                        expect(function() {
                            Ext.Array.removeAt(myArray, -1);
                        }).not.toThrow();
                    });

                    it("should return the array", function() {
                        expect(Ext.Array.removeAt(myArray, -1)).toBe(myArray);
                    });

                    it("should not modify the array", function() {
                        Ext.Array.removeAt(myArray, -1);
                        expect(myArray.length).toBe(5);
                    });
                });

                describe("index larger than the length", function() {
                    it("should not cause an exception", function() {
                        expect(function() {
                            Ext.Array.removeAt(myArray, 100);
                        }).not.toThrow();
                    });

                    it("should return the array", function() {
                        expect(Ext.Array.removeAt(myArray, 100)).toBe(myArray);
                    });

                    it("should not modify the array", function() {
                        Ext.Array.removeAt(myArray, 100);
                        expect(myArray.length).toBe(5);
                    });
                });
            });

            describe("valid indexes", function() {
                it("should return the array", function() {
                    expect(Ext.Array.removeAt(myArray, 1)).toBe(myArray);
                });

                it("should remove the first item", function() {
                    Ext.Array.removeAt(myArray, 0);
                    expect(myArray).toEqual([2, 3, 4, 5]);
                });

                it("should remove the last item", function() {
                    Ext.Array.removeAt(myArray, 4);
                    expect(myArray).toEqual([1, 2, 3, 4]);
                });

                it("should remove an item in the middle", function() {
                    Ext.Array.removeAt(myArray, 2);
                    expect(myArray).toEqual([1, 2, 4, 5]);
                });

                describe("count", function() {
                    it("should default to 1", function() {
                        Ext.Array.removeAt(myArray, 0);
                        expect(myArray).toEqual([2, 3, 4, 5]);
                    });

                    it("should remove the specified amount of items", function() {
                        Ext.Array.removeAt(myArray, 0, 2);
                        expect(myArray).toEqual([3, 4, 5]);
                    });

                    it("should be able to remove all items", function() {
                        Ext.Array.removeAt(myArray, 0, 5);
                        expect(myArray).toEqual([]);
                    });

                    it("should be able to remove up to the last item", function() {
                        Ext.Array.removeAt(myArray, 1, 4);
                        expect(myArray).toEqual([1]);
                    });

                    it("should remove til the end if index + count >= length", function() {
                        Ext.Array.removeAt(myArray, 2, 100);
                        expect(myArray).toEqual([1, 2]);
                    });
                });
            });
        });
    });

    describe("contains", function() {
        it("should always return false with an empty array", function(){
            expect(Ext.Array.contains([], 1)).toBe(false);
        });

        it("should return false if an item does not exist in the array", function() {
            expect(Ext.Array.contains([1, 2, 3], 10)).toBe(false);
        });

        it("should return true if an item exists in the array", function() {
            expect(Ext.Array.contains([8, 9, 10], 10)).toBe(true);
        });

        it("should only match with strict type checking", function(){
            expect(Ext.Array.contains([1, 2, 3, 4, 5], '1')).toBe(false);
        });
    });

    describe("include", function(){
        var myArray;

        it("should always add to an empty array", function(){
            myArray = [];
            Ext.Array.include(myArray, 1);
            expect(myArray).toEqual([1]);
        });

        it("should add the item if it doesn't exist", function(){
            myArray = [1];
            Ext.Array.include(myArray, 2);
            expect(myArray).toEqual([1, 2]);
        });

        it("should always add to the end of the array", function(){
            myArray = [9, 8, 7, 6];
            Ext.Array.include(myArray, 10);
            expect(myArray).toEqual([9, 8, 7, 6, 10]);
        });

        it("should match using strict type checking", function(){
            myArray = ['1'];
            Ext.Array.include(myArray, 1);
            expect(myArray).toEqual(['1', 1]);
        });

        it("should not modify the array if the value exists", function(){
            myArray = [4, 5, 6];
            Ext.Array.include(myArray, 7);
            expect(myArray).toEqual([4, 5, 6, 7]);
        });
    });

    describe("clone", function(){
        it("should clone an empty array to be empty", function(){
            expect(Ext.Array.clone([])).toEqual([]);
        });

        it("should clone an array with items", function(){
            expect(Ext.Array.clone([1, 3, 5])).toEqual([1, 3, 5]);
        });

        it("should create a new reference", function(){
            var arr = [1, 2, 3];
            expect(Ext.Array.clone(arr)).not.toBe(arr);
        });

        it("should do a shallow clone", function(){
            var o = {},
                arr = [o],
                result;

            result = Ext.Array.clone(arr);
            expect(result[0]).toBe(o);
        });
    });

    describe("clean", function(){
        it("should return an empty array if cleaning an empty array", function(){
            expect(Ext.Array.clean([])).toEqual([]);
        });

        it("should remove undefined values", function(){
            expect(Ext.Array.clean([undefined])).toEqual([]);
        });

        it("should remove null values", function(){
            expect(Ext.Array.clean([null])).toEqual([]);
        });

        it("should remove empty strings", function(){
            expect(Ext.Array.clean([''])).toEqual([]);
        });

        it("should remove empty arrays", function(){
            expect(Ext.Array.clean([[]])).toEqual([]);
        });

        it("should remove a mixture of empty values", function(){
            expect(Ext.Array.clean([null, undefined, '', []])).toEqual([]);
        });

        it("should remove all occurrences of empty values", function(){
            expect(Ext.Array.clean([null, null, null, undefined, '', '', '', undefined])).toEqual([]);
        });

        it("should leave non empty values untouched", function(){
            expect(Ext.Array.clean([1, 2, 3])).toEqual([1, 2, 3]);
        });

        it("should remove only the empty values", function(){
            expect(Ext.Array.clean([undefined, null, 1, null, 2])).toEqual([1, 2]);
        });

        it("should preserve order on removal", function(){
            expect(Ext.Array.clean([1, null, 2, null, null, null, 3, undefined, '', '', 4])).toEqual([1, 2, 3, 4]);
        });
    });

    describe("unique", function(){

        it("should return an empty array if run on an empty array", function(){
            expect(Ext.Array.unique([])).toEqual([]);
        });

        it("should return a new reference", function(){
            var arr = [1, 2, 3];
            expect(Ext.Array.unique(arr)).not.toBe(arr);
        });

        it("should return a copy if all items are unique", function(){
            expect(Ext.Array.unique([6, 7, 8])).toEqual([6, 7, 8]);
        });

        it("should only use strict typing to match", function(){
            expect(Ext.Array.unique([1, '1'])).toEqual([1, '1']);
        });

        it("should preserve the order when removing", function(){
            expect(Ext.Array.unique([1, 2, 1, 3, 1, 1, 1, 6, 5, 1])).toEqual([1, 2, 3, 6, 5]);
        });
    });

    describe("map", function(){
        var emptyFn = function(v){
                return v;
            };

        it("should return an empty array if run on an empty array", function(){
            expect(Ext.Array.map([], function(){})).toEqual([]);
        });

        it("should return a new reference", function(){
            var arr = [1, 2];
            expect(Ext.Array.map(arr, emptyFn)).not.toBe(arr);
        });

        it("should execute the function for each item in the array", function(){
            expect(Ext.Array.map([1, 2, 3, 4, 5], function(v){
                return v * 2;
            })).toEqual([2, 4, 6, 8, 10]);
        });

        it("should get called with the correct scope", function(){
            var scope = {},
                realScope;
            Ext.Array.map([1, 2, 3, 4, 5], function(){
                realScope = this;
            }, scope);
            expect(realScope).toBe(scope);
        });

        it("should get called with the argument, index and array", function(){
            var item,
                index,
                arr,
                data = [1];

            Ext.Array.map(data, function(){
                item = arguments[0];
                index = arguments[1];
                arr = arguments[2];
            });
            expect(item).toEqual(1);
            expect(index).toEqual(0);
            expect(arr).toBe(data);
        });
    });

    describe("from", function(){
        it("should return an empty array for an undefined value", function(){
            expect(Ext.Array.from(undefined)).toEqual([]);
        });

        it("should return an empty array for a null value", function(){
            expect(Ext.Array.from(null)).toEqual([]);
        });

        it("should convert an array", function(){
            expect(Ext.Array.from([1, 2, 3])).toEqual([1, 2, 3]);
        });

        it("should preserve the order", function(){
            expect(Ext.Array.from(['a', 'string', 'here'])).toEqual(['a', 'string', 'here']);
        });

        it("should convert a single value to an array", function(){
            expect(Ext.Array.from(true)).toEqual([true]);
            expect(Ext.Array.from(700)).toEqual([700]);
        });

        it("should convert arguments to an array", function(){
            var test, fn = function(){
                test = Ext.Array.from(arguments);
            };
            fn(1, 2, 3);
            expect(test instanceof Array).toBeTruthy();
            expect(test).toEqual([1, 2, 3]);
        });

        it("should convert a DOM collection to an array", function(){
            var ct = document.body.appendChild(document.createElement('div')),
                node1 = ct.appendChild(document.createElement('div')),
                node2 = ct.appendChild(document.createElement('div')),
                node3 = ct.appendChild(document.createElement('div')),
                collection = ct.getElementsByTagName('div'),
                result = Ext.Array.from(collection);

            expect(result instanceof Array).toBeTruthy();
            expect(result).toEqual([node1, node2, node3]);
            document.body.removeChild(ct);
        });
        
        it("should convert a single string", function(){
            expect(Ext.Array.from('Foo')).toEqual(['Foo']);
        });
        
        it("should convert a single function", function(){
            var fn = function(){};
            expect(Ext.Array.from(fn)).toEqual([fn]);
        });
    });

    describe("toArray", function(){
        it("should convert an array", function(){
            expect(Ext.Array.toArray([1, 2, 3, 4])).toEqual([1, 2, 3, 4]);
        });

        it("should convert a string", function(){
            expect(Ext.Array.toArray('12345')).toEqual(['1', '2', '3', '4', '5']);
        });

        it("should create a new reference", function(){
            var arr = [6, 7, 8];
            expect(Ext.Array.toArray(arr)).not.toBe(arr);
        });

        it("should convert arguments", function(){
            var test, fn = function(){
                test = Ext.Array.toArray(arguments);
            };
            fn(-1, -2, -3);
            expect(test instanceof Array).toBeTruthy();
            expect(test).toEqual([-1, -2, -3]);
        });

        it("should convert a DOM collection", function(){
            var ct = document.body.appendChild(document.createElement('div')),
                node1 = ct.appendChild(document.createElement('div')),
                node2 = ct.appendChild(document.createElement('div')),
                node3 = ct.appendChild(document.createElement('div')),
                collection = ct.getElementsByTagName('div'),
                result = Ext.Array.toArray(collection);

            expect(result instanceof Array).toBeTruthy();
            expect(result).toEqual([node1, node2, node3]);
            document.body.removeChild(ct);
        });

        describe("start/end parameters", function(){
            it("should default to whole of the array", function(){
                expect(Ext.Array.toArray([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
            });

            it("should work with only the start parameter specified", function(){
                expect(Ext.Array.toArray([1, 2, 3, 4, 5, 6], 2)).toEqual([3, 4, 5, 6]);
            });

            it("should work with only the end parameter specified", function(){
                expect(Ext.Array.toArray([1, 2, 3, 4, 5, 6], null, 4)).toEqual([1, 2, 3, 4]);
            });

            it("should work with both params specified", function(){
                expect(Ext.Array.toArray([1, 2, 3, 4, 5, 6], 2, 4)).toEqual([3, 4]);
            });

            it("should work with nagative end", function(){
                expect(Ext.Array.toArray([1, 2, 3, 4, 5, 6], 2, -1)).toEqual([3, 4, 5]);
            });
        });
    });

    describe("pluck", function(){
        it("should return an empty array when an empty array is passed", function(){
            expect(Ext.Array.pluck([], 'prop')).toEqual([]);
        });

        it("should pull the properties from objects in the array", function(){
            var arr = [{prop: 1}, {prop: 2}, {prop: 3}];
            expect(Ext.Array.pluck(arr, 'prop')).toEqual([1, 2, 3]);
        });

        it("should return a new reference", function(){
            var arr = [{prop: 1}, {prop: 2}, {prop: 3}];
            expect(Ext.Array.pluck(arr, 'prop')).not.toBe(arr);
        });

        it("should work on a DOM collection", function(){
            var ct = document.body.appendChild(document.createElement('div')),
                i = 0,
                node;

            for(; i < 5; ++i) {
                node = ct.appendChild(document.createElement('div'));
                node.className = 'node' + i;
            }

            expect(Ext.Array.pluck(ct.getElementsByTagName('div'), 'className')).toEqual(['node0', 'node1', 'node2', 'node3', 'node4']);
            document.body.removeChild(ct);
        });
    });

    describe("filter", function(){
        var trueFn = function(){
                return true;
            };

        it("should return an empty array if filtering an empty array", function(){
            expect(Ext.Array.filter([], trueFn)).toEqual([]);
        });

        it("should create a new reference", function(){
            var arr = [1, 2, 3];
            expect(Ext.Array.filter(arr, trueFn)).not.toBe(arr);
        });

        it("should add items if the filter function returns true", function(){
            expect(Ext.Array.filter([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], function(val){
                return val % 2 === 0;
            })).toEqual([2, 4, 6, 8, 10]);
        });

        it("should add items if the filter function returns a truthy value", function(){
            expect(Ext.Array.filter([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], function(val){
                if (val % 2 === 0) {
                    return 1;
                }
            })).toEqual([2, 4, 6, 8, 10]);
        });

        it("should not add items if the filter function returns a falsy value", function(){
            expect(Ext.Array.filter([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], function(val){
                return 0;
            })).toEqual([]);
        });

        it("should pass the correct parameters", function(){
            var values = [],
                indexes = [],
                arrs = [],
                data = [1, 2, 3];

            Ext.Array.filter([1, 2, 3], function(val, index, arr){
                values.push(val);
                indexes.push(index);
                arrs.push(arr);
            });

            expect(values).toEqual([1, 2, 3]);
            expect(indexes).toEqual([0, 1, 2]);
            expect(arrs).toEqual([data, data, data]);
        });

        it("should do a shallow copy", function(){
            var o1 = {prop: 1},
                o2 = {prop: 2},
                o3 = {prop: 3};

            expect(Ext.Array.filter([o1, o2, o3], trueFn)).toEqual([o1, o2, o3]);
        });

        it("should execute in scope when passed", function(){
            var scope = {},
                actual;

            expect(Ext.Array.filter([1, 2, 3], function(){
                actual = this;
            }, scope));
            expect(actual).toBe(scope);
        });
    });

    describe("forEach", function(){
        it("should not execute on an empty array", function(){
            var count = 0;
            Ext.Array.forEach([], function(){
                ++count;
            });
            expect(count).toEqual(0);
        });

        it("should execute for each item in the array", function(){
            var count = 0;
            Ext.Array.forEach([1, 2, 3, 4, 5], function(){
                ++count;
            });
            expect(count).toEqual(5);
        });

        it("should execute in the appropriate scope", function(){
            var scope = {},
                actual;

            Ext.Array.forEach([1, 2, 3], function(){
                actual = this;
            }, scope);

            expect(actual).toBe(scope);
        });

        it("should pass the appropriate params to the callback", function(){
            var values = [],
                indexes = [],
                arrs = [],
                data = [1, 2, 3];

            Ext.Array.forEach(data, function(val, index, arr){
                values.push(val);
                indexes.push(index);
                arrs.push(arr);
            });

            expect(values).toEqual([1, 2, 3]);
            expect(indexes).toEqual([0, 1, 2]);
            expect(arrs).toEqual([data, data, data]);
        });
    });

    describe("each", function(){
        describe("return values", function(){
            xit("should return 0 if the passed value is empty", function(){
                expect(Ext.Array.each([])).toEqual(0);
            });

            it("should return the stopping index if iteration is halted", function(){
                expect(Ext.Array.each([1, 2, 3], function(val){
                    return val != 2;
                })).toEqual(1);
            });

            it("should return true if iteration is not stopped", function(){
                expect(Ext.Array.each([4, 5, 6], function(){
                    return true;
                })).toBeTruthy();
            });
        });

        describe("scope/parameters", function(){
            it("should execute in the specified scope", function(){
                var scope = {},
                    actual;

                Ext.Array.each([1, 2, 3], function(){
                    actual = this;
                }, scope);
                expect(actual).toBe(scope);
            });

            it("should pass the item, index and array", function(){
                var values = [],
                    indexes = [],
                    arrs = [],
                    data = [1, 2, 3];

                Ext.Array.each(data, function(val, index, arr){
                    values.push(val);
                    indexes.push(index);
                    arrs.push(arr);
                });

                expect(values).toEqual([1, 2, 3]);
                expect(indexes).toEqual([0, 1, 2]);
                expect(arrs).toEqual([data, data, data]);
            });
        });

        describe("stopping iteration", function(){
            it("should not stop iteration by default", function(){
                var count = 0;
                Ext.Array.each([1, 2, 3, 4, 5], function(){
                    ++count;
                });
                expect(count).toEqual(5);
            });

            it("should not stop unless an explicit false is returned", function(){
                var count = 0;
                Ext.Array.each([1, 2, 3, 4, 5], function(){
                    ++count;
                    return null;
                });
                expect(count).toEqual(5);
            });

            it("should stop immediately if false is returned", function(){
                var count = 0;
                Ext.Array.each([1, 2, 3, 4, 5], function(v){
                    ++count;
                    return v != 2;
                });
                expect(count).toEqual(2);
            });
        });

        describe("other collection types", function(){
            it("should iterate arguments", function(){
                var test, values = [], fn = function(){
                    test = Ext.Array.each(arguments, function(val){
                        values.push(val);
                    });
                };
                fn(1, 2, 3);
                expect(values).toEqual([1, 2, 3]);
            });

            it("should iterate over a DOM collection", function(){
                var ct = document.body.appendChild(document.createElement('div')),
                    node1 = ct.appendChild(document.createElement('div')),
                    node2 = ct.appendChild(document.createElement('div')),
                    node3 = ct.appendChild(document.createElement('div')),
                    collection = ct.getElementsByTagName('div'),
                    result = [];

                Ext.Array.each(collection, function(node){
                    result.push(node.tagName.toLowerCase());
                });

                expect(result).toEqual(['div', 'div', 'div']);
                document.body.removeChild(ct);
            });
        });

        it("should iterate once over a single, non empty value", function(){
            var count = 0;
            Ext.Array.each('string', function(){
                ++count;
            });
            expect(count).toEqual(1);
        });
        
        describe("reverse iteraction", function() {
            it("should iterate backwards", function() {
                var output = [],
                    input = [1, 2, 3],
                    fn = function(number) {
                        output.push(number);
                    };
                Ext.Array.each(input, fn, undefined, true);
                expect(output).toEqual([3, 2, 1]);
            });
            it("should iterate backwards and stop when fn returns false", function() {
                var output = [],
                    input = [1, 2, 3],
                    fn = function(number) {
                        output.push(number);
                        if (number === 2) { return false; }
                    };
                Ext.Array.each(input, fn, undefined, true);
                expect(output).toEqual([3, 2]);
            });
        });
    });

    describe("every", function(){
        describe("scope/params", function(){
            it("should execute in the specified scope", function(){
                var scope = {},
                    actual;

                Ext.Array.every([1, 2, 3], function(){
                    actual = this;
                }, scope);
                expect(actual).toBe(scope);
            });

            it("should pass the item, index and array", function(){
                var values = [],
                    indexes = [],
                    arrs = [],
                    data = [1, 2, 3];

                Ext.Array.every(data, function(val, index, arr){
                    values.push(val);
                    indexes.push(index);
                    arrs.push(arr);
                    return true;
                });

                expect(values).toEqual([1, 2, 3]);
                expect(indexes).toEqual([0, 1, 2]);
                expect(arrs).toEqual([data, data, data]);
            });
        });

        it("should return true on an empty array", function(){
            expect(Ext.Array.every([], function(){})).toBeTruthy();
        });

        it("should throw an exception if no fn is passed", function(){
            expect(function(){
                Ext.Array.every([1, 2, 3]);
            }).toRaiseExtError();
        });

        it("should stop as soon as a false value is found", function(){
            var count = 0,
                result;

            result = Ext.Array.every([true, true, false, true], function(v){
                ++count;
                return v;
            });
            expect(count).toEqual(3);
            expect(result).toBeFalsy();
        });

        it("should return true if all values match the function", function(){
            expect(Ext.Array.every([1, 2, 3, 4, 5, 6, 7, 8, 9], function(v){
                return v < 10;
            })).toBeTruthy();
        });
    });

    describe("some", function(){
        describe("scope/params", function(){
            it("should execute in the specified scope", function(){
                var scope = {},
                    actual;

                Ext.Array.some([1, 2, 3], function(){
                    actual = this;
                }, scope);
                expect(actual).toBe(scope);
            });

            it("should pass the item, index and array", function(){
                var values = [],
                    indexes = [],
                    arrs = [],
                    data = [1, 2, 3];

                Ext.Array.some(data, function(val, index, arr){
                    values.push(val);
                    indexes.push(index);
                    arrs.push(arr);
                    return true;
                });

                expect(values).toEqual([1]);
                expect(indexes).toEqual([0]);
                expect(arrs).toEqual([data]);
            });
        });

        it("should return false on an empty array", function(){
            expect(Ext.Array.some([], function(){})).toBeFalsy();
        });

        it("should throw an exception if no fn is passed", function(){
            expect(function(){
                Ext.Array.some([1, 2, 3]);
            }).toRaiseExtError();
        });

        it("should stop as soon as a matching value is found", function(){
            var count = 0,
                result;

            result = Ext.Array.some([1, 2, 3, 4], function(val){
                ++count;
                return val == 3;
            });
            expect(count).toEqual(3);
            expect(result).toBeTruthy();
        });

        it("should return false if nothing matches the matcher function", function(){
            var count = 0,
                result;

            result = Ext.Array.some([1, 2, 3, 4, 5, 6, 7, 8, 9], function(val){
                ++count;
                return val > 9;
            });
            expect(count).toEqual(9);
            expect(result).toBeFalsy();
        });
    });

    describe("merge", function(){
        it("should return an empty array if run on an empty array", function(){
            expect(Ext.Array.merge([])).toEqual([]);
        });

        it("should return a new reference", function(){
            var arr = [1, 2, 3];
            expect(Ext.Array.merge(arr)).not.toBe(arr);
        });

        it("should return a copy if all items are unique", function(){
            expect(Ext.Array.merge([6, 7, 8])).toEqual([6, 7, 8]);
        });

        it("should only use strict typing to match", function(){
            expect(Ext.Array.merge([1, '1'])).toEqual([1, '1']);
        });

        it("should accept two or more arrays and return a unique union with items in order of first appearance", function(){
            expect(Ext.Array.merge([1, 2, 3], ['1', '2', '3'], [4, 1, 5, 2], [6, 3, 7, '1'], [8, '2', 9, '3'])).toEqual([1, 2, 3, '1', '2', '3', 4, 5, 6, 7, 8, 9]);
        });
    });

    describe("intersect", function(){
        it("should return an empty array if no arrays are passed", function(){
            expect(Ext.Array.intersect()).toEqual([]);
        });

        it("should return an empty array if one empty array is passed", function(){
            expect(Ext.Array.intersect([])).toEqual([]);
        });

        it("should return a new reference", function(){
            var arr = [1, 2, 3];
            expect(Ext.Array.intersect(arr)).not.toBe(arr);
        });

        it("should return a copy if one array is passed", function(){
            expect(Ext.Array.intersect([6, 7, 8])).toEqual([6, 7, 8]);
        });

        it("should return an intersection of two or more arrays with items in order of first appearance", function(){
            expect(Ext.Array.intersect([1, 2, 3], [4, 3, 2, 5], [2, 6, 3])).toEqual([2, 3]);
        });

        it("should return an empty array if there is no intersecting values", function(){
            expect(Ext.Array.intersect([1, 2, 3], [4, 5, 6])).toEqual([]);
        });

        it("should contain the unique set of intersected values only", function(){
            expect(Ext.Array.intersect([1, 1, 2, 3, 3], [1, 1, 2, 3, 3])).toEqual([1, 2, 3]);
        });

        it("should only use strict typing to match", function(){
            expect(Ext.Array.intersect([1], ['1'])).toEqual([]);
        });
        it("should handle arrays containing falsy values", function() {
            expect(Ext.Array.intersect([undefined, null, false, 0, ''], [undefined, null, false, 0, ''])).toEqual([undefined, null, false, 0, '']); 
        });
    });

    describe("difference", function(){
        it("should return a set difference of two arrays with items in order of first appearance", function(){
            expect(Ext.Array.difference([1, 2, 3, 4], [3, 2])).toEqual([1, 4]);
        });

        it("should return the first array unchanged if there is no difference", function(){
            expect(Ext.Array.difference([1, 2, 3], [4, 5, 6])).toEqual([1, 2, 3]);
        });

        it("should return a new reference", function(){
            var arr = [1, 2, 3];
            expect(Ext.Array.difference(arr, [3, 2])).not.toBe(arr);
        });

        it("should remove multiples of the same value from the first array", function(){
            expect(Ext.Array.difference([1, 2, 3, 2, 4, 1], [2, 1])).toEqual([3, 4]);
        });

        it("should only use strict typing to match", function(){
            expect(Ext.Array.difference([1], ['1'])).toEqual([1]);
        });
    });

    describe("sort", function() {
       var sarray, narray;
       beforeEach(function() {
          sarray = ['bbb', 'addda', 'erere', 'fff', 'de3'];
          narray = [1,3,2,4,6,7];

       });

       describe("with strings", function() {
           it("should be able to sort an array without sortFn", function() {
                Ext.Array.sort(sarray);
                expect(sarray).toEqual(['addda', 'bbb', 'de3', 'erere', 'fff']);
           });


           it("should be able to use a sortFn that returns a Number", function() {
                Ext.Array.sort(sarray, function(a,b){
                    if (a === b) {
                        return 0;
                    }
                    return  a > b ? 1: -1;
                });
                expect(sarray).toEqual(['addda', 'bbb', 'de3', 'erere', 'fff']);
           });
       });

       describe("with numbers", function() {
           it("should be able to sort an array without sortFn", function() {
                Ext.Array.sort(narray);
                expect(narray).toEqual([1,2,3,4,6,7]);
           });


           it("should be able to use a sortFn that returns a Number", function() {
                Ext.Array.sort(narray, function(a,b){
                    return a - b;
                });
                expect(narray).toEqual([1,2,3,4,6,7]);
           });
       });
    });

    describe("min", function() {
        describe("numbers", function() {
            it("without comparisonFn", function() {
                expect(Ext.Array.min([1,2,3,4,5,6])).toEqual(1);
                expect(Ext.Array.min([6,5,4,3,2,1])).toEqual(1);
            });

            it("with comparisonFn", function() {
                expect(Ext.Array.min([1,2,3,4,5,6], function(a, b) { return a < b ? 1 : -1; })).toEqual(6);
            });
        });
    });

    describe("max", function() {
        describe("numbers", function() {
            it("without comparisonFn", function() {
                expect(Ext.Array.max([1,2,3,4,5,6])).toEqual(6);
            });

            it("with comparisonFn", function() {
                expect(Ext.Array.max([1,2,3,4,5,6], function(a, b) { return a < b ? 1 : -1; })).toEqual(1);
            });
        });
    });

    describe("sum", function() {
        it("should return 21", function() {
            expect(Ext.Array.sum([1,2,3,4,5,6])).toEqual(21);
        });
    });

    describe("mean", function() {
        it("should return 3.5", function() {
            expect(Ext.Array.mean([1,2,3,4,5,6])).toEqual(3.5);
        });
    });

    function testReplace(replaceFn) {
        var replace = replaceFn;
        return function() {
        it('should remove items in the middle', function () {
            var array = [0, 1, 2, 3, 4, 5, 6, 7];
            replace(array, 2, 2);
            expect(Ext.encode(array)).toEqual('[0,1,4,5,6,7]');
        });
        it('should insert items in the middle', function () {
            var array = [0, 1, 2, 3, 4, 5, 6, 7];
            replace(array, 2, 0, ['a','b']);
            expect(Ext.encode(array)).toEqual('[0,1,"a","b",2,3,4,5,6,7]');
        });
        it('should replace in the middle with more items', function () {
            var array = [0, 1, 2, 3, 4, 5, 6, 7];
            replace(array, 2, 2, ['a','b', 'c', 'd']);
            expect(Ext.encode(array)).toEqual('[0,1,"a","b","c","d",4,5,6,7]');
        });
        it('should replace in the middle with fewer items', function () {
            var array = [0, 1, 2, 3, 4, 5, 6, 7];
            replace(array, 2, 4, ['a','b']);
            expect(Ext.encode(array)).toEqual('[0,1,"a","b",6,7]');
        });
        it('should delete at front', function () {
            var array = [0, 1, 2, 3];
            replace(array, 0, 2);
            expect(Ext.encode(array)).toEqual('[2,3]');
        });
        it('should delete at tail', function () {
            var array = [0, 1, 2, 3];
            replace(array, 2, 2);
            expect(Ext.encode(array)).toEqual('[0,1]');
        });
        it('should delete everything', function () {
            var array = [0, 1, 2, 3];
            replace(array, 0, 4);
            expect(Ext.encode(array)).toEqual('[]');
        });
        it('should insert at front', function () {
            var array = [0, 1];
            replace(array, 0, 0, ['a','b','c','d','e']);
            expect(Ext.encode(array)).toEqual('["a","b","c","d","e",0,1]');
        });
        it('should insert at tail', function () {
            var array = [0, 1];
            replace(array, array.length, 0, ['a','b','c','d','e']);
            expect(Ext.encode(array)).toEqual('[0,1,"a","b","c","d","e"]');
        });
        it('should insert into empty array', function () {
            var array = [];
            replace(array, 0, 0, ['a','b','c','d','e']);
            expect(Ext.encode(array)).toEqual('["a","b","c","d","e"]');
        });
        it('should replace at front', function () {
            var array = [0, 1];
            replace(array, 0, 1, ['a','b','c','d','e']);
            expect(Ext.encode(array)).toEqual('["a","b","c","d","e",1]');
        });
        it('should replace at tail', function () {
            var array = [0, 1];
            replace(array, 1, 1, ['a','b','c','d','e']);
            expect(Ext.encode(array)).toEqual('[0,"a","b","c","d","e"]');
        });
        it('should replace entire array', function () {
            var array = [0, 1, 2, 3];
            replace(array, 0, array.length, ['a','b','c','d','e']);
            expect(Ext.encode(array)).toEqual('["a","b","c","d","e"]');
        });
        it('should handle negative index', function () {
            var array = [0, 1, 2, 3];
            replace(array, -2, 20); // should clip
            expect(Ext.encode(array)).toEqual('[0,1]');
        });
        it('should work around the IE8 bug', function () {
            // see http://social.msdn.microsoft.com/Forums/en-US/iewebdevelopment/thread/6e946d03-e09f-4b22-a4dd-cd5e276bf05a/
            var array = [],
                lengthBefore,
                j = 20;

            while (j--) {
                array.push("A");
            }

            array.splice(15, 0, "F", "F", "F", "F", "F","F","F","F","F","F","F","F","F","F","F","F","F","F","F","F","F");
            // the fact that this is an APPLY is not instrumental to reproducing this bug

            lengthBefore = array.length; // = 41

            // everything above should be exactly preserved including the true splice call.
            // That way we have produced the Array Time Bomb... now see if it explodes!

            replace(array, 13, 0, ["XXX"]); // add one element (this was the failure)

            expect(array.length).toEqual(lengthBefore+1);
        });
        };
    }

        // The _replace method is our corrected method for IE8, but we make it available (in
        // debug builds) on all browsers to see that it works.
    describe('replace with _replaceSim', testReplace(Ext.Array._replaceSim));
        // and test the wrapper on other browsers
    describe('replace with native implementation', testReplace(Ext.Array.replace));


    describe('splice', function () {
        it('returns proper result array at the front', function () {
            var ret = Ext.Array._spliceSim([1,2,3,4], 0, 2);
            expect(Ext.encode(ret)).toEqual('[1,2]');
        });
        it('returns proper result array at the end', function () {
            var ret = Ext.Array._spliceSim([1,2,3,4], 2, 2);
            expect(Ext.encode(ret)).toEqual('[3,4]');
        });
        it('returns proper result array from the middle', function () {
            var ret = Ext.Array._spliceSim([1,2,3,4], 1, 2);
            expect(Ext.encode(ret)).toEqual('[2,3]');
        });
        it('return an empty array when nothing removed', function () {
            var ret = Ext.Array._spliceSim([1,2,3,4], 1, 0);
            expect(Ext.encode(ret)).toEqual('[]');
        });
    });

    describe('slice', function(){

        var array;

        describe('with Array', function(){
            beforeEach(function(){
                array = [{0:0}, {1:1}, {2:2}, {3:3}];
            });
            tests();
        });

        describe('with arguments', function(){
            beforeEach(function(){
                array = (function(){ return arguments; })({0:0}, {1:1}, {2:2}, {3:3});
            });
            tests();
        });

        function tests(){
            it('should shallow clone', function(){
                var newArray = Ext.Array.slice(array, 0);
                expect(newArray === array).toBe(false);
                expect(newArray[0] === array[0]).toBe(true);
            });
            it('should not require a begin or end', function(){
                var newArray = Ext.Array.slice(array);
                expect(newArray === array).toBe(false);
                expect(newArray[0]).toBe(array[0]);
            });
            it('should slice off the first item', function(){
                var newArray = Ext.Array.slice(array, 1);
                expect(newArray.length).toBe(3);
                expect(newArray[0]).toBe(array[1]);
                expect(newArray[2]).toBe(array[3]);
            });
            it('should ignore `end` if undefined', function(){
                var newArray = Ext.Array.slice(array, 1, undefined);
                expect(newArray.length).toBe(3);
                expect(newArray[0]).toBe(array[1]);
                expect(newArray[2]).toBe(array[3]);
            });
            it('should ignore `begin` if undefined', function(){
                var newArray = Ext.Array.slice(array, undefined);
                expect(newArray.length).toBe(4);
                expect(newArray[0]).toBe(array[0]);
                expect(newArray[3]).toBe(array[3]);
            });
            it('should ignore `begin` and `end` if undefined', function(){
                var newArray = Ext.Array.slice(array, undefined, undefined);
                expect(newArray.length).toBe(4);
                expect(newArray[0]).toBe(array[0]);
                expect(newArray[3]).toBe(array[3]);
            });
            it('should slice out the middle', function(){
                var newArray = Ext.Array.slice(array, 1, -1);
                expect(newArray.length).toBe(2);
                expect(newArray[0]).toBe(array[1]);
                expect(newArray[1]).toBe(array[2]);
            });
        }
    });

    describe('toMap', function () {
        it("should return an empty object with an empty array", function() {
            var map = Ext.Array.toMap([]);
            expect(map).toEqual({});
        });

        it('should default the value to the index + 1', function () {
            var map = Ext.Array.toMap(['a','b','c']);
            expect(map).toEqual({
                a: 1,
                b: 2,
                c: 3
            });
        });

        describe("with getKey", function() {
            it('should extract the property name from the object and default the value to index + 1', function () {
                var map = Ext.Array.toMap([
                    { name: 'aaa' },
                    { name: 'bbb' },
                    { name: 'ccc' }
                ], 'name');

                expect(map).toEqual({
                    aaa: 1,
                    bbb: 2,
                    ccc: 3
                });
            });

            it('should use a key extractor fn and default the value to index + 1', function () {
                var map = Ext.Array.toMap([
                    { name: 'aaa' },
                    { name: 'bbb' },
                    { name: 'ccc' }
                ], function (obj) {
                    return obj.name.toUpperCase();
                });

                expect(map).toEqual({
                    AAA: 1,
                    BBB: 2,
                    CCC: 3
                });
            });

            it("should use the passed scope for the key fn", function() {
                var o = {},
                    spy = jasmine.createSpy().andReturn('X'),
                    map = Ext.Array.toMap([
                        { name: 'aaa' },
                        { name: 'bbb' },
                        { name: 'ccc' }
                    ], spy, o);

                expect(spy.mostRecentCall.object).toBe(o);
            });
        });
    });

    describe("toValueMap", function() {
        var a, b, c, aDup;

        beforeEach(function() {
            a = {name: 'a'};
            b = {name: 'b'};
            c = {name: 'c'};
            aDup = {name: 'a'};
        });

        afterEach(function() {
            a = b = c = aDup = null;
        });

        it("should return an empty object with an empty array", function() {
            var map = Ext.Array.toValueMap([]);
            expect(map).toEqual({});
        });

        it("should default the value to the key", function () {
            var map = Ext.Array.toValueMap(['a','b','c']);
            expect(map).toEqual({
                a: 'a',
                b: 'b',
                c: 'c'
            });
        });

        it("should be able to use numeric keys", function() {
            var map = Ext.Array.toValueMap([1, 2, 3]);
            expect(map).toEqual({
                '1': 1,
                '2': 2,
                '3': 3
            });
        });

        describe("with getKey", function() {
            describe("with getKey as a string", function() {
                it("should extract the object key", function() {
                    var map = Ext.Array.toValueMap([a, b, c], 'name');
                    expect(map).toEqual({
                        a: a,
                        b: b,
                        c: c
                    });
                });

                describe("arrayify options", function() {
                    it("should use the last encountered key as a default", function() {
                        var map = Ext.Array.toValueMap([a, b, c, aDup], 'name');
                        expect(map).toEqual({
                            a: aDup,
                            b: b,
                            c: c
                        });
                    });

                    it("should force all values to arrays when passing arrayify: 1", function() {
                        var map = Ext.Array.toValueMap([a, b, c, aDup], 'name', 1);
                        expect(map).toEqual({
                            a: [a, aDup],
                            b: [b],
                            c: [c]
                        }); 
                    });

                    it("should only create arrays when dupes exist with arrayify: 2", function() {
                        var map = Ext.Array.toValueMap([a, b, c, aDup], 'name', 2);
                        expect(map).toEqual({
                            a: [a, aDup],
                            b: b,
                            c: c
                        });
                    });
                });
            });

            describe("with getKey as a function", function() {
                var toUpper = function(o) {
                    return o.name.toUpperCase();
                };

                it("should extract the object key", function() {
                    var map = Ext.Array.toValueMap([a, b, c], toUpper);
                    expect(map).toEqual({
                        A: a,
                        B: b,
                        C: c
                    });
                });

                describe("arrayify options", function() {
                    it("should use the last encountered key as a default", function() {
                        var map = Ext.Array.toValueMap([a, b, c, aDup], toUpper);
                        expect(map).toEqual({
                            A: aDup,
                            B: b,
                            C: c
                        });
                    });

                    it("should force all values to arrays when passing arrayify: 1", function() {
                        var map = Ext.Array.toValueMap([a, b, c, aDup], toUpper, null, 1);
                        expect(map).toEqual({
                            A: [a, aDup],
                            B: [b],
                            C: [c]
                        }); 
                    });

                    it("should only create arrays when dupes exist with arrayify: 2", function() {
                        var map = Ext.Array.toValueMap([a, b, c, aDup], toUpper, null, 2);
                        expect(map).toEqual({
                            A: [a, aDup],
                            B: b,
                            C: c
                        });
                    });

                    it("should use the passed scope", function() {
                        var spy = jasmine.createSpy(),
                            o = {},
                            map = Ext.Array.toValueMap([a, b, c, aDup], spy, o);

                        expect(spy.mostRecentCall.object).toBe(o);
                    });
                });
            });
        });
    });
    
    describe('flatten', function() {
        var flatten = Ext.Array.flatten;
        it('should convert a multi-dimensional array into 1-d array', function() {
            expect(flatten([
                            1,
                            [2,3],
                            [4,[5,6]]
                            ])).toEqual([1,2,3,4,5,6]);
        });
    });

    describe("push", function() {
        var push = Ext.Array.push;

        it("should create an array", function(){
            expect(push(undefined, 1)).toEqual([1]);
        });

        it("should convert a non-array to an array", function() {
            expect(push(1, 2)).toEqual([1, 2]);
        });

        it("should push single elements onto end", function() {
            expect(push([1, 2], 3, 4, 5)).toEqual([1, 2, 3, 4, 5]);
        });

        it("should push all items of array arguments onto end", function(){
            expect(push([1, 2], [3, 4], [5])).toEqual([1, 2, 3, 4, 5]);
        });

        it("should push arrays and single items into the end", function(){
            expect(push([1, 2], [3, 4], 5)).toEqual([1, 2, 3, 4, 5]);
        });
    });
    
    describe("equals", function(){
        var equals = Ext.Array.equals;
        
        it("should match 2 empty arrays", function(){
            expect(equals([], [])).toBe(true);    
        });
        
        it("should not match if the arrays are a different size", function(){
            expect(equals([1, 2, 3, 4], [1, 2, 3])).toBe(false);
        });
        
        it("should use strict equality matching", function(){
            expect(equals([1], ['1'])).toBe(false);
        });
        
        it("should have items in the same order", function(){
            expect(equals(['baz', 'bar', 'foo'], ['foo', 'bar', 'baz'])).toBe(false);
        });
        
        it("should match strings", function(){
            expect(equals(['foo', 'bar', 'baz'], ['foo', 'bar', 'baz'])).toBe(true);
        });
        
        it("should match numbers", function(){
            expect(equals([1, 2, 3, 4], [1, 2, 3, 4])).toBe(true);
        });
        
        it("should match booleans", function(){
            expect(equals([false, false, false, true], [false, false, false, true])).toBe(true);
        });
        
        it("should match objects", function(){
            var o1 = {},
                o2 = {},
                o3 = {};
                
            expect(equals([o1, o2, o3], [o1, o2, o3])).toBe(true);
        });
        
        it("should match the same array", function(){
            var arr = [1, 2, 3];
            expect(equals(arr, arr)).toBe(true);
        });
    });

    describe('reduce', function () {
        var out = [];

        //             0  1  2  3  4  5  6  7
        var sparse = [ 1, 3, 5, 7, 9, 2, 4, 6 ];
        //  sparse = [    3,    7,    2, 4    ];

        delete sparse[0];
        delete sparse[2];
        delete sparse[4];
        delete sparse[7];

        function reducer (a, b, i) {
            out.push('[' + i + ']: (' + a + ',' + b + ')');
            return a * 10 + b;
        }

        beforeEach(function () {
            out.length = 0;
        });

        it('should use initialValue', function () {
            var v = Ext.Array.reduce([2, 3, 4], reducer, 1);

            expect(out.length).toBe(3);
            expect(out[0]).toBe('[0]: (1,2)');
            expect(out[1]).toBe('[1]: (12,3)');
            expect(out[2]).toBe('[2]: (123,4)');
            expect(v).toBe(1234);
        });

        it('should use first element as initialValue', function () {
            var v = Ext.Array.reduce([2, 3, 4], reducer);

            expect(out.length).toBe(2);
            expect(out[0]).toBe('[1]: (2,3)');
            expect(out[1]).toBe('[2]: (23,4)');
            expect(v).toBe(234);
        });

        it('should skip undefined elements', function () {
            var v = Ext.Array.reduce(sparse, reducer, 5);

            expect(out.length).toBe(4);
            expect(out[0]).toBe('[1]: (5,3)');
            expect(out[1]).toBe('[3]: (53,7)');
            expect(out[2]).toBe('[5]: (537,2)');
            expect(out[3]).toBe('[6]: (5372,4)');
            expect(v).toBe(53724);
        });

        it('should skip undefined elements including the first', function () {
            var v = Ext.Array.reduce(sparse, reducer);

            expect(out.length).toBe(3);
            expect(out[0]).toBe('[3]: (3,7)');
            expect(out[1]).toBe('[5]: (37,2)');
            expect(out[2]).toBe('[6]: (372,4)');
            expect(v).toBe(3724);
        });
    });

    describe("move", function() {
        var arr;

        beforeEach(function() {
            arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        });

        it("should be able to move the first item", function() {
            Ext.Array.move(arr, 0, 6);
            expect(arr).toEqual([2, 3, 4, 5, 6, 7, 1, 8, 9, 10, 11, 12]);
        });

        it("should be able to move the last item", function() {
            Ext.Array.move(arr, 11, 6);
            expect(arr).toEqual([1, 2, 3, 4, 5, 6, 12, 7, 8, 9, 10, 11]);
        });

        it("should leave the array intact if toIdx === fromIdx", function() {
            Ext.Array.move(arr, 7, 7);
            expect(arr).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
        });

        it("should be able to move an item to the first position", function() {
            Ext.Array.move(arr, 6, 0);
            expect(arr).toEqual([7, 1, 2, 3, 4, 5, 6, 8, 9, 10, 11, 12]);
        });

        it("should be able to move an item to the last position", function() {
            Ext.Array.move(arr, 6, 11);
            expect(arr).toEqual([1, 2, 3, 4, 5, 6, 8, 9, 10, 11, 12, 7]);
        });

        it("should be able to move a middle item before current index", function() {
            Ext.Array.move(arr, 6, 3);
            expect(arr).toEqual([1, 2, 3, 7, 4, 5, 6, 8, 9, 10, 11, 12]);
        });

        it("should be able to move a middle item after current index", function() {
            Ext.Array.move(arr, 6, 9);
            expect(arr).toEqual([1, 2, 3, 4, 5, 6, 8, 9, 10, 7, 11, 12]);
        });
    });
});
