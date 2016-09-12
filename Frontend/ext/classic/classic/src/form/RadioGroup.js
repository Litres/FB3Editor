/**
 * A {@link Ext.form.FieldContainer field container} which has a specialized layout for arranging
 * {@link Ext.form.field.Radio} controls into columns, and provides convenience {@link Ext.form.field.Field}
 * methods for {@link #getValue getting}, {@link #setValue setting}, and {@link #validate validating} the
 * group of radio buttons as a whole.
 *
 * # Validation
 *
 * Individual radio buttons themselves have no default validation behavior, but
 * sometimes you want to require a user to select one of a group of radios. RadioGroup
 * allows this by setting the config `{@link #allowBlank}:false`; when the user does not check at
 * one of the radio buttons, the entire group will be highlighted as invalid and the
 * {@link #blankText error message} will be displayed according to the {@link #msgTarget} config.
 *
 * # Layout
 *
 * The default layout for RadioGroup makes it easy to arrange the radio buttons into
 * columns; see the {@link #columns} and {@link #vertical} config documentation for details. You may also
 * use a completely different layout by setting the {@link #cfg-layout} to one of the 
 * other supported layout types; for instance you may wish to use a custom arrangement 
 * of hbox and vbox containers. In that case the Radio components at any depth will 
 * still be managed by the RadioGroup's validation.
 *
 * # Example usage
 *
 *     @example
 *     Ext.create('Ext.form.Panel', {
 *         title: 'RadioGroup Example',
 *         width: 300,
 *         height: 125,
 *         bodyPadding: 10,
 *         renderTo: Ext.getBody(),
 *         items:[{
 *             xtype: 'radiogroup',
 *             fieldLabel: 'Two Columns',
 *             // Arrange radio buttons into two columns, distributed vertically
 *             columns: 2,
 *             vertical: true,
 *             items: [
 *                 { boxLabel: 'Item 1', name: 'rb', inputValue: '1' },
 *                 { boxLabel: 'Item 2', name: 'rb', inputValue: '2', checked: true},
 *                 { boxLabel: 'Item 3', name: 'rb', inputValue: '3' },
 *                 { boxLabel: 'Item 4', name: 'rb', inputValue: '4' },
 *                 { boxLabel: 'Item 5', name: 'rb', inputValue: '5' },
 *                 { boxLabel: 'Item 6', name: 'rb', inputValue: '6' }
 *             ]
 *         }]
 *     });
 *
 */
Ext.define('Ext.form.RadioGroup', {
    extend: 'Ext.form.CheckboxGroup',
    alias: 'widget.radiogroup',

    requires: [
        'Ext.form.field.Radio'
    ],
    
    mixins: [
        'Ext.util.FocusableContainer'
    ],

    /**
     * @cfg {Ext.form.field.Radio[]/Object[]} items
     * An Array of {@link Ext.form.field.Radio Radio}s or Radio config objects to arrange in the group.
     */
    /**
     * @cfg {Boolean} allowBlank
     * True to allow every item in the group to be blank.
     * If allowBlank = false and no items are selected at validation time, {@link #blankText} will
     * be used as the error text.
     */
    allowBlank : true,
    //<locale>
    /**
     * @cfg {String} blankText
     * Error text to display if the {@link #allowBlank} validation fails
     */
    blankText : 'You must select one item in this group',
    //</locale>

    defaultType : 'radiofield',

    /**
     * @cfg {Boolean} [local=false]
     * By default, child {@link Ext.form.field.Radio radio} `name`s are scoped to the encapsulating {@link Ext.form.Panel form panel}
     * if any, of the document.
     *
     * If you are using multiple `RadioGroup`s each of which uses the same `name` configuration in child {@link Ext.form.field.Radio radio}s, configure this as `true` to scope
     * the names to within this `RadioGroup`
     */
    local: false,

    defaultBindProperty: 'value',

    /**
     * @private
     */
    groupCls : Ext.baseCSSPrefix + 'form-radio-group',
    
    ariaRole: 'radiogroup',
    
    initRenderData: function() {
        var me = this,
            data, ariaAttr;
        
        data = me.callParent();
        ariaAttr = data.ariaAttributes;
        
        if (ariaAttr) {
            ariaAttr['aria-required'] = !me.allowBlank;
            ariaAttr['aria-invalid']  = false;
        }
        
        return data;
    },

    lookupComponent: function(config) {
        var result = this.callParent([config]);

        // Local means that the exclusivity of checking by name is scoped to this RadioGroup.
        // So multiple RadioGroups can be used which use the same Radio names.
        // This enables their use as a grid widget.
        if (this.local) {
            result.formId = this.getId();
        }
        return result;
    },
    
    getBoxes: function(query, root) {
        return (root || this).query('[isRadio]' + (query||''));
    },
    
    checkChange: function() {
        var value = this.getValue(),
            key = Ext.Object.getKeys(value)[0];
            
        // If the value is an array we skip out here because it's during a change
        // between multiple items, so we never want to fire a change
        if (Ext.isArray(value[key])) {
            return;
        }
        this.callParent(arguments);    
    },

    /**
     * Sets the value of the radio group. The radio with corresponding name and value will be set.
     * This method is simpler than {@link Ext.form.CheckboxGroup#setValue} because only 1 value is allowed
     * for each name. You can use the setValue method as:
     *
     *     var form = Ext.create('Ext.form.Panel', {
     *         title       : 'RadioGroup Example',
     *         width       : 300,
     *         bodyPadding : 10,
     *         renderTo    : Ext.getBody(),
     *         items       : [
     *             {
     *                 xtype      : 'radiogroup',
     *                 fieldLabel : 'Group',
     *                 items      : [
     *                     { boxLabel : 'Item 1', name : 'rb', inputValue : 1 },
     *                     { boxLabel : 'Item 2', name : 'rb', inputValue : 2 }
     *                 ]
     *             }
     *         ],
     *         tbar        : [
     *             {
     *                 text    : 'setValue on RadioGroup',
     *                 handler : function () {
     *                     form.child('radiogroup').setValue({
     *                         rb : 2
     *                     });
     *                 }
     *             }
     *         ]
     *     });
     *
     * @param {Object} value The map from names to values to be set.
     * @return {Ext.form.RadioGroup} this
     */
    setValue: function(value) {
        var cbValue, first, formId, radios,
            i, len, name;

        if (Ext.isObject(value)) {
            Ext.suspendLayouts();
            first = this.items.first();
            formId = first ? first.getFormId() : null;

            for (name in value) {
                cbValue = value[name];
                radios = Ext.form.RadioManager.getWithValue(name, cbValue, formId).items;
                len = radios.length;

                for (i = 0; i < len; ++i) {
                    radios[i].setValue(true);
                }
            }
            Ext.resumeLayouts(true);
        }
        return this;
    },
    
    markInvalid: function(errors) {
        var ariaDom = this.ariaEl.dom;
        
        this.callParent([errors]);
        
        if (ariaDom){
            ariaDom.setAttribute('aria-invalid', true);
        }
    },
    
    clearInvalid: function() {
        var ariaDom = this.ariaEl.dom;
        
        this.callParent();
        
        if (ariaDom) {
            ariaDom.setAttribute('aria-invalid', false);
        }
    },
    
    privates: {
        getFocusables: function() {
            return this.getBoxes();
        },
        
        initDefaultFocusable: function(beforeRender) {
            var me = this,
                checked, item;

            checked = me.getChecked();
        
            // In a Radio group, only one button is supposed to be checked
            //<debug>
            if (checked.length > 1) {
                Ext.log.error("RadioGroup " + me.id + " has more than one checked button");
            }
            //</debug>
        
            // If we have a checked button, it gets the initial childTabIndex,
            // otherwise the first button gets it
            if (checked.length) {
                item = checked[0];
            }
            else {
                item = me.findNextFocusableChild({
                    beforeRender: beforeRender,
                    step: 1
                });
            }
            
            if (item) {
                me.activateFocusable(item);
            }
            
            return item;
        },
        
        getFocusableContainerEl: function() {
            return this.containerEl;
        },
        
        onFocusableContainerFocusLeave: function() {
            this.clearFocusables();
            this.initDefaultFocusable();
        },
        
        doFocusableChildAdd: function(child) {
            var me = this,
                mixin = me.mixins.focusablecontainer,
                boxes, i, len;
            
            boxes = child.isContainer ? me.getBoxes('', child) : [child];
            
            for (i = 0, len = boxes.length; i < len; i++) {
                mixin.doFocusableChildAdd.call(me, boxes[i]);
            }
        },
        
        doFocusableChildRemove: function(child) {
            var me = this,
                mixin = me.mixins.focusablecontainer,
                boxes, i, len;
            
            boxes = child.isContainer ? me.getBoxes('', child) : [child];
            
            for (i = 0, len = boxes.length; i < len; i++) {
                mixin.doFocusableChildRemove.call(me, boxes[i]);
            }
        },
    
        focusChild: function(radio, forward, e) {
            var nextRadio = this.mixins.focusablecontainer.focusChild.apply(this, arguments);
        
            // Ctrl-arrow does not select the radio that is going to be focused
            if (!e.ctrlKey) {
                nextRadio.setValue(true);
            }
        }
    }
});
