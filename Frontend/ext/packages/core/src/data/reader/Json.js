/**
 * The JSON Reader is used by a Proxy to read a server response that is sent back in JSON format. This usually
 * happens as a result of loading a Store - for example we might create something like this:
 *
 *     Ext.define('User', {
 *         extend: 'Ext.data.Model',
 *         fields: ['id', 'name', 'email']
 *     });
 *
 *     var store = Ext.create('Ext.data.Store', {
 *         model: 'User',
 *         proxy: {
 *             type: 'ajax',
 *             url : 'users.json',
 *             reader: {
 *                 type: 'json'
 *             }
 *         }
 *     });
 *
 * The example above creates a 'User' model. Models are explained in the {@link Ext.data.Model Model} docs if you're
 * not already familiar with them.
 *
 * We created the simplest type of JSON Reader possible by simply telling our {@link Ext.data.Store Store}'s
 * {@link Ext.data.proxy.Proxy Proxy} that we want a JSON Reader. The Store automatically passes the configured model to the
 * Store, so it is as if we passed this instead:
 *
 *     reader: {
 *         type : 'json',
 *         model: 'User'
 *     }
 *
 * The reader we set up is ready to read data from our server - at the moment it will accept a response like this:
 *
 *     [
 *         {
 *             "id": 1,
 *             "name": "Ed Spencer",
 *             "email": "ed@sencha.com"
 *         },
 *         {
 *             "id": 2,
 *             "name": "Abe Elias",
 *             "email": "abe@sencha.com"
 *         }
 *     ]
 *
 * ## Reading other JSON formats
 *
 * If you already have your JSON format defined and it doesn't look quite like what we have above, you can usually
 * pass JsonReader a couple of configuration options to make it parse your format. For example, we can use the
 * {@link #cfg-rootProperty} configuration to parse data that comes back like this:
 *
 *     {
 *         "users": [
 *            {
 *                "id": 1,
 *                "name": "Ed Spencer",
 *                "email": "ed@sencha.com"
 *            },
 *            {
 *                "id": 2,
 *                "name": "Abe Elias",
 *                "email": "abe@sencha.com"
 *            }
 *         ]
 *     }
 *
 * To parse this we just pass in a {@link #rootProperty} configuration that matches the 'users' above:
 *
 *     reader: {
 *         type: 'json',
 *         rootProperty: 'users'
 *     }
 *
 * Sometimes the JSON structure is even more complicated. Document databases like CouchDB often provide metadata
 * around each record inside a nested structure like this:
 *
 *     {
 *         "total": 122,
 *         "offset": 0,
 *         "users": [
 *             {
 *                 "id": "ed-spencer-1",
 *                 "value": 1,
 *                 "user": {
 *                     "id": 1,
 *                     "name": "Ed Spencer",
 *                     "email": "ed@sencha.com"
 *                 }
 *             }
 *         ]
 *     }
 *
 * In the case above the record data is nested an additional level inside the "users" array as each "user" item has
 * additional metadata surrounding it ('id' and 'value' in this case). To parse data out of each "user" item in the
 * JSON above we need to specify the {@link #record} configuration like this:
 *
 *     reader: {
 *         type  : 'json',
 *         rootProperty  : 'users',
 *         record: 'user'
 *     }
 *
 * ## Response MetaData
 *
 * The server can return metadata in its response, in addition to the record data, that describe attributes
 * of the data set itself or are used to reconfigure the Reader. To pass metadata in the response you simply
 * add a `metaData` attribute to the root of the response data. The metaData attribute can contain anything,
 * but supports a specific set of properties that are handled by the Reader if they are present:
 * 
 * - {@link #rootProperty}: the property name of the root response node containing the record data
 * - {@link #totalProperty}: property name for the total number of records in the data
 * - {@link #successProperty}: property name for the success status of the response
 * - {@link #messageProperty}: property name for an optional response message
 * - {@link Ext.data.Model#cfg-fields fields}: Config used to reconfigure the Model's fields before converting the
 * response data into records
 * 
 * An initial Reader configuration containing all of these properties might look like this ("fields" would be
 * included in the Model definition, not shown):
 *
 *     reader: {
 *         type : 'json',
 *         rootProperty : 'root',
 *         totalProperty  : 'total',
 *         successProperty: 'success',
 *         messageProperty: 'message'
 *     }
 *
 * If you were to pass a response object containing attributes different from those initially defined above, you could
 * use the `metaData` attribute to reconfigure the Reader on the fly. For example:
 *
 *     {
 *         "count": 1,
 *         "ok": true,
 *         "msg": "Users found",
 *         "users": [{
 *             "userId": 123,
 *             "name": "Ed Spencer",
 *             "email": "ed@sencha.com"
 *         }],
 *         "metaData": {
 *             "rootProperty": "users",
 *             "totalProperty": 'count',
 *             "successProperty": 'ok',
 *             "messageProperty": 'msg'
 *         }
 *     }
 *
 * You can also place any other arbitrary data you need into the `metaData` attribute which will be ignored by the Reader,
 * but will be accessible via the Reader's {@link #metaData} property (which is also passed to listeners via the Proxy's
 * {@link Ext.data.proxy.Proxy#metachange metachange} event (also relayed by the store). Application code can then
 * process the passed metadata in any way it chooses.
 * 
 * A simple example for how this can be used would be customizing the fields for a Model that is bound to a grid. By passing
 * the `fields` property the Model will be automatically updated by the Reader internally, but that change will not be
 * reflected automatically in the grid unless you also update the column configuration. You could do this manually, or you
 * could simply pass a standard grid {@link Ext.panel.Table#columns column} config object as part of the `metaData` attribute
 * and then pass that along to the grid. Here's a very simple example for how that could be accomplished:
 *
 *     // response format:
 *     {
 *         ...
 *         "metaData": {
 *             "fields": [
 *                 { "name": "userId", "type": "int" },
 *                 { "name": "name", "type": "string" },
 *                 { "name": "birthday", "type": "date", "dateFormat": "Y-j-m" },
 *             ],
 *             "columns": [
 *                 { "text": "User ID", "dataIndex": "userId", "width": 40 },
 *                 { "text": "User Name", "dataIndex": "name", "flex": 1 },
 *                 { "text": "Birthday", "dataIndex": "birthday", "flex": 1, "format": 'Y-j-m', "xtype": "datecolumn" }
 *             ]
 *         }
 *     }
 *
 * The Reader will automatically read the meta fields config and rebuild the Model based on the new fields, but to handle
 * the new column configuration you would need to handle the metadata within the application code. This is done simply enough
 * by handling the metachange event on either the store or the proxy, e.g.:
 *
 *     var store = Ext.create('Ext.data.Store', {
 *         ...
 *         listeners: {
 *             'metachange': function(store, meta) {
 *                 myGrid.reconfigure(store, meta.columns);
 *             }
 *         }
 *     });
 *
 */
Ext.define('Ext.data.reader.Json', {
    extend: 'Ext.data.reader.Reader',
    
    requires: [
        'Ext.JSON'
    ],
    
    alternateClassName: 'Ext.data.JsonReader',
    alias : 'reader.json',

    config: {
        /**
        * @cfg {String} record The optional location within the JSON response that the record data itself can be found at.
        * See the JsonReader intro docs for more details. This is not often needed.
        */
       record: null,
    
        /**
        * @cfg {String} [metaProperty]
        * Name of the property from which to retrieve the `metaData` attribute. See {@link #metaData}.
        */
        metaProperty: 'metaData',

        /**
        * @cfg {Boolean} useSimpleAccessors True to ensure that field names/mappings are treated as literals when
        * reading values.
        *
        * For example, by default, using the mapping "foo.bar.baz" will try and read a property foo from the root, then a property bar
        * from foo, then a property baz from bar. Setting the simple accessors to true will read the property with the name
        * "foo.bar.baz" direct from the root object.
        */
        useSimpleAccessors: false,
        
        /**
         * @cfg {Boolean} preserveRawData
         * The reader will keep a copy of the most recent request in the {@link #rawData} property. For performance reasons,
         * the data object for each record is used directly as the model data. This means that these objects may be modified and
         * thus modify the raw data. To ensure the objects are copied, set this option to `true`. NB: This only applies to items 
         * that are read as part of the data array, any other metadata will not be modified:
         * 
         *     {
         *         "someOtherData": 1, // Won't be modified
         *         "root": [{}, {}, {}] // The objects here will be modified
         *     }
         */
        preserveRawData: false
    },
    
    updateRootProperty: function() {
        this.forceBuildExtractors();    
    },
    
    updateMetaProperty: function() {
        this.forceBuildExtractors();
    },

    /**
     * Reads a JSON object and returns a ResultSet. Uses the internal getTotal and getSuccess extractors to
     * retrieve meta data from the response, and extractData to turn the JSON data into model instances.
     * @param {Object} data The raw JSON data
     * @param {Object} [readOptions] See {@link #read} for details.
     * @return {Ext.data.ResultSet} A ResultSet containing model instances and meta data about the results
     */
    readRecords: function(data, readOptions, /* private */ internalReadOptions) {
        var me = this,
            meta;
            
        //this has to be before the call to super because we use the meta data in the superclass readRecords
        if (me.getMeta) {
            meta = me.getMeta(data);
            if (meta) {
                me.onMetaChange(meta);
            }
        } else if (data.metaData) {
            me.onMetaChange(data.metaData);
        }

        return me.callParent([data, readOptions, internalReadOptions]);
    },

    getResponseData: function(response) {
        var error;

        try {
            return Ext.decode(response.responseText);
        } catch (ex) {
            error = this.createReadError(ex.message);

            Ext.Logger.warn('Unable to parse the JSON returned by the server');
            this.fireEvent('exception', this, response, error);
            return error;
        }
    },

    buildExtractors : function() {
        var me = this,
            metaProp, rootProp;

        // Will only return true if we need to build
        if (me.callParent(arguments)) {
            metaProp = me.getMetaProperty();
            rootProp = me.getRootProperty();
            if (rootProp) {
                me.getRoot = me.getAccessor(rootProp);
            } else {
                me.getRoot = Ext.identityFn;
            }
        
            if (metaProp) {
                me.getMeta = me.getAccessor(metaProp);
            }
        }
    },

    /**
     * @private
     * We're just preparing the data for the superclass by pulling out the record objects we want. If a {@link #record}
     * was specified we have to pull those out of the larger JSON object, which is most of what this function is doing
     * @param {Object} root The JSON root node
     * @param {Object} [readOptions] See {@link #read} for details.
     * @return {Ext.data.Model[]} The records
     */
    extractData: function(root, readOptions) {
        var recordName = this.getRecord(),
            data = [],
            length, i;

        if (recordName) {
            length = root.length;
            
            if (!length && Ext.isObject(root)) {
                length = 1;
                root = [root];
            }

            for (i = 0; i < length; i++) {
                data[i] = root[i][recordName];
            }
        } else {
            data = root;
        }
        return this.callParent([data, readOptions]);
    },
    
    getModelData: function(raw) {
        return this.getPreserveRawData() ? Ext.apply({}, raw) : raw;    
    },

    /**
     * @private
     * @method
     * Returns an accessor function for the given property string. Gives support for properties such as the following:
     *
     * - 'someProperty'
     * - 'some.property'
     * - '["someProperty"]'
     * - 'values[0]'
     * 
     * This is used by {@link #buildExtractors} to create optimized extractor functions for properties that are looked
     * up directly on the source object (e.g. {@link #successProperty}, {@link #messageProperty}, etc.).
     */
    createAccessor: (function() {
        var re = /[\[\.]/;

        return function(expr) {
            var me = this,
                simple = me.getUseSimpleAccessors(),
                operatorIndex, result,
                current, parts, part, inExpr,
                isDot, isLeft, isRight,
                special, c, i, bracketed, len;

            if (!(expr || expr === 0)) {
                return;
            }

            if (typeof expr === 'function') {
                return expr;
            }
            
            if (!simple) {
                operatorIndex = String(expr).search(re);
            }
            
            if (simple === true || operatorIndex < 0) {
                result = function(raw) {
                    return raw[expr];
                };
            } else {
                // The purpose of this part is to generate a "safe" accessor for any complex 
                // json expression. For example 'foo.bar.baz' will get transformed:
                // raw.foo && raw.foo.bar && raw.foo.bar.baz
                current = 'raw';
                parts = [];
                part = '';
                inExpr = 0;
                len = expr.length;

                // The <= is intentional here. We handle the last character
                // being undefined so that we can append any final values at
                // the end
                for (i = 0; i <= len; ++i) {
                    c = expr[i];

                    isDot = c === '.';
                    isLeft = c === '[';
                    isRight = c === ']';

                    special = isDot || isLeft || isRight || !c;
                    // If either:
                    // a) Not a special char
                    // b) We're nested more than 1 deep, no single char can bring us out
                    // c) We are in an expr & it's not an ending brace
                    // Then just push the character on
                    if (!special || inExpr > 1 || (inExpr && !isRight)) {
                        part += c;
                    } else if (special) {
                        bracketed = false;
                        if (isLeft) {
                            ++inExpr;
                        } else if (isRight) {
                            --inExpr;
                            bracketed = true;
                        }

                        if (part) {
                            if (bracketed) {
                                part = '[' + part + ']';
                            } else {
                                part = '.' + part;
                            }
                            current += part;
                            // Concatting the empty string to the start fixes a very odd intermittent bug with IE9/10.
                            // On some occasions, without it, it will end up generating
                            // raw.foo.bar.baz && raw.foo.bar.baz && raw.foo.bar.baz
                            // At this point, not really sure why forcibly casting it to a string makes a difference
                            parts.push('' + current);
                            part = '';
                        }
                    }
                }
                result = parts.join(' && ');
                result = Ext.functionFactory('raw', 'return ' + result);
            }
            return result;
        };
    }()),

    /**
     * @private
     * @method
     * Returns an accessor function for the passed Field. Gives support for properties such as the following:
     * 
     * - 'someProperty'
     * - 'some.property'
     * - '["someProperty"]'
     * - 'values[0]'
     * 
     * This is used by {@link #buildExtractors} to create optimized extractor expressions when converting raw
     * data into model instances. This method is used at the field level to dynamically map values to model fields.
     */
    createFieldAccessor: function(field) {
        // Need to capture me for the extractor
        var me = this,
            mapping = field.mapping,
            hasMap = mapping || mapping === 0,
            map    = hasMap ? mapping : field.name;
            
        if (hasMap) {
            if (typeof map === 'function') {
                return function(raw) {
                    return field.mapping(raw, me);
                };
            } else {
                return me.createAccessor(map);
            }    
        }
    },

    getAccessorKey: function(prop) {
        var simple = this.getUseSimpleAccessors() ? 'simple' : '';
        return this.$className + simple + prop;
    },

    privates: {
        copyFrom: function(reader) {
            this.callParent([reader]);
            this.getRoot = reader.getRoot;
        }
    }
});
