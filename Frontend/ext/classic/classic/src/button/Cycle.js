/**
 * A specialized SplitButton that contains a menu of {@link Ext.menu.CheckItem} elements. The button automatically
 * cycles through each menu item on click, raising the button's {@link #change} event (or calling the button's
 * {@link #changeHandler} function, if supplied) for the active menu item. Clicking on the arrow section of the
 * button displays the dropdown menu just like a normal SplitButton.  Example usage:
 *
 *     @example
 *     Ext.create('Ext.button.Cycle', {
 *         showText: true,
 *         prependText: 'View as ',
 *         renderTo: Ext.getBody(),
 *         menu: {
 *             id: 'view-type-menu',
 *             items: [{
 *                 text: 'text only',
 *                 iconCls: 'view-text',
 *                 checked: true
 *             },{
 *                 text: 'HTML',
 *                 iconCls: 'view-html'
 *             }]
 *         },
 *         changeHandler: function(cycleBtn, activeItem) {
 *             Ext.Msg.alert('Change View', activeItem.text);
 *         }
 *     });
 */
Ext.define('Ext.button.Cycle', {

    /* Begin Definitions */

    alias: 'widget.cycle',

    extend: 'Ext.button.Split',
    alternateClassName: 'Ext.CycleButton',

    /* End Definitions */

    /**
     * @cfg {Object[]} items
     * An array of {@link Ext.menu.CheckItem} **config** objects to be used when creating the button's menu items (e.g.,
     * `{text:'Foo', iconCls:'foo-icon'}`)
     * 
     * @deprecated 4.0 Use the {@link #cfg-menu} config instead. All menu items will be created as
     * {@link Ext.menu.CheckItem CheckItems}.
     */
    /**
     * @cfg {Boolean} [showText=false]
     * True to display the active item's text as the button text. The Button will show its
     * configured {@link #text} if this config is omitted.
     */
    /**
     * @cfg {String} [prependText='']
     * A static string to prepend before the active item's text when displayed as the button's text (only applies when
     * showText = true).
     */
    /**
     * @cfg {Function/String} [changeHandler=undefined]
     * A callback function that will be invoked each time the active menu item in the button's menu has changed. If this
     * callback is not supplied, the SplitButton will instead fire the {@link #change} event on active item change. The
     * changeHandler function will be called with the following argument list: (SplitButton this, Ext.menu.CheckItem
     * item)
     * @declarativeHandler
     */
    /**
     * @cfg {String} forceIcon
     * A css class which sets an image to be used as the static icon for this button. This icon will always be displayed
     * regardless of which item is selected in the dropdown list. This overrides the default behavior of changing the
     * button's icon to match the selected item's icon on change.
     */

    /**
     * @cfg {Number/String} forceGlyph
     * The charCode to be used as the static icon for this button.  This icon will always be
     * displayed regardless of which item is selected in the dropdown list. This override
     * the default behavior of changing the button's icon to match the selected item's icon
     * on change. This property expects a format consistent with that of {@link #glyph}
     */
    /**
     * @property {Ext.menu.Menu} menu
     * The {@link Ext.menu.Menu Menu} object used to display the {@link Ext.menu.CheckItem CheckItems} representing the
     * available choices.
     */

    /**
     * @event change
     * Fires after the button's active menu item has changed. Note that if a {@link #changeHandler} function is
     * set on this CycleButton, it will be called instead on active item change and this change event will not
     * be fired.
     * @param {Ext.button.Cycle} this
     * @param {Ext.menu.CheckItem} item The menu item that was selected
     */

    /**
     * @private
     */
    getButtonText: function(item) {
        var me = this,
            text = '';

        if (item && me.showText === true) {
            if (me.prependText) {
                text += me.prependText;
            }
            text += item.text;
            return text;
        }
        return me.text;
    },

    /**
     * Sets the button's active menu item.
     * @param {Ext.menu.CheckItem} item The item to activate
     * @param {Boolean} [suppressEvent=false] True to prevent the {@link #change} event and {@link #changeHandler} from firing.
     */
    setActiveItem: function(item, suppressEvent) {
        var me = this,
            changeHandler = me.changeHandler,
            forceIcon = me.forceIcon,
            forceGlyph = me.forceGlyph;

        me.settingActive = true;
        if (!Ext.isObject(item)) {
            item = me.menu.getComponent(item);
        }
        if (item) {
            me.setText(me.getButtonText(item));
            me.setIconCls(forceIcon ? forceIcon : item.iconCls);
            me.setGlyph(forceGlyph ? forceGlyph : item.glyph);

            me.activeItem = item;
            if (!item.checked) {
                item.setChecked(true, false);
            }
            if (!suppressEvent) {
                if (changeHandler) {
                    Ext.callback(changeHandler, me.scope, [me, item], 0, me);
                }
                me.fireEvent('change', me, item);
            }
        }
        me.settingActive = false;
    },

    /**
     * Gets the currently active menu item.
     * @return {Ext.menu.CheckItem} The active item
     */
    getActiveItem: function() {
        return this.activeItem;
    },

    /**
     * @private
     */
    initComponent: function() {
        //<debug>
        // Ext JS Cycle buttons are implemented in a way that clashes with WAI-ARIA requirements,
        // so we warn the developer about that.
        // Don't warn if we're under the slicer though.
        if (Ext.enableAriaButtons && !Ext.slicer) {
            Ext.log.warn(
                "Using Cycle buttons is not recommended in accessible " +
                "applications, because their behavior conflicts " +
                "with accessibility best practices. See WAI-ARIA 1.0 " +
                "Authoring guide: http://www.w3.org/TR/wai-aria-practices/#menubutton"
            );
        }
        //</debug>
        var me = this,
            checked = 0,
            items, i, iLen, item;

        // Allow them to specify a menu config which is a standard Button config.
        // Remove direct use of "items" in 5.0.
        items = (me.menu.items || []).concat(me.items || []);
        me.menu = Ext.applyIf({
            cls: Ext.baseCSSPrefix + 'cycle-menu',
            items: []
        }, me.menu);

        iLen = items.length;

        // Convert all items to CheckItems
        for (i = 0; i < iLen; i++) {
            item = items[i];

            item = Ext.applyIf({
                group        : me.id,
                itemIndex    : i,
                checkHandler : me.checkHandler,
                scope        : me,
                checked      : item.checked || false
            }, item);

            me.menu.items.push(item);

            if (item.checked) {
                checked = i;
            }
        }

        me.itemCount = me.menu.items.length;
        me.callParent(arguments);
        me.on('click', me.toggleSelected, me);
        me.setActiveItem(checked, true);
    },

    /**
     * @private
     */
    checkHandler: function(item, pressed) {
        if (pressed && !this.settingActive) {
            this.setActiveItem(item);
        }
    },

    /**
     * This is normally called internally on button click, but can be called externally to advance the button's active
     * item programmatically to the next one in the menu. If the current item is the last one in the menu the active
     * item will be set to the first item in the menu.
     */
    toggleSelected: function() {
        var me = this,
            m = me.menu,
            checkItem;

        checkItem = me.activeItem.next(':not([disabled])') || m.items.getAt(0);
        checkItem.setChecked(true);
    }
});
