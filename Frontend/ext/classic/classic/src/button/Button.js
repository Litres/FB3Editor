/**
 * Create simple buttons with this component. Customizations include {@link #iconAlign aligned}
 * {@link #iconCls icons}, {@link #cfg-menu dropdown menus}, {@link #tooltip tooltips}
 * and {@link #scale sizing options}. Specify a {@link #handler handler} to run code when
 * a user clicks the button, or use {@link #listeners listeners} for other events such as
 * {@link #mouseover mouseover}. Example usage:
 *
 *     @example
 *     Ext.create('Ext.Button', {
 *         text: 'Click me',
 *         renderTo: Ext.getBody(),
 *         handler: function() {
 *             alert('You clicked the button!');
 *         }
 *     });
 *
 * The {@link #handler} configuration can also be updated dynamically using the {@link #setHandler}
 * method.  Example usage:
 *
 *     @example
 *     Ext.create('Ext.Button', {
 *         text    : 'Dynamic Handler Button',
 *         renderTo: Ext.getBody(),
 *         handler : function() {
 *             // this button will spit out a different number every time you click it.
 *             // so firstly we must check if that number is already set:
 *             if (this.clickCount) {
 *                 // looks like the property is already set, so lets just add 1 to that number and alert the user
 *                 this.clickCount++;
 *                 alert('You have clicked the button "' + this.clickCount + '" times.\n\nTry clicking it again..');
 *             } else {
 *                 // if the clickCount property is not set, we will set it and alert the user
 *                 this.clickCount = 1;
 *                 alert('You just clicked the button for the first time!\n\nTry pressing it again..');
 *             }
 *         }
 *     });
 *
 * A button within a container:
 *
 *     @example
 *     Ext.create('Ext.Container', {
 *         renderTo: Ext.getBody(),
 *         items   : [
 *             {
 *                 xtype: 'button',
 *                 text : 'My Button'
 *             }
 *         ]
 *     });
 *
 * A useful option of Button is the {@link #scale} configuration. This configuration has three different options:
 *
 * - `'small'`
 * - `'medium'`
 * - `'large'`
 *
 * Example usage:
 *
 *     @example
 *     Ext.create('Ext.Button', {
 *         renderTo: document.body,
 *         text    : 'Click me',
 *         scale   : 'large'
 *     });
 *
 * Buttons can also be toggled. To enable this, you simple set the {@link #enableToggle} property to `true`.
 * Example usage:
 *
 *     @example
 *     Ext.create('Ext.Button', {
 *         renderTo: Ext.getBody(),
 *         text: 'Click Me',
 *         enableToggle: true
 *     });
 *
 * You can assign a menu to a button by using the {@link #cfg-menu} configuration. This standard configuration
 * can either be a reference to a {@link Ext.menu.Menu menu} object, a {@link Ext.menu.Menu menu} id or a
 * {@link Ext.menu.Menu menu} config blob. When assigning a menu to a button, an arrow is automatically
 * added to the button.  You can change the alignment of the arrow using the {@link #arrowAlign} configuration
 * on button.  Example usage:
 *
 *     @example
 *     Ext.create('Ext.Button', {
 *         text      : 'Menu button',
 *         renderTo  : Ext.getBody(),
 *         arrowAlign: 'bottom',
 *         menu      : [
 *             {text: 'Item 1'},
 *             {text: 'Item 2'},
 *             {text: 'Item 3'},
 *             {text: 'Item 4'}
 *         ]
 *     });
 *
 * Using listeners, you can easily listen to events fired by any component, using the {@link #listeners}
 * configuration or using the {@link #addListener} method.  Button has a variety of different listeners:
 *
 * - `click`
 * - `toggle`
 * - `mouseover`
 * - `mouseout`
 * - `mouseshow`
 * - `menuhide`
 * - `menutriggerover`
 * - `menutriggerout`
 *
 * Example usage:
 *
 *     @example
 *     Ext.create('Ext.Button', {
 *         text     : 'Button',
 *         renderTo : Ext.getBody(),
 *         listeners: {
 *             click: function() {
 *                 // this == the button, as we are in the local scope
 *                 this.setText('I was clicked!');
 *             },
 *             mouseover: function() {
 *                 // set a new config which says we moused over, if not already set
 *                 if (!this.mousedOver) {
 *                     this.mousedOver = true;
 *                     alert('You moused over a button!\n\nI wont do this again.');
 *                 }
 *             }
 *         }
 *     });
 */
Ext.define('Ext.button.Button', {

    /* Begin Definitions */
    alias: 'widget.button',
    extend: 'Ext.Component',
    
    requires: [
        'Ext.dom.ButtonElement',
        'Ext.button.Manager',
        'Ext.menu.Manager',
        'Ext.util.ClickRepeater',
        'Ext.util.TextMetrics'
    ],

    mixins: [
        'Ext.mixin.Queryable',
        'Ext.util.KeyboardInteractive'
    ],

    alternateClassName: 'Ext.Button',

    config: {
        /**
         * @cfg {String} iconAlign
         * The side of the Button box to render the icon. Four values are allowed:
         *
         * - 'top'
         * - 'right'
         * - 'bottom'
         * - 'left'
         */
        iconAlign: 'left',

        /**
         * @cfg {String}
         * The button text to be used as innerHTML (html tags are accepted).
         */
        text: null,

        /**
         * @cfg {String}
         * The text alignment for this button (center, left, right).
         */
        textAlign: 'center',

        /**
         * @cfg {Boolean}
         * `false` to hide the button arrow.  Only applicable for {@link Ext.button.Split
         * Split Buttons} and buttons configured with a {@link #cfg-menu}.
         */
        arrowVisible: true
    },

    /* End Definitions */

    /**
     * @property {Boolean}
     * `true` in this class to identify an object as an instantiated Button, or subclass thereof.
     */
    isButton: true,

    //<feature legacyBrowser>
    /**
     * @property {Boolean}
     * @private
     * `true` to keep height of the frame's "MC" element in sync.  This is needed in IE8
     * so that the button's inner element(s) can use height:100% to fill the button when
     * it not in shrinkWrap mode
     */
    _syncFrameHeight: true,
    //</feature>

    /**
     * @private
     * @readonly
     */
    liquidLayout: true,

    /**
     * @property {Boolean} hidden
     * True if this button is hidden.
     * @readonly
     */
    hidden: false,

    /**
     * @property {Boolean} disabled
     * True if this button is disabled.
     * @readonly
     */
    disabled: false,

    /**
     * @property {Boolean} pressed
     * True if this button is pressed (only if enableToggle = true).
     * @readonly
     */
    pressed: false,

    /**
     * @cfg {String} icon
     * @inheritdoc Ext.panel.Header#icon
     */

    /**
     * @cfg {Function/String} handler
     * A function called when the button is clicked (can be used instead of click event).
     * 
     * See also {@link #clickEvent}
     * @param {Ext.button.Button} button This button.
     * @param {Ext.event.Event} e The click event.
     * @declarativeHandler
     */

    /**
     * @cfg {Number} minWidth
     * The minimum width for this button (used to give a set of buttons a common width).
     * See also {@link Ext.panel.Panel}.{@link Ext.panel.Panel#minButtonWidth minButtonWidth}.
     */

    /**
     * @cfg {String/Object} tooltip
     * The tooltip for the button - can be a string to be used as innerHTML (html tags are accepted) or
     * QuickTips config object.
     */

    /**
     * @cfg {Boolean} [hidden=false]
     * True to start hidden.
     */

    /**
     * @cfg {Boolean} [disabled=false]
     * True to start disabled.
     */

    /**
     * @cfg padding
     * @inheritdoc
     * @removed Use the $button-*-padding CSS Vars within a custom theme instead.
     */

    /**
     * @cfg {Boolean} [pressed=false]
     * True to start pressed (only if enableToggle = true)
     */

    /**
     * @cfg {String} toggleGroup
     * The group this toggle button is a member of (only 1 per group can be pressed). If a toggleGroup
     * is specified, the {@link #enableToggle} configuration will automatically be set to true.
     */

    /**
     * @cfg {Boolean/Object} [repeat=false]
     * True to repeat fire the click event while the mouse is down. This can also be a
     * {@link Ext.util.ClickRepeater ClickRepeater} config object.
     */

    /**
     * @cfg {Number} tabIndex
     * Sets a DOM tabIndex for this button. tabIndex may be set to `-1` in order to remove
     * the button from the tab rotation.
     */
    tabIndex: 0,

    /**
     * @cfg {Boolean} [allowDepress=true]
     * False to not allow a pressed Button to be depressed. Only valid when {@link #enableToggle} is true.
     */

    /**
     * @cfg {Boolean} [enableToggle=false]
     * True to enable pressed/not pressed toggling. If a {@link #toggleGroup} is specified, this
     * option will be set to true.
     */
    enableToggle: false,

    /**
     * @cfg {Function/String} toggleHandler
     * Function called when a Button with {@link #enableToggle} set to true is clicked.
     * @cfg {Ext.button.Button} toggleHandler.button This button.
     * @cfg {Boolean} toggleHandler.state The next state of the Button, true means pressed.
     * @declarativeHandler
     */

    /**
     * @cfg {Ext.menu.Menu/String/Object} menu
     * Standard menu attribute consisting of a reference to a menu object, a menu id
     * or a menu config blob. Note that using menus with handlers or click event listeners
     * violates WAI-ARIA 1.0 requirements for accessible Web applications, and is not
     * recommended.
     */

    /**
     * @cfg {String} menuAlign
     * The position to align the menu to (see {@link Ext.util.Positionable#alignTo} for more details).
     */
    menuAlign: 'tl-bl?',

    /**
     * @cfg {Boolean} showEmptyMenu
     * True to force an attached {@link #cfg-menu} with no items to be shown when clicking
     * this button. By default, the menu will not show if it is empty.
     */
    showEmptyMenu: false,

    /**
     * @cfg {String} overflowText
     * If used in a {@link Ext.toolbar.Toolbar Toolbar}, the text to be used if this item is shown in the overflow menu.
     * See also {@link Ext.toolbar.Item}.`{@link Ext.toolbar.Item#overflowText overflowText}`.
     */

    /**
     * @cfg {String} iconCls
     * @inheritdoc Ext.panel.Header#cfg-iconCls
     */

    /**
     * @cfg {Number/String} glyph
     * @inheritdoc Ext.panel.Header#glyph
     */

    /**
     * @cfg {String} clickEvent
     * The DOM event that will fire the handler of the button. This can be any valid event name (dblclick, contextmenu).
     */
    clickEvent: 'click',

    /**
     * @cfg {Boolean} preventDefault
     * `true` to prevent the default action when the {@link #clickEvent} is processed.
     */
    preventDefault: true,

    /**
     * @cfg {Boolean} handleMouseEvents
     * False to disable visual cues on mouseover, mouseout and mousedown.
     */
    handleMouseEvents: true,

    /**
     * @cfg {String} tooltipType
     * The type of tooltip to use. Either 'qtip' for QuickTips or 'title' for title attribute.
     */
    tooltipType: 'qtip',

    /**
     * @cfg {String} [baseCls='x-btn']
     * The base CSS class to add to all buttons.
     */
    baseCls: Ext.baseCSSPrefix + 'btn',

    /**
     * @cfg {String} href
     * The URL to open when the button is clicked. Specifying this config causes the Button to be
     * rendered with the specified URL as the `href` attribute of its `<a>` Element.
     *
     * This is better than specifying a click handler of
     *
     *     function() { window.location = "http://www.sencha.com" }
     *
     * because the UI will provide meaningful hints to the user as to what to expect upon clicking
     * the button, and will also allow the user to open in a new tab or window, bookmark or drag the URL, or directly save
     * the URL stream to disk.
     *
     * See also the {@link #hrefTarget} config.
     */

    /**
      * @cfg {String} [hrefTarget="_blank"]
      * The target attribute to use for the underlying anchor. Only used if the {@link #href}
      * property is specified.
      */
     hrefTarget: '_blank',

     /**
     * @cfg {Boolean} [destroyMenu=true]
     * Whether or not to destroy any associated menu when this button is destroyed.
     * In addition, a value of `true` for this config will destroy the currently bound menu when a new
     * menu is set in {@link #setMenu} unless overridden by that method's destroyMenu function argument.
     */
     destroyMenu: true,

    /**
     * @cfg {Object} baseParams
     * An object literal of parameters to pass to the url when the {@link #href} property is specified.
     */

    /**
     * @cfg {Object} params
     * An object literal of parameters to pass to the url when the {@link #href} property is specified. Any params
     * override {@link #baseParams}. New params can be set using the {@link #setParams} method.
     */

    /**
     * @cfg {String/Number} value
     * The value of this button.  Only applicable when used as an item of a {@link Ext.button.Segmented Segmented Button}.
     */
    
    focusable: true,
    ariaRole: 'button',
    
    keyHandlers: {
        SPACE: 'onEnterKey',
        ENTER: 'onEnterKey',
        DOWN: 'onDownKey'
    },

    defaultBindProperty: 'text',

    childEls: [
        'btnEl', 'btnWrap', 'btnInnerEl', 'btnIconEl', 'arrowEl'
    ],

    publishes: {
        pressed: 1
    },

    /**
     * @private
     */
    _btnWrapCls: Ext.baseCSSPrefix + 'btn-wrap',
    _btnCls: Ext.baseCSSPrefix + 'btn-button',
    _baseIconCls: Ext.baseCSSPrefix + 'btn-icon-el',
    _glyphCls: Ext.baseCSSPrefix + 'btn-glyph',
    _innerCls: Ext.baseCSSPrefix + 'btn-inner',
    _textCls: Ext.baseCSSPrefix + 'btn-text',
    _noTextCls: Ext.baseCSSPrefix + 'btn-no-text',
    _hasIconCls: Ext.baseCSSPrefix + 'btn-icon',
    _pressedCls: Ext.baseCSSPrefix + 'btn-pressed',
    overCls: Ext.baseCSSPrefix + 'btn-over',
    _disabledCls: Ext.baseCSSPrefix + 'btn-disabled',
    _menuActiveCls: Ext.baseCSSPrefix + 'btn-menu-active',
    _arrowElCls: Ext.baseCSSPrefix + 'btn-arrow-el',
    _focusCls: Ext.baseCSSPrefix + 'btn-focus',
    _arrowFocusCls: Ext.baseCSSPrefix + 'arrow-focus',

    // We have to keep "unselectable" attribute on all elements because it's not inheritable.
    // Without it, clicking anywhere on a button disrupts current selection and cursor position
    // in HtmlEditor.
    renderTpl:
        '<span id="{id}-btnWrap" data-ref="btnWrap" role="presentation" unselectable="on" style="{btnWrapStyle}" ' +
                'class="{btnWrapCls} {btnWrapCls}-{ui} {splitCls}{childElCls}">' +
            '<span id="{id}-btnEl" data-ref="btnEl" role="presentation" unselectable="on" style="{btnElStyle}" ' +
                    'class="{btnCls} {btnCls}-{ui} {textCls} {noTextCls} {hasIconCls} ' +
                    '{iconAlignCls} {textAlignCls} {btnElAutoHeightCls}{childElCls}">' +
                '<tpl if="iconBeforeText">{[values.$comp.renderIcon(values)]}</tpl>' +
                '<span id="{id}-btnInnerEl" data-ref="btnInnerEl" unselectable="on" ' +
                    'class="{innerCls} {innerCls}-{ui}{childElCls}">{text}</span>' +
                '<tpl if="!iconBeforeText">{[values.$comp.renderIcon(values)]}</tpl>' +
            '</span>' +
        '</span>' +
        '{[values.$comp.getAfterMarkup ? values.$comp.getAfterMarkup(values) : ""]}' +
        // if "closable" (tab) add a close element icon
        '<tpl if="closable">' +
            '<span id="{id}-closeEl" data-ref="closeEl" class="{baseCls}-close-btn">' +
                '<tpl if="closeText">' +
                    ' {closeText}' +
                '</tpl>' +
            '</span>' +
        '</tpl>' +
        // Split buttons have additional tab stop for the arrow element
        '<tpl if="split">' +
            '<span id="{id}-arrowEl" class="{arrowElCls}" data-ref="arrowEl" ' +
                'role="button" hidefocus="on" unselectable="on"' +
                '<tpl if="tabIndex != null"> tabindex="{tabIndex}"</tpl>' +
                '<tpl foreach="arrowElAttributes"> {$}="{.}"</tpl>' +
            '>{arrowElText}</span>' +
        '</tpl>',

    iconTpl:
        '<span id="{id}-btnIconEl" data-ref="btnIconEl" role="presentation" unselectable="on" class="{baseIconCls} ' +
                '{baseIconCls}-{ui} {iconCls} {glyphCls}{childElCls}" style="' +
            '<tpl if="iconUrl">background-image:url({iconUrl});</tpl>' +
            '<tpl if="glyph && glyphFontFamily">font-family:{glyphFontFamily};</tpl>">' +
            '<tpl if="glyph">&#{glyph};</tpl>' +
        '</span>',

    /**
     * @cfg {"small"/"medium"/"large"} scale
     * The size of the Button. Three values are allowed:
     *
     * - 'small' - Results in the button element being 16px high.
     * - 'medium' - Results in the button element being 24px high.
     * - 'large' - Results in the button element being 32px high.
     */
    scale: 'small',

    /**
     * @private
     * An array of allowed scales.
     */
    allowedScales: ['small', 'medium', 'large'],

    /**
     * @cfg {Object} scope
     * The scope (**this** reference) in which the `{@link #handler}` and `{@link #toggleHandler}` is executed.
     * Defaults to this Button.
     */


    /**
     * @cfg {String} arrowAlign
     * The side of the Button box to render the arrow if the button has an associated {@link #cfg-menu}. Two
     * values are allowed:
     *
     * - 'right'
     * - 'bottom'
     */
    arrowAlign: 'right',

    /**
     * @cfg {String} arrowCls
     * The className used for the inner arrow element if the button has a menu.
     */
    arrowCls: 'arrow',

    /**
     * @property {Ext.Template} template
     * A {@link Ext.Template Template} used to create the Button's DOM structure.
     *
     * Instances, or subclasses which need a different DOM structure may provide a different template layout in
     * conjunction with an implementation of {@link #getTemplateArgs}.
     */

    /**
     * @cfg {String} cls
     * A CSS class string to apply to the button's main element.
     */

    /**
     * @property {Ext.menu.Menu} menu
     * The {@link Ext.menu.Menu Menu} object associated with this Button when configured with the {@link #cfg-menu} config
     * option.
     */

    maskOnDisable: false,

    shrinkWrap: 3,

    frame: true,

    autoEl: {
        tag: 'a',
        hidefocus: 'on',
        unselectable: 'on'
    },

    hasFrameTable: function () {
        // Instead of browser sniffing, it's easier to check for the presence of frameTable.
        // If present, we know that it's a browser that doesn't support CSS3BorderRadius.
        return this.href && this.frameTable;
    },

    frameTableListener: function () {
        if (!this.disabled) {
            this.doNavigate();
        }
    },

    doNavigate: function () {
        // Non-HTML5 browsers don't support a block element inside an A tag.
        // http://stackoverflow.com/questions/5682048/putting-a-table-inside-a-hyperlink-not-working-in-ie
        // Note use this.getHref() to append any params to the url.
        if (this.hrefTarget === '_blank') {
            window.open(this.getHref(), this.hrefTarget);
        } else {
            location.href = this.getHref();
        }
    },

    // A reusable object used by getTriggerRegion to avoid excessive object creation.
    _triggerRegion: {},

    /**
     * @event click
     * Fires when this button is clicked, before the configured {@link #handler} is invoked. Execution of the
     * {@link #handler} may be vetoed by returning `false` to this event.
     * @param {Ext.button.Button} this
     * @param {Event} e The click event
     */

    /**
     * @event beforetoggle
     * Fires before the 'pressed' state of this button changes (only if enableToggle = true)
     * If a handler returns `false`, the toggle is vetoed.
     * @param {Ext.button.Button} this
     * @param {Boolean} pressed
     */

    /**
     * @event toggle
     * Fires when the 'pressed' state of this button changes (only if enableToggle = true)
     * @param {Ext.button.Button} this
     * @param {Boolean} pressed
     */

    /**
     * @event mouseover
     * Fires when the mouse hovers over the button
     * @param {Ext.button.Button} this
     * @param {Event} e The event object
     */

    /**
     * @event mouseout
     * Fires when the mouse exits the button
     * @param {Ext.button.Button} this
     * @param {Event} e The event object
     */

    /**
     * @event menushow
     * If this button has a menu, this event fires when it is shown
     * @param {Ext.button.Button} this
     * @param {Ext.menu.Menu} menu
     */

    /**
     * @event menuhide
     * If this button has a menu, this event fires when it is hidden
     * @param {Ext.button.Button} this
     * @param {Ext.menu.Menu} menu
     */

    /**
     * @event menutriggerover
     * If this button has a menu, this event fires when the mouse enters the menu triggering element
     * @param {Ext.button.Button} this
     * @param {Ext.menu.Menu} menu
     * @param {Event} e
     */

    /**
     * @event menutriggerout
     * If this button has a menu, this event fires when the mouse leaves the menu triggering element
     * @param {Ext.button.Button} this
     * @param {Ext.menu.Menu} menu
     * @param {Event} e
     */

    /**
     * @event textchange
     * Fired when the button's text is changed by the {@link #setText} method.
     * @param {Ext.button.Button} this
     * @param {String} oldText
     * @param {String} newText
     */

    /**
     * @event iconchange
     * Fired when the button's icon is changed by the {@link #setIcon} or {@link #setIconCls} methods.
     * @param {Ext.button.Button} this
     * @param {String} oldIcon
     * @param {String} newIcon
     */

    /**
     * @event glyphchange
     * Fired when the button's glyph is changed by the {@link #setGlyph} method.
     * @param {Ext.button.Button} this
     * @param {Number/String} newGlyph
     * @param {Number/String} oldGlyph
     */

    initComponent: function() {
        var me = this;
        
        // WAI-ARIA spec requires that menu buttons react to Space and Enter keys
        // by showing the menu while leaving focus on the button, and to Down Arrow key
        // by showing the menu and selecting first menu item. This behavior may conflict
        // with historical Ext JS menu button behavior if a handler or a click listener
        // is set on a button; in that case Space or Enter key would activate
        // the handler/click listener, and only Down Arrow key would open the menu.
        // To avoid the ambiguity, we check if the button has both menu *and* handler
        // or click event listener, and warn the developer in that case.
        // Note that this check does not apply to Split buttons because those now have
        // two tab stops and can effectively combine both menu and toggling/href/handler.
        //<debug>
        // Don't check if we're under the slicer to avoid build failures
        if (!me.isSplitButton && me.menu && Ext.enableAriaButtons && !Ext.slicer && Ext.enableAria) {
            // ARIA compatibility is enabled by default but maybe it was disabled
            if (me.enableToggle || me.toggleGroup) {
                Ext.log.warn(
                    "According to WAI-ARIA 1.0 Authoring guide " +
                    "(http://www.w3.org/TR/wai-aria-practices/#menubutton), " +
                    "menu button '" + me.id + "' behavior will conflict with " +
                    "toggling."
                );
            }
            
            if (me.href) {
                Ext.log.warn(
                    "According to WAI-ARIA 1.0 Authoring guide " +
                    "(http://www.w3.org/TR/wai-aria-practices/#menubutton), " +
                    "menu button '" + me.id + "' cannot behave as a link."
                );
            }
            
            if (me.handler || me.hasListeners.hasOwnProperty('click')) {
                Ext.log.warn(
                    "According to WAI-ARIA 1.0 Authoring guide " +
                    "(http://www.w3.org/TR/wai-aria-practices/#menubutton), " +
                    "menu button '" + me.id + "' should display the menu " +
                    "on SPACE and ENTER keys, which will conflict with the " +
                    "button handler."
                );
            }
        }
        //</debug>
        
        // Ensure no selection happens
        me.addCls(Ext.baseCSSPrefix + 'unselectable');

        me.callParent();

        if (me.menu) {
            // Flag that we'll have a splitCls
            me.split = true;
            me.setMenu(me.menu, /*destroyMenu*/false, true);
        }

        // Accept url as a synonym for href
        if (me.url) {
            me.href = me.url;
        }

        // preventDefault defaults to false for links
        me.configuredWithPreventDefault = me.hasOwnProperty('preventDefault');
        if (me.href && !me.configuredWithPreventDefault) {
            me.preventDefault = false;
        }

        if (Ext.isString(me.toggleGroup) && me.toggleGroup !== '') {
            me.enableToggle = true;
        }

        if (me.html && !me.text) {
            me.text = me.html;
            delete me.html;
        }
    },

    getElConfig: function() {
        var me = this,
            config = me.callParent(),
            href = me.getHref(),
            hrefTarget = me.hrefTarget;

        if (config.tag === 'a') {
            if (!me.disabled) {
                config.tabIndex = me.tabIndex;
            }
            if (href) {
                // https://sencha.jira.com/browse/EXTJS-11964
                // Disabled links are clickable on iPad, and right clickable on desktop browsers.
                // The only way to completely disable navigation is removing the href
                if (!me.disabled) {
                    config.href = href;
                    if (hrefTarget) {
                       config.target = hrefTarget;
                    }
                }   
            }
        }
        
        if (!me.ariaStaticRoles[me.ariaRole]) {
            // Split buttons render aria-haspopup into arrowEl
            if (me.menu && !me.isSplitButton) {
                config['aria-haspopup'] = true;
            }
            
            if (me.enableToggle) {
                config['aria-pressed'] = !!me.pressed;
            }
        }
        
        return config;
    },

    beforeRender: function() {
        this.callParent();

        if (this.pressed) {
            this.addCls(this._pressedCls);
        }
    },

    initRenderData: function () {
        return Ext.apply(this.callParent(), this.getTemplateArgs());
    },

    /**
     * Get the {@link #cfg-menu} for this button.
     * @return {Ext.menu.Menu} The menu. `null` if no menu is configured.
     */
    getMenu: function() {
        return this.menu || null;
    },

    /**
     * Sets a new menu for this button. Pass a falsy value to unset the current menu.
     * To destroy the previous menu for this button, explicitly pass `false` as the second argument. If this is not set, the destroy will depend on the
     * value of {@link #cfg-destroyMenu}.
     *
     * @param {Ext.menu.Menu/String/Object/null} menu Accepts a menu component, a menu id or a menu config.
     * @param {Boolean} destroyMenu By default, will destroy the previous set menu and remove it from the menu manager. Pass `false` to prevent the destroy.
     */
    setMenu: function (menu, destroyMenu, /* private */ initial) {
        var me = this,
            oldMenu = me.menu,
            ariaDom = me.isSplitButton ? me.arrowEl && me.arrowEl.dom : me.ariaEl.dom,
            instanced, ariaAttr;

        if (oldMenu && !initial) {
            if (destroyMenu !== false && me.destroyMenu) {
                oldMenu.destroy();
            }
            oldMenu.ownerCmp = null;
        }

        if (menu) {
            instanced = menu.isMenu;
            // Retrieve menu by id or instantiate instance if needed.
            menu = Ext.menu.Manager.get(menu, {
                // Use ownerCmp as the upward link. Menus *must have no ownerCt* - they are global floaters.
                // Upward navigation is done using the up() method.
                ownerCmp: me
            });
            // We need to forcibly set this here because we could be passed an existing menu, which means
            // the config above won't get applied during creation.
            menu.setOwnerCmp(me, instanced);

            // Menu can't reshow within 250ms of being hidden.
            // Likewise, must set here in case an instantiated Menu is passed.
            // This is so that clicking on this button when the menu is visible
            // leaves the menu hidden. Mousedown hides it, and the click caused by
            // mouseup should not reshow.
            menu.menuClickBuffer = 250;

            me.mon(menu, {
                scope: me,
                show: me.onMenuShow,
                hide: me.onMenuHide
            });

            // If the button wasn't initially configured with a menu or has previously been unset then we need
            // to poke the split classes onto the btnWrap dom element.
            if (!oldMenu && me.getArrowVisible()) {
                me.split = true;
                if (me.rendered) {
                    me._addSplitCls();
                    me.updateLayout();
                }
            }

            me.menu = menu;
            
            // May not be rendered yet
            if (ariaDom) {
                ariaDom.setAttribute('aria-haspopup', true);
                ariaDom.setAttribute('aria-owns', menu.id);
            }
            else {
                // We use me.isSplitButton here because me.split can be set to true
                // for ordinary menu buttons. We only render arrowEl for the true Split buttons.
                ariaAttr = me.isSplitButton ? (me.ariaArrowElAttributes || (me.ariaArrowElAttributes = {}))
                         :                    (me.ariaRenderAttributes  || (me.ariaRenderAttributes = {}))
                         ;
                
                ariaAttr['aria-haspopup'] = true;
                ariaAttr['aria-owns'] = menu.id;
            }
        }
        else {
            if (me.rendered) {
                ariaDom.removeAttribute('aria-haspopup');
                ariaDom.removeAttribute('aria-owns');
                me._removeSplitCls();
                me.updateLayout();
            }
            else {
                ariaAttr = me.isSplitButton ? me.ariaArrowElAttributes : me.ariaRenderAttributes;
                
                if (ariaAttr) {
                    delete ariaAttr['aria-haspopup'];
                    delete ariaAttr['aria-owns'];
                }
            }

            me.split = false;
            me.menu = null;
        }
    },

    /**
     * @private
     */
    onRender: function() {
        var me = this,
            addOnclick,
            btn,
            btnListeners;

        me.callParent(arguments);

        // Set btn as a local variable for easy access
        btn = me.el;

        if (me.tooltip) {
            me.setTooltip(me.tooltip, true);
        }

        // Add the mouse events to the button
        if (me.handleMouseEvents) {
            btnListeners = {
                scope: me,
                mouseover: me.onMouseOver,
                mouseout: me.onMouseOut,
                mousedown: me.onMouseDown
            };
            if (me.split) {
                btnListeners.mousemove = me.onMouseMove;
            }
        } else {
            btnListeners = {
                scope: me
            };
        }

        // Touch start events must be preventDefaulted when in disabled state
        if (Ext.supports.Touch) {
            btnListeners.touchstart = me.onTouchStart;
        }

        // Check if it is a repeat button
        if (me.repeat) {
            me.mon(new Ext.util.ClickRepeater(btn, Ext.isObject(me.repeat) ? me.repeat: {}), 'click', me.onRepeatClick, me);
        } else {

            // If the activation event already has a handler, make a note to add the handler later
            if (btnListeners[me.clickEvent]) {
                addOnclick = true;
            } else {
                btnListeners[me.clickEvent] = me.onClick;
            }
        }

        // Add whatever button listeners we need
        me.mon(btn, btnListeners);

        if (me.hasFrameTable()) {
            me.mon(me.frameTable, 'click', me.frameTableListener, me);
        }

        // If the listeners object had an entry for our clickEvent, add a listener now
        if (addOnclick) {
            me.mon(btn, me.clickEvent, me.onClick, me);
        }

        Ext.button.Manager.register(me);
    },

    onFocusLeave: function(e) {
        this.callParent([e]);
        if (this.menu) {
            this.menu.hide();
        }
    },

    /**
     * This method returns an object which provides substitution parameters for the {@link #renderTpl XTemplate} used to
     * create this Button's DOM structure.
     *
     * Instances or subclasses which use a different Template to create a different DOM structure may need to provide
     * their own implementation of this method.
     * @protected
     *
     * @return {Object} Substitution data for a Template. The default implementation which provides data for the default
     * {@link #template} returns an Object containing the following properties:
     * @return {String} return.innerCls A CSS class to apply to the button's text element.
     * @return {String} return.splitCls A CSS class to determine the presence and position of an arrow icon.
     * (`'x-btn-arrow'` or `'x-btn-arrow-bottom'` or `''`)
     * @return {String} return.iconUrl The url for the button icon.
     * @return {String} return.iconCls The CSS class for the button icon.
     * @return {String} return.glyph The glyph to use as the button icon.
     * @return {String} return.glyphCls The CSS class to use for the glyph element.
     * @return {String} return.glyphFontFamily The CSS font-family to use for the glyph element.
     * @return {String} return.text The {@link #text} to display ion the Button.
     */
    getTemplateArgs: function() {
        var me = this,
            btnCls = me._btnCls,
            baseIconCls = me._baseIconCls,
            iconAlign = me.getIconAlign(),
            glyph = me.glyph,
            glyphFontFamily = Ext._glyphFontFamily,
            text = me.text,
            hasIcon = me._hasIcon(),
            hasIconCls = me._hasIconCls,
            glyphParts;

        if (typeof glyph === 'string') {
            glyphParts = glyph.split('@');
            glyph = glyphParts[0];
            glyphFontFamily = glyphParts[1];
        }

        return {
            split: me.isSplitButton,
            innerCls: me._innerCls,
            splitCls: me.getArrowVisible() ? me.getSplitCls() : '',
            iconUrl: me.icon,
            iconCls: me.iconCls,
            glyph: glyph,
            glyphCls: glyph ? me._glyphCls : '',
            glyphFontFamily: glyphFontFamily,
            text: text || '&#160;',
            closeText: me.closeText,
            textCls: text ? me._textCls : '',
            noTextCls: text ? '' : me._noTextCls,
            hasIconCls: hasIcon ? hasIconCls : '',
            btnWrapCls: me._btnWrapCls,
            btnWrapStyle: me.width ? 'table-layout:fixed;' : '',
            btnElStyle: me.height ? 'height:auto;' : '',
            btnCls: btnCls,
            baseIconCls: baseIconCls,
            iconBeforeText: iconAlign === 'left' || iconAlign === 'top',
            iconAlignCls: hasIcon ? (hasIconCls + '-' + iconAlign) : '',
            textAlignCls: btnCls + '-' + me.getTextAlign(),
            arrowElCls: me._arrowElCls,
            tabIndex: me.tabIndex
        };
    },

    renderIcon: function(values) {
        return this.getTpl('iconTpl').apply(values);
    },

    /**
     * Sets the href of the embedded anchor element to the passed URL.
     *
     * Also appends any configured {@link #cfg-baseParams} and parameters set through {@link #setParams}.
     * @param {String} href The URL to set in the anchor element.
     *
     */
    setHref: function(href) {
        var me = this,
            hrefTarget = me.hrefTarget,
            dom;

        me.href = href;

        if (!me.configuredWithPreventDefault) {
            me.preventDefault = !href;
        }

        if (me.rendered) {
            dom = me.el.dom;
            // https://sencha.jira.com/browse/EXTJS-11964
            // Disabled links are clickable on iPad, and right clickable on desktop browsers.
            // The only way to completely disable navigation is removing the href
            if (!href || me.disabled) {
                dom.removeAttribute('href');
                dom.removeAttribute('hrefTarget');
            } else {
                dom.href = me.getHref();
                if (hrefTarget) {
                    dom.target = hrefTarget;
                }
            }
        }
    },

    /**
     * @private
     * If there is a configured href for this Button, returns the href with parameters appended.
     * @return {String/Boolean} The href string with parameters appended.
     */
    getHref: function() {
        var me = this,
            href = me.href;

        return href ? Ext.urlAppend(href, Ext.Object.toQueryString(Ext.apply({}, me.params, me.baseParams))) : false;
    },

    /**
     * Sets the href of the link dynamically according to the params passed, and any {@link #baseParams} configured.
     *
     *     var button = Ext.create('Ext.button.Button', {
     *         renderTo   : document.body,
     *         text       : 'Open',
     *         href       : 'http://www.sencha.com',
     *         baseParams : {
     *             foo : 'bar'
     *         }
     *     });
     *
     *     button.setParams({
     *         company : 'Sencha'
     *     });
     *
     * When clicked, this button will open a new window with the url http://www.sencha.com/?foo=bar&company=Sencha because
     * the button was configured with the {@link #baseParams} to have `foo` = `'bar'` 
     * and then used {@link #setParams} to set the `company` parameter to `'Sencha'`.
     *
     * **Only valid if the Button was originally configured with a {@link #href}**
     *
     * @param {Object} params Parameters to use in the href URL.
     */
    setParams: function(params) {
        var me = this,
            dom;

        me.params = params;

        // https://sencha.jira.com/browse/EXTJS-11964
        // Disabled links are clickable on iPad, and right clickable on desktop browsers.
        // The only way to completely disable navigation is removing the href
        if (me.rendered) {
            dom = me.el.dom;
            if (me.disabled) {
                dom.removeAttribute('href');
            } else {
                dom.href = me.getHref() || '';
            }
        }
    },

    getSplitCls: function() {
        var me = this;
        return me.split ? (me.baseCls + '-' + me.arrowCls) + ' ' + (me.baseCls + '-' + me.arrowCls + '-' + me.arrowAlign) : '';
    },

    /**
     * Sets the background image (inline style) of the button. This method also changes the value of the {@link #icon}
     * config internally.
     * @param {String} icon The path to an image to display in the button
     * @return {Ext.button.Button} this
     */
    setIcon: function(icon) {
        icon = icon || '';
        var me = this,
            btnIconEl = me.btnIconEl,
            oldIcon = me.icon || '';

        me.icon = icon;
        if (icon !== oldIcon) {
            if (btnIconEl) {
                btnIconEl.setStyle('background-image', icon ? 'url(' + icon + ')': '');
                me._syncHasIconCls();
                if (me.didIconStateChange(oldIcon, icon)) {
                    me.updateLayout();
                }
            }
            me.fireEvent('iconchange', me, oldIcon, icon);
        }
        return me;
    },

    /**
     * Sets the CSS class that provides a background image to use as the button's icon. This method also changes the
     * value of the {@link #iconCls} config internally.
     * @param {String} cls The CSS class providing the icon image
     * @return {Ext.button.Button} this
     */
    setIconCls: function(cls) {
        cls = cls || '';
        var me = this,
            btnIconEl = me.btnIconEl,
            oldCls = me.iconCls || '';

        me.iconCls = cls;
        if (oldCls !== cls) {
            if (btnIconEl) {
                // Remove the previous iconCls from the button
                btnIconEl.removeCls(oldCls);
                btnIconEl.addCls(cls);
                me._syncHasIconCls();
                if (me.didIconStateChange(oldCls, cls)) {
                    me.updateLayout();
                }
            }
            me.fireEvent('iconchange', me, oldCls, cls);
        }
        return me;
    },

    /**
     * Sets this button's glyph
     * @param {Number/String} glyph the numeric charCode or string charCode/font-family.
     * This parameter expects a format consistent with that of {@link #glyph}
     * @return {Ext.button.Button} this
     */
    setGlyph: function(glyph) {
        glyph = glyph || 0;
        var me = this,
            btnIconEl = me.btnIconEl,
            oldGlyph = me.glyph,
            glyphCls = me._glyphCls,
            fontFamily, glyphParts;

        me.glyph = glyph;

        if (btnIconEl) {
            if (typeof glyph === 'string') {
                glyphParts = glyph.split('@');
                glyph = glyphParts[0];
                fontFamily = glyphParts[1] || Ext._glyphFontFamily;
            }

            if (!glyph) {
                btnIconEl.dom.innerHTML = '';
                btnIconEl.removeCls(glyphCls);
            } else if (oldGlyph !== glyph) {
                btnIconEl.dom.innerHTML = '&#' + glyph + ';';
                btnIconEl.addCls(glyphCls);
            }

            if (fontFamily) {
                btnIconEl.setStyle('font-family', fontFamily);
            }
            me._syncHasIconCls();
            if (me.didIconStateChange(oldGlyph, glyph)) {
                me.updateLayout();
            }
        }

        me.fireEvent('glyphchange', me, me.glyph, oldGlyph);

        return me;
    },

    /**
     * Sets the tooltip for this Button.
     *
     * @param {String/Object} tooltip This may be:
     *
     *   - **String** : A string to be used as innerHTML (html tags are accepted) to show in a tooltip
     *   - **Object** : A configuration object for {@link Ext.tip.QuickTipManager#register}.
     *
     * @return {Ext.button.Button} this
     */
    setTooltip: function(tooltip, initial) {
        var me = this;

        if (me.rendered) {
            if (!initial || !tooltip) {
                me.clearTip();
            }
            if (tooltip) {
                if (Ext.quickTipsActive && Ext.isObject(tooltip)) {
                    Ext.tip.QuickTipManager.register(Ext.apply({
                        target: me.el.id
                    },
                    tooltip));
                    me.tooltip = tooltip;
                } else {
                    me.el.dom.setAttribute(me.getTipAttr(), tooltip);
                }
            }
        } else {
            me.tooltip = tooltip;
        }
        return me;
    },

    updateIconAlign: function(align, oldAlign) {
        var me = this,
            btnEl, btnIconEl, hasIconCls;

        if (me.rendered) {
            btnEl = me.btnEl;
            btnIconEl = me.btnIconEl;
            hasIconCls = me._hasIconCls;

            if (oldAlign) {
                btnEl.removeCls(hasIconCls + '-' + oldAlign);
            }
            btnEl.addCls(hasIconCls + '-' + align);

            // move the iconWrap to the correct position in the dom - before the btnInnerEl
            // for top/left alignments, and after the btnInnerEl for right/bottom
            if (align === 'top' || align === 'left') {
                btnEl.insertFirst(btnIconEl);
            } else {
                btnEl.appendChild(btnIconEl);
            }
            me.updateLayout();
        }
    },

    updateTextAlign: function(align, oldAlign) {
        var me = this,
            btnEl = me.btnEl,
            btnCls = me._btnCls;

        if (me.rendered) {
            btnEl.removeCls(btnCls + '-' + oldAlign);
            btnEl.addCls(btnCls + '-' + align);
        }
    },

    getTipAttr: function(){
        return this.tooltipType === 'qtip' ? 'data-qtip' : 'title';
    },

    /**
     * @private
     */
    getRefItems: function(deep){
        var menu = this.menu,
            items;

        if (menu) {
            items = menu.getRefItems(deep);
            items.unshift(menu);
        }
        return items || [];
    },

    /**
     * @private
     */
    clearTip: function() {
        var me = this,
            el = me.el;

        if (Ext.quickTipsActive && Ext.isObject(me.tooltip)) {
            Ext.tip.QuickTipManager.unregister(el);
        } else {
            el.dom.removeAttribute(me.getTipAttr());
        }
    },

    /**
     * @private
     */
    beforeDestroy: function() {
        var me = this;

        if (me.rendered) {
            me.clearTip();
        }

        Ext.destroy(me.repeater);
        me.callParent();
    },

    /**
     * @private
     */
    onDestroy: function() {
        var me = this,
            menu = me.menu;

        if (me.rendered) {
            Ext.destroy(me.keyMap);
            delete me.keyMap;
        }

        if (menu && me.destroyMenu) {
            me.menu = Ext.destroy(menu);
        }

        Ext.button.Manager.unregister(me);
        me.callParent();
    },

    /**
     * Assigns this Button's click handler
     * @param {Function} handler The function to call when the button is clicked
     * @param {Object} [scope] The scope (`this` reference) in which the handler function is executed.
     * Defaults to this Button.
     * @return {Ext.button.Button} this
     */
    setHandler: function(handler, scope) {
        this.handler = handler;
        if (arguments.length > 1) {
            this.scope = scope;
        }
        return this;
    },

    updateText: function(text, oldText) {
        // Coerce to string. Maybe set to a numeric value.
        text = text == null ? '' : String(text);
        oldText = oldText || '';

        var me = this,
            btnInnerEl = me.btnInnerEl,
            btnEl = me.btnEl;

        if (me.rendered) {
            btnInnerEl.setHtml(text || '&#160;');
            btnEl[text ? 'addCls' : 'removeCls'](me._textCls);
            btnEl[text ? 'removeCls' : 'addCls'](me._noTextCls);
            me.updateLayout();
        }
        me.fireEvent('textchange', me, oldText, text);
    },

    /**
     * Checks if the icon/iconCls changed from being empty to having a value, or having a value to being empty.
     * @private
     * @param {String} old The old icon/iconCls
     * @param {String} current The current icon/iconCls
     * @return {Boolean} True if the icon state changed
     */
    didIconStateChange: function(old, current) {
        var currentEmpty = Ext.isEmpty(current);
        return Ext.isEmpty(old) ? !currentEmpty : currentEmpty;
    },
    
    /**
     * Programmatically activate the button.
     *
     * @param {Ext.event.Event} [e] Optional event to process.
     */
    click: function(e) {
        return this.onClick(e);
    },

    /**
     * Sets the `pressed` state of this button.
     * @param {Boolean} [pressed=true] Pass `false` to clear the `pressed` state.
     * @return {Ext.button.Button} this
     */
    setPressed: function (pressed) {
        return this.toggle(pressed !== false);
    },

    /**
     * If a state it passed, it becomes the pressed state otherwise the current state is toggled.
     * @param {Boolean} [state] Force a particular state
     * @param {Boolean} [suppressEvent=false] True to stop events being fired when calling this method.
     * @return {Ext.button.Button} this
     */
    toggle: function(state, suppressEvent) {
        var me = this,
            ariaDom = me.ariaEl.dom;

        state = state === undefined ? !me.pressed: !!state;

        // Allow toggle to be vetoed in case a toggle group needs to enforce a mimimum pressed state
        if (me.fireEvent('beforetoggle', me, state) !== false) {


            if (state !== me.pressed) {
                me[state ? 'addCls': 'removeCls'](me._pressedCls);
                me.pressed = state;

                if (ariaDom) {
                    ariaDom.setAttribute('aria-pressed', state);
                }

                if (!suppressEvent) {
                    me.fireEvent('toggle', me, state);
                    Ext.callback(me.toggleHandler, me.scope, [me, state], 0, me);

                    if (me.reference && me.publishState) {
                        me.publishState('pressed', state);
                    }
                }
            }
        }
        return me;
    },

    maybeShowMenu: function(e) {
        if (this.menu) {
            this.showMenu(e);
        }
    },

    /**
     * Shows this button's menu (if it has one)
     */
    showMenu: function(/* private */ clickEvent) {
        var me = this,
            menu = me.menu,
            isPointerEvent = !clickEvent || clickEvent.pointerType;

        if (menu && me.rendered) {
            if (me.tooltip && Ext.quickTipsActive && me.getTipAttr() !== 'title') {
                Ext.tip.QuickTipManager.getQuickTip().cancelShow(me.el);
            }
            if (menu.isVisible()) {
                // Click/tap toggles the menu visibility.
                if (isPointerEvent) {
                    menu.hide();
                }
                else {
                    menu.focus();
                }
            }
            else if (!clickEvent || me.showEmptyMenu || menu.items.getCount() > 0) {
                // Pointer-invoked menus do not auto focus, key invoked ones do.
                // Note that this behavior is inconsistent with WAI-ARIA specification
                // requirements, per which only Down Arrow key should activate the menu;
                // pressing Space or Enter key should open the menu but not focus it.
                // However no other accessible framework implements it that way;
                // both Dojo and YUI will activate the menu on either Space, Enter, or
                // Down Arrow keys. Furthermore, testing with JAWS screen reader
                // proved that this non-standard behavior is in fact expected since
                // JAWS will announce a menu button as follows: <name> button menu,
                // Press Space to activate the menu then navigate with arrow keys.
                // So without further ado we choose to keep the existing historical
                // Ext JS behavior which, by coincidence, happens to be congruent
                // with the industry standard. :)
                menu.autoFocus = !isPointerEvent;
                menu.showBy(me.el, me.menuAlign);
            }
        }
        
        return me;
    },

    /**
     * Hides this button's menu (if it has one)
     */
    hideMenu: function() {
        if (this.hasVisibleMenu()) {
            this.menu.hide();
        }
        return this;
    },

    /**
     * Returns true if the button has a menu and it is visible
     * @return {Boolean}
     */
    hasVisibleMenu: function() {
        var menu = this.menu;
        return menu && menu.rendered && menu.isVisible();
    },

    /**
     * @private
     */
    onRepeatClick: function(repeat, e) {
        this.onClick(e);
    },

    onTouchStart: function(e) {
        this.doPreventDefault(e);
    },
    
    /**
     * @private
     */
    onEnterKey: function(e) {
        this.onClick(e);
        
        // Buttons always intercept Space and Enter keys
        e.stopEvent();
        
        return false;
    },

    /**
     * @private
     */
    onClick: function(e) {
        var me = this;
        me.doPreventDefault(e);

        // Can be triggered by ENTER or SPACE keydown events which set the button property.
        // Only veto event handling if it's a mouse event with an alternative button.
        // Checking e.button for a truthy value (instead of != 0) also allows touch events
        // (tap) to continue, as they do not have a button property defined.
        if (e.type !== 'keydown' && e.button) {
            return;
        }
        if (!me.disabled) {
            me.doToggle();
            me.maybeShowMenu(e);
            me.fireHandler(e);
        }
    },

    doPreventDefault: function(e) {
        if (e && (this.preventDefault || (this.disabled && this.getHref()))) {
            e.preventDefault();
        }
    },

    fireHandler: function(e) {
        var me = this;

        // Click may have destroyed the button
        if (me.fireEvent('click', me, e) !== false && !me.destroyed) {
            Ext.callback(me.handler, me.scope, [me, e], 0, me);
        }
    },

    doToggle: function() {
        var me = this;
        if (me.enableToggle && (me.allowDepress !== false || !me.pressed)) {
            me.toggle();
        }
    },

    /**
     * @private
     * mouseover handler called when a mouseover event occurs anywhere within the encapsulating element.
     * The targets are interrogated to see what is being entered from where.
     * @param e
     */
    onMouseOver: function(e) {
        var me = this;
        if (!me.disabled && !e.within(me.el, true, true)) {
            me.onMouseEnter(e);
        }
    },

    /**
     * @private
     * mouseout handler called when a mouseout event occurs anywhere within the encapsulating element -
     * or the mouse leaves the encapsulating element.
     * The targets are interrogated to see what is being exited to where.
     * @param e
     */
    onMouseOut: function(e) {
        var me = this;
        if (!e.within(me.el, true, true)) {
            if (me.overMenuTrigger) {
                me.onMenuTriggerOut(e);
            }
            me.onMouseLeave(e);
        }
    },

    /**
     * @private
     * mousemove handler called when the mouse moves anywhere within the encapsulating element.
     * The position is checked to determine if the mouse is entering or leaving the trigger area. Using
     * mousemove to check this is more resource intensive than we'd like, but it is necessary because
     * the trigger area does not line up exactly with sub-elements so we don't always get mouseover/out
     * events when needed. In the future we should consider making the trigger a separate element that
     * is absolutely positioned and sized over the trigger area.
     */
    onMouseMove: function(e) {
        var me = this,
            over = me.overMenuTrigger;

        if (me.split) {
            if (me.isWithinTrigger(e)) {
                if (!over) {
                    me.onMenuTriggerOver(e);
                }
            } else if (over) {
                me.onMenuTriggerOut(e);
            }
        }
    },

    /**
     * @protected
     * Returns true if the passed event's x/y coordinates are within the trigger region
     * @param {Ext.event.Event} e
     */
    isWithinTrigger: function(e) {
        var me = this,
            el = me.el,
            overPosition, triggerRegion;

        overPosition = (me.arrowAlign === 'right') ?  e.getX() - me.getX() : e.getY() - el.getY();
        triggerRegion = me.getTriggerRegion();
        return overPosition > triggerRegion.begin && overPosition < triggerRegion.end;
    },

    /**
     * @private
     * Returns an object containing `begin` and `end` properties that indicate the
     * left/right bounds of a right trigger or the top/bottom bounds of a bottom trigger.
     * @return {Object}
     */
    getTriggerRegion: function() {
        var me = this,
            region = me._triggerRegion,
            isRight = me.arrowAlign === 'right',
            getEnd = isRight ? 'getRight' : 'getBottom',
            btnSize = isRight ? me.getWidth() : me.getHeight();

        region.begin = btnSize - (me.el[getEnd]() - me.btnEl[getEnd]());
        region.end = btnSize;
        return region;
    },

    /**
     * @private
     * virtual mouseenter handler called when it is detected that the mouseout event
     * signified the mouse entering the encapsulating element.
     * @param e
     */
    onMouseEnter: function(e) {
        // overCls is handled by Component
        this.fireEvent('mouseover', this, e);
    },

    /**
     * @private
     * virtual mouseleave handler called when it is detected that the mouseover event
     * signified the mouse entering the encapsulating element.
     * @param e
     */
    onMouseLeave: function(e) {
        // overCls is handled by Component
        this.fireEvent('mouseout', this, e);
    },

    /**
     * @private
     * virtual mouseenter handler called when it is detected that the mouseover event
     * signified the mouse entering the arrow area of the button - the `<em>`.
     * @param e
     */
    onMenuTriggerOver: function(e) {
        var me = this,
            arrowTip = me.arrowTooltip;

        me.overMenuTrigger = true;
        // We don't have a hoverable arrow element, so we only add the tip attribute if
        // we're over that part of the button
        if (me.split && arrowTip) {
            me.btnWrap.dom.setAttribute(me.getTipAttr(), arrowTip);
        }
        
        me.fireEvent('menutriggerover', me, me.menu, e);
    },

    /**
     * @private
     * virtual mouseleave handler called when it is detected that the mouseout event
     * signified the mouse leaving the arrow area of the button - the `<em>`.
     * @param e
     */
    onMenuTriggerOut: function(e) {
        var me = this;
        
        delete me.overMenuTrigger;
        // See onMenuTriggerOver
        if (me.split && me.arrowTooltip) {
            me.btnWrap.dom.setAttribute(me.getTipAttr(), '');
        }
        
        me.fireEvent('menutriggerout', me, me.menu, e);
    },

    onEnable: function() {
        var me = this,
            href = me.href,
            hrefTarget = me.hrefTarget,
            dom = me.el.dom;

        me.callParent();

        me.removeCls(me._disabledCls);
        dom.setAttribute('tabIndex', me.tabIndex);

        // https://sencha.jira.com/browse/EXTJS-11964
        // Disabled links are clickable on iPad, and right clickable on desktop browsers.
        // The only way to completely disable navigation is removing the href
        if (href) {
            dom.href = href;
        }
        if (hrefTarget) {
            dom.target = hrefTarget;
        }
    },

    onDisable: function() {
        var me = this,
            dom = me.el.dom;

        me.callParent();

        me.addCls(me._disabledCls);
        me.removeCls(me.overCls);

        dom.removeAttribute('tabIndex');

        // https://sencha.jira.com/browse/EXTJS-11964
        // Disabled links are clickable on iPad, and right clickable on desktop browsers.
        // The only way to completely disable navigation is clearing the href
        if (me.href) {
            dom.removeAttribute('href');
        }
        if (me.hrefTarget) {
            dom.removeAttribute('target');
        }
    },

    /**
     * Method to change the scale of the button. See {@link #scale} for allowed configurations.
     * @param {String} scale The scale to change to.
     */
    setScale: function(scale) {
        var me = this,
            ui = me.ui.replace('-' + me.scale, '');

        //check if it is an allowed scale
        if (!Ext.Array.contains(me.allowedScales, scale)) {
            throw('#setScale: scale must be an allowed scale (' + me.allowedScales.join(', ') + ')');
        }

        me.scale = scale;
        me.setUI(ui);
    },

    setUI: function(ui) {
        var me = this;

        //we need to append the scale to the UI, if not already done
        if (me.scale && !ui.match(me.scale)) {
            ui = ui + '-' + me.scale;
        }

        me.callParent([ui]);
    },

    /**
     * @private
     */
    onMouseDown: function(e) {
        var me = this;

        if (Ext.isIE || e.pointerType === 'touch') {
            // In IE the use of unselectable on the button's elements causes the element
            // to not receive focus, even when it is directly clicked.
            // On Touch devices, we need to explicitly focus on touchstart.
            Ext.defer(function() {
                var focusEl = me.getFocusEl();
                // Deferred to give other mousedown handlers the chance to preventDefault
                if (focusEl && !e.defaultPrevented) {
                    focusEl.focus();
                }
            }, 1);
        }

        if (!me.disabled && e.button === 0) {
            Ext.button.Manager.onButtonMousedown(me, e);
            me.addCls(me._pressedCls);
        }
    },

    /**
     * @private
     */
    onMouseUp: function(e) {
        var me = this;

        // If the external mouseup listener of the ButtonManager fires after the button has been destroyed, ignore.
        if (!me.destroyed && e.button === 0) {
            if (!me.pressed) {
                me.removeCls(me._pressedCls);
            }
        }
    },

    /**
     * @private
     */
    onMenuShow: function() {
        var me = this;
        me.addCls(me._menuActiveCls);
        me.fireEvent('menushow', me, me.menu);
    },

    /**
     * @private
     */
    onMenuHide: function(e) {
        var me = this;

        me.removeCls(me._menuActiveCls);
        me.fireEvent('menuhide', me, me.menu);
    },

    /**
     * @private
     */
    onDownKey: function(e) {
        var me = this;

        if (me.menu && !me.disabled) {
            me.showMenu(e);
            e.stopEvent();
            return false;
        }
    },

    updateArrowVisible: function(visible) {
        var me = this;

        if (me.rendered) {
            if (visible) {
                if (me.menu || me.isSplitButton) {
                    me.split = true;
                    me._addSplitCls();
                }
            } else {
                me._removeSplitCls();
                me.split = false;
            }
        }

        return visible;
    },

    privates: {
        addOverCls: function() {
            if (!this.disabled) {
                this.addCls(this.overCls);
            }
        },

        _addSplitCls: function() {
            var me = this;

            me.btnWrap.addCls(me.getSplitCls());
        },

        /**
         * @private
         * Needed for when widget is rendered into a grid cell. The class to add to the cell element.
         * Override needed to add scale to the mix which is part of the ui name in the 
         * mixin and the CSS rule.
         */
        getTdCls: function() {
            return Ext.baseCSSPrefix + 'button-' + this.ui + '-' + this.scale + '-cell';
        },

        removeOverCls: function() {
            this.removeCls(this.overCls);
        },

        _removeSplitCls: function() {
            var me = this;

            me.btnWrap.removeCls(me.getSplitCls());
        },

        _syncHasIconCls: function() {
            var me = this,
                btnEl = me.btnEl,
                hasIconCls = me._hasIconCls;

            if (btnEl) {
                btnEl[me._hasIcon() ? 'addCls' : 'removeCls']([
                    hasIconCls,
                    hasIconCls + '-' + me.iconAlign
                ]);
            }
        },

        /**
         * Returns true if this button has an icon (either icon, iconCls, or glyph)
         * @return {Boolean}
         * @private
         */
        _hasIcon: function() {
            return !!(this.icon || this.iconCls || this.glyph);
        },

        wrapPrimaryEl: function(dom) {
            this.el = new Ext.dom.ButtonElement(dom);
            this.callParent([dom]);
        }
    }
});
