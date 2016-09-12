/**
 * Controllers are the glue that binds an application together. That said, their main 
 * purpose is to listen for events (usually from views) and take some action. Here's how 
 * we might create a Controller to manage Users:
 *
 *      Ext.define('MyApp.controller.Users', {
 *          extend: 'Ext.app.Controller',
 *
 *          init: function() {
 *              console.log('Initialized Users! This happens before ' +
 *                          'the Application launch() function is called');
 *          }
 *      });
 *
 * The init function is a special method that is called when your application boots. It is 
 * called before the {@link Ext.app.Application Application}'s launch function is executed. 
 * This creates an area you can run code prior to Viewport creation.
 *
 * The controller's {@link #method-control} function
 * makes it easy to listen to events on your view classes and take some action with a 
 * handler function. Let's update our Users controller to tell us when the panel is 
 * rendered:
 *
 *      Ext.define('MyApp.controller.Users', {
 *          extend: 'Ext.app.Controller',
 *
 *          control: {
 *              'viewport > panel': {
 *                  render: 'onPanelRendered'
 *              }
 *          }
 *
 *          onPanelRendered: function() {
 *              console.log('The panel was rendered');
 *          }
 *      });
 *
 * The {@link Ext.app.BaseController#method-control control method} has now set up 
 * listeners on views in our application. The control method uses the ComponentQuery 
 * engine to quickly and easily get references to components on the page. If you are not 
 * familiar with ComponentQuery yet, be sure to check out the 
 * {@link Ext.ComponentQuery documentation}. In brief, it allows us to pass a 
 * CSS-like selector that will find every matching component on the page.
 *
 * In our init function above, we supplied 'viewport > panel', which translates to "find me 
 * every Panel that is a direct child of a Viewport". We then supplied an object that maps 
 * event names (just 'render' in this case) to handler functions. In short, whenever 
 * a component that matches our selector fires a 'render' event, our
 * onPanelRendered function is called.
 *
 * ## Event domains
 *
 * In Ext JS 4.2, we introduced the concept of event domains. In terms of MVC, an event 
 * domain is one or more base classes that fire events to which a Controller wants to 
 * listen. Besides Component event domain that encompass {@link Ext.Component}-descended 
 * Views, Controllers now can listen to events from data Stores, Ext Direct Providers, 
 * other Controllers, and Ext.GlobalEvents. This feature provides a way to communicate 
 * between parts of the whole application without the need to bind controllers together 
 * tightly, and allows to develop and test application parts in isolation.
 *
 * See usage examples in {@link #method-listen} method documentation.
 *
 * ## Using refs
 *
 * One of the most useful parts of Controllers is the ref system. These use 
 * {@link Ext.ComponentQuery} to make it really easy to get references to Views on your 
 * page. Let's look at an example of this now:
 *
 *      Ext.define('MyApp.controller.Users', {
 *          extend: 'Ext.app.Controller',
 *          
 *          refs: [{
 *              ref: 'list',
 *              selector: 'grid'
 *          }],
 *          
 *          control: {
 *              'button': {
 *                  click: 'refreshGrid'
 *              }
 *          },
 *          
 *          refreshGrid: function() {
 *              this.getList().store.load();
 *          }
 *      });
 *
 * This example assumes the existence of a {@link Ext.grid.Panel Grid} on the page, which 
 * contains a single button to refresh the Grid when clicked. In our refs array, we set up 
 * a reference to the grid. There are two parts to this - the 'selector', which is a 
 * {@link Ext.ComponentQuery ComponentQuery} selector which finds any grid on the page and
 * assigns it to the reference 'list'.
 *
 * By giving the reference a name, we get a number of things for free. The first is the 
 * getList function that we use in the refreshGrid method above. This is generated 
 * automatically by the Controller based on the name of our ref, which was capitalized and 
 * prepended with get to go from 'list' to 'getList'.
 *
 * The way this works is that the first time getList is called by your code, the 
 * ComponentQuery selector is run and the first component that matches the selector 
 * ('grid' in this case) will be returned. All future calls to getList will use a cached 
 * reference to that grid. Usually it is advised to use a specific ComponentQuery selector 
 * that will only match a single View in your application (in the case above our selector 
 * will match any grid on the page).
 *
 * Bringing it all together, we configure control
 * to listen to any click on a {@link Ext.button.Button button} and call our refreshGrid 
 * function (again, this will match any button on the page so we advise a more specific 
 * selector than just 'button', but have left it this way for simplicity). When the button 
 * is clicked we use out getList function to refresh the grid.
 *
 * You can create any number of refs and control any number of components this way, simply 
 * adding more functions to your Controller as you go. For an example of real-world usage 
 * of Controllers see the Feed Viewer example in the examples/app/feed-viewer folder in 
 * the SDK download.
 *
 * ## Generated getter methods
 *
 * Refs aren't the only thing that generate convenient getter methods. Controllers often 
 * have to deal with Models and Stores so the framework offers a couple of easy ways to 
 * get access to those too. Let's look at another example:
 *
 *      Ext.define('MyApp.controller.Users', {
 *          extend: 'Ext.app.Controller',
 *
 *          models: ['User'],
 *          stores: ['AllUsers', 'AdminUsers'],
 *
 *          init: function() {
 *              var User, allUsers, ed;
 *              
 *              User = this.getUserModel();
 *              allUsers = this.getAllUsersStore();
 *
 *              ed = new User({ name: 'Ed' });
 *              allUsers.add(ed);
 *          }
 *      });
 *
 * By specifying Models and Stores that the Controller cares about, it again dynamically 
 * loads them from the appropriate locations (app/model/User.js, app/store/AllUsers.js and 
 * app/store/AdminUsers.js in this case) and creates getter functions for them all. The 
 * example above will create a new User model instance and add it to the AllUsers Store.
 * Of course, you could do anything in this function but in this case we just did 
 * something simple to demonstrate the functionality.
 *
 * ## Further Reading
 *
 * For more information about writing Ext JS 5 applications, please see the
 * [Application Architecture](../../../application_architecture/application_architecture.html). 
 * Also see the {@link Ext.app.Application} documentation.
 */
Ext.define('Ext.app.Controller', {
    extend: 'Ext.app.BaseController',
    requires: [
        'Ext.app.Util',
        'Ext.data.StoreManager',
        'Ext.ComponentManager',
        'Ext.app.domain.Component',
        'Ext.app.domain.Store',
        'Ext.app.route.Router'
    ],

    statics: {
        strings: {
            model: {
                getter: 'getModel',
                upper: 'Model'
            },

            view: {
                getter: 'getView',
                upper: 'View'
            },

            controller: {
                getter: 'getController',
                upper: 'Controller'
            },

            store: {
                getter: 'getStore',
                upper: 'Store'
            },

            profile: {
                getter: 'getProfile',
                upper: 'Profiles'
            }
        },

        controllerRegex: /^(.*)\.controller\./,
        profileRegex: /^(.*)\.profile\./,

        createGetter: function(baseGetter, name) {
            return function () {
                return this[baseGetter](name);
            };
        },

        getGetterName: function(name, kindUpper) {
            var fn       = 'get',
                parts    = name.split('.'),
                numParts = parts.length,
                index;

            // Handle namespaced class names. E.g. feed.Add becomes getFeedAddView etc.
            for (index = 0; index < numParts; index++) {
                fn += Ext.String.capitalize(parts[index]);
            }

            fn += kindUpper;
            
            return fn;
        },

        resolveNamespace: function(cls, data) {
            var Controller = Ext.app.Controller,
                namespaceRe = cls.prototype.isProfile ? Controller.profileRegex : Controller.controllerRegex,
                className, namespace, match;
            /*
             * Namespace resolution is tricky business: we should know what namespace
             * this Controller descendant belongs to, or model/store/view dependency
             * resolution will be either ambiguous or plainly not possible. To avoid
             * guessing games we try to look for a forward hint ($namespace) that
             * Application class sets when its onClassExtended gets processed; if that
             * fails we try to deduce namespace from class name.
             *
             * Note that for Ext.app.Application, Controller.onClassExtended gets executed
             * *before* Application.onClassExtended so we have to delay namespace handling
             * until after Application.onClassExtended kicks in, hence it is done in this hook.
             */
            className = Ext.getClassName(cls);
            namespace = data.$namespace || data.namespace ||
                Ext.app.getNamespace(className) ||
                ((match = namespaceRe.exec(className)) && match[1]);

            //<debug>
            if (!namespace) {
                Ext.log.warn("Missing namespace for " + className + ", please define it "+
                    "in namespaces property of your Application class.");
            }
            //</debug>

            return namespace;
        },

        /**
         * This method is called like so:
         *
         *      Ext.app.Controller.processDependencies(proto, requiresArray, 'MyApp', 'model', [
         *          'User',
         *          'Item',
         *          'Foo@Common.model',
         *          'Bar.Baz@Common.model'
         *      ]);
         *
         * Required dependencies are added to requiresArray.
         *
         * @private
         */
        processDependencies: function(cls, requires, namespace, kind, names, profileName) {
            if (!names || !names.length) {
                return;
            }

            var me = this,
                strings = me.strings[kind],
                o, absoluteName, shortName, name, j, subLn, getterName, getter;
                
             if (!Ext.isArray(names)) {
                 names = [names];
             }

            for (j = 0, subLn = names.length; j < subLn; j++) {
                name = names[j];
                o = me.getFullName(name, kind, namespace, profileName);
                // Update the name in the array to be the absolute name
                names[j] = absoluteName = o.absoluteName;
                shortName = o.shortName;

                requires.push(absoluteName);
                getterName = me.getGetterName(shortName, strings.upper);

                if (!cls[getterName]) {
                    cls[getterName] = getter = me.createGetter(strings.getter, name);
                }
                //<debug>
                else if (getterName === 'getMainView') {
                    Ext.log.warn('Cannot have a view named \'Main\' - getter conflicts with mainView config.')
                }
                //</debug>

                // Application class will init the controller getters
                if (getter && kind !== 'controller') {
                    // This marker allows the constructor to easily/cheaply identify the
                    // generated getter methods since they all need to be called to get
                    // things initialized. We use a property name that deliberately does
                    // not work with dot-access to reduce any chance of collision.
                    getter['Ext.app.getter'] = true;
                }
            }
        },

        getFullName: function(name, kind, namespace, profileName) {
            var shortName = name,
                sep, absoluteName;

            if ((sep = name.indexOf('@')) > 0) {
                // The unambiguous syntax is Model@Name.space (or "space.Model@Name")
                // which contains both the short name ("Model" or "space.Model") and
                // the full name (Name.space.Model).
                //
                shortName    = name.substring(0, sep); // "Model"
                absoluteName = name.substring(sep + 1) + '.' + shortName; //  ex: "Name.space.Model"
            }
            // Deciding if a class name must be qualified:
            //
            // 1 - if the name doesn't contain a dot, we must qualify it
            //
            // 2 - the name may be a qualified name of a known class, but:
            //
            // 2.1 - in runtime, the loader may not know the class - specially in
            //       production - so we must check the class manager
            //
            // 2.2 - in build time, the class manager may not know the class, but
            //       the loader does, so we check the second one (the loader check
            //       assures it's really a class, and not a namespace, so we can
            //       have 'Books.controller.Books', and requesting a controller
            //       called Books will not be underqualified)
            //
            else if (name.indexOf('.') > 0 && (Ext.ClassManager.isCreated(name) ||
                     this.hasRegisteredPrefix(name))) {
                absoluteName = name;
            }
            else {
                //<debug>
                if (!namespace) {
                    Ext.log.warn("Cannot find namespace for " + kind + " " + name + ", " +
                                 "assuming it is fully qualified class name");
                }
                //</debug>

                if (namespace) {
                    absoluteName = namespace + '.' + kind + '.' +
                                    (profileName ? profileName + '.' + name : name);
                    shortName    = name;
                }
                else {
                    absoluteName = name;
                }
            }

            return {
                absoluteName: absoluteName,
                shortName:    shortName
            };
        },

        hasRegisteredPrefix: function (className) {
            var inventory = Ext.ClassManager,
                prefix = inventory.getPrefix(className);

            // It's a class if className is not equal to any known namespace
            return prefix && prefix !== className;
        }
    },

    // @cmd-auto-dependency {aliasPrefix : "model.", mvc : true, blame: "all"}
    /**
     * @cfg {String/String[]} models
     * Array of models to require from AppName.model namespace. For example:
     *
     *      Ext.define("MyApp.controller.Foo", {
     *          extend: "Ext.app.Controller",
     *          models: ['User', 'Vehicle']
     *      });
     *
     * This is equivalent to:
     *
     *      Ext.define("MyApp.controller.Foo", {
     *          extend: "Ext.app.Controller",
     *          requires: ['MyApp.model.User', 'MyApp.model.Vehicle'],
     *          
     *          getUserModel: function() {
     *              return this.getModel("User");
     *          },
     *          
     *          getVehicleModel: function() {
     *              return this.getModel("Vehicle");
     *          }
     *      });
     *
     * **Note:** If the model has a different namespace than that of the 
     * application you will need to specify the full class name as well as define a path 
     * in the {@link Ext.Loader#cfg-paths Loader's paths} config or 
     * {@link Ext.Loader#method-setPath setPath} method.
     */
    models: null,

    // @cmd-auto-dependency {aliasPrefix: "view.", mvc: true, blame: "all"}
    /**
     * @cfg {String/String[]} views
     * Array of views to require from AppName.view namespace and to generate getter methods for.
     * For example:
     *
     *      Ext.define("MyApp.controller.Foo", {
     *          extend: "Ext.app.Controller",
     *          views: ['List', 'Detail']
     *      });
     *
     * This is equivalent to:
     *
     *      Ext.define("MyApp.controller.Foo", {
     *          extend: "Ext.app.Controller",
     *          requires: ['MyApp.view.List', 'MyApp.view.Detail'],
     *          
     *          getListView: function() {
     *              return this.getView("List");
     *          },
     *          
     *          getDetailView: function() {
     *              return this.getView("Detail");
     *          }
     *      });
     * 
     * **Note:** If the view has a different namespace than that of the 
     * application you will need to specify the full class name as well as define a path 
     * in the {@link Ext.Loader#cfg-paths Loader's paths} config or 
     * {@link Ext.Loader#method-setPath setPath} method.
     */
    views: null,

    // @cmd-auto-dependency {aliasPrefix: "store.", mvc: true, blame: "all"}
    /**
     * @cfg {String/String[]} stores
     * Array of stores to require from AppName.store namespace and to generate getter methods for.
     * For example:
     *
     *      Ext.define("MyApp.controller.Foo", {
     *          extend: "Ext.app.Controller",
     *          stores: ['Users', 'Vehicles']
     *      });
     *
     * This is equivalent to:
     *
     *      Ext.define("MyApp.controller.Foo", {
     *          extend: "Ext.app.Controller",
     *         
     *          requires: [
     *              'MyApp.store.Users',
     *              'MyApp.store.Vehicles'
     *          ]
     *         
     *          getUsersStore: function() {
     *              return this.getStore("Users");
     *          },
     *
     *          getVehiclesStore: function() {
     *              return this.getStore("Vehicles");
     *          }
     *      });
     * 
     * **Note:** If the store has a different namespace than that of the 
     * application you will need to specify the full class name as well as define a path 
     * in the {@link Ext.Loader#cfg-paths Loader's paths} config or 
     * {@link Ext.Loader#method-setPath setPath} method.
     */
    stores: null,

    // @cmd-auto-dependency {aliasPrefix: "controller.", mvc: true, blame: "all"}
    controllers: null,

    config : {
        /**
         * @cfg {Ext.app.Application} application The {@link Ext.app.Application} for this controller accessible via the getApplication method.
         * @accessor
         * @readonly
         */
        application: null,
        
        /**
         * @cfg {Object/Object[]} refs
         * @accessor
         *
         * The refs config creates a getter method on the controller that internally 
         * uses Ext.ComponentQuery to fetch the component instance using the configured 
         * selector.  The following example will add the `getList` method to 
         * the controller and will return the first component in the application 
         * hierarchy with an xtype of "grid".  By default, *undefined* will be returned 
         * when the query does not locate the target component.
         *
         *     Ext.define('MyApp.controller.Foo', {
         *         extend: 'Ext.app.Controller',
         *         
         *         refs: [{
         *             ref: 'list',
         *             selector: 'grid'
         *         }]
         *     });
         *
         * The following fields may be used in the ref definition:
         *
         * - `ref` - name of the reference.
         * - `selector` - Ext.ComponentQuery selector to access the component.
         * - `autoCreate` - True to create the component automatically if not found on 
         * page.
         * - `forceCreate` - True to force the creation of the component every time 
         * reference is accessed (when `get<REFNAME>` is called).
         * - `xtype` - Used to create the component by its xtype with `autoCreate` or 
         * `forceCreate`. If you don't provide `xtype`, an Ext.Component instance will 
         * be created.
         * 
         * The following example will create a `getList` and `getUser` method on the 
         * controller.
         * 
         *     Ext.define('MyApp.controller.Foo', {
         *         extend: 'Ext.app.Controller',
         *     
         *         refs: [{
         *             list: 'grid',
         *             user: {
         *                 autoCreate: true,
         *                 selector: 'form',
         *                 xtype: 'form'
         *             }
         *         }]
         *     });
         */
        refs: null,

        active: true,

        /**
         * @private
         */
        moduleClassName: null
    },

    onClassExtended: function(cls, data, hooks) {
        var onBeforeClassCreated = hooks.onBeforeCreated;

        hooks.onBeforeCreated = function(cls, data) {
            var Controller = Ext.app.Controller,
                requires   = [],
                namespace, proto;

            proto = cls.prototype;

            namespace = Controller.resolveNamespace(cls, data);

            if (namespace) {
                proto.$namespace = namespace;
            }

            Controller.processDependencies(proto, requires, namespace, 'model',      data.models);
            Controller.processDependencies(proto, requires, namespace, 'view',       data.views);
            Controller.processDependencies(proto, requires, namespace, 'store',      data.stores);
            Controller.processDependencies(proto, requires, namespace, 'controller', data.controllers);

            Ext.require(requires, Ext.Function.pass(onBeforeClassCreated, arguments, this));
        };
    },

    /**
     * Creates new Controller.
     *
     * @param {Object} [config] Configuration object.
     */
    constructor: function(config) {
        this.initAutoGetters();
        this.callParent(arguments);
    },

    /**
     * @private
     * Takes either an object and transforms it into an array. The following are valid refs values:
     *
     *     refs: {
     *         myComponent: 'container'
     *     }
     *
     *     refs: {
     *         myComponent: {
     *             selector: 'container'
     *         }
     *     }
     *
     *     refs: [
     *         {
     *             ref: 'myComponent',
     *             selector: 'container'
     *         }
     *     ]
     *
     * @param {Array|Object} refs The refs to normalize
     * @param {Array} newRefs An array to place the normalized refs on to
     * @return {Array} The normalized array of refs
     */
    normalizeRefs: function(refs) {
        var me = this,
            newRefs = [];

        if (refs) {
            if (Ext.isObject(refs)) {
                Ext.Object.each(refs, function(key, value) {
                    if (Ext.isString(value)) {
                        value = {
                            selector : value
                        };
                    }

                    value.ref = key;

                    newRefs.push(value);
                });
            } else if (Ext.isArray(refs)) {
                newRefs = Ext.Array.merge(newRefs, refs);
            }
        }

        refs = me.refs;

        if (refs) {
            me.refs = null;

            refs = me.normalizeRefs(refs);

            if (refs) {
                newRefs = Ext.Array.merge(newRefs, refs);
            }
        }

        return newRefs;
    },

    /**
     * Returns a map of reference names to selectors
     * @private
     */
    getRefMap: function() {
        var me = this,
            refMap = me._refMap,
            refs, ref, ln, i;

        if (!refMap) {
            refs = me.getRefs();
            refMap = me._refMap = {};

            if (refs) {
                for (i = 0, ln = refs.length; i < ln; i++) {
                    ref = refs[i];
                    refMap[ref.ref] = ref.selector;
                }
            }
        }

        return refMap;
    },

    applyRefs: function(refs) {
        return this.normalizeRefs(Ext.clone(refs));
    },

    /**
     * @param {Object} refs The refs to pass to the {@link #ref} method.
     * @private
     */
    updateRefs: function(refs) {
        if (refs) {
            this.ref(refs);
        }
    },

    initAutoGetters: function() {
        var proto = this.self.prototype,
            prop, fn;

        for (prop in proto) {
            fn = proto[prop];

            // Look for the marker placed on the getters by processDependencies so that
            // we can know what to call cheaply:
            if (fn && fn['Ext.app.getter']) {
                fn.call(this);
            }
        }
    },

    doInit: function(app) {
        var me = this;

        if (!me._initialized) {
            me.init(app);
            me._initialized = true;
        }
    },
    
    finishInit: function(app) {
        var me = this,
            controllers = me.controllers,
            controller, i, l;

        if (me._initialized && controllers && controllers.length) {
            for (i = 0, l = controllers.length; i < l; i++) {
                controller = me.getController(controllers[i]);
                controller.finishInit(app);
            }
        }
    },

    /**
     * @method
     *
     * A template method that is called when your application boots. It is called before the
     * {@link Ext.app.Application Application}'s launch function is executed so gives a hook point
     * to run any code before your Viewport is created.
     *
     * @param {Ext.app.Application} application
     *
     * @template
     */
    init: Ext.emptyFn,

    /**
     * @method
     *
     * A template method like {@link #init}, but called after the viewport is created.
     * This is called after the {@link Ext.app.Application#launch launch} method of Application
     * is executed.
     *
     * @param {Ext.app.Application} application
     *
     * @template
     */
    onLaunch: Ext.emptyFn,
    
    /**
     * Allow the controller to resume receiving events from the event bus.
     * Routes will also be able to begin firing on this controller.
     * Also see {@link #deactivate}.
     */
    activate: function() {
        this.setActive(true);
    },
    
    /**
     * Prevent this controller from receiving events from the event bus.
     * Routes will also not be triggered on inactive controllers unless
     * the {@link Ext.app.route.Route#allowInactive} flag is set.
     * Also see {@link #activate}.
     */
    deactivate: function() {
        this.setActive(false);
    },
    
    /**
     * Checks if this controller is active. See {@link #activate} & 
     * {@link #deactivate}.
     * @return {Boolean} `true` if this controller is active.
     */
    isActive: function() {
        return this.getActive();
    },

    ref: function(refs) {
        var me = this,
            i = 0,
            length = refs.length,
            info, ref, fn;

        refs = Ext.Array.from(refs);

        me.references = me.references || [];

        for (; i < length; i++) {
            info = refs[i];
            ref  = info.ref;
            fn   = 'get' + Ext.String.capitalize(ref);

            if (!me[fn]) {
                me[fn] = Ext.Function.pass(me.getRef, [ref, info], me);
            }
            me.references.push(ref.toLowerCase());
        }
    },

    /**
     * Registers one or more {@link #refs references}.
     *
     * @param {Object/Object[]} refs
     */
    addRef: function(refs) {
        this.ref(refs);
    },

    getRef: function(ref, info, config) {
        var me = this,
            refCache = me.refCache || (me.refCache = {}),
            cached = refCache[ref];

        info = info || {};
        config = config || {};

        Ext.apply(info, config);

        if (info.forceCreate) {
            return Ext.ComponentManager.create(info, 'component');
        }

        if (!cached) {
            if (info.selector) {
                refCache[ref] = cached = Ext.ComponentQuery.query(info.selector)[0];
            }
            
            if (!cached && info.autoCreate) {
                refCache[ref] = cached = Ext.ComponentManager.create(info, 'component');
            }
            
            if (cached) {
                cached.on('beforedestroy', function() {
                    refCache[ref] = null;
                });
            }
        }

        return cached;
    },

    /**
     * Returns `true` if a {@link #refs reference} is registered.
     *
     * @param {String} ref The name of the ref to check for.
     * @return {Boolean}
     */
    hasRef: function(ref) {
        var references = this.references;
        return references && Ext.Array.indexOf(references, ref.toLowerCase()) !== -1;
    },

    /**
     * Returns instance of a {@link Ext.app.Controller Controller} with the given id.
     * When controller doesn't exist yet, it's created. Note that this method depends
     * on Application instance and will return undefined when Application is not
     * accessible. The only exception is when this Controller instance's id is requested;
     * in that case we always return the instance even if Application is no available.
     *
     * @param {String} id
     *
     * @return {Ext.app.Controller} controller instance or undefined.
     */
    getController: function(id) {
        var app = this.getApplication();

        if (id === this.getId()) {
            return this;
        }

        return app && app.getController(id);
    },

    /**
     * Returns instance of a {@link Ext.data.Store Store} with the given name.
     * When store doesn't exist yet, it's created.
     *
     * @param {String} name
     *
     * @return {Ext.data.Store} a store instance.
     */
    getStore: function(name) {
        var storeId, store;

        storeId = (name.indexOf('@') === -1) ? name : name.split('@')[0];
        store   = Ext.StoreManager.get(storeId);

        if (!store) {
            name = Ext.app.Controller.getFullName(name, 'store', this.$namespace);

            if (name) {
                store = Ext.create(name.absoluteName, {
                    // Use id here. If the store has a configured storeId, 
                    // that will take precedence
                    id: storeId
                });
            }
        }

        return store;
    },

    /**
     * Returns a {@link Ext.data.Model Model} class with the given name.
     *
     * @param {String} name
     * @return {Ext.Class} A class ultimately derived from `Ext.data.Model`.
     */
    getModel: function(model) {
        var name = Ext.app.Controller.getFullName(model, 'model', this.$namespace),
            ret = Ext.ClassManager.get(name.absoluteName);

        if (!ret) {
            ret = Ext.data.schema.Schema.lookupEntity(model);
        }

        return ret;
    },

    /**
     * Returns instance of a {@link Ext.app.Profile Profile} with the given name.
     *
     * @param {String} name
     *
     * @return {String} a profile instance.
     */
    getProfile: function(name) {
        name = Ext.app.Controller.getFullName(name, 'profile', this.$namespace);
        return name;
    },

    /**
     * Returns a View class with the given name.  To create an instance of the view,
     * you can use it like it's used by Application to create the Viewport:
     *
     *     this.getView('Viewport').create();
     *
     * @param {String} view
     *
     * @return {Ext.Base} a view class.
     */
    getView: function(view) {
        var name = Ext.app.Controller.getFullName(view, 'view', this.$namespace);
        return name && Ext.ClassManager.get(name.absoluteName);
    },

    ensureId: function() {
        var id = this.getId();
            
        if (!id) {
            this.setId(this.getModuleClassName(this.$className, 'controller'));
        }    
    },
    
    destroy: function(destroyRefs, /* private */ fromApp) {
        var me = this,
            app = me.application,
            refCache, ref;

        if (!fromApp && app) {
            app.unregister(me);
        }
        
        me.application = null;
        
        if (destroyRefs) {
            // Possible destroy stores here too?
            refCache = me.refCache;
            for (ref in refCache) {
                if (refCache.hasOwnProperty(ref)) {
                    Ext.destroy(refCache[ref]);
                }
            }
        }
        me.callParent();
    }
});
