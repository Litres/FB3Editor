/**
 * Panel is a container that has specific functionality and structural components that make it the perfect building
 * block for application-oriented user interfaces.
 *
 * Panels are, by virtue of their inheritance from {@link Ext.container.Container}, capable of being configured with a
 * {@link Ext.container.Container#layout layout}, and containing child Components.
 *
 * When either specifying child {@link #cfg-items} of a Panel, or dynamically {@link Ext.container.Container#method-add adding}
 * Components to a Panel, remember to consider how you wish the Panel to arrange those child elements, and whether those
 * child elements need to be sized using one of Ext's built-in `{@link Ext.container.Container#layout layout}`
 * schemes. By default, Panels use the {@link Ext.layout.container.Auto Auto} scheme. This simply renders child
 * components, appending them one after the other inside the Container, and **does not apply any sizing** at all.
 *
 * {@img Ext.panel.Panel/panel.png Panel components}
 *
 * A Panel may also contain {@link #bbar bottom} and {@link #tbar top} toolbars, along with separate {@link
 * Ext.panel.Header header}, {@link #fbar footer} and body sections.
 *
 * Panel also provides built-in {@link #collapsible collapsible, expandable} and {@link #closable} behavior. Panels can
 * be easily dropped into any {@link Ext.container.Container Container} or layout, and the layout and rendering pipeline
 * is {@link Ext.container.Container#method-add completely managed by the framework}.
 *
 * **Note:** By default, the `{@link #closable close}` header tool _destroys_ the Panel resulting in removal of the
 * Panel and the destruction of any descendant Components. This makes the Panel object, and all its descendants
 * **unusable**. To enable the close tool to simply _hide_ a Panel for later re-use, configure the Panel with
 * `{@link #closeAction closeAction}: 'hide'`.
 *
 * Usually, Panels are used as constituents within an application, in which case, they would be used as child items of
 * Containers, and would themselves use Ext.Components as child {@link #cfg-items}. However to illustrate simply rendering a
 * Panel into the document, here's how to do it:
 *
 *     @example
 *     Ext.create('Ext.panel.Panel', {
 *         title: 'Hello',
 *         width: 200,
 *         html: '<p>World!</p>',
 *         renderTo: Ext.getBody()
 *     });
 *
 * A more realistic scenario is a Panel created to house input fields which will not be rendered, but used as a
 * constituent part of a Container:
 *
 *     @example
 *     var filterPanel = Ext.create('Ext.panel.Panel', {
 *         bodyPadding: 5,  // Don't want content to crunch against the borders
 *         width: 300,
 *         title: 'Filters',
 *         items: [{
 *             xtype: 'datefield',
 *             fieldLabel: 'Start date'
 *         }, {
 *             xtype: 'datefield',
 *             fieldLabel: 'End date'
 *         }],
 *         renderTo: Ext.getBody()
 *     });
 *
 * Note that the Panel above is configured to render into the document and assigned a size. In a real world scenario,
 * the Panel will often be added inside a Container which will use a {@link #layout} to render, size and position its
 * child Components.
 *
 * Panels will often use specific {@link #layout}s to provide an application with shape and structure by containing and
 * arranging child Components:
 *
 *     @example
 *     var resultsPanel = Ext.create('Ext.panel.Panel', {
 *         title: 'Results',
 *         width: 600,
 *         height: 400,
 *         renderTo: Ext.getBody(),
 *         layout: {
 *             type: 'vbox',       // Arrange child items vertically
 *             align: 'stretch',    // Each takes up full width
 *             padding: 5
 *         },
 *         items: [{               // Results grid specified as a config object with an xtype of 'grid'
 *             xtype: 'grid',
 *             columns: [{header: 'Column One'}],            // One header just for show. There's no data,
 *             store: Ext.create('Ext.data.ArrayStore', {}), // A dummy empty data store
 *             flex: 1                                       // Use 1/3 of Container's height (hint to Box layout)
 *         }, {
 *             xtype: 'splitter'   // A splitter between the two child items
 *         }, {                    // Details Panel specified as a config object (no xtype defaults to 'panel').
 *             title: 'Details',
 *             bodyPadding: 5,
 *             items: [{
 *                 fieldLabel: 'Data item',
 *                 xtype: 'textfield'
 *             }], // An array of form fields
 *             flex: 2             // Use 2/3 of Container's height (hint to Box layout)
 *         }]
 *     });
 *
 * The example illustrates one possible method of displaying search results. The Panel contains a grid with the
 * resulting data arranged in rows. Each selected row may be displayed in detail in the Panel below. The {@link
 * Ext.layout.container.VBox vbox} layout is used to arrange the two vertically. It is configured to stretch child items
 * horizontally to full width. Child items may either be configured with a numeric height, or with a `flex` value to
 * distribute available space proportionately.
 *
 * This Panel itself may be a child item of, for example, a {@link Ext.tab.Panel} which 
 * will size its child items to fit within its content area.
 *
 * Using these techniques, as long as the **layout** is chosen and configured correctly, an application may have any
 * level of nested containment, all dynamically sized according to configuration, the user's preference and available
 * browser size.
 */
Ext.define('Ext.panel.Panel', {
    extend: 'Ext.container.Container',
    alias: 'widget.panel',
    alternateClassName: 'Ext.Panel',

    requires: [
        'Ext.panel.Header',
        'Ext.util.MixedCollection',
        'Ext.toolbar.Toolbar',
        'Ext.fx.Anim',
        'Ext.util.KeyMap',
        'Ext.panel.DD',
        'Ext.XTemplate',
        'Ext.layout.component.Dock',
        'Ext.util.Memento'
    ],

    mixins: {
        docking: 'Ext.container.DockingContainer'
    },

    childEls: [
        'body'
    ],

    renderTpl: [
        // headingEl can also be inserted in updateHeader
        '<tpl if="headingText">',
            '<div id="{id}-headingEl" data-ref="headingEl" role="heading"',
                ' class="', Ext.baseCSSPrefix, 'hidden-clip" style="height:0">',
                    '{headingText}',
            '</div>',
        '</tpl>',
        // If this Panel is framed, the framing template renders the docked items round the frame
        '{% this.renderDockedItems(out,values,0); %}',
        '<div id="{id}-body" data-ref="body" class="{baseCls}-body<tpl if="bodyCls"> {bodyCls}</tpl>',
            ' {baseCls}-body-{ui}<tpl if="uiCls">',
                '<tpl for="uiCls"> {parent.baseCls}-body-{parent.ui}-{.}</tpl>',
            '</tpl>{childElCls}"',
            '<tpl if="bodyAriaAttributes">',
                '<tpl foreach="bodyAriaAttributes"> {$}="{.}"</tpl>',
            '<tpl else>',
                ' role="presentation"',
            '</tpl>',
            '<tpl if="bodyStyle"> style="{bodyStyle}"</tpl>>',
            '{%this.renderContainer(out,values);%}',
        '</div>',
        '{% this.renderDockedItems(out,values,1); %}'
    ],

    // <editor-fold desc="Config">
    // ***********************************************************************************
    // Begin Config
    // ***********************************************************************************

    // For performance reasons we give the following configs their default values on
    // the class body.  This prevents the updaters from running on initialization in the
    // default configuration scenario
    headerPosition: 'top',
    iconAlign: 'left',
    titleAlign: 'left',
    titleRotation: 'default',

    beforeRenderConfig: {
        /**
         * @cfg glyph
         * @inheritdoc Ext.panel.Header#cfg-glyph
         * @accessor
         */
        glyph: null,

        /**
         * @cfg {'top'/'bottom'/'left'/'right'} [headerPosition='top']
         * Specify as `'top'`, `'bottom'`, `'left'` or `'right'`.
         * @accessor
         */
        headerPosition: null,

        /**
         * @cfg icon
         * @inheritdoc Ext.panel.Header#cfg-icon
         * @accessor
         */
        icon: null,

        /**
         * @cfg iconAlign
         * @inheritdoc Ext.panel.Header#cfg-iconAlign
         * @accessor
         */
        iconAlign: null,

        /**
         * @cfg iconCls
         * @inheritdoc Ext.panel.Header#cfg-iconCls
         * @accessor
         */
        iconCls: null,

        /**
         * @cfg {String}
         * @inheritdoc Ext.panel.Header#title
         * @localdoc When a `title` is specified, the {@link Ext.panel.Header} will 
         * automatically be created and displayed unless {@link #header} is set to 
         * `false`.
         * @accessor
         */
        title: null,

        /**
         * @cfg titleAlign
         * @inheritdoc Ext.panel.Header#cfg-titleAlign
         * @accessor
         */
        titleAlign: null,

        /**
         * @cfg titleRotation
         * @inheritdoc Ext.panel.Header#cfg-titleRotation
         * @accessor
         */
        titleRotation: null
    },

    /**
     * @cfg {Boolean} animCollapse
     * `true` to animate the transition when the panel is collapsed, `false` to skip the animation (defaults to `true`
     * if the {@link Ext.fx.Anim} class is available, otherwise `false`). May also be specified as the animation
     * duration in milliseconds.
     */
    animCollapse: Ext.enableFx,

    /**
     * @cfg {Boolean} bodyBorder
     * A shortcut to add or remove the border on the body of a panel. In the classic theme
     * this only applies to a panel which has the {@link #frame} configuration set to `true`.
     * @since 2.3.0
     */

    /**
     * @cfg {String/String[]} bodyCls
     * A CSS class, space-delimited string of classes, or array of classes to be applied to the panel's body element.
     * The following examples are all valid:
     *
     *     bodyCls: 'foo'
     *     bodyCls: 'foo bar'
     *     bodyCls: ['foo', 'bar']
     */

    /**
     * @cfg {Number/String} [bodyPadding=undefined]
     * A shortcut for setting a padding style on the body element. The value can either be
     * a number to be applied to all sides, or a normal css string describing padding.
     */

    /**
     * @cfg {String/Object/Function} bodyStyle
     * Custom CSS styles to be applied to the panel's body element, which can be supplied as a valid CSS style string,
     * an object containing style property name/value pairs or a function that returns such a string or object.
     * For example, these two formats are interpreted to be equivalent:
     *
     *     bodyStyle: 'background:#ffc; padding:10px;'
     *
     *     bodyStyle: {
     *         background: '#ffc',
     *         padding: '10px'
     *     }
     *
     * @since 2.3.0
     */

    /**
     * @cfg {Boolean} [border=true]
     * Specify as `false` to render the Panel with zero width borders.
     *
     * Leaving the value as `true` uses the selected theme's {@link Ext.panel.Panel#$panel-border-width}
     *
     * Defaults to `false` when using or extending Neptune.
     * 
     * **Note:** is ignored when {@link #frame} is set to **true**.
     */
    border: true,

    /**
     * @cfg {Boolean} closable
     * True to display the 'close' tool button and allow the user to close the window, false to hide the button and
     * disallow closing the window.
     *
     * By default, when close is requested by clicking the close button in the header, the {@link #method-close} method will be
     * called. This will _{@link Ext.Component#method-destroy destroy}_ the Panel and its content meaning that it may not be
     * reused.
     *
     * To make closing a Panel _hide_ the Panel so that it may be reused, set {@link #closeAction} to 'hide'.
     */
    closable: false,

    /**
     * @cfg {String} closeAction
     * The action to take when the close header tool is clicked:
     *
     * - **`'{@link #method-destroy}'`** :
     *
     *   {@link #method-remove remove} the window from the DOM and {@link Ext.Component#method-destroy destroy} it and all descendant
     *   Components. The window will **not** be available to be redisplayed via the {@link #method-show} method.
     *
     * - **`'{@link #method-hide}'`** :
     *
     *   {@link #method-hide} the window by setting visibility to hidden and applying negative offsets. The window will be
     *   available to be redisplayed via the {@link #method-show} method.
     *
     * **Note:** This behavior has changed! setting *does* affect the {@link #method-close} method which will invoke the
     * appropriate closeAction.
     */
    closeAction: 'destroy',
    
    //<locale>
    /**
     * @cfg {String} closeToolText Text to be announced by screen readers when the 
     * **close** {@link Ext.panel.Tool tool} is focused.  Will also be set as the close 
     * tool's {@link Ext.panel.Tool#cfg-tooltip tooltip} text.
     * 
     * **Note:** Applicable when the panel is {@link #closable}: true
     */
    closeToolText: 'Close panel',
    //</locale>

    /**
     * @cfg {Boolean} collapsed
     * `true` to render the panel collapsed, `false` to render it expanded.
     */
    collapsed: false,

    /**
     * @cfg {String} collapsedCls
     * A CSS class to add to the panel's element after it has been collapsed.
     */
    collapsedCls: 'collapsed',

    /**
     * @cfg {String} collapseDirection
     * The direction to collapse the Panel when the toggle button is clicked.
     *
     * Defaults to the {@link #cfg-headerPosition}
     *
     * **Important: This config is _ignored_ for {@link #collapsible} Panels which are direct child items of a {@link
     * Ext.layout.container.Border border layout}.**
     *
     * Specify as `'top'`, `'bottom'`, `'left'` or `'right'`.
     */

    /**
     * @cfg {Boolean} collapseFirst
     * `true` to make sure the collapse/expand toggle button always renders first (to the left of) any other tools in
     * the panel's title bar, `false` to render it last.
     */
    collapseFirst: true,

    /**
     * @cfg {Boolean} collapsible
     * True to make the panel collapsible and have an expand/collapse toggle Tool added into the header tool button
     * area. False to keep the panel sized either statically, or by an owning layout manager, with no toggle Tool.
     * When a panel is used in a {@link Ext.layout.container.Border border layout}, the {@link #floatable} option
     * can influence the behavior of collapsing.
     * See {@link #collapseMode} and {@link #collapseDirection}
     */
    collapsible: undefined,

    /**
     * @cfg {String} collapseMode
     * **Important: this config is only effective for {@link #collapsible} Panels which are direct child items of a
     * {@link Ext.layout.container.Border border layout}.**
     *
     * When _not_ a direct child item of a {@link Ext.layout.container.Border border layout}, then the Panel's header
     * remains visible, and the body is collapsed to zero dimensions. If the Panel has no header, then a new header
     * (orientated correctly depending on the {@link #collapseDirection}) will be inserted to show a the title and a re-
     * expand tool.
     *
     * When a child item of a {@link Ext.layout.container.Border border layout}, this config has three possible values:
     *
     * - `undefined` - When collapsed, a placeholder {@link Ext.panel.Header Header} is injected into the layout to
     *   represent the Panel and to provide a UI with a Tool to allow the user to re-expand the Panel.
     *
     * - `"header"` - The Panel collapses to leave its header visible as when not inside a
     *   {@link Ext.layout.container.Border border layout}.
     *
     * - `"mini"` - The Panel collapses without a visible header.
     */
    
    //<locale>
    /**
     * @cfg {String} collapseToolText Text to be announced by screen readers when 
     * **collapse** {@link Ext.panel.Tool tool} is focused.  Will also be set as the 
     * collapse tool's {@link Ext.panel.Tool#cfg-tooltip tooltip} text.
     * 
     * **Note:** Applicable when the panel is {@link #collapsible}: true
     */
    collapseToolText: 'Collapse panel',
    
    /**
     * @cfg {String} expandToolText Text to be announced by screen readers when 
     * **expand** {@link Ext.panel.Tool tool} is focused.  Will also be set as the 
     * expand tool's {@link Ext.panel.Tool#cfg-tooltip tooltip} text.
     * 
     * **Note:** Applicable when the panel is {@link #collapsible}: true
     */
    expandToolText: 'Expand panel',
    //</locale>

    /**
     * @cfg {Boolean} constrain
     * True to constrain the panel within its containing element, false to allow it to fall outside of its containing
     * element. By default floating components such as Windows will be rendered to `document.body`. To render and constrain the window within
     * another element specify {@link #renderTo}. Optionally the header only can be constrained
     * using {@link #constrainHeader}.
     */
    constrain: false,

    /**
     * @cfg {Boolean} constrainHeader
     * True to constrain the panel header within its containing element (allowing the panel body to fall outside of
     * its containing element) or false to allow the header to fall outside its containing element.
     * Optionally the entire panel can be constrained using {@link #constrain}.
     */
    constrainHeader: false,

    // @cmd-auto-dependency {aliasPrefix: "widget.", typeProperty: "xtype"}
    /**
     * @cfg {Object/Object[]} dockedItems
     * A component or series of components to be added as docked items to this panel. The docked items can be docked to
     * either the top, right, left or bottom of a panel. This is typically used for things like toolbars or tab bars:
     *
     *     var panel = new Ext.panel.Panel({
     *         dockedItems: [{
     *             xtype: 'toolbar',
     *             dock: 'top',
     *             items: [{
     *                 text: 'Docked to the top'
     *             }]
     *         }]
     *     });
     */
    dockedItems: null,

    /**
     * @cfg {String} buttonAlign
     * The alignment of any buttons added to this panel. Valid values are 'right', 'left' and 'center' (defaults to
     * 'right' for buttons/fbar, 'left' for other toolbar types).
     *
     * **NOTE:** The preferred way to specify toolbars is to use the dockedItems config. Instead of buttonAlign you
     * would add the layout: { pack: 'start' | 'center' | 'end' } option to the dockedItem config.
     */

    // @cmd-auto-dependency {aliasPrefix: "widget.", typeProperty: "xtype", defaultType: "toolbar"}
    /**
     * @cfg {Object/Object[]} tbar
     * Convenience config. Short for 'Top Bar'.
     *
     *     tbar: [
     *       { xtype: 'button', text: 'Button 1' }
     *     ]
     *
     * is equivalent to
     *
     *     dockedItems: [{
     *         xtype: 'toolbar',
     *         dock: 'top',
     *         items: [
     *             { xtype: 'button', text: 'Button 1' }
     *         ]
     *     }]
     */
    tbar: null,

    // @cmd-auto-dependency {aliasPrefix: "widget.", typeProperty: "xtype", defaultType: "toolbar"}
    /**
     * @cfg {Object/Object[]} bbar
     * Convenience config. Short for 'Bottom Bar'.
     *
     *     bbar: [
     *       { xtype: 'button', text: 'Button 1' }
     *     ]
     *
     * is equivalent to
     *
     *     dockedItems: [{
     *         xtype: 'toolbar',
     *         dock: 'bottom',
     *         items: [
     *             { xtype: 'button', text: 'Button 1' }
     *         ]
     *     }]
     */
    bbar: null,

    // @cmd-auto-dependency {aliasPrefix: "widget.", typeProperty: "xtype", defaultType: "toolbar"}
    /**
     * @cfg {Object/Object[]} fbar
     * Convenience config used for adding items to the bottom of the panel. Short for Footer Bar.
     *
     *     fbar: [
     *       { type: 'button', text: 'Button 1' }
     *     ]
     *
     * is equivalent to
     *
     *     dockedItems: [{
     *         xtype: 'toolbar',
     *         dock: 'bottom',
     *         ui: 'footer',
     *         defaults: {minWidth: {@link #minButtonWidth}},
     *         items: [
     *             { xtype: 'component', flex: 1 },
     *             { xtype: 'button', text: 'Button 1' }
     *         ]
     *     }]
     *
     * The {@link #minButtonWidth} is used as the default {@link Ext.button.Button#minWidth minWidth} for
     * each of the buttons in the fbar.
     */
    fbar: null,

    // @cmd-auto-dependency {aliasPrefix: "widget.", typeProperty: "xtype", defaultType: "toolbar"}
    /**
     * @cfg {Object/Object[]} lbar
     * Convenience config. Short for 'Left Bar' (left-docked, vertical toolbar).
     *
     *     lbar: [
     *       { xtype: 'button', text: 'Button 1' }
     *     ]
     *
     * is equivalent to
     *
     *     dockedItems: [{
     *         xtype: 'toolbar',
     *         dock: 'left',
     *         items: [
     *             { xtype: 'button', text: 'Button 1' }
     *         ]
     *     }]
     */
    lbar: null,

    // @cmd-auto-dependency {aliasPrefix: "widget.", typeProperty: "xtype", defaultType: "toolbar"}
    /**
     * @cfg {Object/Object[]} rbar
     * Convenience config. Short for 'Right Bar' (right-docked, vertical toolbar).
     *
     *     rbar: [
     *       { xtype: 'button', text: 'Button 1' }
     *     ]
     *
     * is equivalent to
     *
     *     dockedItems: [{
     *         xtype: 'toolbar',
     *         dock: 'right',
     *         items: [
     *             { xtype: 'button', text: 'Button 1' }
     *         ]
     *     }]
     */
    rbar: null,

    /**
     * @cfg {Object/Object[]} buttons
     * Convenience config used for adding buttons docked to the bottom of the panel. This is a
     * synonym for the {@link #fbar} config.
     *
     *     buttons: [
     *       { text: 'Button 1' }
     *     ]
     *
     * is equivalent to
     *
     *     dockedItems: [{
     *         xtype: 'toolbar',
     *         dock: 'bottom',
     *         ui: 'footer',
     *         defaults: {minWidth: {@link #minButtonWidth}},
     *         items: [
     *             { xtype: 'component', flex: 1 },
     *             { xtype: 'button', text: 'Button 1' }
     *         ]
     *     }]
     *
     * The {@link #minButtonWidth} is used as the default {@link Ext.button.Button#minWidth minWidth} for
     * each of the buttons in the buttons toolbar.
     */
    buttons: null,
    
    /**
     * @cfg draggable
     * @inheritdoc
     * @localdoc **NOTE:** The private {@link Ext.panel.DD} class is used instead of 
     * ComponentDragger when {@link #simpleDrag} is false (_default_).  In this case you 
     * may pass a config for {@link Ext.dd.DragSource}.
     * 
     * See also {@link #dd}.
     */

    /**
     * @cfg {Boolean} floatable
     * **Important: This config is only effective for {@link #collapsible} Panels which are direct child items of a
     * {@link Ext.layout.container.Border border layout}.**
     *
     * true to allow clicking a collapsed Panel's {@link #placeholder} to display the Panel floated above the layout,
     * false to force the user to fully expand a collapsed region by clicking the expand button to see it again.
     */
    floatable: true,

    /**
     * @cfg {Boolean} frame
     * True to apply a frame to the panel.
     * 
     * **Note:** `frame: true` overrides {@link #border border:false}
     */
    frame: false,

    /**
     * @cfg {Boolean} frameHeader
     * True to apply a frame to the panel panels header (if 'frame' is true).
     */
    frameHeader: true,


    /**
     * @cfg {Boolean/Object} [header]
     * Pass as `false` to prevent a Header from being created and shown.
     *
     * Pass as a config object (optionally containing an `xtype`) to custom-configure this Panel's header.
     *
     * See {@link Ext.panel.Header} for all the options that may be specified here.
     *
     * A {@link Ext.panel.Header panel header} is a {@link Ext.container.Container} which contains the Panel's {@link #title} and {@link #tools}.
     * You may also configure the Panel's `header` option with its own child items which go *before* the {@link #tools}
     *
     * By default the panel {@link #title} is inserted after items configured in this config, but before any tools.
     * To insert the title at any point in the full array, specify the {@link Ext.panel.Header#cfg-titlePosition titlePosition} config:
     *
     *     new Ext.panel.Panel({
     *         title: 'Test',
     *         tools: [{
     *             type: 'refresh'
     *         }, {
     *             type: 'help'
     *         }],
     *         titlePosition: 2 // Title will come AFTER the two tools
     *         ...
     *     });
     *
     */

    /**
     * @cfg {String} headerOverCls
     * Optional CSS class to apply to the header element on mouseover
     */

    /**
     * @cfg {Boolean} hideCollapseTool
     * `true` to hide the expand/collapse toggle button when `{@link #collapsible} == true`, `false` to display it.
     */
    hideCollapseTool: false,


    /**
     * @cfg {Boolean} [manageHeight=true] When true, the dock component layout writes
     * height information to the panel's DOM elements based on its shrink wrap height
     * calculation. This ensures that the browser respects the calculated height.
     * When false, the dock component layout will not write heights on the panel or its
     * body element. In some simple layout cases, not writing the heights to the DOM may
     * be desired because this allows the browser to respond to direct DOM manipulations
     * (like animations).
     */
    manageHeight: true,

    /**
     * @cfg {String} [maskElement="el"]
     *
     * The name of the element property in this Panel to mask when masked by a LoadMask.
     *
     * Defaults to `"el"` to indicate that any LoadMask should be rendered into this Panel's encapsulating element.
     *
     * This could be configured to be `"body"` so that only the body is masked and toolbars and the header are still mouse-accessible.
     */
    maskElement: 'el',

    /**
     * @cfg {Number} minButtonWidth
     * Minimum width of all footer toolbar buttons in pixels. If set, this will be used as the default
     * value for the {@link Ext.button.Button#minWidth} config of each Button added to the **footer toolbar** via the
     * {@link #fbar} or {@link #buttons} configurations. It will be ignored for buttons that have a minWidth configured
     * some other way, e.g. in their own config object or via the {@link Ext.container.Container#defaults defaults} of
     * their parent container.
     */
    minButtonWidth: 75,

    /**
     * @cfg {Boolean} overlapHeader
     * True to overlap the header in a panel over the framing of the panel itself. This is needed when frame:true (and
     * is done automatically for you). Otherwise it is undefined. If you manually add rounded corners to a panel header
     * which does not have frame:true, this will need to be set to true.
     */

    /**
     * @cfg {Ext.Component/Object} placeholder
     * **Important: This config is only effective for {@link #collapsible} Panels which are direct child items of a
     * {@link Ext.layout.container.Border border layout} when not using the `'header'` {@link #collapseMode}.**
     *
     * **Optional.** A Component (or config object for a Component) to show in place of this Panel when this Panel is
     * collapsed by a {@link Ext.layout.container.Border border layout}. Defaults to a generated {@link Ext.panel.Header
     * Header} containing a {@link Ext.panel.Tool Tool} to re-expand the Panel.
     */

    /**
     * @cfg {Number} [placeholderCollapseHideMode=Ext.Element.VISIBILITY]
     * The {@link Ext.dom.Element#setVisibilityMode mode} for hiding collapsed panels when
     * using {@link #collapseMode} "placeholder".
     */
    //placeholderCollapseHideMode: Ext.Element.VISIBILITY,

    /**
     * @cfg {Boolean} preventHeader
     * @deprecated 4.1.0 Use {@link #header} instead.
     * Prevent a Header from being created and shown.
     */
     preventHeader: false,

    /**
     * @cfg [shrinkWrap=2]
     * @inheritdoc
     * @localdoc ##Panels (subclasses and instances)
     * 
     * By default, when a panel is configured to shrink wrap in a given dimension, only 
     * the panel's "content" (items and html content inside the panel body) contributes 
     * to its size, and the content of docked items is ignored. Optionally you can use 
     * the {@link #shrinkWrapDock} config to allow docked items to contribute to the 
     * panel's size as well. For example, if shrinkWrap and shrinkWrapDock are both set 
     * to true, the width of the panel would be the width of the panel's content and the 
     * panel's header text.
     */

    /**
     * @cfg {Boolean/Number} shrinkWrapDock
     * Allows for this panel to include the {@link #dockedItems} when trying to determine 
     * the overall size of the panel. This option is only applicable when this panel is 
     * also shrink wrapping in the same dimensions. See {@link Ext.Panel#shrinkWrap} for 
     * an explanation of the configuration options.
     */
    shrinkWrapDock: false,

    /**
     * @cfg {Boolean} [simpleDrag=false]
     * When {@link #cfg-draggable} is `true`, Specify this as `true` to  cause the `draggable` config
     * to work the same as it does in {@link Ext.window.Window Window}. This Panel
     * just becomes movable. No DragDrop instances receive any notifications.
     * For example:
     *
     *     @example
     *     var win = Ext.create('widget.window', {
     *         height: 300,
     *         width: 300,
     *         title: 'Constraining Window',
     *         closable: false,
     *         items: {
     *             title: "Floating Panel",
     *             width: 100,
     *             height: 100,
     *             floating: true,
     *             draggable: true,
     *             constrain: true,
     *             simpleDrag: true
     *         }
     *     });
     *     win.show();
     *     // Floating components begin life hidden
     *     win.child('[title=Floating Panel]').show();
     *
     */

    /**
     * @cfg stateEvents
     * @inheritdoc Ext.state.Stateful#cfg-stateEvents
     * @localdoc By default the following stateEvents are added:
     * 
     *  - {@link #event-resize} - _(added by Ext.Component)_
     *  - {@link #event-collapse}
     *  - {@link #event-expand}
     */

    /**
     * @cfg {Boolean} titleCollapse
     * `true` to allow expanding and collapsing the panel (when `{@link #collapsible} = true`) by clicking anywhere in
     * the header bar, `false`) to allow it only by clicking to tool button). When a panel is used in a
     * {@link Ext.layout.container.Border border layout}, the {@link #floatable} option can influence the behavior of collapsing.
     */
    titleCollapse: undefined,

    /**
     * @cfg {Object[]/Ext.panel.Tool[]} tools
     * An array of {@link Ext.panel.Tool} configs/instances to be added to the header tool area. The tools are stored as
     * child components of the header container. They can be accessed using {@link #down} and {#query}, as well as the
     * other component methods. The toggle tool is automatically created if {@link #collapsible} is set to true.
     *
     * Note that, apart from the toggle tool which is provided when a panel is collapsible, these tools only provide the
     * visual button. Any required functionality must be provided by adding handlers that implement the necessary
     * behavior.
     *
     * Example usage:
     *
     *     tools:[{
     *         type:'refresh',
     *         tooltip: 'Refresh form Data',
     *         // hidden:true,
     *         handler: function(event, toolEl, panelHeader) {
     *             // refresh logic
     *         }
     *     },
     *     {
     *         type:'help',
     *         tooltip: 'Get Help',
     *         callback: function(panel, tool, event) {
     *             // show help here
     *         }
     *     }]
     *
     * The difference between `handler` and `callback` is the signature. For details on
     * the distinction, see {@link Ext.panel.Tool}.
     */
    
    /**
     * @cfg {String} [defaultButton] Reference name of the component to act as the default
     * button for this Panel. Default button is activated by pressing Enter key while focus
     * is contained within the Panel's {@link #defaultButtonTarget}.
     *
     * The most obvious use for `defaultButton` is submitting a form:
     *
     *      var loginWindow = new Ext.window.Window({
     *          autoShow: true,
     *          width: 300,
     *          layout: 'form',
     *          title: 'Enter login information',
     *          referenceHolder: true,
     *          defaultFocus: 'textfield',
     *          defaultButton: 'okButton',
     *          
     *          items: [{
     *              xtype: 'textfield',
     *              fieldLabel: 'User name'
     *          }, {
     *              xtype: 'textfield',
     *              fieldLabel: 'Password'
     *          }],
     *          
     *          buttons: [{
     *              reference: 'okButton',
     *              text: 'Login',
     *              handler: function() {
     *                  Ext.Msg.alert('Submit', 'Your login is being processed');
     *              }
     *          }]
     *      });
     */
    
    /**
     * @cfg {String} [defaultButtonTarget] Name of the element that will be the target of
     * {@link #defaultButton} keydown listener. The default element is Panel body, which
     * means that pressing Enter key while focus is on docked items will not fire `defaultButton`
     * action.
     *
     * If you want `defaultButton` action to fire in docked items, set this config to `"el"`.
     */

    // ***********************************************************************************
    // End Config
    // ***********************************************************************************
    // </editor-fold>

    // <editor-fold desc="Properties">
    // ***********************************************************************************
    // Begin Properties
    // ***********************************************************************************

    baseCls: Ext.baseCSSPrefix + 'panel',

    /**
     * @property {Ext.dom.Element} body
     * The Panel's body {@link Ext.dom.Element Element} which may be used to contain HTML content.
     * The content may be specified in the {@link #html} config, or it may be loaded using the
     * {@link #loader} config. Read-only.
     *
     * If this is used to load visible HTML elements in either way, then
     * the Panel may not be used as a Layout for hosting nested Panels.
     *
     * If this Panel is intended to be used as the host of a Layout (See {@link #layout}
     * then the body Element must not be loaded or changed - it is under the control
     * of the Panel's Layout.
     *
     * @readonly
     */

    bodyPosProps: {
        x: 'x',
        y: 'y'
    },

    componentLayout: 'dock',

    /**
     * @property {String} [contentPaddingProperty='bodyPadding']
     * @inheritdoc
     */
    contentPaddingProperty: 'bodyPadding',

    emptyArray: [],

    /**
     * @property {Boolean} isPanel
     * `true` in this class to identify an object as an instantiated Panel, or subclass thereof.
     */
    isPanel: true,

    defaultBindProperty: 'title',

    // ***********************************************************************************
    // End Properties
    // ***********************************************************************************
    // </editor-fold>

    // <editor-fold desc="Events">
    // ***********************************************************************************
    // Begin Events
    // ***********************************************************************************

    /**
     * @event beforeclose
     * Fires before the user closes the panel. Return false from any listener to stop the close event being
     * fired
     * @param {Ext.panel.Panel} panel The Panel object
     */

    /**
     * @event beforecollapse
     * Fires before this panel is collapsed. Return false to prevent the collapse.
     * @param {Ext.panel.Panel} p The Panel being collapsed.
     * @param {String} direction . The direction of the collapse. One of
     *
     *   - Ext.Component.DIRECTION_TOP
     *   - Ext.Component.DIRECTION_RIGHT
     *   - Ext.Component.DIRECTION_BOTTOM
     *   - Ext.Component.DIRECTION_LEFT
     *
     * @param {Boolean} animate True if the collapse is animated, else false.
     */

    /**
     * @event beforeexpand
     * Fires before this panel is expanded. Return false to prevent the expand.
     * @param {Ext.panel.Panel} p The Panel being expanded.
     * @param {Boolean} animate True if the expand is animated, else false.
     */

    /**
     * @event close
     * Fires when the user closes the panel.
     * @param {Ext.panel.Panel} panel The Panel object
     */

    /**
     * @event collapse
     * Fires after this Panel has collapsed.
     * @param {Ext.panel.Panel} p The Panel that has been collapsed.
     */

    /**
     * @event expand
     * Fires after this Panel has expanded.
     * @param {Ext.panel.Panel} p The Panel that has been expanded.
     */

    /**
     * @event float
     * Fires after a collapsed Panel has been "floated" by clicking on
     * it's header. Only applicable when the Panel is an item in a
     * {@link Ext.layout.container.Border Border Layout}.
     */

    /**
     * @event glyphchange
     * Fired when the Panel glyph has been changed by the {@link #setGlyph} method.
     * @param {Ext.panel.Panel} this
     * @param {Number/String} newGlyph
     * @param {Number/String} oldGlyph
     */

    /**
     * @event iconchange
     * Fires after the Panel icon has been set or changed.
     * @param {Ext.panel.Panel} p The Panel which has the icon changed.
     * @param {String} newIcon The path to the new icon image.
     * @param {String} oldIcon The path to the previous panel icon image.
     */

    /**
     * @event iconclschange
     * Fires after the Panel iconCls has been set or changed.
     * @param {Ext.panel.Panel} p The Panel which has the iconCls changed.
     * @param {String} newIconCls The new iconCls.
     * @param {String} oldIconCls The previous panel iconCls.
     */

    /**
     * @event titlechange
     * Fires after the Panel title has been set or changed.
     * @param {Ext.panel.Panel} p the Panel which has been resized.
     * @param {String} newTitle The new title.
     * @param {String} oldTitle The previous panel title.
     */

    /**
     * @event unfloat
     * Fires after a "floated" Panel has returned to it's collapsed state
     * as a result of the mouse leaving the Panel. Only applicable when
     * the Panel is an item in a
     * {@link Ext.layout.container.Border Border Layout}.
     */

    // ***********************************************************************************
    // End Events
    // ***********************************************************************************
    // </editor-fold>

    // <editor-fold desc="Component Methods">
    // ***********************************************************************************
    // Begin Methods
    // ***********************************************************************************

    /**
     * Adds a CSS class to the body element. If not rendered, the class will
     * be added when the panel is rendered.
     * @param {String} cls The class to add
     * @return {Ext.panel.Panel} this
     */
    addBodyCls: function(cls) {
        var me = this,
            body = me.rendered ? me.body : me.getProtoBody();

        body.addCls(cls);
        return me;
    },

    /**
     * Add tools to this panel
     * @param {Object[]/Ext.panel.Tool[]} tools The tools to add.
     *
     * By default the tools will be accessible via keyboard, with the exception
     * of automatically added collapse/expand and close tools.
     *
     * If you implement keyboard equivalents of your tools' actions elsewhere
     * and do not want the tools to participate in keyboard navigation, you can
     * make them presentational instead:
     *
     *      panel.addTool({
     *          type: 'mytool',
     *          focusable: false,
     *          ariaRole: 'presentation',
     *          ...
     *      });
     */
    addTool: function(tools) {
        if (!Ext.isArray(tools)) {
            tools = [tools];
        }

        var me     = this,
            header = me.header,
            tLen   = tools.length,
            curTools = me.tools,
            t, tool;

        if (!header || !header.isHeader) {
            header = null;
            if (!curTools) {
                me.tools = curTools = [];
            }
        }

        for (t = 0; t < tLen; t++) {
            tool = tools[t];
            tool.toolOwner = me;

            if (header) {
                header.addTool(tool);
            } else {
                // only modify the tools array if the header isn't created,
                // otherwise, defer to the header to manage
                curTools.push(tool);
            }
        }

        me.updateHeader();
    },

    /**
     * @protected
     * @template
     * Template method to be implemented in subclasses to add their tools after the collapsible tool.
     */
    addTools: Ext.emptyFn,

    setCollapsible: function (collapsible) {
        var me = this,
            current = me.collapsible,
            collapseTool = me.collapseTool;

        me.collapsible = collapsible;

        if (collapsible && !current) {
            me.updateCollapseTool();

            collapseTool = me.collapseTool;
            if (collapseTool) {
                collapseTool.show();
            }
        } else if (!collapsible && current) {
            if (collapseTool) {
                collapseTool.hide();
            }
        }
    },

    /**
     * @inheritdoc
     */
    addUIClsToElement: function(cls) {
        var me = this,
            result = me.callParent(arguments);

        me.addBodyCls([Ext.baseCSSPrefix + cls, me.baseCls + '-body-' + cls, me.baseCls + '-body-' + me.ui + '-' + cls]);
        return result;
    },

    /**
     * Invoked after the Panel is Collapsed.
     *
     * @param {Boolean} animated
     *
     * @template
     * @protected
     */
    afterCollapse: function(animated) {
        var me = this,
            ariaDom = me.ariaEl.dom,
            ownerLayout = me.ownerLayout;

        me.isCollapsingOrExpanding = 0;
        me.updateCollapseTool();

        // The x-animating-size class sets overflow:hidden so that overflowing
        // content is clipped during animation.
        if (animated) {
            me.removeCls(Ext.baseCSSPrefix + 'animating-size');
        }

        if (ownerLayout) {
            ownerLayout.afterCollapse(me, animated);
        }
        
        if (ariaDom) {
            ariaDom.setAttribute('aria-expanded', false);
        }
        
        // In accordion layout, panel body has the role of tabpanel
        // and needs to be updated accordingly when the panel is collapsed
        if (me.isAccordionPanel) {
            me.body.dom.setAttribute('aria-hidden', true);
        }

        me.setHiddenDocked();
        me.fireEvent('collapse', me);
    },

    /**
     * Invoked after the Panel is Expanded.
     *
     * @param {Boolean} animated
     *
     * @template
     * @protected
     */
    afterExpand: function(animated) {
        var me = this,
            ariaDom = me.ariaEl.dom,
            ownerLayout = me.ownerLayout;

        me.isCollapsingOrExpanding = 0;
        me.updateCollapseTool();

        // The x-animating-size class sets overflow:hidden so that overflowing
        // content is clipped during animation.
        if (animated) {
            me.removeCls(Ext.baseCSSPrefix + 'animating-size');
        }

        if (ownerLayout) {
            ownerLayout.afterExpand(me, animated);
        }
        
        if (ariaDom) {
            ariaDom.setAttribute('aria-expanded', true);
        }
        
        // In accordion layout, panel body has the role of tabpanel
        // and needs to be updated accordingly when the panel is expanded
        if (me.isAccordionPanel) {
            me.body.dom.setAttribute('aria-hidden', false);
        }

        me.fireEvent('expand', me);
        me.fireHierarchyEvent('expand');
    },

    beforeDestroy: function() {
        var me = this;
        
        Ext.destroy(
            me.placeholder,
            me.ghostPanel,
            me.dd,
            me.accordionKeyNav,
            me.defaultButtonKeyNav
        );
        
        me.destroyDockedItems();
        me.callParent();
    },
    
    destroy: function() {
        this.callParent();
        this.dockedItems = this.bodyContainer = null;
    },

    beforeRender: function() {
        var me = this,
            wasCollapsed;

        // Ensure the protoBody exists so that initOverflow gets right answer from getOverflowEl.
        // If this Panel was applied to an existing element (such as being used as a Viewport)
        // then it will not have been created.
        me.getProtoBody();

        me.callParent();

        // Add class-specific header tools.
        // Panel adds collapsible and closable.
        me.initTools();

        // Dock the header/title unless we are configured specifically not to create a header.
        // If the panel participates in a border layout it should have the ARIA role of 'region'.
        // In that case we need to render a heading element even if the panel is configured
        // not to have a header.
        if (!(me.preventHeader || (me.header === false)) || me.isViewportBorderChild) {
            me.updateHeader();
        }
        me.afterHeaderInit = true;

        // If we are rendering collapsed, we still need to save and modify various configs
        if (me.collapsed) {
            if (me.isPlaceHolderCollapse()) {
                if (!me.hidden) {
                    me.setHiddenState(true);

                    // This will insert the placeholder Component into the ownerCt's child collection
                    // Its getRenderTree call which is calling this will then iterate again and
                    // recreate the child items array to include the new Component. Prevent the first
                    // collapse from firing
                    me.preventCollapseFire = true;
                    me.placeholderCollapse();
                    delete me.preventCollapseFire;
                    wasCollapsed = me.collapsed;

                    // Temporarily clear the flag so that the header is rendered with a collapse tool in it.
                    // Placeholder collapse panels never really collapse, they just hide. The tool is always
                    // a collapse tool.
                    me.collapsed = false;
                }
            } else {
                me.beginCollapse();
                me.addClsWithUI(me.collapsedCls);
            }
        }

        // Restore the flag if we are being rendered initially placeholder collapsed.
        if (wasCollapsed) {
            me.collapsed = wasCollapsed;
        }
    },

    /**
     * @private
     * Memento Factory method
     * @param {String} name Name of the Memento (used as prefix for named Memento)
     */
    getMemento: function(name) {
        var me = this;
        if(name && typeof name === 'string') {
            name += 'Memento';
            return me[name] || (me[name] = new Ext.util.Memento(me));
        }
    },


    /**
     * @private
     * Called before the change from default, configured state into the collapsed state.
     * This method may be called at render time to enable rendering in an initially collapsed state,
     * or at runtime when an existing, fully laid out Panel may be collapsed.
     * It basically saves configs which need to be clobbered for the duration of the collapsed state.
     */
    beginCollapse: function() {
        var me = this,
            lastBox = me.lastBox,
            rendered = me.rendered,
            collapseMemento = me.getMemento('collapse'),
            sizeModel = me.getSizeModel(),
            header = me.header,
            reExpander;

        // When we collapse a panel, the panel is in control of one dimension (depending on
        // collapse direction) and sets that on the component. We must restore the user's
        // original value (including non-existence) when we expand. Using this technique, we
        // mimic setCalculatedSize for the dimension we do not control and setSize for the
        // one we do (only while collapsed).
        // Additionally, the panel may have a shrink wrapped width and/or height. For shrinkWrapped
        // panels this can be problematic, since a collapsed, shrink-wrapped panel has no way
        // of determining its width (or height if the collapse direction is horizontal). It is
        // therefore necessary to capture both the width and height regardless of collapse direction.
        // This allows us to set a configured width or height on the panel when it is collapsed,
        // and it will be restored to an unconfigured-width shrinkWrapped state on expand.
        collapseMemento.capture(['height', 'minHeight', 'width', 'minWidth']);
        if (lastBox) {
            collapseMemento.capture(me.restoreDimension(), lastBox, 'last.');
        }
        // If the panel has a shrinkWrapped height/width and is already rendered, configure its width/height as its calculated width/height,
        // so that the collapsed header will have the same width or height as the panel did before it was collapsed.
        // If the shrinkWrapped panel has not yet been rendered, as will be the case when a panel is initially configured with
        // collapsed:true, we attempt to use the configured width/height, and fall back to minWidth or minHeight if
        // width/height has not been configured, and fall back to a value of 100 if a minWidth/minHeight has not been configured.
        if (me.collapsedVertical()) {
            if (sizeModel.width.shrinkWrap) {
                me.width = rendered ? me.getWidth() : me.width || me.minWidth || 100;
            }
            delete me.height;
            me.minHeight = 0;
        } else if (me.collapsedHorizontal()) {
            if (sizeModel.height.shrinkWrap) {
                me.height = rendered ? me.getHeight() : me.height || me.minHeight || 100;
            }
            delete me.width;
            me.minWidth = 0;
        }

        if (me.ownerCt) {
            me.ownerCt.getLayout().beginCollapse(me);
        }

        // Get a reExpander header. This will return the Panel Header if the Header is in the correct orientation
        // If we are using the Header as the reExpander, change its UI to collapsed state
        if (!me.isPlaceHolderCollapse() && header !== false) {
            if (header === (reExpander = me.getReExpander())) {
                header.collapseImmune = true;
                header.getInherited().collapseImmune = true;
                header.addClsWithUI(me.getHeaderCollapsedClasses(header));

                // Ensure that the reExpander has the correct framing applied.
                if (header.rendered) {
                    header.updateFrame();
                }
            } else if (reExpander.el) {
                // We're going to use a temporary reExpander: show it.
                reExpander.el.show();
                reExpander.hidden = false;
            }
        }
        if (me.resizer) {
            me.resizer.disable();
        }
    },

    beginDrag: function() {
        if (this.floatingDescendants) {
            this.floatingDescendants.hide();
        }
    },

    beginExpand: function() {
        var me = this,
            lastBox = me.lastBox,
            collapseMemento = me.getMemento('collapse'),
            restoreDimension = me.restoreDimension(),
            header = me.header,
            reExpander;

        if (collapseMemento) {
            collapseMemento.restore(['minHeight', 'minWidth', restoreDimension]);
            if (lastBox) {
                collapseMemento.restore(restoreDimension, true, lastBox, 'last.');
            }
        }

        if (me.ownerCt) {
            me.ownerCt.getLayout().beginExpand(me);
        }

        if (!me.isPlaceHolderCollapse() && header !== false) {
            // If we have been using our Header as the reExpander then restore the Header to expanded UI
            if (header === (reExpander = me.getReExpander())) {
                delete header.collapseImmune;
                delete header.getInherited().collapseImmune;
                header.removeClsWithUI(me.getHeaderCollapsedClasses(header));

                // Ensure that the reExpander has the correct framing applied.
                if (header.rendered) {
                    header.expanding = true;
                    header.updateFrame();
                    delete header.expanding;
                }
            } else {
                // We've been using a temporary reExpander: hide it.
                reExpander.hidden = true;
                reExpander.el.hide();
            }
        }
        if (me.resizer) {
            me.resizer.enable();
        }
    },

    bridgeToolbars: function() {
        var me = this,
            docked = [],
            minButtonWidth = me.minButtonWidth,
            fbar, fbarDefaults;

        function initToolbar (toolbar, pos, useButtonAlign) {
            if (Ext.isArray(toolbar)) {
                toolbar = {
                    xtype: 'toolbar',
                    items: toolbar
                };
            } else if (!toolbar.xtype) {
                toolbar.xtype = 'toolbar';
            }
            toolbar.dock = pos;

            // Legacy support for buttonAlign (only used by buttons/fbar)
            if (useButtonAlign) {
                toolbar.layout = Ext.applyIf(toolbar.layout || {}, {
                    // default to 'end' (right-aligned) if me.buttonAlign is undefined or invalid
                    pack: { left:'start', center:'center' }[me.buttonAlign] || 'end'
                });
            }
            return toolbar;
        }

        if (me.tbar) {
            docked.push(initToolbar(me.tbar, 'top'));
            me.tbar = null;
        }

        if (me.bbar) {
            docked.push(initToolbar(me.bbar, 'bottom'));
            me.bbar = null;
        }

        if (me.buttons) {
            me.fbar = me.buttons;
            me.buttons = null;
        }

        if (me.fbar) {
            fbar = initToolbar(me.fbar, 'bottom', true); // only we useButtonAlign
            fbar.ui = 'footer';

            // Apply the minButtonWidth config to buttons in the toolbar
            if (minButtonWidth) {
                fbarDefaults = fbar.defaults;
                fbar.defaults = function(config) {
                    var defaults = fbarDefaults || {},
                        // no xtype or a button instance
                        isButton = !config.xtype || config.isButton,
                        cls;

                    // Here we have an object config with an xtype, check if it's a button
                    // or a button subclass
                    if (!isButton) {
                        cls = Ext.ClassManager.getByAlias('widget.' + config.xtype);
                        if (cls) {
                            isButton = cls.prototype.isButton;
                        }
                    }
                    if (isButton && !('minWidth' in defaults)) {
                        defaults = Ext.apply({minWidth: minButtonWidth}, defaults);
                    }
                    return defaults;
                };
            }

            docked.push(fbar);
            me.fbar = null;
        }

        if (me.lbar) {
            docked.push(initToolbar(me.lbar, 'left'));
            me.lbar = null;
        }

        if (me.rbar) {
            docked.push(initToolbar(me.rbar, 'right'));
            me.rbar = null;
        }

        if (me.dockedItems) {
            if (me.dockedItems.isMixedCollection) {
                me.addDocked(docked);
            } else {
                if (!Ext.isArray(me.dockedItems)) {
                    me.dockedItems = [me.dockedItems];
                }
                me.dockedItems = me.dockedItems.concat(docked);
            }
        } else {
            me.dockedItems = docked;
        }
    },

    /**
     * Closes the Panel. By default, this method, removes it from the DOM, {@link Ext.Component#method-destroy destroy}s the
     * Panel object and all its descendant Components. The {@link #beforeclose beforeclose} event is fired before the
     * close happens and will cancel the close action if it returns false.
     *
     * **Note:** This method is also affected by the {@link #closeAction} setting. For more explicit control use
     * {@link #method-destroy} and {@link #method-hide} methods.
     */
    close: function() {
        if (this.fireEvent('beforeclose', this) !== false) {
            this.doClose();
        }
    },

    /**
     * Collapses the panel body so that the body becomes hidden. Docked Components parallel to the border towards which
     * the collapse takes place will remain visible. Fires the {@link #beforecollapse} event which will cancel the
     * collapse action if it returns false.
     *
     * @param {String} [direction] The direction to collapse towards. Must be one of
     *
     *   - Ext.Component.DIRECTION_TOP
     *   - Ext.Component.DIRECTION_RIGHT
     *   - Ext.Component.DIRECTION_BOTTOM
     *   - Ext.Component.DIRECTION_LEFT
     *
     * Defaults to {@link #collapseDirection}.
     *
     * @param {Boolean} [animate] True to animate the transition, else false
     * (defaults to the value of the {@link #animCollapse} panel config). May
     * also be specified as the animation duration in milliseconds.
     * @return {Ext.panel.Panel} this
     */
    collapse: function(direction, animate) {
        var me = this,
            collapseDir = direction || me.collapseDirection,
            ownerCt = me.ownerCt,
            layout = me.ownerLayout,
            rendered = me.rendered;

        if (me.isCollapsingOrExpanding) {
            return me;
        }

        if (arguments.length < 2) {
            animate = me.animCollapse;
        }

        if (me.collapsed || me.fireEvent('beforecollapse', me, direction, animate) === false) {
            return me;
        }

        if (layout && layout.onBeforeComponentCollapse) {
            if (layout.onBeforeComponentCollapse(me) === false) {
                return me;
            }
        }

        if (rendered && ownerCt && me.isPlaceHolderCollapse()) {
            return me.placeholderCollapse(direction, animate);
        }

        me.collapsed = collapseDir;
        if (rendered) {
            me.beginCollapse();
        }

        me.getInherited().collapsed = true;
        me.fireHierarchyEvent('collapse');

        if (rendered) {
            me.doCollapseExpand(1, animate);
        }
        return me;
    },

    collapsedHorizontal: function () {
        var dir = this.getCollapsed();
        return dir === 'left' || dir === 'right';
    },

    collapsedVertical: function () {
        var dir = this.getCollapsed();
        return dir === 'top' || dir === 'bottom';
    },

    /**
     * converts a collapsdDir into an anchor argument for Element.slideIn
     * overridden in rtl mode to switch "l" and "r"
     */
    convertCollapseDir: function(collapseDir) {
        return collapseDir.substr(0, 1);
    },

    createGhost: function(cls) {
         var me = this,
             header = me.header,
             frame = me.frame && !me.alwaysFramed;

        return {
            xtype: 'panel',
            hidden: false,
            header: header ? {
                titleAlign: header.getTitleAlign()
            } : null,
            ui: frame ? me.ui.replace(/-framed$/, '') : me.ui,
            id: me.id + '-ghost',
            renderTo: Ext.getBody(),
            // The ghost's opacity causes the resize handles to obscure the frame in
            // IE, so always force resizable to be false.
            resizable: false,

            // The ghost must not be draggable (the actual class instantiated my be draggable in its prototype)
            draggable: false,

            // Tools are explicitly copied. We do not want the overhead of a KeyMap for the ghost
            closable: false,

            focusable: false,
            floating: true,
            shadow: false,
            frame: frame,
            shim: me.shim,
            alwaysFramed: me.alwaysFramed,
            overlapHeader: me.overlapHeader,
            headerPosition: me.getHeaderPosition(),
            titleRotation: me.getTitleRotation(),
            baseCls: me.baseCls,
            getRefOwner: function () {
                return me.getRefOwner();
            },
            cls: me.baseCls + '-ghost ' + (cls || '')
        };
    },

    createReExpander: function(direction, defaults) {
        var me = this,
            isLeft = direction === 'left',
            isRight = direction === 'right',
            isVertical = isLeft || isRight,
            ownerCt = me.ownerCt,
            result = Ext.apply({
                hideMode: 'offsets',
                title: me.getTitle(),
                titleAlign: me.getTitleAlign(),
                vertical: isVertical,
                textCls: me.headerTextCls,
                icon: me.getIcon(),
                iconCls: me.getIconCls(),
                iconAlign: me.getIconAlign(),
                glyph: me.getGlyph(),
                baseCls: me.self.prototype.baseCls + '-header',
                ui: me.ui,
                frame: me.frame && me.frameHeader,
                ignoreParentFrame: me.frame || me.overlapHeader,
                ignoreBorderManagement: me.frame || me.ignoreHeaderBorderManagement,
                indicateDrag: me.draggable,
                collapseImmune: true,
                ariaRole: me.ariaRole,
                preventRefocus: true,
                ownerCt: (ownerCt && me.collapseMode === 'placeholder') ? ownerCt : me,
                ownerLayout: me.componentLayout,
                forceOrientation: true,
                margin: me.margin
            }, defaults);

        // If we're in mini mode, set the placeholder size to only 1px since
        // we don't need it to show up.
        if (me.collapseMode === 'mini') {
            if (isVertical) {
                result.width = 1;
            } else {
                result.height = 1;
            }
        }

        // Create the re expand tool
        // For UI consistency reasons, collapse:left reExpanders, and region: 'west' placeHolders
        // have the re expand tool at the *top* with a bit of space.
        if (!me.hideCollapseTool) {
            if (isLeft || (isRight && me.isPlaceHolderCollapse())) {
                // adjust the title position if the collapse tool needs to be at the
                // top of a vertical header
                result.titlePosition = 1;
            }
            result.tools = [{
                xtype: 'tool',
                type: 'expand-' + me.getOppositeDirection(direction),
                isDefaultExpandTool: true,
                uiCls: ['top'],
                handler: me.toggleCollapse,
                scope: me,
                tooltip: me.expandToolText
            }];
        }
        result = new Ext.panel.Header(result);
        result.addClsWithUI(me.getHeaderCollapsedClasses(result));
        
        result.expandTool = result.down('tool[isDefaultExpandTool=true]');
        
        return result;
    },

    /**
     * @private
     */
    doClose: function() {
        this.fireEvent('close', this);
        this[this.closeAction]();
    },

    doCollapseExpand: function (flags, animate) {
        var me = this,
            originalAnimCollapse = me.animCollapse,
            ownerLayout = me.ownerLayout;

        // we need to temporarily set animCollapse to the animate value here because ContextItem
        // uses the animCollapse property to determine if the collapse/expand should be animated
        me.animCollapse = animate;

        // Flag used by the layout ContextItem to impose an animation policy based upon the
        // collapse direction and the animCollapse setting.
        me.isCollapsingOrExpanding = flags;

        // The x-animating-size class sets overflow:hidden so that overflowing
        // content is clipped during animation.
        if (animate) {
            me.addCls(Ext.baseCSSPrefix + 'animating-size');
        }

        if (ownerLayout && !animate) {
            ownerLayout.onContentChange(me);
        } else {
            me.updateLayout({ isRoot: true });
        }

        // set animCollapse back to its original value
        me.animCollapse = originalAnimCollapse;

        return me;
    },

    endDrag: function() {
        if (this.floatingDescendants) {
            this.floatingDescendants.show();
        }
    },

    /**
     * Expands the panel body so that it becomes visible.  Fires the {@link #beforeexpand} event which will
     * cancel the expand action if it returns false.
     * @param {Boolean} [animate] True to animate the transition, else false
     * (defaults to the value of the {@link #animCollapse} panel config).  May
     * also be specified as the animation duration in milliseconds.
     * @return {Ext.panel.Panel} this
     */
    expand: function(animate) {
        var me = this,
            layout = me.ownerLayout,
            rendered = me.rendered;

        if (me.isCollapsingOrExpanding) {
            return me;
        }

        if (!arguments.length) {
            animate = me.animCollapse;
        }

        if (!me.collapsed && !me.floatedFromCollapse) {
            return me;
        }


        if (me.fireEvent('beforeexpand', me, animate) === false) {
            return me;
        }

        if (layout && layout.onBeforeComponentExpand) {
            if (layout.onBeforeComponentExpand(me) === false) {
                return me;
            }
        }

        delete me.getInherited().collapsed;

        if (rendered && me.isPlaceHolderCollapse()) {
            return me.placeholderExpand(animate);
        }

        me.restoreHiddenDocked();
        if (rendered) {
            me.beginExpand();
        }
        me.collapsed = false;

        if (me.rendered) {
            me.doCollapseExpand(2, animate);
        }
        return me;
    },

    findReExpander: function (direction) {
        var me = this,
            c = Ext.Component,
            dockedItems = me.dockedItems.items,
            dockedItemCount = dockedItems.length,
            comp, i;

        // never use the header if we're in collapseMode mini
        if (me.collapseMode === 'mini') {
            return;
        }

        switch (direction) {
            case c.DIRECTION_TOP:
            case c.DIRECTION_BOTTOM:

                // Attempt to find a reExpander Component (docked in a horizontal orientation)
                // Also, collect all other docked items which we must hide after collapse.
                for (i = 0; i < dockedItemCount; i++) {
                    comp = dockedItems[i];
                    if (!comp.hidden) {
                        if (comp.isHeader && (!comp.dock || comp.dock === 'top' || comp.dock === 'bottom')) {
                            return comp;
                        }
                    }
                }
                break;

            case c.DIRECTION_LEFT:
            case c.DIRECTION_RIGHT:

                // Attempt to find a reExpander Component (docked in a vertical orientation)
                // Also, collect all other docked items which we must hide after collapse.
                for (i = 0; i < dockedItemCount; i++) {
                    comp = dockedItems[i];
                    if (!comp.hidden) {
                        if (comp.isHeader && (comp.dock === 'left' || comp.dock === 'right')) {
                            return comp;
                        }
                    }
                }
                break;

            default:
                throw('Panel#findReExpander must be passed a valid collapseDirection');
        }
    },

    floatCollapsedPanel: function() {
        var me = this,
            placeholder = me.placeholder,
            ps = placeholder.getSize(),
            floatCls = Ext.panel.Panel.floatCls,
            collapsed = me.collapsed,
            layoutOwner = me.ownerCt || me,
            slideDirection, onBodyMousedown, myBox;

        if (me.isSliding) {
            return;
        }

        // Already floated
        if (me.el.hasCls(floatCls)) {
            me.slideOutFloatedPanel();
            return;
        }
        me.isSliding = true;

        // Lay out in fully expanded mode to ensure we are at the correct size, and collect our expanded box
        placeholder.el.hide();
        placeholder.hidden = true;
        me.el.show();
        me.setHiddenState(false);
        me.collapsed = false;
        layoutOwner.updateLayout();

        // Then go back immediately to collapsed state from which to initiate the float into view.
        placeholder.el.show();
        placeholder.hidden = false;
        me.el.hide();
        me.setHiddenState(true);
        me.collapsed = collapsed;
        layoutOwner.updateLayout();
        myBox = me.getBox(false, true);

        me.slideOutTask = me.slideOutTask || new Ext.util.DelayedTask(me.slideOutFloatedPanel, me);

        // Tap outside the floated element slides it back.
        if (Ext.supports.Touch) {
            Ext.on('mousedown', onBodyMousedown = function(event) {
                if (!event.within(me.el)) {
                    Ext.un('mousedown', onBodyMousedown);
                    me.slideOutFloatedPanel();
                }
            });
        }
        if (!me.placeholderListener) {
            me.placeholderListener = placeholder.on({
                resize: me.onPlaceholderResize,
                scope: me,
                destroyable: true
            });
        }
        placeholder.el.on('mouseleave', me.onMouseLeaveFloated, me);
        me.el.on('mouseleave', me.onMouseLeaveFloated, me);
        placeholder.el.on('mouseenter', me.onMouseEnterFloated, me);
        me.el.on('mouseenter', me.onMouseEnterFloated, me);

        me.el.addCls(floatCls);
        me.floated = collapsed;

        // Hide collapse tool in header if there is one (we might be headerless)
        if (me.collapseTool) {
            me.collapseTool.el.hide();
        }

        switch (me.collapsed) {
            case 'top':
                me.width = ps.width;
                me.setLocalXY(myBox.x, myBox.y + ps.height);
                break;
            case 'right':
                me.height = ps.height;
                me.setLocalXY(myBox.x - ps.width, myBox.y);
                break;
            case 'bottom':
                me.width = ps.width;
                me.setLocalXY(myBox.x, myBox.y - ps.height);
                break;
            case 'left':
                me.height = ps.height;
                me.setLocalXY(myBox.x + ps.width, myBox.y);
                break;
        }
        slideDirection = me.convertCollapseDir(me.collapsed);

        // Remember how we are really collapsed so we can restore it, but also so we can
        // become a layoutRoot while we are floated:
        me.floatedFromCollapse = me.collapsed;
        me.collapsed = false;
        me.setHiddenState(false);

        me.el.slideIn(slideDirection, {
            preserveScroll: true,
            duration: Ext.Number.from(me.animCollapse, Ext.fx.Anim.prototype.duration),
            listeners: {
                afteranimate: function() {
                    me.isSliding = false;
                    me.fireEvent('float', me);
                }
            }
        });
    },

    onPlaceholderResize: function(ph, newWidth, newHeight) {
        var me = this,
            myBox = me.getBox(false, true),
            phBox = ph.getBox(false, true);

        // Position floated panel alongside the placeholder, and sync the parallel dimension
        switch (me.floated) {
            case 'top':
                me.width = newWidth;
                me.setLocalY(phBox.y + phBox.height);
                break;
            case 'right':
                me.height = newHeight;
                me.setLocalX(phBox.x - myBox.width);
                break;
            case 'bottom':
                me.width = newWidth;
                me.setLocalY(phBox.y - myBox.height);
                break;
            case 'left':
                me.height = newHeight;
                me.setLocalX(phBox.x + phBox.width);
                break;
        }

        me.updateLayout({
            isRoot: true
        });
    },

    getAnimationProps: function() {
        var me = this,
            animCollapse = me.animCollapse,
            props;

        props = me.callParent();

        if (typeof animCollapse === 'number') {
            props.duration = animCollapse;
        }

        return props;
    },

    /**
     * Returns the current collapsed state of the panel.
     * @return {Boolean/String} False when not collapsed, otherwise the value of {@link #collapseDirection}.
     */
    getCollapsed: function() {
        var me = this;
        // The collapsed flag, when the Panel is collapsed acts as the direction in which the collapse took
        // place. It can still be tested as truthy/falsy if only a truth value is required.
        if (me.collapsed === true) {
            return me.collapseDirection;
        }
        return me.collapsed;
    },

    getCollapsedDockedItems: function () {
        var me = this;
        return me.header === false || me.collapseMode === 'placeholder' ? me.emptyArray : [ me.getReExpander() ];
    },

    /**
     * Attempts a default component lookup (see {@link Ext.container.Container#getComponent}). If the component is not found in the normal
     * items, the dockedItems are searched and the matched component (if any) returned (see {@link #getDockedComponent}). Note that docked
     * items will only be matched by component id or itemId -- if you pass a numeric index only non-docked child components will be searched.
     * @param {String/Number} comp The component id, itemId or position to find
     * @return {Ext.Component} The component (if found)
     * @since 2.3.0
     */
    getComponent: function(comp) {
        var component = this.callParent(arguments);
        if (component === undefined && !Ext.isNumber(comp)) {
            // If the arg is a numeric index skip docked items
            component = this.getDockedComponent(comp);
        }
        return component;
    },

    /**
     * Gets the {@link Ext.panel.Header Header} for this panel.
     * @return {Ext.panel.Header}
     */
    getHeader: function() {
        return this.header;
    },

    /**
     * @private
     * Create the class array to add to the Header when collapsed.
     */
    getHeaderCollapsedClasses: function(header) {
        var me = this,
            collapsedCls = me.collapsedCls,
            collapsedClasses;

        collapsedClasses = [ collapsedCls, collapsedCls + '-' + header.getDockName()];
        if (me.border && (!me.frame || (me.frame && Ext.supports.CSS3BorderRadius))) {
            collapsedClasses.push(collapsedCls + '-border-' + header.getDockName());
        }
        return collapsedClasses;
    },

    /**
     * @private
     */
    getKeyMap: function() {
        return this.keyMap || (this.keyMap = new Ext.util.KeyMap(Ext.apply({
            target: this.el
        }, this.keys)));
    },

    getOppositeDirection: function(d) {
        var c = Ext.Component;
        switch (d) {
            case c.DIRECTION_TOP:
                return c.DIRECTION_BOTTOM;
            case c.DIRECTION_RIGHT:
                return c.DIRECTION_LEFT;
            case c.DIRECTION_BOTTOM:
                return c.DIRECTION_TOP;
            case c.DIRECTION_LEFT:
                return c.DIRECTION_RIGHT;
        }
    },

    getPlaceholder: function(direction) {
        var me = this,
            collapseDir = direction || me.collapseDirection,
            listeners = null,
            placeholder = me.placeholder,
            floatable = me.floatable,
            titleCollapse = me.titleCollapse;

        if (!placeholder) {
            if (floatable || (me.collapsible && titleCollapse)) {
                listeners = {
                    click: {
                        // titleCollapse needs to take precedence over floatable
                        fn: (!titleCollapse && floatable) ? me.floatCollapsedPanel : me.toggleCollapse,
                        element: 'el',
                        scope: me
                    }
                };
            }

            me.placeholder = placeholder = Ext.widget(me.createReExpander(collapseDir, {
                id: me.id + '-placeholder',
                listeners: listeners
            }));
        }

        // User created placeholder was passed in
        if (!placeholder.placeholderFor) {
            // Handle the case of a placeholder config
            if (!placeholder.isComponent) {
                me.placeholder = placeholder = me.lookupComponent(placeholder);
            }
            Ext.applyIf(placeholder, {
                margin: me.margin,
                placeholderFor: me,
                synthetic: true // not user-defined
            });

            placeholder.addCls([Ext.baseCSSPrefix + 'region-collapsed-placeholder', Ext.baseCSSPrefix + 'region-collapsed-' + collapseDir + '-placeholder', me.collapsedCls]);
        }

        return placeholder;
    },

    getProtoBody: function () {
        var me = this,
            body = me.protoBody;

        if (!body) {
            me.protoBody = body = new Ext.util.ProtoElement({
                cls: me.bodyCls,
                style: me.bodyStyle,
                clsProp: 'bodyCls',
                styleProp: 'bodyStyle',
                styleIsText: true
            });
        }

        return body;
    },

    getReExpander: function (direction) {
        var me = this,
            collapseDir = direction || me.collapseDirection,
            reExpander = me.reExpander || me.findReExpander(collapseDir);

        me.expandDirection = me.getOppositeDirection(collapseDir);

        if (!reExpander) {
        // We did not find a Header of the required orientation: create one.
            me.reExpander = reExpander = me.createReExpander(collapseDir, {
                dock: collapseDir,
                cls: Ext.baseCSSPrefix + 'docked ' + me.baseCls + '-' + me.ui + '-collapsed',
                isCollapsedExpander: true
            });

            me.dockedItems.insert(0, reExpander);
        }
        return reExpander;
    },

    getRefItems: function(deep) {
        var items = this.callParent(arguments);

        return this.getDockingRefItems(deep, items);
    },

    getState: function() {
        var me = this,
            state = me.callParent() || {},
            collapsed = me.collapsed,
            floated = me.floated,
            memento;

        // When taking state to restore on a page refresh, floated means collapsed
        if (floated) {
            me.collapsed = floated;
        }
        state = me.addPropertyToState(state, 'collapsed');
        if (floated) {
            me.collapsed = collapsed;
        }

        // If a collapse has taken place, use remembered values as the dimensions.
        if (me.getCollapsed()) {
            memento = me.getMemento('collapse').data;
            state = me.addPropertyToState(state , 'collapsed', memento);

            if (me.collapsedVertical()) {
                delete state.height;
                if (memento) {
                    state = me.addPropertyToState(state, 'height', memento.height);
                }
            } else {
                delete state.width;
                if (memento) {
                    state = me.addPropertyToState(state, 'width', memento.width);
                }
            }
        }
        return state;
    },

    applyState: function(state) {
        var me = this,
            collapseMemento = {},
            collapsed;

        if (state) {
            collapsed = state.collapsed;
            if(collapsed) {
                collapseMemento = me.getMemento('collapse');
                Ext.Object.merge(collapseMemento.data , collapsed);
                state.collapsed = true;
            }

            me.callParent(arguments);
        }
    },

    /**
     * @private
     * Used for dragging.
     */
    ghost: function(cls) {
        var me = this,
            ghostPanel = me.ghostPanel,
            box = me.getBox(),
            header = me.header,
            ghostHeader, tools, icon, iconCls, glyph, i;

        if (!ghostPanel) {
            me.ghostPanel = ghostPanel = Ext.widget(me.createGhost(cls));
            ghostPanel.el.dom.removeAttribute('tabIndex');
        } else {
            ghostPanel.el.show();
        }
        ghostPanel.setHiddenState(false);
        ghostPanel.floatParent = me.floatParent;
        ghostPanel.toFront();
        if (header && !me.preventHeader) {
            ghostHeader = ghostPanel.header;
            // restore options
            ghostHeader.suspendLayouts();
            tools = ghostHeader.query('tool');
            for (i = tools.length; i--;) {
                ghostHeader.remove(tools[i]);
            }
            // reset the title position to ensure that the title gets moved into the correct
            // place after we add the tools (if the position didn't change the updater won't run)
            ghostHeader.setTitlePosition(0);
            ghostPanel.addTool(me.ghostTools());
            ghostPanel.setTitle(me.getTitle());
            ghostHeader.setTitlePosition(header.titlePosition);

            iconCls = me.getIconCls();
            if (iconCls) {
                ghostPanel.setIconCls(iconCls);
            } else {
                icon = me.getIcon();
                if (icon) {
                    ghostPanel.setIcon(icon);
                } else {
                    glyph = me.getGlyph();
                    if (glyph) {
                        ghostPanel.setGlyph(glyph);
                    }
                }
            }

            ghostHeader.addCls(Ext.baseCSSPrefix + 'header-ghost');
            ghostHeader.resumeLayouts();
        }

        ghostPanel.setPagePosition(box.x, box.y);
        ghostPanel.setSize(box.width, box.height);
        me.el.hide();
        return ghostPanel;
    },

    /**
     * @private
     * Helper function for ghost
     */
    ghostTools: function() {
        var tools = [],
            header = this.header,
            headerTools = header ? header.query('tool[hidden=false]') : [],
            t, tLen, tool;

        if (headerTools.length) {
            t = 0;
            tLen = headerTools.length;

            for (; t < tLen; t++) {
                tool = headerTools[t];

                // Some tools can be full components, and copying them into the ghost
                // actually removes them from the owning panel. You could also potentially
                // end up with duplicate DOM ids as well. To avoid any issues we just make
                // a simple bare-minimum clone of each tool for ghosting purposes.
                tools.push({
                    type: tool.type,
                    tooltip: tool.tooltip
                });
            }
        } else {
            tools = [{
                type: 'placeholder'
            }];
        }
        return tools;
    },

    initBodyBorder: function() {
        var me = this;

        if (me.frame && me.bodyBorder) {
            if (!Ext.isNumber(me.bodyBorder)) {
                me.bodyBorder = 1;
            }
            me.getProtoBody().setStyle('border-width', this.unitizeBox(me.bodyBorder));
        }
    },

    /**
     * Parses the {@link #bodyStyle} config if available to create a style string that will be applied to the body element.
     * This also includes {@link #bodyPadding} and {@link #bodyBorder} if available.
     * @return {String} A CSS style string with body styles, padding and border.
     * @private
     */
    initBodyStyles: function() {
        var me = this,
            body = me.getProtoBody();

        if (me.bodyPadding !== undefined) {
            if (me.layout.managePadding) {
                // If the container layout manages padding, the layout will apply the
                // padding to an inner element rather than the body element.  The
                // assumed intent is for the configured padding to override any padding
                // that is applied to the body element via style sheet rules.  It is
                // therefore necessary to set the body element's padding to "0".
                body.setStyle('padding', 0);
            } else {
                body.setStyle('padding', this.unitizeBox((me.bodyPadding === true) ? 5 : me.bodyPadding));
            }
        }
        me.initBodyBorder();
    },

    initBorderProps: function() {
        var me = this;

        if (me.frame && me.border && me.bodyBorder === undefined) {
            me.bodyBorder = false;
        }
        if (me.frame && me.border && (me.bodyBorder === false || me.bodyBorder === 0)) {
            me.manageBodyBorders = true;
        }
    },

    initComponent: function() {
        var me = this;

        if (me.collapsible) {
        // Save state on these two events.
            me.addStateEvents(['expand', 'collapse']);
        }
        if (me.unstyled) {
            me.setUI('plain');
        }

        if (me.frame) {
            me.setUI(me.ui + '-framed');
        }

        // Backwards compatibility
        me.bridgeToolbars();

        me.initBorderProps();
        me.callParent();
        me.collapseDirection = me.collapseDirection || me.getHeaderPosition() || Ext.Component.DIRECTION_TOP;

        // Used to track hidden content elements during collapsed state
        me.hiddenOnCollapse = new Ext.dom.CompositeElement();

    },

    initItems: function() {
        this.callParent();
        this.initDockingItems();
    },
    
    /**
     * Initialized the renderData to be used when rendering the renderTpl.
     * @return {Object} Object with keys and values that are going to be applied to the renderTpl
     * @private
     */
    initRenderData: function() {
        var me = this,
            data = me.callParent();

        me.initBodyStyles();
        me.protoBody.writeTo(data);
        delete me.protoBody;
        
        if (me.headingText) {
            data.headingText = me.headingText;
            me.addChildEl('headingEl');
        }

        if (me.bodyAriaRole) {
            data.bodyAriaAttributes = {
                role: me.bodyAriaRole
            };
            
            if (!me.ariaStaticRoles[me.bodyAriaRole] && me.bodyAriaRenderAttributes) {
                Ext.apply(data.bodyAriaAttributes, me.bodyAriaRenderAttributes);
            }
        }
        
        return data;
    },

    /**
     * @private
     * Override of Positionable method to calculate constrained position based upon possibly only
     * constraining our header.
     */
    calculateConstrainedPosition: function(constrainTo, proposedPosition, local, proposedSize) {
        var me = this,
            header = me.header,
            lastBox, fp;

        // If we are only constraining the header, ask the header for its constrained position
        // based upon the size the header will take on based upon this panel's proposedSize
        if (me.constrainHeader) {
            lastBox = header.lastBox;
            if (proposedSize) {
                if (!header.vertical) {
                    proposedSize = [proposedSize[0], lastBox ? lastBox.height : proposedSize[1]];
                } else {
                    proposedSize = [lastBox ? lastBox.width : proposedSize[0], proposedSize[1]];
                }
            } else if (lastBox) {
                proposedSize = [lastBox.width, lastBox.height];
            }
            fp = me.floatParent;
            constrainTo = constrainTo || me.constrainTo || (fp ? fp.getTargetEl() : null) || me.container || me.el.parent();
        }

        return me.callParent([constrainTo, proposedPosition, local, proposedSize]);
    },

    /**
     * @private
     * Tools are a Panel-specific capability.
     * Panel uses initTools. Subclasses may contribute tools by implementing addTools.
     */
    initTools: function() {
        var me = this,
            tools = me.tools,
            i, toolCfg, tool;

        me.tools = [];
        for (i = tools && tools.length; i; ) {
            --i;
            me.tools[i] = tool = tools[i];
            tool.toolOwner = me;
        }

        // Add a collapse tool unless configured to not show a collapse tool
        // or to not even show a header.
        if (me.collapsible && !(me.hideCollapseTool || me.header === false || me.preventHeader)) {
            me.updateCollapseTool();
            // Prepend collapse tool is configured to do so.
            if (me.collapseFirst) {
                me.tools.unshift(me.collapseTool);
            }
        }

        // Add subclass-specific tools.
        me.addTools();

        if (me.pinnable) {
            me.initPinnable();
        }

        // Make Panel closable.
        if (me.closable) {
            me.addClsWithUI('closable');
            
            toolCfg = {
                xtype : 'tool',
                type: 'close',
                scope: me,
                handler: me.close,
                tooltip: me.closeToolText
            };
            
            // Same as with the collapse/expand tool, we have a way to close
            // the panel via keyboard by pressing Alt-Del key when panel's
            // title is focused; hence we do not need to have the close tool
            // in the tab order. We still need to have the tool itself for
            // pointer interaction and presentational purposes.
            // This configuration will make sure the tool is working as it was
            // in Ext JS older than 6.0.
            if (me.isAccordionPanel) {
                toolCfg.focusable = false;
                toolCfg.ariaRole = 'presentation';
            }
            
            me.addTool(toolCfg);
        }

        // Append collapse tool if needed.
        if (me.collapseTool && !me.collapseFirst) {
            me.addTool(me.collapseTool);
        }
    },

    isLayoutRoot: function() {
        if (this.floatedFromCollapse) {
            return true;
        }
        return this.callParent();
    },

    isPlaceHolderCollapse: function(){
        return this.collapseMode === 'placeholder';
    },

    isVisible: function(deep){
        var me = this;
        if (me.collapsed && me.placeholder) {
            return me.placeholder.isVisible(deep);
        }
        return me.callParent(arguments);
    },

    onBoxReady: function() {
        var me = this,
            target;
        
        me.callParent(arguments);
        
        if (me.collapsed) {
            me.setHiddenDocked();
        }
        
        if (me.isAccordionPanel) {
            // ARIA state like expanded/collapsed are reflected
            // on the panel header's title component.
            me.ariaEl = me.header.titleCmp.el;
            me.ariaEl.dom.setAttribute('aria-expanded', !me.collapsed);
            
            // Body element has the role="tabpanel"; when the panel is collapsed
            // or expanded we will update ARIA attributes on the body.
            me.body.dom.setAttribute('aria-labelledby', me.header.titleCmp.id);
            me.body.dom.setAttribute('aria-hidden', !!me.collapsed);
            
            me.accordionKeyNav = new Ext.util.KeyNav({
                target: me.header.titleCmp.el,
                scope: me,
                
                left: me.navigateAccordion,
                right: me.navigateAccordion,
                left: me.navigateAccordion,
                up: me.navigateAccordion,
                down: me.navigateAccordion,
                home: me.navigateAccordion,
                end: me.navigateAccordion,
                space: me.toggleCollapse,
                enter: me.toggleCollapse,
                del: {
                    alt: true,
                    fn: me.maybeClose
                }
            });
        }
        
        if (me.defaultButton) {
            target = me.defaultButtonTarget ? me[me.defaultButtonTarget] : me.body;
            
            me.defaultButtonKeyNav = new Ext.util.KeyNav({
                target: target,
                scope: me,
                defaultEventAction: 'stopEvent',
                
                enter: me.fireDefaultButton
            });
        }
    },

    onHide: function(animateTarget, cb, scope) {
        var me = this,
            dd = me.dd;

        // If floated out from collapse, hide the el immediately.
        // We continue with the hide from a collapsed state.
        if (me.floatedFromCollapse) {
            me.slideOutFloatedPanel(true);
        }

        if (me.draggable && dd) {
            // Panels w/o headers won't have a Component Dragger.
            dd.endDrag();
        }

        if (me.collapsed && me.placeholder) {
            if (me.splitter) {
                Ext.suspendLayouts();
                me.splitter.hide();
                Ext.resumeLayouts();
            }
            me.placeholder.hide();
        } else {
            me.callParent([animateTarget, cb, scope]);
        }
    },

    onMouseEnterFloated: function(e) {
        this.slideOutTask.cancel();
    },

    onMouseLeaveFloated: function(e) {
        this.slideOutTask.delay(500);
    },
    
    /**
     * @method
     * @inheritdoc
     */
    onRemoved: function(destroying) {
        var me = this;

        // If we are removed but not being destroyed, ensure our placeholder is also removed but not destroyed
        // If we are being destroyed, our destroy processing will destroy the placeholder.
        // Must run before callParent because that breaks the ownerCt link
        if (me.placeholder && !destroying) {
            me.ownerCt.remove(me.placeholder, false);
        }

        me.callParent(arguments);
    },

    onShow: function() {
        var me = this;
        if (me.collapsed && me.isPlaceHolderCollapse()) {
            if (me.splitter) {
                Ext.suspendLayouts();
                me.splitter.show();
                Ext.resumeLayouts();
            }
            // force hidden back to true, since this gets set by the layout
            me.setHiddenState(true);
            me.placeholderCollapse();
        } else {
            me.callParent(arguments);
        }
    },

    placeholderCollapse: function(direction, animate) {
        var me = this,
            ownerCt = me.ownerCt,
            collapseDir = direction || me.collapseDirection,
            floatCls = Ext.panel.Panel.floatCls,
            collapseTool = me.collapseTool,
            placeholder = me.getPlaceholder(collapseDir),
            slideInDirection;

        me.isCollapsingOrExpanding = 1;

        // Upcoming layout run will ignore this Component
        me.setHiddenState(true);
        me.collapsed = collapseDir;

        if (placeholder.rendered) {
            // We may have been added to another Container from that in which we rendered the placeholder
            if (placeholder.el.dom.parentNode !== me.el.dom.parentNode) {
                me.el.dom.parentNode.insertBefore(placeholder.el.dom, me.el.dom);
            }

            placeholder.hidden = false;
            placeholder.setHiddenState(false);
            placeholder.el.show();
            ownerCt.updateLayout();
        } else {
            ownerCt.insert(ownerCt.items.indexOf(me), placeholder);
        }

        if (me.rendered) {
            // We assume that if collapse was caused by keyboard action
            // on focused collapse tool, the logical focus transition
            // is to placeholder's expand tool. Note that it may not be
            // the case when the user *clicked* collapse tool while focus
            // was elsewhere; in that case we dare not touch focus
            // to avoid sudden jumps.
            if (collapseTool && Ext.ComponentManager.getActiveComponent() === collapseTool) {
                me.focusPlaceholderExpandTool = true;
            }
            
            // We MUST NOT hide using display because that resets all scroll information.
            me.el.setVisibilityMode(me.placeholderCollapseHideMode);
            
            if (animate) {
                me.el.addCls(floatCls);
                placeholder.el.hide();
                slideInDirection = me.convertCollapseDir(collapseDir);
                
                me.el.slideOut(slideInDirection, {
                    preserveScroll: true,
                    duration: Ext.Number.from(animate, Ext.fx.Anim.prototype.duration),
                    listeners: {
                        scope: me,
                        afteranimate: function() {
                            var me = this;
                            
                            me.el.removeCls(floatCls);
                            
                            /* We need to show the element so that slideIn will work correctly.
                             * However, if we leave it visible then it can be seen before
                             * the animation starts, causing a flicker. The solution,
                             * borrowed from date picker, is to hide it using display:none.
                             * The slideIn effect includes a call to fixDisplay() that will
                             * undo the display none at the appropriate time.
                             */
                            me.placeholder.el.show().setStyle('display', 'none').slideIn(slideInDirection, {
                                easing: 'linear',
                                duration: 100,
                                listeners: {
                                    afteranimate: me.doPlaceholderCollapse,
                                    scope: me
                                }
                            });
                        }
                    }
                });
            }
            else {
                me.el.hide();
                me.doPlaceholderCollapse();
            }
        }
        else {
            me.isCollapsingOrExpanding = 0;
            if (!me.preventCollapseFire) {
                me.fireEvent('collapse', me);
            }
        }

        return me;
    },
    
    doPlaceholderCollapse: function() {
        var me = this,
            placeholder = me.placeholder,
            expandTool = placeholder.expandTool;
    
        // See the comment in placeholderCollapse().
        if (me.focusPlaceholderExpandTool && expandTool) {
            expandTool.focus();
        }
    
        // However when focus was *not* on the collapse tool,
        // we still need to try and focus the placeholder itself
        // since it may have been configured with something
        // focusable inside, and delegate focus handling.
        else {
            placeholder.focus();
        }
        
        me.focusPlaceholderExpandTool = false;
    
        placeholder.setHiddenState(false);
    
        // Both panel *and* placeholder are collapsed,
        // but only panel is hidden. Calling setHiddenState()
        // above does not reset aria-hidden attribute.
        placeholder.ariaEl.dom.setAttribute('aria-hidden', false);
        placeholder.ariaEl.dom.setAttribute('aria-expanded', false);
        
        me.ariaEl.dom.setAttribute('aria-hidden', true);
        me.ariaEl.dom.setAttribute('aria-expanded', false);
    
        me.isCollapsingOrExpanding = 0;
        me.fireEvent('collapse', me);
    },

    placeholderExpand: function(animate) {
        var me = this,
            collapseDir = me.collapsed,
            expandTool = me.placeholder.expandTool,
            floatCls = Ext.panel.Panel.floatCls,
            center = me.ownerLayout ? me.ownerLayout.centerRegion: null,
            finalPos, floatedPos;

        // Layouts suspended - don't bother with animation shenanigans
        if (Ext.Component.layoutSuspendCount) {
            animate = false;
        }

        if (me.floatedFromCollapse) {
            floatedPos = me.getPosition(true);
            // these are the same cleanups performed by the normal slideOut mechanism:
            me.slideOutFloatedPanelBegin();
            me.slideOutFloatedPanelEnd();
            me.floated = false;
        }
        
        // We assume that if expand was caused by keyboard action on focused
        // placeholder expand tool, the logical focus transition is to the
        // panel header's collapse tool.
        // Note that it may not be the case when the user *clicked* expand tool
        // while focus was elsewhere; in that case we dare not touch focus to avoid
        // sudden jumps.
        if (expandTool && Ext.ComponentManager.getActiveComponent() === expandTool) {
            me.focusHeaderCollapseTool = true;
            
            // There is an odd issue with JAWS screen reader: when expanding a panel,
            // it will announce Expand tool again before focus is forced to Collapse
            // tool. I'm not sure why that happens since focus does not move from
            // Expand tool during animation; this hack should work around
            // the problem until we come up with more understanding and a proper
            // solution. The attributes are restored below in doPlaceholderExpand.
            expandTool._ariaRole = expandTool.ariaEl.dom.getAttribute('role');
            expandTool._ariaLabel = expandTool.ariaEl.dom.getAttribute('aria-label');
            
            expandTool.ariaEl.dom.setAttribute('role', 'presentation');
            expandTool.ariaEl.dom.removeAttribute('aria-label');
        }
        
        if (animate) {
            // Expand me and hide the placeholder
            Ext.suspendLayouts();
            me.placeholder.hide();
            me.el.show();
            me.collapsed = false;
            me.setHiddenState(false);

            // Stop the center region from moving when laid out without the placeholder there.
            // Unless we are expanding from a floated out situation. In that case, it's laid out immediately.
            if (center && !floatedPos) {
                center.hidden = true;
            }

            Ext.resumeLayouts(true);
            center.hidden = false;
            me.el.addCls(floatCls);

            // At this point, this Panel is arranged in its correct, expanded layout.
            // The center region has not been affected because it has been flagged as hidden.
            //
            // If we are proceeding from floated, the center region has also been arranged
            // in its new layout to accommodate this expansion, so no further layout is needed, just
            // element animation.
            //
            // If we are proceeding from fully collapsed, the center region has *not* been relayed out because
            // the UI look and feel dictates that it stays stable until the expanding panel has slid in all the
            // way, and *then* it snaps into place.

            me.isCollapsingOrExpanding = 2;

            // Floated, move it back to the floated pos, and thence into the correct place
            if (floatedPos) {
                finalPos = me.getXY();
                me.setLocalXY(floatedPos[0], floatedPos[1]);
                me.setXY([finalPos[0], finalPos[1]], {
                    duration: Ext.Number.from(animate, Ext.fx.Anim.prototype.duration),
                    listeners: {
                        scope: me,
                        afteranimate: function() {
                            var me = this;
                            
                            me.el.removeCls(floatCls);
                            me.isCollapsingOrExpanding = 0;
                            me.fireEvent('expand', me);
                        }
                    }
                });
            }
            // Not floated, slide it in to the correct place
            else {
                me.el.hide();
                me.placeholder.el.show();
                me.placeholder.hidden = false;
                
                // Slide this Component's el back into place, after which we lay out AGAIN
                me.setHiddenState(false);
                me.el.slideIn(me.convertCollapseDir(collapseDir), {
                    preserveScroll: true,
                    duration: Ext.Number.from(animate, Ext.fx.Anim.prototype.duration),
                    listeners: {
                        afteranimate: me.doPlaceholderExpand,
                        scope: me
                    }
                });
            }
        }
        else {
            me.floated = me.collapsed = false;
            me.doPlaceholderExpand(true);
        }

        return me;
    },
    
    doPlaceholderExpand: function(nonAnimated) {
        var me = this,
            placeholder = me.placeholder,
            collapseTool = me.collapseTool,
            expandTool = placeholder.expandTool;
        
        if (nonAnimated) {
            Ext.suspendLayouts();
            me.show();
        }
        
        // the ordering of these two lines appears to be important in
        // IE9.  There is an odd expand issue in IE 9 in the border layout
        // example that causes the index1 child of the south dock region
        // to get 'hidden' after a collapse / expand cycle.  See
        // EXTJSIV-5318 for details
        me.el.removeCls(Ext.panel.Panel.floatCls);
        placeholder.hide();
        
        if (nonAnimated) {
            Ext.resumeLayouts(true);
        }
        else {
            // The center region has been left in its larger size, so a layout is needed now
            me.updateLayout();
        }
        
        // This part is quite tricky in both animated and non-animated sequence.
        // After the panel is collapsed we will show the placeholder,
        // but by that time we had already lost the previous focus state.
        // The subsequent onFocusEnter on the placeholder will thusly reset
        // placeholder's previousFocus property to null; so when we hide
        // the placeholder after expanding the panel again, it can't throw focus
        // back to the panel header by iself.
        // This is why we nudge it a little here; the assumption is that
        // if panel expansion has been caused by keyboard action
        // on focused placeholder expand tool, then the logical focus transition
        // is to panel header's collapse tool.
        if (me.focusHeaderCollapseTool && collapseTool) {
            collapseTool.focus();
        }
        
        me.focusHeaderCollapseTool = false;
        
        placeholder.ariaEl.dom.setAttribute('aria-expanded', true);
        me.ariaEl.dom.setAttribute('aria-expanded', true);
        
        if (expandTool && expandTool._ariaRole) {
            expandTool.ariaEl.dom.setAttribute('role', expandTool._ariaRole);
            expandTool.ariaEl.dom.setAttribute('aria-label', expandTool._ariaLabel);
            expandTool._ariaRole = expandTool._ariaLabel = null;
        }
        
        me.isCollapsingOrExpanding = 0;
        me.fireEvent('expand', me);
    },

    remove: function(component, autoDestroy) {
        var dockedItems = this.dockedItems;
        
        // When the panel is destroyed, dockedItems is nulled
        if (dockedItems && dockedItems.contains(component)) {
            this.removeDocked(component, autoDestroy);
        }
        else {
            this.callParent([component, autoDestroy]);
        }
        return component;
    },

    /**
     * Removes a CSS class from the body element.
     * @param {String} cls The class to remove
     * @return {Ext.panel.Panel} this
     */
    removeBodyCls: function(cls) {
        var me = this,
            body = me.rendered ? me.body : me.getProtoBody();

        body.removeCls(cls);
        return me;
    },

    removeUIClsFromElement: function(cls) {
        var me = this,
            result = me.callParent(arguments);

        me.removeBodyCls([Ext.baseCSSPrefix + cls, me.baseCls + '-body-' + cls, me.baseCls + '-body-' + me.ui + '-' + cls]);
        return result;
    },

    restoreDimension: function(){
        var dir = this.collapseDirection;
        // If we're collapsing top/bottom, we want to restore the height
        // If we're collapsing left/right, we want to restore the width
        return (dir === 'top' || dir === 'bottom') ? 'height' : 'width';
    },

    restoreHiddenDocked: function(){
        // Re-show Panel content which was hidden after collapse.
        this.setDockedItemsVisibility(this.hiddenOnCollapse, true);
    },

    /**
     * Sets the body style according to the passed parameters.
     * @param {Mixed} style A full style specification string, or object, or the name of a style property to set.
     * @param {String} value If the first param was a style property name, the style property value.
     * @return {Ext.panel.Panel} this
     */
    setBodyStyle: function(style, value) {
        var me = this,
            body = me.rendered ? me.body : me.getProtoBody();

        if (Ext.isFunction(style)) {
            style = style();
        }
        if (arguments.length === 1) {
            if (Ext.isString(style)) {
                style = Ext.Element.parseStyles(style);
            }
            body.setStyle(style);
        } else {
            body.setStyle(style, value);
        }
        return me;
    },

    /**
     * @inheritdoc
     */
    setBorder: function(border, targetEl) {
        if (targetEl) {
            // skip out here, the panel will set the border on the body/header during rendering
            return;
        }

        var me = this,
            header = me.header;

        if (!border) {
            border = 0;
        } else if (border === true) {
            border = '1px';
        } else {
            border = me.unitizeBox(border);
        }

        if (header) {
            if (header.isHeader) {
                header.setBorder(border);
            } else {
                header.border = border;
            }
        }

        if (me.rendered && me.bodyBorder !== false) {
            me.body.setStyle('border-width', border);
        }
        me.updateLayout();

        me.border = border;
    },

    /**
     * Collapses or expands the panel.
     * @param {Boolean} collapsed `true` to collapse the panel, `false` to expand it.
     */
    setCollapsed: function(collapsed) {
        this[collapsed ? 'collapse' : 'expand']();
    },

    /**
     * Set visibility of docked items after the panel is collapsed or expanded
     *
     * @param {Ext.dom.CompositeElement} els
     * @param {Boolean} show
     *
     * @private
     */
    setDockedItemsVisibility: function(els, show){
        var me = this,
            items = me.getDockedItems(),
            len = items.length,
            i = 0,
            item, reExpander;

        if (me.header !== false) {
            reExpander = me.getReExpander();
        }

        for (; i < len; i++) {
            item = items[i];
            if (item && item !== reExpander && item.el) {
                els.add(item.el);
            }
        }
        els.setStyle('visibility', show ? '' : 'hidden');
        els.clear();
    },

    setGlyph: function(glyph) {
        var me = this,
            oldGlyph = me.glyph,
            header = me.header,
            placeholder = me.placeholder;

        if (glyph !== oldGlyph) {
            me.glyph = glyph;

            if (header) {
                if (header.isHeader) {
                    header.setGlyph(glyph);
                } else {
                    header.glyph = glyph;
                }
            } else if (me.rendered|| me.afterHeaderInit) {
                me.updateHeader();
            }

            if (placeholder && placeholder.setGlyph) {
                placeholder.setGlyph(glyph);
            }

            me.fireEvent('glyphchange', me, glyph, oldGlyph);
        }
    },

    setIcon: function(icon) {
        var me = this,
            oldIcon = me.icon,
            header = me.header,
            placeholder = me.placeholder;

        if (icon !== oldIcon) {
            me.icon = icon;

            if (header) {
                if (header.isHeader) {
                    header.setIcon(icon);
                } else {
                    header.icon = icon;
                }
            } else if (me.rendered|| me.afterHeaderInit) {
                me.updateHeader();
            }

            if (placeholder && placeholder.setIcon) {
                placeholder.setIcon(icon);
            }

            me.fireEvent('iconchange', me, icon, oldIcon);
        }
    },

    setIconCls: function(iconCls) {
        var me = this,
            oldIconCls = me.iconCls,
            header = me.header,
            placeholder = me.placeholder;

        if (iconCls !== oldIconCls) {
            me.iconCls = iconCls;

            if (header) {
                if (header.isHeader) {
                    header.setIconCls(iconCls);
                } else {
                    header.iconCls = iconCls;
                }
            } else if (me.rendered|| me.afterHeaderInit) {
                me.updateHeader();
            }

            if (placeholder && placeholder.setIconCls) {
                placeholder.setIconCls(iconCls);
            }

            me.fireEvent('iconclschange', me, iconCls, oldIconCls);
        }
    },

    /**
     * Sets the title of this panel.
     * @param {String} title The new title
     */
    setTitle: function(title) {
        var me = this,
            oldTitle = me.title,
            header = me.header,
            reExpander = me.reExpander,
            placeholder = me.placeholder;
        
        if (title !== oldTitle) {
            me.title = title;

            if (header) {
                if (header.isHeader) {
                    header.setTitle(title);
                }
            } else if (me.rendered || me.afterHeaderInit) {
                me.updateHeader();
            }
            
            if (me.headingEl) {
                me.headingEl.setHtml(title);
            }

            if (reExpander) {
                reExpander.setTitle(title);
            }

            if (placeholder && placeholder.setTitle) {
                placeholder.setTitle(title);
            }

            me.fireEvent('titlechange', me, title, oldTitle);
        }
    },

    setHiddenDocked: function(){
        // Hide Panel content except reExpander using visibility to prevent focusing of contained elements.
        // Track what we hide to re-show on expand except for docked items
        // Until the panel is expanded the docked items might have been removed
        var me = this,
            toHide = new Ext.dom.CompositeElement();

        me.hiddenOnCollapse.add(me.body);
        toHide.add(me.body);
        me.setDockedItemsVisibility(toHide, false);
    },

    /**
     * @inheritdoc
     */
    setUI: function(ui) {
        var me = this;

        me.callParent(arguments);

        if (me.header && me.header.rendered) {
            me.header.setUI(ui);
        }
    },

    /**
     * Shortcut for performing an {@link #method-expand} or {@link #method-collapse} based on the current state of the panel.
     * @return {Ext.panel.Panel} this
     */
    toggleCollapse: function() {
        return (this.collapsed || this.floatedFromCollapse) ? this.expand() : this.collapse();
    },

    updateCollapseTool: function () {
        var me = this,
            collapseTool = me.collapseTool,
            toolCfg;

        if (!collapseTool && me.collapsible) {
            me.collapseDirection = me.collapseDirection || me.getHeaderPosition() || 'top';
            
            toolCfg = {
                xtype: 'tool',
                handler: me.toggleCollapse,
                scope: me
            };
            
            // In accordion layout panels are collapsible/expandable with keyboard
            // via the panel title that is focusable. There is no need to have a separate
            // collapse/expand tool for keyboard interaction but we still have to react
            // to mouse clicks, and historically accordion panels had coolapse tools
            // so we leave the tool but make it unfocusable and keyboard inactive.
            // Note that we do the same thing for the automatically added close tool
            // but NOT for the other tools.
            if (me.isAccordionPanel) {
                toolCfg.focusable = false;
                toolCfg.ariaRole = 'presentation';
            }
            
            me.collapseTool = me.expandTool = collapseTool = Ext.widget(toolCfg);
        }

        if (collapseTool) {
            if (me.collapsed && !me.isPlaceHolderCollapse()) {
                collapseTool.setType('expand-' + me.getOppositeDirection(me.collapseDirection));
                collapseTool.setTooltip(me.expandToolText);
            }
            else {
                collapseTool.setType('collapse-' + me.collapseDirection);
                collapseTool.setTooltip(me.collapseToolText);
            }
        }
    },
    
    navigateAccordion: function(e) {
        var me = this,
            wrapOver = me.accordionWrapOver,
            siblingSel = '[isAccordionPanel]',
            firstSiblingSel = siblingSel + ':first',
            lastSiblingSel = siblingSel + ':last',
            key, sibling;
        
        key = e.getKey();
        
        switch (key) {
            case e.UP:
            case e.LEFT:
                sibling = me.prev(siblingSel);
                
                if (!sibling && wrapOver) {
                    sibling = me.ownerCt.child(lastSiblingSel);
                }
                
                break;
            
            case e.DOWN:
            case e.RIGHT:
                sibling = me.next(siblingSel);
                
                if (!sibling && wrapOver) {
                    sibling = me.ownerCt.child(firstSiblingSel);
                }
                
                break;
            
            case e.HOME:
                sibling = me.ownerCt.child(firstSiblingSel);
                break;
            
            case e.END:
                sibling = me.ownerCt.child(lastSiblingSel);
                break;
            
            // Before closing the panel we need to fall back to the previous one,
            // or to the next one if there is no previous one in the list.
            // Jumping to the first panel header does not seem logical.
            case e.DELETE:
                sibling = me.prev(siblingSel) || me.next(siblingSel);
                
                // We also need to prevent the panel from closing if it's the only one
                // panel left in the accordion layout.
                if (!sibling) {
                    e.doNotClose = true;
                }
                
                break;
        }
        
        if (sibling && sibling !== me) {
            sibling.header.titleCmp.focus();
        }
    },
    
    fireDefaultButton: function(e) {
        var me = this,
            refHolder, btn;
        
        refHolder = me.lookupReferenceHolder(/* skipThis = */ false) || me;
        btn = refHolder.lookupReference(me.defaultButton);
        
        // We call it defaultButton but it can really be any object
        // that implements `click` method
        if (btn && btn.click) {
            btn.click(e);
            
            // Stop event propagation through DOM publisher
            e.stopEvent();
            
            // ... and in case we have other listeners,
            // stop the loop in Ext.util.Event too
            return false;
        }
        //<debug>
        else if (!btn) {
            Ext.raise({
                msg: 'No component found for defaultButton reference "' +
                      me.defaultButton + '" in ' + me.xtype + ' ' + me.id,
                panel: me
            });
        }
        else {
            Ext.raise({
                msg: 'Component referenced by defaultButton config "' +
                      me.defaultButton + '" in ' + me.xtype + ' ' + me.id +
                      ' does not have click() method',
                component: btn
            });
        }
        //</debug>
    },
    
    maybeClose: function(e) {
        var me = this;
        
        if (me.closable) {
            me.navigateAccordion(e);
            
            // Can't close the last panel in accordion
            if (!e.doNotClose) {
                me.close();
            }
        }
    },
    
    onFocusEnter: function(e) {
        var me = this,
            ariaDom = me.ariaEl.dom;
        
        me.callParent([e]);
        
        if (me.isAccordionPanel && ariaDom) {
            ariaDom.setAttribute('aria-selected', true);
        }
    },
    
    onFocusLeave: function(e) {
        var me = this,
            ariaDom = me.ariaEl.dom;
        
        me.callParent([e]);
        
        if (me.isAccordionPanel && ariaDom) {
            ariaDom.removeAttribute('aria-selected');
        }
    },

    updateHeaderPosition: function(position) {
        var header = this.header;

        if (header && header.isHeader) {
            header.setDock(position);
        }
    },

    updateIconAlign: function(align) {
        var header = this.header;

        if (header && header.isHeader) {
            header.setIconAlign(align);
        }
    },

    updateTitleAlign: function(align) {
        var header = this.header;

        if (header && header.isHeader) {
            header.setTitleAlign(align);
        }
    },

    updateTitleRotation: function(rotation) {
        var header = this.header;

        if (header && header.isHeader) {
            header.setTitleRotation(rotation);
        }
    },

    /**
     * @private
     */
    unghost: function(show, matchPosition, focus) {
        var me = this,
            ghostPanel = me.ghostPanel;

        if (!ghostPanel) {
            return;
        }
        if (show !== false) {
            // Show el first, so that position adjustment in setPagePosition
            // will work when relative positioned elements have their XY read.
            me.el.show();
            if (matchPosition !== false) {
                me.setPagePosition(ghostPanel.getXY());
                if (me.hideMode === 'offsets') {
                    // clear the hidden style because we just repositioned
                    delete me.el.hideModeStyles;
                }
            }
            if (focus) {
                me.focus(false, 10);
            }
        }
        ghostPanel.el.hide();
        ghostPanel.setHiddenState(true);
    },

    /**
     * Create, hide, or show the header component as appropriate based on the current config.
     * @private
     * @param {Boolean} force True to force the header to be created
     */
    updateHeader: function(force) {
        var me = this,
            header = me.header,
            title = me.getTitle(),
            tools = me.tools,
            icon = me.getIcon(),
            glyph = me.getGlyph(),
            iconCls = me.getIconCls(),
            hasIcon = glyph || icon || iconCls,
            ariaDom = me.ariaEl.dom,
            headerPosition = me.getHeaderPosition(),
            vertical = headerPosition === 'left' || headerPosition === 'right',
            headingEl, ariaAttr;
        
        if (Ext.isObject(header) || (header !== false && (force || (title || hasIcon) ||
                (tools && tools.length) || (me.collapsible && !me.titleCollapse)))) {
            if (header && header.isHeader) {
                header.show();
            }
            else {
                // Apply the header property to the header config
                header = me.header = Ext.widget(Ext.merge({
                    xtype: 'header',
                    title: title,
                    titleAlign: me.getTitleAlign(),
                    vertical: vertical,
                    dock: me.getHeaderPosition() || 'top',
                    titleRotation: me.getTitleRotation(),
                    textCls: me.headerTextCls,
                    iconCls: iconCls,
                    iconAlign: me.getIconAlign(),
                    icon: icon,
                    glyph: glyph,
                    baseCls: me.baseCls + '-header',
                    tools: tools,
                    ui: me.ui,
                    id: me.id + '_header',
                    overCls: me.headerOverCls,
                    indicateDrag: me.draggable,
                    frame: (me.frame || me.alwaysFramed) && me.frameHeader,
                    ignoreParentFrame : me.frame || me.overlapHeader,
                    ignoreBorderManagement: me.frame || me.ignoreHeaderBorderManagement,
                    isAccordionHeader: me.isAccordionPanel,
                    ownerCt: me,
                    synthetic: true, // not user-defined
                    listeners: me.collapsible && me.titleCollapse ? {
                        click: me.toggleCollapse,
                        scope: me
                    } : null
                }, me.header));
                
                // Header's onAdd mutates the tools array.
                // It replaces tool configs at each index with the instantiated tool
                // It also injects the tool instances as properties keyed by their type.
                me.addDocked(header, 0);
            }
            
            // Accordion panels are tightly coupled to their headers' titleCmp
            // via aria-labelledby attribute. There should be no aria-label.
            if (me.isAccordionPanel) {
                if (ariaDom) {
                    ariaDom.setAttribute('aria-labelledby', header.id + '-title');
                    ariaDom.removeAttribute('aria-label');
                }
                else {
                    ariaAttr = me.ariaRenderAttributes || (me.ariaRenderAttributes = {});
                    ariaAttr['aria-labelledby'] = header.id + '-title';
                    delete ariaAttr['aria-label'];
                }
            }
            else {
                if (title) {
                    // If the panel is not an ARIA a region, it still should have
                    // an accessible name via aria-labelledby attribute unless
                    // it is a tabpanel in which case aria-labelledby points
                    // to the corresponding tab and is managed by TabPanel class.
                    if (me.ariaRole !== 'tabpanel') {
                        if (ariaDom) {
                            ariaDom.setAttribute('aria-labelledby', header.id + '-title-textEl');
                            ariaDom.removeAttribute('aria-label');
                        }
                        else {
                            ariaAttr = me.ariaRenderAttributes || (me.ariaRenderAttributes = {});
                            ariaAttr['aria-labelledby'] = header.id + '-title-textEl';
                            delete ariaAttr['aria-label'];
                        }
                    }
                }
                
                // If there is no title, just make sure no aria-label attribute was added
                else if (me.ariaRenderAttributes) {
                    delete me.ariaRenderAttributes['aria-label'];
                }
            }
        }
        else {
            if (header) {
                header.hide();
            }
            
            // Title may contain HTML markup
            title = Ext.util.Format.stripTags(title);
            
            // aria-labelledby could have been set by the TabPanel.onAdd()
            if (ariaDom) {
                if (!ariaDom.hasAttribute('aria-labelledby')) {
                    if (title) {
                        ariaDom.setAttribute('aria-label', title);
                    }
                    else {
                        ariaDom.removeAttribute('aria-label');
                    }
                }
            }
            else {
                ariaAttr = me.ariaRenderAttributes || (me.ariaRenderAttributes = {});
                
                if (!ariaAttr['aria-labelledby']) {
                    if (title) {
                        ariaAttr['aria-label'] = title;
                    }
                    else {
                        delete ariaAttr['aria-label'];
                    }
                }
            }
        }

        // If the panel is a child of the Viewport that has border layout,
        // that automatically makes it a region unless the user overrode that.
        if (me.isViewportBorderChild && !me.hasOwnProperty('ariaRole')) {
            me.ariaRole = 'region';
        }
        
        //<debug>
        if (Ext.enableAriaPanels && me.ariaRole === 'region' && !title) {
            Ext.log.warn("Panel " + me.id + " is a region section of the application, " +
                         "but it does not have a title. Per WAI-ARIA, all regions " +
                         "should have a heading element that contains region's title.");
        }
        //</debug>
        
        // An ARIA region should have a title, and a heading which we implement
        // as an element placed before all other elements within the panel's
        // main element. The headingEl is hidden via clipping to avoid
        // visual impact while still allowing it to be published to
        // Assistive Technologies such as screen readers.
        if (title && me.ariaRole === 'region') {
            headingEl = me.headingEl;
            
            if (headingEl) {
                headingEl.setHtml(title);
            }
            else {
                if (me.rendered) {
                    me.headingEl = Ext.dom.Helper.insertFirst(me.el, {
                        tag: 'div',
                        id: me.id + '-headingEl',
                        role: 'heading',
                        'class': Ext.baseCSSPrefix + 'hidden-clip',
                        style: 'height:0',
                        html: title
                    }, true);
                    
                    ariaDom.removeAttribute('aria-label');
                    ariaDom.setAttribute('aria-labelledby', me.id + '-headingEl');
                }
                else {
                    me.headingText = me.title;
                    
                    ariaAttr = me.ariaRenderAttributes || (me.ariaRenderAttributes = {});
                    ariaAttr['aria-labelledby'] = me.id + '-headingEl';
                    delete ariaAttr['aria-label'];
                }
            }
        }
        else if (me.headingEl) {
            me.headingEl.destroy();
            me.headingEl = null;
        }
    },

    // ***********************************************************************************
    // End Methods
    // ***********************************************************************************
    // </editor-fold>
    
    statics: {
        floatCls: Ext.baseCSSPrefix + 'border-region-slide-in'
    },

    privates: {
        addUIToElement: function() {
            var me = this;

            me.callParent(arguments);
            me.addBodyCls(me.baseCls + '-body-' + me.ui);
        },

        applyTargetCls: function(targetCls) {
            this.getProtoBody().addCls(targetCls);
        },

        getDefaultContentTarget: function() {
            return this.body;
        },

        getTargetEl: function() {
            var me = this;
            return me.body || me.protoBody || me.frameBody || me.el;
        },

        /**
         * @private
         */
        initDraggable: function() {
            var me = this;

            // For just simple dragging like Windows
            if (me.simpleDrag) {
                me.initSimpleDraggable();
            }
            // For DD package aware dragging of Panels
            else {
                /**
                 * @property {Ext.dd.DragSource/Ext.util.ComponentDragger} dd
                 *
                 * Only present if this Panel has been configured with {@link #cfg-draggable} `true`.
                 *
                 * ##Simple dragging##
                 *
                 * If this Panel is configured {@link #cfg-simpleDrag} `true` (the default is `false`), this property
                 * will reference an instance of {@link Ext.util.ComponentDragger} (A subclass of
                 * {@link Ext.dd.DragTracker DragTracker}) which handles moving the Panel's DOM Element,
                 * and constraining according to the {@link #constrain} and {@link #constrainHeader} .
                 *
                 * This object fires various events during its lifecycle and during a drag operation.
                 *
                 * ##Complex dragging interacting with other DragDrop instances##
                 *
                 * By default, this property in a {@link #cfg-draggable} Panel will contain an instance of {@link
                    * Ext.dd.DragSource} which handles dragging the Panel.
                 *
                 * The developer must provide implementations of the abstract methods of {@link Ext.dd.DragSource} in order to
                 * supply behaviour for each stage of the drag/drop process. 
                 * 
                 * See also {@link #cfg-draggable}.
                 */
                me.dd = new Ext.panel.DD(me, Ext.isBoolean(me.draggable) ? null : me.draggable);
            }
        },

        initResizable: function() {
            this.callParent(arguments);
            if (this.collapsed) {
                this.resizer.disable();
            }
        },

        /**
         * @private
         * Override Component.initDraggable.
         * Panel (and subclasses) use the header element as the delegate.
         */
        initSimpleDraggable: function() {
            var me = this,
                ddConfig, dd;

            if (!me.header) {
                me.updateHeader(true);
            }

            /*
             * Check the header here again. If for whatever reason it wasn't created in
             * updateHeader (we were configured with header: false) then we'll just ignore the rest since the
             * header acts as the drag handle.
             */
            if (me.header) {
                ddConfig = Ext.applyIf({
                    el: me.el,
                    delegate: '#' + me.header.id
                }, me.draggable);

                // Add extra configs if Window is specified to be constrained
                if (me.constrain || me.constrainHeader) {
                    ddConfig.constrain = me.constrain;
                    ddConfig.constrainDelegate = me.constrainHeader;
                    ddConfig.constrainTo = me.constrainTo || me.container;
                }

                dd = me.dd = new Ext.util.ComponentDragger(me, ddConfig);
                me.relayEvents(dd, ['dragstart', 'drag', 'dragend']);
                if (me.maximized) {
                    dd.disable();
                }
            }
        },

        removeUIFromElement: function() {
            var me = this;

            me.callParent(arguments);
            me.removeBodyCls(me.baseCls + '-body-' + me.ui);
        },

        setupRenderTpl: function (renderTpl) {
            this.callParent(arguments);
            this.setupDockingRenderTpl(renderTpl);
        },

        slideOutFloatedPanel: function(preventAnimate) {
            var me = this,
                compEl = me.el,
                collapseDirection,
                afterSlideOut = function() {
                    me.slideOutFloatedPanelEnd();
                    // this would be in slideOutFloatedPanelEnd except that the only other
                    // caller removes this cls later
                    me.el.removeCls(Ext.baseCSSPrefix + 'border-region-slide-in');
                };

            if (me.isSliding || me.destroyed) {
                return;
            }

            me.isSliding = true;
            me.floated = false;

            me.slideOutFloatedPanelBegin();
            if (preventAnimate) {
                compEl.hide();
                return afterSlideOut();
            }

            if (typeof me.collapsed === 'string') {
                collapseDirection = me.convertCollapseDir(me.collapsed);
            }

            compEl.slideOut(collapseDirection, {
                preserveScroll: true,
                duration: Ext.Number.from(me.animCollapse, Ext.fx.Anim.prototype.duration),
                listeners: {
                    afteranimate: afterSlideOut
                }
            });
        },

        /**
         * This method begins the slide out of the floated panel.
         * @private
         */
        slideOutFloatedPanelBegin: function() {
            var me = this,
                placeholderEl = me.placeholder.el,
                el = me.el;

            me.collapsed = me.floatedFromCollapse;
            me.setHiddenState(true);
            me.floatedFromCollapse = null;

            // Remove mouse leave/enter monitors
            placeholderEl.un('mouseleave', me.onMouseLeaveFloated, me);
            el.un('mouseleave', me.onMouseLeaveFloated, me);
            placeholderEl.un('mouseenter', me.onMouseEnterFloated, me);
            el.un('mouseenter', me.onMouseEnterFloated, me);
        },

        /**
         * This method cleans up after the slide out of the floated panel.
         * @private
         */
        slideOutFloatedPanelEnd: function(suppressEvents) {
            var me = this;

            if (me.collapseTool) {
                me.collapseTool.el.show();
            }
            me.slideOutTask.cancel();
            me.isSliding = false;
            if (!suppressEvents) {
                me.fireEvent('unfloat', me);
            }
        }

    } // private
}, function() {
    var proto = this.prototype;

    proto.animCollapse = Ext.enableFx;
    proto.placeholderCollapseHideMode = Ext.Element.VISIBILITY;
});
