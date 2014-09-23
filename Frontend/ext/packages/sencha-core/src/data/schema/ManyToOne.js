/**
 * This type of association describes the case where one entity is referenced by zero or
 * more other entities typically using a "foreign key" field.
 * 
 * The way this is defined is for one entity to have a field that holds the unique id (also
 * known as "Primary Key" or, more specifically, as the {@link Ext.data.Model#idProperty}
 * field) of the related entity. These fields have a {@link Ext.data.field.Field#reference}
 * in their definition. The value in the `reference` field of an entity instance holds the
 * value of the id of the related entity instance. Since many entities can hold the same
 * value in a `reference` field, this allows many entities to reference one entity.
 */


/*
 * OrderItem has a foreign key to Order.
 * 
 *      OrderItem -> Order
 * 
 * OrderItem is on the "left" and Order is on the "right". This is because the owner of
 * the foreign key is always on the "left". Many OrderItems refer to one Order. The
 * default name of this association would be "Order_OrderItems".
 * 
 *      var Order_OrderItems = {
 *          name: 'Order_OrderItems',
 *          owner: Order_OrderItems.right,
 *          left: {
 *              cls: OrderItem,
 *              type: 'OrderItem',
 *              association: Order_OrderItems,
 *              left: true,
 *              owner: false,
 *              autoLoad: true,
 *              isMany: true,
 *              inverse: Order_OrderItems.right,
 *              role: 'orderItems'
 *          },
 *          right: {
 *              cls: Order,
 *              type: 'Order',
 *              association: Order_OrderItems,
 *              left: false,
 *              owner: true,
 *              autoLoad: true,
 *              isMany: false,
 *              inverse: Order_OrderItems.left,
 *              role: 'order'
 *          }
 *      };
 *      
 *      OrderItem.associations.order = Order_OrderItems.left;
 *      Order.associations.orderItems = Order_OrderItems.right;
 */
Ext.define('Ext.data.schema.ManyToOne', {
    extend: 'Ext.data.schema.Association',

    isManyToOne: true,

    isToOne: true,

    kind: 'many-to-one',

    Left: Ext.define(null, {
        extend: 'Ext.data.schema.Role',

        isMany: true,

        onDrop: function(rightRecord, session) {
            var me = this,
                store = me.getAssociatedItem(rightRecord),
                leftRecords, len, i, refs, id;

            if (store) {
                // Removing will cause the foreign key to be set to null.
                leftRecords = store.removeAll();
                if (leftRecords && me.inverse.owner) {
                    // If we're a child, we need to destroy all the "tickets"
                    for (i = 0, len = leftRecords.length; i < len; ++i) {
                        leftRecords[i].drop();
                    }
                }

                store.destroy();
                rightRecord[me.getStoreName()] = null;
            } else if (session) {
                leftRecords = session.getRefs(rightRecord, me);
                if (leftRecords) {
                    for (id in leftRecords) {
                        leftRecords[id].drop();
                    }
                }
            }
        },

        processUpdate: function(session, associationData) {
            var me = this,
                entityType = me.inverse.cls,
                items = associationData.R,
                id, rightRecord, store, leftRecords;

            if (items) {
                for (id in items) {
                    rightRecord = session.peekRecord(entityType, id);
                    if (rightRecord) {
                        leftRecords = session.getEntityList(me.cls, items[id]);
                        store = me.getAssociatedItem(rightRecord);
                        if (store) {
                            leftRecords = me.validateAssociationRecords(session, rightRecord, leftRecords);
                            store.loadRecords(leftRecords);
                            store.complete = true;
                        } else {
                            // We don't have a store. Create it and add the records.
                            rightRecord[me.getterName](null, null, leftRecords);
                        }
                    } else {
                        session.onInvalidAssociationEntity(entityType, id);
                    }
                }
            }
        },

        validateAssociationRecords: function(session, associatedEntity, leftRecords) {
            var refs = session.getRefs(associatedEntity, this, true),
                ret = [],
                seen, leftRecord, id, i, len;

            if (refs) {
                if (leftRecords) {
                    seen = {};
                    // Loop over the records returned by the server and
                    // check they all still belong
                    for (i = 0, len = leftRecords.length; i < len; ++i) {
                        leftRecord = leftRecords[i];
                        id = leftRecord.id;
                        if (refs[id]) {
                            ret.push(leftRecord);
                        }
                        seen[id] = true;
                    }
                }

                // Loop over the expected set and include any missing records.
                for (id in refs) {
                    if (!seen || !seen[id]) {
                        ret.push(refs[id]);
                    }
                }
            }
            return ret;
        },

        adoptAssociated: function(rightRecord, session) {
            var store = this.getAssociatedItem(rightRecord),
                leftRecords, i, len;
            if (store) {
                store.setSession(session);
                leftRecords = store.getData().items;
                for (i = 0, len = leftRecords.length; i < len; ++i) {
                    session.adopt(leftRecords[i]);
                }
            }
        },

        createGetter: function() {
            var me = this;
            return function (options, scope, leftRecords) {
                // 'this' refers to the Model instance inside this function
                var session = this.session,
                    hadRecords = !!leftRecords;

                if (session) {
                    leftRecords = me.validateAssociationRecords(session, this, leftRecords);
                    if (!hadRecords && !leftRecords.length) {
                        leftRecords = null;
                    }
                }
                return me.getAssociatedStore(this, options, scope, leftRecords, hadRecords);
            };
        },

        createSetter: null, // no setter for an isMany side

        onAddToMany: function (store, leftRecords) {
            this.syncFK(leftRecords, store.associatedEntity, false);
        },

        onLoadMany: function(store, leftRecords, successful) {
            var key = this.inverse.role,
                associated = store.associatedEntity,
                id = associated.getId(),
                field = this.association.field,
                session = store.getSession(),
                i, len, leftRecord, oldId;

            if (successful) {
                for (i = 0, len = leftRecords.length; i < len; ++i) {
                    leftRecord = leftRecords[i];
                    leftRecord[key] = associated;
                    if (field) {
                        oldId = leftRecord.data[field.name];
                        if (oldId !== id) {
                            leftRecord.data[field.name] = id;
                            if (session) {
                                session.updateReference(leftRecord, field, id, oldId);
                            }
                        }
                    }
                }
            }
        },

        onRemoveFromMany: function (store, leftRecords) {
            this.syncFK(leftRecords, store.associatedEntity, true);
        },

        read: function(rightRecord, node, fromReader, readOptions) {
            var me = this,
                // We use the inverse role here since we're setting ourselves
                // on the other record
                key = me.inverse.role,
                result = me.callParent([ rightRecord, node, fromReader, readOptions ]),
                store, leftRecords, len, i;
            
            // Did the root exist in the data?
            if (result.getReadRoot()) {
                // Create the store and dump the data
                store = rightRecord[me.getterName](null, null, result.getRecords());
                // Inline associations should *not* arrive on the "data" object:
                delete rightRecord.data[me.role];

                leftRecords = store.getData().items;

                for (i = 0, len = leftRecords.length; i < len; ++i) {
                    leftRecords[i][key] = rightRecord;
                }
            }
        },

        syncFK: function (leftRecords, rightRecord, clearing) {
            // We are called to set things like the FK (ticketId) of an array of Comment
            // entities. The best way to do that is call the setter on the Comment to set
            // the Ticket. Since we are setting the Ticket, the name of that setter is on
            // our inverse role.

            var foreignKeyName = this.association.getFieldName(),
                setter = this.inverse.setterName, // setTicket
                i = leftRecords.length,
                id = rightRecord.getId(),
                different, leftRecord;

            while (i-- > 0) {
                leftRecord = leftRecords[i];
                different = !leftRecord.isEqual(id, leftRecord.get(foreignKeyName));

                if (different !== clearing) {
                    // clearing === true
                    //      different === true  :: leave alone (not associated anymore)
                    //   ** different === false :: null the value (no longer associated)
                    //
                    // clearing === false
                    //   ** different === true  :: set the value (now associated)
                    //      different === false :: leave alone (already associated)
                    //
                    leftRecord.changingKey = true;
                    if (setter) {
                        leftRecord[setter](clearing ? null : rightRecord);
                    } else {
                        leftRecord.set(foreignKeyName, clearing ? null : id);
                    }
                    leftRecord.changingKey = false;
                }
            }
        }
    }),

    Right: Ext.define(null, {
        extend: 'Ext.data.schema.Role',

        left: false,
        side: 'right',

        onDrop: function(leftRecord, session) {
            // By virtue of being dropped, this record will be removed
            // from any stores it belonged to. The only case we have
            // to worry about is if we have a session but were not yet
            // part of any stores, so we need to clear the foreign key.
            var field = this.association.field;
            if (field) {
                leftRecord.set(field.name, null);
            }
            leftRecord[this.role] = null;
        },

        createGetter: function() {
            // As the target of the FK (say "ticket" for the Comment entity) this
            // getter is responsible for getting the entity referenced by the FK value.
            var me = this;

            return function (options, scope) {
                // 'this' refers to the Comment instance inside this function
                return me.doGetFK(this, options, scope);
            };
        },
        
        createSetter: function() {
            var me = this;

            return function (rightRecord, options, scope) {
                // 'this' refers to the Comment instance inside this function
                return me.doSetFK(this, rightRecord, options, scope);
            };
        },

        checkMembership: function(session, leftRecord) {
            var field = this.association.field,
                store;

            store = this.getSessionStore(session, leftRecord.get(field.name));
            // Check we're not in the middle of an add to the store.
            if (store && !store.contains(leftRecord)) {
                store.add(leftRecord);
            }
        },

        onValueChange: function(leftRecord, session, newValue, oldValue) {
            // If we have a session, we may be able to find the new store this belongs to
            // If not, the best we can do is to remove the record from the associated store/s.
            var me = this,
                joined, store, i, len, associated;

            if (!leftRecord.changingKey) {
                if (session) {
                    // Find the store that holds this record and remove it if possible.
                    store = me.getSessionStore(session, oldValue);
                    if (store) {
                        store.remove(leftRecord);
                    }
                    // If we have a new value, try and find it and push it into the new store.
                    if (newValue || newValue === 0) {
                        store = me.getSessionStore(session, newValue);
                        if (store && !store.isLoading()) {
                            store.add(leftRecord);
                        }
                    }
                } else {
                    joined = leftRecord.joined;
                    if (joined) {
                        for (i = 0, len = joined.length; i < len; ++i) {
                            store = joined[i];
                            if (store.isStore) {
                                associated = store.getAssociatedEntity();
                                if (associated && associated.self === me.cls && associated.getId() === oldValue) {
                                    store.remove(leftRecord);
                                }
                            }
                        }
                    }
                }
            }

            if (me.owner && newValue === null) {
                me.association.schema.queueKeyCheck(leftRecord, me);
            }
        },

        checkKeyForDrop: function(leftRecord) {
            var field = this.association.field;
            if (leftRecord.get(field.name) === null) {
                leftRecord.drop();
            }
        },

        getSessionStore: function(session, value) {
            // May not have the cls loaded yet
            var cls = this.cls,
                rec;

            if (cls) {
                rec = session.peekRecord(cls, value);

                if (rec) {
                    return this.inverse.getAssociatedItem(rec);
                }
            }
        },
        
        read: function(leftRecord, node, fromReader, readOptions) {
            var result = this.callParent([ leftRecord, node, fromReader, readOptions ]),
                rightRecord = result.getRecords()[0];

            if (rightRecord) {
                leftRecord[this.role] = rightRecord;
            }
        }
    })
});
