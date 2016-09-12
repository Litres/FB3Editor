describe('Ext.overrides.dom.Element', function() {
    var E = Ext.dom.Element,
        disableableTags = {
            BUTTON: true,
            INPUT: true,
            SELECT: true,
            TEXTAREA: true,
            OPTGROUP: true,
            OPTION: true,
            FIELDSET: true
        },
        topEl, el, dom;
    
    function createElement(markup, selector) {
        if (topEl) {
            topEl.destroy();
        }
        
        if (Ext.isArray(markup)) {
            markup = markup.join('');
        }
        
        topEl = Ext.dom.Helper.insertFirst(Ext.getBody(), markup, true);
        
        el = selector ? topEl.down(selector) : topEl;
        dom = el.dom;
    }
    
    // In IE, focus events are asynchronous so we often have to wait
    // after attempting to focus something. Otherwise tests will fail.
    function waitForFocus(el, desc, timeout) {
        var dom = el.isElement ? el.dom : el;
        
        desc    = desc    || dom.id;
        timeout = timeout || 100;
        
        waitsFor(
            function() { return Ext.Element.getActiveElement() === dom },
            desc + ' to focus',
            timeout
        );
    }
    
    function syncFocusAndExpect(el, shouldBeFocused) {
        el.focus();
        
        var have = Ext.Element.getActiveElement(),
            want = !shouldBeFocused ? document.body
                 : el.isElement     ? el.dom
                 :                    el
                 ;
        
        expect(have).toBe(want);
    }
    
    function asyncFocusAndExpect(el, shouldBeFocused) {
        if (Ext.isIE8) {
            var dom = el.isElement ? el.dom : el,
                tag = dom.tagName;
            
            // There's a curious bug in IE8: input fields, textareas, and iframes
            // fail to focus programmatically when not fully painted. This can happen
            // easily in tests when we create an element, add it to the DOM tree and
            // immediately try to focus it. To work around this issue we nudge the
            // reflow by measuring element's offsetHeight and waiting just long enough
            // for the repaint to be done.
            if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'IFRAME') {
                runs(function() {
                    el.isElement ? el.dom.offsetHeight : el.offsetHeight;
                });
            
                jasmine.waitAWhile(10);
            }
        }
        
        runs(function() {
            el.focus();
        });
        
        if (shouldBeFocused) {
            waitForFocus(el);
        }
        else {
            // If we're expecting an element *not* to be focused,
            // we can't use waitsFor() because its condition will
            // never be met and the spec will fail without reaching
            // the actual expectation. So we just wait.
            waits(10);
        }
        
        runs(function() {
            var have = Ext.Element.getActiveElement(),
                want = !shouldBeFocused ? document.body
                     : el.isElement     ? el.dom
                     :                    el
                     ;
            
            // In some cases we'll have the HTML element focused
            // instead of the document body in IE8, so we will fudge
            // the test expectation a bit to avoid unnecessary failures.
            // The point of !shouldBeFocused tests is that the *element*
            // under scrutiny is not focused; we don't really care where
            // the focus goes if not to the element.
            if (Ext.isIE8 && !shouldBeFocused && have === document.documentElement) {
                want = document.documentElement;
            }
            
            expect(have).toBe(want);
        });
    }
    
    // Focus operation is synchronous except in IE; there's no reason
    // to waste cycles when result is known immediately
    function focusAndExpect(el, wantFocus) {
        return Ext.isIE ? asyncFocusAndExpect(el, wantFocus) : syncFocusAndExpect(el, wantFocus);
    }
    
    afterEach(function() {
        if (topEl) {
            topEl.destroy();
        }
        else if (el) {
            el.destroy();
        }

        topEl = el = dom = null;
    });
    
    describe("setVisible", function() {
        var offsetsCls = Ext.baseCSSPrefix + 'hidden-offsets',
            clipCls = Ext.baseCSSPrefix + 'hidden-clip',
            visible = Ext.isIE8 ? 'inherit' : 'visible';
        
        beforeEach(function() {
            createElement({});
        });
        
        describe("mode: DISPLAY", function() {
            describe("hiding", function() {
                beforeEach(function() {
                    el.setVisibilityMode(Ext.dom.Element.DISPLAY);
                    el.setVisible(false);
                });
                
                it("should assign display:none", function() {
                    expect(el.getStyle('display')).toBe('none');
                });
                
                it("should not assign visibility:hidden", function() {
                    expect(el.getStyle('visibility')).toBe(visible);
                });
                
                it("should not assign offsetsCls", function() {
                    expect(el.hasCls(offsetsCls)).toBe(false);
                });
                
                it("should not assign clipCls", function() {
                    expect(el.hasCls(clipCls)).toBe(false);
                });
                
                describe("showing", function() {
                    beforeEach(function() {
                        el.setVisible(true);
                    });
                    
                    it("should assign display:block", function() {
                        expect(el.getStyle('display')).toBe('block');
                    });
                    
                    it("should not assign visibility:hidden", function() {
                        expect(el.getStyle('visibility')).toBe(visible);
                    });
                    
                    it("should not assign offsetsCls", function() {
                        expect(el.hasCls(offsetsCls)).toBe(false);
                    });
                    
                    it("should not assign clipCls", function() {
                        expect(el.hasCls(clipCls)).toBe(false);
                    });
                });
            });
        });

        describe("mode: VISIBILITY", function() {
            describe("hiding", function() {
                beforeEach(function() {
                    el.setVisibilityMode(Ext.dom.Element.VISIBILITY);
                    el.setVisible(false);
                });
                
                it("should assign visibility:hidden", function() {
                    expect(el.getStyle('visibility')).toBe('hidden');
                });
                
                it("should not assign display:none", function() {
                    expect(el.getStyle('display')).toBe('block');
                });
                
                it("should not assign offsetsCls", function() {
                    expect(el.hasCls(offsetsCls)).toBe(false);
                });
                
                it("should not assign clipCls", function() {
                    expect(el.hasCls(clipCls)).toBe(false);
                });
                
                describe("showing", function() {
                    beforeEach(function() {
                        el.setVisible(true);
                    });
                    
                    it("should assign visibility:visible", function() {
                        expect(el.getStyle('visibility')).toBe(visible);
                    });
                    
                    it("should not assign display:none", function() {
                        expect(el.getStyle('display')).toBe('block');
                    });
                    
                    it("should not assign offsetsCls", function() {
                        expect(el.hasCls(offsetsCls)).toBe(false);
                    });
                    
                    it("should not assign clipCls", function() {
                        expect(el.hasCls(clipCls)).toBe(false);
                    });
                });
            });
        });

        describe("mode: OFFSETS", function() {
            describe("hiding", function() {
                beforeEach(function() {
                    el.setVisibilityMode(Ext.dom.Element.OFFSETS);
                    el.setVisible(false);
                });
                
                it("should assign offsetsCls", function() {
                    expect(el.hasCls(offsetsCls)).toBe(true);
                });
                
                it("should not assign display:none", function() {
                    expect(el.getStyle('display')).toBe('block');
                });
                
                it("should not assign clipCls", function() {
                    expect(el.hasCls(clipCls)).toBe(false);
                });
                
                describe("showing", function() {
                    beforeEach(function() {
                        el.setVisible(true);
                    });
                    
                    it("should reset offsetsCls", function() {
                        expect(el.hasCls(offsetsCls)).toBe(false);
                    });
                    
                    it("should not assign display:none", function() {
                        expect(el.getStyle('display')).toBe('block');
                    });
                    
                    it("should not assign visibility:hidden", function() {
                        expect(el.getStyle('visibility')).toBe(visible);
                    });
                    
                    it("should not assign clipCls", function() {
                        expect(el.hasCls(clipCls)).toBe(false);
                    });
                });
            });
        });

        describe("mode: CLIP", function() {
            describe("hiding", function() {
                beforeEach(function() {
                    el.setVisibilityMode(Ext.dom.Element.CLIP);
                    el.setVisible(false);
                });
                
                it("should assign clipCls", function() {
                    expect(el.hasCls(clipCls)).toBe(true);
                });
                
                it("should not assign display:none", function() {
                    expect(el.getStyle('display')).toBe('block');
                });
                
                it("should not assign visibility:hidden", function() {
                    expect(el.getStyle('visibility')).toBe(visible);
                });
                
                it("should not assign offsetsCls", function() {
                    expect(el.hasCls(offsetsCls)).toBe(false);
                });
                
                describe("showing", function() {
                    beforeEach(function() {
                        el.setVisible(true);
                    });
                    
                    it("should reset clipCls", function() {
                        expect(el.hasCls(clipCls)).toBe(false);
                    });
                    
                    it("should not assign display:none", function() {
                        expect(el.getStyle('display')).toBe('block');
                    });
                    
                    it("should not assign visibility:hidden", function() {
                        expect(el.getStyle('visibility')).toBe(visible);
                    });
                    
                    it("should not assign offsetsCls", function() {
                        expect(el.hasCls(offsetsCls)).toBe(false);
                    });
                });
            });
        });
    });
    
    describe("focusables", function() {
        function createFocusableSpecs(name, beforeFn, wantFocusable) {
            return describe(name, function() {
                beforeEach(beforeFn || function() {});
                
                it("isFocusable should return " + wantFocusable, function() {
                    expect(el.isFocusable()).toBe(wantFocusable);
                });
                
                it("element should " + (wantFocusable ? "" : "not ") + "focus", function() {
                    focusAndExpect(el, wantFocusable);
                });
            });
        }
        
        // Keep in mind that we're testing focusability here, not tabbability!
        // Elements with tabIndex < should be programmatically focusable!
        function createStandardSuite(wantFocusable) {
            createFocusableSpecs(
                "with tabIndex < 0",
                function() { dom.setAttribute('tabIndex', -1) },
                wantFocusable
            );
            
            createFocusableSpecs(
                "with tabIndex = 0",
                function() { dom.setAttribute('tabIndex', 0) },
                wantFocusable
            );
            
            createFocusableSpecs(
                "with tabIndex > 0",
                function() { dom.setAttribute('tabIndex', 1) },
                wantFocusable
            );
        }
        
        function createVisibilitySuites(clipMode, debug) {
            function createVisibilitySpecs(mode, wantFocusable) {
                var realMode = Ext.Element[mode];
                
                return describe("hidden with mode: " + mode, function() {
                    beforeEach(function() {
                        if (debug) {
                            debugger;
                        }
                        
                        el.setVisibilityMode(realMode);
                        el.setVisible(false);
                    });
                    
                    createStandardSuite(!!wantFocusable);
                });
            }
            
            // When an element is hidden it should not be focusable,
            // *unless* it is hidden with CLIP visibility mode.
            // Clipping is used specifically for visually hiding elements
            // while keeping them focusable and tabbable - *if* these
            // elements are naturally focusable.
            createVisibilitySpecs('VISIBILITY');
            createVisibilitySpecs('DISPLAY');
            createVisibilitySpecs('OFFSETS');
            
            if (clipMode !== 'skip') {
                clipMode = clipMode != null ? clipMode : false;
            
                createVisibilitySpecs('CLIP', clipMode);
            }
        }
        
        describe("isFocusable", function() {
            describe("absolutely non-focusable elements", function() {
                function createSuite(name, elConfig) {
                    return describe(name, function() {
                        beforeEach(function() {
                            createElement(elConfig);
                        });
                        
                        createFocusableSpecs("with no tabIndex", null, false);
                        
                        createStandardSuite(false);
                        
                        createVisibilitySuites();
                    });
                }
                
                createSuite('hidden input', { tag: 'input', type: 'hidden' });
            });
            
            describe("naturally focusable elements", function() {
                function createSuite(name, elConfig) {
                    return describe(name, function() {
                        beforeEach(function() {
                            createElement(elConfig);
                        });
                        
                        describe("no special attributes", function() {
                            it("is true with no tabIndex on " + name, function() {
                                expect(el.isFocusable()).toBe(true);
                            });
                            
                            it("is true for " + name + " with tabIndex = 0", function() {
                                dom.tabIndex = 0;
                                
                                expect(el.isFocusable()).toBe(true);
                            });
                            
                            it("is true for " + name + " with tabIndex > 0", function() {
                                dom.tabIndex = 42;
                                
                                expect(el.isFocusable()).toBe(true);
                            });
                            
                            it("is true for " + name + " with tabIndex < 0", function() {
                                dom.tabIndex = -100;
                                
                                expect(el.isFocusable()).toBe(true);
                            });
                            
                            createVisibilitySuites(true);
                        });
                        
                        if ( disableableTags[ (elConfig.tag || 'div').toUpperCase() ] ) {
                            describe("disabled=true " + name, function() {
                                beforeEach(function() {
                                    dom.setAttribute('disabled', true);
                                });
                                
                                it("is false with no tabIndex", function() {
                                    expect(el.isFocusable()).toBe(false);
                                });
                                
                                it("is false with tabIndex < 0", function() {
                                    dom.tabIndex = -42;
                                    
                                    expect(el.isFocusable()).toBe(false);
                                });
                                
                                it("is false with tabIndex = 0", function() {
                                    dom.setAttribute('tabIndex', 0);
                                    
                                    expect(el.isFocusable()).toBe(false);
                                });
                                
                                it("is false with tabIndex > 0", function() {
                                    dom.tabIndex = 42;
                                    
                                    expect(el.isFocusable()).toBe(false);
                                });
                                
                                // disabled and invisible should not be focusable
                                // even when clipped
                                createVisibilitySuites(false);
                            });
                        }
                        
                        describe("editable " + name, function() {
                            beforeEach(function() {
                                dom.setAttribute('contenteditable', true);
                            });
                            
                            it("is true for " + name + " with no tabIndex", function() {
                                expect(el.isFocusable()).toBeTruthy();
                            });
                            
                            it("is true for " + name + " with tabIndex < 0", function() {
                                dom.tabIndex = -1;
                                
                                expect(el.isFocusable()).toBeTruthy();
                            });
                            
                            it("is true for " + name + " with tabIndex = 0", function() {
                                dom.tabIndex = 0;
                                
                                expect(el.isFocusable()).toBeTruthy();
                            });
                            
                            it("is true for " + name + " with tabIndex > 0", function() {
                                dom.tabIndex = 1;
                                
                                expect(el.isFocusable()).toBeTruthy();
                            });
                            
                            // editable but invisible should not be focusable
                            // TODO This is a crude hack! Safari 7 fails to focus
                            // editable buttons (can buttons be editable in Safari?)
                            if (!Ext.isSafari) {
                                createVisibilitySuites(true);
                            }
                        });
                    });
                }
                
                createSuite('anchor with href', { tag: 'a', href: '#' });
                createSuite('button', { tag: 'button' });
                createSuite('iframe', { tag: 'iframe' });
                createSuite('bare input', { tag: 'input' });
                createSuite('button input', { tag: 'input', type: 'button' });
                createSuite('text input', { tag: 'input', type: 'text' });
                
                // File input consistently fails to focus programmatically in Firefox.
                // I guess that could be a lame security feature, or just a bug.
                if (!Ext.isGecko) {
                    createSuite('file input', { tag: 'input', type: 'file' });
                }
                
                createSuite('image input', { tag: 'input', type: 'image' });
                createSuite('password input', { tag: 'input', type: 'password' });
                createSuite('submit input', { tag: 'input', type: 'submit' });
                createSuite('checkbox', { tag: 'input', type: 'checkbox' });
                createSuite('radio button', { tag: 'input', type: 'radio' });
                createSuite('select', { tag: 'select', cn: [{ tag: 'option', value: 'foo' }] });
                createSuite('textarea', { tag: 'textarea' });
                
                // There are various failures in IE9-11 that we don't care enough
                // to clean up because <embed> and <object> are rarely used.
                // And we don't even dare running these suites in IE8 because
                // rendering these will result in uncleanable DOM nodes that break
                // all subsequent test specs.
                if (!Ext.isIE) {
                    createSuite('embed', {
                        tag: 'embed',
                        height: 100,
                        width: 100,
                        type: 'image/gif',
                        src: 'resources/images/foo.gif'
                    });

                    createSuite('object', {
                        tag: 'object',
                        style: 'height: 100px; width: 100px',
                        type: 'image/gif',
                        data: 'resources/images/foo.gif'
                    });
                }
            });
            
            if (Ext.isIE) {
                describe("documentElement", function() {
                    it("should report as focusable", function() {
                        var focusable = Ext.fly(document.documentElement).isFocusable();
                        
                        expect(focusable).toBe(true);
                    });
                });
            }
            
            describe("non-naturally focusable elements", function() {
                function createSuite(name, elConfig, selector, testClipping) {
                    testClipping = testClipping == null ? true : testClipping;
                    
                    return describe(name, function() {
                        beforeEach(function() {
                            createElement(elConfig, selector);
                        });
                        
                        describe("no special attributes", function() {
                            it("is false with no tabIndex", function() {
                                expect(el.isFocusable()).toBe(false);
                            });
                            
                            it("is true with tabIndex < 0", function() {
                                dom.setAttribute('tabIndex', '-1');
                                
                                expect(el.isFocusable()).toBe(true);
                            });
                            
                            it("is true with tabIndex = 0", function() {
                                dom.tabIndex = 0;
                                
                                expect(el.isFocusable()).toBe(true);
                            });
                            
                            it("is true with tabIndex > 0", function() {
                                dom.setAttribute('tabIndex', 10);
                                
                                expect(el.isFocusable()).toBe(true);
                            });
                            
                            // Should be focusable when clipped
                            createVisibilitySuites(testClipping ? true : 'skip');
                        });
                        
                        describe("editable " + name, function() {
                            beforeEach(function() {
                                dom.setAttribute('contenteditable', true);
                            });
                            
                            it("is true with no tabIndex", function() {
                                expect(el.isFocusable()).toBe(true);
                            });
                            
                            it("is true with tabIndex < 0", function() {
                                dom.tabIndex = -1;
                                
                                expect(el.isFocusable()).toBe(true);
                            });
                            
                            it("is true with tabIndex = 0", function() {
                                dom.tabIndex = 0;
                                
                                expect(el.isFocusable()).toBe(true);
                            });
                            
                            it("is true with tabIndex > 0", function() {
                                dom.tabIndex = 1;
                                
                                expect(el.isFocusable()).toBe(true);
                            });
                            
                            // editable but invisible should not be focusable
                            // unless clipped
                            createVisibilitySuites(testClipping ? true : 'skip');
                        });
                    });
                }
                
                createSuite('anchor w/o href', { tag: 'a' });
                createSuite('div', { tag: 'div' });
                createSuite('span', { tag: 'span' });
                createSuite('p', { tag: 'p' });
                createSuite('ul li', { tag: 'ul', cn: [{ tag: 'li' }] }, 'li');
                createSuite('ol li', { tag: 'ol', cn: [{ tag: 'li' }] }, 'li' );
                createSuite('img', { tag: 'img' });
                createSuite('td', {
                    tag: 'table',
                    cn: [{
                        tag: 'tr',
                        cn: [{
                            tag: 'td',
                            html: '&nbsp;'
                        }]
                    }]
                }, 'td', false);
            });
        });
    });
    
    describe("tabbables", function() {
        function createVisibilitySuites(clipMode) {
            function createSuite(mode, wantTabbable) {
                var realMode = Ext.Element[mode];
                
                wantTabbable = wantTabbable != null ? wantTabbable : false;
                
                return describe("hidden with mode: " + mode, function() {
                    beforeEach(function() {
                        el.setVisibilityMode(realMode);
                        el.setVisible(false);
                    });
                    
                    // tabindex < 0 makes an element always untabbable
                    it("is false with tabIndex < 0", function() {
                        el.set({ tabIndex: -1 });
                    
                        expect(el.isTabbable()).toBe(false);
                    });
                    
                    it("is " + wantTabbable + " with tabIndex = 0", function() {
                        el.set({ tabIndex: 0 });
                        
                        expect(el.isTabbable()).toBe(wantTabbable);
                    });
                
                    it("is " + wantTabbable + " with tabIndex > 0", function() {
                        el.set({ tabIndex: 1 });
                        
                        expect(el.isTabbable()).toBe(wantTabbable);
                    });
                });
            }
            
            createSuite('VISIBILITY');
            createSuite('DISPLAY');
            createSuite('OFFSETS');
            createSuite('CLIP', clipMode);
        }
        
        describe("isTabbable", function() {
            describe("absolutely non-tabbable elements", function() {
                function createSuite(name, elConfig) {
                    return describe(name, function() {
                        beforeEach(function() {
                            createElement(elConfig);
                        });
                        
                        it("should be non-tabbable naturally", function() {
                            expect(el.isTabbable()).toBeFalsy();
                        });
                        
                        it("should be non-tabbable with tabIndex < 0", function() {
                            dom.setAttribute('tabIndex', -1);
                            
                            expect(el.isTabbable()).toBeFalsy();
                        });
                        
                        it("should be non-tabbable with tabIndex = 0", function() {
                            dom.setAttribute('tabIndex', 0);
                            
                            expect(el.isTabbable()).toBeFalsy();
                        });
                        
                        it("should be non-tabbable with tabIndex > 0", function() {
                            dom.setAttribute('tabIndex', 1);
                            
                            expect(el.isTabbable()).toBeFalsy();
                        });
                        
                        it("should be non-tabbable with contentEditable", function() {
                            dom.setAttribute('tabIndex', 0);
                            dom.setAttribute('contenteditable', true);
                            
                            expect(el.isTabbable()).toBeFalsy();
                        });
                        
                        // Should not be tabbable even if clipped
                        createVisibilitySuites(false);
                    });
                }
                
                createSuite('hidden input', { tag: 'input', type: 'hidden' });
            });
            
            describe("naturally tabbable elements", function() {
                function createSuite(name, elConfig) {
                    return describe(name, function() {
                        beforeEach(function() {
                            createElement(elConfig);
                        });
                        
                        describe("no special attributes", function() {
                            it("is true with no tabIndex", function() {
                                expect(el.isTabbable()).toBe(true);
                            });
                            
                            it("is false with tabIndex < 0", function() {
                                dom.tabIndex = -100;
                                
                                expect(el.isTabbable()).toBe(false);
                            });
                            
                            it("is true with tabIndex = 0", function() {
                                dom.tabIndex = 0;
                                
                                expect(el.isTabbable()).toBe(true);
                            });
                            
                            it("is true with tabIndex > 0", function() {
                                dom.tabIndex = 42;
                                
                                expect(el.isTabbable()).toBe(true);
                            });
                            
                            // Should be tabbable when clipped
                            createVisibilitySuites(true);
                        });
                    
                        if ( disableableTags[ (elConfig.tag || 'div').toUpperCase() ] ) {
                            describe("disabled=true " + name, function() {
                                beforeEach(function() {
                                    dom.setAttribute('disabled', true);
                                });
                                
                                it("is false with no tabIndex", function() {
                                    expect(el.isTabbable()).toBe(false);
                                });
                                
                                it("is false for disabled " + name + " with tabIndex < 0", function() {
                                    dom.tabIndex = -42;
                                    
                                    expect(el.isTabbable()).toBe(false);
                                });
                                
                                it("is false with tabIndex = 0", function() {
                                    dom.setAttribute('tabIndex', 0);
                                    
                                    expect(el.isTabbable()).toBe(false);
                                });
                                
                                it("is false with tabIndex > 0", function() {
                                    dom.tabIndex = 42;
                        
                                    expect(el.isTabbable()).toBe(false);
                                });
                                
                                // disabled and invisible should not be tabbable
                                // even when clipped
                                createVisibilitySuites(false);
                            });
                        }
                        
                        describe("editable " + name, function() {
                            beforeEach(function() {
                                dom.setAttribute('contenteditable', true);
                            });
                            
                            it("is true with no tabIndex", function() {
                                expect(el.isTabbable()).toBeTruthy();
                            });
                        
                            it("is false with tabIndex < 0", function() {
                                dom.tabIndex = -1;
                            
                                expect(el.isTabbable()).toBeFalsy();
                            });
                        
                            it("is true with tabIndex = 0", function() {
                                dom.tabIndex = 0;
                                
                                expect(el.isTabbable()).toBeTruthy();
                            });
                            
                            it("is true with tabIndex > 0", function() {
                                dom.tabIndex = 1;
                                
                                expect(el.isTabbable()).toBeTruthy();
                            });
                            
                            // editable and invisible should not be tabbable
                            // unless we're clipping
                            createVisibilitySuites(true);
                        });
                    });
                }
            
                createSuite('anchor with href', { tag: 'a', href: '#' });
                createSuite('button', { tag: 'button' });
                createSuite('iframe', { tag: 'iframe' });
                createSuite('bare input', { tag: 'input' });
                createSuite('button input', { tag: 'input', type: 'button' });
                createSuite('text input', { tag: 'input', type: 'text' });
                createSuite('file input', { tag: 'input', type: 'file' });
                createSuite('image input', { tag: 'input', type: 'image' });
                createSuite('password input', { tag: 'input', type: 'password' });
                createSuite('submit input', { tag: 'input', type: 'submit' });
                createSuite('checkbox', { tag: 'input', type: 'checkbox' });
                createSuite('radio button', { tag: 'input', type: 'radio' });
                createSuite('select', { tag: 'select', cn: [{ tag: 'option', value: 'foo' }] });
                createSuite('textarea', { tag: 'textarea' });
                
                // In IE8, <object> is naturally tabbable as well
                if (Ext.isIE8) {
                    createSuite('object', {
                        tag: 'object',
                        style: 'height: 100px; width: 100px',
                        type: 'image/gif',
                        data: 'resources/images/foo.gif'
                    });
                }
            });
            
            describe("non-naturally tabbable elements", function() {
                function createSuite(name, elConfig, selector) {
                    return describe(name, function() {
                        beforeEach(function() {
                            createElement(elConfig, selector);
                        });
                        
                        describe("no special attributes", function() {
                            it("is false with no tabIndex", function() {
                                expect(el.isTabbable()).toBe(false);
                            });
                        
                            it("is false with tabIndex < 0", function() {
                                dom.setAttribute('tabIndex', '-1');
                            
                                expect(el.isTabbable()).toBe(false);
                            });
                        
                            it("is true with tabIndex = 0", function() {
                                dom.tabIndex = 0;
                            
                                expect(el.isTabbable()).toBe(true);
                            });
                        
                            it("is true with tabIndex > 0", function() {
                                dom.setAttribute('tabIndex', 10);
                            
                                expect(el.isTabbable()).toBe(true);
                            });
                            
                            // Should not be tabbable unless we're clippng
                            createVisibilitySuites(true);
                        });
                        
                        describe("editable " + name, function() {
                            beforeEach(function() {
                                dom.setAttribute('contenteditable', true);
                            });
                            
                            it("is true with no tabIndex", function() {
                                expect(el.isTabbable()).toBeTruthy();
                            });
                        
                            it("is false with tabIndex < 0", function() {
                                dom.tabIndex = -1;
                            
                                expect(el.isTabbable()).toBeFalsy();
                            });
                        
                            it("is true with tabIndex = 0", function() {
                                dom.tabIndex = 0;
                                
                                expect(el.isTabbable()).toBeTruthy();
                            });
                            
                            it("is true with tabIndex > 0", function() {
                                dom.tabIndex = 1;
                                
                                expect(el.isTabbable()).toBeTruthy();
                            });
                            
                            // editable but invisible should not be tabbable
                            // unless we're clipping
                            createVisibilitySuites(true);
                        });
                    });
                }
                
                createSuite('anchor w/o href', { tag: 'a' });
                createSuite('div', { tag: 'div' });
                createSuite('span', { tag: 'span' });
                createSuite('p', { tag: 'p' });
                createSuite('ul li', { tag: 'ul', cn: [{ tag: 'li' }] }, 'li');
                createSuite('ol li', { tag: 'ol', cn: [{ tag: 'li' }] }, 'li' );
                createSuite('img', { tag: 'img' });
                createSuite('td', {
                    tag: 'table',
                    cn: [{
                        tag: 'tr',
                        cn: [{
                            tag: 'td',
                            html: '&nbsp;'
                        }]
                    }]
                }, 'td');
                
                if (!Ext.isIE8) {
                    createSuite('object', { tag: 'object' });
                }
            });
        });
        
        describe("finding", function() {
            beforeEach(function() {
                createElement([
                    '<div tabindex="0">',
                        '<a id="test7" href="#">Tabbable</a>',
                        '<a id="test8" href="#" tabindex="-1">Not tabbable</a>',
                        '<a id="test9" href="#" tabindex="0">Tabbable</a>',
                        '<div id="test1">Not tabbable',
                            '<div id="test2" tabindex="-1">Not tabbable',
                                '<div id="test3" tabindex="0">Tabbable',
                                    '<div id="test5" tabindex="1">Tabbable</div>',
                                '</div>',
                            '</div>',
                        '</div>',
                        '<span id="test11">Not tabbable</span>',
                        '<span id="test12" tabindex="-42">Not tabbable</span>',
                        '<span id="test13" tabindex="0">Tabbable</span>',
                        '<button id="test15">Tabbable</button>',
                        '<button id="test16" tabindex="-100">Not tabbable</button>',
                        '<button id="test17" tabindex="0">Tabbable</button>',
                        '<button id="test18" tabindex="1" disabled="disabled">Not tabbable</button>',
                        '<a id="test19">Not tabbable</a>',
                        '<a id="test20" tabindex="-1">Not tabbable</a>',
                        '<a id="test21" tabindex="0">Tabbable</a>',
                        '<iframe id="test23">Tabbable</iframe>',
                        '<iframe id="test24" tabindex="-1">Not tabbable</iframe>',
                        '<iframe id="test25" tabindex="0">Tabbable</iframe>',
                        '<input id="test27" name="Tabbable" />',
                        '<input id="test28" name="Not tabbable 1" tabindex="-12" />',
                        '<input id="test29" name="Not tabbable 2" disabled="disabled" />',
                        '<select id="test30"><option>Tabbable</option></select>',
                        '<select id="test31" tabindex="-1"><option>Not tabbable</option></select>',
                        '<select id="test32" tabindex="1" disabled="true"><option>Not tabbable</option></select>',
                        '<textarea id="test33">Tabbable</textarea>',
                        '<textarea id="test34" tabindex="-1">Not tabbable</textarea>',
                        '<textarea id="test35" tabindex="0" disabled="1">Not tabbable</textarea>',
                        '<p id="test36">Not tabbable</p>',
                    '<div>'
                ]);
            });
            
            describe("all nodes", function() {
                it("should find all tabbable elements including self by default", function() {
                    var els = el.findTabbableElements();
                
                    expect(els.length).toBe(14);
                });
            });
            
            describe("children", function() {
                var els;
                
                beforeEach(function() {
                    els = el.findTabbableElements({
                        skipSelf: true
                    });
                });
                
                it("should find all tabbable sub-elements", function() {
                    expect(els.length).toBe(13);
                });
            
                it("should return correct sub-elements in correct order", function() {
                    expect(els[0].id).toBe('test7');
                    expect(els[1].id).toBe('test9');
                    expect(els[2].id).toBe('test3');
                    expect(els[3].id).toBe('test5');
                    expect(els[4].id).toBe('test13');
                    expect(els[5].id).toBe('test15');
                    expect(els[6].id).toBe('test17');
                    expect(els[7].id).toBe('test21');
                    expect(els[8].id).toBe('test23');
                    expect(els[9].id).toBe('test25');
                    expect(els[10].id).toBe('test27');
                    expect(els[11].id).toBe('test30');
                    expect(els[12].id).toBe('test33');
                });
            });
            
            describe("excludeRoot", function() {
                var els, test1;
                
                beforeEach(function() {
                    test1 = Ext.get('test1');
                    els = el.findTabbableElements({
                        skipSelf: true,
                        excludeRoot: test1
                    });
                });
                
                it("should exclude nodes within excludeRoot", function() {
                    expect(els.length).toBe(11);
                });
                
                it("should return correct children in order", function() {
                    expect(els[0].id).toBe('test7');
                    expect(els[1].id).toBe('test9');
                    expect(els[2].id).toBe('test13');
                    expect(els[3].id).toBe('test15');
                    expect(els[4].id).toBe('test17');
                    expect(els[5].id).toBe('test21');
                    expect(els[6].id).toBe('test23');
                    expect(els[7].id).toBe('test25');
                    expect(els[8].id).toBe('test27');
                    expect(els[9].id).toBe('test30');
                    expect(els[10].id).toBe('test33');
                });
            });
            
            describe("nested tabbable elements", function() {
                beforeEach(function() {
                    createElement([
                        '<div id="window-1009" tabindex="-1">',
                            '<div id="window-1009-tabGuardBeforeEl" tabindex="0"></div>',
                            '<div id="window-1009_header" tabindex="0">',
                                '<div id="window-1009_header-innerCt">',
                                    '<div id="window-1009_header-targetEl">',
                                        '<div id="window-1009_header-title">',
                                            '<div id="window-1009_header-title-textEl">foo</div>',
                                        '</div>',
                                        '<div id="tool-1015" tabindex="-1">',
                                            '<div id="tool-1015-toolEl"></div>',
                                        '</div>',
                                        '<div id="tool-1016" tabindex="-1">',
                                            '<div id="tool-1016-toolEl"></div>',
                                        '</div>',
                                    '</div>',
                                '</div>',
                            '</div>',
                            '<div id="window-1009-body">',
                                '<div id="window-1009-outerCt">',
                                    '<div id="window-1009-innerCt">',
                                        '<div id="window-1009-formWrap">',
                                            '<div id="textfield-1010">',
                                                '<label id="textfield-1010-labelEl" for="textfield-1010-inputEl">',
                                                    '<span>foo:</span>',
                                                '</label>',
                                                '<div id="textfield-1010-bodyEl">',
                                                    '<div id="textfield-1010-triggerWrap">',
                                                        '<div id="textfield-1010-inputWrap">',
                                                            '<input id="textfield-1010-inputEl" type="text" />',
                                                        '</div>',
                                                    '</div>',
                                                    '<div id="textfield-1010-ariaErrorEl"></div>',
                                                '</div>',
                                            '</div>',
                                            '<div id="textfield-1011">',
                                                '<label id="textfield-1011-labelEl" for="textfield-1011-inputEl">',
                                                    '<span>bar:</span>',
                                                '</label>',
                                                '<div id="textfield-1011-bodyEl">',
                                                    '<div id="textfield-1011-triggerWrap">',
                                                        '<div id="textfield-1011-inputWrap">',
                                                            '<input id="textfield-1011-inputEl" type="text" />',
                                                        '</div>',
                                                    '</div>',
                                                    '<div id="textfield-1011-ariaErrorEl"></div>',
                                                '</div>',
                                            '</div>',
                                        '</div>',
                                    '</div>',
                                '</div>',
                            '</div>',
                            '<div id="toolbar-1012" tabindex="0">',
                                '<div id="toolbar-1012-innerCt">',
                                    '<div id="toolbar-1012-targetEl">',
                                        '<a id="button-1013" tabindex="-1">OK</a>',
                                        '<a id="button-1014" tabindex="-1">Cancel</a>',
                                    '</div>',
                                '</div>',
                            '</div>',
                            '<div id="window-1009-tabGuardAfterEl" tabindex="0"></div>',
                        '</div>'
                    ]);
                });
                
                it("should return elements in the right order", function() {
                    var els = topEl.findTabbableElements();
                    
                    expect(els[0].id).toBe('window-1009-tabGuardBeforeEl');
                    expect(els[1].id).toBe('window-1009_header');
                    expect(els[2].id).toBe('textfield-1010-inputEl');
                    expect(els[3].id).toBe('textfield-1011-inputEl');
                    expect(els[4].id).toBe('toolbar-1012');
                    expect(els[5].id).toBe('window-1009-tabGuardAfterEl');
                });
            });
        });
        
        describe("state attributes", function() {
            function createSuite(name, elConfig, selector, deep) {
                return describe(name, function() {
                    var defaultAttr = Ext.Element.tabbableSavedValueAttribute,
                        counterAttr = Ext.Element.tabbableSavedCounterAttribute;
                    
                    beforeEach(function() {
                        createElement(elConfig, selector);
                    });
                    
                    it("should be tabbable before the test (sanity check)", function() {
                        expect(el.isTabbable()).toBeTruthy();
                    });
                    
                    describe("saving", function() {
                        beforeEach(function() {
                            el.saveTabbableState({
                                skipSelf: false,
                                skipChildren: !deep
                            });
                        });
                
                        it("should have the tabbable state saved", function() {
                            var attr = el.getAttribute(defaultAttr);
                
                            expect(attr).toBeTruthy();
                        });
                
                        it("should become non-tabbable", function() {
                            expect(el.isTabbable()).toBeFalsy();
                        });
                        
                        it("should set the counter", function() {
                            var counter = +el.getAttribute(counterAttr);
                            
                            expect(counter).toBe(1);
                        });
                        
                        it("should increment the counter", function() {
                            el.saveTabbableState({
                                skipSelf: false,
                                skipChildren: !deep
                            });
                            
                            var counter = +el.getAttribute(counterAttr);
                            
                            expect(counter).toBe(2);
                        });
                    });
            
                    describe("restoring", function() {
                        it("should be tabbable before the test (sanity check)", function() {
                            expect(el.isTabbable()).toBeTruthy();
                        });
                
                        describe("saved", function() {
                            beforeEach(function() {
                                el.saveTabbableState({
                                    skipSelf: false,
                                    skipChildren: !deep
                                });
                                el.restoreTabbableState();
                            });
                    
                            it("should have the saved attribute removed", function() {
                                var hasIt = dom.hasAttribute(defaultAttr);
                                
                                expect(hasIt).toBeFalsy();
                            });
                            
                            it("should be tabbable again", function() {
                                expect(el.isTabbable()).toBe(true);
                            });
                            
                            it("should remove the counter", function() {
                                var hasIt = dom.hasAttribute(counterAttr);
                                
                                expect(hasIt).toBeFalsy();
                            });
                        });
                        
                        describe("counter", function() {
                            beforeEach(function() {
                                el.saveTabbableState({
                                    skipSelf: false,
                                    skipChildren: !deep
                                });
                                el.saveTabbableState({
                                    skipSelf: false,
                                    skipChildren: !deep
                                });
                            });
                            
                            it("should have counter set (sanity check)", function() {
                                var counter = +el.getAttribute(counterAttr);
                                
                                expect(counter).toBe(2);
                            });
                            
                            describe("> 0", function() {
                                beforeEach(function() {
                                    el.restoreTabbableState();
                                });
                                
                                it("should not restore tabbability", function() {
                                    expect(el.isTabbable()).toBe(false);
                                });
                                
                                it("should decrement the counter", function() {
                                    var counter = +el.getAttribute(counterAttr);
                                    
                                    expect(counter).toBe(1);
                                });
                            });
                        });
                    });
                });
            }
            
            // Standalone elements
            createSuite('a w/ href', { tag: 'a', href: '#' });
            createSuite('button', { tag: 'button' });
            createSuite('input', { tag: 'input', type: 'text' });
            createSuite('div', { tag: 'div', tabIndex: 0 });
                    
            // Hierarchies
            createSuite('div w/ children', {
                tag: 'div',
                tabIndex: 0,
                cn: [{
                    tag: 'div',
                    tabIndex: 1,
                    id: 'foo',
                    cn: [{
                        tag: 'div',
                        tabIndex: 2
                    }]
                }]
            }, '#foo', true);
        });
        
        describe("state", function() {
            function createSuite(name, elConfig, selector, deep) {
                return describe(name, function() {
                    describe(name + " saving", function() {
                        beforeEach(function() {
                            createElement(elConfig, selector);
                        });
                    
                        it("should be tabbable before the test (sanity check)", function() {
                            expect(el.isTabbable()).toBe(true);
                        });
                    
                        describe(name + " element", function() {
                            beforeEach(function() {
                                el.saveTabbableState({
                                    skipSelf: false,
                                    skipChildren: true
                                });
                            });
                        
                            it("should be removed from tab order", function() {
                                expect(el.isTabbable()).toBe(false);
                            });
                        
                            if (deep) {
                                it("should not disable children tabbable state", function() {
                                    var cn = el.findTabbableElements({
                                        skipSelf: true
                                    });
                                
                                    expect(cn.length).toBeTruthy();
                                });
                            }
                        });
                    
                        if (deep) {
                            describe(name + " children", function() {
                                beforeEach(function() {
                                    el.saveTabbableState({
                                        skipSelf: false,
                                        skipChildren: !deep
                                    });
                                });
                            
                                it("should remove children from tab order", function() {
                                    var cn = el.findTabbableElements({
                                        skipSelf: true
                                    });
                                
                                    expect(cn.length).toBe(0);
                                });
                            });
                        }
                    });
                    
                    describe(name + " restoring", function() {
                        var saved;
                        
                        beforeEach(function() {
                            createElement(elConfig, selector);
                            saved = undefined;
                        });
                        
                        it("should be tabbable before the test (sanity check)", function() {
                            expect(el.isTabbable()).toBe(true);
                        });
                        
                        describe(name + " element saved", function() {
                            beforeEach(function() {
                                saved = dom.getAttribute('tabIndex');
                                el.saveTabbableState();
                            });
                            
                            it("should not be tabbable when state is saved", function() {
                                expect(el.isTabbable()).toBe(false);
                            });
                            
                            describe(name + " element restored", function() {
                                beforeEach(function() {
                                    el.restoreTabbableState();
                                });
                                
                                it("should have the tabIndex attribute restored", function() {
                                    var idx = dom.getAttribute('tabIndex');
                                    
                                    expect(idx).toBe(saved);
                                });
                                
                                it("should be tabbable again", function() {
                                    expect(el.isTabbable()).toBe(true);
                                });
                            });
                        });
                        
                        if (deep) {
                            describe(name + " children saved", function() {
                                beforeEach(function() {
                                    saved = el.saveTabbableState({
                                        skipSelf: true,
                                        skipChildren: !deep
                                    }) || [];
                                });
                                
                                it("should have no tabbable children when saved", function() {
                                    var cn = el.findTabbableElements({
                                        skipSelf: true
                                    });
                                    
                                    expect(cn.length).toBe(0);
                                });
                                
                                describe(name + " children restored", function() {
                                    beforeEach(function() {
                                        el.restoreTabbableState(/* skipSelf = */ true);
                                    });
                                    
                                    it("should have the same number of tabbable children", function() {
                                        var cn = el.findTabbableElements({
                                            skipSelf: true
                                        });
                                        
                                        expect(cn.length).toBe(saved.length);
                                    });
                                    
                                    it("should have the same tabbable children", function() {
                                        var cn = el.findTabbableElements({
                                            skipSelf: true
                                        });
                                        
                                        for (var i = 0; i < saved.length; i++) {
                                            var c1 = saved[i],
                                                c2 = cn[i];
                                            
                                            expect(c1.id).toBe(c2.id);
                                        }
                                    });
                                });
                            });
                        }
                    });
                });
            }
            
            createSuite('anchor with href natural', { tag: 'a', href: '#' });
            createSuite('anchor with href w/ tabIndex', { tag: 'a', href: '#', tabIndex: 0 });
            
            createSuite('anchor w/o href', { tag: 'a', tabIndex: 0 });
            createSuite('anchor w/o href w/ children', {
                tag: 'a',
                tabIndex: 0,
                cn: [{
                    tag: 'div',
                    tabIndex: 1
                }]
            }, '', true);
            
            createSuite('button natural', { tag: 'button' });
            createSuite('button w/ tabIndex', { tag: 'button', tabIndex: 0 });
            
            createSuite('iframe natural', { tag: 'iframe' });
            createSuite('iframe w/ tabIndex', { tag: 'iframe', tabIndex: 42 });
            
            createSuite('input natural', { tag: 'input' });
            createSuite('input w/ tabIndex', { tag: 'input', tabIndex: 1 });
            
            createSuite('select natural', {
                tag: 'select',
                cn: [{
                    tag: 'option',
                    value: 'foo'
                }]
            });
            createSuite('select w/ tabIndex', {
                tag: 'select',
                tabIndex: 100,
                cn: [{
                    tag: 'option',
                    value: 'bar'
                }]
            });
            
            createSuite('textarea natural', { tag: 'textarea' });
            createSuite('textarea w/ tabIndex', { tag: 'textarea', tabIndex: 1 });
            
            createSuite('div', { tag: 'div', tabIndex: 0 });
            createSuite('div w/ children', {
                tag: 'div',
                tabIndex: 0,
                cn: [{
                    tag: 'div',
                    tabIndex: 1,
                    cn: [{
                        tag: 'div',
                        tabIndex: 2
                    }]
                }]
            }, '', true);
            
            createSuite('span', { tag: 'span', tabIndex: 0 });
            createSuite('p', { tag: 'p', tabIndex: 0 });
            createSuite('img', { tag: 'img', tabIndex: 0 });
            
            createSuite('ul li', {
                tag: 'ul',
                tabIndex: 0,
                cn: [{
                    tag: 'li',
                    tabIndex: 1
                }, {
                    tag: 'li',
                    tabIndex: 2
                }]
            }, null, true);
            
            createSuite('ol li', {
                tag: 'ol',
                tabIndex: 100,
                cn: [{
                    tag: 'li',
                    tabIndex: 101
                }, {
                    tag: 'li',
                    tabIndex: 102
                }]
            }, null, true);
            
            createSuite('table', {
                tag: 'table',
                tabIndex: 0,
                cn: [{
                    tag: 'tr',
                    cn: [{
                        tag: 'td',
                        tabIndex: 1,
                        html: '&nbsp;'
                    }, {
                        tag: 'td',
                        tabIndex: 2,
                        html: '&nbsp;'
                    }]
                }]
            }, null, true);
        });
    });
    
    describe("masking", function() {
        describe("isMasked", function() {
            beforeEach(function() {
                createElement({
                    tag: 'div',
                    id: 'foo',
                    cn: [{
                        tag: 'div',
                        id: 'bar',
                        cn: [{
                            tag: 'div',
                            id: 'baz'
                        }]
                    }]
                }, '#bar');
            });
            
            afterEach(function() {
                Ext.getBody().unmask();
            });
            
            it("should be false when no elements are masked", function() {
                expect(el.isMasked()).toBe(false);
            });
            
            it("should be false when child element is masked", function() {
                var baz = el.down('#baz');

                baz.mask();

                expect(el.isMasked()).toBe(false);

                baz.destroy();
            });
            
            it("should be true when el is masked", function() {
                el.mask();
                
                expect(el.isMasked()).toBe(true);
            });
            
            it("should be false when !hierarchy and the parent is masked", function() {
                topEl.mask();
                
                expect(el.isMasked()).toBe(false);
            });
            
            it("should be true when hierarchy === true and parent is masked", function() {
                topEl.mask();
                
                expect(el.isMasked(true)).toBe(true);
            });
            
            it("should be true when hierarchy === true and body is masked", function() {
                Ext.getBody().mask();
                
                expect(el.isMasked(true)).toBe(true);
            });
        });
        
        describe("an element", function() {
            beforeEach(function() {
                createElement([
                    '<div id="foo" tabindex="0">',
                        '<input id="bar" />',
                        '<div id="baz">',
                            '<textarea id="qux"></textarea>',
                        '</div>',
                    '</div>'
                ]);
            });
            
            describe("when masked", function() {
                beforeEach(function() {
                    el.mask();
                });
                
                it("should save its tabbable state", function() {
                    expect(el.isTabbable()).toBeFalsy();
                });
            
                it("should save its children tabbable states", function() {
                    var tabbables = el.findTabbableElements({
                        skipSelf: true
                    });
                
                    expect(tabbables.length).toBe(0);
                });
            });
            
            describe("when unmasked", function() {
                beforeEach(function() {
                    el.mask();
                    el.unmask();
                });
                
                it("should restore its tabbable state", function() {
                    expect(el.isTabbable()).toBeTruthy();
                });
                
                it("should restore its children tabbable state", function() {
                    var tabbables = el.findTabbableElements({
                        skipSelf: true
                    });
                    
                    expect(tabbables.length).toBe(2);
                });
            });
        });
        
        describe("document body", function() {
            var el, saved;
            
            beforeEach(function() {
                createElement([
                    '<div id="foo" tabindex="0">',
                        '<input id="bar" />',
                        '<div id="baz">',
                            '<textarea id="qux"></textarea>',
                        '</div>',
                    '</div>'
                ]);
                
                el = Ext.getBody();
                saved = el.isTabbable();
            });
            
            afterEach(function() {
                saved = undefined;
                el.unmask();
            });
            
            describe("when masked", function() {
                beforeEach(function() {
                    el.mask();
                });
                
                it("should not change its tabbable state", function() {
                    expect(el.isTabbable()).toBe(saved);
                });
                
                it("should save its children tabbable states", function() {
                    var tabbables = el.findTabbableElements({
                        skipSelf: true
                    });
                    
                    expect(tabbables.length).toBe(0);
                });
            });
            
            describe("when unmasked", function() {
                beforeEach(function() {
                    el.mask();
                    el.unmask();
                });
                
                it("should not change its tabbable state", function() {
                    expect(el.isTabbable()).toBe(saved);
                });
                
                it("should restore its children tabbable states", function() {
                    var tabbables = el.findTabbableElements({
                        skipSelf: true
                    });
                    
                    expect(tabbables.length).toBe(3);
                });
            });
        });
    });

    function describeMethods(fly) {
        describe('methods (using ' + (fly ? 'Ext.fly()' : 'new Ext.dom.Element()') + ')', function(){
            var domEl, element;

            function addElement(tag) {
                domEl = document.createElement(tag || 'div');
                document.body.appendChild(domEl);
                return fly ? Ext.fly(domEl) : Ext.get(domEl);
            }

            afterEach(function() {
                if (element) {
                    // Prevent console warnings
                    spyOn(Ext.Logger, 'warn');
                    element.destroy();
                    element = null;
                }
            });

            describe("hover", function() {
                var overFn, outFn, options;
                beforeEach(function() {
                    element = addElement('div');
                    overFn = function() {
                        return 1;
                    };

                    outFn = function() {
                        return 2;
                    };

                    options = {
                        foo: true
                    };

                    spyOn(element, "on");
                });

                describe("mouseenter event", function() {
                    it("should add a listener on mouseenter", function() {
                        element.hover(overFn, outFn, fakeScope, options);

                        expect(element.on).toHaveBeenCalledWith("mouseenter", overFn, fakeScope, options);
                    });

                    it("should set scope to element.dom if it is not passed in arguments", function() {
                        element.hover(overFn, outFn, null, options);

                        expect(element.on).toHaveBeenCalledWith("mouseenter", overFn, element.dom, options);
                    });
                });

                describe("mouseleave event", function() {
                    it("should add a listener on mouseleave", function() {
                        element.hover(overFn, outFn, fakeScope, options);

                        expect(element.on).toHaveBeenCalledWith("mouseleave", outFn, fakeScope, options);
                    });

                    it("should set scope to element.dom if it is not passed in arguments", function() {
                        element.hover(overFn, outFn, null, options);

                        expect(element.on).toHaveBeenCalledWith("mouseleave", outFn, element.dom, options);
                    });
                });
            });

            if (!fly) {
                describe("setVertical", function() {
                    beforeEach(function() {
                        var styleSheet = document.styleSheets[0],
                            selector = '.vert',
                            props = [
                                '-webkit-transform: rotate(90deg);',
                                '-moz-transform: rotate(90deg);',
                                '-o-transform: rotate(90deg);',
                                '-ms-transform: rotate(90deg);', // IE9
                                'transform: rotate(90deg);'
                            ];
                        
                        // SASS mixin only applies filter in IE8
                        if (Ext.isIE8) {
                            props.push('filter: progid:DXImageTransform.Microsoft.BasicImage(rotation=1);');
                        }
                        
                        props = props.join('');
                        
                        if (styleSheet.insertRule) {
                            styleSheet.insertRule(selector + '{' + props + '}', 1);
                        } else {
                            // IE8
                            styleSheet.addRule(selector, props);
                        }
                        element = addElement('div');
                        element.setWidth(100);
                        element.setHeight(30);
                        
                        element.setVertical(90, 'vert');
                    });

                    afterEach(function() {
                        var styleSheet = document.styleSheets[0];
                        if (styleSheet.deleteRule) {

                            styleSheet.deleteRule(1);
                        } else {
                            // IE8
                            styleSheet.removeRule(styleSheet.rules.length - 1);
                        }
                    });

                    it("should add the css class", function() {
                        expect(element.hasCls('vert')).toBe(true);
                    });

                    it("should get the width using getWidth()", function() {
                        expect(element.getWidth()).toBe(30);
                    });

                    it("should get the width using getStyle('width')", function() {
                        expect(element.getStyle('width')).toBe('30px');
                    });

                    it("should get the height using getHeight", function() {
                        expect(element.getHeight()).toBe(100);
                    });

                    it("should get the height using getStyle('height')", function() {
                        expect(element.getStyle('height')).toBe('100px');
                    });

                    it("should set the width using setWidth()", function() {
                        element.setWidth(200);
                        expect(element.getWidth()).toBe(200);
                    });

                    it("should set the width using setStyle('width')", function() {
                        element.setStyle('width', '200px');
                        expect(element.getWidth()).toBe(200);
                    });

                    it("should set the height using setHeight()", function() {
                        element.setHeight(200);
                        expect(element.getHeight()).toBe(200);
                    });

                    it("should set the height using setStyle('height')", function() {
                        element.setStyle('height', '200px');
                        expect(element.getHeight()).toBe(200);
                    });

                    describe("setHorizontal", function() {
                        beforeEach(function() {
                            element.setHorizontal();
                        });

                        it("should remove the css class", function() {
                            expect(element.hasCls('vert')).toBe(false);
                        });

                        it("should get the width using getWidth()", function() {
                            expect(element.getWidth()).toBe(100);
                        });

                        it("should get the width using getStyle('width')", function() {
                            expect(element.getStyle('width')).toBe('100px');
                        });

                        it("should get the height using getHeight", function() {
                            expect(element.getHeight()).toBe(30);
                        });

                        it("should get the height using getStyle('height')", function() {
                            expect(element.getStyle('height')).toBe('30px');
                        });

                        it("should set the width using setWidth()", function() {
                            element.setWidth(200);
                            expect(element.getWidth()).toBe(200);
                        });

                        it("should set the width using setStyle('width')", function() {
                            element.setStyle('width', '200px');
                            expect(element.getWidth()).toBe(200);
                        });

                        it("should set the height using setHeight()", function() {
                            element.setHeight(200);
                            expect(element.getHeight()).toBe(200);
                        });

                        it("should set the height using setStyle('height')", function() {
                            element.setStyle('height', '200px');
                            expect(element.getHeight()).toBe(200);
                        });
                    });
                });
            }
        });
    }

    describeMethods();
    describeMethods(true);
});
