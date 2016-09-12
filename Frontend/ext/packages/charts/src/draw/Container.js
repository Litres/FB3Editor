/**
 * The container that holds and manages instances of the {@link Ext.draw.Surface}
 * in which sprites are rendered.
 *
 * One way to create a draw container is:
 *
 *      var drawContainer = Ext.create('Ext.draw.Container', {
 *           renderTo: Ext.getBody(),
 *           width:200,
 *           height:200,
 *           sprites: [{
 *                type: 'circle',
 *                fillStyle: '#79BB3F',
 *                r: 100,
 *                x: 100,
 *                y: 100
 *           }]
 *      });
 *
 * In this case we created a draw container and added a sprite to it.
 * The *type* of the sprite is *circle*, so if you run this code you'll see a green circle.
 *
 * One can attach sprite event listeners to the draw container with the help of the
 * {@link Ext.draw.plugin.SpriteEvents} plugin.
 *
 * For more information on Sprites, the core elements added to a draw container's surface,
 * refer to the {@link Ext.draw.sprite.Sprite} documentation.
 */
Ext.define('Ext.draw.Container', {
    extend: 'Ext.draw.ContainerBase',
    alternateClassName: 'Ext.draw.Component',
    xtype: 'draw',
    defaultType: 'surface',
    isDrawContainer: true,

    requires: [
        'Ext.draw.Surface',
        'Ext.draw.engine.Svg',
        'Ext.draw.engine.Canvas',
        'Ext.draw.gradient.GradientDefinition'
    ],
    /**
     * @cfg {String} [engine="Ext.draw.engine.Canvas"]
     * Defines the engine (type of surface) used to render draw container contents.  
     * 
     * The render engine is selected automatically depending on the platform used. Priority 
     * is given to the {@link Ext.draw.engine.Canvas} engine due to its performance advantage.
     *
     * You may also set the engine config to be `Ext.draw.engine.Svg` if so desired.
     */
    engine: 'Ext.draw.engine.Canvas',

    /**
     * @event spritemousemove
     * Fires when the mouse is moved on a sprite.
     * @param {Object} sprite
     * @param {Event} event
     */

    /**
     * @event spritemouseup
     * Fires when a mouseup event occurs on a sprite.
     * @param {Object} sprite
     * @param {Event} event
     */

    /**
     * @event spritemousedown
     * Fires when a mousedown event occurs on a sprite.
     * @param {Object} sprite
     * @param {Event} event
     */

    /**
     * @event spritemouseover
     * Fires when the mouse enters a sprite.
     * @param {Object} sprite
     * @param {Event} event
     */

    /**
     * @event spritemouseout
     * Fires when the mouse exits a sprite.
     * @param {Object} sprite
     * @param {Event} event
     */

    /**
     * @event spriteclick
     * Fires when a click event occurs on a sprite.
     * @param {Object} sprite
     * @param {Event} event
     */

    /**
     * @event spritedblclick
     * Fires when a double click event occurs on a sprite.
     * @param {Object} sprite
     * @param {Event} event
     */

    /**
     * @event spritetap
     * Fires when a tap event occurs on a sprite.
     * @param {Object} sprite
     * @param {Event} event
     */

    /**
     * @event bodyresize
     * Fires when the size of the draw container body changes.
     * @param {Object} size The object containing 'width' and 'height' of the draw container's body.
     */

    config: {
        cls: Ext.baseCSSPrefix + 'draw-container',

        /**
         * @cfg {Function} [resizeHandler]
         * The resize function that can be configured to have a behavior,
         * e.g. resize draw surfaces based on new draw container dimensions.
         *
         * __Note:__ since resize events trigger {@link #renderFrame} calls automatically,
         * return `false` from the resize function, if it also calls `renderFrame`,
         * to prevent double rendering.
         */
        resizeHandler: null,

        /**
         * @cfg {Object[]} sprites
         * Defines a set of sprites to be added to the drawContainer surface.
         *
         * For example:
         *
         *      sprites: [{
         *           type: 'circle',
         *           fillStyle: '#79BB3F',
         *           r: 100,
         *           x: 100,
         *           y: 100
         *      }]
         * 
         */
        sprites: null,

        /**
         * @cfg {Object[]} gradients
         * Defines a set of gradients that can be used as color properties
         * (fillStyle and strokeStyle, but not shadowColor) in sprites.
         * The gradients array is an array of objects with the following properties:
         * - **id** - string - The unique name of the gradient.
         * - **type** - string, optional - The type of the gradient. Available types are: 'linear', 'radial'. Defaults to 'linear'.
         * - **angle** - number, optional - The angle of the gradient in degrees.
         * - **stops** - array - An array of objects with 'color' and 'offset' properties, where 'offset' is a real number from 0 to 1.
         *
         * For example:
         *
         *     gradients: [{
         *         id: 'gradientId1',
         *         type: 'linear',
         *         angle: 45,
         *         stops: [{
         *             offset: 0,
         *             color: 'red'
         *         }, {
         *            offset: 1,
         *            color: 'yellow'
         *         }]
         *     }, {
         *        id: 'gradientId2',
         *        type: 'radial',
         *        stops: [{
         *            offset: 0,
         *            color: '#555',
         *        }, {
         *            offset: 1,
         *            color: '#ddd',
         *        }]
         *     }]
         *
         * Then the sprites can use 'gradientId1' and 'gradientId2' by setting the color attributes to those ids, for example:
         *
         *     sprite.setAttributes({
         *         fillStyle: 'url(#gradientId1)',
         *         strokeStyle: 'url(#gradientId2)'
         *     });
         */
        gradients: []
    },

    /**
     * @property {String} [defaultDownloadServerUrl="http://svg.sencha.io"]
     * The default URL used by {@link #download}.
     */
    defaultDownloadServerUrl: 'http://svg.sencha.io',

    /**
     * @property {Array} [supportedFormats=["png", "pdf", "jpeg", "gif"]]
     * A list of export types supported by the server.
     * @private
     */
    supportedFormats: ['png', 'pdf', 'jpeg', 'gif'],

    supportedOptions: {
        version: Ext.isNumber,
        data: Ext.isString,
        format: function (format) {
            return Ext.Array.indexOf(this.supportedFormats, format) >= 0;
        },
        filename: Ext.isString,
        width: Ext.isNumber,
        height: Ext.isNumber,
        scale: Ext.isNumber,
        pdf: Ext.isObject,
        jpeg: Ext.isObject
    },

    initAnimator: function() {
        this.frameCallbackId = Ext.draw.Animator.addFrameCallback('renderFrame', this);
    },

    applyGradients: function (gradients) {
        var result = [],
            i, n, gradient, offset;
        if (!Ext.isArray(gradients)) {
            return result;
        }
        for (i = 0, n = gradients.length; i < n; i++) {
            gradient = gradients[i];
            if (!Ext.isObject(gradient)) {
                continue;
            }
            // ExtJS only supported linear gradients, so we didn't have to specify their type
            if (typeof gradient.type !== 'string') {
                gradient.type = 'linear';
            }
            if (gradient.angle) {
                gradient.degrees = gradient.angle;
                delete gradient.angle;
            }
            // Convert ExtJS stops object to Touch stops array
            if (Ext.isObject(gradient.stops)) {
                gradient.stops = (function (stops) {
                    var result = [], stop;
                    for (offset in stops) {
                        stop = stops[offset];
                        stop.offset = offset / 100;
                        result.push(stop);
                    }
                    return result;
                })(gradient.stops);
            }
            result.push(gradient);
        }
        Ext.draw.gradient.GradientDefinition.add(result);
        return result;
    },

    applySprites: function (sprites) {
        // Never update.
        if (!sprites) {
            return;
        }

        sprites = Ext.Array.from(sprites);

        var ln = sprites.length,
            result = [],
            i, surface, sprite;

        for (i = 0; i < ln; i++) {
            sprite = sprites[i];
            surface = sprite.surface;
            if (!(surface && surface.isSurface)) {
                if (Ext.isString(surface)) {
                    surface = this.getSurface(surface);
                } else {
                    surface = this.getSurface('main');
                }
            }
            sprite = surface.add(sprite);
            result.push(sprite);
        }

        return result;
    },

    onBodyResize: function () {
        // See the following:
        // Classic: Ext.draw.ContainerBase.reattachToBody
        //  Modern: Ext.draw.ContainerBase.initialize
        var el = this.element,
            size;

        if (!el) {
            return;
        }

        size = el.getSize();
        if (size.width && size.height) {
            this.setBodySize(size);
        }
    },

    setBodySize: function (size) {
        var me = this,
            resizeHandler = me.getResizeHandler() || me.defaultResizeHandler,
            result;

        me.fireEvent('bodyresize', me, size);
        result = resizeHandler.call(me, size);
        if (result !== false) {
            me.renderFrame();
        }
    },

    defaultResizeHandler: function (size) {
        this.getItems().each(function (surface) {
            surface.setRect([0, 0, size.width, size.height]);
        });
    },

    /**
     * Get a surface by the given id or create one if it doesn't exist.
     * @param {String} [id="main"]
     * @return {Ext.draw.Surface}
     */
    getSurface: function (id) {
        id = this.getId() + '-' + (id || 'main');

        var me = this,
            surfaces = me.getItems(),
            surface = surfaces.get(id);

        if (!surface) {
            surface = me.add({xclass: me.engine, id: id});
            me.onBodyResize();
        }
        return surface;
    },

    /**
     * Render all the surfaces in the container.
     */
    renderFrame: function () {
        var me = this,
            surfaces = me.getItems(),
            i, ln, item;

        for (i = 0, ln = surfaces.length; i < ln; i++) {
            item = surfaces.items[i];
            if (item.isSurface) {
                item.renderFrame();
            }
        }
    },

    /**
     * Produces an image of the chart / drawing.
     * @param {String} [format] Possible options are 'image' (the method will return an 
     * Image object) and 'stream' (the method will return the image as a byte stream).  
     * If missing, the DataURL of the drawing's (or chart's) image will be returned.
     * @return {Object}
     * @return {String} return.data Image element, byte stream or DataURL.
     * @return {String} return.type The type of the data (e.g. 'png' or 'svg').
     */
    getImage: function (format) {
        var size = this.innerElement.getSize(),
            surfaces = Array.prototype.slice.call(this.items.items),
            image, imageElement,
            zIndexes = this.surfaceZIndexes,
            i, j, surface, zIndex;

        // Sort the surfaces by zIndex using insertion sort.
        for (j = 1; j < surfaces.length; j++) {
            surface = surfaces[j];
            zIndex = zIndexes[surface.type];
            i = j - 1;
            while (i >= 0 && zIndexes[surfaces[i].type] > zIndex) {
                surfaces[i + 1] = surfaces[i];
                i--;
            }
            surfaces[i + 1] = surface;
        }

        image = surfaces[0].flatten(size, surfaces);

        if (format === 'image') {
            imageElement = new Image();
            imageElement.src = image.data;
            image.data = imageElement;
            return image;
        }
        if (format === 'stream') {
            image.data = image.data.replace(/^data:image\/[^;]+/, 'data:application/octet-stream');
            return image;
        }
        return image;
    },

    /**
     * Downloads an image or PDF of the chart / drawing or opens it in a separate 
     * browser tab/window if the download can't be triggered. The exact behavior is 
     * platform and browser specific. For more consistent results on mobile devices use 
     * the {@link #preview} method instead.
     *
     * @param {Object} [config] The following config options are supported:
     *
     * @param {String} config.url The url to post the data to. Defaults to
     * the {@link #defaultDownloadServerUrl} configuration on the class.
     *
     * @param {String} config.format The format of image to export. See the
     * {@link #supportedFormats}. Defaults to 'png' on the Sencha IO server.
     * Note that you can't export to 'svg' format if the {@link Ext.draw.engine.Canvas Canvas}
     * {@link Ext.draw.Container#engine engine} is used.
     *
     * @param {Number} config.width A width to send to the server for
     * configuring the image width. Defaults to natural image width on
     * the Sencha IO server.
     *
     * @param {Number} config.height A height to send to the server for
     * configuring the image height. Defaults to natural image height on
     * the Sencha IO server.
     *
     * @param {String} config.filename The filename of the downloaded image.
     * Defaults to 'chart' on the Sencha IO server. The config.format is used
     * as a filename extension.
     *
     * @param {Number} config.scale The scaling of the downloaded image.
     * Defaults to 1 on the Sencha IO server. The server will try to determine the natural
     * size of the image unless the width/height configs have been set. If the
     * {@link Ext.draw.engine.Canvas Canvas} {@link Ext.draw.Container#engine engine} is
     * used the natural image size will depend on the value of the window.devicePixelRatio.
     * For example, for devices with devicePixelRatio of 2 the produced image will be
     * two times larger than for devices with devicePixelRatio of 1 for the same drawing.
     * This is done so that the users with devices with HiDPI screens get a downloaded
     * image that looks as crisp on their device as the original drawing.
     * If you want image size to be consistent across devices with different device
     * pixel ratios, you can set the value of this config to 1/devicePixelRatio.
     * This parameter is ignored by the Sencha IO server if config.format is set to 'svg'.
     *
     * @param {Object} config.pdf PDF specific options.
     * This config is only used if config.format is set to 'pdf'.
     * The given object should be in either this format:
     *
     *     {
     *       width: '200px',
     *       height: '300px',
     *       border: '0px'
     *     }
     *
     * or this format:
     *
     *     {
     *       format: 'A4',
     *       orientation: 'portrait',
     *       border: '1cm'
     *     }
     *
     * Supported dimension units are: 'mm', 'cm', 'in', 'px'. No unit means 'px'.
     * Supported formats are: 'A3', 'A4', 'A5', 'Legal', 'Letter', 'Tabloid'.
     * Orientation ('portrait', 'landscape') is optional and defaults to 'portrait'.
     *
     * @param {Object} config.jpeg JPEG specific options.
     * This config is only used if config.format is set to 'jpeg'.
     * The given object should be in this format:
     *
     *     {
     *       quality: 80
     *     }
     *
     * Where quality is an integer between 0 and 100.
     *
     * @return {Boolean} True if request was successfully sent to the server.
     */
    download: function (config) {
        var me = this,
            inputs = [],
            markup, name, value;

        config = Ext.apply({
            version: 2,
            data: me.getImage().data
        }, config);

        for (name in config) {
            if (config.hasOwnProperty(name)) {
                value = config[name];
                if (name in me.supportedOptions) {
                    if (me.supportedOptions[name].call(me, value)) {
                        inputs.push({
                            tag: 'input',
                            type: 'hidden',
                            name: name,
                            value: Ext.String.htmlEncode(
                                Ext.isObject(value) ? Ext.JSON.encode(value) : value
                            )
                        });
                    }
                    //<debug>
                    else {
                        Ext.log.error('Invalid value for image download option "' + name + '": ' + value);
                    }
                    //</debug>
                }
                //<debug>
                else {
                    Ext.log.error('Invalid image download option: "' + name + '"');
                }
                //</debug>
            }
        }

        markup = Ext.dom.Helper.markup({
            tag: 'html',
            children: [
                {tag: 'head'},
                {
                    tag: 'body',
                    children: [
                        {
                            tag: 'form',
                            method: 'POST',
                            action: config.url || me.defaultDownloadServerUrl,
                            children: inputs
                        },
                        {
                            tag: 'script',
                            type: 'text/javascript',
                            children: 'document.getElementsByTagName("form")[0].submit();'
                        }
                    ]
                }
            ]
        });

        window.open('', 'ImageDownload_' + Date.now()).document.write(markup);
    },

    /**
     * @method preview
     * Displays an image of a Ext.draw.Container on screen.
     * On mobile devices this lets users tap-and-hold to bring up the menu
     * with image saving options.
     * Note: some browsers won't save the preview image if it's SVG based
     * (i.e. generated from a draw container that uses 'Ext.draw.engine.Svg' engine).
     * And some platforms may not have the means of viewing successfully saved SVG images.
     */

    destroy: function () {
        var callbackId = this.frameCallbackId;
        if (callbackId) {
            Ext.draw.Animator.removeFrameCallback(callbackId);
        }
        this.callParent();
    }

}, function () {
    if (location.search.match('svg')) {
        Ext.draw.Container.prototype.engine = 'Ext.draw.engine.Svg';
    } else if ((Ext.os.is.BlackBerry && Ext.os.version.getMajor() === 10) || (Ext.browser.is.AndroidStock4 && (Ext.os.version.getMinor() === 1 || Ext.os.version.getMinor() === 2 || Ext.os.version.getMinor() === 3))) {
        // http://code.google.com/p/android/issues/detail?id=37529
        Ext.draw.Container.prototype.engine = 'Ext.draw.engine.Svg';
    }
});
