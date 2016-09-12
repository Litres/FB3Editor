/*
 * This file contains miscellaneous utility methods that depends on various helper classes
 * like `Ext.Array` and `Ext.Date`. Historically these methods were defined in Ext.js or
 * Ext-more.js but that creates circular dependencies so they were consolidated here.
 */
Ext.apply(Ext, {
// @define Ext.Util
// @require Ext
// @require Ext.lang.*

    // shortcut for the special named scopes for listener scope resolution
    _namedScopes: {
        'this': { isThis: 1 },
        controller: { isController: 1 },
        // these two are private, used to indicate that listeners were declared on the
        // class body with either an unspecified scope, or scope:'controller'
        self: { isSelf: 1 },
        'self.controller': { isSelf: 1, isController: 1 }
    },

    escapeId: (function(){
        var validIdRe = /^[a-zA-Z_][a-zA-Z0-9_\-]*$/i,
            escapeRx = /([\W]{1})/g,
            leadingNumRx = /^(\d)/g,
            escapeFn = function(match, capture){
                return "\\" + capture;
            },
            numEscapeFn = function(match, capture){
                return '\\00' + capture.charCodeAt(0).toString(16) + ' ';
            };

        return function(id) {
            return validIdRe.test(id) ? id :
                // replace the number portion last to keep the trailing ' '
                // from being escaped
                id.replace(escapeRx, escapeFn).replace(leadingNumRx, numEscapeFn);
        };
    }()),

    /**
     * @method callback
     * @member Ext
     * Execute a callback function in a particular scope. If `callback` argument is a
     * function reference, that is called. If it is a string, the string is assumed to
     * be the name of a method on the given `scope`. If no function is passed the call
     * is ignored.
     *
     * For example, these calls are equivalent:
     *
     *      var myFunc = this.myFunc;
     *
     *      Ext.callback('myFunc', this, [arg1, arg2]);
     *      Ext.callback(myFunc, this, [arg1, arg2]);
     *
     *      Ext.isFunction(myFunc) && this.myFunc(arg1, arg2);
     *
     * @param {Function/String} callback The callback function to execute or the name of
     * the callback method on the provided `scope`.
     * @param {Object} [scope] The scope in which `callback` should be invoked. If `callback`
     * is a string this object provides the method by that name. If this is `null` then
     * the `caller` is used to resolve the scope to a `ViewController` or the proper
     * `defaultListenerScope`.
     * @param {Array} [args] The arguments to pass to the function.
     * @param {Number} [delay] Pass a number to delay the call by a number of milliseconds.
     * @param {Object} [caller] The object calling the callback. This is used to resolve
     * named methods when no explicit `scope` is provided.
     * @param {Object} [defaultScope=caller] The default scope to return if none is found.
     * @return The value returned by the callback or `undefined` (if there is a `delay`
     * or if the `callback` is not a function).
     */
    callback: function (callback, scope, args, delay, caller, defaultScope) {
        if (!callback) {
            return;
        }

        var namedScope = (scope in Ext._namedScopes);
        
        if (callback.charAt) { // if (isString(fn))
            if ((!scope || namedScope) && caller) {
                scope = caller.resolveListenerScope(namedScope ? scope : defaultScope);
            }
            //<debug>
            if (!scope || !Ext.isObject(scope)) {
                Ext.raise('Named method "' + callback + '" requires a scope object');
            }
            if (!Ext.isFunction(scope[callback])) {
                Ext.raise('No method named "' + callback + '" on ' +
                                (scope.$className || 'scope object'));
            }
            //</debug>

            callback = scope[callback];
        } else if (namedScope) {
            scope = defaultScope || caller;
        } else if (!scope) {
            scope = caller;
        }
        
        var ret;

        if (callback && Ext.isFunction(callback)) {
            scope = scope || Ext.global;
            if (delay) {
                Ext.defer(callback, delay, scope, args);
            } else if (Ext.elevateFunction) {
                ret = Ext.elevateFunction(callback, scope, args);
            } else if (args) {
                ret = callback.apply(scope, args);
            } else {
                ret = callback.call(scope);
            }
        }

        return ret;
    },

    /**
     * @method coerce
     * @member Ext
     * Coerces the first value if possible so that it is comparable to the second value.
     *
     * Coercion only works between the basic atomic data types String, Boolean, Number, Date, null and undefined.
     *
     * Numbers and numeric strings are coerced to Dates using the value as the millisecond era value.
     *
     * Strings are coerced to Dates by parsing using the {@link Ext.Date#defaultFormat defaultFormat}.
     * 
     * For example
     *
     *     Ext.coerce('false', true);
     *     
     * returns the boolean value `false` because the second parameter is of type `Boolean`.
     * 
     * @param {Mixed} from The value to coerce
     * @param {Mixed} to The value it must be compared against
     * @return The coerced value.
     */
    coerce: function(from, to) {
        var fromType = Ext.typeOf(from),
            toType = Ext.typeOf(to),
            isString = typeof from === 'string';

        if (fromType !== toType) {
            switch (toType) {
                case 'string':
                    return String(from);
                case 'number':
                    return Number(from);
                case 'boolean':
                    return isString && (!from || from === 'false') ? false : Boolean(from);
                case 'null':
                    return isString && (!from || from === 'null') ? null : from;
                case 'undefined':
                    return isString && (!from || from === 'undefined') ? undefined : from;
                case 'date':
                    return isString && isNaN(from) ? Ext.Date.parse(from, Ext.Date.defaultFormat) : Date(Number(from));
            }
        }
        return from;
    },

    /**
     * @method copyTo
     * @member Ext
     * Copies a set of named properties fom the source object to the destination object.
     *
     * Example:
     *
     *     var foo = { a: 1, b: 2, c: 3 };
     *
     *     var bar = Ext.copyTo({}, foo, 'a,c');
     *     // bar = { a: 1, c: 3 };
     *
     * Important note: To borrow class prototype methods, use {@link Ext.Base#borrow} instead.
     *
     * @param {Object} dest The destination object.
     * @param {Object} source The source object.
     * @param {String/String[]} names Either an Array of property names, or a comma-delimited list
     * of property names to copy.
     * @param {Boolean} [usePrototypeKeys=false] Pass `true` to copy keys off of the
     * prototype as well as the instance.
     * @return {Object} The `dest` object.
     * @deprecated 6.0.1 Use {@link Ext#copy Ext.copy} instead. This old method
     * would copy the named preoperties even if they did not exist in the source which
     * could produce `undefined` values in the destination.
     */
    copyTo: function (dest, source, names, usePrototypeKeys) {
        if (typeof names === 'string') {
            names = names.split(Ext.propertyNameSplitRe);
        }

        for (var name, i = 0, n = names ? names.length : 0; i < n; i++) {
            name = names[i];

            if (usePrototypeKeys || source.hasOwnProperty(name)) {
                dest[name] = source[name];
            }
        }

        return dest;
    },
    /**
     * @method copy
     * @member Ext
     * Copies a set of named properties fom the source object to the destination object.
     *
     * Example:
     *
     *     var foo = { a: 1, b: 2, c: 3 };
     *
     *     var bar = Ext.copy({}, foo, 'a,c');
     *     // bar = { a: 1, c: 3 };
     *
     * Important note: To borrow class prototype methods, use {@link Ext.Base#borrow} instead.
     *
     * @param {Object} dest The destination object.
     * @param {Object} source The source object.
     * @param {String/String[]} names Either an Array of property names, or a comma-delimited list
     * of property names to copy.
     * @param {Boolean} [usePrototypeKeys=false] Pass `true` to copy keys off of the
     * prototype as well as the instance.
     * @return {Object} The `dest` object.
     */
    copy: function (dest, source, names, usePrototypeKeys) {
        if (typeof names === 'string') {
            names = names.split(Ext.propertyNameSplitRe);
        }

        for (var name, i = 0, n = names ? names.length : 0; i < n; i++) {
            name = names[i];

            // Only copy a property if the source actually *has* that property.
            // If we are including prototype properties, then ensure that a property of
            // that name can be found *somewhere* in the prototype chain (otherwise we'd be copying undefined in which may break things)
            if (source.hasOwnProperty(name) || (usePrototypeKeys && name in source)) {
                dest[name] = source[name];
            }
        }

        return dest;
    },

    propertyNameSplitRe: /[,;\s]+/,

    /**
     * @method copyToIf
     * @member Ext
     * Copies a set of named properties fom the source object to the destination object
     * if the destination object does not already have them.
     *
     * Example:
     *
     *     var foo = { a: 1, b: 2, c: 3 };
     *
     *     var bar = Ext.copyToIf({ a:42 }, foo, 'a,c');
     *     // bar = { a: 42, c: 3 };
     *
     * @param {Object} destination The destination object.
     * @param {Object} source The source object.
     * @param {String/String[]} names Either an Array of property names, or a single string
     * with a list of property names separated by ",", ";" or spaces.
     * @return {Object} The `dest` object.
     * @deprecated 6.0.1 Use {@link Ext#copyIf Ext.copyIf} instead. This old method
     * would copy the named preoperties even if they did not exist in the source which
     * could produce `undefined` values in the destination.
     */
    copyToIf: function (destination, source, names) {
        if (typeof names === 'string') {
            names = names.split(Ext.propertyNameSplitRe);
        }

        for (var name, i = 0, n = names ? names.length : 0; i < n; i++) {
            name = names[i];

            if (destination[name] === undefined) {
                destination[name] = source[name];
            }
        }

        return destination;
    },

    /**
     * @method copyIf
     * @member Ext
     * Copies a set of named properties fom the source object to the destination object
     * if the destination object does not already have them.
     *
     * Example:
     *
     *     var foo = { a: 1, b: 2, c: 3 };
     *
     *     var bar = Ext.copyIf({ a:42 }, foo, 'a,c');
     *     // bar = { a: 42, c: 3 };
     *
     * @param {Object} destination The destination object.
     * @param {Object} source The source object.
     * @param {String/String[]} names Either an Array of property names, or a single string
     * with a list of property names separated by ",", ";" or spaces.
     * @return {Object} The `dest` object.
     */
    copyIf: function (destination, source, names) {
        if (typeof names === 'string') {
            names = names.split(Ext.propertyNameSplitRe);
        }

        for (var name, i = 0, n = names ? names.length : 0; i < n; i++) {
            name = names[i];

            // Only copy a property if the destination has no property by that name
            if (!(name in destination) && (name in source)) {
                destination[name] = source[name];
            }
        }

        return destination;
    },

    /**
     * @method extend
     * @member Ext
     * This method deprecated. Use {@link Ext#define Ext.define} instead.
     * @param {Function} superclass
     * @param {Object} overrides
     * @return {Function} The subclass constructor from the <tt>overrides</tt> parameter, or a generated one if not provided.
     * @deprecated 4.0.0 Use {@link Ext#define Ext.define} instead
     */
    extend: (function() {
        // inline overrides
        var objectConstructor = Object.prototype.constructor,
            inlineOverrides = function(o) {
            for (var m in o) {
                if (!o.hasOwnProperty(m)) {
                    continue;
                }
                this[m] = o[m];
            }
        };

        return function(subclass, superclass, overrides) {
            // First we check if the user passed in just the superClass with overrides
            if (Ext.isObject(superclass)) {
                overrides = superclass;
                superclass = subclass;
                subclass = overrides.constructor !== objectConstructor ? overrides.constructor : function() {
                    superclass.apply(this, arguments);
                };
            }

            //<debug>
            if (!superclass) {
                Ext.raise({
                    sourceClass: 'Ext',
                    sourceMethod: 'extend',
                    msg: 'Attempting to extend from a class which has not been loaded on the page.'
                });
            }
            //</debug>

            // We create a new temporary class
            var F = function() {},
                subclassProto, superclassProto = superclass.prototype;

            F.prototype = superclassProto;
            subclassProto = subclass.prototype = new F();
            subclassProto.constructor = subclass;
            subclass.superclass = superclassProto;

            if (superclassProto.constructor === objectConstructor) {
                superclassProto.constructor = superclass;
            }

            subclass.override = function(overrides) {
                Ext.override(subclass, overrides);
            };

            subclassProto.override = inlineOverrides;
            subclassProto.proto = subclassProto;

            subclass.override(overrides);
            subclass.extend = function(o) {
                return Ext.extend(subclass, o);
            };

            return subclass;
        };
    }()),

    /**
     * @method iterate
     * @member Ext
     * Iterates either an array or an object. This method delegates to
     * {@link Ext.Array#each Ext.Array.each} if the given value is iterable, and {@link Ext.Object#each Ext.Object.each} otherwise.
     *
     * @param {Object/Array} object The object or array to be iterated.
     * @param {Function} fn The function to be called for each iteration. See and {@link Ext.Array#each Ext.Array.each} and
     * {@link Ext.Object#each Ext.Object.each} for detailed lists of arguments passed to this function depending on the given object
     * type that is being iterated.
     * @param {Object} [scope] The scope (`this` reference) in which the specified function is executed.
     * Defaults to the object being iterated itself.
     */
    iterate: function(object, fn, scope) {
        if (Ext.isEmpty(object)) {
            return;
        }

        if (scope === undefined) {
            scope = object;
        }

        if (Ext.isIterable(object)) {
            Ext.Array.each.call(Ext.Array, object, fn, scope);
        }
        else {
            Ext.Object.each.call(Ext.Object, object, fn, scope);
        }
    },

    _resourcePoolRe: /^[<]([^<>@:]*)(?:[@]([^<>@:]+))?[>](.+)$/,

    /**
     * Resolves a resource URL that may contain a resource pool identifier token at the
     * front. The tokens are formatted as HTML tags "&lt;poolName@packageName&gt;" followed
     * by a normal relative path. This token is only processed if present at the first
     * character of the given string.
     *
     * These tokens are parsed and the pieces are then passed to the
     * {@link Ext#getResourcePath} method.
     *
     * For example:
     *
     *      [{
     *          xtype: 'image',
     *          src: '<shared>images/foo.png'
     *      },{
     *          xtype: 'image',
     *          src: '<@package>images/foo.png'
     *      },{
     *          xtype: 'image',
     *          src: '<shared@package>images/foo.png'
     *      }]
     *
     * In the above example, "shared" is the name of a Sencha Cmd resource pool and
     * "package" is the name of a Sencha Cmd package.
     *
     * @param {String} url The URL that may contain a resource pool token at the front.
     * @return {String}
     * @since 6.0.1
     */
    resolveResource: function (url) {
        var ret = url,
            m;

        if (url && url.charAt(0) === '<') {
            m = Ext._resourcePoolRe.exec(url);
            if (m) {
                ret = Ext.getResourcePath(m[3], m[1], m[2]);
            }
        }

        return ret;
    },

    /**
     *
     * @member Ext
     * @method urlEncode
     * @inheritdoc Ext.Object#toQueryString
     * @deprecated 4.0.0 Use {@link Ext.Object#toQueryString} instead
     */
    urlEncode: function () {
        var args = Ext.Array.from(arguments),
            prefix = '';

        // Support for the old `pre` argument
        if (Ext.isString(args[1])) {
            prefix = args[1] + '&';
            args[1] = false;
        }

        return prefix + Ext.Object.toQueryString.apply(Ext.Object, args);
    },

    /**
     * Alias for {@link Ext.Object#fromQueryString}.
     *
     * @member Ext
     * @method urlDecode
     * @inheritdoc Ext.Object#fromQueryString
     * @deprecated 4.0.0 Use {@link Ext.Object#fromQueryString} instead
     */
    urlDecode: function() {
        return Ext.Object.fromQueryString.apply(Ext.Object, arguments);
    },

    /**
     * @method getScrollbarSize
     * @member Ext
     * Returns the size of the browser scrollbars. This can differ depending on
     * operating system settings, such as the theme or font size.
     * @param {Boolean} [force] true to force a recalculation of the value.
     * @return {Object} An object containing scrollbar sizes.
     * @return {Number} return.width The width of the vertical scrollbar.
     * @return {Number} return.height The height of the horizontal scrollbar.
     */
    getScrollbarSize: function (force) {
        //<debug>
        if (!Ext.isDomReady) {
            Ext.raise("getScrollbarSize called before DomReady");
        }
        //</debug>

        var scrollbarSize = Ext._scrollbarSize;

        if (force || !scrollbarSize) {
            var db = document.body,
                div = document.createElement('div');

            div.style.width = div.style.height = '100px';
            div.style.overflow = 'scroll';
            div.style.position = 'absolute';

            db.appendChild(div); // now we can measure the div...

            // at least in iE9 the div is not 100px - the scrollbar size is removed!
            Ext._scrollbarSize = scrollbarSize = {
                width: div.offsetWidth - div.clientWidth,
                height: div.offsetHeight - div.clientHeight
            };

            db.removeChild(div);
        }

        return scrollbarSize;
    },

    /**
     * @method typeOf
     * @member Ext
     * Returns the type of the given variable in string format. List of possible values are:
     *
     * - `undefined`: If the given value is `undefined`
     * - `null`: If the given value is `null`
     * - `string`: If the given value is a string
     * - `number`: If the given value is a number
     * - `boolean`: If the given value is a boolean value
     * - `date`: If the given value is a `Date` object
     * - `function`: If the given value is a function reference
     * - `object`: If the given value is an object
     * - `array`: If the given value is an array
     * - `regexp`: If the given value is a regular expression
     * - `element`: If the given value is a DOM Element
     * - `textnode`: If the given value is a DOM text node and contains something other than whitespace
     * - `whitespace`: If the given value is a DOM text node and contains only whitespace
     *
     * @param {Object} value
     * @return {String}
     */
    typeOf: (function () {
        var nonWhitespaceRe = /\S/,
            toString = Object.prototype.toString,
            typeofTypes = {
                number: 1,
                string: 1,
                'boolean': 1,
                'undefined': 1
            },
            toStringTypes = {
                '[object Array]'  : 'array',
                '[object Date]'   : 'date',
                '[object Boolean]': 'boolean',
                '[object Number]' : 'number',
                '[object RegExp]' : 'regexp'
            };

        return function(value) {
            if (value === null) {
                return 'null';
            }

            var type = typeof value,
                ret, typeToString;

            if (typeofTypes[type]) {
                return type;
            }

            ret = toStringTypes[typeToString = toString.call(value)];
            if (ret) {
                return ret;
            }

            if (type === 'function') {
                return 'function';
            }

            if (type === 'object') {
                if (value.nodeType !== undefined) {
                    if (value.nodeType === 3) {
                        return nonWhitespaceRe.test(value.nodeValue) ? 'textnode' : 'whitespace';
                    }
                    else {
                        return 'element';
                    }
                }

                return 'object';
            }

            //<debug>
            Ext.raise({
                sourceClass: 'Ext',
                sourceMethod: 'typeOf',
                msg: 'Failed to determine the type of "' + value + '".'
            });
            //</debug>

            return typeToString;
        };
    }()),

    /**
     * A global factory method to instantiate a class from a config object. For example,
     * these two calls are equivalent:
     *
     *     Ext.factory({ text: 'My Button' }, 'Ext.Button');
     *     Ext.create('Ext.Button', { text: 'My Button' });
     *
     * If an existing instance is also specified, it will be updated with the supplied config object. This is useful
     * if you need to either create or update an object, depending on if an instance already exists. For example:
     *
     *     var button;
     *     button = Ext.factory({ text: 'New Button' }, 'Ext.Button', button);     // Button created
     *     button = Ext.factory({ text: 'Updated Button' }, 'Ext.Button', button); // Button updated
     *
     * @param {Object} config  The config object to instantiate or update an instance with.
     * @param {String} [classReference]  The class to instantiate from (if there is a default).
     * @param {Object} [instance]  The instance to update.
     * @param [aliasNamespace]
     * @member Ext
     */
    factory: function(config, classReference, instance, aliasNamespace) {
        var manager = Ext.ClassManager,
            newInstance;

        // If config is falsy or a valid instance, destroy the current instance
        // (if it exists) and replace with the new one
        if (!config || config.isInstance) {
            if (instance && instance !== config) {
                instance.destroy();
            }

            return config;
        }

        if (aliasNamespace) {
             // If config is a string value, treat it as an alias
            if (typeof config === 'string') {
                return manager.instantiateByAlias(aliasNamespace + '.' + config);
            }
            // Same if 'type' is given in config
            else if (Ext.isObject(config) && 'type' in config) {
                return manager.instantiateByAlias(aliasNamespace + '.' + config.type, config);
            }
        }

        if (config === true) {
            //<debug>
            if (!instance && !classReference) {
                Ext.raise('[Ext.factory] Cannot determine type of class to create');
            }
            //</debug>
            return instance || Ext.create(classReference);
        }

        //<debug>
        if (!Ext.isObject(config)) {
            Ext.raise("Invalid config, must be a valid config object");
        }
        //</debug>

        if ('xtype' in config) {
            newInstance = manager.instantiateByAlias('widget.' + config.xtype, config);
        }
        else if ('xclass' in config) {
            newInstance = Ext.create(config.xclass, config);
        }

        if (newInstance) {
            if (instance) {
                instance.destroy();
            }

            return newInstance;
        }

        if (instance) {
            return instance.setConfig(config);
        }

        return Ext.create(classReference, config);
    },

    /**
     * @method log
     * @member Ext
     * Logs a message. If a console is present it will be used. On Opera, the method
     * "opera.postError" is called. In other cases, the message is logged to an array
     * "Ext.log.out". An attached debugger can watch this array and view the log. The
     * log buffer is limited to a maximum of "Ext.log.max" entries (defaults to 250).
     *
     * If additional parameters are passed, they are joined and appended to the message.
     * A technique for tracing entry and exit of a function is this:
     *
     *     function foo () {
     *         Ext.log({ indent: 1 }, '>> foo');
     *
     *         // log statements in here or methods called from here will be indented
     *         // by one step
     *
     *         Ext.log({ outdent: 1 }, '<< foo');
     *     }
     *
     * This method does nothing in a release build.
     *
     * @param {String/Object} [options] The message to log or an options object with any
     * of the following properties:
     *
     *  - `msg`: The message to log (required).
     *  - `level`: One of: "error", "warn", "info" or "log" (the default is "log").
     *  - `dump`: An object to dump to the log as part of the message.
     *  - `stack`: True to include a stack trace in the log.
     *  - `indent`: Cause subsequent log statements to be indented one step.
     *  - `outdent`: Cause this and following statements to be one step less indented.
     *
     * @param {String...} [message] The message to log (required unless specified in
     * options object).
     */
    log:
    //<debug>
        (function () {
            /*
             * Iterate through an object to dump its content into a string.
             * For example:
             *     {
             *         style: {
             *             lineWidth: 1
             *         },
             *         label: {},
             *         marker: {
             *             strokeStyle: "#555",
             *             radius: 3,
             *             size: 3
             *         },
             *         subStyle: {
             *             fillStyle: [
             *                 0: "#133987",
             *                 1: "#1c55ca",
             *                 2: "#4d7fe6"
             *             ]
             *         },
             *         markerSubStyle: {}
             *     } 
             *
             * @param {Object} object The object to iterate
             * @param {Number} [level] Current level of identation (and recursion). Default is 0.
             * @param {Number} [maxLevel] Maximum level of recursion. Default is 3.
             * @param {Boolean} [withFunctions] Include functions in the output.
             * @return {String} The string with the contents of the object
             */
            var primitiveRe = /string|number|boolean/;
            function dumpObject (object, level, maxLevel, withFunctions) {
                var member, type, value, name, prefix, suffix,
                    members = [];

                if (Ext.isArray(object)) {
                    prefix = '[';
                    suffix = ']';
                } else if (Ext.isObject(object)) {
                    prefix = '{';
                    suffix = '}';
                }
                if (!maxLevel) {
                    maxLevel = 3;
                }
                if (level > maxLevel) {
                    return prefix+'...'+suffix;
                }

                level = level || 1;
                var spacer = (new Array(level)).join('    ');

                // Cannot use Ext.encode since it can recurse endlessly
                for (name in object) {
                    if (object.hasOwnProperty(name)) {
                        value = object[name];

                        type = typeof value;
                        if (type === 'function') {
                            if (!withFunctions) {
                                continue;
                            }
                            member = type;
                        } else if (type === 'undefined') {
                            member = type;
                        } else if (value === null || primitiveRe.test(type) || Ext.isDate(value)) {
                            member = Ext.encode(value);
                        } else if (Ext.isArray(value)) {
                            member = dumpObject(value, level+1, maxLevel, withFunctions);
                        } else if (Ext.isObject(value)) {
                            member = dumpObject(value, level+1, maxLevel, withFunctions);
                        } else {
                            member = type;
                        }
                        members.push(spacer + name + ': ' + member);    // or Ext.encode(name)
                    }
                }
                if (members.length) {
                    return prefix + '\n    '+ members.join(',\n    ') + '\n'+spacer+suffix;
                }
                return prefix+suffix;
            }

            function log (message) {
                var options, dump,
                    con = Ext.global.console,
                    level = 'log',
                    indent = log.indent || 0,
                    prefix, stack, fn, out, max;

                log.indent = indent;

                if (typeof message !== 'string') {
                    options = message;
                    message = options.msg || '';
                    level = options.level || level;
                    dump = options.dump;
                    stack = options.stack;
                    prefix = options.prefix;
                    fn = options.fn;

                    if (options.indent) {
                        ++log.indent;
                    } else if (options.outdent) {
                        log.indent = indent = Math.max(indent - 1, 0);
                    }

                    if (dump && !(con && con.dir)) {
                        message += dumpObject(dump);
                        dump = null;
                    }
                }

                if (arguments.length > 1) {
                    message += Array.prototype.slice.call(arguments, 1).join('');
                }

                if (prefix) {
                    message = prefix + ' - ' + message;
                }

                message = indent ? Ext.String.repeat(' ', log.indentSize * indent) + message : message;
                // w/o console, all messages are equal, so munge the level into the message:
                if (level !== 'log') {
                    message = '[' + level.charAt(0).toUpperCase() + '] ' + message;
                }

                if (fn) {
                    message += '\nCaller: ' + fn.toString();
                }

                // Not obvious, but 'console' comes and goes when Firebug is turned on/off, so
                // an early test may fail either direction if Firebug is toggled.
                //
                if (con) { // if (Firebug-like console)
                    if (con[level]) {
                        con[level](message);
                    } else {
                        con.log(message);
                    }

                    if (dump) {
                        con.dir(dump);
                    }

                    if (stack && con.trace) {
                        // Firebug's console.error() includes a trace already...
                        if (!con.firebug || level !== 'error') {
                            con.trace();
                        }
                    }
                } else if (Ext.isOpera) {
                    opera.postError(message); // jshint ignore:line
                } else {
                    out = log.out;
                    max = log.max;

                    if (out.length >= max) {
                        // this formula allows out.max to change (via debugger), where the
                        // more obvious "max/4" would not quite be the same
                        Ext.Array.erase(out, 0, out.length - 3 * Math.floor(max / 4)); // keep newest 75%
                    }

                    out.push(message);
                }

                // Mostly informational, but the Ext.Error notifier uses them:
                ++log.count;
                ++log.counters[level];
            }

            function logx (level, args) {
                if (typeof args[0] === 'string') {
                    args.unshift({});
                }
                args[0].level = level;
                log.apply(this, args);
            }

            log.error = function () {
                logx('error', Array.prototype.slice.call(arguments));
            };
            log.info = function () {
                logx('info', Array.prototype.slice.call(arguments));
            };
            log.warn = function () {
                logx('warn', Array.prototype.slice.call(arguments));
            };

            log.count = 0;
            log.counters = { error: 0, warn: 0, info: 0, log: 0 };
            log.indentSize = 2;
            log.out = [];
            log.max = 750;

            return log;
        }()) ||
    //</debug>
        (function () {
            var nullLog = function () {};
            nullLog.info = nullLog.warn = nullLog.error = Ext.emptyFn;
            return nullLog;
        }())
});
