/**
 * Simple helper class for easily creating image components. This renders an image tag to
 * the DOM with the configured src.
 *
 * {@img Ext.Img/Ext.Img.png Ext.Img component}
 *
 * ## Example usage:
 *
 *     var changingImage = Ext.create('Ext.Img', {
 *         src: 'http://www.sencha.com/img/20110215-feat-html5.png',
 *         width: 184,
 *         height: 90,
 *         renderTo: Ext.getBody()
 *     });
 *
 *     // change the src of the image programmatically
 *     changingImage.setSrc('http://www.sencha.com/img/20110215-feat-perf.png');
 *
 * By default, only an img element is rendered and that is this component's primary
 * {@link Ext.Component#getEl element}. If the {@link Ext.Component#autoEl} property
 * is other than 'img' (the default), the a child img element will be added to the primary
 * element. This can be used to create a wrapper element around the img.
 *
 * ## Wrapping the img in a div:
 *
 *     var wrappedImage = Ext.create('Ext.Img', {
 *         src: 'http://www.sencha.com/img/20110215-feat-html5.png',
 *         autoEl: 'div', // wrap in a div
 *         renderTo: Ext.getBody()
 *     });
 *
 * ## Image Dimensions
 *
 * You should include height and width dimensions for any image owned by a parent 
 * container.  By omitting dimensions, an owning container will not know how to 
 * size and position the image in the initial layout.
 */
Ext.define('Ext.Img', {
    extend: 'Ext.Component',
    alias: ['widget.image', 'widget.imagecomponent'],

    autoEl: 'img',

    baseCls: Ext.baseCSSPrefix + 'img',

    config: {
        /**
         * @cfg {String} src The source of this image. See {@link Ext#resolveResource} for
         * details on locating application resources.
         * @accessor
         */
        src: null
    },

    /**
     * @cfg {String} alt
     * The descriptive text for non-visual UI description.
     */
    alt: '',

    /**
     * @cfg {String} title
     * Specifies addtional information about the image.
     */
    title: '',

    /**
     * @cfg {String} imgCls
     * Optional CSS classes to add to the img element.
     */
    imgCls: '',

    /**
     * @cfg {Number/String} glyph
     * A numeric unicode character code to serve as the image.  If this option is used
     * The image will be rendered using a div with innerHTML set to the html entity
     * for the given character code.  The default font-family for glyphs can be set
     * globally using {@link Ext#setGlyphFontFamily Ext.setGlyphFontFamily()}. Alternatively,
     * this config option accepts a string with the charCode and font-family separated by
     * the `@` symbol. For example '65@My Font Family'.
     */
    
    maskOnDisable: false,

    initComponent: function() {
        if (this.glyph) {
            this.autoEl = 'div';
        }

        this.callParent();
    },

    applySrc: function (src) {
        return src && Ext.resolveResource(src);
    },

    getElConfig: function() {
        var me = this,
            autoEl = me.autoEl,
            config = me.callParent(),
            glyphFontFamily = Ext._glyphFontFamily,
            glyph = me.glyph,
            img, glyphParts;

        // It is sometimes helpful (like in a panel header icon) to have the img wrapped
        // by a div. If our autoEl is not 'img' then we just add an img child to the el.
        if (autoEl === 'img' || (Ext.isObject(autoEl) && autoEl.tag === 'img')) {
            img = config;
        }
        else if (me.glyph) {
            if (typeof glyph === 'string') {
                glyphParts = glyph.split('@');
                glyph = glyphParts[0];
                glyphFontFamily = glyphParts[1] || glyphFontFamily;
            }
            
            config.html = '&#' + glyph + ';';
            
            if (glyphFontFamily) {
                config.style = config.style || {};
                config.style.fontFamily = glyphFontFamily;
            }
            
            // A glyph is a graphic which is not an <img> tag so it should have
            // the corresponding role for Accessibility interface to recognize
            config.role = 'img';
        }
        else {
            config.cn = [img = {
                tag: 'img',
                id: me.id + '-img'
            }];
        }

        if (img) {
            if (me.imgCls) {
                img.cls = (img.cls ? img.cls + ' ' : '') + me.imgCls;
            }

            img.src = me.src || Ext.BLANK_IMAGE_URL;
        }

        if (me.alt) {
            (img || config).alt = me.alt;
        }
        else {
            // Images that do not have alt attribute can't be properly announced
            // by screen readers. In best case they will be silently skipped;
            // in worst case screen reader will announce data url. Yes, that very long
            // base-64 encoded string. :/
            // That will make the application totally unusable for blind people.
            (img || config).alt = '';
            
            //<debug>
            Ext.log.warn('For WAI-ARIA compliance, IMG elements SHOULD have an alt attribute.');
            //</debug>
        }

        if (me.title) {
            (img || config).title = me.title;
        }

        return config;
    },

    onRender: function () {
        var me = this,
            autoEl = me.autoEl,
            el;

        me.callParent(arguments);

        el = me.el;
        
        if (autoEl === 'img' || (Ext.isObject(autoEl) && autoEl.tag === 'img')) {
            me.imgEl = el;
        } else {
            me.imgEl = el.getById(me.id + '-img');
        }
    },

    onDestroy: function () {
        var me = this,
            imgEl = me.imgEl;

        // Only clean up when the img is a child, otherwise it will get handled
        // by the element destruction in the parent
        if (imgEl && me.el !== imgEl) {
            imgEl.destroy();
        }
        this.imgEl = null;
        this.callParent();
    },

    getTitle: function () {
        return this.title;
    },

    /**
     * Updates the {@link #title} of the image.
     * @param {String} title
     */
    setTitle: function (title) {
        var me = this,
            imgEl = me.imgEl;

        me.title = title || '';

        if (imgEl) {
            imgEl.dom.title = title || '';
        }
    },

    getAlt: function () {
        return this.alt;
    },

    /**
     * Updates the {@link #alt} of the image.
     * @param {String} alt
     */
    setAlt: function (alt) {
        var me = this,
            imgEl = me.imgEl;

        me.alt = alt || '';

        if (imgEl) {
            imgEl.dom.alt = alt || '';
        }
    },

    updateSrc: function (src) {
        var imgEl = this.imgEl;

        if (imgEl) {
            imgEl.dom.src = src || Ext.BLANK_IMAGE_URL;
        }
    },

    /**
     * Updates the {@link #glyph} of the image.
     * @param {Number/String} glyph
     */
    setGlyph: function (glyph) {
        var me = this,
            glyphFontFamily = Ext._glyphFontFamily,
            old = me.glyph,
            el = me.el,
            glyphParts;

        me.glyph = glyph;
        if (me.rendered && glyph !== old) {
            if (typeof glyph === 'string') {
                glyphParts = glyph.split('@');
                glyph = glyphParts[0];
                glyphFontFamily = glyphParts[1] || glyphFontFamily;
            }

            el.dom.innerHTML = '&#' + glyph + ';';
            if (glyphFontFamily) {
                el.setStyle('font-family', glyphFontFamily);
            }
        }
    }
});