Ext.define('Ext.aria.Component', {
    override: 'Ext.Component',

    requires: [
        'Ext.aria.FocusManager'
    ],
    
    /**
     * @cfg {String} [ariaRole] ARIA role for this Component, defaults to no role.
     * With no role, no other ARIA attributes are set.
     */
    
    /**
     * @cfg {String} [ariaLabel] ARIA label for this Component. It is best to use
     * {@link #ariaLabelledBy} option instead, because screen readers prefer
     * aria-labelledby attribute to aria-label. {@link #ariaLabel} and {@link #ariaLabelledBy}
     * config options are mutually exclusive.
     */
    
    /**
     * @cfg {String} [ariaLabelledBy] DOM selector for a child element that is to be used
     * as label for this Component, set in aria-labelledby attribute.
     * If the selector is by #id, the label element can be any existing element,
     * not necessarily a child of the main Component element.
     *
     * {@link #ariaLabelledBy} and {@link #ariaLabel} config options are mutually exclusive,
     * and ariaLabel has the higher precedence.
     */
    
    /**
     * @cfg {String} [ariaDescribedBy] DOM selector for a child element that is to be used
     * as description for this Component, set in aria-describedby attribute.
     * The selector works the same way as {@link #ariaLabelledBy}
     */
    
    /**
     * @cfg {Object} [ariaAttributes] An object containing ARIA attributes to be set
     * on this Component's ARIA element. Use this to set the attributes that cannot be
     * determined by the Component's state, such as `aria-live`, `aria-flowto`, etc.
     */
    
    /**
     * @cfg {Boolean} [ariaRenderAttributesToElement=true] ARIA attributes are usually
     * rendered into the main element of the Component using autoEl config option.
     * However for certain Components (form fields, etc.) the main element is
     * presentational and ARIA attributes should be rendered into child elements
     * of the Component markup; this is done using the Component templates.
     *
     * If this flag is set to `true` (default), the ARIA attributes will be applied
     * to the main element.
     * @private
     */
    ariaRenderAttributesToElement: true,

    statics: {
        ariaHighContrastModeCls: Ext.baseCSSPrefix + 'aria-highcontrast'
    },
    
    // Several of the attributes, like aria-controls and aria-activedescendant
    // need to refer to element ids which are not available at render time
    ariaApplyAfterRenderAttributes: function() {
        var me = this,
            role = me.ariaRole,
            attrs;
        
        if (role !== 'presentation') {
            attrs = me.ariaGetAfterRenderAttributes();
            me.ariaUpdate(attrs);
        }
    },
    
    ariaGetRenderAttributes: function() {
        var me = this,
            role = me.ariaRole,
            attrs = {
                role: role
            };
        
        // It does not make much sense to set ARIA attributes
        // on purely presentational Component, or on a Component
        // with no ARIA role specified
        if (role === 'presentation' || role === undefined) {
            return attrs;
        }

        if (me.hidden) {
            attrs['aria-hidden'] = true;
        }
        
        if (me.disabled) {
            attrs['aria-disabled'] = true;
        }

        if (me.ariaLabel) {
            attrs['aria-label'] = me.ariaLabel;
        }
        
        Ext.apply(attrs, me.ariaAttributes);
        
        return attrs;
    },

    ariaGetAfterRenderAttributes: function() {
        var me = this,
            attrs = {},
            el;
        
        if (!me.ariaLabel && me.ariaLabelledBy) {
            el = me.ariaGetLabelEl(me.ariaLabelledBy);
        
            if (el) {
                attrs['aria-labelledby'] = el.id;
            }
        }
        
        if (me.ariaDescribedBy) {
            el = me.ariaGetLabelEl(me.ariaDescribedBy);
            
            if (el) {
                attrs['aria-describedby'] = el.id;
            }
        }
        
        return attrs;
    },

    /**
     * Updates the component's element properties
     * @private
     * @param {Ext.Element} [el] The element to set properties on
     * @param {Object[]} props Array of properties (name: value)
     */
    ariaUpdate: function(el, props) {
        // The one argument form updates the default ariaEl
        if (arguments.length === 1) {
            props = el;
            el = this.ariaGetEl();
        }
        
        if (!el) {
            return;
        }
        
        el.set(props);
    },

    /**
     * Return default ARIA element for this Component
     * @private
     * @return {Ext.Element} ARIA element
     */
    ariaGetEl: function() {
        return this.el;
    },
    
    /**
     * @private
     * Return default ARIA labelled-by element for this Component, if any
     *
     * @param {String} [selector] Element selector
     *
     * @return {Ext.Element} Label element, or null
     */
    ariaGetLabelEl: function(selector) {
        var me = this,
            el = null;
        
        if (selector) {
            if (/^#/.test(selector)) {
                selector = selector.replace(/^#/, '');
                el = Ext.get(selector);
            }
            else {
                el = me.ariaGetEl().down(selector);
            }
        }
        
        return el;
    },
    
    // Unlike getFocusEl, this one always returns Ext.Element
    ariaGetFocusEl: function() {
        var el = this.getFocusEl();
        
        while (el.isComponent) {
            el = el.getFocusEl();
        }
        
        return el;
    },
    
    onFocus: function(e, t, eOpts) {
        var me = this,
            mgr = Ext.aria.FocusManager,
            tip, el;

        me.callParent(arguments);
        
        if (me.tooltip && Ext.quickTipsActive) {
            tip = Ext.tip.QuickTipManager.getQuickTip();
            el  = me.ariaGetEl();
            
            tip.cancelShow(el);
            tip.showByTarget(el);
        }

        if (me.hasFocus && mgr.enabled) {
            return mgr.onComponentFocus(me);
        }
    },

    onBlur: function(e, t, eOpts) {
        var me = this,
            mgr = Ext.aria.FocusManager;
            
        me.callParent(arguments);
        
        if (me.tooltip && Ext.quickTipsActive) {
            Ext.tip.QuickTipManager.getQuickTip().cancelShow(me.ariaGetEl());
        }
        
        if (!me.hasFocus && mgr.enabled) {
            return mgr.onComponentBlur(me);
        }
    },

    onDisable: function() {
        var me = this;
        
        me.callParent(arguments);
        me.ariaUpdate({ 'aria-disabled': true });
    },

    onEnable: function() {
        var me = this;
        
        me.callParent(arguments);
        me.ariaUpdate({ 'aria-disabled': false });
    },

    onHide: function() {
        var me = this;
        
        me.callParent(arguments);
        me.ariaUpdate({ 'aria-hidden': true });
    },

    onShow: function() {
        var me = this;
        
        me.callParent(arguments);
        me.ariaUpdate({ 'aria-hidden': false });
    }
},
function() {
    function detectHighContrastMode() {
        /* Absolute URL for test image
         * (data URIs are not supported by all browsers, and not properly removed when images are disabled in Firefox) */
        var imgSrc = "http://www.html5accessibility.com/tests/clear.gif",
            supports = {},
            div = document.createElement("div"),
            divEl = Ext.get(div),
            divStyle = div.style,
            img = document.createElement("img"),
            supports = {
                images: true,
                backgroundImages: true,
                borderColors: true,
                highContrastMode: false,
                lightOnDark: false
            };

        /* create div for testing if high contrast mode is on or images are turned off */
        div.id = "ui-helper-high-contrast";
        div.className = "ui-helper-hidden-accessible";
        divStyle.borderWidth = "1px";
        divStyle.borderStyle = "solid";
        divStyle.borderTopColor = "#F00";
        divStyle.borderRightColor = "#FF0";
        divStyle.backgroundColor = "#FFF";
        divStyle.width = "2px";

        /* For IE, div must be wider than the image inside it when hidden off screen */
        img.alt = "";
        div.appendChild(img);
        document.body.appendChild(div);
        divStyle.backgroundImage = "url(" + imgSrc + ")";

        img.src = imgSrc;

        var getColorValue = function(colorTxt) {
            var values = [],
                colorValue = 0,
                match;
            
            if (colorTxt.indexOf("rgb(") !== -1) {
                values = colorTxt.replace("rgb(", "").replace(")", "").split(", ");
            }
            else if (colorTxt.indexOf("#") !== -1) {
                match = colorTxt.match(colorTxt.length === 7 ? /^#(\S\S)(\S\S)(\S\S)$/ : /^#(\S)(\S)(\S)$/);
                
                if (match) {
                    values = ["0x" + match[1], "0x" + match[2], "0x" + match[3]];
                }
            }
            
            for (var i = 0; i < values.length; i++) {
                colorValue += parseInt(values[i]);
            }
            
            return colorValue;
        };

        var performCheck = function(event) {
            var bkImg = divEl.getStyle("backgroundImage"),
                body = Ext.getBody();

            supports.images = img.offsetWidth === 1;
            supports.backgroundImages = !(bkImg !== null && (bkImg === "none" || bkImg === "url(invalid-url:)"));
            supports.borderColors = !(divEl.getStyle("borderTopColor") === divEl.getStyle("borderRightColor"));
            supports.highContrastMode = !supports.images || !supports.backgroundImages;
            supports.lightOnDark = getColorValue(divEl.getStyle("color")) - getColorValue(divEl.getStyle("backgroundColor")) > 0;

            if (Ext.isIE) {
                div.outerHTML = "";
                /* prevent mixed-content warning, see http://support.microsoft.com/kb/925014 */
            } else {
                document.body.removeChild(div);
            }
        };

        performCheck();
        
        return supports;
    }
    
    Ext.enableAria = true;
    
    Ext.onReady(function() {
        var supports = Ext.supports,
            flags, div;
        
        flags = Ext.isWindows ? detectHighContrastMode() : {};
        
        supports.HighContrastMode = !!flags.highContrastMode;
        
        if (supports.HighContrastMode) {
            Ext.getBody().addCls(Ext.Component.ariaHighContrastModeCls);
        }
    });
});
