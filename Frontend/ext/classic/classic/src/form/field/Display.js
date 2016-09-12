/**
 * A display-only text field which is not validated and not submitted. This is useful for when you want to display a
 * value from a form's {@link Ext.form.Basic#load loaded data} but do not want to allow the user to edit or submit that
 * value. The value can be optionally {@link #htmlEncode HTML encoded} if it contains HTML markup that you do not want
 * to be rendered.
 *
 * If you have more complex content, or need to include components within the displayed content, also consider using a
 * {@link Ext.form.FieldContainer} instead.
 *
 * Example:
 *
 *     @example
 *     Ext.create('Ext.form.Panel', {
 *         renderTo: Ext.getBody(),
 *         width: 175,
 *         height: 150,
 *         bodyPadding: 10,
 *         title: 'Final Score',
 *         items: [{
 *             xtype: 'displayfield',
 *             fieldLabel: 'Home',
 *             name: 'home_score',
 *             value: '10'
 *         }, {
 *             xtype: 'displayfield',
 *             fieldLabel: 'Visitor',
 *             name: 'visitor_score',
 *             value: '11'
 *         }],
 *         buttons: [{
 *             text: 'Update'
 *         }]
 *     });
 */
Ext.define('Ext.form.field.Display', {
    extend:'Ext.form.field.Base',
    alias: 'widget.displayfield',
    requires: ['Ext.util.Format', 'Ext.XTemplate'],
    alternateClassName: ['Ext.form.DisplayField', 'Ext.form.Display'],
    
    fieldSubTpl: [
        '<div id="{id}" data-ref="inputEl" tabindex="-1" role="textbox" aria-readonly="true"',
        ' aria-labelledby="{cmpId}-labelEl" {inputAttrTpl}',
        '<tpl if="fieldStyle"> style="{fieldStyle}"</tpl>', 
        ' class="{fieldCls} {fieldCls}-{ui}">{value}</div>',
        {
            compiled: true,
            disableFormats: true
        }
    ],
    
    // We have the ARIA markup pre-rendered so we don't want it to be applied
    ariaRole: undefined,
    
    focusable: false,

    /**
     * @cfg {Boolean} readOnly
     * @private
     */
    readOnly: true,

    /**
     * @cfg {String} [fieldCls="x-form-display-field"]
     * The default CSS class for the field.
     */
    fieldCls: Ext.baseCSSPrefix + 'form-display-field',

    fieldBodyCls: Ext.baseCSSPrefix + 'form-display-field-body',

    /**
     * @cfg {Boolean} htmlEncode
     * True to escape HTML in text when rendering it.
     */
    htmlEncode: false,
    
    /**
     * @cfg {Function} renderer
     * A function to transform the raw value for display in the field.
     * 
     *     Ext.create('Ext.form.Panel', {
     *         renderTo: document.body,
     *         width: 175,
     *         bodyPadding: 10,
     *         title: 'Final Score',
     *         items: [{
     *             xtype: 'displayfield',
     *             fieldLabel: 'Grade',
     *             name: 'final_grade',
     *             value: 68,
     *             renderer: function (value, field) {
     *                 var color = (value < 70) ? 'red' : 'black';
     *                 return '<span style="color:' + color + ';">' + value + '</span>';
     *             }
     *         }]
     *     });
     * 
     * @param {Object} value The raw field {@link #value}
     * @param {Ext.form.field.Display} field The display field
     * @return {String} displayValue The HTML string to be rendered
     */
    
    /**
     * @cfg {Object} scope
     * The scope to execute the {@link #renderer} function. Defaults to this.
     */

    noWrap: false,
    
    /**
     * @cfg {Boolean} validateOnChange
     * @private
     */
    validateOnChange: false,

    initEvents: Ext.emptyFn,

    submitValue: false,

    getValue: function() {
        return this.value;
    },
    
    valueToRaw: function(value) {
        if (value || value === 0 || value === false) {
            return value;
        } else {
            return '';
        }
    },
    
    isDirty: function(){
        return false;
    },

    isValid: Ext.returnTrue,

    validate: Ext.returnTrue,

    getRawValue: function() {
        return this.rawValue;
    },

    setRawValue: function(value) {
        var me = this;
            
        value = Ext.valueFrom(value, '');
        me.rawValue = value;
        if (me.rendered) {
            me.inputEl.dom.innerHTML = me.getDisplayValue();
            me.updateLayout();
        }
        return value;
    },

    /**
     * @private
     * Format the value to display.
     */
    getDisplayValue: function() {
        var me = this,
            value = this.getRawValue(),
            display;
        if (me.renderer) {
             display = me.renderer.call(me.scope || me, value, me);
        } else {
             display = me.htmlEncode ? Ext.util.Format.htmlEncode(value) : value;
        }
        return display;
    },
        
    getSubTplData: function(fieldData) {
        var ret = this.callParent(arguments);

        ret.value = this.getDisplayValue();

        return ret;
    }

    /**
     * @cfg {String} inputType
     * @private
     */
    /**
     * @cfg {Boolean} disabled
     * @private
     */
    /**
     * @cfg {Number} checkChangeEvents
     * @private
     */
    /**
     * @cfg {Number} checkChangeBuffer
     * @private
     */
});
