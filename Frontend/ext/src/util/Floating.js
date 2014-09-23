/**
 * A mixin to add floating capability to a Component.
 */
Ext.define('Ext.util.Floating', {
    mixinId: 'floating',

    uses: ['Ext.Layer', 'Ext.ZIndexManager'],

    /**
     * @cfg {Boolean} focusOnToFront
     * Specifies whether the floated component should be automatically {@link Ext.Component#method-focus focused} when
     * it is {@link #toFront brought to the front}.
     */
    focusOnToFront: true,

    /**
     * @cfg {String/Boolean} shadow
     * Specifies whether the floating component should be given a shadow. Set to true to automatically create an
     * {@link Ext.Shadow}, or a string indicating the shadow's display {@link Ext.Shadow#mode}. Set to false to
     * disable the shadow.
     */
    shadow: 'sides',

    /**
     * @cfg {Boolean} constrain
     * True to constrain this Components within its containing element, false to allow it to fall outside of its containing
     * element. By default this Component will be rendered to `document.body`. To render and constrain this Component within
     * another element specify {@link Ext.Component#renderTo renderTo}.
     */
    constrain: false,

    /**
     * @cfg {Boolean} [fixed=false]
     * Configure as `true` to have this Component fixed at its `X, Y` coordinates in the browser viewport, immune
     * to scrolling the document.
     */

    /**
     * @cfg {Number} shadowOffset
     * Number of pixels to offset the shadow.
     */

    /**
     * @property {Ext.ZIndexManager} zIndexManager
     * Only present for {@link Ext.Component#floating floating} Components after they have been rendered.
     *
     * A reference to the ZIndexManager which is managing this Component's z-index.
     *
     * The {@link Ext.ZIndexManager ZIndexManager} maintains a stack of floating Component z-indices, and also provides
     * a single modal mask which is insert just beneath the topmost visible modal floating Component.
     *
     * Floating Components may be {@link Ext.Component#toFront brought to the front} or {@link Ext.Component#toBack sent to the back} of the
     * z-index stack.
     *
     * This defaults to the global {@link Ext.WindowManager ZIndexManager} for floating Components that are
     * programatically {@link Ext.Component#method-render rendered}.
     *
     * For {@link #floating} Components which are added to a Container, the ZIndexManager is acquired from the first
     * ancestor Container found which is floating. If no floating ancestor is found, the global {@link Ext.WindowManager ZIndexManager} is
     * used.
     *
     * See {@link Ext.Component#floating} and {@link #zIndexParent}
     * @readonly
     */

    /**
     * @property {Ext.Container} zIndexParent
     * Only present for {@link Ext.Component#floating} Components which were inserted as child items of Containers, and which have a floating
     * Container in their containment ancestry.
     *
     * For {@link Ext.Component#floating} Components which are child items of a Container, the zIndexParent will be a floating
     * ancestor Container which is responsible for the base z-index value of all its floating descendants. It provides
     * a {@link Ext.ZIndexManager ZIndexManager} which provides z-indexing services for all its descendant floating
     * Components.
     *
     * Floating Components that are programatically {@link Ext.Component#method-render rendered} will not have a `zIndexParent`
     * property.
     *
     * For example, the dropdown {@link Ext.view.BoundList BoundList} of a ComboBox which is in a Window will have the
     * Window as its `zIndexParent`, and will always show above that Window, wherever the Window is placed in the z-index stack.
     *
     * See {@link Ext.Component#floating} and {@link #zIndexManager}
     * @readonly
     */

     config: {
         /**
          * @private
          * @cfg {Number} activeCounter An incrementing numeric counter indicating activation index for use by the {@link #zIndexManager}
          * to sort its stack.
          */
         activeCounter: 0,
         
         /**
          * @cfg {Boolean/Number} [alwaysOnTop=false] A flag indicating that this component should be on the top of the z-index stack for use by the {@link #zIndexManager}
          * to sort its stack.
          *
          * This may be a positive number to prioritize the ordering of multiple visible always on top components.
          *
          * This may be set to a *negative* number to prioritize a component to the *bottom* of the z-index stack.
          */
         alwaysOnTop: false
     },

    constructor: function (dom) {
        var me = this;

        me.el = new Ext.dom.Layer(Ext.apply({
            preventSync  : true,
            hideMode     : me.hideMode,
            shadow       : (typeof me.shadow != 'undefined') ? me.shadow : 'sides',
            shadowOffset : me.shadowOffset,
            constrain    : false,
            fixed        : me.fixed,
            shim         : (me.shim === false) ? false : undefined
        }, me.floating), dom);

        // If modal, and focus navigation not being handled by the FocusManager,
        // catch tab navigation, and loop back in on tab off first or last item.
        if (me.modal && !(Ext.enableFocusManager)) {
            me.mon(me.el, {
                keydown: me.onKeyDown,
                scope: me
            });
        }

        // mousedown brings to front
        // Use capture to see the event first before any contained DD instance stop the event.
        me.mon(me.el, {
            mousedown: me.onMouseDown,
            scope: me,
            capture: true
        });

        // release config object (if it was one)
        me.floating = true;

        // Register with the configured ownerCt.
        // With this we acquire a floatParent for relative positioning, and a zIndexParent which is an
        // ancestor floater which provides zIndex management.
        me.registerWithOwnerCt();

        me.initHierarchyEvents();
    },

    initFloatConstrain: function () {
        var me = this,
            floatParent = me.floatParent;

        // If a floating Component is configured to be constrained, but has no configured
        // constrainTo setting, set its constrainTo to be it's ownerCt before rendering.
        if ((me.constrain || me.constrainHeader) && !me.constrainTo) {
            me.constrainTo = floatParent ? floatParent.getTargetEl() : me.container;
        }
    },

    initHierarchyEvents: function() {
        var me = this,
            syncHidden = this.syncHidden;

        if (!me.hasHierarchyEventListeners) {
            me.mon(Ext.GlobalEvents, {
                hide: syncHidden,
                collapse: syncHidden,
                show: syncHidden,
                expand: syncHidden,
                added: syncHidden,
                scope: me
            });
            me.hasHierarchyEventListeners = true;
        }
    },

    registerWithOwnerCt: function() {
        var me = this,
            ownerCt = me.ownerCt,
            zip = me.zIndexParent;

        if (zip) {
            zip.unregisterFloatingItem(me);
        }

        // Acquire a zIndexParent by traversing the ownerCt axis for the nearest floating ancestor.
        // This is to find a base which can allocate relative z-index values
        zip = me.zIndexParent = me.up('[floating]');

        // Set the floatParent to the ownertCt if one has been provided.
        // Otherwise use the zIndexParent.
        // Developers must only use ownerCt if there is really a containing relationship.
        me.floatParent = ownerCt || zip;
        me.initFloatConstrain();
        delete me.ownerCt;

        if (zip) {
            zip.registerFloatingItem(me);
        } else {
            Ext.WindowManager.register(me);
        }
    },

    // Listen for TAB events and wrap round if tabbing of either end of the Floater
    onKeyDown: function(e) {
        var me = this,
            shift,
            focusables,
            first,
            last;

        // If tabbing off either end, wrap round.
        // See Ext.dom.Element.isFocusable
        // Certain browsers always report tabIndex zero in the absence of the tabIndex attribute.
        // Testing the specified property (Standards: http://www.w3.org/TR/DOM-Level-2-Core/core.html#ID-862529273)
        // Should filter out these cases.
        // The exception is IE8. In this browser, all elements will yield a tabIndex
        // and therefore all elements will appear to be focusable.
        // This adversely affects modal Floating components.
        // These listen for the TAB key, and then test whether the event target === last focusable
        // or first focusable element, and forcibly to a circular navigation.
        // We cannot know the true first or last focusable element, so this problem still exists for IE8
        if (e.getKey() === e.TAB) {
            shift = e.shiftKey;
            focusables = me.query(':focusable');
            if (focusables.length) {
                first = focusables[0];
                last = focusables[focusables.length - 1];
                if (!shift && last.hasFocus) {
                    e.stopEvent();
                    first.focus();
                } else if (shift && first.hasFocus) {
                    e.stopEvent();
                    last.focus();
                }
            }
        }
    },

    // @private
    // Mousedown brings to front, and programatically grabs focus
    // *unless the mousedown was on a focusable element*
    onMouseDown: function (e) {
        var me = this,
            focusTask = me.focusTask,
            
            // Do not autofocus the Component (which delegates onto the getFocusEl() descendant)
            // for touch events.
            parentEvent = e.parentEvent,
            preventFocus = parentEvent && parentEvent.type === 'touchstart',
            target, dom;

        if (me.floating &&
            // get out of here if there is already a pending focus.  This usually means
            // that the handler for a mousedown on a child element set the focus on some
            // other component, and we so not want to steal it back. See EXTJSIV-9458
            (!focusTask || !focusTask.id)) {

            target = e.target;
            dom = me.el.dom;
            // loop the target's ancestors to see if we clicked on a focusable element
            // or a descendant of a focusable element,  If so we don't want to focus
            // this floating component. If we end up with no target, it probably means
            // it's been removed from the DOM, so we should attempt to bring ourselves
            // to front anyway
            while (!preventFocus && target && target !== dom) {
                if (Ext.fly(target).isFocusable()) {
                    preventFocus = true;
                }
                target = target.parentNode;
            }

            // If what was mousedowned upon is going to claim focus anyway, pass
            // preventFocus as true.
            me.toFront(preventFocus);
        }
    },

    // @private
    syncShadow : function() {
        if (this.floating) {
            this.el.sync(true);
        }
    },

    onBeforeFloatLayout: function(){
        this.el.preventSync = true;
    },

    onAfterFloatLayout: function(){
        delete this.el.preventSync;
        this.syncShadow();
    },

    /**
     * synchronizes the hidden state of this component with the state of its hierarchy
     * @private
     */
    syncHidden: function() {
        var me = this,
            hidden = me.hidden || !me.rendered,
            hierarchicallyHidden = me.hierarchicallyHidden = me.isHierarchicallyHidden(),
            pendingShow = me.pendingShow;

        if (hidden !== hierarchicallyHidden) {
            if (hierarchicallyHidden) {
                me.hide();
                me.pendingShow = true;
            } else if (pendingShow) {
                delete me.pendingShow;
                if (pendingShow.length) {
                    me.show.apply(me, pendingShow);
                } else {
                    me.show();
                }
            }
        }
    },

    // @private
    // z-index is managed by the zIndexManager and may be overwritten at any time.
    // Returns the next z-index to be used.
    // If this is a Container, then it will have rebased any managed floating Components,
    // and so the next available z-index will be approximately 10000 above that.
    setZIndex: function(index) {
        var me = this;

        me.el.setZIndex(index);

        // Next item goes 10 above;
        index += 10;

        // When a Container with floating descendants has its z-index set, it rebases any floating descendants it is managing.
        // The returned value is a round number approximately 10000 above the last z-index used.
        if (me.floatingDescendants) {
            index = Math.floor(me.floatingDescendants.setBase(index) / 100) * 100 + 10000;
        }
        return index;
    },

    /**
     * Moves this floating Component into a constrain region.
     *
     * By default, this Component is constrained to be within the container it was added to, or the element it was
     * rendered to.
     *
     * An alternative constraint may be passed.
     * @param {String/HTMLElement/Ext.dom.Element/Ext.util.Region} [constrainTo] The Element or {@link Ext.util.Region Region}
     * into which this Component is to be constrained. Defaults to the element into which this floating Component
     * was rendered.
     */
    doConstrain: function(constrainTo) {
        var me = this,
            // Calculate the constrained poition.
            // calculateConstrainedPosition will provide a default constraint
            // region if there is no explicit constrainTo, *and* there is no floatParent owner Component.
            xy = me.calculateConstrainedPosition(constrainTo, null, true);

        // false is returned if no movement is needed
        if (xy) {
            me.setPosition(xy);
        }
    },

    updateActiveCounter: function(activeCounter) {
        var z = this.zIndexParent;

        // If we have a zIndexParent, it has to rebase its own zIndices
        if (z && this.bringParentToFront !== false) {
            z.setActiveCounter(++Ext.ZIndexManager.activeCounter);
        }

        // Rebase the local zIndices
        if (z = this.zIndexManager) {
            z.onComponentUpdate(this);
        }
    },

    updateAlwaysOnTop: function(alwaysOnTop) {
        var z = this.zIndexManager;

        // Rebase the local zIndices
        if (z) {
            z.onComponentUpdate(this);
        }
    },

    /**
     * Brings this floating Component to the front of any other visible, floating Components managed by the same
     * {@link Ext.ZIndexManager ZIndexManager}
     *
     * If this Component is modal, inserts the modal mask just below this Component in the z-index stack.
     *
     * @param {Boolean} [preventFocus=false] Specify `true` to prevent the Component from being focused.
     * @return {Ext.Component} this
     */
    toFront: function(preventFocus) {
        var me = this;

        // ZIndexManager#onCollectionSort will call setActive if this component ends up on the top.
        // That will focus it if we have been requested to do so.
        if (me.zIndexManager.bringToFront(me, preventFocus || !me.focusOnToFront)) {
            if (me.hasListeners.tofront) {
                me.fireEvent('tofront', me, me.el.getZIndex());
            }
        }
        return me;
    },

    /**
     * @private
     * This method is called internally by {@link Ext.ZIndexManager} to signal that a floating Component has either been
     * moved to the top of its zIndex stack, or pushed from the top of its zIndex stack.
     *
     * If a _Window_ is superceded by another Window, deactivating it hides its shadow.
     *
     * This method also fires the {@link Ext.Component#activate activate} or
     * {@link Ext.Component#deactivate deactivate} event depending on which action occurred.
     *
     * @param {Boolean} [active=false] True to activate the Component, false to deactivate it.
     * @param {Ext.Component} [newActive] If deactivating, the newly active Component which is taking over topmost zIndex position.
     */
    setActive: function(active, newActive, doFocus) {
        var me = this;
        
        if (active) {
            if (me.el.shadow && !me.maximized) {
                me.el.enableShadow(true);
            }
            if (doFocus) {
                me.previousFocus = Ext.Element.getActiveElement();
                me.focus(false, true);
            } else {
                me.previousFocus = null;
            }
            me.fireEvent('activate', me);
        } else {
            // Only the *Windows* in a zIndex stack share a shadow. All other types of floaters
            // can keep their shadows all the time
            if (me.isWindow && (newActive && newActive.isWindow) && me.hideShadowOnDeactivate) {
                me.el.disableShadow();
            }
            me.fireEvent('deactivate', me);
            
            // IE8 will throw an exception is the target is not focusable
            if (me.previousFocus && (!Ext.isIE8 || Ext.fly(me.previousFocus).isFocusable())) {
                me.previousFocus.focus();
                me.previousFocus = null;
            }
        }
    },

    /**
     * Sends this Component to the back of (lower z-index than) any other visible windows
     * @return {Ext.Component} this
     */
    toBack: function() {
        this.zIndexManager.sendToBack(this);
        return this;
    },

    /**
     * Center this Component in its container.
     * @return {Ext.Component} this
     */
    center: function() {
        var me = this,
            xy;

        if (me.isVisible()) {
            xy = me.getAlignToXY(me.container, 'c-c');
            me.setPagePosition(xy);
        } else {
            me.needsCenter = true;
        }
        return me;
    },
    
    onFloatShow: function() {
        if (this.needsCenter) {
            this.center();    
        }
        delete this.needsCenter;

        if (this.toFrontOnShow) {
            this.toFront();
        }
    },

    // @private
    fitContainer: function(animate) {
        var me = this,
            parent = me.floatParent,
            container = parent ? parent.getTargetEl() : me.container,
            newBox = container.getViewSize(),
            newPosition = parent || (container.dom !== document.body) ?
                // If we are a contained floater, or rendered to a div, maximized position is (0,0)
                [0, 0] :
                // If no parent and rendered to body, align with origin of container el.
                container.getXY();

        newBox.x = newPosition[0];
        newBox.y = newPosition[1];
        me.setBox(newBox, animate);
    }
});
