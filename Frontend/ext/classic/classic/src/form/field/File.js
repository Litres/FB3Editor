/**
 * A file upload field which has custom styling and allows control over the button text and other
 * features of {@link Ext.form.field.Text text fields} like {@link Ext.form.field.Text#emptyText empty text}.
 * It uses a hidden file input element behind the scenes to allow user selection of a file and to
 * perform the actual upload during {@link Ext.form.Basic#submit form submit}.
 *
 * Because there is no secure cross-browser way to programmatically set the value of a file input,
 * the standard Field `setValue` method is not implemented. The `{@link #getValue}` method will return
 * a value that is browser-dependent; some have just the file name, some have a full path, some use
 * a fake path.
 *
 * **IMPORTANT:** File uploads are not performed using normal 'Ajax' techniques; see the description for
 * {@link Ext.form.Basic#hasUpload} for details.
 *
 * # Example Usage
 *
 *     @example
 *     Ext.create('Ext.form.Panel', {
 *         title: 'Upload a Photo',
 *         width: 400,
 *         bodyPadding: 10,
 *         frame: true,
 *         renderTo: Ext.getBody(),
 *         items: [{
 *             xtype: 'filefield',
 *             name: 'photo',
 *             fieldLabel: 'Photo',
 *             labelWidth: 50,
 *             msgTarget: 'side',
 *             allowBlank: false,
 *             anchor: '100%',
 *             buttonText: 'Select Photo...'
 *         }],
 *
 *         buttons: [{
 *             text: 'Upload',
 *             handler: function() {
 *                 var form = this.up('form').getForm();
 *                 if(form.isValid()){
 *                     form.submit({
 *                         url: 'photo-upload.php',
 *                         waitMsg: 'Uploading your photo...',
 *                         success: function(fp, o) {
 *                             Ext.Msg.alert('Success', 'Your photo "' + o.result.file + '" has been uploaded.');
 *                         }
 *                     });
 *                 }
 *             }
 *         }]
 *     });
 */
Ext.define('Ext.form.field.File', {
    extend: 'Ext.form.field.Text',
    alias: ['widget.filefield', 'widget.fileuploadfield'],
    alternateClassName: ['Ext.form.FileUploadField', 'Ext.ux.form.FileUploadField', 'Ext.form.File'],
    requires: [
        'Ext.form.field.FileButton',
        'Ext.form.trigger.Component'
    ],

    /**
     * @cfg {String} emptyText
     * Overridden to undefined as {@link #emptyText} is not supported with {@link #inputType inputType}:'file' and should be avoided.
     * The default text to place into an empty field.
     */     
    emptyText: undefined,
    
    needArrowKeys: false,

    triggers: {
        filebutton: {
            type: 'component',
            hideOnReadOnly: false,
            // Most form fields prevent the default browser action on mousedown of the trigger.
            // This is intended to prevent the field's input element from losing focus when
            // the trigger is clicked.  File fields disable this behavior because:
            // 1. The input element does not receive focus when the field is focused. The button does.
            // 2. Preventing the default action of touchstart (translated from mousedown
            // on mobile browsers) prevents the browser's file dialog from opening.
            preventMouseDown: false
        }
    },

    //<locale>
    /**
     * @cfg {String} buttonText
     * The button text to display on the upload button. Note that if you supply a value for
     * {@link #buttonConfig}, the buttonConfig.text value will be used instead if available.
     */
    buttonText: 'Browse...',
    //</locale>

    /**
     * @cfg {Boolean} buttonOnly
     * True to display the file upload field as a button with no visible text field. If true, all
     * inherited Text members will still be available.
     */
    buttonOnly: false,

    /**
     * @cfg {Number} buttonMargin
     * The number of pixels of space reserved between the button and the text field. Note that this only
     * applies if {@link #buttonOnly} = false.
     */
    buttonMargin: 3,
    
    /**
     * @cfg {Boolean} clearOnSubmit
     * True to clear the selected file value when the form this field belongs to
     * is submitted to the server.
     */
    clearOnSubmit: true,

    /**
     * @cfg {Object} buttonConfig
     * Specify optional custom button {@link Ext.button.Button} config (eg. iconCls, text) for the upload button
     */

    /**
     * @event change
     * Fires when the underlying file input field's value has changed from the user selecting a new file from the system
     * file selection dialog.
     * @param {Ext.ux.form.FileUploadField} this
     * @param {String} value The file value returned by the underlying file input field
     */

    /**
     * @property {Ext.dom.Element} fileInputEl
     * A reference to the invisible file input element created for this upload field. Only populated after this
     * component is rendered.
     */

    /**
     * @property {Ext.button.Button} button
     * A reference to the trigger Button component created for this upload field. Only populated after this component is
     * rendered.
     */


    /**
     * @private
     */
    extraFieldBodyCls: Ext.baseCSSPrefix + 'form-file-wrap',

    /**
     * @private
     */
    inputCls: Ext.baseCSSPrefix + 'form-text-file',

    /**
     * @cfg {Boolean} [readOnly=true]
     * Unlike with other form fields, the readOnly config defaults to true in File field.
     */
    readOnly: true,

    /**
     * @cfg {Boolean} editable
     * @inheritdoc
     */
    editable: false,

    submitValue: false,

    /**
     * Do not show hand pointer over text field since file choose dialog is only shown when clicking in the button
     * @private
     */
    triggerNoEditCls: '',

    /**
     * @private
     * Extract the file element, button outer element, and button active element.
     */
    childEls: ['browseButtonWrap'],

    /**
     * @private
     */
    applyTriggers: function(triggers) {
        var me = this,
            triggerCfg = (triggers || {}).filebutton;

        if (triggerCfg) {
            triggerCfg.component = Ext.apply({
                xtype: 'filebutton',
                ownerCt: me,
                id: me.id + '-button',
                ui: me.ui,
                disabled: me.disabled,
                text: me.buttonText,
                style: me.buttonOnly ? '' : me.getButtonMarginProp() + me.buttonMargin + 'px',
                inputName: me.getName(),
                listeners: {
                    scope: me,
                    change: me.onFileChange
                }
            }, me.buttonConfig);

            return me.callParent([triggers]);
        }
        // <debug>
        else {
            Ext.raise(me.$className + ' requires a valid trigger config containing "filebutton" specification');
        }
        // </debug>
    },
    
    getSubTplData: function(fieldData) {
        var data = this.callParent([fieldData]);
        
        // Input field itself should not be focusable since it's always decorative;
        // however the input element is naturally focusable (and tabbable) so we have to
        // deactivate it by setting its tabIndex to -1.
        data.tabIdx = -1;
        
        return data;
    },

    /**
     * @private
     */
    onRender: function() {
        var me = this,
            inputEl, button, buttonEl, trigger;

        me.callParent(arguments);

        inputEl = me.inputEl;
        //name goes on the fileInput, not the text input
        inputEl.dom.name = ''; 
        
        // Some browsers will show a blinking cursor in the field, even if it's readonly. If we do happen
        // to receive focus, forward it on to our focusEl. Also note that in IE, the file input is treated as
        // 2 elements for tabbing purposes (the text, then the button). So as you tab through, it will take 2
        // tabs to get to the next field. As far as I know there's no way around this in any kind of reasonable way.
        inputEl.on('focus', me.onInputFocus, me);
        inputEl.on('mousedown', me.onInputMouseDown, me);

        trigger = me.getTrigger('filebutton');
        button = me.button = trigger.component;
        me.fileInputEl = button.fileInputEl;
        buttonEl = button.el;

        if (me.buttonOnly) {
            me.inputWrap.setDisplayed(false);
            me.shrinkWrap = 3;
        }

        // Ensure the trigger element is sized correctly upon render
        trigger.el.setWidth(buttonEl.getWidth() + buttonEl.getMargin('lr'));
        if (Ext.isIE) {
            me.button.getEl().repaint();
        }
    },

    /**
     * Gets the markup to be inserted into the subTplMarkup.
     */
    getTriggerMarkup: function() {
        return '<td id="' + this.id + '-browseButtonWrap" data-ref="browseButtonWrap" role="presentation"></td>';
    },

    /**
     * @private
     * Event handler fired when the user selects a file.
     */
    onFileChange: function(button, e, value) {
        this.duringFileSelect = true;
        Ext.form.field.File.superclass.setValue.call(this, value);
        delete this.duringFileSelect;
    },
    
    didValueChange: function(){
        // In the case of the file field, the change event will only ever fire 
        // if the value actually changes, so we always want to fire the change event
        // This affects Chrome specifically, because hitting the cancel button will
        // reset the file upload.
        return !!this.duringFileSelect;
    },

    /**
     * @method setEmptyText
     * @hide
     */
    setEmptyText: Ext.emptyFn,

    /**
     * @method setValue
     * @hide
     */
    setValue: Ext.emptyFn,

    reset : function(){
        var me = this,
            clear = me.clearOnSubmit;
        if (me.rendered) {
            me.button.reset(clear);
            me.fileInputEl = me.button.fileInputEl;
            if (clear) {
                me.inputEl.dom.value = '';
                // Reset the underlying value if we're clearing it
                Ext.form.field.File.superclass.setValue.call(this, null);
            }
        }
        me.callParent();
    },
    
    onShow: function(){
        this.callParent();
        // If we started out hidden, the button may have a messed up layout
        // since we don't act like a container
        this.button.updateLayout();    
    },

    onDisable: function(){
        this.callParent();
        this.button.disable();
    },

    onEnable: function(){
        this.callParent();
        this.button.enable();
    },

    /**
     * @method
     * @inheritdoc
     */
    isFileUpload: Ext.returnTrue,

    extractFileInput: function() {
        var me = this,
            fileInput;
            
        if (me.rendered) {
            fileInput = me.button.fileInputEl.dom;
            me.reset();
        } else {
            // Create a fake empty field here so it will still be submitted.
            // All other unrendered fields provide a value.
            fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.className = Ext.baseCSSPrefix + 'hidden-display';
            fileInput.name = me.getName();
        }
        return fileInput;
    },
    
    restoreInput: function(el) {
        // If we're not rendered we don't need to do anything, it will be created
        // when we get flushed to the DOM.
        if (this.rendered) {
            var button = this.button;
            button.restoreInput(el);
            this.fileInputEl = button.fileInputEl;
        }
    },

    onDestroy: function(){
        this.fileInputEl = this.button = null;
        this.callParent();
    },

    getButtonMarginProp: function() {
        return 'margin-left:';
    },
    
    onInputFocus: function(e) {
        this.focus();
        
        // Switching focus from read only input element to file input
        // results in incorrect positioning of the file input.
        // Adding and removing position: relative helps to fix that.
        // See https://sencha.jira.com/browse/EXTJS-18933
        if (Ext.isIE9m) {
            this.fileInputEl.addCls(Ext.baseCSSPrefix + 'position-relative');
            this.fileInputEl.removeCls(Ext.baseCSSPrefix + 'position-relative');
        }
    },
    
    onInputMouseDown: function(e) {
        // Some browsers will show the cursor even if the input is read only,
        // which will be visible in the short instant between inputEl focusing
        // and subsequent focus jump to the FileButton. Preventing inputEl from
        // focusing eliminates that flicker.
        e.preventDefault();
        
        this.focus();
    },
    
    privates: {
        getFocusEl: function() {
            return this.button;
        },
        
        getFocusClsEl: Ext.privateFn
    }
});
