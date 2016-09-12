/**
 * This class and its derived classes are used to manage access to the properties of an
 * object stored in a `Session`.
 * @private
 */
Ext.define('Ext.app.bind.Stub', {
    extend: 'Ext.app.bind.AbstractStub',

    requires: [
        'Ext.app.bind.Binding'
    ],

    isStub: true,

    dirty: true,

    formula: null,

    validationKey: 'validation',

    statics: {
        trackHadValue: function(value, owner, path, stub) {
            var children = stub && stub.children,
                child, key, hadValue;

            // Keep track of the fact that we've had a value set. We may get set
            // to undefined in the future, we only need to know whether we
            // are initially in an undefined state
            hadValue = value !== undefined;
            if (!owner.hadValue[path]) {
                owner.hadValue[path] = hadValue;
            }

            if (stub) {
                stub.hadValue = hadValue;
            }

            if (value && (value.constructor === Object || value.isModel)) {
                if (value.isModel) {
                    value = value.data;
                }

                for (key in value) {
                    Ext.app.bind.Stub.trackHadValue(value[key], owner, path + '.' + key, children && children[key]);
                }
            }
        }
    },

    constructor: function (owner, name, parent) {
        var me = this,
            path = name;

        me.callParent([ owner, name ]);
        me.boundValue = null;
        if (parent) {
            parent.add(me);
            if (!parent.isRootStub) {
                path = parent.path + '.' + name;
            }
        }
        me.hadValue = owner.hadValue[path];
        me.path = path;
    },
    
    destroy: function() {
        var me = this,
            formula = me.formula,
            parent = me.parent,
            storeBinding = me.storeBinding;

        if (formula) {
            formula.destroy();
        }
        if (storeBinding) {
            storeBinding.destroy();
        }
        me.detachBound();

        me.parentValue = me.formula = me.storeBinding = null;
        
        me.callParent();
    },

    bindValidation: function (callback, scope) {
        var parent = this.parent;
        return parent && parent.descend([this.validationKey, this.name]).bind(callback, scope);
    },

    bindValidationField: function(callback, scope) {
        var parent = this.parent,
            name = this.name,
            lateBound = typeof callback === 'string',
            ret;

        if (parent) {
            ret = parent.bind(function(value) {
                var field = null;
                if (value && value.isModel) {
                    field = value.getField(name);
                }
                if (lateBound) {
                    scope[callback](field, null, this);
                } else {
                    callback.call(scope, field, null, this);
                }
            });
        }

        return ret || null;
    },

    descend: function (path, index) {
        var me = this,
            children = me.children || (me.children = {}),
            pos = index || 0,
            name = path[pos++],
            ret;

        if (!(ret = children[name])) {
            ret = new Ext.app.bind.Stub(me.owner, name, me);
        }

        if (pos < path.length) {
            ret = ret.descend(path, pos);
        }

        return ret;
    },

    getChildValue: function (parentData) {
        var me = this,
            name = me.name,
            ret;

        if (!parentData && !Ext.isString(parentData)) {
            // since these forms of falsey values (0, false, etc.) are not things we
            // can index into, this child stub must be null.
            ret = me.hadValue ? null : undefined;
        } else {
            ret = me.inspectValue(parentData);
            if (!ret) {
                if (parentData.isEntity) {
                    // If we get here, we know it's not an association
                    ret = parentData.data[name];
                } else {
                    ret = parentData[name];
                }
            }
        }
        return ret;
    },

    getDataObject: function () {
        var me = this,
            parentData = me.parent.getDataObject(), // RootStub does not get here
            name = me.name,
            ret = parentData ? parentData[name] : null,
            associations, association;

        if (!ret && parentData && parentData.isEntity) {
            // Check if the item is an association, if it is, grab it but don't load it.
            associations = parentData.associations;
            if (associations && name in associations) {
                ret = parentData[associations[name].getterName]();
            }
        }

        if (!ret || !(ret.$className || Ext.isObject(ret))) {
            parentData[name] = ret = {};
            // We're implicitly setting a value on the object here
            me.hadValue = me.owner.hadValue[me.path] = true;
            // If we're creating the parent data object, invalidate the dirty
            // flag on our children.
            me.invalidate(true, true);
        }

        return ret;
    },

    getRawValue: function () {
        // NOTE: The RootStub class does not call here so we will *always* have a parent
        // unless dark energy has won and the laws of physics have broken down.
        return this.getChildValue(this.getParentValue());
    },

    graft: function (replacement) {
        var me = this,
            parent = me.parent,
            children = me.children,
            name = me.name,
            i;

        replacement.parent = parent;
        replacement.children = children;

        if (parent) {
            parent.children[name] = replacement;
        }
        if (children) {
            for (i in children) {
                children[i].parent = replacement;
            }
        }

        me.children = null;

        return me.callParent([ replacement ]);
    },

    isLoading: function () {
        var me = this,
            parent = me.parent,
            loading = false,
            associations, parentValue, value, loadSet;
        
        if (parent && !(loading = parent.isLoading())) {
            parentValue = me.getParentValue();
            value = me.inspectValue(parentValue);
            // If we get a value back, it's something we can ask for the loading state
            if (value) {
                loading = value.isLoading();
            } else {
                if (parentValue && parentValue.isModel) {
                    associations = parentValue.associations;
                    // At this point, we know the value is not a record or a store, otherwise
                    // something would have been returned from inspectValue. We also check here
                    // that we are not a defined association, because we don't treat it like a field.
                    // Otherwise, we are a field on a model, so we're never in a loading state.
                    if (!(associations && me.name in associations)) {
                        loading = false;
                        loadSet = true;
                    }
                }

                if (!loadSet) {
                    loading = !me.hadValue && me.getRawValue() === undefined;
                }
            }
        }

        return loading;
    },

    invalidate: function (deep, dirtyOnly) {
        var me = this,
            children = me.children,
            name;

        me.dirty = true;
        if (!dirtyOnly && !me.isLoading()) {
            if (!me.scheduled) {
                // If we have no children, we're a leaf
                me.schedule();
            }
        }

        if (deep && children) {
            for (name in children) {
                children[name].invalidate(deep, dirtyOnly);
            }
        }
    },

    isReadOnly: function() {
        var formula = this.formula;
        return !!(formula && !formula.set);
    },

    set: function (value) {
        var me = this,
            parent = me.parent,
            name = me.name,
            formula = me.formula,
            parentData, associations, association, formulaStub;

        if (formula && !formula.settingValue && formula.set) {
            formula.setValue(value);
            return;
        } else if (me.isLinkStub) {
            formulaStub = me.getLinkFormulaStub();
            formula = formulaStub ? formulaStub.formula : null;
            if (formula) {
                //<debug>
                if (formulaStub.isReadOnly()) {
                    Ext.raise('Cannot setValue on a readonly formula');
                }
                //</debug>
                formula.setValue(value);
                return;
            }
        }

        // To set a child property, the parent must be an object...
        parentData = parent.getDataObject();

        if (parentData.isEntity) {
            associations = parentData.associations;

            if (associations && (name in associations)) {
                association = associations[name];
                parentData[association.setterName](value);
                // We may be setting a record here, force the value to recalculate
                me.invalidate(true);
            } else {
                // If not an association then it is a data field
                parentData.set(name, value);
            }

            // Setting fields or associated records will fire change notifications so we
            // handle the side effects there
        } else if ((value && value.constructor === Object) || value !== parentData[name]) {
            if (!me.setByLink(value)) {
                if (value === undefined) {
                    delete parentData[name];
                } else {
                    parentData[name] = value;
                    Ext.app.bind.Stub.trackHadValue(value, me.owner, me.path, me);
                }

                me.inspectValue(parentData);
                // We have children, but we're overwriting the value with something else, so
                // we need to schedule our children
                me.invalidate(true);
            }
        }
    },

    onStoreLoad: function() {
        this.invalidate(true);
    },

    afterLoad: function(record) {
        this.invalidate(true);
    },

    afterCommit: function(record) {
        // Essentially the same as an edit, but we don't know what changed.
        this.afterEdit(record, null);
    },

    afterEdit: function(record, modifiedFieldNames) {
        var children = this.children,
            len = modifiedFieldNames && modifiedFieldNames.length,
            associations = record.associations,
            key, i, child, scheduled;

        // No point checking anything if we don't have children
        if (children) {
            if (len) {
                // We know what changed, check for it and schedule it.
                for (i = 0; i < len; ++i) {
                    child = children[modifiedFieldNames[i]];
                    if (child) {
                        child.invalidate();
                    }
                }
            } else {
                // We don't know what changed, so loop over everything.
                // If the child is not an association, then it's a field so we
                // need to trigger them so we can respond to field changes
                for (key in children) {
                    if (!(associations && key in associations)) {
                        children[key].invalidate();
                    }
                }
            }
        }
        this.invalidate();
    },

    afterReject: function(record) {
        // Essentially the same as an edit, but we don't know what changed.
        this.afterEdit(record, null);
    },

    setByLink: function (value) {
        var me = this,
            n = 0,
            i, link, path, stub;

        for (stub = me; stub; stub = stub.parent) {
            if (stub.isLinkStub) {
                link = stub;
                if (n) {
                    for (path = [], i = 0, stub = me; stub !== link; stub = stub.parent) {
                        ++i;
                        path[n - i] = stub.name;
                    }
                }
                break;
            }
            ++n;
        }

        if (!link || !(stub = link.getTargetStub())) {
            return false;
        }

        // We are a child of a link stub and that stub links to a Stub, so forward the set
        // call over there. This is needed to fire the bindings on that side of the link
        // and that will also arrive back here since we are a linked to it.
        if (path) {
            stub = stub.descend(path);
        }
        stub.set(value);
        return true;
    },

    setFormula: function (formula) {
        var me = this,
            oldFormula = me.formula;

        if (oldFormula) {
            oldFormula.destroy();
        }

        // The new formula will bind to what it needs and that will schedule it (and then
        // us when it sets our value).
        me.formula = new Ext.app.bind.Formula(me, formula);
    },

    react: function() {
        var me = this,
            bound = this.boundValue,
            children = me.children,
            generation;

        if (bound) {
            if (bound.isValidation) {
                bound.refresh();
                generation = bound.generation;
                // Don't react if we haven't changed
                if (me.lastValidationGeneration === generation) {
                    return;
                }
                me.lastValidationGeneration = generation;
            } else if (bound.isModel) {
                // At this point we're guaranteed to have a non-validation model
                // Check if we're interested in it, if so, validate it and let
                // the record fire off any changes
                if (children && children[me.validationKey]) {
                    // Trigger validity checks
                    bound.isValid();
                }
            } else if (bound.isStore) {
                // If we're loading and never delivered, don't do it here
                if (bound.isLoading() && !bound.loadCount) {
                    return;
                }
            }
        }

        this.callParent();
    },

    privates: {
        collect: function() {
            var me = this,
                result = me.callParent(),
                storeBinding = me.storeBinding ? 1 : 0,
                formula = me.formula ? 1 : 0;
            
            return result + storeBinding + formula;
        },

        getLinkFormulaStub: function() {
            // Setting the value on a link backed by a formula should set the
            // formula. So we climb the hierarchy until we find the rootStub
            // and set it there if it be a formula.
            var stub = this;
            while (stub.isLinkStub) {
                stub = stub.binding.stub;
            }
            return stub.formula ? stub : null;
        },
        
        getParentValue: function() {
            var me = this;
            // Cache the value of the parent here. Inside onSchedule we clear the value
            // because it may be invalidated.
            if (me.dirty) {
                me.parentValue = me.parent.getValue();
                me.dirty = false;
            }
            return me.parentValue;
        },

        setStore: function(storeBinding) {
          this.storeBinding = storeBinding;
        },

        inspectValue: function(parentData) {
            var me = this,
                name = me.name,
                current = me.boundValue,
                boundValue = null,
                associations, raw, changed, associatedEntity;

            if (parentData && parentData.isEntity) {
                associations = parentData.associations;
                if (associations && (name in associations)) {
                    boundValue = parentData[associations[name].getterName]();
                    if (boundValue && boundValue.isStore) {
                        boundValue.$associatedStore = true;
                    }
                } else if (name === me.validationKey) {
                    boundValue = parentData.getValidation();
                    // Binding a new one, reset the generation
                    me.lastValidationGeneration = null;
                }
            } else if (parentData) {
                raw = parentData[name];
                if (raw && (raw.isModel || raw.isStore)) {
                    boundValue = raw;
                }
            }

            // Check if we have a current binding that changed. If so, we need
            // to detach ourselves from it
            changed = current !== boundValue;
            if (changed) {
                if (current) {
                    me.detachBound();
                }

                if (boundValue) {
                    if (boundValue.isModel) {
                        boundValue.join(me);
                    } else {
                        // Only want to trigger automatic loading if we've come from an association. Otherwise leave
                        // the user in charge of that.
                        associatedEntity = boundValue.associatedEntity;
                        if (associatedEntity && !associatedEntity.phantom && !boundValue.complete && !boundValue.hasPendingLoad()) {
                            boundValue.load();
                        }
                        // We only want to listen for the first load, since the actual
                        // store object won't change from then on
                        boundValue.on('load', me.onStoreLoad, me, {single: true});
                    }
                }
                me.boundValue = boundValue;
            }
            return boundValue;
        },

        detachBound: function() {
            var me = this,
                current = me.boundValue;

            if (current) {
                if (current.isModel) {
                    current.unjoin(me);
                } else {
                    current.un('load', me.onStoreLoad, me);
                }
            }
        },

        sort: function () {
            var me = this,
                formula = me.formula,
                scheduler = me.scheduler,
                storeBinding = me.storeBinding;

            me.callParent();
        
            if (storeBinding) {
                scheduler.sortItem(storeBinding);
            }

            if (formula) {
                // Our formula must run before we do so it can set the value on us. Our
                // bindings in turn depend on us so they will be scheduled as part of the
                // current sweep if the formula produces a different result.
                scheduler.sortItem(formula);
            }
        }
    }
});