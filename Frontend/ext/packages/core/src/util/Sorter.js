/**
 * 
 * Represents a single sorter that can be used as part of the sorters configuration in Ext.mixin.Sortable.
 *
 * A common place for Sorters to be used are {@link Ext.data.Store Stores}. For example:
 *
 *      @example
 *      var store = Ext.create('Ext.data.Store', {
 *           fields: ['firstName', 'lastName'],
 *           sorters: 'level',
 *        
 *           data: [
 *               { firstName: 'Mitch',  level: 9000},
 *               { firstName: 'Seth',   level: 42},
 *               { firstName: 'Fred',   level: 510},
 *               { firstName: 'Israel', level: 690},
 *               { firstName: 'Greg',   level: 101},
 *               { firstName: 'Pat',    level: 0},              
 *               { firstName: 'Kevin',  level: 17},
 *               { firstName: 'Brandon',level: 690},
 *               { firstName: 'Gary',   level: 409},
 *               { firstName: 'Scott',  level: 789}
 *           ]
 *        });
 *        
 *        Ext.create('Ext.grid.Panel', {
 *            title: 'Support',
 *            store: store,
 *            columns: [
 *                { text: 'Name',  dataIndex: 'firstName' },
 *                { text: 'Level', dataIndex: 'level' }
 *            ],
 *            height: 300,
 *            width: 200,
 *            renderTo: Ext.getBody()
 *        });  
 *
 * In the next example, we specify a custom sorter function:
 *
 *        @example
 *        var store = Ext.create('Ext.data.Store', {
 *           fields: ['firstName', 'lastName'],
 *            sorters: [
 *                {
 *                    // Sort by first letter of second word of spirit animal, in descending order
 *                    sorterFn: function(record1, record2) {
 *                        var name1 = record1.data.spiritAnimal.split(' ')[1].substr(0,1),
 *                            name2 = record2.data.spiritAnimal.split(' ')[1].substr(0,1);
 * 
 *                        return name1 > name2 ? 1 : (name1 === name2) ? 0 : -1;
 *                    },
 *                    direction: 'DESC'
 *                }
 *            ],
 *         
 *           data: [
 *               { firstName: 'Mitch',  spiritAnimal: "Panda Bear"},
 *               { firstName: 'Seth',   spiritAnimal: "Tina Belcher"},
 *               { firstName: 'Fred',   spiritAnimal: "Honey Badger"},
 *               { firstName: 'Israel', spiritAnimal: "Mysterious Capybara"},
 *               { firstName: 'Greg',   spiritAnimal: "Majestic Platypus"},
 *               { firstName: 'Kevin',  spiritAnimal: "Sparkling Unicorn"},
 *               { firstName: 'Brandon',spiritAnimal: "Pygmy Goat"},
 *               { firstName: 'Gary',   spiritAnimal: "Suri Alpaca"},
 *               { firstName: 'Scott',  spiritAnimal: "Ripe Armadillo"},
 *               { firstName: 'Pat',    spiritAnimal: "The Cougar"}
 *           ]
 *        });
 *        
 *        Ext.create('Ext.grid.Panel', {
 *            title: 'Support',
 *            store: store,
 *            columns: [
 *                { text: 'Name',          dataIndex: 'firstName' },
 *                { text: 'Spirit Animal', dataIndex: 'spiritAnimal', flex: 1 }
 *            ],
 *            height: 310,
 *            renderTo: Ext.getBody()
 *        });
 */
Ext.define('Ext.util.Sorter', {
    isSorter: true,

    config: {
        /**
         * @cfg {String} property The property to sort by. Required unless `sorterFn` is provided
         */
        property: null,

        /**
         * @cfg {Function} sorterFn A specific sorter function to execute. Can be passed instead of {@link #property}.
         * This function should compare the two passed arguments, returning -1, 0 or 1 depending on if item 1 should be
         * sorted before, at the same level, or after item 2.
         *
         *     sorterFn: function(person1, person2) {
         *         return (person1.age > person2.age) ? 1 : (person1.age === person2.age ? 0 : -1);
         *     }
         */
        sorterFn: null,

        /**
         * @cfg {String} root Optional root property. This is mostly useful when sorting a Store, in which case we set the
         * root to 'data' to make the filter pull the {@link #property} out of the data object of each item
         */
        root: null,

        /**
         * @cfg {Function} transform A function that will be run on each value before
         * it is compared in the sorter. The function will receive a single argument,
         * the value.
         */
        transform: null,

        /**
         * @cfg {String} direction The direction to sort by. Valid values are "ASC", and "DESC".
         */
        direction: "ASC",

        /**
         * @cfg {Mixed} id An optional id this sorter can be keyed by in Collections. If
         * no id is specified it will use the property name used in this Sorter. If no
         * property is specified, e.g. when adding a custom sorter function we will generate
         * a random id.
         */
        id: undefined
    },

    statics: {
        /**
         * Creates a comparator function (a function that can be passed to `Array.sort`)
         * given one or more `Sorter` instances.
         *
         * The returned function retains a reference to the collection or array of sorters
         * passed. This means the function will produce a comparison based on the current
         * content of the collection or array, and not based on the content at the time of
         * this call.
         *
         * @param {Ext.util.Sorter[]/Ext.util.Collection} sorters The `Sorter` instances.
         * @param [nextFn] The next comparator function to call if all the `sorters` end
         * with equality.
         * @return {Function} The comparator function.
         */
        createComparator: function (sorters, nextFn) {
            nextFn = nextFn || 0;
            return function (lhs, rhs) {
                var items = sorters.isCollection ? sorters.items : sorters,
                    n = items.length,
                    comp, i;

                for (i = 0; i < n; ++i) {
                    comp = items[i].sort(lhs, rhs);
                    if (comp) {
                        return comp;
                    }
                }

                return nextFn && nextFn(lhs, rhs);
            };
        }
    },

    /**
     * This value is set based on the `direction` config to be either 1 or -1. This is used
     * as a multiplier for the raw comparison value to factor in the direction.
     * @private
     * @readonly
     */
    multiplier: 1,

    constructor: function(config) {
        //<debug>
        if (config && !this.isGrouper) {
            if (!config.property === !config.sorterFn) {
                // the above is a "not XOR" - both true or both false
                Ext.raise("A Sorter requires either a property or a sorterFn.");
            }
        }
        //</debug>

        this.initConfig(config);
    },

    getId: function () {
        var id = this._id;

        if (!id) {
            id = this.getProperty();
            if (!id) {
                id = Ext.id(null, 'ext-sorter-');
            }
            this._id = id;
        }

        return id;
    },

    sort: function (lhs, rhs) {
        return this.multiplier * this.sortFn(lhs, rhs);
    },

    /**
     * @private
     * Basic default sorter function that just compares the defined property of each object.
     * This is hidden by the `sorterFn` provided by the user.
     */
    sortFn: function (item1, item2) {
        var me = this,
            transform = me._transform,
            root = me._root,
            property = me._property,
            lhs, rhs;

        if (root) {
            item1 = item1[root];
            item2 = item2[root];
        }

        lhs = item1[property];
        rhs = item2[property];

        if (transform) {
            lhs = transform(lhs);
            rhs = transform(rhs);
        }

        return (lhs > rhs) ? 1 : (lhs < rhs ? -1 : 0);
    },
    
    applyDirection: function(direction) {
        return direction ? direction : 'ASC';
    },

    updateDirection: function (direction) {
        this.multiplier = (direction.toUpperCase() === "DESC") ? -1 : 1;
    },

    updateProperty: function (property) {
        if (property) {
            // Unhide the default sortFn on our prototype
            delete this.sortFn;
        }
    },

    updateSorterFn: function (sorterFn) {
        // Hide the default sortFn on our prototype
        this.sortFn = sorterFn;
    },

    /**
     * Toggles the direction of this Sorter. Note that when you call this function,
     * the Collection this Sorter is part of does not get refreshed automatically.
     */
    toggle: function() {
        this.setDirection(Ext.String.toggle(this.getDirection(), "ASC", "DESC"));
    },

    /**
     * Returns this sorter's state.
     * @return {Object}
     */
    getState: function() {
        var me = this,
            result = {
                root: me.getRoot(),
                property: me.getProperty(),
                direction: me.getDirection()
            };

        // Do not use getId() which will create an identifier if we have none.
        // We need to know if we really are identifiable.
        if (me._id) {
            result.id = me._id;
        }
        
        return result;
    },

    /**
     * Returns this sorter's serialized state. This is used when transmitting this sorter
     * to a server.
     * @return {Object}
     */
    serialize: function () {
        return {
            property: this.getProperty(),
            direction: this.getDirection()
        };
    }
});
