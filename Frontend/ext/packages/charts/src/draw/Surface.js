/**
 * A Surface is an interface to render methods inside a draw {@link Ext.draw.Container}.
 * A Surface contains methods to render sprites, get bounding boxes of sprites, add
 * sprites to the canvas, initialize other graphic components, etc. One of the most used
 * methods for this class is the `add` method, to add Sprites to the surface.
 *
 * Most of the Surface methods are abstract and they have a concrete implementation
 * in Canvas or SVG engines.
 *
 * A Surface instance can be accessed as a property of a draw container. For example:
 *
 *     drawContainer.getSurface('main').add({
 *         type: 'circle',
 *         fill: '#ffc',
 *         radius: 100,
 *         x: 100,
 *         y: 100
 *     });
 *     drawContainer.renderFrame();
 *
 * The configuration object passed in the `add` method is the same as described in the {@link Ext.draw.sprite.Sprite}
 * class documentation.
 *
 * ## Example
 *
 *     drawContainer.getSurface('main').add([
 *         {
 *             type: 'circle',
 *             radius: 10,
 *             fill: '#f00',
 *             x: 10,
 *             y: 10
 *         },
 *         {
 *             type: 'circle',
 *             radius: 10,
 *             fill: '#0f0',
 *             x: 50,
 *             y: 50
 *         },
 *         {
 *             type: 'circle',
 *             radius: 10,
 *             fill: '#00f',
 *             x: 100,
 *             y: 100
 *         },
 *         {
 *             type: 'rect',
 *             radius: 10,
 *             x: 10,
 *             y: 10
 *         },
 *         {
 *             type: 'rect',
 *             radius: 10,
 *             x: 50,
 *             y: 50
 *         },
 *         {
 *             type: 'rect',
 *             radius: 10,
 *             x: 100,
 *             y: 100
 *         }
 *     ]);
 *     drawContainer.renderFrame();
 *
 */
Ext.define('Ext.draw.Surface', {
    extend: 'Ext.draw.SurfaceBase',
    xtype: 'surface',

    requires: [
        'Ext.draw.sprite.*',
        'Ext.draw.gradient.*',
        'Ext.draw.sprite.AttributeDefinition',
        'Ext.draw.Matrix',
        'Ext.draw.Draw'
    ],

    uses: [
        'Ext.draw.engine.Canvas'
    ],

    /**
     * The reported device pixel density.
     * devicePixelRatio is only supported from IE11,
     * so we use deviceXDPI and logicalXDPI that are supported from IE6.
     */
    devicePixelRatio: window.devicePixelRatio || window.screen.deviceXDPI / window.screen.logicalXDPI,

    deprecated: {
        '5.1.0': {
            statics: {
                methods: {
                    /**
                     * @deprecated 5.1.0
                     * Stably sort the list of sprites by their zIndex.
                     * Deprecated, use the {@link Ext.Array#sort} method instead.
                     * @param {Array} list
                     * @return {Array} Sorted array.
                     */
                    stableSort: function (list) {
                        return Ext.Array.sort(list, function (a, b) {
                            return a.attr.zIndex - b.attr.zIndex;
                        });
                    }
                }
            }
        }
    },

    config: {
        cls: Ext.baseCSSPrefix + 'surface',
        /**
         * @cfg {Array}
         * The [x, y, width, height] rect of the surface related to its container.
         */
        rect: null,

        /**
         * @cfg {Object}
         * Background sprite config of the surface.
         */
        background: null,

        /**
         * @cfg {Array}
         * Array of sprite instances.
         */
        items: [],

        /**
         * @cfg {Boolean}
         * Indicates whether the surface needs to redraw.
         */
        dirty: false,

        /**
         * @cfg {Boolean} flipRtlText
         * If the surface is in the RTL mode, text will render with the RTL direction,
         * but the alignment and position of the text won't change by default.
         * Setting this config to 'true' will get text alignment and its position
         * within a surface mirrored.
         */
        flipRtlText: false
    },

    isSurface: true,

    /**
     * @private
     * This flag is used to indicate that `predecessors` surfaces that should render
     * before this surface renders are dirty, and to call `renderFrame`
     * when all `predecessors` have their `renderFrame` called (i.e. not dirty anymore).
     * This flag indicates that current surface has surfaces that are yet to render
     * before current surface can render. When all the `predecessors` surfaces
     * have rendered, i.e. when `dirtyPredecessorCount` reaches zero,
     */
    isPendingRenderFrame: false,

    dirtyPredecessorCount: 0,

    constructor: function (config) {
        var me = this;

        me.predecessors = [];
        me.successors = [];
        me.map = {};

        me.callParent([config]);
        me.matrix = new Ext.draw.Matrix();
        me.inverseMatrix = me.matrix.inverse();
    },

    /**
     * Round the number to align to the pixels on device.
     * @param {Number} num The number to align.
     * @return {Number} The resultant alignment.
     */
    roundPixel: function (num) {
        return Math.round(this.devicePixelRatio * num) / this.devicePixelRatio;
    },

    /**
     * Mark the surface to render after another surface is updated.
     * @param {Ext.draw.Surface} surface The surface to wait for.
     */
    waitFor: function (surface) {
        var me = this,
            predecessors = me.predecessors;

        if (!Ext.Array.contains(predecessors, surface)) {
            predecessors.push(surface);
            surface.successors.push(me);
            if (surface.getDirty()) {
                me.dirtyPredecessorCount++;
            }
        }
    },

    updateDirty: function (dirty) {
        var successors = this.successors,
            ln = successors.length,
            i = 0,
            successor;

        for (; i < ln; i++) {
            successor = successors[i];
            if (dirty) {
                successor.dirtyPredecessorCount++;
                successor.setDirty(true);
            } else {
                successor.dirtyPredecessorCount--;
                // Don't need to call `setDirty(false)` on a successor here,
                // as this will be done by `renderFrame`.
                if (successor.dirtyPredecessorCount === 0 && successor.isPendingRenderFrame) {
                    successor.renderFrame();
                }
            }
        }
    },

    applyBackground: function (background, oldBackground) {
        this.setDirty(true);
        if (Ext.isString(background)) {
            background = { fillStyle: background };
        }
        return Ext.factory(background, Ext.draw.sprite.Rect, oldBackground);
    },

    applyRect: function (rect, oldRect) {
        if (oldRect && rect[0] === oldRect[0] && rect[1] === oldRect[1] && rect[2] === oldRect[2] && rect[3] === oldRect[3]) {
            return;
        }
        if (Ext.isArray(rect)) {
            return [rect[0], rect[1], rect[2], rect[3]];
        } else if (Ext.isObject(rect)) {
            return [
                rect.x || rect.left,
                rect.y || rect.top,
                rect.width || (rect.right - rect.left),
                rect.height || (rect.bottom - rect.top)
            ];
        }
    },

    updateRect: function (rect) {
        var me = this,
            l = rect[0],
            t = rect[1],
            r = l + rect[2],
            b = t + rect[3],
            background = me.getBackground(),
            element = me.element;

        element.setLocalXY(Math.floor(l), Math.floor(t));
        element.setSize(Math.ceil(r - Math.floor(l)), Math.ceil(b - Math.floor(t)));

        if (background) {
            background.setAttributes({
                x: 0,
                y: 0,
                width: Math.ceil(r - Math.floor(l)),
                height: Math.ceil(b - Math.floor(t))
            });
        }
        me.setDirty(true);
    },

    /**
     * Reset the matrix of the surface.
     */
    resetTransform: function () {
        this.matrix.set(1, 0, 0, 1, 0, 0);
        this.inverseMatrix.set(1, 0, 0, 1, 0, 0);
        this.setDirty(true);
    },

    /**
     * Get the sprite by id or index.
     * It will first try to find a sprite with the given id, otherwise will try to use the id as an index.
     * @param {String|Number} id
     * @return {Ext.draw.sprite.Sprite}
     */
    get: function (id) {
        return this.map[id] || this.getItems()[id];
    },

    /**
     * @method
     * Add a Sprite to the surface.
     * You can put any number of objects as the parameter.
     * See {@link Ext.draw.sprite.Sprite} for the configuration object to be passed into this method.
     *
     * For example:
     *
     *     drawContainer.getSurface().add({
     *         type: 'circle',
     *         fill: '#ffc',
     *         radius: 100,
     *         x: 100,
     *         y: 100
     *     });
     *     drawContainer.renderFrame();
     *
     * @param {Object/Object[]} sprite
     * @returns {Ext.draw.sprite.Sprite/Ext.draw.sprite.Sprite[]}
     *
     */
    add: function () {
        var me = this,
            args = Array.prototype.slice.call(arguments),
            argIsArray = Ext.isArray(args[0]),
            map = me.map,
            results = [],
            items, item, sprite,
            i, ln;

        items = Ext.Array.clean(argIsArray ? args[0] : args);

        if (!items.length) {
            return results;
        }

        for (i = 0, ln = items.length; i < ln; i++) {
            item = items[i];
            sprite = null;
            if (item.isSprite && !map[item.getId()]) {
                sprite = item;
            } else if (!map[item.id]) {
                sprite = this.createItem(item);
            }
            if (sprite) {
                map[sprite.getId()] = sprite;
                results.push(sprite);
                sprite.setParent(me);
                sprite.setSurface(me);
                me.onAdd(sprite);
            }
        }

        items = me.getItems();
        if (items) {
            items.push.apply(items, results);
        }

        me.dirtyZIndex = true;
        me.setDirty(true);

        if (!argIsArray && results.length === 1) {
            return results[0];
        } else {
            return results;
        }
    },

    /**
     * @method
     * @protected
     * Invoked when a sprite is added to the surface.
     * @param {Ext.draw.sprite.Sprite} sprite The sprite to be added.
     */
    onAdd: Ext.emptyFn,

    /**
     * Remove a given sprite from the surface,
     * optionally destroying the sprite in the process.
     * You can also call the sprite's own `remove` method.
     *
     * For example:
     *
     *      drawContainer.surface.remove(sprite);
     *      // or...
     *      sprite.remove();
     *
     * @param {Ext.draw.sprite.Sprite/String} sprite A sprite instance or its ID.
     * @param {Boolean} [isDestroy=false] If `true`, the sprite will be destroyed.
     * @returns {Ext.draw.sprite.Sprite} Returns the removed/destroyed sprite or `null` otherwise.
     */
    remove: function (sprite, isDestroy) {
        var me = this,
            id, isOwnSprite;

        if (sprite) {
            if (sprite.charAt) { // is String
                sprite = me.map[sprite];
            }
            if (!sprite || !sprite.isSprite) {
                return null;
            }
            if (sprite.isDestroyed || sprite.isDestroying) {
                return sprite;
            }
            id = sprite.getId();
            isOwnSprite = me.map[id];
            delete me.map[id];

            if (isDestroy) {
                sprite.destroy();
            }
            if (!isOwnSprite) {
                return sprite;
            }
            sprite.setParent(null);
            sprite.setSurface(null);
            Ext.Array.remove(me.getItems(), sprite);

            me.dirtyZIndex = true;
            me.setDirty(true);
        }

        return sprite || null;
    },

    /**
     * Remove all sprites from the surface, optionally destroying the sprites in the process.
     *
     * For example:
     *
     *     drawContainer.getSurface('main').removeAll();
     *
     * @param {Boolean} [isDestroy=false]
     */
    removeAll: function (isDestroy) {
        var items = this.getItems(),
            i = items.length - 1,
            item;

        if (isDestroy) {
            for (; i >= 0; i--) {
                items[i].destroy();
            }
        } else {
            for (; i >= 0; i--) {
                item = items[i];
                item.setParent(null);
                item.setSurface(null);
            }
        }

        items.length = 0;
        this.map = {};
        this.dirtyZIndex = true;
    },

    /**
     * @private
     */
    applyItems: function (items) {
        if (this.getItems()) {
            this.removeAll(true);
        }
        return Ext.Array.from(this.add(items));
    },

    /**
     * @private
     * Creates an item and appends it to the surface. Called
     * as an internal method when calling `add`.
     */
    createItem: function (config) {
        return Ext.create(config.xclass || 'sprite.' + config.type, config);
    },

    /**
     * Return the minimal bounding box that contains all the sprites bounding boxes in the given list of sprites.
     * @param {Ext.draw.sprite.Sprite[]|Ext.draw.sprite.Sprite} sprites
     * @param {Boolean} [isWithoutTransform=false]
     * @return {{x: Number, y: Number, width: number, height: number}}
     */
    getBBox: function (sprites, isWithoutTransform) {
        var sprites = Ext.Array.from(sprites),
            left = Infinity,
            right = -Infinity,
            top = Infinity,
            bottom = -Infinity,
            sprite, bbox, i, ln;

        for (i = 0, ln = sprites.length; i < ln; i++) {
            sprite = sprites[i];
            bbox = sprite.getBBox(isWithoutTransform);
            if (left > bbox.x) {
                left = bbox.x;
            }
            if (right < bbox.x + bbox.width) {
                right = bbox.x + bbox.width;
            }
            if (top > bbox.y) {
                top = bbox.y;
            }
            if (bottom < bbox.y + bbox.height) {
                bottom = bbox.y + bbox.height;
            }
        }
        return {
            x: left,
            y: top,
            width: right - left,
            height: bottom - top
        };
    },

    emptyRect: [0, 0, 0, 0],

    // Converts event's page coordinates into surface coordinates.
    // Note: surface's x-coordinates always go LTR, regardless of RTL mode.
    getEventXY: function (e) {
        var me = this,
            isRtl = me.getInherited().rtl,
            pageXY = e.getXY(), // Event position in page coordinates.
            container = me.getOwnerBody(), // The body of the chart (doesn't include docked items like legend).
            xy = container.getXY(), // Surface container position in page coordinates.
            rect = me.getRect() || me.emptyRect, // Surface position in surface container coordinates (LTR).
            result = [],
            width;

        if (isRtl) {
            width = container.getWidth();
            // The line below is actually a simplified form of
            // rect[2] - (pageXY[0] - xy[0] - (width - (rect[0] + rect[2]))).
            result[0] = xy[0] - pageXY[0] - rect[0] + width;
        } else {
            result[0] = pageXY[0] - xy[0] - rect[0];
        }
        result[1] = pageXY[1] - xy[1] - rect[1];
        return result;
    },

    /**
     * Empty the surface content (without touching the sprites.)
     */
    clear: Ext.emptyFn,

    /**
     * @private
     * Order the items by their z-index if any of that has been changed since last sort.
     */
    orderByZIndex: function () {
        var me = this,
            items = me.getItems(),
            dirtyZIndex = false,
            i, ln;

        if (me.getDirty()) {
            for (i = 0, ln = items.length; i < ln; i++) {
                if (items[i].attr.dirtyZIndex) {
                    dirtyZIndex = true;
                    break;
                }
            }
            if (dirtyZIndex) {
                // sort by zIndex
                Ext.Array.sort(items, function (a, b) {
                    return a.attr.zIndex - b.attr.zIndex;
                });
                this.setDirty(true);
            }

            for (i = 0, ln = items.length; i < ln; i++) {
                items[i].attr.dirtyZIndex = false;
            }
        }
    },

    /**
     * Force the element to redraw.
     */
    repaint: function () {
        var me = this;
        me.repaint = Ext.emptyFn;
        Ext.defer(function () {
            delete me.repaint;
            me.element.repaint();
        }, 1);
    },

    /**
     * Triggers the re-rendering of the canvas.
     */
    renderFrame: function () {
        var me = this;

        if (!me.element) {
            return;
        }
        if (me.dirtyPredecessorCount > 0) {
            me.isPendingRenderFrame = true;
            return;
        }

        var rect = me.getRect(),
            background = me.getBackground(),
            items = me.getItems(),
            item, i, ln;

        // Cannot render before the surface is placed.
        if (!rect) {
            return;
        }

        // This will also check the dirty flags of the sprites.
        me.orderByZIndex();
        if (me.getDirty()) {
            me.clear();
            me.clearTransform();

            if (background) {
                me.renderSprite(background);
            }

            for (i = 0, ln = items.length; i < ln; i++) {
                item = items[i];
                if (me.renderSprite(item) === false) {
                    return;
                }
                item.attr.textPositionCount = me.textPosition;
            }

            me.setDirty(false);
        }
    },

    /**
     * @method
     * @private
     * Renders a single sprite into the surface.
     * Do not call it from outside `renderFrame` method.
     *
     * @param {Ext.draw.sprite.Sprite} sprite The Sprite to be rendered.
     * @return {Boolean} returns `false` to stop the rendering to continue.
     */
    renderSprite: Ext.emptyFn,

    /**
     * @method flatten
     * Flattens the given drawing surfaces into a single image
     * and returns an object containing the data (in the DataURL format)
     * and the type (e.g. 'png' or 'svg') of that image.
     * @param {Object} size The size of the final image.
     * @param {Number} size.width
     * @param {Number} size.height
     * @param {Ext.draw.Surface[]} surfaces The surfaces to flatten.
     * @return {Object}
     * @return {String} return.data The DataURL of the flattened image.
     * @return {String} return.type The type of the image.
     *
     */

    /**
     * @private
     * Clears the current transformation state on the surface.
     */
    clearTransform: Ext.emptyFn,

    /**
     * Destroys the surface. This is done by removing all components from it and
     * also removing its reference to a DOM element.
     *
     * For example:
     *
     *      drawContainer.surface.destroy();
     */
    destroy: function () {
        var me = this;

        me.removeAll(true);
        me.predecessors = null;
        me.successors = null;

        me.callParent();
    }
});


