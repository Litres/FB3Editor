/**
 * This mixin provides a common interface for objects that can be positioned, e.g.
 * {@link Ext.Component Components} and {@link Ext.dom.Element Elements}
 * @private
 */
Ext.define('Ext.util.Positionable', {
    mixinId: 'positionable',

    _positionTopLeft: ['position', 'top', 'left'],

    _alignRe: /^([a-z]+)-([a-z]+)([?!])?$/,

    // Stub implementation called after positioning.
    // May be implemented in subclasses. Component has an implementation.
    afterSetPosition: Ext.emptyFn,

    //<debug>
    // ***********************
    // Begin Abstract Methods
    // ***********************

    /**
     * Gets the x,y coordinates of an element specified by the anchor position on the
     * element.
     * @param {Ext.dom.Element} el The element
     * @param {String} [anchor='tl'] The specified anchor position.
     * See {@link #alignTo} for details on supported anchor positions.
     * @param {Boolean} [local] True to get the local (element top/left-relative) anchor
     * position instead of page coordinates
     * @param {Object} [size] An object containing the size to use for calculating anchor
     * position {width: (target width), height: (target height)} (defaults to the
     * element's current size)
     * @return {Number[]} [x, y] An array containing the element's x and y coordinates
     * @private
     */
    getAnchorToXY: function() {
        Ext.raise("getAnchorToXY is not implemented in " + this.$className);
    },

    /**
     * Returns the size of the element's borders and padding.
     * @return {Object} an object with the following numeric properties
     * - beforeX
     * - afterX
     * - beforeY
     * - afterY
     * @private
     */
    getBorderPadding: function() {
        Ext.raise("getBorderPadding is not implemented in " + this.$className);
    },

    /**
     * Returns the x coordinate of this element reletive to its `offsetParent`.
     * @return {Number} The local x coordinate
     */
    getLocalX: function() {
        Ext.raise("getLocalX is not implemented in " + this.$className);
    },

    /**
     * Returns the x and y coordinates of this element relative to its `offsetParent`.
     * @return {Number[]} The local XY position of the element
     */
    getLocalXY: function() {
        Ext.raise("getLocalXY is not implemented in " + this.$className);
    },

    /**
     * Returns the y coordinate of this element reletive to its `offsetParent`.
     * @return {Number} The local y coordinate
     */
    getLocalY: function() {
        Ext.raise("getLocalY is not implemented in " + this.$className);
    },

    /**
     * Gets the current X position of the DOM element based on page coordinates.
     * @return {Number} The X position of the element
     */
    getX: function() {
        Ext.raise("getX is not implemented in " + this.$className);
    },

    /**
     * Gets the current position of the DOM element based on page coordinates.
     * @return {Number[]} The XY position of the element
     */
    getXY: function() {
        Ext.raise("getXY is not implemented in " + this.$className);
    },

    /**
     * Gets the current Y position of the DOM element based on page coordinates.
     * @return {Number} The Y position of the element
     */
    getY: function() {
        Ext.raise("getY is not implemented in " + this.$className);
    },

    /**
     * Sets the local x coordinate of this element using CSS style. When used on an
     * absolute positioned element this method is symmetrical with {@link #getLocalX}, but
     * may not be symmetrical when used on a relatively positioned element.
     * @param {Number} x The x coordinate. A value of `null` sets the left style to 'auto'.
     * @return {Ext.util.Positionable} this
     */
    setLocalX: function() {
        Ext.raise("setLocalX is not implemented in " + this.$className);
    },

    /**
     * Sets the local x and y coordinates of this element using CSS style. When used on an
     * absolute positioned element this method is symmetrical with {@link #getLocalXY}, but
     * may not be symmetrical when used on a relatively positioned element.
     * @param {Number/Array} x The x coordinate or an array containing [x, y]. A value of
     * `null` sets the left style to 'auto'
     * @param {Number} [y] The y coordinate, required if x is not an array. A value of
     * `null` sets the top style to 'auto'
     * @return {Ext.util.Positionable} this
     */
    setLocalXY: function() {
        Ext.raise("setLocalXY is not implemented in " + this.$className);
    },

    /**
     * Sets the local y coordinate of this element using CSS style. When used on an
     * absolute positioned element this method is symmetrical with {@link #getLocalY}, but
     * may not be symmetrical when used on a relatively positioned element.
     * @param {Number} y The y coordinate. A value of `null` sets the top style to 'auto'.
     * @return {Ext.util.Positionable} this
     */
    setLocalY: function() {
        Ext.raise("setLocalY is not implemented in " + this.$className);
    },

    /**
     * Sets the X position of the DOM element based on page coordinates.
     * @param {Number} x The X position
     * @return {Ext.util.Positionable} this
     */
    setX: function() {
        Ext.raise("setX is not implemented in " + this.$className);
    },

    /**
     * Sets the position of the DOM element in page coordinates.
     * @param {Number[]} pos Contains X & Y [x, y] values for new position (coordinates
     * are page-based)
     * @return {Ext.util.Positionable} this
     */
    setXY: function() {
        Ext.raise("setXY is not implemented in " + this.$className);
    },

    /**
     * Sets the Y position of the DOM element based on page coordinates.
     * @param {Number} y The Y position
     * @return {Ext.util.Positionable} this
     */
    setY: function() {
        Ext.raise("setY is not implemented in " + this.$className);
    },

    // ***********************
    // End Abstract Methods
    // ***********************
    //</debug>

    // TODO: currently only used by ToolTip. does this method belong here?

    /**
     * @private
     */
    adjustForConstraints: function(xy, parent) {
        var vector = this.getConstrainVector(parent, xy);
        if (vector) {
            xy[0] += vector[0];
            xy[1] += vector[1];
        }
        return xy;
    },

    /**
     * Aligns the element with another element relative to the specified anchor points. If
     * the other element is the document it aligns it to the viewport. The position
     * parameter is optional, and can be specified in any one of the following formats:
     *
     * - **Blank**: Defaults to aligning the element's top-left corner to the target's
     *   bottom-left corner ("tl-bl").
     * - **One anchor (deprecated)**: The passed anchor position is used as the target
     *   element's anchor point.  The element being aligned will position its top-left
     *   corner (tl) to that point. *This method has been deprecated in favor of the newer
     *   two anchor syntax below*.
     * - **Two anchors**: If two values from the table below are passed separated by a dash,
     *   the first value is used as the element's anchor point, and the second value is
     *   used as the target's anchor point.
     *
     * In addition to the anchor points, the position parameter also supports the "?"
     * character. If "?" is passed at the end of the position string, the element will
     * attempt to align as specified, but the position will be adjusted to constrain to
     * the viewport if necessary. Note that the element being aligned might be swapped to
     * align to a different position than that specified in order to enforce the viewport
     * constraints. Following are all of the supported anchor positions:
     *
     * <pre>
     * Value  Description
     * -----  -----------------------------
     * tl     The top left corner (default)
     * t      The center of the top edge
     * tr     The top right corner
     * l      The center of the left edge
     * c      In the center of the element
     * r      The center of the right edge
     * bl     The bottom left corner
     * b      The center of the bottom edge
     * br     The bottom right corner
     * </pre>
     *
     * Example Usage:
     *
     *     // align el to other-el using the default positioning
     *     // ("tl-bl", non-constrained)
     *     el.alignTo("other-el");
     *
     *     // align the top left corner of el with the top right corner of other-el
     *     // (constrained to viewport)
     *     el.alignTo("other-el", "tr?");
     *
     *     // align the bottom right corner of el with the center left edge of other-el
     *     el.alignTo("other-el", "br-l?");
     *
     *     // align the center of el with the bottom left corner of other-el and
     *     // adjust the x position by -6 pixels (and the y position by 0)
     *     el.alignTo("other-el", "c-bl", [-6, 0]);
     *
     * @param {Ext.util.Positionable/HTMLElement/String} element The Positionable,
     * HTMLElement, or id of the element to align to.
     * @param {String} [position="tl-bl?"] The position to align to
     * @param {Number[]} [offsets] Offset the positioning by [x, y]
     * Element animation config object
     * @return {Ext.util.Positionable} this
     */
    alignTo: function(element, position, offsets, /* private (documented in ext) */ animate) {
        var me = this,
            el = me.el;

        return me.setXY(me.getAlignToXY(element, position, offsets),
                el.anim && !!animate ? el.anim(animate) : false);
    },

    /**
     * Calculates x,y coordinates specified by the anchor position on the element, adding
     * extraX and extraY values.
     * @param {String} [anchor='tl'] The specified anchor position.
     * See {@link #alignTo} for details on supported anchor positions.
     * @param {Number} [extraX] value to be added to the x coordinate
     * @param {Number} [extraY] value to be added to the y coordinate
     * @param {Object} [size] An object containing the size to use for calculating anchor
     * position {width: (target width), height: (target height)} (defaults to the
     * element's current size) 
     * @return {Number[]} [x, y] An array containing the element's x and y coordinates
     * @private
     */
    calculateAnchorXY: function(anchor, extraX, extraY, mySize) {
        //Passing a different size is useful for pre-calculating anchors,
        //especially for anchored animations that change the el size.
        var me = this,
            el = me.el,
            doc = document,
            isViewport = (el.dom === doc.body || el.dom === doc),
            round = Math.round,
            xy, myWidth, myHeight;

        anchor = (anchor || "tl").toLowerCase();
        mySize = mySize || {};

        myWidth = mySize.width || (isViewport ? Ext.Element.getViewportWidth() : me.getWidth());
        myHeight = mySize.height || (isViewport ? Ext.Element.getViewportHeight() : me.getHeight());

        // Calculate anchor position.
        // Test most common cases for picker alignment first.
        switch (anchor) {
            case 'tl' : xy = [0, 0];
                        break;
            case 'bl' : xy = [0, myHeight];
                        break;
            case 'tr' : xy = [myWidth, 0];
                        break;
            case 'c'  : xy = [round(myWidth * 0.5), round(myHeight * 0.5)];
                        break;
            case 't'  : xy = [round(myWidth * 0.5), 0];
                        break;
            case 'l'  : xy = [0, round(myHeight * 0.5)];
                        break;
            case 'r'  : xy = [myWidth, round(myHeight * 0.5)];
                        break;
            case 'b'  : xy = [round(myWidth * 0.5), myHeight];
                        break;
            case 'tc' : xy = [round(myWidth * 0.5), 0];
                        break;
            case 'bc' : xy = [round(myWidth * 0.5), myHeight];
                        break;
            case 'br' : xy = [myWidth, myHeight];
        }
        return [xy[0] + extraX, xy[1] + extraY];
    },

    /**
     * By default this method does nothing but return the position spec passed to it. In
     * rtl mode it is overridden to convert "l" to "r" and vice versa when required.
     * @private
     */
    convertPositionSpec: Ext.identityFn,

    /**
     * Gets the x,y coordinates to align this element with another element. See
     * {@link #alignTo} for more info on the supported position values.
     * @param {Ext.util.Positionable/HTMLElement/String} element The Positionable,
     * HTMLElement, or id of the element to align to.
     * @param {String} [position="tl-bl?"] The position to align to
     * @param {Number[]} [offsets] Offset the positioning by [x, y]
     * @return {Number[]} [x, y]
     */
    getAlignToXY: function(alignToEl, posSpec, offset) {
        var me = this,
            constrainToEl,
            constrainTo,
            alignMatch, myPosition, alignToElPosition, myWidth, myHeight,
            alignToElRegion, swapY, swapX, constrain, align1, align2,
            p1y, p1x, p2y, p2x, x, y;

        alignToEl = Ext.get(alignToEl.el || alignToEl);

        if (!alignToEl || !alignToEl.dom) {
            //<debug>
            Ext.raise({
                sourceClass: 'Ext.util.Positionable',
                sourceMethod: 'getAlignToXY',
                msg: 'Attempted to align an element that doesn\'t exist'
            });
            //</debug>
        }

        offset = offset || [0,0];
        posSpec = (!posSpec || posSpec === "?" ? "tl-bl?" :
            (!(/-/).test(posSpec) && posSpec !== "" ? "tl-" + posSpec : posSpec || "tl-bl")).toLowerCase();

        posSpec = me.convertPositionSpec(posSpec);

        alignMatch = posSpec.match(me._alignRe);

        //<debug>
        if (!alignMatch) {
            Ext.raise({
                sourceClass: 'Ext.util.Positionable',
                sourceMethod: 'getAlignToXY',
                el: alignToEl,
                position: posSpec,
                offset: offset,
                msg: 'Attemmpted to align an element with an invalid position: "' + posSpec + '"'
            });
        }
        //</debug>

        align1 = alignMatch[1];
        align2 = alignMatch[2];
        constrain = !!alignMatch[3];

        //Subtract the aligned el's internal xy from the target's offset xy
        //plus custom offset to get this Element's new offset xy
        myPosition = me.getAnchorXY(align1, true);
        alignToElPosition = me.getAnchorToXY(alignToEl, align2, false);

        x = alignToElPosition[0] - myPosition[0] + offset[0];
        y = alignToElPosition[1] - myPosition[1] + offset[1];

        // If position spec ended with a "?" or "!", then constraining is necessary
        if (constrain) {
            // Constrain to the correct enclosing object:
            // If the assertive form was used (like "tl-bl!"), constrain to the alignToEl.
            if (alignMatch[3] === '!') {
                constrainToEl = alignToEl;
            }
            else {
                // Otherwise, attempt to use the constrainTo property.
                // Otherwise, if we are a Component, there will be a container property.
                // Otherwise, use this Positionable's element's parent node.
                constrainToEl = me.constrainTo || me.container || me.el.parent();
            }
            
            constrainToEl = Ext.get(constrainToEl.el || constrainToEl);
            constrainTo = constrainToEl.getConstrainRegion();
            constrainTo.right = constrainTo.left + constrainToEl.el.dom.clientWidth;

            myWidth = me.getWidth();
            myHeight = me.getHeight();
            alignToElRegion = alignToEl.getRegion();
            // If we are at a viewport boundary and the aligned el is anchored
            // on a target border that is perpendicular to the vp border,
            // allow the aligned el to slide on that border, otherwise swap
            // the aligned el to the opposite border of the target.
            p1y = align1.charAt(0);
            p1x = align1.charAt(align1.length - 1);
            p2y = align2.charAt(0);
            p2x = align2.charAt(align2.length - 1);

            // We only need to swap from below to above (or vice versa) if the two elements horizontally overlap.
            // If they do not horizontally overlap, then simply constraining the Y is fine.
            swapY = (x < alignToElRegion.right && x + myWidth >= alignToElRegion.left) && ((p1y == "t" && p2y == "b") || (p1y == "b" && p2y == "t"));

            // We only need to swap from right to left (or vice versa) if the two elements vertically overlap.
            // If they do not vertically overlap, then simply constraining the X is fine.
            swapX = (y < alignToElRegion.bottom && y + myHeight >= alignToElRegion.top) && ((p1x == "r" && p2x == "l") || (p1x == "l" && p2x == "r"));

            if (x + myWidth > constrainTo.right) {
                if (swapX) {
                    x = alignToElRegion.left - myWidth;

                    // Only swap once. If it doesn't fit after that, we have to do a normal constrain
                    swapX = false;
                } else {
                    x = constrainTo.right - myWidth;
                }
            }
            if (x < constrainTo.left) {
                x = swapX ? alignToElRegion.right : constrainTo.left;
            }
            if (y + myHeight > constrainTo.bottom) {
                if (swapY) {
                    y = alignToElRegion.top - myHeight;

                    // Only swap once. If it doesn't fit after that, we have to do a normal constrain
                    swapY = false;
                } else {
                    y = constrainTo.bottom - myHeight;
                }
            }
            if (y < constrainTo.top) {
                y = swapY ? alignToElRegion.bottom : constrainTo.top;
            }
        }
        return [x,y];
    },

    /**
     * Gets the x,y coordinates specified by the anchor position on the element.
     * @param {String} [anchor='tl'] The specified anchor position.
     * See {@link #alignTo} for details on supported anchor positions.
     * @param {Boolean} [local] True to get the local (element top/left-relative) anchor
     * position instead of page coordinates
     * @param {Object} [size] An object containing the size to use for calculating anchor
     * position {width: (target width), height: (target height)} (defaults to the
     * element's current size)
     * @return {Number[]} [x, y] An array containing the element's x and y coordinates
     */
    getAnchorXY: function(anchor, local, mySize) {
        var me = this,
            myPos = me.getXY(),
            el = me.el,
            doc = document,
            isViewport = el.dom == doc.body || el.dom == doc,
            scroll = el.getScroll(),
            extraX = isViewport ? scroll.left : local ? 0 : myPos[0],
            extraY = isViewport ? scroll.top : local ? 0 : myPos[1];

        return me.calculateAnchorXY(anchor, extraX, extraY, mySize);
    },

    /**
     * Return an object defining the area of this Element which can be passed to
     * {@link #setBox} to set another Element's size/location to match this element.
     *
     * @param {Boolean} [contentBox] If true a box for the content of the element is
     * returned.
     * @param {Boolean} [local] If true the element's left and top relative to its
     * `offsetParent` are returned instead of page x/y.
     * @return {Object} An object in the format
     * @return {Number} return.x The element's X position.
     * @return {Number} return.y The element's Y position.
     * @return {Number} return.width The element's width.
     * @return {Number} return.height The element's height.
     * @return {Number} return.bottom The element's lower bound.
     * @return {Number} return.right The element's rightmost bound.
     *
     * The returned object may also be addressed as an Array where index 0 contains the X
     * position and index 1 contains the Y position. The result may also be used for
     * {@link #setXY}
     */
    getBox: function(contentBox, local) {
        var me = this,
            xy = local ? me.getLocalXY() : me.getXY(),
            x = xy[0],
            y = xy[1],
            w = me.getWidth(),
            h = me.getHeight(),
            borderPadding, beforeX, beforeY;

        if (contentBox) {
            borderPadding = me.getBorderPadding();
            beforeX = borderPadding.beforeX;
            beforeY = borderPadding.beforeY;

            x += beforeX;
            y += beforeY;
            w -= (beforeX + borderPadding.afterX);
            h -= (beforeY + borderPadding.afterY);
        }

        return {
            x: x,
            left: x,
            0: x,
            y: y,
            top: y,
            1: y,
            width: w,
            height: h,
            right: x + w,
            bottom: y + h
        };
    },

    /**
     * Calculates the new [x,y] position to move this Positionable into a constrain region.
     *
     * By default, this Positionable is constrained to be within the container it was added to, or the element it was
     * rendered to.
     *
     * Priority is given to constraining the top and left within the constraint.
     *
     * An alternative constraint may be passed.
     * @param {String/HTMLElement/Ext.dom.Element/Ext.util.Region} [constrainTo] The Element or {@link Ext.util.Region Region}
     * into which this Component is to be constrained. Defaults to the element into which this Positionable
     * was rendered, or this Component's {@link Ext.Component#constrainTo.
     * @param {Number[]} [proposedPosition] A proposed `[X, Y]` position to test for validity
     * and to coerce into constraints instead of using this Positionable's current position.
     * @param {Boolean} [local] The proposedPosition is local *(relative to floatParent if a floating Component)*
     * @param {Number[]} [proposedSize] A proposed `[width, height]` size to use when calculating
     * constraints instead of using this Positionable's current size.
     * @return {Number[]} **If** the element *needs* to be translated, the new `[X, Y]` position within
     * constraints if possible, giving priority to keeping the top and left edge in the constrain region.
     * Otherwise, `false`.
     * @private
     */
    calculateConstrainedPosition: function(constrainTo, proposedPosition, local, proposedSize) {
        var me = this,
            vector,
            fp = me.floatParent,
            parentNode = fp ? fp.getTargetEl() : null,
            parentOffset,
            borderPadding,
            proposedConstrainPosition,
            xy = false,
            localXY;

        if (local && fp) {
            parentOffset = parentNode.getXY();
            borderPadding = parentNode.getBorderPadding();
            parentOffset[0] += borderPadding.beforeX;
            parentOffset[1] += borderPadding.beforeY;
            if (proposedPosition) {
                proposedConstrainPosition = [proposedPosition[0] + parentOffset[0], proposedPosition[1] + parentOffset[1]];
            }
        } else {
            proposedConstrainPosition = proposedPosition;
        }
        // Calculate the constrain vector to coerce our position to within our
        // constrainTo setting. getConstrainVector will provide a default constraint
        // region if there is no explicit constrainTo, *and* there is no floatParent owner Component.
        constrainTo = constrainTo || me.constrainTo || parentNode || me.container || me.el.parent();

        if (local && proposedConstrainPosition) {
            proposedConstrainPosition = me.reverseTranslateXY(proposedConstrainPosition);
        }

        vector = ((me.constrainHeader && me.header.rendered) ? me.header : me).getConstrainVector(
            constrainTo,
            proposedConstrainPosition,
            proposedSize
        );

        // false is returned if no movement is needed
        if (vector) {
            xy = proposedPosition || me.getPosition(local);
            xy[0] += vector[0];
            xy[1] += vector[1];
        }
        return xy;
    },

    /**
     * Returns the content region of this element for purposes of constraining floating
     * children.  That is the region within the borders and scrollbars, but not within the padding.
     */
    getConstrainRegion: function() {
        var me = this,
            el = me.el,
            isBody = el.dom.nodeName === 'BODY',
            dom = el.dom,
            borders = el.getBorders(),
            pos = el.getXY(),
            left = pos[0] + borders.beforeX,
            top = pos[1] + borders.beforeY,
            scroll, width, height;

        // For the body we want to do some special logic.
        if (isBody) {
            scroll = el.getScroll();
            left = scroll.left;
            top = scroll.top;
            width = Ext.Element.getViewportWidth();
            height = Ext.Element.getViewportHeight();
        } else {
            width = dom.clientWidth;
            height = dom.clientHeight;
        }

        return new Ext.util.Region(top, left + width, top + height, left);
    },

    /**
     * Returns the `[X, Y]` vector by which this Positionable's element must be translated to make a best
     * attempt to constrain within the passed constraint. Returns `false` if the element
     * does not need to be moved.
     *
     * Priority is given to constraining the top and left within the constraint.
     *
     * The constraint may either be an existing element into which the element is to be
     * constrained, or a {@link Ext.util.Region Region} into which this element is to be
     * constrained.
     *
     * By default, any extra shadow around the element is **not** included in the constrain calculations - the edges
     * of the element are used as the element bounds. To constrain the shadow within the constrain region, set the
     * `constrainShadow` property on this element to `true`.
     *
     * @param {Ext.util.Positionable/HTMLElement/String/Ext.util.Region} [constrainTo] The
     * Positionable, HTMLElement, element id, or Region into which the element is to be
     * constrained.
     * @param {Number[]} [proposedPosition] A proposed `[X, Y]` position to test for validity
     * and to produce a vector for instead of using the element's current position
     * @param {Number[]} [proposedSize] A proposed `[width, height]` size to constrain
     * instead of using the element's current size
     * @return {Number[]/Boolean} **If** the element *needs* to be translated, an `[X, Y]`
     * vector by which this element must be translated. Otherwise, `false`.
     */
    getConstrainVector: function(constrainTo, proposedPosition, proposedSize) {
        var thisRegion = this.getRegion(),
            vector = [0, 0],
            shadowSize = (this.shadow && this.constrainShadow && !this.shadowDisabled) ? this.shadow.getShadowSize() : undefined,
            overflowed = false,
            constrainSize,
            constraintInsets = this.constraintInsets;

        if (!(constrainTo instanceof Ext.util.Region)) {
            constrainTo = Ext.get(constrainTo.el || constrainTo);

            // getRegion uses bounding client rect.
            // We need to clear any scrollbars, so get the size using getViewSize
            constrainSize = constrainTo.getViewSize();
            constrainTo = constrainTo.getConstrainRegion();
            constrainTo.right = constrainTo.left + constrainSize.width;
            constrainTo.bottom = constrainTo.top + constrainSize.height;
        }

        // Apply constraintInsets
        if (constraintInsets) {
            constraintInsets = Ext.isObject(constraintInsets) ? constraintInsets : Ext.Element.parseBox(constraintInsets);
            constrainTo.adjust(constraintInsets.top, constraintInsets.right, constraintInsets.bottom, constraintInsets.left);
        }

        // Shift this region to occupy the proposed position
        if (proposedPosition) {
            thisRegion.translateBy(proposedPosition[0] - thisRegion.x, proposedPosition[1] - thisRegion.y);
        }
        // Set the size of this region to the proposed size
        if (proposedSize) {
            thisRegion.right = thisRegion.left + proposedSize[0];
            thisRegion.bottom = thisRegion.top + proposedSize[1];
        }

        // Reduce the constrain region to allow for shadow
        if (shadowSize) {
            constrainTo.adjust(shadowSize[0], -shadowSize[1], -shadowSize[2], shadowSize[3]);
        }

        // Constrain the X coordinate by however much this Element overflows
        if (thisRegion.right > constrainTo.right) {
            overflowed = true;
            vector[0] = (constrainTo.right - thisRegion.right);    // overflowed the right
        }
        if (thisRegion.left + vector[0] < constrainTo.left) {
            overflowed = true;
            vector[0] = (constrainTo.left - thisRegion.left);      // overflowed the left
        }

        // Constrain the Y coordinate by however much this Element overflows
        if (thisRegion.bottom > constrainTo.bottom) {
            overflowed = true;
            vector[1] = (constrainTo.bottom - thisRegion.bottom);  // overflowed the bottom
        }
        if (thisRegion.top + vector[1] < constrainTo.top) {
            overflowed = true;
            vector[1] = (constrainTo.top - thisRegion.top);        // overflowed the top
        }
        return overflowed ? vector : false;
    },

    /**
      * Returns the offsets of this element from the passed element. The element must both
      * be part of the DOM tree and not have display:none to have page coordinates.
      * @param {Ext.util.Positionable/HTMLElement/String} offsetsTo The Positionable,
      * HTMLElement, or element id to get get the offsets from.
      * @return {Number[]} The XY page offsets (e.g. `[100, -200]`)
      */
    getOffsetsTo: function(offsetsTo) {
        var o = this.getXY(),
                e = Ext.fly(offsetsTo.el || offsetsTo).getXY();
        return [o[0] - e[0],o[1] - e[1]];
    },

    /**
     * Returns a region object that defines the area of this element.
     * @return {Ext.util.Region} A Region containing "top, left, bottom, right" properties.
     */
    getRegion: function() {
        var box = this.getBox();
        return new Ext.util.Region(box.top, box.right, box.bottom, box.left);
    },

    /**
     * Returns a region object that defines the client area of this element.
     *
     * That is, the area *within* any scrollbars.
     * @return {Ext.util.Region} A Region containing "top, left, bottom, right" properties.
     */
    getClientRegion: function() {
        var me = this,
            scrollbarSize,
            viewContentBox = me.getBox(),
            myDom = me.dom;

        // Capture width taken by any vertical scrollbar.
        // If there is a vertical scrollbar, shrink the box.
        scrollbarSize = myDom.offsetWidth - myDom.clientWidth;
        if (scrollbarSize) {
            if (me.getStyle('direction') === 'rtl') {
                viewContentBox.left += scrollbarSize;
            } else {
                viewContentBox.right -= scrollbarSize;
            }
        }

        // Capture width taken by any horizontal scrollbar.
        // If there is a vertical scrollbar, shrink the box.
        scrollbarSize = myDom.offsetHeight - myDom.clientHeight;
        if (scrollbarSize) {
            viewContentBox.bottom -= scrollbarSize;
        }

        // The client region excluding any scrollbars.
        return new Ext.util.Region(viewContentBox.top, viewContentBox.right, viewContentBox.bottom, viewContentBox.left);
    },

    /**
     * Returns the **content** region of this element. That is the region within the borders
     * and padding.
     * @return {Ext.util.Region} A Region containing "top, left, bottom, right" member data.
     */
    getViewRegion: function() {
        var me = this,
            el = me.el,
            isBody = el.dom.nodeName === 'BODY',
            borderPadding, scroll, pos, top, left, width, height;

        // For the body we want to do some special logic
        if (isBody) {
            scroll = el.getScroll();
            left = scroll.left;
            top = scroll.top;
            width = Ext.Element.getViewportWidth();
            height = Ext.Element.getViewportHeight();
        }
        else {
            borderPadding = me.getBorderPadding();
            pos = me.getXY();
            left = pos[0] + borderPadding.beforeX;
            top = pos[1] + borderPadding.beforeY;
            width = me.getWidth(true);
            height = me.getHeight(true);
        }

        return new Ext.util.Region(top, left + width, top + height, left);
    },

    /**
     * Move the element relative to its current position.
     * @param {String} direction Possible values are:
     *
     * - `"l"` (or `"left"`)
     * - `"r"` (or `"right"`)
     * - `"t"` (or `"top"`, or `"up"`)
     * - `"b"` (or `"bottom"`, or `"down"`)
     *
     * @param {Number} distance How far to move the element in pixels
     */
    move: function(direction, distance, /* private (documented in ext) */ animate) {
        var me = this,
            xy = me.getXY(),
            x = xy[0],
            y = xy[1],
            left = [x - distance, y],
            right = [x + distance, y],
            top = [x, y - distance],
            bottom = [x, y + distance],
            hash = {
                l: left,
                left: left,
                r: right,
                right: right,
                t: top,
                top: top,
                up: top,
                b: bottom,
                bottom: bottom,
                down: bottom
            };

        direction = direction.toLowerCase();
        me.setXY([hash[direction][0], hash[direction][1]], animate);
    },

    /**
     * Sets the element's box.
     * @param {Object} box The box to fill {x, y, width, height}
     * @return {Ext.util.Positionable} this
     */
    setBox: function(box) {
        var me = this,
            x, y;

        if (box.isRegion) {
            box = {
                x: box.left,
                y: box.top,
                width: box.right - box.left,
                height: box.bottom - box.top
            };
        }

        me.constrainBox(box);
        x = box.x;
        y = box.y;
     
        // Position to the contrained position
        // Call setSize *last* so that any possible layout has the last word on position.
        me.setXY([x, y]);
        me.setSize(box.width, box.height);
        me.afterSetPosition(x, y);
        return me;
    },

    /**
     * @private
     */
    constrainBox: function(box) {
        var me = this,
            constrainedPos,
            x, y;

        if (me.constrain || me.constrainHeader) {
            x = ('x' in box) ? box.x : box.left;
            y = ('y' in box) ? box.y : box.top;
            constrainedPos =
                me.calculateConstrainedPosition(
                    null,
                    [x, y],
                    false,
                    [box.width, box.height]
                );

            // If it *needs* constraining, change the position
            if (constrainedPos) {
                box.x = constrainedPos[0];
                box.y = constrainedPos[1];
            }
        }
    },

    /**
     * Translates the passed page coordinates into left/top css values for the element
     * @param {Number/Array} x The page x or an array containing [x, y]
     * @param {Number} [y] The page y, required if x is not an array
     * @return {Object} An object with left and top properties. e.g.
     * {left: (value), top: (value)}
     */
    translatePoints: function(x, y) {
        var pos = this.translateXY(x, y);

        return {
            left: pos.x,
            top: pos.y
        };
    },

    /**
     * Translates the passed page coordinates into x and y css values for the element
     * @param {Number/Array} x The page x or an array containing [x, y]
     * @param {Number} [y] The page y, required if x is not an array
     * @return {Object} An object with x and y properties. e.g.
     * {x: (value), y: (value)}
     * @private
     */
    translateXY: function(x, y) {
        var me = this,
            el = me.el,
            styles = el.getStyle(me._positionTopLeft),
            relative = styles.position === 'relative',
            left = parseFloat(styles.left),
            top = parseFloat(styles.top),
            xy = me.getXY();

        if (Ext.isArray(x)) {
             y = x[1];
             x = x[0];
        }
        if (isNaN(left)) {
            left = relative ? 0 : el.dom.offsetLeft;
        }
        if (isNaN(top)) {
            top = relative ? 0 : el.dom.offsetTop;
        }
        left = (typeof x === 'number') ? x - xy[0] + left : undefined;
        top = (typeof y === 'number') ? y - xy[1] + top : undefined;
        return {
            x: left,
            y: top
        };
    },

    /**
     * Converts local coordinates into page-level coordinates
     * @param {Number[]} xy The local x and y coordinates
     * @return {Number[]} The translated coordinates
     * @private
     */
    reverseTranslateXY: function(xy) {
        var coords = xy,
            el = this.el,
            translatedXY = [],
            dom = el.dom,
            offsetParent = dom.offsetParent,
            relative,
            offsetParentXY,
            x, y;

        if (offsetParent) {
            relative = el.isStyle('position', 'relative'),
            offsetParentXY = Ext.fly(offsetParent).getXY(),

            x = xy[0] + offsetParentXY[0] + offsetParent.clientLeft;
            y = xy[1] + offsetParentXY[1] + offsetParent.clientTop;

            if (relative) {
                // relative positioned elements sit inside the offsetParent's padding,
                // while absolute positioned element sit just inside the border
                x += el.getPadding('l');
                y += el.getPadding('t');
            }

            coords = [x, y];
        }

        return coords;
    }
});
