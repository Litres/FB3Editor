/**
 * Readers are used to interpret data to be loaded into a {@link Ext.data.Model Model} instance or a {@link
 * Ext.data.Store Store} - often in response to an AJAX request. In general there is usually no need to create
 * a Reader instance directly, since a Reader is almost always used together with a {@link Ext.data.proxy.Proxy Proxy},
 * and is configured using the Proxy's {@link Ext.data.proxy.Proxy#cfg-reader reader} configuration property:
 * 
 *     Ext.create('Ext.data.Store', {
 *         model: 'User',
 *         proxy: {
 *             type: 'ajax',
 *             url : 'users.json',
 *             reader: {
 *                 type: 'json',
 *                 rootProperty: 'users'
 *             }
 *         },
 *     });
 *     
 * The above reader is configured to consume a JSON string that looks something like this:
 *  
 *     {
 *         "success": true,
 *         "users": [
 *             { "name": "User 1" },
 *             { "name": "User 2" }
 *         ]
 *     }
 * 
 *
 * # Loading Nested Data
 *
 * Readers have the ability to automatically load deeply-nested data objects based on the {@link Ext.data.schema.Association associations}
 * configured on each Model. Below is an example demonstrating the flexibility of these associations in a
 * fictional CRM system which manages a User, their Orders, OrderItems and Products. First we'll define the models:
 *
 *     Ext.define("User", {
 *         extend: 'Ext.data.Model',
 *         fields: [
 *             'id', 'name'
 *         ],
 *
 *         hasMany: {model: 'Order', name: 'orders'},
 *
 *         proxy: {
 *             type: 'rest',
 *             url : 'users.json',
 *             reader: {
 *                 type: 'json',
 *                 rootProperty: 'users'
 *             }
 *         }
 *     });
 *
 *     Ext.define("Order", {
 *         extend: 'Ext.data.Model',
 *         fields: [
 *             'id', 'total'
 *         ],
 *
 *         hasMany  : {model: 'OrderItem', name: 'orderItems', associationKey: 'order_items'},
 *         belongsTo: 'User'
 *     });
 *
 *     Ext.define("OrderItem", {
 *         extend: 'Ext.data.Model',
 *         fields: [
 *             'id', 'price', 'quantity', 'order_id', 'product_id'
 *         ],
 *
 *         belongsTo: ['Order', {model: 'Product', associationKey: 'product'}]
 *     });
 *
 *     Ext.define("Product", {
 *         extend: 'Ext.data.Model',
 *         fields: [
 *             'id', 'name'
 *         ],
 *
 *         hasMany: 'OrderItem'
 *     });
 *
 * This may be a lot to take in - basically a User has many Orders, each of which is composed of several OrderItems.
 * Finally, each OrderItem has a single Product. This allows us to consume data like this:
 *
 *     {
 *         "users": [
 *             {
 *                 "id": 123,
 *                 "name": "Ed",
 *                 "orders": [
 *                     {
 *                         "id": 50,
 *                         "total": 100,
 *                         "order_items": [
 *                             {
 *                                 "id"      : 20,
 *                                 "price"   : 40,
 *                                 "quantity": 2,
 *                                 "product" : {
 *                                     "id": 1000,
 *                                     "name": "MacBook Pro"
 *                                 }
 *                             },
 *                             {
 *                                 "id"      : 21,
 *                                 "price"   : 20,
 *                                 "quantity": 3,
 *                                 "product" : {
 *                                     "id": 1001,
 *                                     "name": "iPhone"
 *                                 }
 *                             }
 *                         ]
 *                     }
 *                 ]
 *             }
 *         ]
 *     }
 *
 * The JSON response is deeply nested - it returns all Users (in this case just 1 for simplicity's sake), all of the
 * Orders for each User (again just 1 in this case), all of the OrderItems for each Order (2 order items in this case),
 * and finally the Product associated with each OrderItem. Now we can read the data and use it as follows:
 *
 *     var store = Ext.create('Ext.data.Store', {
 *         model: "User"
 *     });
 *
 *     store.load({
 *         callback: function() {
 *             //the user that was loaded
 *             var user = store.first();
 *
 *             console.log("Orders for " + user.get('name') + ":")
 *
 *             //iterate over the Orders for each User
 *             user.orders().each(function(order) {
 *                 console.log("Order ID: " + order.getId() + ", which contains items:");
 *
 *                 //iterate over the OrderItems for each Order
 *                 order.orderItems().each(function(orderItem) {
 *                     //we know that the Product data is already loaded, so we can use the synchronous getProduct
 *                     //usually, we would use the asynchronous version (see {@link Ext.data.Model#belongsTo})
 *                     var product = orderItem.getProduct();
 *
 *                     console.log(orderItem.get('quantity') + ' orders of ' + product.get('name'));
 *                 });
 *             });
 *         }
 *     });
 *
 * Running the code above results in the following:
 *
 *     Orders for Ed:
 *     Order ID: 50, which contains items:
 *     2 orders of MacBook Pro
 *     3 orders of iPhone
 */
Ext.define('Ext.data.reader.Reader', {
    alternateClassName: ['Ext.data.Reader', 'Ext.data.DataReader'],

    requires: [
        'Ext.data.ResultSet',
        'Ext.XTemplate',
        'Ext.util.LruCache'
    ],

    mixins: [
        'Ext.mixin.Observable',
        'Ext.mixin.Factoryable'
    ],

    alias: 'reader.base',
    factoryConfig: {
        defaultType: null
    },

    config: {
        /**
        * @cfg {String} [totalProperty]
        * Name of the property from which to retrieve the total number of records in the dataset. This is only needed if
        * the whole dataset is not passed in one go, but is being paged from the remote server.
        */
        totalProperty: 'total',

        /**
        * @cfg {String} [successProperty]
        * Name of the property from which to retrieve the `success` attribute, the value of which indicates
        * whether a given request succeeded or failed (typically a boolean or 'true'|'false'). See
        * {@link Ext.data.proxy.Server}.{@link Ext.data.proxy.Server#exception exception} for additional information.
        */
        successProperty: 'success',
       
        /**
         * @cfg {String/Function} rootProperty
         * The property that contains data items corresponding to the 
         * Model(s) of the configured Reader. `rootProperty` varies by Reader type.
         * 
         * ##JSON Reader 
         * `rootProperty` is a property name. It may also be a dot-separated 
         * list of property names if the root is nested. The root JSON array will be 
         * used by default.
         * 
         *     // rootPropety config
         *     rootProperty: 'embedded.myresults'
         *     
         *     // server response
         *     {
         *         embedded: {
         *             myresults: [{
         *                 name: 'Scott',
         *                 age: 22
         *             }, {
         *                 name: 'Ramona',
         *                 age: 24
         *             }]
         *         },
         *         success: true
         *     }
         * 
         * ##XML Reader 
         * `rootProperty` is a CSS selector. The root XML element will be used
         * by default.
         * 
         *     // rootProperty config (plus record config)
         *     rootProperty: 'myresults',
         *     record: 'user'
         *     
         *     // server response
         *     <?xml version="1.0" encoding="UTF-8"?>
         *     <embedded>
         *         <myresults>
         *             <user>
         *                 <name>Scott</name>
         *                 <age>22</age>
         *             </user>
         *             <user>
         *                 <name>Ramona</name>
         *                 <age>24</age>
         *             </user>
         *         </myresults>
         *     </embedded>
         * 
         * ##Array Reader 
         * `rootProperty` is not typically applicable since the data is assumed to be a
         * single-level array of arrays.  However, if the array of records is returned 
         * within a JSON response a `rootProperty` config may be used:
         * 
         *     // rootProperty config
         *     rootProperty: 'embedded.myresults'
         *     
         *     // server response
         *     {
         *         embedded: {
         *             myresults: [['Scott', 22], ['Ramona', 24]]
         *         },
         *         success: true
         *     }
         * 
         * ##rootProperty as a function
         * The `rootProperty` may also be a function that returns the root node from 
         * the dataset. For example:
         *
         *     var store = Ext.create('Ext.data.TreeStore', {
         *         proxy: {
         *             type: 'memory',
         *             reader: {
         *                 type: 'json',
         *                 rootProperty: function(data){
         *                     // Extract child nodes from the items or children property in the dataset
         *                     return data.items || data.children;
         *                 }
         *             }
         *         }, 
         *         data: {
         *             items: [{
         *                 text: 'item 1',
         *                 children: [{
         *                     text: 'child A',
         *                     leaf: true
         *                 }]
         *             }]
         *         }
         *     });
         *
         *     Ext.create('Ext.tree.Panel', {
         *         title: 'rootProperty as a function',
         *         width: 200,
         *         height:150,
         *         store: store,
         *         rootVisible: false,
         *         renderTo: Ext.getBody()
         *     });
         */
         rootProperty: '',
    
        /**
        * @cfg {String} messageProperty
        * The name of the property which contains a response message for exception handling. If you want to return a false success
        * response from the server, maybe due to some server-side validation, the messageProperty can hold the error message. For
        * example:
        *
        *     {
        *         "success": false,
        *         "error": "There was an error with your request"
        *     }
        *
        * You can retrieve this error message in a callback when loading a {@link Ext.data.Store Store} or {@link Ext.data.Model Model} like:
        *
        *     var store = new Ext.data.Store({
        *         fields : ['foo'],
        *         proxy  : {
        *             type   : 'ajax',
        *             url    : 'data.json',
        *             reader : {
        *                 type            : 'json',
        *                 rootProperty    : 'data',
        *                 messageProperty : 'error'
        *             }
        *         }
        *     });
        *
        *     store.load({
        *         callback: function(records, operation, success) {
        *             if (success) {
        *                 // ...
        *             } else {
        *                 var error = operation.getError();
        *
        *                 Ext.Msg.alert('Error', error);
        *             }
        *         }
        *     });
        *
        * In this example, the callback will execute with `success` being `false` and will therefore show the {@link Ext.MessageBox#alert Ext.Msg.alert} with
        * the error string returned in the response.
        */
       messageProperty: '',

       /**
        * @cfg {String} [typeProperty]
        * The name of the property in a node raw data block which indicates the type of the model to be created from that raw data. Useful for heterogeneous trees.
        *
        * For example, hierarchical geographical data may look like this:
        *
        *     {
        *         nodeType: 'Territory',
        *         name: 'EMEA',
        *         children: [{
        *             nodeType: 'Country',
        *             name: 'United Kingdon',
        *             children: [{
        *                 nodeType: 'City',
        *                 name: 'London'
        *             }]
        *         }]
        *     }
        *
        * You would configure the typeProperty in this case to be `"nodeType"` which would cause the models named "Territory", "Country" and "City" to
        * be used.
        */
       typeProperty: '',
    
        /**
        * @cfg {Boolean} [implicitIncludes]
        * True to automatically parse models nested within other models in a response object. See the
        * Ext.data.reader.Reader intro docs for full explanation.
        */
        implicitIncludes: true,
    
        /**
        * @cfg {Boolean} [readRecordsOnFailure]
        * True to extract the records from a data packet even if the {@link #successProperty} returns false.
        */
        readRecordsOnFailure: true,
        
        /**
         * @cfg {String/Ext.data.Model} [model]
         * The model to use for this reader. This config is only required if the reader is being used
         * without a proxy, otherwise the proxy will automatically set the model.
         */
        model: null,
        
        /**
         * @cfg {Ext.data.proxy.Proxy} [proxy]
         * The proxy attached to this reader. Typically only needed onMetaChange so that
         * we can set the new model on the proxy.
         * @private
         */
        proxy: null,
        
        /**
         * @cfg {Function|String|Object} [transform]
         * If a transform function is set, it will be invoked just before {@link #readRecords} executes.
         * It is passed the raw (deserialized) data object. The transform function returns a data object, which can be
         * a modified version of the original data object, or a completely new data object. The transform can
         * be a function, or a method name on the Reader instance, or an object with a 'fn' key
         * and an optional 'scope' key.
         *
         * Example usage:
         *
         *     Ext.create('Ext.data.Store', {
         *         model: 'User',
         *         proxy: {
         *             type: 'ajax',
         *             url : 'users.json',
         *             reader: {
         *                 type: 'json',
         *                 transform: {
         *                     fn: function(data) {
         *                         // do some manipulation of the raw data object
         *                         return data;
         *                     },
         *                     scope: this
         *                 }
         *             }
         *         },
         *     });
         *
         */ 
        transform: null,
        
        /**
         * @cfg {Boolean} [keepRawData] Determines if the Reader will keep raw data
         * received from the server in the {@link #rawData} property.
         *
         * While this might seem useful to do additional data processing, keeping raw data
         * might cause adverse effects such as memory leaks. It is recommended to set
         * `keepRawData` to `false` if you do not need the raw data.
         *
         * If you need to process data packet to extract additional data such as row summaries,
         * it is recommended to use {@link #transform} function for that purpose.
         *
         * Note that starting with Ext JS 6.0 the default behavior has been changed to
         * **not** keep the raw data because of the high potential for memory leaks.
         * @since 5.1.1
         */
        keepRawData: null
    },
    
    /**
     * @property {Object} rawData
     * The raw data object that was last passed to {@link #readRecords}. rawData is populated 
     * based on the results of {@link Ext.data.proxy.Server#processResponse}. rawData will 
     * maintain a cached copy of the last successfully returned records. In other words, 
     * if processResponse is unsuccessful, the records from the last successful response 
     * will remain cached in rawData.
     *
     * Since Ext JS 5.1.1 you can use the {@link #keepRawData} config option to
     * control this behavior.
     */
    
    /**
     * @property {Object} metaData
     * The raw meta data that was most recently read, if any. Meta data can include existing
     * Reader config options like {@link #totalProperty}, etc. that get
     * automatically applied to the Reader, and those can still be accessed directly from the Reader
     * if needed. However, meta data is also often used to pass other custom data to be processed
     * by application code. For example, it is common when reconfiguring the data model of a grid to
     * also pass a corresponding column model config to be applied to the grid. Any such data will
     * not get applied to the Reader directly (it just gets passed through and is ignored by Ext).
     * This metaData property gives you access to all meta data that was passed, including any such
     * custom data ignored by the reader.
     * 
     * This is a read-only property, and it will get replaced each time a new meta data object is
     * passed to the reader. Note that typically you would handle proxy's
     * {@link Ext.data.proxy.Proxy#metachange metachange} event which passes this exact same meta
     * object to listeners. However this property is available if it's more convenient to access it
     * via the reader directly in certain cases.
     * @readonly
     */
    
    /**
     * @property {Boolean} isReader
     * `true` in this class to identify an object as an instantiated Reader, or subclass thereof.
     **/
    isReader: true,
    
    /**
     * @event exception
     * Fires when the reader receives improperly encoded data from the server
     * @param {Ext.data.reader.Reader} reader A reference to this reader
     * @param {XMLHttpRequest} response The XMLHttpRequest response object
     * @param {Ext.data.ResultSet} error The error object
     */

    /**
     * Creates new Reader.
     * @param {Object} [config] Config object.
     */
    constructor: function(config) {
        if (config && config.hasOwnProperty('root')) {
            config = Ext.apply({}, config);
            config.rootProperty = config.root;
            delete config.root;
            //<debug>
            Ext.log.error('Ext.data.reader.Reader: Using the deprecated "root" configuration. Use "rootProperty" instead.');
            //</debug>
        }

        var me = this;
        me.duringInit = 1;
        // Will call initConfig
        me.mixins.observable.constructor.call(me, config);
        --me.duringInit;
        me.buildExtractors();
    },
    
    applyModel: function (model) {
        return Ext.data.schema.Schema.lookupEntity(model);
    },
    
    applyTransform: function(transform) {
        if (transform) {
            if (Ext.isFunction(transform)) {
                transform = {fn:transform};
            }
            else if (transform.charAt) { // faster than Ext.isString()
                transform = { fn: this[transform] };
            }
            
            return transform.fn.bind(transform.scope || this);
        }
        
        return transform;
    },
    
    forceBuildExtractors: function() {
        if (!this.duringInit) {
            this.buildExtractors(true);
        }
    },
    
    updateTotalProperty: function() {
        this.forceBuildExtractors();    
    },
    
    updateMessageProperty: function() {
        this.forceBuildExtractors();    
    },
    
    updateSuccessProperty: function() {
        this.forceBuildExtractors();
    },

    /**
     * Reads the given response object. This method normalizes the different types of response object that may be passed to it.
     * If it's an XMLHttpRequest object, hand off to the subclass' {@link #getResponseData} method.
     * Else, hand off the reading of records to the {@link #readRecords} method.
     * @param {Object} response The response object. This may be either an XMLHttpRequest object or a plain JS object
     * @param {Object} [readOptions] Various options that instruct the reader on how to read the data
     * @param {Function} [readOptions.recordCreator] A function to construct the model based on the processed data. By default,
     * this just calls the model constructor and passes the raw data.
     * @return {Ext.data.ResultSet} The parsed or default ResultSet object
     */
    read: function(response, readOptions) {
        var data, result;

        if (response) {
            if (response.responseText) {
                result = this.getResponseData(response);
                if (result && result.__$isError) {
                    return new Ext.data.ResultSet({
                        total  : 0,
                        count  : 0,
                        records: [],
                        success: false,
                        message: result.msg
                    });
                } else {
                    data = this.readRecords(result, readOptions);
                }
            } else {
                data = this.readRecords(response, readOptions);
            }
        }

        return data || this.nullResultSet;
    },

    /**
     * Returns the shared null result set.
     * @return {Ext.data.ResultSet} The null result set.
     * 
     * @private
     */
    getNullResultSet: function() {
        return this.nullResultSet;
    },

    /**
     * Creates an object that identifies a read error occurred.
     * @param {String} msg An error message to include
     * @return {Object} An error object
     * 
     * @private
     */
    createReadError: function(msg) {
        return {
            __$isError: true,
            msg: msg    
        };
    },

    /**
     * Abstracts common functionality used by all Reader subclasses. Each subclass is expected to call this function
     * before running its own logic and returning the Ext.data.ResultSet instance. For most Readers additional
     * processing should not be needed.
     * @param {Object} data The raw data object
     * @param {Object} [readOptions] See {@link #read} for details.
     * @return {Ext.data.ResultSet} A ResultSet object
     */
    readRecords: function(data, readOptions, /* private */ internalReadOptions) {
        var me = this,
            recordsOnly = internalReadOptions && internalReadOptions.recordsOnly,
            asRoot = internalReadOptions && internalReadOptions.asRoot,
            success,
            recordCount,
            records,
            root,
            total,
            value,
            message,
            transform;
        
        transform = this.getTransform();
        if (transform) {
            data = transform(data);
        }
          
        me.buildExtractors();
        
        if (me.getKeepRawData()) {
            me.rawData = data;
        }
        
        if (me.hasListeners.rawdata) {
            me.fireEventArgs('rawdata', [data]);
        }

        data = me.getData(data);
        
        success = true;
        recordCount = 0;
        records = [];
            
        if (me.getSuccessProperty()) {
            value = me.getSuccess(data);
            if (value === false || value === 'false') {
                success = false;
            }
        }
        
        if (me.getMessageProperty()) {
            message = me.getMessage(data);
        }

        
        // Only try and extract other data if call was successful
        if (success || me.getReadRecordsOnFailure()) {
            // If we pass an array as the data, we don't use getRoot on the data.
            // Instead the root equals to the data.
            root = (asRoot || Ext.isArray(data)) ? data : me.getRoot(data);
            
            if (root) {
                total = root.length;
            }

          if (me.getTotalProperty()) {
                value = parseInt(me.getTotal(data), 10);
                if (!isNaN(value)) {
                    total = value;
                }
            }

           if (root) {
                records = me.extractData(root, readOptions);
                recordCount = records.length;
            }
        }

        return recordsOnly ? records : new Ext.data.ResultSet({
            total  : total || recordCount,
            count  : recordCount,
            records: records,
            success: success,
            message: message
        });
    },

    /**
     * Returns extracted, type-cast rows of data.
     * @param {Object[]/Object} root from server response
     * @param {Object} [readOptions] An object containing extra options.
     * @param {Function} [readOptions.model] The Model constructor to use.
     * @param {Function} [readOptions.recordCreator] A function to use to create and initialize records. By default a function
     * is supplied which creates *non-phantom* records on the assumnption that a Reader is going to be used to read server-supplied data.
     * @param {Object} [readOptions.recordCreator.data] The raw data used to create a record.
     * @param {Function} [readOptions.recordCreator.Model] The Model constructor to use to create the record.
     * @return {Array} An array of records containing the extracted data		
     * @private
     */
    extractData: function(root, readOptions) {
        var me = this,
            entityType = readOptions && readOptions.model ? Ext.data.schema.Schema.lookupEntity(readOptions.model) : me.getModel(),
            schema = entityType.schema,
            includes = schema.hasAssociations(entityType) && me.getImplicitIncludes(),
            fieldExtractorInfo = me.getFieldExtractorInfo(entityType.fieldExtractors),
            length = root.length,
            records = new Array(length),
            typeProperty = me.getTypeProperty(),
            reader, node, nodeType, record, i;
            
        if (!length && Ext.isObject(root)) {
            root = [root];
            length = 1;
        }

        for (i = 0; i < length; i++) {
            record = root[i];
            if (!record.isModel) {
                // If we're given a model instance in the data, just push it on
                // without doing any conversion. Otherwise, create a record.
                node = record;

                // This Reader may be configured to produce different model types based on
                // a differentiator field in the incoming data:
                // typeProperty name be a string, a function which yields the child type, or an object: {
                //     name: 'mtype',
                //     namespace: 'MyApp'
                // }
                if (typeProperty && (nodeType = me.getChildType(schema, node, typeProperty))) {

                    reader = nodeType.getProxy().getReader();

                    record = reader.extractRecord(node, readOptions, nodeType,
                                schema.hasAssociations(nodeType) && reader.getImplicitIncludes(),
                                reader.getFieldExtractorInfo(nodeType.fieldExtractors));
                } else {
                    record = me.extractRecord(node, readOptions, entityType, includes,
                                              fieldExtractorInfo);
                }
                
                // Generally we don't want to have references to XML documents
                // or XML nodes to hang around in memory but Trees need to be able
                // to access the raw XML node data in order to process its children.
                // See https://sencha.jira.com/browse/EXTJS-15785 and
                // https://sencha.jira.com/browse/EXTJS-14286
                if (record.isModel && record.isNode) {
                    record.raw = node;
                }
            }
            if (record.onLoad) {
                record.onLoad();
            }
            records[i] = record;
        }

        return records;
    },

    // Based upon a Reader's typeProperty config, determine the type of child node to create from the raw data
    getChildType: function(schema, rawNode, typeProperty) {
        var namespace;

        switch (typeof typeProperty) {
            case 'string':
                return schema.getEntity(rawNode[typeProperty]);
            case 'object':
                namespace = typeProperty.namespace;
                return schema.getEntity((namespace ? namespace + '.' : '') + rawNode[typeProperty.name]);
            case 'function':
                return schema.getEntity(typeProperty(rawNode));
        }
    },

    extractRecordData: function(node, readOptions) {
        var entityType = readOptions && readOptions.model ? Ext.data.schema.Schema.lookupEntity(readOptions.model) : this.getModel(),
            fieldExtractorInfo = this.getFieldExtractorInfo(entityType.fieldExtractors);

        return this.extractRecord(node, readOptions, entityType, false, fieldExtractorInfo);
    },

    extractRecord: function (node, readOptions, entityType, includes, fieldExtractorInfo) {
        var me = this,
            creatorFn = (readOptions && readOptions.recordCreator) || me.defaultRecordCreator,
            modelData, record;
            
        // Create a record with an empty data object.
        // Populate that data object by extracting and converting field values from raw data.
        // Must pass the ID to use because we pass no data for the constructor to pluck an ID from
        modelData = me.extractModelData(node, fieldExtractorInfo);
        record = creatorFn.call(me, modelData, entityType || me.getModel(), readOptions);
        if (includes && record.isModel) {
            me.readAssociated(record, node, readOptions);
        }
        return record;
    },
    
    getFieldExtractorInfo: function(extractors) {
        // If the base Ext.data.Model class is being used, there will be no extractor info
        // The raw data block will be imported unchanged.
        if (!extractors) {
            return;
        }

        var type = this.$className,
            extractor = extractors[type];
            
        // If we have no extractors, buildFieldExtractors will return null,
        // so we never need to rebuild them
        if (extractor === undefined) {
            extractors[type] = extractor = this.buildFieldExtractors();
        }   
        return extractor;
    },
    
    buildFieldExtractors: function() {
        var fields = this.getFields(),
            len = fields.length,
            buffer = [],
            extractors = [],
            out = null,
            cnt = 0,
            field, name, i, extractor;
        
        for (i = 0; i < len; ++i) {
            field = fields[i];
            extractor = this.createFieldAccessor(field);
            if (extractor) {
                name = field.name;
                // Use [] property access since we may have non-JS looking field names
                buffer.push('val = extractors[' + cnt + '](raw); if (val !== undefined) { data[\'' + name + '\'] = val; }');
                extractors.push(extractor);
                ++cnt;
            }
        }
        
        if (buffer.length) {
            out = {
                extractors: extractors,
                fn: new Function('raw', 'data', 'extractors', 'var val;' + buffer.join(''))  
            };
        }
        return out;
    },
    
    defaultRecordCreator: function (data, Model) {
        var record = new Model(data);
        // If the server did not include an id in the response data, the Model constructor will mark the record as phantom.
        // We  need to set phantom to false here because records created from a server response using a reader by definition are not phantom records.
        record.phantom = false;
        return record;
    },
    
    getModelData: function(raw) {
        return {};
    },
    
    extractModelData: function(raw, fieldExtractorInfo) {
        var data = this.getModelData(raw),
            fn;
            
        // We may not have any mappings to process
        if (fieldExtractorInfo) {
            fn = fieldExtractorInfo.fn;
            fn(raw, data, fieldExtractorInfo.extractors);
        }
        return data;
    },

    /**
     * Loads the record associations from the data object.
     * @param {Ext.data.Model} record The record to load associations for.
     * @param {Object} data The raw data object.
     * @param {Object} readOptions See {@link #read}.
     *
     * @private
     */
    readAssociated: function(record, data, readOptions) {
        var roles = record.associations,
            key, role;
            
        for (key in roles) {
            if (roles.hasOwnProperty(key)) {
                role = roles[key];
                // The class for the other role may not have loaded yet
                if (role.cls) {
                    role.read(record, data, this, readOptions);
                }
            }
        }
    },
    
    getFields: function() {
        return this.getModel().fields;
    },

    /**
     * @method
     * This method provides a hook to do any data transformation before the reading process
     * begins. By default this function just returns what is passed to it. It can be
     * overridden in a subclass to return something else.
     * See {@link Ext.data.reader.Xml XmlReader} for an example.
     * 
     * @param {Object} data The data object
     * @return {Object} The normalized data object
     * @protected
     * @template
     */
    getData: Ext.identityFn,

    /**
     * @method
     * This will usually need to be implemented in a subclass. Given a generic data object (the type depends on the type
     * of data we are reading), this function should return the object as configured by the Reader's 'root' meta data config.
     * See XmlReader's getRoot implementation for an example. By default the same data object will simply be returned.
     *
     * @param {Object} data The data object
     * @return {Object} The same data object
     * @private
     */
    getRoot: Ext.identityFn,

    /**
     * Takes a raw response object (as passed to the {@link #read} method) and returns the useful data
     * segment from it. This must be implemented by each subclass.
     * @param {Object} response The response object
     * @return {Object} The extracted data from the response. For example, a JSON object or an XML document.
     */
    getResponseData: function(response) {
        //<debug>
        Ext.raise("getResponseData must be implemented in the Ext.data.reader.Reader subclass");
        //</debug>
    },

    /**
     * @private
     * Reconfigures the meta data tied to this Reader
     */
    onMetaChange : function(meta) {
        var me = this,
            fields = meta.fields,
            model,
            newModel,
            clientIdProperty,
            proxy;
        
        // save off the raw meta data
        me.metaData = meta;
        
        // set any reader-specific configs from meta if available
        if (meta.root) {
            me.setRootProperty(meta.root);
        }
        
        if (meta.totalProperty) {
            me.setTotalProperty(meta.totalProperty);
        }
        
        if (meta.successProperty) {
            me.setSuccessProperty(meta.successProperty);
        }
        
        if (meta.messageProperty) {
            me.setMessageProperty(meta.messageProperty);
        }

        clientIdProperty = meta.clientIdProperty;
        if (fields) {
            newModel = Ext.define(null, {
                extend: 'Ext.data.Model',
                fields: fields,
                clientIdProperty: clientIdProperty
            });
            me.setModel(newModel);
            proxy = me.getProxy();
            if (proxy) {
                proxy.setModel(newModel);
            }
        } else if (clientIdProperty) {
            model = me.getModel();
            if (model) {
                model.self.prototype.clientIdProperty = clientIdProperty;
            }
        }
    },

    /**
     * @private
     * This builds optimized functions for retrieving record data and meta data from an object.
     * Subclasses may need to implement their own getRoot function.
     * @param {Boolean} [force=false] True to automatically remove existing extractor functions first
     */
    buildExtractors: function(force) {
        var me = this,
            totalProp, successProp, messageProp;
            
        if (force || !me.hasExtractors) {
            totalProp = me.getTotalProperty();
            successProp = me.getSuccessProperty();
            messageProp = me.getMessageProperty(); 

            //build the extractors for all the meta data
            if (totalProp) {
                me.getTotal = me.getAccessor(totalProp);
            }

            if (successProp) {
                me.getSuccess = me.getAccessor(successProp);
            }

            if (messageProp) {
                me.getMessage = me.getAccessor(messageProp);
            }
            me.hasExtractors = true;
            return true;
        }
    },

    getAccessor: function(prop) {
        var me = this,
            cache = me.extractorCache,
            ret, key;

        if (typeof prop === 'string') {
            key = me.getAccessorKey(prop);
            ret = cache.get(key);
            if (!ret) {
                ret = me.createAccessor(prop);
                cache.add(key, ret);
            }
        } else {
            ret = me.createAccessor(prop);
        }
        return ret;
    },

    getAccessorKey: function(prop) {
        return this.$className + prop;
    },
    
    createAccessor: Ext.emptyFn,
    
    createFieldAccessor: Ext.emptyFn,

    destroy: function() {
        var me = this;

        me.model = me.getTotal = me.getSuccess = me.getMessage = me.rawData = null;
        
        // Proxy could have created a sequence
        me.onMetaChange = null;
        
        // Transform function can be bound
        me.transform = null;
        
        me.callParent();
    },

    privates: {
        copyFrom: function(reader) {
            var me = this;

            reader.buildExtractors();
            me.getTotal = reader.getTotal;
            me.getSuccess = reader.getSuccess;
            me.getMessage = reader.getMessage;
            ++me.duringInit;
            me.setConfig(reader.getConfig());
            --me.duringInit;
            me.hasExtractors = true;
        }
    }
}, function(Cls) {
    var proto = Cls.prototype;
    Ext.apply(proto, {
        // Private. Empty ResultSet to return when response is falsy (null|undefined|empty string)
        nullResultSet: new Ext.data.ResultSet({
            total  : 0,
            count  : 0,
            records: [],
            success: true,
            message: ''
        })
    });

    proto.extractorCache = new Ext.util.LruCache();
});
