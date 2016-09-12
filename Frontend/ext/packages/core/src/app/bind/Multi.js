/**
 * This class is created to manage a multi-bind against a `ViewModel`.
 */
Ext.define('Ext.app.bind.Multi', {
    extend: 'Ext.app.bind.BaseBinding',

    isMultiBinding: true,

    missing: 1,

    // Multi binds have to be deep. We construct a single object/array and we only
    // ever fire by notifying with that value which will never change. As such, we
    // need to notify any child bindings so they can check if their individual
    // bindings have changed.
    deep: true,

    /**
     * @cfg {Boolean} trackStatics
     * This option tracks for static branches of the root object which can be pruned using
     * {@link #pruneStaticKeys}. This can be useful to only get the dynamic parts of a multi bind:
     *
     *      {
     *          a: 1,
     *          b: '{someBind}',
     *          c: ['a', 'b', 'c'],
     *          d: ['a', 'b', '{someBind}'],
     *          e: {
     *              y: 1,
     *              z: 2
     *          },
     *          f: {
     *              y: 1,
     *              z: '{someBind}'
     *          }
     *      }
     *
     *      // Will produce
     *      {
     *          b: value,
     *          d: ['a', 'b', value],
     *          f: {
     *              y: 1,
     *              z: value
     *          }
     *      }
     * @private
     * @since 5.1.0
     */

    constructor: function (descriptor, owner, callback, scope, options) {
        var me = this,
            trackStatics = options && options.trackStatics;

        me.callParent([ owner, callback, scope, options ]);

        me.bindings = [];
        me.literal = descriptor.$literal;

        if (descriptor.constructor === Object) {
            if (trackStatics) {
                me.staticKeys = [];
            }
            me.addObject(descriptor, me.lastValue = {}, me.staticKeys);
        } else {
            me.addArray(descriptor, me.lastValue = []);
        }

        // We started at missing == 1 so that no immediate callbacks would hit 0 before
        // adding all bindings... so now we decrement by 1 to balance things and see if
        // we are at 0.
        if (! --me.missing && !me.scheduled) {
            me.schedule();
        }
    },

    destroy: function () {
        var me = this;

        me.bindings = Ext.destroy(me.bindings);

        me.callParent();
    },

    add: function (descriptor, data, property) {
        var me = this,
            owner = me.owner,
            bindings = me.bindings,
            method = me.literal ? (descriptor.reference ? 'bindEntity' : 'bindExpression')
                                : 'bind',
            binding, depth;

        ++me.missing;

        binding = owner[method](descriptor,
            function (value) {
                data[property] = value;

                if (binding.calls === 1) {
                    --me.missing;
                }

                if (!me.missing && !me.scheduled) {
                    me.schedule();
                }
            },
            //TODO - split bind options between us and the sub-binds (pass null for now)
            me, null);

        depth = binding.depth;
        if (!bindings.length || depth < me.depth) {
            me.depth = depth;
        }

        bindings.push(binding);
        return !this.isBindingStatic(binding);
    },

    addArray: function (multiBindDescr, array) {
        var me = this,
            n = multiBindDescr.length,
            hasDynamic = false,
            dynamic, b, i;

        for (i = 0; i < n; ++i) {
            b = multiBindDescr[i];

            if (b && (b.reference || Ext.isString(b))) {
                dynamic = me.add(b, array, i);
            } else if (Ext.isArray(b)) {
                dynamic = me.addArray(b, array[i] = []);
            } else if (b && b.constructor === Object) {
                dynamic = me.addObject(b, array[i] = {});
            } else {
                array[i] = b;
                dynamic = false;
            }
            hasDynamic = hasDynamic || dynamic;
        }
        return hasDynamic;
    },

    addObject: function (multiBindDescr, object, staticKeys) {
        var me = this,
            hasDynamic = false,
            dynamic, b, name;

        for (name in multiBindDescr) {
            b = multiBindDescr[name];

            if (b && (b.reference || Ext.isString(b))) {
                dynamic = me.add(b, object, name);
            } else if (Ext.isArray(b)) {
                dynamic = me.addArray(b, object[name] = []);
            } else if (b && b.constructor === Object) {
                dynamic = me.addObject(b, object[name] = {});
            } else {
                object[name] = b;
                dynamic = false;
            }
            if (staticKeys && !dynamic) {
                staticKeys.push(name);
            }
            hasDynamic = hasDynamic || dynamic;
        }
        return hasDynamic;
    },

    getFullName: function () {
        var me = this,
            fullName = me.fullName,
            bindings = me.bindings,
            length = bindings.length,
            i;

        if (!fullName) {
            fullName = '@[';
            for (i = 0; i < length; ++i) {
                if (i) {
                    fullName += ',';
                }
                fullName += bindings[i].getFullName();
            }
            fullName += ']';

            me.fullName = fullName;
        }

        return fullName;
    },

    getRawValue: function () {
        return this.lastValue;
    },

    isDescendantOf: function () {
        return false;
    },

    isLoading: function () {
        for (var bindings = this.bindings, n = bindings.length; n-- > 0; ) {
            if (bindings[n].isLoading()) {
                return true;
            }
        }

        return false;
    },

    isBindingStatic: function(binding) {
        return binding.isTemplateBinding && binding.isStatic;
    },

    isStatic: function() {
        var bindings = this.bindings,
            len = bindings.length,
            i, binding;

        for (i = 0; i < len; ++i) {
            binding = bindings[i];
            if (!this.isBindingStatic(binding)) {
                return false;
            }
        }
        return true;
    },

    pruneStaticKeys: function() {
        var value = Ext.apply({}, this.lastValue),
            keys = this.staticKeys,
            len = keys.length,
            i;

        for (i = 0; i < len; ++i) {
            delete value[keys[i]];
        }
        return value;
    },

    react: function () {
        this.notify(this.lastValue);
    },

    refresh: function () {
        // @TODO
    },
    
    privates: {
        sort: function () {
            this.scheduler.sortItems(this.bindings);

            // Schedulable#sort === emptyFn
            //me.callParent();
        }
    }
});
