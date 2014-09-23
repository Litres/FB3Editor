/*
This file is part of Ext JS 5.0.1.1255

Copyright (c) 2011-2014 Sencha Inc

Contact:  http://www.sencha.com/contact

GNU General Public License Usage
This file may be used under the terms of the GNU General Public License version 3.0 as
published by the Free Software Foundation and appearing in the file LICENSE included in the
packaging of this file.

Please review the following information to ensure the GNU General Public License version 3.0
requirements will be met: http://www.gnu.org/copyleft/gpl.html.

If you are unsure which license is appropriate for your use, please contact the sales department
at http://www.sencha.com/contact.

Version: 5.0.1.1255 Build date: 2014-08-05 20:16:49 (2852ec9b146a917f790d13cfa9b9c2fa041fccf8)

*/





var Ext = Ext || {};



Ext.Boot = (function (emptyFn) {

    var doc = document,
        apply = function (dest, src, defaults) {
            if (defaults) {
                apply(dest, defaults);
            }

            if (dest && src && typeof src == 'object') {
                for (var key in src) {
                    dest[key] = src[key];
                }
            }
            return dest;
        },
        _config = {
            
            disableCaching: (/[?&](?:cache|disableCacheBuster)\b/i.test(location.search) ||
                !(/http[s]?\:/i.test(location.href)) ||
                /(^|[ ;])ext-cache=1/.test(doc.cookie)) ? false :
                true,

            
            disableCachingParam: '_dc',

            
            loadDelay: false,

            
            preserveScripts: true,

            
            charset: undefined
        },

        cssRe = /\.css(?:\?|$)/i,
        resolverEl = doc.createElement('a'),
        isBrowser = typeof window !== 'undefined',
        _environment = {
            browser: isBrowser,
            node: !isBrowser && (typeof require === 'function'),
            phantom: (typeof phantom !== 'undefined' && phantom.fs)
        },
        _tags = {},

    
        _debug = function (message) {
            
        },
    
        _apply = function (object, config, defaults) {
            if (defaults) {
                _apply(object, defaults);
            }
            if (object && config && typeof config === 'object') {
                for (var i in config) {
                    object[i] = config[i];
                }
            }
            return object;
        },
    
        Boot = {
            loading: 0,
            loaded: 0,
            env: _environment,
            config: _config,

            
            
            scripts: {
                
            },

            
            currentFile: null,
            suspendedQueue: [],
            currentRequest: null,

            
            
            syncMode: false,

            
            
            debug: _debug,
            
            listeners: [],

            Request: Request,

            Entry: Entry,

            platformTags: _tags,

            
            detectPlatformTags: function () {
                var ua = navigator.userAgent,
                    isMobile = _tags.isMobile = /Mobile(\/|\s)/.test(ua),
                    isPhone, isDesktop, isTablet, touchSupported, isIE10, isBlackberry,
                    element = document.createElement('div'),
                    uaTagChecks = [
                        'iPhone',
                        'iPod',
                        'Android',
                        'Silk',
                        'Android 2',
                        'BlackBerry',
                        'BB',
                        'iPad',
                        'RIM Tablet OS',
                        'MSIE 10',
                        'Trident',
                        'Chrome',
                        'Tizen',
                        'Firefox',
                        'Safari',
                        'Windows Phone'
                    ],
                    isEventSupported = function(name, tag) {
                        if (tag === undefined) {
                            tag = window;
                        }

                        var eventName = 'on' + name.toLowerCase(),
                            isSupported = (eventName in element);

                        if (!isSupported) {
                            if (element.setAttribute && element.removeAttribute) {
                                element.setAttribute(eventName, '');
                                isSupported = typeof element[eventName] === 'function';

                                if (typeof element[eventName] !== 'undefined') {
                                    element[eventName] = undefined;
                                }

                                element.removeAttribute(eventName);
                            }
                        }

                        return isSupported;
                    },
                    uaTags = {},
                    len = uaTagChecks.length, check, c;

                for (c = 0; c < len; c++) {
                    check = uaTagChecks[c];
                    uaTags[check] = new RegExp(check).test(ua);
                }

                isPhone =
                    (uaTags.iPhone || uaTags.iPod) ||
                    (!uaTags.Silk && (uaTags.Android && (uaTags['Android 2'] || isMobile))) ||
                    ((uaTags.BlackBerry || uaTags.BB) && uaTags.isMobile) ||
                    (uaTags['Windows Phone']);

                isTablet =
                    (!_tags.isPhone) && (
                    uaTags.iPad ||
                    uaTags.Android ||
                    uaTags.Silk ||
                    uaTags['RIM Tablet OS'] ||
                    (uaTags['MSIE 10'] && /; Touch/.test(ua))
                    );

                touchSupported =
                    
                    
                    isEventSupported('touchend') ||
                    
                    
                    
                    navigator.maxTouchPoints ||
                    
                    navigator.msMaxTouchPoints;

                isDesktop = !isPhone && !isTablet;
                isIE10 = uaTags['MSIE 10'];
                isBlackberry = uaTags.Blackberry || uaTags.BB;

                apply(_tags, Boot.loadPlatformsParam(), {
                    phone: isPhone,
                    tablet: isTablet,
                    desktop: isDesktop,
                    touch: touchSupported,
                    ios: (uaTags.iPad || uaTags.iPhone || uaTags.iPod),
                    android: uaTags.Android || uaTags.Silk,
                    blackberry: isBlackberry,
                    safari: uaTags.Safari && isBlackberry,
                    chrome: uaTags.Chrome,
                    ie10: isIE10,
                    windows: isIE10 || uaTags.Trident,
                    tizen: uaTags.Tizen,
                    firefox: uaTags.Firefox
                });
            },

            
            loadPlatformsParam: function () {
                
                var paramsString = window.location.search.substr(1),
                    paramsArray = paramsString.split("&"),
                    params = {}, i,
                    platforms = {},
                    tmpArray, tmplen, platform, name, enabled;

                for (i = 0; i < paramsArray.length; i++) {
                    tmpArray = paramsArray[i].split("=");
                    params[tmpArray[0]] = tmpArray[1];
                }

                if (params.platformTags) {
                    tmpArray = params.platform.split(/\W/);
                    for (tmplen = tmpArray.length, i = 0; i < tmplen; i++) {
                        platform = tmpArray[i].split(":");
                        name = platform[0];
                        if (platform.length > 1) {
                            enabled = platform[1];
                            if (enabled === 'false' || enabled === '0') {
                                enabled = false;
                            } else {
                                enabled = true;
                            }
                        }
                        platforms[name] = enabled;
                    }
                }
                return platform;
            },

            getPlatformTags: function () {
                return Boot.platformTags;
            },

            filterPlatform: function (platform) {
                platform = [].concat(platform);
                var tags = Boot.getPlatformTags(),
                    len, p, tag;

                for (len = platform.length, p = 0; p < len; p++) {
                    tag = platform[p];
                    if (tags.hasOwnProperty(tag)) {
                        return !!tags[tag];
                    }
                }
                return false;
            },

            init: function () {
                var me = this,
                    scriptEls = doc.getElementsByTagName('script'),
                    len = scriptEls.length,
                    re = /\/ext(\-[a-z\-]+)?\.js$/,
                    entry, script, src, state, baseUrl, key, n, origin;

                
                
                
                for (n = 0; n < len; n++) {
                    src = (script = scriptEls[n]).src;
                    if (!src) {
                        continue;
                    }
                    state = script.readyState || null;

                    
                    if (!baseUrl) {
                        if (re.test(src)) {
                            me.hasReadyState = ("readyState" in script);
                            me.hasAsync = ("async" in script) || !me.hasReadyState;
                            baseUrl = src;
                        }
                    }

                    if (!me.scripts[key = me.canonicalUrl(src)]) {
                        
                        _debug("creating entry " + key + " in Boot.init");
                        
                        entry = new Entry({
                            key: key,
                            url: src,
                            done: state === null ||  
                                state === 'loaded' || state === 'complete', 
                            el: script,
                            prop: 'src'
                        });
                    }
                }

                if (!baseUrl) {
                    script = scriptEls[scriptEls.length - 1];
                    baseUrl = script.src;
                    me.hasReadyState = ('readyState' in script);
                    me.hasAsync = ("async" in script) || !me.hasReadyState;
                }

                me.baseUrl = baseUrl.substring(0, baseUrl.lastIndexOf('/') + 1);
                origin = window.location.origin ||
                    window.location.protocol +
                    "//" +
                    window.location.hostname +
                    (window.location.port ? ':' + window.location.port: '');
                me.origin = origin;

                me.detectPlatformTags();
                Ext.filterPlatform = me.filterPlatform;
            },

            
            canonicalUrl: function (url) {
                
                
                resolverEl.href = url;

                var ret = resolverEl.href,
                    dc = _config.disableCachingParam,
                    pos = dc ? ret.indexOf(dc + '=') : -1,
                    c, end;

                
                
                if (pos > 0 && ((c = ret.charAt(pos - 1)) === '?' || c === '&')) {
                    end = ret.indexOf('&', pos);
                    end = (end < 0) ? '' : ret.substring(end);
                    if (end && c === '?') {
                        ++pos; 
                        end = end.substring(1); 
                    }
                    ret = ret.substring(0, pos - 1) + end;
                }

                return ret;
            },

            
            getConfig: function (name) {
                return name ? this.config[name] : this.config;
            },

            
            setConfig: function (name, value) {
                if (typeof name === 'string') {
                    this.config[name] = value;
                } else {
                    for (var s in name) {
                        this.setConfig(s, name[s]);
                    }
                }
                return this;
            },

            getHead: function () {
                return this.docHead ||
                    (this.docHead = doc.head ||
                        doc.getElementsByTagName('head')[0]);
            },

            create: function (url, key, cfg) {
                var config = cfg || {};
                config.url = url;
                config.key = key;
                return this.scripts[key] = new Entry(config);
            },

            getEntry: function (url, cfg) {
                var key = this.canonicalUrl(url),
                    entry = this.scripts[key];
                if (!entry) {
                    entry = this.create(url, key, cfg);
                }
                return entry;
            },

            processRequest: function(request, sync) {
                request.loadEntries(sync);
            },

            load: function (request) {
                
                _debug("Boot.load called");
                
                var me = this,
                    request = new Request(request);

                if(request.sync || me.syncMode) {
                    return me.loadSync(request);
                }

                
                
                if (me.currentRequest) {
                    
                    _debug("current active request, suspending this request");
                    
                    
                    
                    
                    request.getEntries();
                    me.suspendedQueue.push(request);
                } else {
                    me.currentRequest = request;
                    me.processRequest(request, false);
                }
                return me;
            },

            loadSync: function (request) {
                
                _debug("Boot.loadSync called");
                
                var me = this,
                    request = new Request(request);

                me.syncMode++;
                me.processRequest(request, true);
                me.syncMode--;
                return me;
            },

            loadBasePrefix: function(request) {
                request = new Request(request);
                request.prependBaseUrl = true;
                return this.load(request);
            },

            loadSyncBasePrefix: function(request) {
                request = new Request(request);
                request.prependBaseUrl = true;
                return this.loadSync(request);
            },

            requestComplete: function(request) {
                var me = this,
                    next;
                if(me.currentRequest === request) {
                    me.currentRequest = null;
                    while(me.suspendedQueue.length > 0) {
                        next = me.suspendedQueue.shift();
                        if(!next.done) {
                            
                            _debug("resuming suspended request");
                            
                            me.load(next);
                            break;
                        }
                    }
                }
                if(!me.currentRequest && me.suspendedQueue.length == 0) {
                    me.fireListeners();
                }
            },

            isLoading: function () {
                return !this.currentRequest && this.suspendedQueue.length == 0;
            },

            fireListeners: function () {
                var listener;
                while (this.isLoading() && (listener = this.listeners.shift())) {
                    listener();
                }
            },

            onBootReady: function (listener) {
                if (!this.isLoading()) {
                    listener();
                } else {
                    this.listeners.push(listener);
                }
            },

            
            getPathsFromIndexes: function (indexMap, loadOrder) {
                return Request.prototype.getPathsFromIndexes(indexMap, loadOrder);
            },

            createLoadOrderMap: function(loadOrder) {
                return Request.prototype.createLoadOrderMap(loadOrder);
            },

            fetchSync: function(url) {
                var exception, xhr, status, content;

                exception = false;
                xhr = new XMLHttpRequest();

                try {
                    xhr.open('GET', url, false);
                    xhr.send(null);
                } catch (e) {
                    exception = true;
                }

                status = (xhr.status === 1223) ? 204 :
                    (xhr.status === 0 && ((self.location || {}).protocol === 'file:' ||
                        (self.location || {}).protocol === 'ionp:')) ? 200 : xhr.status;
                content = xhr.responseText;

                xhr = null; 

                return {
                    content: content,
                    exception: exception,
                    status: status
                };
            },

            notifyAll: function(entry) {
                entry.notifyRequests();
            }
        };

    
    function Request(cfg) {
        if(cfg.$isRequest) {
            return cfg;
        }

        var cfg = cfg.url ? cfg : {url: cfg},
            url = cfg.url,
            urls = url.charAt ? [ url ] : url,
            boot = cfg.boot || Boot,
            charset = cfg.charset || boot.config.charset,
            buster = (('cache' in cfg) ? !cfg.cache : boot.config.disableCaching) &&
                (boot.config.disableCachingParam + '=' + new Date().getTime());
        _apply(cfg, {
            urls: urls,
            boot: boot,
            charset: charset,
            buster: buster
        });
        _apply(this, cfg);
    };
    Request.prototype = {
        $isRequest: true,

        
        createLoadOrderMap: function (loadOrder) {
            var len = loadOrder.length,
                loadOrderMap = {},
                i, element;

            for (i = 0; i < len; i++) {
                element = loadOrder[i];
                loadOrderMap[element.path] = element;
            }

            return loadOrderMap;
        },

        
        getLoadIndexes: function (index, indexMap, loadOrder, includeUses, skipLoaded) {
            var item = loadOrder[index],
                len, i, reqs, entry, stop, added, idx, ridx, url;

            if (indexMap[index]) {
                
                return indexMap;
            }

            indexMap[index] = true;

            stop = false;
            while (!stop) {
                added = false;

                
                
                for (idx in indexMap) {
                    if (indexMap.hasOwnProperty(idx)) {
                        item = loadOrder[idx];
                        if (!item) {
                            continue;
                        }
                        url = this.prepareUrl(item.path);
                        entry = Boot.getEntry(url);
                        if (!skipLoaded || !entry || !entry.done) {
                            reqs = item.requires;
                            if (includeUses && item.uses) {
                                reqs = reqs.concat(item.uses);
                            }
                            for (len = reqs.length, i = 0; i < len; i++) {
                                ridx = reqs[i];
                                
                                
                                
                                
                                if (!indexMap[ridx]) {
                                    indexMap[ridx] = true;
                                    added = true;
                                }
                            }
                        }
                    }
                }

                
                
                if (!added) {
                    stop = true;
                }
            }

            return indexMap;
        },

        getPathsFromIndexes: function (indexMap, loadOrder) {
            var indexes = [],
                paths = [],
                index, len, i;

            for (index in indexMap) {
                if (indexMap.hasOwnProperty(index) && indexMap[index]) {
                    indexes.push(index);
                }
            }

            indexes.sort(function (a, b) {
                return a - b;
            });

            
            for (len = indexes.length, i = 0; i < len; i++) {
                paths.push(loadOrder[indexes[i]].path);
            }

            return paths;
        },

        expandUrl: function (url, indexMap, includeUses, skipLoaded) {
            if (typeof url == 'string') {
                url = [url];
            }

            var me = this,
                loadOrder = me.loadOrder,
                loadOrderMap = me.loadOrderMap;

            if (loadOrder) {
                loadOrderMap = loadOrderMap || me.createLoadOrderMap(loadOrder);
                me.loadOrderMap = loadOrderMap;
                indexMap = indexMap || {};
                var len = url.length,
                    unmapped = [],
                    i, item;

                for (i = 0; i < len; i++) {
                    item = loadOrderMap[url[i]];
                    if (item) {
                        me.getLoadIndexes(item.idx, indexMap, loadOrder, includeUses, skipLoaded);
                    } else {
                        unmapped.push(url[i]);
                    }
                }


                return me.getPathsFromIndexes(indexMap, loadOrder).concat(unmapped);
            }
            return url;
        },

        expandUrls: function (urls, includeUses) {
            if (typeof urls == "string") {
                urls = [urls];
            }

            var expanded = [],
                expandMap = {},
                tmpExpanded,
                len = urls.length,
                i, t, tlen, tUrl;

            for (i = 0; i < len; i++) {
                tmpExpanded = this.expandUrl(urls[i], {}, includeUses, true);
                for (t = 0, tlen = tmpExpanded.length; t < tlen; t++) {
                    tUrl = tmpExpanded[t];
                    if (!expandMap[tUrl]) {
                        expandMap[tUrl] = true;
                        expanded.push(tUrl);
                    }
                }
            }

            if (expanded.length == 0) {
                expanded = urls;
            }

            return expanded;
        },

        expandLoadOrder: function () {
            var me = this,
                urls = me.urls,
                expanded;

            if (!me.expanded) {
                expanded = this.expandUrls(urls);
                me.expanded = true;
            } else {
                expanded = urls;
            }

            me.urls = expanded;

            
            
            if (urls.length != expanded.length) {
                me.sequential = true;
            }

            return me;
        },

        getUrls: function () {
            this.expandLoadOrder();
            return this.urls;
        },

        prepareUrl: function(url) {
            if(this.prependBaseUrl) {
                return Boot.baseUrl + url;
            }
            return url;
        },

        getEntries: function () {
            var me = this,
                entries = me.entries,
                i, entry, urls, url;
            if (!entries) {
                entries = [];
                urls = me.getUrls();
                for (i = 0; i < urls.length; i++) {
                    url = me.prepareUrl(urls[i]);
                    entry = Boot.getEntry(url, {
                        buster: me.buster,
                        charset: me.charset
                    });
                    entry.requests.push(me);
                    entries.push(entry);
                }
                me.entries = entries;
            }
            return entries;
        },

        loadEntries: function(sync) {
            var me = this,
                entries = me.getEntries(),
                len = entries.length,
                start = me.loadStart || 0,
                continueLoad, entry, i;

            if(sync !== undefined) {
                me.sync = sync;
            }

            me.loaded = me.loaded || 0;
            me.loading = me.loading || len;

            for(i = start; i < len; i++) {
                entry = entries[i];
                if(!entry.loaded) {
                    continueLoad = entries[i].load(me.sync);
                } else {
                    continueLoad = true;
                }
                if(!continueLoad) {
                    me.loadStart = i;
                    entry.onDone(function(){
                        me.loadEntries(sync);
                    });
                    break;
                }
            }
            me.processLoadedEntries();
        },

        processLoadedEntries: function () {
            var me = this,
                entries = me.getEntries(),
                len = entries.length,
                start = me.startIndex || 0,
                i, entry;

            if (!me.done) {
                for (i = start; i < len; i++) {
                    entry = entries[i];

                    if (!entry.loaded) {
                        me.startIndex = i;
                        return;
                    }

                    if (!entry.evaluated) {
                        entry.evaluate();
                    }

                    if (entry.error) {
                        me.error = true;
                    }
                }
                me.notify();
            }
        },

        notify: function () {
            var me = this;
            if (!me.done) {
                var error = me.error,
                    fn = me[error ? 'failure' : 'success'],
                    delay = ('delay' in me)
                        ? me.delay
                        : (error ? 1 : Boot.config.chainDelay),
                    scope = me.scope || me;
                me.done = true;
                if (fn) {
                    if (delay === 0 || delay > 0) {
                        
                        setTimeout(function () {
                            fn.call(scope, me);
                        }, delay);
                    } else {
                        fn.call(scope, me);
                    }
                }
                me.fireListeners();
                Boot.requestComplete(me);
            }
        },

        onDone: function(listener) {
            var me = this,
                listeners = me.listeners || (me.listeners = []);
            if(me.done) {
                listener(me);
            } else {
                listeners.push(listener);
            }
        },

        fireListeners: function() {
            var listeners = this.listeners,
                listener;
            if(listeners) {
                
                _debug("firing request listeners");
                
                while((listener = listeners.shift())) {
                    listener(this);
                }
            }
        }
    };

    
    function Entry(cfg) {
        if(cfg.$isEntry) {
            return cfg;
        }

        
        _debug("creating entry for " + cfg.url);
        

        var boot = cfg.boot || Boot,
            charset = cfg.charset || boot.config.charset,
            buster = cfg.buster || ((('cache' in cfg) ? !cfg.cache : boot.config.disableCaching) &&
                (boot.config.disableCachingParam + '=' + new Date().getTime()));

        _apply(cfg, {
            boot: boot,
            charset: charset,
            buster: buster,
            requests: []
        });
        _apply(this, cfg);
    };
    Entry.prototype = {
        $isEntry: true,
        done: false,
        evaluated: false,
        loaded: false,

        isCrossDomain: function() {
            var me = this;
            if(me.crossDomain === undefined) {
                
                _debug("checking " + me.getLoadUrl() + " for prefix " + Boot.origin);
                
                me.crossDomain = (me.getLoadUrl().indexOf(Boot.origin) !== 0);
            }
            return me.crossDomain;
        },

        isCss: function () {
            var me = this;
            if (me.css === undefined) {
                me.css = me.url && cssRe.test(me.url);
            }
            return this.css;
        },

        getElement: function (tag) {
            var me = this,
                el = me.el;
            if (!el) {
                
                _debug("creating element for " + me.url);
                
                if (me.isCss()) {
                    tag = tag || "link";
                    el = doc.createElement(tag);
                    if(tag == "link") {
                        el.rel = 'stylesheet';
                        me.prop = 'href';
                    } else {
                        me.prop="textContent";
                    }
                    el.type = "text/css";
                } else {
                    tag = tag || "script";
                    el = doc.createElement(tag);
                    el.type = 'text/javascript';
                    me.prop = 'src';
                    if (Boot.hasAsync) {
                        el.async = false;
                    }
                }
                me.el = el;
            }
            return el;
        },

        getLoadUrl: function () {
            var me = this,
                url = Boot.canonicalUrl(me.url);
            if (!me.loadUrl) {
                me.loadUrl = !!me.buster
                    ? (url + (url.indexOf('?') === -1 ? '?' : '&') + me.buster)
                    : url;
            }
            return me.loadUrl;
        },

        fetch: function (req) {
            var url = this.getLoadUrl(),
                async = !!req.async,
                xhr = new XMLHttpRequest(),
                complete = req.complete,
                status, content, exception = false,
                readyStateChange = function () {
                    if (xhr && xhr.readyState == 4) {
                        if (complete) {
                            status = (xhr.status === 1223) ? 204 :
                                (xhr.status === 0 && ((self.location || {}).protocol === 'file:' ||
                                    (self.location || {}).protocol === 'ionp:')) ? 200 : xhr.status;
                            content = xhr.responseText;
                            complete({
                                content: content,
                                status: status,
                                exception: exception
                            });
                        }
                        xhr = null;
                    }
                };

            async = !!async;

            if(async) {
                xhr.onreadystatechange = readyStateChange;
            }

            try {
                
                _debug("fetching " + url + " " + (async ? "async" : "sync"));
                
                xhr.open('GET', url, async);
                xhr.send(null);
            } catch (err) {
                exception = err;
                readyStateChange();
            }

            if(!async) {
                readyStateChange();
            }
        },

        onContentLoaded: function (response) {
            var me = this,
                status = response.status,
                content = response.content,
                exception = response.exception,
                url = this.getLoadUrl();
            me.loaded = true;
            if ((exception || status === 0) && !_environment.phantom) {
                me.error =
                    
                    ("Failed loading synchronously via XHR: '" + url +
                        "'. It's likely that the file is either being loaded from a " +
                        "different domain or from the local file system where cross " +
                        "origin requests are not allowed for security reasons. Try " +
                        "asynchronous loading instead.") ||
                    
                    true;
                me.evaluated = true;
            }
            else if ((status >= 200 && status < 300) || status === 304
                || _environment.phantom
                || (status === 0 && content.length > 0)
                ) {
                me.content = content;
            }
            else {
                me.error =
                    
                    ("Failed loading synchronously via XHR: '" + url +
                        "'. Please verify that the file exists. XHR status code: " +
                        status) ||
                    
                    true;
                me.evaluated = true;
            }
        },

        createLoadElement: function(callback) {
            var me = this,
                el = me.getElement(),
                readyStateChange = function(){
                    if (this.readyState === 'loaded' || this.readyState === 'complete') {
                        if(callback) {
                            callback();
                        }
                    }
                },
                errorFn = function() {
                    me.error = true;
                    if(callback) {
                        callback();
                    }
                };
            me.preserve = true;
            el.onerror = errorFn;
            if(Boot.hasReadyState) {
                el.onreadystatechange = readyStateChange;
            } else {
                el.onload = callback;
            }
            
            el[me.prop] = me.getLoadUrl();
        },

        onLoadElementReady: function() {
            Boot.getHead().appendChild(this.getElement());
            this.evaluated = true;
        },

        inject: function (content, asset) {
            
            _debug("injecting content for " + this.url);
            
            var me = this,
                head = Boot.getHead(),
                url = me.url,
                key = me.key,
                base, el, ieMode, basePath;

            if (me.isCss()) {
                me.preserve = true;
                basePath = key.substring(0, key.lastIndexOf("/") + 1);
                base = doc.createElement('base');
                base.href = basePath;
                if(head.firstChild) {
                    head.insertBefore(base, head.firstChild);
                } else {
                    head.appendChild(base);
                }
                
                base.href = base.href;

                if (url) {
                    content += "\n/*# sourceURL=" + key + " */";
                }

                
                el = me.getElement("style");

                ieMode = ('styleSheet' in el);

                head.appendChild(base);
                if(ieMode) {
                    head.appendChild(el);
                    el.styleSheet.cssText = content;
                } else {
                    el.textContent = content;
                    head.appendChild(el);
                }
                head.removeChild(base);

            } else {
                
                
                
                if (url) {
                    content += "\n//# sourceURL=" + key;
                }
                Ext.globalEval(content);
            }
            return me;
        },

        loadCrossDomain: function() {
            var me = this,
                complete = function(){
                    me.loaded = me.evaluated = me.done = true;
                    me.notifyRequests();
                };
            if(me.isCss()) {
                me.createLoadElement();
                me.evaluateLoadElement();
                complete();
            } else {
                me.createLoadElement(function(){
                    complete();
                });
                me.evaluateLoadElement();
                
                
                
                return false;
            }
            return true;
        },

        loadSync: function() {
            var me = this;
            me.fetch({
                async: false,
                complete: function (response) {
                    me.onContentLoaded(response);
                }
            });
            me.evaluate();
            me.notifyRequests();
        },

        load: function (sync) {
            var me = this;
            if (!me.loaded) {
                if(me.loading) {
                    
                    
                    
                    
                    
                    
                    
                    return false;
                }
                me.loading = true;

                
                if (!sync) {
                    
                    
                    if(me.isCrossDomain()) {
                        return me.loadCrossDomain();
                    }
                    
                    
                    
                    else if(!me.isCss() && Boot.hasReadyState) {
                        me.createLoadElement(function () {
                            me.loaded = true;
                            me.notifyRequests();
                        });
                    }

                    
                    
                    else {
                        me.fetch({
                            async: !sync,
                            complete: function (response) {
                                me.onContentLoaded(response);
                                me.notifyRequests();
                            }
                        });
                    }
                }

                
                
                
                else {
                    me.loadSync();
                }
            }
            
            return true;
        },

        evaluateContent: function () {
            this.inject(this.content);
            this.content = null;
        },

        evaluateLoadElement: function() {
            Boot.getHead().appendChild(this.getElement());
        },

        evaluate: function () {
            var me = this;
            if(!me.evaluated) {
                if(me.evaluating) {
                    return;
                }
                me.evaluating = true;
                if(me.content !== undefined) {
                    me.evaluateContent();
                } else if(!me.error) {
                    me.evaluateLoadElement();
                }
                me.evaluated = me.done = true;
                me.cleanup();
            }
        },

        
        cleanup: function () {
            var me = this,
                el = me.el,
                prop;

            if (!el) {
                return;
            }

            if (!me.preserve) {
                me.el = null;

                el.parentNode.removeChild(el); 

                for (prop in el) {
                    try {
                        if (prop !== me.prop) {
                            
                            
                            el[prop] = null;
                        }
                        delete el[prop];      
                    } catch (cleanEx) {
                        
                    }
                }
            }

            
            
            
            el.onload = el.onerror = el.onreadystatechange = emptyFn;
        },

        notifyRequests: function () {
            var requests = this.requests,
                len = requests.length,
                i, request;
            for (i = 0; i < len; i++) {
                request = requests[i];
                request.processLoadedEntries();
            }
            if(this.done) {
                this.fireListeners();
            }
        },

        onDone: function(listener) {
            var me = this,
                listeners = me.listeners || (me.listeners = []);
            if(me.done) {
                listener(me);
            } else {
                listeners.push(listener);
            }
        },

        fireListeners: function() {
            var listeners = this.listeners,
                listener;
            if(listeners && listeners.length > 0) {
                
                _debug("firing event listeners for url " + this.url);
                
                while((listener = listeners.shift())) {
                    listener(this);
                }
            }
        }
    };

    
    Ext.disableCacheBuster = function (disable, path) {
        var date = new Date();
        date.setTime(date.getTime() + (disable ? 10 * 365 : -1) * 24 * 60 * 60 * 1000);
        date = date.toGMTString();
        doc.cookie = 'ext-cache=1; expires=' + date + '; path=' + (path || '/');
    };


    if (_environment.node) {
        Boot.prototype.load = Boot.prototype.loadSync = function (request) {
            
            require(filePath);
            onLoad.call(scope);
        };
        Boot.prototype.init = emptyFn;
    }


    Boot.init();
    return Boot;



}(function () {
}));


Ext.globalEval = Ext.globalEval || (this.execScript
    ? function (code) { execScript(code); }
    : function ($$code) { eval.call(window, $$code); });



if (!Function.prototype.bind) {
    (function () {
        var slice = Array.prototype.slice,
        
        
            bind = function (me) {
                var args = slice.call(arguments, 1),
                    method = this;

                if (args.length) {
                    return function () {
                        var t = arguments;
                        
                        return method.apply(me, t.length ? args.concat(slice.call(t)) : args);
                    };
                }
                

                args = null;
                return function () {
                    return method.apply(me, arguments);
                };
            };
        Function.prototype.bind = bind;
        bind.$extjs = true; 
    }());
}




var Ext = Ext || {};
(function(manifest){
    if(!Ext.manifest) {
        Ext.manifest = manifest;
    } else {
        for(var name in manifest) {
            Ext.manifest[name] = manifest[name];
        }
    }
})({
  "paths": {
    "Ext": "../src",
    "Ext-more": "../overrides/Ext-more.js",
    "Ext.AbstractManager": "../packages/sencha-core/src/AbstractManager.js",
    "Ext.Ajax": "../packages/sencha-core/src/Ajax.js",
    "Ext.AnimationQueue": "../packages/sencha-core/src/AnimationQueue.js",
    "Ext.Array": "../packages/sencha-core/src/lang/Array.js",
    "Ext.Assert": "../packages/sencha-core/src/lang/Assert.js",
    "Ext.Base": "../packages/sencha-core/src/class/Base.js",
    "Ext.Class": "../packages/sencha-core/src/class/Class.js",
    "Ext.ClassManager": "../packages/sencha-core/src/class/ClassManager.js",
    "Ext.ComponentManager": "../packages/sencha-core/src/ComponentManager.js",
    "Ext.ComponentQuery": "../packages/sencha-core/src/ComponentQuery.js",
    "Ext.Config": "../packages/sencha-core/src/class/Config.js",
    "Ext.Configurator": "../packages/sencha-core/src/class/Configurator.js",
    "Ext.Date": "../packages/sencha-core/src/lang/Date.js",
    "Ext.Error": "../packages/sencha-core/src/lang/Error.js",
    "Ext.Evented": "../packages/sencha-core/src/Evented.js",
    "Ext.Factory": "../packages/sencha-core/src/mixin/Factoryable.js",
    "Ext.Function": "../packages/sencha-core/src/lang/Function.js",
    "Ext.GlobalEvents": "../packages/sencha-core/src/GlobalEvents.js",
    "Ext.Inventory": "../packages/sencha-core/src/class/Inventory.js",
    "Ext.JSON": "../packages/sencha-core/src/JSON.js",
    "Ext.Loader": "../packages/sencha-core/src/class/Loader.js",
    "Ext.Mixin": "../packages/sencha-core/src/class/Mixin.js",
    "Ext.Msg": "../src/window/MessageBox.js",
    "Ext.Number": "../packages/sencha-core/src/lang/Number.js",
    "Ext.Object": "../packages/sencha-core/src/lang/Object.js",
    "Ext.Script": "../packages/sencha-core/src/class/Inventory.js",
    "Ext.String": "../packages/sencha-core/src/lang/String.js",
    "Ext.String.format": "../packages/sencha-core/src/Template.js",
    "Ext.TaskQueue": "../packages/sencha-core/src/TaskQueue.js",
    "Ext.Template": "../packages/sencha-core/src/Template.js",
    "Ext.Util": "../packages/sencha-core/src/Util.js",
    "Ext.Version": "../packages/sencha-core/src/util/Version.js",
    "Ext.Widget": "../packages/sencha-core/src/Widget.js",
    "Ext.XTemplate": "../packages/sencha-core/src/XTemplate.js",
    "Ext.app.ViewModel": "../packages/sencha-core/src/app/ViewModel.js",
    "Ext.app.bind": "../packages/sencha-core/src/app/bind",
    "Ext.browser": "../packages/sencha-core/src/env/Browser.js",
    "Ext.class": "../packages/sencha-core/src/class",
    "Ext.data": "../packages/sencha-core/src/data",
    "Ext.direct": "../packages/sencha-core/src/direct",
    "Ext.dom": "../packages/sencha-core/src/dom",
    "Ext.dom.ButtonElement": "../src/dom/ButtonElement.js",
    "Ext.dom.Layer": "../src/dom/Layer.js",
    "Ext.env": "../packages/sencha-core/src/env",
    "Ext.event": "../packages/sencha-core/src/event",
    "Ext.feature": "../packages/sencha-core/src/env/Feature.js",
    "Ext.fx.Animation": "../packages/sencha-core/src/fx/Animation.js",
    "Ext.fx.Runner": "../packages/sencha-core/src/fx/Runner.js",
    "Ext.fx.State": "../packages/sencha-core/src/fx/State.js",
    "Ext.fx.animation": "../packages/sencha-core/src/fx/animation",
    "Ext.fx.easing": "../packages/sencha-core/src/fx/easing",
    "Ext.fx.layout": "../packages/sencha-core/src/fx/layout",
    "Ext.fx.runner": "../packages/sencha-core/src/fx/runner",
    "Ext.lang": "../packages/sencha-core/src/lang",
    "Ext.mixin": "../packages/sencha-core/src/mixin",
    "Ext.os": "../packages/sencha-core/src/env/OS.js",
    "Ext.overrides": "../overrides",
    "Ext.overrides.util.Positionable": "../overrides/Positionable.js",
    "Ext.perf": "../packages/sencha-core/src/perf",
    "Ext.scroll": "../packages/sencha-core/src/scroll",
    "Ext.scroll.Indicator": "../src/scroll/Indicator.js",
    "Ext.scroll.Manager": "../src/scroll/Manager.js",
    "Ext.supports": "../packages/sencha-core/src/env/Feature.js",
    "Ext.util": "../packages/sencha-core/src/util",
    "Ext.util.Animate": "../src/util/Animate.js",
    "Ext.util.CSS": "../src/util/CSS.js",
    "Ext.util.ClickRepeater": "../src/util/ClickRepeater.js",
    "Ext.util.ComponentDragger": "../src/util/ComponentDragger.js",
    "Ext.util.Cookies": "../src/util/Cookies.js",
    "Ext.util.ElementContainer": "../src/util/ElementContainer.js",
    "Ext.util.Floating": "../src/util/Floating.js",
    "Ext.util.Focusable": "../src/util/Focusable.js",
    "Ext.util.FocusableContainer": "../src/util/FocusableContainer.js",
    "Ext.util.Format.format": "../packages/sencha-core/src/Template.js",
    "Ext.util.History": "../src/util/History.js",
    "Ext.util.KeyMap": "../src/util/KeyMap.js",
    "Ext.util.KeyNav": "../src/util/KeyNav.js",
    "Ext.util.Memento": "../src/util/Memento.js",
    "Ext.util.ProtoElement": "../src/util/ProtoElement.js",
    "Ext.util.Queue": "../src/util/Queue.js",
    "Ext.util.Renderable": "../src/util/Renderable.js",
    "Ext.util.StoreHolder": "../src/util/StoreHolder.js"
  },
  "loadOrder": [
    {
      "path": "../packages/sencha-core/src/event/ListenerStack.js",
      "requires": [],
      "uses": [],
      "idx": 0
    },
    {
      "path": "../packages/sencha-core/src/event/Controller.js",
      "requires": [],
      "uses": [],
      "idx": 1
    },
    {
      "path": "../packages/sencha-core/src/event/Dispatcher.js",
      "requires": [
        0,
        1
      ],
      "uses": [],
      "idx": 2
    },
    {
      "path": "../packages/sencha-core/src/class/Mixin.js",
      "requires": [],
      "uses": [],
      "idx": 3
    },
    {
      "path": "../packages/sencha-core/src/mixin/Identifiable.js",
      "requires": [],
      "uses": [],
      "idx": 4
    },
    {
      "path": "../packages/sencha-core/src/mixin/Observable.js",
      "requires": [
        2,
        3,
        4
      ],
      "uses": [],
      "idx": 5
    },
    {
      "path": "../packages/sencha-core/src/util/HashMap.js",
      "requires": [
        5
      ],
      "uses": [],
      "idx": 6
    },
    {
      "path": "../packages/sencha-core/src/AbstractManager.js",
      "requires": [
        6
      ],
      "uses": [],
      "idx": 7
    },
    {
      "path": "../packages/sencha-core/src/data/flash/BinaryXhr.js",
      "requires": [],
      "uses": [
        48
      ],
      "idx": 8
    },
    {
      "path": "../packages/sencha-core/src/data/Connection.js",
      "requires": [
        5,
        8
      ],
      "uses": [
        18,
        48
      ],
      "idx": 9
    },
    {
      "path": "../packages/sencha-core/src/Ajax.js",
      "requires": [
        9
      ],
      "uses": [],
      "idx": 10
    },
    {
      "path": "../packages/sencha-core/src/AnimationQueue.js",
      "requires": [],
      "uses": [],
      "idx": 11
    },
    {
      "path": "../packages/sencha-core/src/ComponentManager.js",
      "requires": [],
      "uses": [],
      "idx": 12
    },
    {
      "path": "../packages/sencha-core/src/util/Operators.js",
      "requires": [],
      "uses": [],
      "idx": 13
    },
    {
      "path": "../packages/sencha-core/src/util/LruCache.js",
      "requires": [
        6
      ],
      "uses": [],
      "idx": 14
    },
    {
      "path": "../packages/sencha-core/src/ComponentQuery.js",
      "requires": [
        12,
        13,
        14
      ],
      "uses": [
        52
      ],
      "idx": 15
    },
    {
      "path": "../packages/sencha-core/src/Evented.js",
      "requires": [
        5
      ],
      "uses": [],
      "idx": 16
    },
    {
      "path": "../packages/sencha-core/src/util/Positionable.js",
      "requires": [],
      "uses": [
        18,
        80
      ],
      "idx": 17
    },
    {
      "path": "../packages/sencha-core/src/dom/Element.js",
      "requires": [
        5,
        17
      ],
      "uses": [
        19,
        20,
        48,
        52,
        57,
        80,
        181
      ],
      "idx": 18
    },
    {
      "path": "../packages/sencha-core/src/dom/Fly.js",
      "requires": [
        18
      ],
      "uses": [],
      "idx": 19
    },
    {
      "path": "../packages/sencha-core/src/dom/CompositeElementLite.js",
      "requires": [
        19
      ],
      "uses": [
        18
      ],
      "idx": 20
    },
    {
      "path": "../packages/sencha-core/src/util/Filter.js",
      "requires": [],
      "uses": [],
      "idx": 21
    },
    {
      "path": "../packages/sencha-core/src/util/DelayedTask.js",
      "requires": [],
      "uses": [
        48
      ],
      "idx": 22
    },
    {
      "path": "../packages/sencha-core/src/util/Event.js",
      "requires": [
        22
      ],
      "uses": [],
      "idx": 23
    },
    {
      "path": "../packages/sencha-core/src/util/Observable.js",
      "requires": [
        23
      ],
      "uses": [],
      "idx": 24
    },
    {
      "path": "../packages/sencha-core/src/util/AbstractMixedCollection.js",
      "requires": [
        21,
        24
      ],
      "uses": [],
      "idx": 25
    },
    {
      "path": "../packages/sencha-core/src/util/Sorter.js",
      "requires": [],
      "uses": [],
      "idx": 26
    },
    {
      "path": "../packages/sencha-core/src/util/Sortable.js",
      "requires": [
        26
      ],
      "uses": [
        28
      ],
      "idx": 27
    },
    {
      "path": "../packages/sencha-core/src/util/MixedCollection.js",
      "requires": [
        25,
        27
      ],
      "uses": [],
      "idx": 28
    },
    {
      "path": "../packages/sencha-core/src/util/TaskRunner.js",
      "requires": [],
      "uses": [
        48
      ],
      "idx": 29
    },
    {
      "path": "../src/fx/target/Target.js",
      "requires": [],
      "uses": [],
      "idx": 30
    },
    {
      "path": "../src/fx/target/Element.js",
      "requires": [
        30
      ],
      "uses": [],
      "idx": 31
    },
    {
      "path": "../src/fx/target/ElementCSS.js",
      "requires": [
        31
      ],
      "uses": [],
      "idx": 32
    },
    {
      "path": "../src/fx/target/CompositeElement.js",
      "requires": [
        31
      ],
      "uses": [],
      "idx": 33
    },
    {
      "path": "../src/fx/target/CompositeElementCSS.js",
      "requires": [
        32,
        33
      ],
      "uses": [],
      "idx": 34
    },
    {
      "path": "../src/fx/target/Sprite.js",
      "requires": [
        30
      ],
      "uses": [],
      "idx": 35
    },
    {
      "path": "../src/fx/target/CompositeSprite.js",
      "requires": [
        35
      ],
      "uses": [],
      "idx": 36
    },
    {
      "path": "../src/fx/target/Component.js",
      "requires": [
        30
      ],
      "uses": [
        48
      ],
      "idx": 37
    },
    {
      "path": "../src/fx/Queue.js",
      "requires": [
        6
      ],
      "uses": [],
      "idx": 38
    },
    {
      "path": "../src/fx/Manager.js",
      "requires": [
        28,
        29,
        31,
        32,
        33,
        34,
        35,
        36,
        37,
        38
      ],
      "uses": [],
      "idx": 39
    },
    {
      "path": "../src/fx/Animator.js",
      "requires": [
        24,
        39
      ],
      "uses": [
        45
      ],
      "idx": 40
    },
    {
      "path": "../src/fx/CubicBezier.js",
      "requires": [],
      "uses": [],
      "idx": 41
    },
    {
      "path": "../src/fx/Easing.js",
      "requires": [
        41
      ],
      "uses": [],
      "idx": 42
    },
    {
      "path": "../src/fx/DrawPath.js",
      "requires": [],
      "uses": [],
      "idx": 43
    },
    {
      "path": "../src/fx/PropertyHandler.js",
      "requires": [
        43
      ],
      "uses": [],
      "idx": 44
    },
    {
      "path": "../src/fx/Anim.js",
      "requires": [
        24,
        39,
        40,
        41,
        42,
        44
      ],
      "uses": [],
      "idx": 45
    },
    {
      "path": "../src/util/Animate.js",
      "requires": [
        39,
        45
      ],
      "uses": [],
      "idx": 46
    },
    {
      "path": "../packages/sencha-core/src/dom/GarbageCollector.js",
      "requires": [],
      "uses": [],
      "idx": 47
    },
    {
      "path": "../packages/sencha-core/src/GlobalEvents.js",
      "requires": [
        5,
        18
      ],
      "uses": [],
      "idx": 48
    },
    {
      "path": "../packages/sencha-core/src/JSON.js",
      "requires": [],
      "uses": [],
      "idx": 49
    },
    {
      "path": "../packages/sencha-core/src/TaskQueue.js",
      "requires": [
        11
      ],
      "uses": [],
      "idx": 50
    },
    {
      "path": "../packages/sencha-core/src/util/Format.js",
      "requires": [],
      "uses": [
        52,
        181
      ],
      "idx": 51
    },
    {
      "path": "../packages/sencha-core/src/Template.js",
      "requires": [
        51
      ],
      "uses": [
        181
      ],
      "idx": 52
    },
    {
      "path": "../packages/sencha-core/src/mixin/Inheritable.js",
      "requires": [
        3
      ],
      "uses": [],
      "idx": 53
    },
    {
      "path": "../packages/sencha-core/src/mixin/Bindable.js",
      "requires": [],
      "uses": [
        89
      ],
      "idx": 54
    },
    {
      "path": "../packages/sencha-core/src/Widget.js",
      "requires": [
        16,
        53,
        54
      ],
      "uses": [
        12,
        15,
        18
      ],
      "idx": 55
    },
    {
      "path": "../src/util/ProtoElement.js",
      "requires": [],
      "uses": [
        18,
        181
      ],
      "idx": 56
    },
    {
      "path": "../packages/sencha-core/src/dom/CompositeElement.js",
      "requires": [
        20
      ],
      "uses": [],
      "idx": 57
    },
    {
      "path": "../src/util/ElementContainer.js",
      "requires": [],
      "uses": [],
      "idx": 58
    },
    {
      "path": "../src/util/Renderable.js",
      "requires": [
        18
      ],
      "uses": [
        65,
        88,
        181
      ],
      "idx": 59
    },
    {
      "path": "../src/state/Provider.js",
      "requires": [
        24
      ],
      "uses": [],
      "idx": 60
    },
    {
      "path": "../src/state/Manager.js",
      "requires": [
        60
      ],
      "uses": [],
      "idx": 61
    },
    {
      "path": "../src/state/Stateful.js",
      "requires": [
        61
      ],
      "uses": [
        29
      ],
      "idx": 62
    },
    {
      "path": "../src/util/Floating.js",
      "requires": [],
      "uses": [
        18,
        48,
        287,
        442
      ],
      "idx": 63
    },
    {
      "path": "../src/util/Focusable.js",
      "requires": [
        22
      ],
      "uses": [
        65
      ],
      "idx": 64
    },
    {
      "path": "../src/Component.js",
      "requires": [
        12,
        15,
        17,
        24,
        46,
        48,
        53,
        54,
        56,
        57,
        58,
        59,
        62,
        63,
        64
      ],
      "uses": [
        18,
        22,
        39,
        88,
        110,
        181,
        282,
        283,
        284,
        287,
        297,
        299,
        417,
        442,
        542,
        553,
        557,
        559
      ],
      "idx": 65
    },
    {
      "path": "../src/layout/container/border/Region.js",
      "requires": [],
      "uses": [],
      "idx": 66
    },
    {
      "path": "../packages/sencha-core/src/event/gesture/Recognizer.js",
      "requires": [
        4
      ],
      "uses": [],
      "idx": 67
    },
    {
      "path": "../packages/sencha-core/src/event/gesture/SingleTouch.js",
      "requires": [
        67
      ],
      "uses": [],
      "idx": 68
    },
    {
      "path": "../packages/sencha-core/src/event/gesture/DoubleTap.js",
      "requires": [
        68
      ],
      "uses": [],
      "idx": 69
    },
    {
      "path": "../packages/sencha-core/src/event/gesture/Drag.js",
      "requires": [
        68
      ],
      "uses": [],
      "idx": 70
    },
    {
      "path": "../packages/sencha-core/src/event/gesture/Swipe.js",
      "requires": [
        68
      ],
      "uses": [],
      "idx": 71
    },
    {
      "path": "../packages/sencha-core/src/event/gesture/EdgeSwipe.js",
      "requires": [
        71
      ],
      "uses": [
        18
      ],
      "idx": 72
    },
    {
      "path": "../packages/sencha-core/src/event/gesture/LongPress.js",
      "requires": [
        68
      ],
      "uses": [],
      "idx": 73
    },
    {
      "path": "../packages/sencha-core/src/event/gesture/MultiTouch.js",
      "requires": [
        67
      ],
      "uses": [],
      "idx": 74
    },
    {
      "path": "../packages/sencha-core/src/event/gesture/Pinch.js",
      "requires": [
        74
      ],
      "uses": [],
      "idx": 75
    },
    {
      "path": "../packages/sencha-core/src/event/gesture/Rotate.js",
      "requires": [
        74
      ],
      "uses": [],
      "idx": 76
    },
    {
      "path": "../packages/sencha-core/src/event/gesture/Tap.js",
      "requires": [
        68
      ],
      "uses": [],
      "idx": 77
    },
    {
      "path": "../packages/sencha-core/src/event/publisher/Publisher.js",
      "requires": [],
      "uses": [],
      "idx": 78
    },
    {
      "path": "../packages/sencha-core/src/util/Offset.js",
      "requires": [],
      "uses": [],
      "idx": 79
    },
    {
      "path": "../packages/sencha-core/src/util/Region.js",
      "requires": [
        79
      ],
      "uses": [],
      "idx": 80
    },
    {
      "path": "../packages/sencha-core/src/util/Point.js",
      "requires": [
        80
      ],
      "uses": [],
      "idx": 81
    },
    {
      "path": "../packages/sencha-core/src/event/Event.js",
      "requires": [
        81
      ],
      "uses": [],
      "idx": 82
    },
    {
      "path": "../packages/sencha-core/src/event/publisher/Dom.js",
      "requires": [
        48,
        78,
        82
      ],
      "uses": [],
      "idx": 83
    },
    {
      "path": "../packages/sencha-core/src/event/publisher/Gesture.js",
      "requires": [
        11,
        81,
        83
      ],
      "uses": [
        47,
        82
      ],
      "idx": 84
    },
    {
      "path": "../packages/sencha-core/src/event/publisher/Focus.js",
      "requires": [
        83
      ],
      "uses": [
        82
      ],
      "idx": 85
    },
    {
      "path": "../packages/sencha-core/src/util/XTemplateParser.js",
      "requires": [],
      "uses": [],
      "idx": 86
    },
    {
      "path": "../packages/sencha-core/src/util/XTemplateCompiler.js",
      "requires": [
        86
      ],
      "uses": [],
      "idx": 87
    },
    {
      "path": "../packages/sencha-core/src/XTemplate.js",
      "requires": [
        52,
        87
      ],
      "uses": [],
      "idx": 88
    },
    {
      "path": "../packages/sencha-core/src/mixin/Factoryable.js",
      "requires": [],
      "uses": [],
      "idx": 89
    },
    {
      "path": "../packages/sencha-core/src/util/CollectionKey.js",
      "requires": [
        4
      ],
      "uses": [],
      "idx": 90
    },
    {
      "path": "../packages/sencha-core/src/util/Grouper.js",
      "requires": [
        26
      ],
      "uses": [],
      "idx": 91
    },
    {
      "path": "../packages/sencha-core/src/util/Collection.js",
      "requires": [
        5,
        21,
        26,
        90,
        91
      ],
      "uses": [
        156,
        157,
        158
      ],
      "idx": 92
    },
    {
      "path": "../packages/sencha-core/src/util/Scheduler.js",
      "requires": [
        5,
        92
      ],
      "uses": [],
      "idx": 93
    },
    {
      "path": "../packages/sencha-core/src/util/ObjectTemplate.js",
      "requires": [
        88
      ],
      "uses": [],
      "idx": 94
    },
    {
      "path": "../packages/sencha-core/src/data/schema/Role.js",
      "requires": [],
      "uses": [
        89
      ],
      "idx": 95
    },
    {
      "path": "../packages/sencha-core/src/data/schema/Association.js",
      "requires": [
        95
      ],
      "uses": [],
      "idx": 96
    },
    {
      "path": "../packages/sencha-core/src/data/schema/OneToOne.js",
      "requires": [
        96
      ],
      "uses": [],
      "idx": 97
    },
    {
      "path": "../packages/sencha-core/src/data/schema/ManyToOne.js",
      "requires": [
        96
      ],
      "uses": [],
      "idx": 98
    },
    {
      "path": "../packages/sencha-core/src/data/schema/ManyToMany.js",
      "requires": [
        96
      ],
      "uses": [],
      "idx": 99
    },
    {
      "path": "../packages/sencha-core/src/util/Inflector.js",
      "requires": [],
      "uses": [],
      "idx": 100
    },
    {
      "path": "../packages/sencha-core/src/data/schema/Namer.js",
      "requires": [
        89,
        100
      ],
      "uses": [],
      "idx": 101
    },
    {
      "path": "../packages/sencha-core/src/data/schema/Schema.js",
      "requires": [
        89,
        94,
        97,
        98,
        99,
        101
      ],
      "uses": [],
      "idx": 102
    },
    {
      "path": "../packages/sencha-core/src/data/Batch.js",
      "requires": [
        5
      ],
      "uses": [],
      "idx": 103
    },
    {
      "path": "../packages/sencha-core/src/data/matrix/Slice.js",
      "requires": [],
      "uses": [],
      "idx": 104
    },
    {
      "path": "../packages/sencha-core/src/data/matrix/Side.js",
      "requires": [
        104
      ],
      "uses": [],
      "idx": 105
    },
    {
      "path": "../packages/sencha-core/src/data/matrix/Matrix.js",
      "requires": [
        105
      ],
      "uses": [],
      "idx": 106
    },
    {
      "path": "../packages/sencha-core/src/data/session/ChangesVisitor.js",
      "requires": [],
      "uses": [],
      "idx": 107
    },
    {
      "path": "../packages/sencha-core/src/data/session/ChildChangesVisitor.js",
      "requires": [
        107
      ],
      "uses": [],
      "idx": 108
    },
    {
      "path": "../packages/sencha-core/src/data/session/BatchVisitor.js",
      "requires": [],
      "uses": [
        103
      ],
      "idx": 109
    },
    {
      "path": "../packages/sencha-core/src/data/Session.js",
      "requires": [
        102,
        103,
        106,
        107,
        108,
        109
      ],
      "uses": [],
      "idx": 110
    },
    {
      "path": "../packages/sencha-core/src/util/Schedulable.js",
      "requires": [],
      "uses": [],
      "idx": 111
    },
    {
      "path": "../packages/sencha-core/src/app/bind/BaseBinding.js",
      "requires": [
        111
      ],
      "uses": [],
      "idx": 112
    },
    {
      "path": "../packages/sencha-core/src/app/bind/Binding.js",
      "requires": [
        112
      ],
      "uses": [],
      "idx": 113
    },
    {
      "path": "../packages/sencha-core/src/app/bind/AbstractStub.js",
      "requires": [
        111,
        113
      ],
      "uses": [],
      "idx": 114
    },
    {
      "path": "../packages/sencha-core/src/app/bind/Stub.js",
      "requires": [
        113,
        114
      ],
      "uses": [
        119
      ],
      "idx": 115
    },
    {
      "path": "../packages/sencha-core/src/app/bind/LinkStub.js",
      "requires": [
        115
      ],
      "uses": [],
      "idx": 116
    },
    {
      "path": "../packages/sencha-core/src/app/bind/RootStub.js",
      "requires": [
        114,
        115,
        116
      ],
      "uses": [],
      "idx": 117
    },
    {
      "path": "../packages/sencha-core/src/app/bind/Multi.js",
      "requires": [
        112
      ],
      "uses": [],
      "idx": 118
    },
    {
      "path": "../packages/sencha-core/src/app/bind/Formula.js",
      "requires": [
        14,
        111
      ],
      "uses": [],
      "idx": 119
    },
    {
      "path": "../packages/sencha-core/src/app/bind/Template.js",
      "requires": [
        51
      ],
      "uses": [],
      "idx": 120
    },
    {
      "path": "../packages/sencha-core/src/app/bind/TemplateBinding.js",
      "requires": [
        112,
        118,
        120
      ],
      "uses": [],
      "idx": 121
    },
    {
      "path": "../packages/sencha-core/src/data/AbstractStore.js",
      "requires": [
        5,
        21,
        89,
        92,
        102
      ],
      "uses": [
        175
      ],
      "idx": 122
    },
    {
      "path": "../packages/sencha-core/src/data/LocalStore.js",
      "requires": [
        3
      ],
      "uses": [
        92
      ],
      "idx": 123
    },
    {
      "path": "../packages/sencha-core/src/data/ChainedStore.js",
      "requires": [
        122,
        123
      ],
      "uses": [
        175
      ],
      "idx": 124
    },
    {
      "path": "../packages/sencha-core/src/app/ViewModel.js",
      "requires": [
        4,
        89,
        93,
        110,
        116,
        117,
        118,
        119,
        121,
        124
      ],
      "uses": [
        22,
        102
      ],
      "idx": 125
    },
    {
      "path": "../packages/sencha-core/src/data/Error.js",
      "requires": [],
      "uses": [],
      "idx": 126
    },
    {
      "path": "../packages/sencha-core/src/data/ErrorCollection.js",
      "requires": [
        28,
        126
      ],
      "uses": [
        135
      ],
      "idx": 127
    },
    {
      "path": "../packages/sencha-core/src/data/operation/Operation.js",
      "requires": [],
      "uses": [],
      "idx": 128
    },
    {
      "path": "../packages/sencha-core/src/data/operation/Create.js",
      "requires": [
        128
      ],
      "uses": [],
      "idx": 129
    },
    {
      "path": "../packages/sencha-core/src/data/operation/Destroy.js",
      "requires": [
        128
      ],
      "uses": [],
      "idx": 130
    },
    {
      "path": "../packages/sencha-core/src/data/operation/Read.js",
      "requires": [
        128
      ],
      "uses": [],
      "idx": 131
    },
    {
      "path": "../packages/sencha-core/src/data/operation/Update.js",
      "requires": [
        128
      ],
      "uses": [],
      "idx": 132
    },
    {
      "path": "../packages/sencha-core/src/data/SortTypes.js",
      "requires": [],
      "uses": [],
      "idx": 133
    },
    {
      "path": "../packages/sencha-core/src/data/validator/Validator.js",
      "requires": [
        89
      ],
      "uses": [],
      "idx": 134
    },
    {
      "path": "../packages/sencha-core/src/data/field/Field.js",
      "requires": [
        89,
        133,
        134
      ],
      "uses": [],
      "idx": 135
    },
    {
      "path": "../packages/sencha-core/src/data/field/Boolean.js",
      "requires": [
        135
      ],
      "uses": [],
      "idx": 136
    },
    {
      "path": "../packages/sencha-core/src/data/field/Date.js",
      "requires": [
        135
      ],
      "uses": [],
      "idx": 137
    },
    {
      "path": "../packages/sencha-core/src/data/field/Integer.js",
      "requires": [
        135
      ],
      "uses": [],
      "idx": 138
    },
    {
      "path": "../packages/sencha-core/src/data/field/Number.js",
      "requires": [
        135
      ],
      "uses": [],
      "idx": 139
    },
    {
      "path": "../packages/sencha-core/src/data/field/String.js",
      "requires": [
        135
      ],
      "uses": [],
      "idx": 140
    },
    {
      "path": "../packages/sencha-core/src/data/identifier/Generator.js",
      "requires": [
        89
      ],
      "uses": [],
      "idx": 141
    },
    {
      "path": "../packages/sencha-core/src/data/identifier/Sequential.js",
      "requires": [
        141
      ],
      "uses": [],
      "idx": 142
    },
    {
      "path": "../packages/sencha-core/src/data/Model.js",
      "requires": [
        102,
        127,
        128,
        129,
        130,
        131,
        132,
        134,
        135,
        136,
        137,
        138,
        139,
        140,
        141,
        142
      ],
      "uses": [
        89,
        145,
        180
      ],
      "idx": 143
    },
    {
      "path": "../packages/sencha-core/src/data/ResultSet.js",
      "requires": [],
      "uses": [],
      "idx": 144
    },
    {
      "path": "../packages/sencha-core/src/data/reader/Reader.js",
      "requires": [
        5,
        88,
        89,
        144
      ],
      "uses": [
        102
      ],
      "idx": 145
    },
    {
      "path": "../packages/sencha-core/src/data/writer/Writer.js",
      "requires": [
        89
      ],
      "uses": [],
      "idx": 146
    },
    {
      "path": "../packages/sencha-core/src/data/proxy/Proxy.js",
      "requires": [
        5,
        89,
        102,
        145,
        146
      ],
      "uses": [
        103,
        128,
        129,
        130,
        131,
        132,
        143
      ],
      "idx": 147
    },
    {
      "path": "../packages/sencha-core/src/data/proxy/Client.js",
      "requires": [
        147
      ],
      "uses": [],
      "idx": 148
    },
    {
      "path": "../packages/sencha-core/src/data/proxy/Memory.js",
      "requires": [
        148
      ],
      "uses": [
        21,
        27
      ],
      "idx": 149
    },
    {
      "path": "../packages/sencha-core/src/data/ProxyStore.js",
      "requires": [
        122,
        128,
        129,
        130,
        131,
        132,
        143,
        147,
        149
      ],
      "uses": [
        22,
        102
      ],
      "idx": 150
    },
    {
      "path": "../packages/sencha-core/src/data/proxy/Server.js",
      "requires": [
        147
      ],
      "uses": [
        52,
        174
      ],
      "idx": 151
    },
    {
      "path": "../packages/sencha-core/src/data/proxy/Ajax.js",
      "requires": [
        10,
        151
      ],
      "uses": [],
      "idx": 152
    },
    {
      "path": "../packages/sencha-core/src/data/reader/Json.js",
      "requires": [
        49,
        145
      ],
      "uses": [],
      "idx": 153
    },
    {
      "path": "../packages/sencha-core/src/data/writer/Json.js",
      "requires": [
        146
      ],
      "uses": [],
      "idx": 154
    },
    {
      "path": "../packages/sencha-core/src/util/Group.js",
      "requires": [
        92
      ],
      "uses": [],
      "idx": 155
    },
    {
      "path": "../packages/sencha-core/src/util/SorterCollection.js",
      "requires": [
        26,
        92
      ],
      "uses": [],
      "idx": 156
    },
    {
      "path": "../packages/sencha-core/src/util/FilterCollection.js",
      "requires": [
        21,
        92
      ],
      "uses": [],
      "idx": 157
    },
    {
      "path": "../packages/sencha-core/src/util/GroupCollection.js",
      "requires": [
        92,
        155,
        156,
        157
      ],
      "uses": [],
      "idx": 158
    },
    {
      "path": "../packages/sencha-core/src/data/Store.js",
      "requires": [
        22,
        123,
        143,
        150,
        152,
        153,
        154,
        158
      ],
      "uses": [
        91,
        163,
        175
      ],
      "idx": 159
    },
    {
      "path": "../packages/sencha-core/src/data/reader/Array.js",
      "requires": [
        153
      ],
      "uses": [],
      "idx": 160
    },
    {
      "path": "../packages/sencha-core/src/data/ArrayStore.js",
      "requires": [
        149,
        159,
        160
      ],
      "uses": [],
      "idx": 161
    },
    {
      "path": "../packages/sencha-core/src/data/PageMap.js",
      "requires": [
        14
      ],
      "uses": [],
      "idx": 162
    },
    {
      "path": "../packages/sencha-core/src/data/BufferedStore.js",
      "requires": [
        21,
        26,
        91,
        150,
        162
      ],
      "uses": [
        156,
        157,
        158
      ],
      "idx": 163
    },
    {
      "path": "../packages/sencha-core/src/direct/Manager.js",
      "requires": [
        24,
        28
      ],
      "uses": [],
      "idx": 164
    },
    {
      "path": "../packages/sencha-core/src/data/proxy/Direct.js",
      "requires": [
        151,
        164
      ],
      "uses": [],
      "idx": 165
    },
    {
      "path": "../packages/sencha-core/src/data/DirectStore.js",
      "requires": [
        159,
        165
      ],
      "uses": [],
      "idx": 166
    },
    {
      "path": "../packages/sencha-core/src/data/JsonP.js",
      "requires": [],
      "uses": [
        48
      ],
      "idx": 167
    },
    {
      "path": "../packages/sencha-core/src/data/proxy/JsonP.js",
      "requires": [
        151,
        167
      ],
      "uses": [],
      "idx": 168
    },
    {
      "path": "../packages/sencha-core/src/data/JsonPStore.js",
      "requires": [
        153,
        159,
        168
      ],
      "uses": [],
      "idx": 169
    },
    {
      "path": "../packages/sencha-core/src/data/JsonStore.js",
      "requires": [
        152,
        153,
        154,
        159
      ],
      "uses": [],
      "idx": 170
    },
    {
      "path": "../packages/sencha-core/src/data/ModelManager.js",
      "requires": [
        102
      ],
      "uses": [
        143
      ],
      "idx": 171
    },
    {
      "path": "../packages/sencha-core/src/data/NodeInterface.js",
      "requires": [
        5,
        136,
        138,
        140,
        154
      ],
      "uses": [
        102
      ],
      "idx": 172
    },
    {
      "path": "../packages/sencha-core/src/data/NodeStore.js",
      "requires": [
        159,
        172
      ],
      "uses": [
        143
      ],
      "idx": 173
    },
    {
      "path": "../packages/sencha-core/src/data/Request.js",
      "requires": [],
      "uses": [],
      "idx": 174
    },
    {
      "path": "../packages/sencha-core/src/data/StoreManager.js",
      "requires": [
        28,
        161
      ],
      "uses": [
        89,
        149,
        154,
        159,
        160
      ],
      "idx": 175
    },
    {
      "path": "../packages/sencha-core/src/mixin/Queryable.js",
      "requires": [],
      "uses": [
        15
      ],
      "idx": 176
    },
    {
      "path": "../packages/sencha-core/src/data/TreeModel.js",
      "requires": [
        143,
        172,
        176
      ],
      "uses": [],
      "idx": 177
    },
    {
      "path": "../packages/sencha-core/src/data/TreeStore.js",
      "requires": [
        26,
        172,
        173,
        177
      ],
      "uses": [],
      "idx": 178
    },
    {
      "path": "../packages/sencha-core/src/data/Types.js",
      "requires": [
        133
      ],
      "uses": [],
      "idx": 179
    },
    {
      "path": "../packages/sencha-core/src/data/Validation.js",
      "requires": [
        143
      ],
      "uses": [],
      "idx": 180
    },
    {
      "path": "../packages/sencha-core/src/dom/Helper.js",
      "requires": [],
      "uses": [
        52
      ],
      "idx": 181
    },
    {
      "path": "../packages/sencha-core/src/dom/Query.js",
      "requires": [
        13,
        181
      ],
      "uses": [
        14
      ],
      "idx": 182
    },
    {
      "path": "../packages/sencha-core/src/data/reader/Xml.js",
      "requires": [
        145,
        182
      ],
      "uses": [],
      "idx": 183
    },
    {
      "path": "../packages/sencha-core/src/data/writer/Xml.js",
      "requires": [
        146
      ],
      "uses": [],
      "idx": 184
    },
    {
      "path": "../packages/sencha-core/src/data/XmlStore.js",
      "requires": [
        152,
        159,
        183,
        184
      ],
      "uses": [],
      "idx": 185
    },
    {
      "path": "../packages/sencha-core/src/data/identifier/Negative.js",
      "requires": [
        142
      ],
      "uses": [],
      "idx": 186
    },
    {
      "path": "../packages/sencha-core/src/data/identifier/Uuid.js",
      "requires": [
        141
      ],
      "uses": [],
      "idx": 187
    },
    {
      "path": "../packages/sencha-core/src/data/proxy/WebStorage.js",
      "requires": [
        142,
        148
      ],
      "uses": [
        26,
        52,
        144
      ],
      "idx": 188
    },
    {
      "path": "../packages/sencha-core/src/data/proxy/LocalStorage.js",
      "requires": [
        188
      ],
      "uses": [],
      "idx": 189
    },
    {
      "path": "../packages/sencha-core/src/data/proxy/Rest.js",
      "requires": [
        152
      ],
      "uses": [],
      "idx": 190
    },
    {
      "path": "../packages/sencha-core/src/data/proxy/SessionStorage.js",
      "requires": [
        188
      ],
      "uses": [],
      "idx": 191
    },
    {
      "path": "../packages/sencha-core/src/data/proxy/Sql.js",
      "requires": [
        148
      ],
      "uses": [
        92,
        144
      ],
      "idx": 192
    },
    {
      "path": "../packages/sencha-core/src/data/validator/Bound.js",
      "requires": [
        134
      ],
      "uses": [
        52
      ],
      "idx": 193
    },
    {
      "path": "../packages/sencha-core/src/data/validator/Format.js",
      "requires": [
        134
      ],
      "uses": [],
      "idx": 194
    },
    {
      "path": "../packages/sencha-core/src/data/validator/Email.js",
      "requires": [
        194
      ],
      "uses": [],
      "idx": 195
    },
    {
      "path": "../packages/sencha-core/src/data/validator/List.js",
      "requires": [
        134
      ],
      "uses": [],
      "idx": 196
    },
    {
      "path": "../packages/sencha-core/src/data/validator/Exclusion.js",
      "requires": [
        196
      ],
      "uses": [],
      "idx": 197
    },
    {
      "path": "../packages/sencha-core/src/data/validator/Inclusion.js",
      "requires": [
        196
      ],
      "uses": [],
      "idx": 198
    },
    {
      "path": "../packages/sencha-core/src/data/validator/Length.js",
      "requires": [
        193
      ],
      "uses": [],
      "idx": 199
    },
    {
      "path": "../packages/sencha-core/src/data/validator/Presence.js",
      "requires": [
        134
      ],
      "uses": [],
      "idx": 200
    },
    {
      "path": "../packages/sencha-core/src/data/validator/Range.js",
      "requires": [
        193
      ],
      "uses": [],
      "idx": 201
    },
    {
      "path": "../packages/sencha-core/src/direct/Event.js",
      "requires": [],
      "uses": [],
      "idx": 202
    },
    {
      "path": "../packages/sencha-core/src/direct/RemotingEvent.js",
      "requires": [
        202
      ],
      "uses": [
        164
      ],
      "idx": 203
    },
    {
      "path": "../packages/sencha-core/src/direct/ExceptionEvent.js",
      "requires": [
        203
      ],
      "uses": [],
      "idx": 204
    },
    {
      "path": "../packages/sencha-core/src/direct/Provider.js",
      "requires": [
        24
      ],
      "uses": [],
      "idx": 205
    },
    {
      "path": "../packages/sencha-core/src/direct/JsonProvider.js",
      "requires": [
        205
      ],
      "uses": [
        164,
        204
      ],
      "idx": 206
    },
    {
      "path": "../packages/sencha-core/src/direct/PollingProvider.js",
      "requires": [
        10,
        22,
        206
      ],
      "uses": [
        164,
        204,
        278
      ],
      "idx": 207
    },
    {
      "path": "../packages/sencha-core/src/direct/RemotingMethod.js",
      "requires": [],
      "uses": [],
      "idx": 208
    },
    {
      "path": "../packages/sencha-core/src/direct/Transaction.js",
      "requires": [],
      "uses": [],
      "idx": 209
    },
    {
      "path": "../packages/sencha-core/src/direct/RemotingProvider.js",
      "requires": [
        22,
        28,
        206,
        208,
        209
      ],
      "uses": [
        10,
        164,
        204
      ],
      "idx": 210
    },
    {
      "path": "../packages/sencha-core/src/util/paintmonitor/Abstract.js",
      "requires": [],
      "uses": [
        18
      ],
      "idx": 211
    },
    {
      "path": "../packages/sencha-core/src/util/paintmonitor/CssAnimation.js",
      "requires": [
        211
      ],
      "uses": [],
      "idx": 212
    },
    {
      "path": "../packages/sencha-core/src/util/paintmonitor/OverflowChange.js",
      "requires": [
        211
      ],
      "uses": [],
      "idx": 213
    },
    {
      "path": "../packages/sencha-core/src/util/PaintMonitor.js",
      "requires": [
        212,
        213
      ],
      "uses": [],
      "idx": 214
    },
    {
      "path": "../packages/sencha-core/src/event/publisher/ElementPaint.js",
      "requires": [
        50,
        78,
        214
      ],
      "uses": [],
      "idx": 215
    },
    {
      "path": "../packages/sencha-core/src/mixin/Templatable.js",
      "requires": [
        3
      ],
      "uses": [
        18
      ],
      "idx": 216
    },
    {
      "path": "../packages/sencha-core/src/util/sizemonitor/Abstract.js",
      "requires": [
        50,
        216
      ],
      "uses": [],
      "idx": 217
    },
    {
      "path": "../packages/sencha-core/src/util/sizemonitor/Default.js",
      "requires": [
        217
      ],
      "uses": [],
      "idx": 218
    },
    {
      "path": "../packages/sencha-core/src/util/sizemonitor/Scroll.js",
      "requires": [
        217
      ],
      "uses": [
        50
      ],
      "idx": 219
    },
    {
      "path": "../packages/sencha-core/src/util/sizemonitor/OverflowChange.js",
      "requires": [
        217
      ],
      "uses": [
        50
      ],
      "idx": 220
    },
    {
      "path": "../packages/sencha-core/src/util/SizeMonitor.js",
      "requires": [
        218,
        219,
        220
      ],
      "uses": [],
      "idx": 221
    },
    {
      "path": "../packages/sencha-core/src/event/publisher/ElementSize.js",
      "requires": [
        78,
        221
      ],
      "uses": [
        50
      ],
      "idx": 222
    },
    {
      "path": "../packages/sencha-core/src/fx/State.js",
      "requires": [],
      "uses": [],
      "idx": 223
    },
    {
      "path": "../packages/sencha-core/src/fx/animation/Abstract.js",
      "requires": [
        16,
        223
      ],
      "uses": [],
      "idx": 224
    },
    {
      "path": "../packages/sencha-core/src/fx/animation/Slide.js",
      "requires": [
        224
      ],
      "uses": [],
      "idx": 225
    },
    {
      "path": "../packages/sencha-core/src/fx/animation/SlideOut.js",
      "requires": [
        225
      ],
      "uses": [],
      "idx": 226
    },
    {
      "path": "../packages/sencha-core/src/fx/animation/Fade.js",
      "requires": [
        224
      ],
      "uses": [],
      "idx": 227
    },
    {
      "path": "../packages/sencha-core/src/fx/animation/FadeOut.js",
      "requires": [
        227
      ],
      "uses": [],
      "idx": 228
    },
    {
      "path": "../packages/sencha-core/src/fx/animation/Flip.js",
      "requires": [
        224
      ],
      "uses": [],
      "idx": 229
    },
    {
      "path": "../packages/sencha-core/src/fx/animation/Pop.js",
      "requires": [
        224
      ],
      "uses": [],
      "idx": 230
    },
    {
      "path": "../packages/sencha-core/src/fx/animation/PopOut.js",
      "requires": [
        230
      ],
      "uses": [],
      "idx": 231
    },
    {
      "path": "../packages/sencha-core/src/fx/Animation.js",
      "requires": [
        225,
        226,
        227,
        228,
        229,
        230,
        231
      ],
      "uses": [
        224
      ],
      "idx": 232
    },
    {
      "path": "../packages/sencha-core/src/fx/runner/Css.js",
      "requires": [
        16,
        232
      ],
      "uses": [],
      "idx": 233
    },
    {
      "path": "../packages/sencha-core/src/fx/runner/CssTransition.js",
      "requires": [
        11,
        233
      ],
      "uses": [
        232
      ],
      "idx": 234
    },
    {
      "path": "../packages/sencha-core/src/fx/Runner.js",
      "requires": [
        234
      ],
      "uses": [],
      "idx": 235
    },
    {
      "path": "../packages/sencha-core/src/fx/animation/Cube.js",
      "requires": [
        224
      ],
      "uses": [],
      "idx": 236
    },
    {
      "path": "../packages/sencha-core/src/fx/animation/Wipe.js",
      "requires": [
        232
      ],
      "uses": [],
      "idx": 237
    },
    {
      "path": "../packages/sencha-core/src/fx/animation/WipeOut.js",
      "requires": [
        237
      ],
      "uses": [],
      "idx": 238
    },
    {
      "path": "../packages/sencha-core/src/fx/easing/Abstract.js",
      "requires": [],
      "uses": [],
      "idx": 239
    },
    {
      "path": "../packages/sencha-core/src/fx/easing/Bounce.js",
      "requires": [
        239
      ],
      "uses": [],
      "idx": 240
    },
    {
      "path": "../packages/sencha-core/src/fx/easing/Momentum.js",
      "requires": [
        239
      ],
      "uses": [],
      "idx": 241
    },
    {
      "path": "../packages/sencha-core/src/fx/easing/BoundMomentum.js",
      "requires": [
        239,
        240,
        241
      ],
      "uses": [],
      "idx": 242
    },
    {
      "path": "../packages/sencha-core/src/fx/easing/Linear.js",
      "requires": [
        239
      ],
      "uses": [],
      "idx": 243
    },
    {
      "path": "../packages/sencha-core/src/fx/easing/EaseIn.js",
      "requires": [
        243
      ],
      "uses": [],
      "idx": 244
    },
    {
      "path": "../packages/sencha-core/src/fx/easing/EaseOut.js",
      "requires": [
        243
      ],
      "uses": [],
      "idx": 245
    },
    {
      "path": "../packages/sencha-core/src/fx/easing/Easing.js",
      "requires": [
        243
      ],
      "uses": [],
      "idx": 246
    },
    {
      "path": "../packages/sencha-core/src/fx/layout/card/Abstract.js",
      "requires": [
        16
      ],
      "uses": [],
      "idx": 247
    },
    {
      "path": "../packages/sencha-core/src/fx/layout/card/Style.js",
      "requires": [
        232,
        247
      ],
      "uses": [],
      "idx": 248
    },
    {
      "path": "../packages/sencha-core/src/fx/layout/card/Slide.js",
      "requires": [
        248
      ],
      "uses": [],
      "idx": 249
    },
    {
      "path": "../packages/sencha-core/src/fx/layout/card/Cover.js",
      "requires": [
        248
      ],
      "uses": [],
      "idx": 250
    },
    {
      "path": "../packages/sencha-core/src/fx/layout/card/Reveal.js",
      "requires": [
        248
      ],
      "uses": [],
      "idx": 251
    },
    {
      "path": "../packages/sencha-core/src/fx/layout/card/Fade.js",
      "requires": [
        248
      ],
      "uses": [],
      "idx": 252
    },
    {
      "path": "../packages/sencha-core/src/fx/layout/card/Flip.js",
      "requires": [
        248
      ],
      "uses": [],
      "idx": 253
    },
    {
      "path": "../packages/sencha-core/src/fx/layout/card/Pop.js",
      "requires": [
        248
      ],
      "uses": [],
      "idx": 254
    },
    {
      "path": "../packages/sencha-core/src/fx/layout/card/Scroll.js",
      "requires": [
        243,
        247
      ],
      "uses": [
        11
      ],
      "idx": 255
    },
    {
      "path": "../packages/sencha-core/src/fx/layout/Card.js",
      "requires": [
        249,
        250,
        251,
        252,
        253,
        254,
        255
      ],
      "uses": [
        247
      ],
      "idx": 256
    },
    {
      "path": "../packages/sencha-core/src/fx/layout/card/Cube.js",
      "requires": [
        248
      ],
      "uses": [],
      "idx": 257
    },
    {
      "path": "../packages/sencha-core/src/fx/layout/card/ScrollCover.js",
      "requires": [
        255
      ],
      "uses": [],
      "idx": 258
    },
    {
      "path": "../packages/sencha-core/src/fx/layout/card/ScrollReveal.js",
      "requires": [
        255
      ],
      "uses": [],
      "idx": 259
    },
    {
      "path": "../packages/sencha-core/src/fx/runner/CssAnimation.js",
      "requires": [
        233
      ],
      "uses": [
        232
      ],
      "idx": 260
    },
    {
      "path": "../packages/sencha-core/src/mixin/Hookable.js",
      "requires": [
        3
      ],
      "uses": [],
      "idx": 261
    },
    {
      "path": "../packages/sencha-core/src/mixin/Mashup.js",
      "requires": [
        3
      ],
      "uses": [],
      "idx": 262
    },
    {
      "path": "../packages/sencha-core/src/mixin/Responsive.js",
      "requires": [
        3,
        48
      ],
      "uses": [
        18
      ],
      "idx": 263
    },
    {
      "path": "../packages/sencha-core/src/mixin/Selectable.js",
      "requires": [
        3
      ],
      "uses": [
        28
      ],
      "idx": 264
    },
    {
      "path": "../packages/sencha-core/src/mixin/Traversable.js",
      "requires": [
        3
      ],
      "uses": [],
      "idx": 265
    },
    {
      "path": "../packages/sencha-core/src/perf/Accumulator.js",
      "requires": [
        88
      ],
      "uses": [],
      "idx": 266
    },
    {
      "path": "../packages/sencha-core/src/perf/Monitor.js",
      "requires": [
        266
      ],
      "uses": [],
      "idx": 267
    },
    {
      "path": "../packages/sencha-core/src/util/translatable/Abstract.js",
      "requires": [
        16,
        243
      ],
      "uses": [
        11
      ],
      "idx": 268
    },
    {
      "path": "../packages/sencha-core/src/util/translatable/Dom.js",
      "requires": [
        268
      ],
      "uses": [],
      "idx": 269
    },
    {
      "path": "../packages/sencha-core/src/util/translatable/CssTransform.js",
      "requires": [
        269
      ],
      "uses": [],
      "idx": 270
    },
    {
      "path": "../packages/sencha-core/src/util/translatable/ScrollPosition.js",
      "requires": [
        269
      ],
      "uses": [],
      "idx": 271
    },
    {
      "path": "../packages/sencha-core/src/util/translatable/ScrollParent.js",
      "requires": [
        269
      ],
      "uses": [],
      "idx": 272
    },
    {
      "path": "../packages/sencha-core/src/util/translatable/CssPosition.js",
      "requires": [
        269
      ],
      "uses": [],
      "idx": 273
    },
    {
      "path": "../packages/sencha-core/src/util/Translatable.js",
      "requires": [
        270,
        271,
        272,
        273
      ],
      "uses": [],
      "idx": 274
    },
    {
      "path": "../packages/sencha-core/src/scroll/Scroller.js",
      "requires": [
        16,
        242,
        245,
        274
      ],
      "uses": [],
      "idx": 275
    },
    {
      "path": "../packages/sencha-core/src/util/Base64.js",
      "requires": [],
      "uses": [],
      "idx": 276
    },
    {
      "path": "../packages/sencha-core/src/util/LocalStorage.js",
      "requires": [],
      "uses": [],
      "idx": 277
    },
    {
      "path": "../packages/sencha-core/src/util/TaskManager.js",
      "requires": [
        29
      ],
      "uses": [],
      "idx": 278
    },
    {
      "path": "../packages/sencha-core/src/util/TextMetrics.js",
      "requires": [
        18
      ],
      "uses": [],
      "idx": 279
    },
    {
      "path": "../src/Action.js",
      "requires": [],
      "uses": [],
      "idx": 280
    },
    {
      "path": "../src/ElementLoader.js",
      "requires": [
        24
      ],
      "uses": [
        9,
        10
      ],
      "idx": 281
    },
    {
      "path": "../src/ComponentLoader.js",
      "requires": [
        281
      ],
      "uses": [],
      "idx": 282
    },
    {
      "path": "../src/layout/SizeModel.js",
      "requires": [],
      "uses": [],
      "idx": 283
    },
    {
      "path": "../src/layout/Layout.js",
      "requires": [
        88,
        89,
        283
      ],
      "uses": [
        542
      ],
      "idx": 284
    },
    {
      "path": "../src/layout/container/Container.js",
      "requires": [
        58,
        88,
        284
      ],
      "uses": [
        181
      ],
      "idx": 285
    },
    {
      "path": "../src/layout/container/Auto.js",
      "requires": [
        285
      ],
      "uses": [
        88
      ],
      "idx": 286
    },
    {
      "path": "../src/ZIndexManager.js",
      "requires": [
        156,
        157
      ],
      "uses": [
        18,
        48,
        92
      ],
      "idx": 287
    },
    {
      "path": "../src/container/Container.js",
      "requires": [
        28,
        65,
        176,
        286,
        287
      ],
      "uses": [
        12,
        15,
        25,
        89
      ],
      "idx": 288
    },
    {
      "path": "../src/layout/container/Editor.js",
      "requires": [
        285
      ],
      "uses": [],
      "idx": 289
    },
    {
      "path": "../src/Editor.js",
      "requires": [
        288,
        289
      ],
      "uses": [
        12,
        18
      ],
      "idx": 290
    },
    {
      "path": "../src/EventManager.js",
      "requires": [],
      "uses": [
        48
      ],
      "idx": 291
    },
    {
      "path": "../src/util/KeyMap.js",
      "requires": [],
      "uses": [],
      "idx": 292
    },
    {
      "path": "../src/util/KeyNav.js",
      "requires": [
        292
      ],
      "uses": [],
      "idx": 293
    },
    {
      "path": "../src/FocusManager.js",
      "requires": [
        6,
        12,
        15,
        24,
        65,
        293
      ],
      "uses": [
        18,
        22
      ],
      "idx": 294
    },
    {
      "path": "../src/Img.js",
      "requires": [
        65
      ],
      "uses": [],
      "idx": 295
    },
    {
      "path": "../src/util/StoreHolder.js",
      "requires": [],
      "uses": [
        175
      ],
      "idx": 296
    },
    {
      "path": "../src/LoadMask.js",
      "requires": [
        65,
        296
      ],
      "uses": [
        48,
        175
      ],
      "idx": 297
    },
    {
      "path": "../src/layout/component/Component.js",
      "requires": [
        284
      ],
      "uses": [],
      "idx": 298
    },
    {
      "path": "../src/layout/component/Auto.js",
      "requires": [
        298
      ],
      "uses": [],
      "idx": 299
    },
    {
      "path": "../src/layout/component/ProgressBar.js",
      "requires": [
        299
      ],
      "uses": [],
      "idx": 300
    },
    {
      "path": "../src/ProgressBar.js",
      "requires": [
        52,
        57,
        65,
        278,
        300
      ],
      "uses": [
        45,
        88
      ],
      "idx": 301
    },
    {
      "path": "../src/ProgressBarWidget.js",
      "requires": [
        55,
        301
      ],
      "uses": [
        88
      ],
      "idx": 302
    },
    {
      "path": "../src/ShadowPool.js",
      "requires": [
        181
      ],
      "uses": [
        52
      ],
      "idx": 303
    },
    {
      "path": "../src/Shadow.js",
      "requires": [
        303
      ],
      "uses": [],
      "idx": 304
    },
    {
      "path": "../src/app/EventDomain.js",
      "requires": [
        23
      ],
      "uses": [],
      "idx": 305
    },
    {
      "path": "../src/app/domain/Component.js",
      "requires": [
        55,
        65,
        305
      ],
      "uses": [],
      "idx": 306
    },
    {
      "path": "../src/app/EventBus.js",
      "requires": [
        306
      ],
      "uses": [
        305
      ],
      "idx": 307
    },
    {
      "path": "../src/app/domain/Global.js",
      "requires": [
        305
      ],
      "uses": [],
      "idx": 308
    },
    {
      "path": "../src/app/BaseController.js",
      "requires": [
        24,
        307,
        308
      ],
      "uses": [
        314,
        315,
        420
      ],
      "idx": 309
    },
    {
      "path": "../src/app/Util.js",
      "requires": [],
      "uses": [],
      "idx": 310
    },
    {
      "path": "../src/app/domain/Store.js",
      "requires": [
        122,
        305
      ],
      "uses": [],
      "idx": 311
    },
    {
      "path": "../src/app/route/Queue.js",
      "requires": [],
      "uses": [
        28
      ],
      "idx": 312
    },
    {
      "path": "../src/app/route/Route.js",
      "requires": [],
      "uses": [
        52
      ],
      "idx": 313
    },
    {
      "path": "../src/util/History.js",
      "requires": [
        24
      ],
      "uses": [
        278
      ],
      "idx": 314
    },
    {
      "path": "../src/app/route/Router.js",
      "requires": [
        312,
        313,
        314
      ],
      "uses": [],
      "idx": 315
    },
    {
      "path": "../src/app/Controller.js",
      "requires": [
        12,
        175,
        306,
        309,
        310,
        311,
        315
      ],
      "uses": [
        15,
        102
      ],
      "idx": 316
    },
    {
      "path": "../src/panel/Bar.js",
      "requires": [
        288
      ],
      "uses": [],
      "idx": 317
    },
    {
      "path": "../src/panel/Title.js",
      "requires": [
        65
      ],
      "uses": [],
      "idx": 318
    },
    {
      "path": "../src/panel/Tool.js",
      "requires": [
        65
      ],
      "uses": [
        353
      ],
      "idx": 319
    },
    {
      "path": "../src/panel/Header.js",
      "requires": [
        110,
        299,
        317,
        318,
        319
      ],
      "uses": [
        12
      ],
      "idx": 320
    },
    {
      "path": "../src/toolbar/Fill.js",
      "requires": [
        65
      ],
      "uses": [],
      "idx": 321
    },
    {
      "path": "../src/layout/container/boxOverflow/None.js",
      "requires": [
        89
      ],
      "uses": [],
      "idx": 322
    },
    {
      "path": "../src/toolbar/Item.js",
      "requires": [
        65
      ],
      "uses": [],
      "idx": 323
    },
    {
      "path": "../src/toolbar/Separator.js",
      "requires": [
        323
      ],
      "uses": [],
      "idx": 324
    },
    {
      "path": "../src/dom/ButtonElement.js",
      "requires": [
        18
      ],
      "uses": [],
      "idx": 325
    },
    {
      "path": "../src/button/Manager.js",
      "requires": [],
      "uses": [],
      "idx": 326
    },
    {
      "path": "../src/menu/Manager.js",
      "requires": [
        28,
        292
      ],
      "uses": [
        12,
        515
      ],
      "idx": 327
    },
    {
      "path": "../src/util/ClickRepeater.js",
      "requires": [
        24
      ],
      "uses": [],
      "idx": 328
    },
    {
      "path": "../src/button/Button.js",
      "requires": [
        65,
        176,
        279,
        292,
        325,
        326,
        327,
        328
      ],
      "uses": [
        82,
        353
      ],
      "idx": 329
    },
    {
      "path": "../src/layout/container/boxOverflow/Menu.js",
      "requires": [
        322,
        324,
        329
      ],
      "uses": [
        110,
        299,
        321,
        336,
        346,
        515
      ],
      "idx": 330
    },
    {
      "path": "../src/layout/container/boxOverflow/Scroller.js",
      "requires": [
        5,
        18,
        322,
        328
      ],
      "uses": [],
      "idx": 331
    },
    {
      "path": "../src/dd/DragDropManager.js",
      "requires": [
        80
      ],
      "uses": [
        353,
        388
      ],
      "idx": 332
    },
    {
      "path": "../src/resizer/Splitter.js",
      "requires": [
        65,
        88
      ],
      "uses": [
        435
      ],
      "idx": 333
    },
    {
      "path": "../src/layout/container/Box.js",
      "requires": [
        51,
        285,
        322,
        330,
        331,
        332,
        333
      ],
      "uses": [
        89,
        110,
        283,
        299
      ],
      "idx": 334
    },
    {
      "path": "../src/layout/container/HBox.js",
      "requires": [
        334
      ],
      "uses": [],
      "idx": 335
    },
    {
      "path": "../src/layout/container/VBox.js",
      "requires": [
        334
      ],
      "uses": [],
      "idx": 336
    },
    {
      "path": "../src/util/FocusableContainer.js",
      "requires": [
        3,
        293
      ],
      "uses": [
        65
      ],
      "idx": 337
    },
    {
      "path": "../src/toolbar/Toolbar.js",
      "requires": [
        110,
        288,
        299,
        321,
        335,
        336,
        337
      ],
      "uses": [
        324,
        467
      ],
      "idx": 338
    },
    {
      "path": "../src/dd/DragDrop.js",
      "requires": [
        332
      ],
      "uses": [
        18
      ],
      "idx": 339
    },
    {
      "path": "../src/dd/DD.js",
      "requires": [
        332,
        339
      ],
      "uses": [
        18
      ],
      "idx": 340
    },
    {
      "path": "../src/dd/DDProxy.js",
      "requires": [
        340
      ],
      "uses": [
        332
      ],
      "idx": 341
    },
    {
      "path": "../src/dd/StatusProxy.js",
      "requires": [
        65
      ],
      "uses": [],
      "idx": 342
    },
    {
      "path": "../src/dd/DragSource.js",
      "requires": [
        332,
        341,
        342
      ],
      "uses": [
        110,
        299
      ],
      "idx": 343
    },
    {
      "path": "../src/panel/Proxy.js",
      "requires": [],
      "uses": [
        18
      ],
      "idx": 344
    },
    {
      "path": "../src/panel/DD.js",
      "requires": [
        343,
        344
      ],
      "uses": [],
      "idx": 345
    },
    {
      "path": "../src/layout/component/Dock.js",
      "requires": [
        298
      ],
      "uses": [
        15,
        18,
        283
      ],
      "idx": 346
    },
    {
      "path": "../src/util/Memento.js",
      "requires": [],
      "uses": [],
      "idx": 347
    },
    {
      "path": "../src/container/DockingContainer.js",
      "requires": [
        18,
        28
      ],
      "uses": [
        15,
        25,
        181
      ],
      "idx": 348
    },
    {
      "path": "../src/panel/Panel.js",
      "requires": [
        18,
        28,
        45,
        88,
        288,
        292,
        320,
        338,
        345,
        346,
        347,
        348
      ],
      "uses": [
        22,
        56,
        57,
        65,
        110,
        286,
        299,
        319,
        417
      ],
      "idx": 349
    },
    {
      "path": "../src/tip/Tip.js",
      "requires": [
        349
      ],
      "uses": [
        65
      ],
      "idx": 350
    },
    {
      "path": "../src/tip/ToolTip.js",
      "requires": [
        350
      ],
      "uses": [
        18
      ],
      "idx": 351
    },
    {
      "path": "../src/tip/QuickTip.js",
      "requires": [
        351
      ],
      "uses": [],
      "idx": 352
    },
    {
      "path": "../src/tip/QuickTipManager.js",
      "requires": [
        352
      ],
      "uses": [],
      "idx": 353
    },
    {
      "path": "../src/app/Application.js",
      "requires": [
        28,
        314,
        316,
        353
      ],
      "uses": [
        315
      ],
      "idx": 354
    },
    {
      "path": "../src/app/domain/View.js",
      "requires": [
        305
      ],
      "uses": [
        65
      ],
      "idx": 355
    },
    {
      "path": "../src/app/ViewController.js",
      "requires": [
        89,
        309,
        355
      ],
      "uses": [],
      "idx": 356
    },
    {
      "path": "../src/form/Labelable.js",
      "requires": [
        3,
        88
      ],
      "uses": [
        18,
        352
      ],
      "idx": 357
    },
    {
      "path": "../src/form/field/Field.js",
      "requires": [],
      "uses": [],
      "idx": 358
    },
    {
      "path": "../src/form/field/Base.js",
      "requires": [
        22,
        65,
        88,
        357,
        358
      ],
      "uses": [
        181
      ],
      "idx": 359
    },
    {
      "path": "../src/form/field/Display.js",
      "requires": [
        51,
        88,
        359
      ],
      "uses": [],
      "idx": 360
    },
    {
      "path": "../src/layout/container/Fit.js",
      "requires": [
        285
      ],
      "uses": [],
      "idx": 361
    },
    {
      "path": "../src/panel/Table.js",
      "requires": [
        349,
        361
      ],
      "uses": [
        22,
        175,
        181,
        368,
        380,
        395,
        399,
        527,
        528,
        560,
        564
      ],
      "idx": 362
    },
    {
      "path": "../src/selection/Model.js",
      "requires": [
        24,
        175,
        296
      ],
      "uses": [
        28
      ],
      "idx": 363
    },
    {
      "path": "../src/selection/DataViewModel.js",
      "requires": [
        293,
        363
      ],
      "uses": [],
      "idx": 364
    },
    {
      "path": "../src/view/NavigationModel.js",
      "requires": [
        24,
        89
      ],
      "uses": [
        293
      ],
      "idx": 365
    },
    {
      "path": "../src/view/AbstractView.js",
      "requires": [
        20,
        65,
        175,
        296,
        297,
        364,
        365
      ],
      "uses": [
        11,
        52,
        88,
        89,
        181,
        278
      ],
      "idx": 366
    },
    {
      "path": "../src/view/View.js",
      "requires": [
        366
      ],
      "uses": [],
      "idx": 367
    },
    {
      "path": "../src/grid/CellContext.js",
      "requires": [],
      "uses": [],
      "idx": 368
    },
    {
      "path": "../src/util/CSS.js",
      "requires": [],
      "uses": [
        18
      ],
      "idx": 369
    },
    {
      "path": "../src/view/TableLayout.js",
      "requires": [
        299,
        369
      ],
      "uses": [],
      "idx": 370
    },
    {
      "path": "../src/view/NodeCache.js",
      "requires": [
        20
      ],
      "uses": [
        18,
        19
      ],
      "idx": 371
    },
    {
      "path": "../src/view/Table.js",
      "requires": [
        22,
        28,
        367,
        368,
        370,
        371
      ],
      "uses": [
        19,
        88,
        395
      ],
      "idx": 372
    },
    {
      "path": "../src/grid/View.js",
      "requires": [
        372
      ],
      "uses": [],
      "idx": 373
    },
    {
      "path": "../src/grid/Panel.js",
      "requires": [
        362,
        373
      ],
      "uses": [],
      "idx": 374
    },
    {
      "path": "../src/form/CheckboxManager.js",
      "requires": [
        28
      ],
      "uses": [],
      "idx": 375
    },
    {
      "path": "../src/form/field/Checkbox.js",
      "requires": [
        88,
        359,
        375
      ],
      "uses": [],
      "idx": 376
    },
    {
      "path": "../src/app/bindinspector/Util.js",
      "requires": [],
      "uses": [
        52
      ],
      "idx": 377
    },
    {
      "path": "../src/app/bindinspector/ComponentDetail.js",
      "requires": [
        65,
        110,
        288,
        299,
        335,
        336,
        349,
        360,
        374,
        376,
        377
      ],
      "uses": [
        52,
        321,
        329,
        338,
        346,
        361,
        414
      ],
      "idx": 378
    },
    {
      "path": "../src/tree/View.js",
      "requires": [
        173,
        372
      ],
      "uses": [
        88
      ],
      "idx": 379
    },
    {
      "path": "../src/selection/RowModel.js",
      "requires": [
        364,
        368
      ],
      "uses": [],
      "idx": 380
    },
    {
      "path": "../src/selection/TreeModel.js",
      "requires": [
        380
      ],
      "uses": [],
      "idx": 381
    },
    {
      "path": "../src/grid/ColumnLayout.js",
      "requires": [
        335,
        362
      ],
      "uses": [],
      "idx": 382
    },
    {
      "path": "../src/plugin/Abstract.js",
      "requires": [],
      "uses": [],
      "idx": 383
    },
    {
      "path": "../src/dd/DragTracker.js",
      "requires": [
        24
      ],
      "uses": [
        80
      ],
      "idx": 384
    },
    {
      "path": "../src/grid/plugin/HeaderResizer.js",
      "requires": [
        80,
        383,
        384
      ],
      "uses": [
        397
      ],
      "idx": 385
    },
    {
      "path": "../src/dd/DragZone.js",
      "requires": [
        343
      ],
      "uses": [
        389,
        391
      ],
      "idx": 386
    },
    {
      "path": "../src/grid/header/DragZone.js",
      "requires": [
        386
      ],
      "uses": [],
      "idx": 387
    },
    {
      "path": "../src/dd/DDTarget.js",
      "requires": [
        339
      ],
      "uses": [],
      "idx": 388
    },
    {
      "path": "../src/dd/ScrollManager.js",
      "requires": [
        332
      ],
      "uses": [],
      "idx": 389
    },
    {
      "path": "../src/dd/DropTarget.js",
      "requires": [
        388,
        389
      ],
      "uses": [],
      "idx": 390
    },
    {
      "path": "../src/dd/Registry.js",
      "requires": [],
      "uses": [],
      "idx": 391
    },
    {
      "path": "../src/dd/DropZone.js",
      "requires": [
        390,
        391
      ],
      "uses": [
        332
      ],
      "idx": 392
    },
    {
      "path": "../src/grid/header/DropZone.js",
      "requires": [
        392
      ],
      "uses": [
        332
      ],
      "idx": 393
    },
    {
      "path": "../src/grid/plugin/HeaderReorderer.js",
      "requires": [
        383,
        387,
        393
      ],
      "uses": [],
      "idx": 394
    },
    {
      "path": "../src/grid/header/Container.js",
      "requires": [
        288,
        293,
        337,
        382,
        385,
        394
      ],
      "uses": [
        22,
        110,
        299,
        336,
        346,
        397,
        490,
        512,
        514,
        515
      ],
      "idx": 395
    },
    {
      "path": "../src/grid/ColumnComponentLayout.js",
      "requires": [
        299
      ],
      "uses": [],
      "idx": 396
    },
    {
      "path": "../src/grid/column/Column.js",
      "requires": [
        120,
        382,
        395,
        396
      ],
      "uses": [
        51,
        385
      ],
      "idx": 397
    },
    {
      "path": "../src/tree/Column.js",
      "requires": [
        397
      ],
      "uses": [],
      "idx": 398
    },
    {
      "path": "../src/grid/NavigationModel.js",
      "requires": [
        365
      ],
      "uses": [
        19,
        82,
        293,
        368
      ],
      "idx": 399
    },
    {
      "path": "../src/tree/NavigationModel.js",
      "requires": [
        399
      ],
      "uses": [
        82
      ],
      "idx": 400
    },
    {
      "path": "../src/tree/Panel.js",
      "requires": [
        178,
        362,
        379,
        381,
        398,
        400
      ],
      "uses": [
        110,
        175,
        286,
        396,
        528
      ],
      "idx": 401
    },
    {
      "path": "../src/form/field/VTypes.js",
      "requires": [],
      "uses": [],
      "idx": 402
    },
    {
      "path": "../src/form/trigger/Trigger.js",
      "requires": [
        89,
        328
      ],
      "uses": [
        18,
        88
      ],
      "idx": 403
    },
    {
      "path": "../src/form/field/Text.js",
      "requires": [
        279,
        359,
        402,
        403
      ],
      "uses": [
        22,
        51,
        52,
        57
      ],
      "idx": 404
    },
    {
      "path": "../src/app/bindinspector/ComponentList.js",
      "requires": [
        401,
        404
      ],
      "uses": [
        15,
        110,
        286,
        299,
        321,
        329,
        338,
        346,
        351,
        377,
        396,
        398
      ],
      "idx": 405
    },
    {
      "path": "../src/resizer/BorderSplitter.js",
      "requires": [
        333
      ],
      "uses": [
        554
      ],
      "idx": 406
    },
    {
      "path": "../src/layout/container/Border.js",
      "requires": [
        45,
        66,
        285,
        406
      ],
      "uses": [
        51,
        110,
        299
      ],
      "idx": 407
    },
    {
      "path": "../src/layout/container/Card.js",
      "requires": [
        361
      ],
      "uses": [],
      "idx": 408
    },
    {
      "path": "../src/tab/Tab.js",
      "requires": [
        293,
        329
      ],
      "uses": [
        18
      ],
      "idx": 409
    },
    {
      "path": "../src/layout/component/Body.js",
      "requires": [
        299
      ],
      "uses": [],
      "idx": 410
    },
    {
      "path": "../src/tab/Bar.js",
      "requires": [
        81,
        317,
        337,
        409,
        410
      ],
      "uses": [
        80
      ],
      "idx": 411
    },
    {
      "path": "../src/tab/Panel.js",
      "requires": [
        349,
        408,
        411
      ],
      "uses": [
        110,
        299,
        409
      ],
      "idx": 412
    },
    {
      "path": "../src/app/bindinspector/Environment.js",
      "requires": [
        92
      ],
      "uses": [
        12,
        449
      ],
      "idx": 413
    },
    {
      "path": "../src/app/bindinspector/ViewModelDetail.js",
      "requires": [
        401
      ],
      "uses": [
        52,
        110,
        286,
        377,
        396,
        398
      ],
      "idx": 414
    },
    {
      "path": "../src/app/bindinspector/noconflict/BaseModel.js",
      "requires": [
        143
      ],
      "uses": [],
      "idx": 415
    },
    {
      "path": "../src/app/bindinspector/Container.js",
      "requires": [
        65,
        110,
        288,
        299,
        335,
        377,
        378,
        405,
        407,
        412,
        413,
        414,
        415
      ],
      "uses": [
        102,
        286,
        346,
        349,
        361
      ],
      "idx": 416
    },
    {
      "path": "../src/util/ComponentDragger.js",
      "requires": [
        384
      ],
      "uses": [
        18,
        80
      ],
      "idx": 417
    },
    {
      "path": "../src/window/Window.js",
      "requires": [
        80,
        349,
        417
      ],
      "uses": [],
      "idx": 418
    },
    {
      "path": "../src/app/bindinspector/Inspector.js",
      "requires": [
        353,
        361,
        416,
        418
      ],
      "uses": [
        110,
        299,
        407,
        413
      ],
      "idx": 419
    },
    {
      "path": "../src/app/domain/Controller.js",
      "requires": [
        305,
        316
      ],
      "uses": [
        309
      ],
      "idx": 420
    },
    {
      "path": "../src/app/domain/Direct.js",
      "requires": [
        205,
        305
      ],
      "uses": [],
      "idx": 421
    },
    {
      "path": "../src/button/Split.js",
      "requires": [
        329
      ],
      "uses": [],
      "idx": 422
    },
    {
      "path": "../src/button/Cycle.js",
      "requires": [
        422
      ],
      "uses": [],
      "idx": 423
    },
    {
      "path": "../src/button/Segmented.js",
      "requires": [
        288,
        329
      ],
      "uses": [],
      "idx": 424
    },
    {
      "path": "../src/layout/container/Table.js",
      "requires": [
        285
      ],
      "uses": [],
      "idx": 425
    },
    {
      "path": "../src/container/ButtonGroup.js",
      "requires": [
        349,
        425
      ],
      "uses": [],
      "idx": 426
    },
    {
      "path": "../src/container/Monitor.js",
      "requires": [],
      "uses": [
        28
      ],
      "idx": 427
    },
    {
      "path": "../src/plugin/Responsive.js",
      "requires": [
        263
      ],
      "uses": [],
      "idx": 428
    },
    {
      "path": "../src/plugin/Viewport.js",
      "requires": [
        428
      ],
      "uses": [
        18
      ],
      "idx": 429
    },
    {
      "path": "../src/container/Viewport.js",
      "requires": [
        263,
        288,
        429
      ],
      "uses": [],
      "idx": 430
    },
    {
      "path": "../src/layout/container/Anchor.js",
      "requires": [
        286
      ],
      "uses": [],
      "idx": 431
    },
    {
      "path": "../src/dashboard/Panel.js",
      "requires": [
        349
      ],
      "uses": [
        12
      ],
      "idx": 432
    },
    {
      "path": "../src/dashboard/Column.js",
      "requires": [
        288,
        431,
        432
      ],
      "uses": [],
      "idx": 433
    },
    {
      "path": "../src/layout/container/Column.js",
      "requires": [
        286
      ],
      "uses": [],
      "idx": 434
    },
    {
      "path": "../src/resizer/SplitterTracker.js",
      "requires": [
        80,
        384
      ],
      "uses": [
        18
      ],
      "idx": 435
    },
    {
      "path": "../src/layout/container/ColumnSplitterTracker.js",
      "requires": [
        435
      ],
      "uses": [],
      "idx": 436
    },
    {
      "path": "../src/layout/container/ColumnSplitter.js",
      "requires": [
        333,
        436
      ],
      "uses": [],
      "idx": 437
    },
    {
      "path": "../src/layout/container/Dashboard.js",
      "requires": [
        434,
        437
      ],
      "uses": [
        110,
        299
      ],
      "idx": 438
    },
    {
      "path": "../src/dashboard/DropZone.js",
      "requires": [
        390
      ],
      "uses": [],
      "idx": 439
    },
    {
      "path": "../src/dashboard/Part.js",
      "requires": [
        4,
        89,
        94
      ],
      "uses": [],
      "idx": 440
    },
    {
      "path": "../src/dashboard/Dashboard.js",
      "requires": [
        349,
        433,
        438,
        439,
        440
      ],
      "uses": [
        61,
        89,
        92
      ],
      "idx": 441
    },
    {
      "path": "../src/dom/Layer.js",
      "requires": [
        18
      ],
      "uses": [
        181,
        304
      ],
      "idx": 442
    },
    {
      "path": "../src/enums.js",
      "requires": [],
      "uses": [],
      "idx": 443
    },
    {
      "path": "../src/flash/Component.js",
      "requires": [
        65
      ],
      "uses": [],
      "idx": 444
    },
    {
      "path": "../src/form/action/Action.js",
      "requires": [],
      "uses": [],
      "idx": 445
    },
    {
      "path": "../src/form/action/Load.js",
      "requires": [
        9,
        445
      ],
      "uses": [
        10
      ],
      "idx": 446
    },
    {
      "path": "../src/form/action/Submit.js",
      "requires": [
        445
      ],
      "uses": [
        10,
        181
      ],
      "idx": 447
    },
    {
      "path": "../src/form/field/TextArea.js",
      "requires": [
        22,
        88,
        404
      ],
      "uses": [
        51,
        279
      ],
      "idx": 448
    },
    {
      "path": "../src/window/MessageBox.js",
      "requires": [
        301,
        329,
        335,
        338,
        360,
        404,
        418,
        431,
        448
      ],
      "uses": [
        65,
        110,
        288,
        299,
        300
      ],
      "idx": 449
    },
    {
      "path": "../src/form/Basic.js",
      "requires": [
        22,
        24,
        28,
        127,
        446,
        447,
        449
      ],
      "uses": [
        427
      ],
      "idx": 450
    },
    {
      "path": "../src/form/FieldAncestor.js",
      "requires": [
        3,
        427
      ],
      "uses": [],
      "idx": 451
    },
    {
      "path": "../src/layout/component/field/FieldContainer.js",
      "requires": [
        299
      ],
      "uses": [],
      "idx": 452
    },
    {
      "path": "../src/form/FieldContainer.js",
      "requires": [
        288,
        357,
        451,
        452
      ],
      "uses": [],
      "idx": 453
    },
    {
      "path": "../src/layout/container/CheckboxGroup.js",
      "requires": [
        285
      ],
      "uses": [
        181
      ],
      "idx": 454
    },
    {
      "path": "../src/form/CheckboxGroup.js",
      "requires": [
        358,
        359,
        376,
        453,
        454
      ],
      "uses": [],
      "idx": 455
    },
    {
      "path": "../src/form/FieldSet.js",
      "requires": [
        288,
        451
      ],
      "uses": [
        18,
        56,
        65,
        110,
        181,
        285,
        299,
        319,
        376,
        431,
        544
      ],
      "idx": 456
    },
    {
      "path": "../src/form/Label.js",
      "requires": [
        51,
        65
      ],
      "uses": [],
      "idx": 457
    },
    {
      "path": "../src/form/Panel.js",
      "requires": [
        29,
        349,
        450,
        451
      ],
      "uses": [],
      "idx": 458
    },
    {
      "path": "../src/form/RadioManager.js",
      "requires": [
        28
      ],
      "uses": [],
      "idx": 459
    },
    {
      "path": "../src/form/field/Radio.js",
      "requires": [
        376,
        459
      ],
      "uses": [],
      "idx": 460
    },
    {
      "path": "../src/form/RadioGroup.js",
      "requires": [
        337,
        455,
        460
      ],
      "uses": [
        459
      ],
      "idx": 461
    },
    {
      "path": "../src/form/action/DirectLoad.js",
      "requires": [
        164,
        446
      ],
      "uses": [],
      "idx": 462
    },
    {
      "path": "../src/form/action/DirectSubmit.js",
      "requires": [
        164,
        447
      ],
      "uses": [],
      "idx": 463
    },
    {
      "path": "../src/form/action/StandardSubmit.js",
      "requires": [
        447
      ],
      "uses": [],
      "idx": 464
    },
    {
      "path": "../src/form/field/Picker.js",
      "requires": [
        293,
        404
      ],
      "uses": [],
      "idx": 465
    },
    {
      "path": "../src/layout/component/BoundList.js",
      "requires": [
        299
      ],
      "uses": [],
      "idx": 466
    },
    {
      "path": "../src/toolbar/TextItem.js",
      "requires": [
        88,
        323
      ],
      "uses": [],
      "idx": 467
    },
    {
      "path": "../src/form/trigger/Spinner.js",
      "requires": [
        403
      ],
      "uses": [],
      "idx": 468
    },
    {
      "path": "../src/form/field/Spinner.js",
      "requires": [
        293,
        404,
        468
      ],
      "uses": [],
      "idx": 469
    },
    {
      "path": "../src/form/field/Number.js",
      "requires": [
        469
      ],
      "uses": [
        51,
        52
      ],
      "idx": 470
    },
    {
      "path": "../src/toolbar/Paging.js",
      "requires": [
        296,
        338,
        467,
        470
      ],
      "uses": [
        52,
        110,
        299,
        468
      ],
      "idx": 471
    },
    {
      "path": "../src/view/BoundList.js",
      "requires": [
        18,
        176,
        367,
        466,
        471
      ],
      "uses": [
        88,
        110,
        299
      ],
      "idx": 472
    },
    {
      "path": "../src/view/BoundListKeyNav.js",
      "requires": [
        365
      ],
      "uses": [
        293
      ],
      "idx": 473
    },
    {
      "path": "../src/form/field/ComboBox.js",
      "requires": [
        22,
        175,
        296,
        465,
        472,
        473
      ],
      "uses": [
        18,
        21,
        82,
        88,
        110,
        157,
        181,
        466
      ],
      "idx": 474
    },
    {
      "path": "../src/picker/Month.js",
      "requires": [
        65,
        88,
        328,
        329
      ],
      "uses": [
        110,
        299
      ],
      "idx": 475
    },
    {
      "path": "../src/picker/Date.js",
      "requires": [
        39,
        65,
        88,
        293,
        328,
        329,
        422,
        475
      ],
      "uses": [
        52,
        110,
        181,
        299
      ],
      "idx": 476
    },
    {
      "path": "../src/form/field/Date.js",
      "requires": [
        465,
        476
      ],
      "uses": [
        52,
        110,
        299
      ],
      "idx": 477
    },
    {
      "path": "../src/form/field/FileButton.js",
      "requires": [
        329
      ],
      "uses": [],
      "idx": 478
    },
    {
      "path": "../src/form/trigger/Component.js",
      "requires": [
        403
      ],
      "uses": [],
      "idx": 479
    },
    {
      "path": "../src/form/field/File.js",
      "requires": [
        404,
        478,
        479
      ],
      "uses": [
        110,
        299
      ],
      "idx": 480
    },
    {
      "path": "../src/form/field/Hidden.js",
      "requires": [
        359
      ],
      "uses": [],
      "idx": 481
    },
    {
      "path": "../src/picker/Color.js",
      "requires": [
        65,
        88
      ],
      "uses": [],
      "idx": 482
    },
    {
      "path": "../src/layout/component/field/HtmlEditor.js",
      "requires": [
        452
      ],
      "uses": [],
      "idx": 483
    },
    {
      "path": "../src/form/field/HtmlEditor.js",
      "requires": [
        51,
        323,
        336,
        338,
        353,
        358,
        453,
        482,
        483
      ],
      "uses": [
        22,
        52,
        65,
        110,
        181,
        278,
        299,
        346,
        515
      ],
      "idx": 484
    },
    {
      "path": "../src/form/field/Tag.js",
      "requires": [
        159,
        363,
        474
      ],
      "uses": [
        21,
        48,
        88
      ],
      "idx": 485
    },
    {
      "path": "../src/picker/Time.js",
      "requires": [
        159,
        472
      ],
      "uses": [
        21
      ],
      "idx": 486
    },
    {
      "path": "../src/form/field/Time.js",
      "requires": [
        473,
        474,
        477,
        486
      ],
      "uses": [
        52,
        88,
        110,
        466
      ],
      "idx": 487
    },
    {
      "path": "../src/form/field/Trigger.js",
      "requires": [
        181,
        328,
        404
      ],
      "uses": [],
      "idx": 488
    },
    {
      "path": "../src/grid/CellEditor.js",
      "requires": [
        290
      ],
      "uses": [],
      "idx": 489
    },
    {
      "path": "../src/grid/ColumnManager.js",
      "requires": [],
      "uses": [],
      "idx": 490
    },
    {
      "path": "../src/grid/RowEditorButtons.js",
      "requires": [
        288
      ],
      "uses": [
        110,
        299,
        329,
        349
      ],
      "idx": 491
    },
    {
      "path": "../src/grid/RowEditor.js",
      "requires": [
        293,
        351,
        458,
        491
      ],
      "uses": [
        18,
        48,
        110,
        286,
        288,
        299,
        346,
        360
      ],
      "idx": 492
    },
    {
      "path": "../src/grid/Scroller.js",
      "requires": [],
      "uses": [],
      "idx": 493
    },
    {
      "path": "../src/view/DropZone.js",
      "requires": [
        392
      ],
      "uses": [
        65,
        110,
        299
      ],
      "idx": 494
    },
    {
      "path": "../src/grid/ViewDropZone.js",
      "requires": [
        494
      ],
      "uses": [],
      "idx": 495
    },
    {
      "path": "../src/grid/column/Action.js",
      "requires": [
        397
      ],
      "uses": [],
      "idx": 496
    },
    {
      "path": "../src/grid/column/Boolean.js",
      "requires": [
        397
      ],
      "uses": [],
      "idx": 497
    },
    {
      "path": "../src/grid/column/Check.js",
      "requires": [
        397
      ],
      "uses": [],
      "idx": 498
    },
    {
      "path": "../src/grid/column/Date.js",
      "requires": [
        397
      ],
      "uses": [
        51
      ],
      "idx": 499
    },
    {
      "path": "../src/grid/column/Number.js",
      "requires": [
        51,
        397
      ],
      "uses": [],
      "idx": 500
    },
    {
      "path": "../src/grid/column/RowNumberer.js",
      "requires": [
        397
      ],
      "uses": [],
      "idx": 501
    },
    {
      "path": "../src/grid/column/Template.js",
      "requires": [
        88,
        397
      ],
      "uses": [
        498
      ],
      "idx": 502
    },
    {
      "path": "../src/grid/column/Widget.js",
      "requires": [
        397
      ],
      "uses": [],
      "idx": 503
    },
    {
      "path": "../src/grid/feature/Feature.js",
      "requires": [
        24
      ],
      "uses": [],
      "idx": 504
    },
    {
      "path": "../src/grid/feature/AbstractSummary.js",
      "requires": [
        504
      ],
      "uses": [
        143
      ],
      "idx": 505
    },
    {
      "path": "../src/grid/feature/GroupStore.js",
      "requires": [
        24
      ],
      "uses": [
        92
      ],
      "idx": 506
    },
    {
      "path": "../src/grid/feature/Grouping.js",
      "requires": [
        504,
        505,
        506
      ],
      "uses": [
        88,
        395
      ],
      "idx": 507
    },
    {
      "path": "../src/grid/feature/GroupingSummary.js",
      "requires": [
        507
      ],
      "uses": [],
      "idx": 508
    },
    {
      "path": "../src/grid/feature/RowBody.js",
      "requires": [
        504
      ],
      "uses": [
        88
      ],
      "idx": 509
    },
    {
      "path": "../src/grid/feature/Summary.js",
      "requires": [
        505
      ],
      "uses": [
        65,
        110,
        143,
        299
      ],
      "idx": 510
    },
    {
      "path": "../src/menu/Item.js",
      "requires": [
        65,
        176
      ],
      "uses": [
        18,
        327,
        353
      ],
      "idx": 511
    },
    {
      "path": "../src/menu/CheckItem.js",
      "requires": [
        511
      ],
      "uses": [
        327
      ],
      "idx": 512
    },
    {
      "path": "../src/menu/KeyNav.js",
      "requires": [
        293
      ],
      "uses": [
        327
      ],
      "idx": 513
    },
    {
      "path": "../src/menu/Separator.js",
      "requires": [
        511
      ],
      "uses": [],
      "idx": 514
    },
    {
      "path": "../src/menu/Menu.js",
      "requires": [
        327,
        336,
        349,
        511,
        512,
        513,
        514
      ],
      "uses": [
        12,
        18,
        48,
        110,
        299
      ],
      "idx": 515
    },
    {
      "path": "../src/grid/filters/filter/Base.js",
      "requires": [
        89,
        110,
        336,
        346,
        515
      ],
      "uses": [
        21
      ],
      "idx": 516
    },
    {
      "path": "../src/grid/filters/filter/SingleFilter.js",
      "requires": [
        516
      ],
      "uses": [],
      "idx": 517
    },
    {
      "path": "../src/grid/filters/filter/Boolean.js",
      "requires": [
        517
      ],
      "uses": [],
      "idx": 518
    },
    {
      "path": "../src/grid/filters/filter/TriFilter.js",
      "requires": [
        516
      ],
      "uses": [],
      "idx": 519
    },
    {
      "path": "../src/grid/filters/filter/Date.js",
      "requires": [
        110,
        299,
        512,
        519
      ],
      "uses": [
        476,
        515
      ],
      "idx": 520
    },
    {
      "path": "../src/grid/filters/filter/List.js",
      "requires": [
        517
      ],
      "uses": [
        149,
        154,
        160,
        161
      ],
      "idx": 521
    },
    {
      "path": "../src/grid/filters/filter/Number.js",
      "requires": [
        110,
        299,
        468,
        519
      ],
      "uses": [
        470
      ],
      "idx": 522
    },
    {
      "path": "../src/grid/filters/filter/String.js",
      "requires": [
        110,
        299,
        404,
        517
      ],
      "uses": [],
      "idx": 523
    },
    {
      "path": "../src/grid/filters/Filters.js",
      "requires": [
        296,
        383,
        516,
        517,
        518,
        519,
        520,
        521,
        522,
        523
      ],
      "uses": [
        89
      ],
      "idx": 524
    },
    {
      "path": "../src/grid/locking/HeaderContainer.js",
      "requires": [
        395,
        490
      ],
      "uses": [],
      "idx": 525
    },
    {
      "path": "../src/grid/locking/View.js",
      "requires": [
        24,
        64,
        65,
        296,
        366
      ],
      "uses": [
        12,
        297,
        372,
        399
      ],
      "idx": 526
    },
    {
      "path": "../src/grid/locking/Lockable.js",
      "requires": [
        65,
        372,
        395,
        525,
        526
      ],
      "uses": [
        22,
        110,
        175,
        286,
        299,
        333,
        334
      ],
      "idx": 527
    },
    {
      "path": "../src/grid/plugin/BufferedRenderer.js",
      "requires": [
        383
      ],
      "uses": [
        22
      ],
      "idx": 528
    },
    {
      "path": "../src/grid/plugin/Editing.js",
      "requires": [
        24,
        293,
        359,
        372,
        383,
        397
      ],
      "uses": [
        12,
        110,
        299,
        368
      ],
      "idx": 529
    },
    {
      "path": "../src/grid/plugin/CellEditing.js",
      "requires": [
        22,
        489,
        529
      ],
      "uses": [
        28,
        110,
        289,
        299
      ],
      "idx": 530
    },
    {
      "path": "../src/grid/plugin/DragDrop.js",
      "requires": [
        383
      ],
      "uses": [
        495,
        585
      ],
      "idx": 531
    },
    {
      "path": "../src/grid/plugin/RowEditing.js",
      "requires": [
        492,
        529
      ],
      "uses": [],
      "idx": 532
    },
    {
      "path": "../src/grid/plugin/RowExpander.js",
      "requires": [
        383,
        509
      ],
      "uses": [
        88,
        397
      ],
      "idx": 533
    },
    {
      "path": "../src/grid/property/Grid.js",
      "requires": [
        374
      ],
      "uses": [
        12,
        88,
        110,
        143,
        289,
        299,
        359,
        372,
        404,
        468,
        470,
        474,
        477,
        489,
        530,
        535,
        538
      ],
      "idx": 534
    },
    {
      "path": "../src/grid/property/HeaderContainer.js",
      "requires": [
        51,
        395
      ],
      "uses": [],
      "idx": 535
    },
    {
      "path": "../src/grid/property/Property.js",
      "requires": [
        143
      ],
      "uses": [],
      "idx": 536
    },
    {
      "path": "../src/grid/property/Reader.js",
      "requires": [
        145
      ],
      "uses": [
        144
      ],
      "idx": 537
    },
    {
      "path": "../src/grid/property/Store.js",
      "requires": [
        149,
        159,
        536,
        537
      ],
      "uses": [
        154
      ],
      "idx": 538
    },
    {
      "path": "../src/layout/ClassList.js",
      "requires": [],
      "uses": [],
      "idx": 539
    },
    {
      "path": "../src/util/Queue.js",
      "requires": [],
      "uses": [],
      "idx": 540
    },
    {
      "path": "../src/layout/ContextItem.js",
      "requires": [
        539
      ],
      "uses": [
        28,
        39,
        45,
        283
      ],
      "idx": 541
    },
    {
      "path": "../src/layout/Context.js",
      "requires": [
        39,
        45,
        267,
        284,
        540,
        541
      ],
      "uses": [],
      "idx": 542
    },
    {
      "path": "../src/layout/SizePolicy.js",
      "requires": [],
      "uses": [],
      "idx": 543
    },
    {
      "path": "../src/layout/component/FieldSet.js",
      "requires": [
        410
      ],
      "uses": [],
      "idx": 544
    },
    {
      "path": "../src/layout/container/Absolute.js",
      "requires": [
        431
      ],
      "uses": [],
      "idx": 545
    },
    {
      "path": "../src/layout/container/Accordion.js",
      "requires": [
        336
      ],
      "uses": [],
      "idx": 546
    },
    {
      "path": "../src/layout/container/Center.js",
      "requires": [
        361
      ],
      "uses": [],
      "idx": 547
    },
    {
      "path": "../src/layout/container/Form.js",
      "requires": [
        286
      ],
      "uses": [],
      "idx": 548
    },
    {
      "path": "../src/layout/container/SegmentedButton.js",
      "requires": [
        285
      ],
      "uses": [],
      "idx": 549
    },
    {
      "path": "../src/menu/ColorPicker.js",
      "requires": [
        482,
        515
      ],
      "uses": [
        110,
        299,
        327
      ],
      "idx": 550
    },
    {
      "path": "../src/menu/DatePicker.js",
      "requires": [
        476,
        515
      ],
      "uses": [
        110,
        299,
        327
      ],
      "idx": 551
    },
    {
      "path": "../src/panel/Pinnable.js",
      "requires": [
        3
      ],
      "uses": [
        110,
        299,
        319
      ],
      "idx": 552
    },
    {
      "path": "../src/plugin/Manager.js",
      "requires": [],
      "uses": [],
      "idx": 553
    },
    {
      "path": "../src/resizer/BorderSplitterTracker.js",
      "requires": [
        80,
        435
      ],
      "uses": [],
      "idx": 554
    },
    {
      "path": "../src/resizer/Handle.js",
      "requires": [
        65
      ],
      "uses": [],
      "idx": 555
    },
    {
      "path": "../src/resizer/ResizeTracker.js",
      "requires": [
        384
      ],
      "uses": [],
      "idx": 556
    },
    {
      "path": "../src/resizer/Resizer.js",
      "requires": [
        24
      ],
      "uses": [
        18,
        52,
        65,
        181,
        556
      ],
      "idx": 557
    },
    {
      "path": "../src/scroll/Indicator.js",
      "requires": [],
      "uses": [],
      "idx": 558
    },
    {
      "path": "../src/scroll/Manager.js",
      "requires": [
        24,
        48,
        275,
        558
      ],
      "uses": [],
      "idx": 559
    },
    {
      "path": "../src/selection/CellModel.js",
      "requires": [
        364,
        368
      ],
      "uses": [],
      "idx": 560
    },
    {
      "path": "../src/slider/Thumb.js",
      "requires": [
        51,
        384
      ],
      "uses": [
        45
      ],
      "idx": 561
    },
    {
      "path": "../src/slider/Tip.js",
      "requires": [
        350
      ],
      "uses": [],
      "idx": 562
    },
    {
      "path": "../src/slider/Multi.js",
      "requires": [
        51,
        52,
        359,
        561,
        562
      ],
      "uses": [
        181
      ],
      "idx": 563
    },
    {
      "path": "../src/selection/CheckboxModel.js",
      "requires": [
        380
      ],
      "uses": [],
      "idx": 564
    },
    {
      "path": "../src/slider/Single.js",
      "requires": [
        563
      ],
      "uses": [],
      "idx": 565
    },
    {
      "path": "../src/slider/Widget.js",
      "requires": [
        55,
        563
      ],
      "uses": [
        45,
        51
      ],
      "idx": 566
    },
    {
      "path": "../src/sparkline/Shape.js",
      "requires": [],
      "uses": [],
      "idx": 567
    },
    {
      "path": "../src/sparkline/CanvasBase.js",
      "requires": [
        567
      ],
      "uses": [],
      "idx": 568
    },
    {
      "path": "../src/sparkline/CanvasCanvas.js",
      "requires": [
        568
      ],
      "uses": [],
      "idx": 569
    },
    {
      "path": "../src/sparkline/VmlCanvas.js",
      "requires": [
        568
      ],
      "uses": [],
      "idx": 570
    },
    {
      "path": "../src/sparkline/Base.js",
      "requires": [
        55,
        88,
        569,
        570
      ],
      "uses": [
        110,
        286,
        346,
        351
      ],
      "idx": 571
    },
    {
      "path": "../src/sparkline/BarBase.js",
      "requires": [
        571
      ],
      "uses": [],
      "idx": 572
    },
    {
      "path": "../src/sparkline/RangeMap.js",
      "requires": [],
      "uses": [],
      "idx": 573
    },
    {
      "path": "../src/sparkline/Bar.js",
      "requires": [
        88,
        572,
        573
      ],
      "uses": [],
      "idx": 574
    },
    {
      "path": "../src/sparkline/Box.js",
      "requires": [
        88,
        571
      ],
      "uses": [],
      "idx": 575
    },
    {
      "path": "../src/sparkline/Bullet.js",
      "requires": [
        88,
        571
      ],
      "uses": [],
      "idx": 576
    },
    {
      "path": "../src/sparkline/Discrete.js",
      "requires": [
        88,
        572
      ],
      "uses": [],
      "idx": 577
    },
    {
      "path": "../src/sparkline/Line.js",
      "requires": [
        88,
        571,
        573
      ],
      "uses": [],
      "idx": 578
    },
    {
      "path": "../src/sparkline/Pie.js",
      "requires": [
        88,
        571
      ],
      "uses": [],
      "idx": 579
    },
    {
      "path": "../src/sparkline/TriState.js",
      "requires": [
        88,
        572,
        573
      ],
      "uses": [],
      "idx": 580
    },
    {
      "path": "../src/state/CookieProvider.js",
      "requires": [
        60
      ],
      "uses": [],
      "idx": 581
    },
    {
      "path": "../src/state/LocalStorageProvider.js",
      "requires": [
        60,
        277
      ],
      "uses": [],
      "idx": 582
    },
    {
      "path": "../src/toolbar/Breadcrumb.js",
      "requires": [
        178,
        288,
        337,
        422
      ],
      "uses": [
        175
      ],
      "idx": 583
    },
    {
      "path": "../src/toolbar/Spacer.js",
      "requires": [
        65
      ],
      "uses": [],
      "idx": 584
    },
    {
      "path": "../src/view/DragZone.js",
      "requires": [
        386
      ],
      "uses": [
        52
      ],
      "idx": 585
    },
    {
      "path": "../src/tree/ViewDragZone.js",
      "requires": [
        585
      ],
      "uses": [
        52
      ],
      "idx": 586
    },
    {
      "path": "../src/tree/ViewDropZone.js",
      "requires": [
        494
      ],
      "uses": [],
      "idx": 587
    },
    {
      "path": "../src/tree/plugin/TreeViewDragDrop.js",
      "requires": [
        383
      ],
      "uses": [
        586,
        587
      ],
      "idx": 588
    },
    {
      "path": "../src/util/Cookies.js",
      "requires": [],
      "uses": [],
      "idx": 589
    },
    {
      "path": "../src/view/MultiSelectorSearch.js",
      "requires": [
        349
      ],
      "uses": [
        21,
        110,
        175,
        299,
        346,
        361,
        374,
        404
      ],
      "idx": 590
    },
    {
      "path": "../src/view/MultiSelector.js",
      "requires": [
        110,
        346,
        361,
        374,
        590
      ],
      "uses": [],
      "idx": 591
    },
    {
      "path": "../src/window/Toast.js",
      "requires": [
        418
      ],
      "uses": [
        22
      ],
      "idx": 592
    }
  ],
  "classes": {
    "Ext.AbstractManager": {
      "idx": 7,
      "alias": [],
      "alternates": []
    },
    "Ext.Action": {
      "idx": 280,
      "alias": [],
      "alternates": []
    },
    "Ext.Ajax": {
      "idx": 10,
      "alias": [],
      "alternates": []
    },
    "Ext.AnimationQueue": {
      "idx": 11,
      "alias": [],
      "alternates": []
    },
    "Ext.Component": {
      "idx": 65,
      "alias": [
        "widget.box",
        "widget.component"
      ],
      "alternates": [
        "Ext.AbstractComponent"
      ]
    },
    "Ext.ComponentLoader": {
      "idx": 282,
      "alias": [],
      "alternates": []
    },
    "Ext.ComponentManager": {
      "idx": 12,
      "alias": [],
      "alternates": [
        "Ext.ComponentMgr"
      ]
    },
    "Ext.ComponentQuery": {
      "idx": 15,
      "alias": [],
      "alternates": []
    },
    "Ext.Editor": {
      "idx": 290,
      "alias": [
        "widget.editor"
      ],
      "alternates": []
    },
    "Ext.ElementLoader": {
      "idx": 281,
      "alias": [],
      "alternates": []
    },
    "Ext.EventManager": {
      "idx": 291,
      "alias": [],
      "alternates": []
    },
    "Ext.Evented": {
      "idx": 16,
      "alias": [],
      "alternates": [
        "Ext.EventedBase"
      ]
    },
    "Ext.FocusManager": {
      "idx": 294,
      "alias": [],
      "alternates": [
        "Ext.FocusMgr"
      ]
    },
    "Ext.GlobalEvents": {
      "idx": 48,
      "alias": [],
      "alternates": [
        "Ext.globalEvents"
      ]
    },
    "Ext.Img": {
      "idx": 295,
      "alias": [
        "widget.image",
        "widget.imagecomponent"
      ],
      "alternates": []
    },
    "Ext.LoadMask": {
      "idx": 297,
      "alias": [
        "widget.loadmask"
      ],
      "alternates": []
    },
    "Ext.Mixin": {
      "idx": 3,
      "alias": [],
      "alternates": []
    },
    "Ext.ProgressBar": {
      "idx": 301,
      "alias": [
        "widget.progressbar"
      ],
      "alternates": []
    },
    "Ext.ProgressBarWidget": {
      "idx": 302,
      "alias": [
        "widget.progressbarwidget"
      ],
      "alternates": []
    },
    "Ext.Shadow": {
      "idx": 304,
      "alias": [],
      "alternates": []
    },
    "Ext.ShadowPool": {
      "idx": 303,
      "alias": [],
      "alternates": []
    },
    "Ext.TaskQueue": {
      "idx": 50,
      "alias": [],
      "alternates": []
    },
    "Ext.Template": {
      "idx": 52,
      "alias": [],
      "alternates": []
    },
    "Ext.Widget": {
      "idx": 55,
      "alias": [
        "widget.widget"
      ],
      "alternates": []
    },
    "Ext.XTemplate": {
      "idx": 88,
      "alias": [],
      "alternates": []
    },
    "Ext.ZIndexManager": {
      "idx": 287,
      "alias": [],
      "alternates": [
        "Ext.WindowGroup"
      ]
    },
    "Ext.app.Application": {
      "idx": 354,
      "alias": [],
      "alternates": []
    },
    "Ext.app.BaseController": {
      "idx": 309,
      "alias": [],
      "alternates": []
    },
    "Ext.app.Controller": {
      "idx": 316,
      "alias": [],
      "alternates": []
    },
    "Ext.app.EventBus": {
      "idx": 307,
      "alias": [],
      "alternates": []
    },
    "Ext.app.EventDomain": {
      "idx": 305,
      "alias": [],
      "alternates": []
    },
    "Ext.app.Util": {
      "idx": 310,
      "alias": [],
      "alternates": []
    },
    "Ext.app.ViewController": {
      "idx": 356,
      "alias": [],
      "alternates": []
    },
    "Ext.app.ViewModel": {
      "idx": 125,
      "alias": [
        "viewmodel.default"
      ],
      "alternates": []
    },
    "Ext.app.bind.AbstractStub": {
      "idx": 114,
      "alias": [],
      "alternates": []
    },
    "Ext.app.bind.BaseBinding": {
      "idx": 112,
      "alias": [],
      "alternates": []
    },
    "Ext.app.bind.Binding": {
      "idx": 113,
      "alias": [],
      "alternates": []
    },
    "Ext.app.bind.Formula": {
      "idx": 119,
      "alias": [],
      "alternates": []
    },
    "Ext.app.bind.LinkStub": {
      "idx": 116,
      "alias": [],
      "alternates": []
    },
    "Ext.app.bind.Multi": {
      "idx": 118,
      "alias": [],
      "alternates": []
    },
    "Ext.app.bind.RootStub": {
      "idx": 117,
      "alias": [],
      "alternates": []
    },
    "Ext.app.bind.Stub": {
      "idx": 115,
      "alias": [],
      "alternates": []
    },
    "Ext.app.bind.Template": {
      "idx": 120,
      "alias": [],
      "alternates": []
    },
    "Ext.app.bind.TemplateBinding": {
      "idx": 121,
      "alias": [],
      "alternates": []
    },
    "Ext.app.bindinspector.ComponentDetail": {
      "idx": 378,
      "alias": [
        "widget.bindinspector-componentdetail"
      ],
      "alternates": []
    },
    "Ext.app.bindinspector.ComponentList": {
      "idx": 405,
      "alias": [
        "widget.bindinspector-componentlist"
      ],
      "alternates": []
    },
    "Ext.app.bindinspector.Container": {
      "idx": 416,
      "alias": [
        "widget.bindinspector-container"
      ],
      "alternates": []
    },
    "Ext.app.bindinspector.Environment": {
      "idx": 413,
      "alias": [],
      "alternates": []
    },
    "Ext.app.bindinspector.Inspector": {
      "idx": 419,
      "alias": [],
      "alternates": []
    },
    "Ext.app.bindinspector.Util": {
      "idx": 377,
      "alias": [],
      "alternates": []
    },
    "Ext.app.bindinspector.ViewModelDetail": {
      "idx": 414,
      "alias": [
        "widget.bindinspector-viewmodeldetail"
      ],
      "alternates": []
    },
    "Ext.app.bindinspector.noconflict.BaseModel": {
      "idx": 415,
      "alias": [],
      "alternates": []
    },
    "Ext.app.domain.Component": {
      "idx": 306,
      "alias": [],
      "alternates": []
    },
    "Ext.app.domain.Controller": {
      "idx": 420,
      "alias": [],
      "alternates": []
    },
    "Ext.app.domain.Direct": {
      "idx": 421,
      "alias": [],
      "alternates": []
    },
    "Ext.app.domain.Global": {
      "idx": 308,
      "alias": [],
      "alternates": []
    },
    "Ext.app.domain.Store": {
      "idx": 311,
      "alias": [],
      "alternates": []
    },
    "Ext.app.domain.View": {
      "idx": 355,
      "alias": [],
      "alternates": []
    },
    "Ext.app.route.Queue": {
      "idx": 312,
      "alias": [],
      "alternates": []
    },
    "Ext.app.route.Route": {
      "idx": 313,
      "alias": [],
      "alternates": []
    },
    "Ext.app.route.Router": {
      "idx": 315,
      "alias": [],
      "alternates": []
    },
    "Ext.button.Button": {
      "idx": 329,
      "alias": [
        "widget.button"
      ],
      "alternates": [
        "Ext.Button"
      ]
    },
    "Ext.button.Cycle": {
      "idx": 423,
      "alias": [
        "widget.cycle"
      ],
      "alternates": [
        "Ext.CycleButton"
      ]
    },
    "Ext.button.Manager": {
      "idx": 326,
      "alias": [],
      "alternates": [
        "Ext.ButtonToggleManager"
      ]
    },
    "Ext.button.Segmented": {
      "idx": 424,
      "alias": [
        "widget.segmentedbutton"
      ],
      "alternates": []
    },
    "Ext.button.Split": {
      "idx": 422,
      "alias": [
        "widget.splitbutton"
      ],
      "alternates": [
        "Ext.SplitButton"
      ]
    },
    "Ext.container.ButtonGroup": {
      "idx": 426,
      "alias": [
        "widget.buttongroup"
      ],
      "alternates": [
        "Ext.ButtonGroup"
      ]
    },
    "Ext.container.Container": {
      "idx": 288,
      "alias": [
        "widget.container"
      ],
      "alternates": [
        "Ext.Container",
        "Ext.AbstractContainer"
      ]
    },
    "Ext.container.DockingContainer": {
      "idx": 348,
      "alias": [],
      "alternates": []
    },
    "Ext.container.Monitor": {
      "idx": 427,
      "alias": [],
      "alternates": []
    },
    "Ext.container.Viewport": {
      "idx": 430,
      "alias": [
        "widget.viewport"
      ],
      "alternates": [
        "Ext.Viewport"
      ]
    },
    "Ext.dashboard.Column": {
      "idx": 433,
      "alias": [
        "widget.dashboard-column"
      ],
      "alternates": []
    },
    "Ext.dashboard.Dashboard": {
      "idx": 441,
      "alias": [
        "widget.dashboard"
      ],
      "alternates": []
    },
    "Ext.dashboard.DropZone": {
      "idx": 439,
      "alias": [],
      "alternates": []
    },
    "Ext.dashboard.Panel": {
      "idx": 432,
      "alias": [
        "widget.dashboard-panel"
      ],
      "alternates": []
    },
    "Ext.dashboard.Part": {
      "idx": 440,
      "alias": [
        "part.part"
      ],
      "alternates": []
    },
    "Ext.data.AbstractStore": {
      "idx": 122,
      "alias": [],
      "alternates": []
    },
    "Ext.data.ArrayStore": {
      "idx": 161,
      "alias": [
        "store.array"
      ],
      "alternates": [
        "Ext.data.SimpleStore"
      ]
    },
    "Ext.data.Batch": {
      "idx": 103,
      "alias": [],
      "alternates": []
    },
    "Ext.data.BufferedStore": {
      "idx": 163,
      "alias": [
        "store.buffered"
      ],
      "alternates": []
    },
    "Ext.data.ChainedStore": {
      "idx": 124,
      "alias": [
        "store.chained"
      ],
      "alternates": []
    },
    "Ext.data.Connection": {
      "idx": 9,
      "alias": [],
      "alternates": []
    },
    "Ext.data.DirectStore": {
      "idx": 166,
      "alias": [
        "store.direct"
      ],
      "alternates": []
    },
    "Ext.data.Error": {
      "idx": 126,
      "alias": [],
      "alternates": []
    },
    "Ext.data.ErrorCollection": {
      "idx": 127,
      "alias": [],
      "alternates": [
        "Ext.data.Errors"
      ]
    },
    "Ext.data.JsonP": {
      "idx": 167,
      "alias": [],
      "alternates": []
    },
    "Ext.data.JsonPStore": {
      "idx": 169,
      "alias": [
        "store.jsonp"
      ],
      "alternates": []
    },
    "Ext.data.JsonStore": {
      "idx": 170,
      "alias": [
        "store.json"
      ],
      "alternates": []
    },
    "Ext.data.LocalStore": {
      "idx": 123,
      "alias": [],
      "alternates": []
    },
    "Ext.data.Model": {
      "idx": 143,
      "alias": [],
      "alternates": [
        "Ext.data.Record"
      ]
    },
    "Ext.data.ModelManager": {
      "idx": 171,
      "alias": [],
      "alternates": [
        "Ext.ModelMgr"
      ]
    },
    "Ext.data.NodeInterface": {
      "idx": 172,
      "alias": [],
      "alternates": []
    },
    "Ext.data.NodeStore": {
      "idx": 173,
      "alias": [
        "store.node"
      ],
      "alternates": []
    },
    "Ext.data.PageMap": {
      "idx": 162,
      "alias": [],
      "alternates": []
    },
    "Ext.data.ProxyStore": {
      "idx": 150,
      "alias": [],
      "alternates": []
    },
    "Ext.data.Request": {
      "idx": 174,
      "alias": [],
      "alternates": []
    },
    "Ext.data.ResultSet": {
      "idx": 144,
      "alias": [],
      "alternates": []
    },
    "Ext.data.Session": {
      "idx": 110,
      "alias": [],
      "alternates": []
    },
    "Ext.data.SortTypes": {
      "idx": 133,
      "alias": [],
      "alternates": []
    },
    "Ext.data.Store": {
      "idx": 159,
      "alias": [
        "store.store"
      ],
      "alternates": []
    },
    "Ext.data.StoreManager": {
      "idx": 175,
      "alias": [],
      "alternates": [
        "Ext.StoreMgr",
        "Ext.data.StoreMgr",
        "Ext.StoreManager"
      ]
    },
    "Ext.data.TreeModel": {
      "idx": 177,
      "alias": [],
      "alternates": []
    },
    "Ext.data.TreeStore": {
      "idx": 178,
      "alias": [
        "store.tree"
      ],
      "alternates": []
    },
    "Ext.data.Types": {
      "idx": 179,
      "alias": [],
      "alternates": []
    },
    "Ext.data.Validation": {
      "idx": 180,
      "alias": [],
      "alternates": []
    },
    "Ext.data.XmlStore": {
      "idx": 185,
      "alias": [
        "store.xml"
      ],
      "alternates": []
    },
    "Ext.data.field.Boolean": {
      "idx": 136,
      "alias": [
        "data.field.bool",
        "data.field.boolean"
      ],
      "alternates": []
    },
    "Ext.data.field.Date": {
      "idx": 137,
      "alias": [
        "data.field.date"
      ],
      "alternates": []
    },
    "Ext.data.field.Field": {
      "idx": 135,
      "alias": [
        "data.field.auto"
      ],
      "alternates": [
        "Ext.data.Field"
      ]
    },
    "Ext.data.field.Integer": {
      "idx": 138,
      "alias": [
        "data.field.int",
        "data.field.integer"
      ],
      "alternates": []
    },
    "Ext.data.field.Number": {
      "idx": 139,
      "alias": [
        "data.field.float",
        "data.field.number"
      ],
      "alternates": []
    },
    "Ext.data.field.String": {
      "idx": 140,
      "alias": [
        "data.field.string"
      ],
      "alternates": []
    },
    "Ext.data.flash.BinaryXhr": {
      "idx": 8,
      "alias": [],
      "alternates": []
    },
    "Ext.data.identifier.Generator": {
      "idx": 141,
      "alias": [
        "data.identifier.default"
      ],
      "alternates": []
    },
    "Ext.data.identifier.Negative": {
      "idx": 186,
      "alias": [
        "data.identifier.negative"
      ],
      "alternates": []
    },
    "Ext.data.identifier.Sequential": {
      "idx": 142,
      "alias": [
        "data.identifier.sequential"
      ],
      "alternates": []
    },
    "Ext.data.identifier.Uuid": {
      "idx": 187,
      "alias": [
        "data.identifier.uuid"
      ],
      "alternates": []
    },
    "Ext.data.matrix.Matrix": {
      "idx": 106,
      "alias": [],
      "alternates": []
    },
    "Ext.data.matrix.Side": {
      "idx": 105,
      "alias": [],
      "alternates": []
    },
    "Ext.data.matrix.Slice": {
      "idx": 104,
      "alias": [],
      "alternates": []
    },
    "Ext.data.operation.Create": {
      "idx": 129,
      "alias": [
        "data.operation.create"
      ],
      "alternates": []
    },
    "Ext.data.operation.Destroy": {
      "idx": 130,
      "alias": [
        "data.operation.destroy"
      ],
      "alternates": []
    },
    "Ext.data.operation.Operation": {
      "idx": 128,
      "alias": [],
      "alternates": [
        "Ext.data.Operation"
      ]
    },
    "Ext.data.operation.Read": {
      "idx": 131,
      "alias": [
        "data.operation.read"
      ],
      "alternates": []
    },
    "Ext.data.operation.Update": {
      "idx": 132,
      "alias": [
        "data.operation.update"
      ],
      "alternates": []
    },
    "Ext.data.proxy.Ajax": {
      "idx": 152,
      "alias": [
        "proxy.ajax"
      ],
      "alternates": [
        "Ext.data.HttpProxy",
        "Ext.data.AjaxProxy"
      ]
    },
    "Ext.data.proxy.Client": {
      "idx": 148,
      "alias": [],
      "alternates": [
        "Ext.data.ClientProxy"
      ]
    },
    "Ext.data.proxy.Direct": {
      "idx": 165,
      "alias": [
        "proxy.direct"
      ],
      "alternates": [
        "Ext.data.DirectProxy"
      ]
    },
    "Ext.data.proxy.JsonP": {
      "idx": 168,
      "alias": [
        "proxy.jsonp",
        "proxy.scripttag"
      ],
      "alternates": [
        "Ext.data.ScriptTagProxy"
      ]
    },
    "Ext.data.proxy.LocalStorage": {
      "idx": 189,
      "alias": [
        "proxy.localstorage"
      ],
      "alternates": [
        "Ext.data.LocalStorageProxy"
      ]
    },
    "Ext.data.proxy.Memory": {
      "idx": 149,
      "alias": [
        "proxy.memory"
      ],
      "alternates": [
        "Ext.data.MemoryProxy"
      ]
    },
    "Ext.data.proxy.Proxy": {
      "idx": 147,
      "alias": [
        "proxy.proxy"
      ],
      "alternates": [
        "Ext.data.DataProxy",
        "Ext.data.Proxy"
      ]
    },
    "Ext.data.proxy.Rest": {
      "idx": 190,
      "alias": [
        "proxy.rest"
      ],
      "alternates": [
        "Ext.data.RestProxy"
      ]
    },
    "Ext.data.proxy.Server": {
      "idx": 151,
      "alias": [
        "proxy.server"
      ],
      "alternates": [
        "Ext.data.ServerProxy"
      ]
    },
    "Ext.data.proxy.SessionStorage": {
      "idx": 191,
      "alias": [
        "proxy.sessionstorage"
      ],
      "alternates": [
        "Ext.data.SessionStorageProxy"
      ]
    },
    "Ext.data.proxy.Sql": {
      "idx": 192,
      "alias": [
        "proxy.sql"
      ],
      "alternates": [
        "Ext.data.proxy.SQL"
      ]
    },
    "Ext.data.proxy.WebStorage": {
      "idx": 188,
      "alias": [],
      "alternates": [
        "Ext.data.WebStorageProxy"
      ]
    },
    "Ext.data.reader.Array": {
      "idx": 160,
      "alias": [
        "reader.array"
      ],
      "alternates": [
        "Ext.data.ArrayReader"
      ]
    },
    "Ext.data.reader.Json": {
      "idx": 153,
      "alias": [
        "reader.json"
      ],
      "alternates": [
        "Ext.data.JsonReader"
      ]
    },
    "Ext.data.reader.Reader": {
      "idx": 145,
      "alias": [
        "reader.base"
      ],
      "alternates": [
        "Ext.data.Reader",
        "Ext.data.DataReader"
      ]
    },
    "Ext.data.reader.Xml": {
      "idx": 183,
      "alias": [
        "reader.xml"
      ],
      "alternates": [
        "Ext.data.XmlReader"
      ]
    },
    "Ext.data.schema.Association": {
      "idx": 96,
      "alias": [],
      "alternates": []
    },
    "Ext.data.schema.ManyToMany": {
      "idx": 99,
      "alias": [],
      "alternates": []
    },
    "Ext.data.schema.ManyToOne": {
      "idx": 98,
      "alias": [],
      "alternates": []
    },
    "Ext.data.schema.Namer": {
      "idx": 101,
      "alias": [
        "namer.default"
      ],
      "alternates": []
    },
    "Ext.data.schema.OneToOne": {
      "idx": 97,
      "alias": [],
      "alternates": []
    },
    "Ext.data.schema.Role": {
      "idx": 95,
      "alias": [],
      "alternates": []
    },
    "Ext.data.schema.Schema": {
      "idx": 102,
      "alias": [
        "schema.default"
      ],
      "alternates": []
    },
    "Ext.data.session.BatchVisitor": {
      "idx": 109,
      "alias": [],
      "alternates": []
    },
    "Ext.data.session.ChangesVisitor": {
      "idx": 107,
      "alias": [],
      "alternates": []
    },
    "Ext.data.session.ChildChangesVisitor": {
      "idx": 108,
      "alias": [],
      "alternates": []
    },
    "Ext.data.validator.Bound": {
      "idx": 193,
      "alias": [
        "data.validator.bound"
      ],
      "alternates": []
    },
    "Ext.data.validator.Email": {
      "idx": 195,
      "alias": [
        "data.validator.email"
      ],
      "alternates": []
    },
    "Ext.data.validator.Exclusion": {
      "idx": 197,
      "alias": [
        "data.validator.exclusion"
      ],
      "alternates": []
    },
    "Ext.data.validator.Format": {
      "idx": 194,
      "alias": [
        "data.validator.format"
      ],
      "alternates": []
    },
    "Ext.data.validator.Inclusion": {
      "idx": 198,
      "alias": [
        "data.validator.inclusion"
      ],
      "alternates": []
    },
    "Ext.data.validator.Length": {
      "idx": 199,
      "alias": [
        "data.validator.length"
      ],
      "alternates": []
    },
    "Ext.data.validator.List": {
      "idx": 196,
      "alias": [
        "data.validator.list"
      ],
      "alternates": []
    },
    "Ext.data.validator.Presence": {
      "idx": 200,
      "alias": [
        "data.validator.presence"
      ],
      "alternates": []
    },
    "Ext.data.validator.Range": {
      "idx": 201,
      "alias": [
        "data.validator.range"
      ],
      "alternates": []
    },
    "Ext.data.validator.Validator": {
      "idx": 134,
      "alias": [
        "data.validator.base"
      ],
      "alternates": []
    },
    "Ext.data.writer.Json": {
      "idx": 154,
      "alias": [
        "writer.json"
      ],
      "alternates": [
        "Ext.data.JsonWriter"
      ]
    },
    "Ext.data.writer.Writer": {
      "idx": 146,
      "alias": [
        "writer.base"
      ],
      "alternates": [
        "Ext.data.DataWriter",
        "Ext.data.Writer"
      ]
    },
    "Ext.data.writer.Xml": {
      "idx": 184,
      "alias": [
        "writer.xml"
      ],
      "alternates": [
        "Ext.data.XmlWriter"
      ]
    },
    "Ext.dd.DD": {
      "idx": 340,
      "alias": [],
      "alternates": []
    },
    "Ext.dd.DDProxy": {
      "idx": 341,
      "alias": [],
      "alternates": []
    },
    "Ext.dd.DDTarget": {
      "idx": 388,
      "alias": [],
      "alternates": []
    },
    "Ext.dd.DragDrop": {
      "idx": 339,
      "alias": [],
      "alternates": []
    },
    "Ext.dd.DragDropManager": {
      "idx": 332,
      "alias": [],
      "alternates": [
        "Ext.dd.DragDropMgr",
        "Ext.dd.DDM"
      ]
    },
    "Ext.dd.DragSource": {
      "idx": 343,
      "alias": [],
      "alternates": []
    },
    "Ext.dd.DragTracker": {
      "idx": 384,
      "alias": [],
      "alternates": []
    },
    "Ext.dd.DragZone": {
      "idx": 386,
      "alias": [],
      "alternates": []
    },
    "Ext.dd.DropTarget": {
      "idx": 390,
      "alias": [],
      "alternates": []
    },
    "Ext.dd.DropZone": {
      "idx": 392,
      "alias": [],
      "alternates": []
    },
    "Ext.dd.Registry": {
      "idx": 391,
      "alias": [],
      "alternates": []
    },
    "Ext.dd.ScrollManager": {
      "idx": 389,
      "alias": [],
      "alternates": []
    },
    "Ext.dd.StatusProxy": {
      "idx": 342,
      "alias": [],
      "alternates": []
    },
    "Ext.direct.Event": {
      "idx": 202,
      "alias": [
        "direct.event"
      ],
      "alternates": []
    },
    "Ext.direct.ExceptionEvent": {
      "idx": 204,
      "alias": [
        "direct.exception"
      ],
      "alternates": []
    },
    "Ext.direct.JsonProvider": {
      "idx": 206,
      "alias": [
        "direct.jsonprovider"
      ],
      "alternates": []
    },
    "Ext.direct.Manager": {
      "idx": 164,
      "alias": [],
      "alternates": []
    },
    "Ext.direct.PollingProvider": {
      "idx": 207,
      "alias": [
        "direct.pollingprovider"
      ],
      "alternates": []
    },
    "Ext.direct.Provider": {
      "idx": 205,
      "alias": [
        "direct.provider"
      ],
      "alternates": []
    },
    "Ext.direct.RemotingEvent": {
      "idx": 203,
      "alias": [
        "direct.rpc"
      ],
      "alternates": []
    },
    "Ext.direct.RemotingMethod": {
      "idx": 208,
      "alias": [],
      "alternates": []
    },
    "Ext.direct.RemotingProvider": {
      "idx": 210,
      "alias": [
        "direct.remotingprovider"
      ],
      "alternates": []
    },
    "Ext.direct.Transaction": {
      "idx": 209,
      "alias": [
        "direct.transaction"
      ],
      "alternates": [
        "Ext.Direct.Transaction"
      ]
    },
    "Ext.dom.ButtonElement": {
      "idx": 325,
      "alias": [],
      "alternates": []
    },
    "Ext.dom.CompositeElement": {
      "idx": 57,
      "alias": [],
      "alternates": [
        "Ext.CompositeElement"
      ]
    },
    "Ext.dom.CompositeElementLite": {
      "idx": 20,
      "alias": [],
      "alternates": [
        "Ext.CompositeElementLite"
      ]
    },
    "Ext.dom.Element": {
      "idx": 18,
      "alias": [],
      "alternates": [
        "Ext.Element"
      ]
    },
    "Ext.dom.Fly": {
      "idx": 19,
      "alias": [],
      "alternates": [
        "Ext.dom.Element.Fly"
      ]
    },
    "Ext.dom.GarbageCollector": {
      "idx": 47,
      "alias": [],
      "alternates": []
    },
    "Ext.dom.Helper": {
      "idx": 181,
      "alias": [],
      "alternates": [
        "Ext.DomHelper",
        "Ext.core.DomHelper"
      ]
    },
    "Ext.dom.Layer": {
      "idx": 442,
      "alias": [],
      "alternates": [
        "Ext.Layer"
      ]
    },
    "Ext.dom.Query": {
      "idx": 182,
      "alias": [],
      "alternates": [
        "Ext.core.DomQuery",
        "Ext.DomQuery"
      ]
    },
    "Ext.event.Controller": {
      "idx": 1,
      "alias": [],
      "alternates": []
    },
    "Ext.event.Dispatcher": {
      "idx": 2,
      "alias": [],
      "alternates": []
    },
    "Ext.event.Event": {
      "idx": 82,
      "alias": [],
      "alternates": [
        "Ext.EventObjectImpl"
      ]
    },
    "Ext.event.ListenerStack": {
      "idx": 0,
      "alias": [],
      "alternates": []
    },
    "Ext.event.gesture.DoubleTap": {
      "idx": 69,
      "alias": [],
      "alternates": []
    },
    "Ext.event.gesture.Drag": {
      "idx": 70,
      "alias": [],
      "alternates": []
    },
    "Ext.event.gesture.EdgeSwipe": {
      "idx": 72,
      "alias": [],
      "alternates": []
    },
    "Ext.event.gesture.LongPress": {
      "idx": 73,
      "alias": [],
      "alternates": []
    },
    "Ext.event.gesture.MultiTouch": {
      "idx": 74,
      "alias": [],
      "alternates": []
    },
    "Ext.event.gesture.Pinch": {
      "idx": 75,
      "alias": [],
      "alternates": []
    },
    "Ext.event.gesture.Recognizer": {
      "idx": 67,
      "alias": [],
      "alternates": []
    },
    "Ext.event.gesture.Rotate": {
      "idx": 76,
      "alias": [],
      "alternates": []
    },
    "Ext.event.gesture.SingleTouch": {
      "idx": 68,
      "alias": [],
      "alternates": []
    },
    "Ext.event.gesture.Swipe": {
      "idx": 71,
      "alias": [],
      "alternates": []
    },
    "Ext.event.gesture.Tap": {
      "idx": 77,
      "alias": [],
      "alternates": []
    },
    "Ext.event.publisher.Dom": {
      "idx": 83,
      "alias": [],
      "alternates": []
    },
    "Ext.event.publisher.ElementPaint": {
      "idx": 215,
      "alias": [],
      "alternates": []
    },
    "Ext.event.publisher.ElementSize": {
      "idx": 222,
      "alias": [],
      "alternates": []
    },
    "Ext.event.publisher.Focus": {
      "idx": 85,
      "alias": [],
      "alternates": []
    },
    "Ext.event.publisher.Gesture": {
      "idx": 84,
      "alias": [],
      "alternates": [
        "Ext.event.publisher.TouchGesture"
      ]
    },
    "Ext.event.publisher.Publisher": {
      "idx": 78,
      "alias": [],
      "alternates": []
    },
    "Ext.flash.Component": {
      "idx": 444,
      "alias": [
        "widget.flash"
      ],
      "alternates": [
        "Ext.FlashComponent"
      ]
    },
    "Ext.form.Basic": {
      "idx": 450,
      "alias": [],
      "alternates": [
        "Ext.form.BasicForm"
      ]
    },
    "Ext.form.CheckboxGroup": {
      "idx": 455,
      "alias": [
        "widget.checkboxgroup"
      ],
      "alternates": []
    },
    "Ext.form.CheckboxManager": {
      "idx": 375,
      "alias": [],
      "alternates": []
    },
    "Ext.form.FieldAncestor": {
      "idx": 451,
      "alias": [],
      "alternates": []
    },
    "Ext.form.FieldContainer": {
      "idx": 453,
      "alias": [
        "widget.fieldcontainer"
      ],
      "alternates": []
    },
    "Ext.form.FieldSet": {
      "idx": 456,
      "alias": [
        "widget.fieldset"
      ],
      "alternates": []
    },
    "Ext.form.Label": {
      "idx": 457,
      "alias": [
        "widget.label"
      ],
      "alternates": []
    },
    "Ext.form.Labelable": {
      "idx": 357,
      "alias": [],
      "alternates": []
    },
    "Ext.form.Panel": {
      "idx": 458,
      "alias": [
        "widget.form"
      ],
      "alternates": [
        "Ext.FormPanel",
        "Ext.form.FormPanel"
      ]
    },
    "Ext.form.RadioGroup": {
      "idx": 461,
      "alias": [
        "widget.radiogroup"
      ],
      "alternates": []
    },
    "Ext.form.RadioManager": {
      "idx": 459,
      "alias": [],
      "alternates": []
    },
    "Ext.form.action.Action": {
      "idx": 445,
      "alias": [],
      "alternates": [
        "Ext.form.Action"
      ]
    },
    "Ext.form.action.DirectLoad": {
      "idx": 462,
      "alias": [
        "formaction.directload"
      ],
      "alternates": [
        "Ext.form.Action.DirectLoad"
      ]
    },
    "Ext.form.action.DirectSubmit": {
      "idx": 463,
      "alias": [
        "formaction.directsubmit"
      ],
      "alternates": [
        "Ext.form.Action.DirectSubmit"
      ]
    },
    "Ext.form.action.Load": {
      "idx": 446,
      "alias": [
        "formaction.load"
      ],
      "alternates": [
        "Ext.form.Action.Load"
      ]
    },
    "Ext.form.action.StandardSubmit": {
      "idx": 464,
      "alias": [
        "formaction.standardsubmit"
      ],
      "alternates": []
    },
    "Ext.form.action.Submit": {
      "idx": 447,
      "alias": [
        "formaction.submit"
      ],
      "alternates": [
        "Ext.form.Action.Submit"
      ]
    },
    "Ext.form.field.Base": {
      "idx": 359,
      "alias": [
        "widget.field"
      ],
      "alternates": [
        "Ext.form.Field",
        "Ext.form.BaseField"
      ]
    },
    "Ext.form.field.Checkbox": {
      "idx": 376,
      "alias": [
        "widget.checkbox",
        "widget.checkboxfield"
      ],
      "alternates": [
        "Ext.form.Checkbox"
      ]
    },
    "Ext.form.field.ComboBox": {
      "idx": 474,
      "alias": [
        "widget.combo",
        "widget.combobox"
      ],
      "alternates": [
        "Ext.form.ComboBox"
      ]
    },
    "Ext.form.field.Date": {
      "idx": 477,
      "alias": [
        "widget.datefield"
      ],
      "alternates": [
        "Ext.form.DateField",
        "Ext.form.Date"
      ]
    },
    "Ext.form.field.Display": {
      "idx": 360,
      "alias": [
        "widget.displayfield"
      ],
      "alternates": [
        "Ext.form.DisplayField",
        "Ext.form.Display"
      ]
    },
    "Ext.form.field.Field": {
      "idx": 358,
      "alias": [],
      "alternates": []
    },
    "Ext.form.field.File": {
      "idx": 480,
      "alias": [
        "widget.filefield",
        "widget.fileuploadfield"
      ],
      "alternates": [
        "Ext.form.FileUploadField",
        "Ext.ux.form.FileUploadField",
        "Ext.form.File"
      ]
    },
    "Ext.form.field.FileButton": {
      "idx": 478,
      "alias": [
        "widget.filebutton"
      ],
      "alternates": []
    },
    "Ext.form.field.Hidden": {
      "idx": 481,
      "alias": [
        "widget.hidden",
        "widget.hiddenfield"
      ],
      "alternates": [
        "Ext.form.Hidden"
      ]
    },
    "Ext.form.field.HtmlEditor": {
      "idx": 484,
      "alias": [
        "widget.htmleditor"
      ],
      "alternates": [
        "Ext.form.HtmlEditor"
      ]
    },
    "Ext.form.field.Number": {
      "idx": 470,
      "alias": [
        "widget.numberfield"
      ],
      "alternates": [
        "Ext.form.NumberField",
        "Ext.form.Number"
      ]
    },
    "Ext.form.field.Picker": {
      "idx": 465,
      "alias": [
        "widget.pickerfield"
      ],
      "alternates": [
        "Ext.form.Picker"
      ]
    },
    "Ext.form.field.Radio": {
      "idx": 460,
      "alias": [
        "widget.radio",
        "widget.radiofield"
      ],
      "alternates": [
        "Ext.form.Radio"
      ]
    },
    "Ext.form.field.Spinner": {
      "idx": 469,
      "alias": [
        "widget.spinnerfield"
      ],
      "alternates": [
        "Ext.form.Spinner"
      ]
    },
    "Ext.form.field.Tag": {
      "idx": 485,
      "alias": [
        "widget.tagfield"
      ],
      "alternates": []
    },
    "Ext.form.field.Text": {
      "idx": 404,
      "alias": [
        "widget.textfield"
      ],
      "alternates": [
        "Ext.form.TextField",
        "Ext.form.Text"
      ]
    },
    "Ext.form.field.TextArea": {
      "idx": 448,
      "alias": [
        "widget.textarea",
        "widget.textareafield"
      ],
      "alternates": [
        "Ext.form.TextArea"
      ]
    },
    "Ext.form.field.Time": {
      "idx": 487,
      "alias": [
        "widget.timefield"
      ],
      "alternates": [
        "Ext.form.TimeField",
        "Ext.form.Time"
      ]
    },
    "Ext.form.field.Trigger": {
      "idx": 488,
      "alias": [
        "widget.trigger",
        "widget.triggerfield"
      ],
      "alternates": [
        "Ext.form.TriggerField",
        "Ext.form.TwinTriggerField",
        "Ext.form.Trigger"
      ]
    },
    "Ext.form.field.VTypes": {
      "idx": 402,
      "alias": [],
      "alternates": [
        "Ext.form.VTypes"
      ]
    },
    "Ext.form.trigger.Component": {
      "idx": 479,
      "alias": [
        "trigger.component"
      ],
      "alternates": []
    },
    "Ext.form.trigger.Spinner": {
      "idx": 468,
      "alias": [
        "trigger.spinner"
      ],
      "alternates": []
    },
    "Ext.form.trigger.Trigger": {
      "idx": 403,
      "alias": [
        "trigger.trigger"
      ],
      "alternates": []
    },
    "Ext.fx.Anim": {
      "idx": 45,
      "alias": [],
      "alternates": []
    },
    "Ext.fx.Animation": {
      "idx": 232,
      "alias": [],
      "alternates": []
    },
    "Ext.fx.Animator": {
      "idx": 40,
      "alias": [],
      "alternates": []
    },
    "Ext.fx.CubicBezier": {
      "idx": 41,
      "alias": [],
      "alternates": []
    },
    "Ext.fx.DrawPath": {
      "idx": 43,
      "alias": [],
      "alternates": []
    },
    "Ext.fx.Easing": {
      "idx": 42,
      "alias": [],
      "alternates": []
    },
    "Ext.fx.Manager": {
      "idx": 39,
      "alias": [],
      "alternates": []
    },
    "Ext.fx.PropertyHandler": {
      "idx": 44,
      "alias": [],
      "alternates": []
    },
    "Ext.fx.Queue": {
      "idx": 38,
      "alias": [],
      "alternates": []
    },
    "Ext.fx.Runner": {
      "idx": 235,
      "alias": [],
      "alternates": []
    },
    "Ext.fx.State": {
      "idx": 223,
      "alias": [],
      "alternates": []
    },
    "Ext.fx.animation.Abstract": {
      "idx": 224,
      "alias": [],
      "alternates": []
    },
    "Ext.fx.animation.Cube": {
      "idx": 236,
      "alias": [
        "animation.cube"
      ],
      "alternates": []
    },
    "Ext.fx.animation.Fade": {
      "idx": 227,
      "alias": [
        "animation.fade",
        "animation.fadeIn"
      ],
      "alternates": [
        "Ext.fx.animation.FadeIn"
      ]
    },
    "Ext.fx.animation.FadeOut": {
      "idx": 228,
      "alias": [
        "animation.fadeOut"
      ],
      "alternates": []
    },
    "Ext.fx.animation.Flip": {
      "idx": 229,
      "alias": [
        "animation.flip"
      ],
      "alternates": []
    },
    "Ext.fx.animation.Pop": {
      "idx": 230,
      "alias": [
        "animation.pop",
        "animation.popIn"
      ],
      "alternates": [
        "Ext.fx.animation.PopIn"
      ]
    },
    "Ext.fx.animation.PopOut": {
      "idx": 231,
      "alias": [
        "animation.popOut"
      ],
      "alternates": []
    },
    "Ext.fx.animation.Slide": {
      "idx": 225,
      "alias": [
        "animation.slide",
        "animation.slideIn"
      ],
      "alternates": [
        "Ext.fx.animation.SlideIn"
      ]
    },
    "Ext.fx.animation.SlideOut": {
      "idx": 226,
      "alias": [
        "animation.slideOut"
      ],
      "alternates": []
    },
    "Ext.fx.animation.Wipe": {
      "idx": 237,
      "alias": [],
      "alternates": [
        "Ext.fx.animation.WipeIn"
      ]
    },
    "Ext.fx.animation.WipeOut": {
      "idx": 238,
      "alias": [],
      "alternates": []
    },
    "Ext.fx.easing.Abstract": {
      "idx": 239,
      "alias": [],
      "alternates": []
    },
    "Ext.fx.easing.Bounce": {
      "idx": 240,
      "alias": [],
      "alternates": []
    },
    "Ext.fx.easing.BoundMomentum": {
      "idx": 242,
      "alias": [],
      "alternates": []
    },
    "Ext.fx.easing.EaseIn": {
      "idx": 244,
      "alias": [
        "easing.ease-in"
      ],
      "alternates": []
    },
    "Ext.fx.easing.EaseOut": {
      "idx": 245,
      "alias": [
        "easing.ease-out"
      ],
      "alternates": []
    },
    "Ext.fx.easing.Easing": {
      "idx": 246,
      "alias": [],
      "alternates": []
    },
    "Ext.fx.easing.Linear": {
      "idx": 243,
      "alias": [
        "easing.linear"
      ],
      "alternates": []
    },
    "Ext.fx.easing.Momentum": {
      "idx": 241,
      "alias": [],
      "alternates": []
    },
    "Ext.fx.layout.Card": {
      "idx": 256,
      "alias": [],
      "alternates": []
    },
    "Ext.fx.layout.card.Abstract": {
      "idx": 247,
      "alias": [],
      "alternates": []
    },
    "Ext.fx.layout.card.Cover": {
      "idx": 250,
      "alias": [
        "fx.layout.card.cover"
      ],
      "alternates": []
    },
    "Ext.fx.layout.card.Cube": {
      "idx": 257,
      "alias": [
        "fx.layout.card.cube"
      ],
      "alternates": []
    },
    "Ext.fx.layout.card.Fade": {
      "idx": 252,
      "alias": [
        "fx.layout.card.fade"
      ],
      "alternates": []
    },
    "Ext.fx.layout.card.Flip": {
      "idx": 253,
      "alias": [
        "fx.layout.card.flip"
      ],
      "alternates": []
    },
    "Ext.fx.layout.card.Pop": {
      "idx": 254,
      "alias": [
        "fx.layout.card.pop"
      ],
      "alternates": []
    },
    "Ext.fx.layout.card.Reveal": {
      "idx": 251,
      "alias": [
        "fx.layout.card.reveal"
      ],
      "alternates": []
    },
    "Ext.fx.layout.card.Scroll": {
      "idx": 255,
      "alias": [
        "fx.layout.card.scroll"
      ],
      "alternates": []
    },
    "Ext.fx.layout.card.ScrollCover": {
      "idx": 258,
      "alias": [
        "fx.layout.card.scrollcover"
      ],
      "alternates": []
    },
    "Ext.fx.layout.card.ScrollReveal": {
      "idx": 259,
      "alias": [
        "fx.layout.card.scrollreveal"
      ],
      "alternates": []
    },
    "Ext.fx.layout.card.Slide": {
      "idx": 249,
      "alias": [
        "fx.layout.card.slide"
      ],
      "alternates": []
    },
    "Ext.fx.layout.card.Style": {
      "idx": 248,
      "alias": [],
      "alternates": []
    },
    "Ext.fx.runner.Css": {
      "idx": 233,
      "alias": [],
      "alternates": []
    },
    "Ext.fx.runner.CssAnimation": {
      "idx": 260,
      "alias": [],
      "alternates": []
    },
    "Ext.fx.runner.CssTransition": {
      "idx": 234,
      "alias": [],
      "alternates": []
    },
    "Ext.fx.target.Component": {
      "idx": 37,
      "alias": [],
      "alternates": []
    },
    "Ext.fx.target.CompositeElement": {
      "idx": 33,
      "alias": [],
      "alternates": []
    },
    "Ext.fx.target.CompositeElementCSS": {
      "idx": 34,
      "alias": [],
      "alternates": []
    },
    "Ext.fx.target.CompositeSprite": {
      "idx": 36,
      "alias": [],
      "alternates": []
    },
    "Ext.fx.target.Element": {
      "idx": 31,
      "alias": [],
      "alternates": []
    },
    "Ext.fx.target.ElementCSS": {
      "idx": 32,
      "alias": [],
      "alternates": []
    },
    "Ext.fx.target.Sprite": {
      "idx": 35,
      "alias": [],
      "alternates": []
    },
    "Ext.fx.target.Target": {
      "idx": 30,
      "alias": [],
      "alternates": []
    },
    "Ext.grid.CellContext": {
      "idx": 368,
      "alias": [],
      "alternates": []
    },
    "Ext.grid.CellEditor": {
      "idx": 489,
      "alias": [],
      "alternates": []
    },
    "Ext.grid.ColumnComponentLayout": {
      "idx": 396,
      "alias": [
        "layout.columncomponent"
      ],
      "alternates": []
    },
    "Ext.grid.ColumnLayout": {
      "idx": 382,
      "alias": [
        "layout.gridcolumn"
      ],
      "alternates": []
    },
    "Ext.grid.ColumnManager": {
      "idx": 490,
      "alias": [],
      "alternates": [
        "Ext.grid.ColumnModel"
      ]
    },
    "Ext.grid.NavigationModel": {
      "idx": 399,
      "alias": [
        "view.navigation.grid"
      ],
      "alternates": []
    },
    "Ext.grid.Panel": {
      "idx": 374,
      "alias": [
        "widget.grid",
        "widget.gridpanel"
      ],
      "alternates": [
        "Ext.list.ListView",
        "Ext.ListView",
        "Ext.grid.GridPanel"
      ]
    },
    "Ext.grid.RowEditor": {
      "idx": 492,
      "alias": [
        "widget.roweditor"
      ],
      "alternates": []
    },
    "Ext.grid.RowEditorButtons": {
      "idx": 491,
      "alias": [
        "widget.roweditorbuttons"
      ],
      "alternates": []
    },
    "Ext.grid.Scroller": {
      "idx": 493,
      "alias": [],
      "alternates": []
    },
    "Ext.grid.View": {
      "idx": 373,
      "alias": [
        "widget.gridview"
      ],
      "alternates": []
    },
    "Ext.grid.ViewDropZone": {
      "idx": 495,
      "alias": [],
      "alternates": []
    },
    "Ext.grid.column.Action": {
      "idx": 496,
      "alias": [
        "widget.actioncolumn"
      ],
      "alternates": [
        "Ext.grid.ActionColumn"
      ]
    },
    "Ext.grid.column.Boolean": {
      "idx": 497,
      "alias": [
        "widget.booleancolumn"
      ],
      "alternates": [
        "Ext.grid.BooleanColumn"
      ]
    },
    "Ext.grid.column.Check": {
      "idx": 498,
      "alias": [
        "widget.checkcolumn"
      ],
      "alternates": [
        "Ext.ux.CheckColumn",
        "Ext.grid.column.CheckColumn"
      ]
    },
    "Ext.grid.column.Column": {
      "idx": 397,
      "alias": [
        "widget.gridcolumn"
      ],
      "alternates": [
        "Ext.grid.Column"
      ]
    },
    "Ext.grid.column.Date": {
      "idx": 499,
      "alias": [
        "widget.datecolumn"
      ],
      "alternates": [
        "Ext.grid.DateColumn"
      ]
    },
    "Ext.grid.column.Number": {
      "idx": 500,
      "alias": [
        "widget.numbercolumn"
      ],
      "alternates": [
        "Ext.grid.NumberColumn"
      ]
    },
    "Ext.grid.column.RowNumberer": {
      "idx": 501,
      "alias": [
        "widget.rownumberer"
      ],
      "alternates": [
        "Ext.grid.RowNumberer"
      ]
    },
    "Ext.grid.column.Template": {
      "idx": 502,
      "alias": [
        "widget.templatecolumn"
      ],
      "alternates": [
        "Ext.grid.TemplateColumn"
      ]
    },
    "Ext.grid.column.Widget": {
      "idx": 503,
      "alias": [
        "widget.widgetcolumn"
      ],
      "alternates": []
    },
    "Ext.grid.feature.AbstractSummary": {
      "idx": 505,
      "alias": [
        "feature.abstractsummary"
      ],
      "alternates": []
    },
    "Ext.grid.feature.Feature": {
      "idx": 504,
      "alias": [
        "feature.feature"
      ],
      "alternates": []
    },
    "Ext.grid.feature.GroupStore": {
      "idx": 506,
      "alias": [],
      "alternates": []
    },
    "Ext.grid.feature.Grouping": {
      "idx": 507,
      "alias": [
        "feature.grouping"
      ],
      "alternates": []
    },
    "Ext.grid.feature.GroupingSummary": {
      "idx": 508,
      "alias": [
        "feature.groupingsummary"
      ],
      "alternates": []
    },
    "Ext.grid.feature.RowBody": {
      "idx": 509,
      "alias": [
        "feature.rowbody"
      ],
      "alternates": []
    },
    "Ext.grid.feature.Summary": {
      "idx": 510,
      "alias": [
        "feature.summary"
      ],
      "alternates": []
    },
    "Ext.grid.filters.Filters": {
      "idx": 524,
      "alias": [
        "plugin.gridfilters"
      ],
      "alternates": []
    },
    "Ext.grid.filters.filter.Base": {
      "idx": 516,
      "alias": [],
      "alternates": []
    },
    "Ext.grid.filters.filter.Boolean": {
      "idx": 518,
      "alias": [
        "grid.filter.boolean"
      ],
      "alternates": []
    },
    "Ext.grid.filters.filter.Date": {
      "idx": 520,
      "alias": [
        "grid.filter.date"
      ],
      "alternates": []
    },
    "Ext.grid.filters.filter.List": {
      "idx": 521,
      "alias": [
        "grid.filter.list"
      ],
      "alternates": []
    },
    "Ext.grid.filters.filter.Number": {
      "idx": 522,
      "alias": [
        "grid.filter.number",
        "grid.filter.numeric"
      ],
      "alternates": []
    },
    "Ext.grid.filters.filter.SingleFilter": {
      "idx": 517,
      "alias": [],
      "alternates": []
    },
    "Ext.grid.filters.filter.String": {
      "idx": 523,
      "alias": [
        "grid.filter.string"
      ],
      "alternates": []
    },
    "Ext.grid.filters.filter.TriFilter": {
      "idx": 519,
      "alias": [],
      "alternates": []
    },
    "Ext.grid.header.Container": {
      "idx": 395,
      "alias": [
        "widget.headercontainer"
      ],
      "alternates": []
    },
    "Ext.grid.header.DragZone": {
      "idx": 387,
      "alias": [],
      "alternates": []
    },
    "Ext.grid.header.DropZone": {
      "idx": 393,
      "alias": [],
      "alternates": []
    },
    "Ext.grid.locking.HeaderContainer": {
      "idx": 525,
      "alias": [],
      "alternates": []
    },
    "Ext.grid.locking.Lockable": {
      "idx": 527,
      "alias": [],
      "alternates": [
        "Ext.grid.Lockable"
      ]
    },
    "Ext.grid.locking.View": {
      "idx": 526,
      "alias": [],
      "alternates": [
        "Ext.grid.LockingView"
      ]
    },
    "Ext.grid.plugin.BufferedRenderer": {
      "idx": 528,
      "alias": [
        "plugin.bufferedrenderer"
      ],
      "alternates": []
    },
    "Ext.grid.plugin.CellEditing": {
      "idx": 530,
      "alias": [
        "plugin.cellediting"
      ],
      "alternates": []
    },
    "Ext.grid.plugin.DragDrop": {
      "idx": 531,
      "alias": [
        "plugin.gridviewdragdrop"
      ],
      "alternates": []
    },
    "Ext.grid.plugin.Editing": {
      "idx": 529,
      "alias": [
        "editing.editing"
      ],
      "alternates": []
    },
    "Ext.grid.plugin.HeaderReorderer": {
      "idx": 394,
      "alias": [
        "plugin.gridheaderreorderer"
      ],
      "alternates": []
    },
    "Ext.grid.plugin.HeaderResizer": {
      "idx": 385,
      "alias": [
        "plugin.gridheaderresizer"
      ],
      "alternates": []
    },
    "Ext.grid.plugin.RowEditing": {
      "idx": 532,
      "alias": [
        "plugin.rowediting"
      ],
      "alternates": []
    },
    "Ext.grid.plugin.RowExpander": {
      "idx": 533,
      "alias": [
        "plugin.rowexpander"
      ],
      "alternates": []
    },
    "Ext.grid.property.Grid": {
      "idx": 534,
      "alias": [
        "widget.propertygrid"
      ],
      "alternates": [
        "Ext.grid.PropertyGrid"
      ]
    },
    "Ext.grid.property.HeaderContainer": {
      "idx": 535,
      "alias": [],
      "alternates": [
        "Ext.grid.PropertyColumnModel"
      ]
    },
    "Ext.grid.property.Property": {
      "idx": 536,
      "alias": [],
      "alternates": [
        "Ext.PropGridProperty"
      ]
    },
    "Ext.grid.property.Reader": {
      "idx": 537,
      "alias": [],
      "alternates": []
    },
    "Ext.grid.property.Store": {
      "idx": 538,
      "alias": [],
      "alternates": [
        "Ext.grid.PropertyStore"
      ]
    },
    "Ext.layout.ClassList": {
      "idx": 539,
      "alias": [],
      "alternates": []
    },
    "Ext.layout.Context": {
      "idx": 542,
      "alias": [],
      "alternates": []
    },
    "Ext.layout.ContextItem": {
      "idx": 541,
      "alias": [],
      "alternates": []
    },
    "Ext.layout.Layout": {
      "idx": 284,
      "alias": [],
      "alternates": []
    },
    "Ext.layout.SizeModel": {
      "idx": 283,
      "alias": [],
      "alternates": []
    },
    "Ext.layout.component.Auto": {
      "idx": 299,
      "alias": [
        "layout.autocomponent"
      ],
      "alternates": []
    },
    "Ext.layout.component.Body": {
      "idx": 410,
      "alias": [
        "layout.body"
      ],
      "alternates": []
    },
    "Ext.layout.component.BoundList": {
      "idx": 466,
      "alias": [
        "layout.boundlist"
      ],
      "alternates": []
    },
    "Ext.layout.component.Component": {
      "idx": 298,
      "alias": [],
      "alternates": []
    },
    "Ext.layout.component.Dock": {
      "idx": 346,
      "alias": [
        "layout.dock"
      ],
      "alternates": [
        "Ext.layout.component.AbstractDock"
      ]
    },
    "Ext.layout.component.FieldSet": {
      "idx": 544,
      "alias": [
        "layout.fieldset"
      ],
      "alternates": []
    },
    "Ext.layout.component.ProgressBar": {
      "idx": 300,
      "alias": [
        "layout.progressbar"
      ],
      "alternates": []
    },
    "Ext.layout.component.field.FieldContainer": {
      "idx": 452,
      "alias": [
        "layout.fieldcontainer"
      ],
      "alternates": []
    },
    "Ext.layout.component.field.HtmlEditor": {
      "idx": 483,
      "alias": [
        "layout.htmleditor"
      ],
      "alternates": []
    },
    "Ext.layout.container.Absolute": {
      "idx": 545,
      "alias": [
        "layout.absolute"
      ],
      "alternates": [
        "Ext.layout.AbsoluteLayout"
      ]
    },
    "Ext.layout.container.Accordion": {
      "idx": 546,
      "alias": [
        "layout.accordion"
      ],
      "alternates": [
        "Ext.layout.AccordionLayout"
      ]
    },
    "Ext.layout.container.Anchor": {
      "idx": 431,
      "alias": [
        "layout.anchor"
      ],
      "alternates": [
        "Ext.layout.AnchorLayout"
      ]
    },
    "Ext.layout.container.Auto": {
      "idx": 286,
      "alias": [
        "layout.auto",
        "layout.autocontainer"
      ],
      "alternates": []
    },
    "Ext.layout.container.Border": {
      "idx": 407,
      "alias": [
        "layout.border"
      ],
      "alternates": [
        "Ext.layout.BorderLayout"
      ]
    },
    "Ext.layout.container.Box": {
      "idx": 334,
      "alias": [
        "layout.box"
      ],
      "alternates": [
        "Ext.layout.BoxLayout"
      ]
    },
    "Ext.layout.container.Card": {
      "idx": 408,
      "alias": [
        "layout.card"
      ],
      "alternates": [
        "Ext.layout.CardLayout"
      ]
    },
    "Ext.layout.container.Center": {
      "idx": 547,
      "alias": [
        "layout.center",
        "layout.ux.center"
      ],
      "alternates": [
        "Ext.ux.layout.Center"
      ]
    },
    "Ext.layout.container.CheckboxGroup": {
      "idx": 454,
      "alias": [
        "layout.checkboxgroup"
      ],
      "alternates": []
    },
    "Ext.layout.container.Column": {
      "idx": 434,
      "alias": [
        "layout.column"
      ],
      "alternates": [
        "Ext.layout.ColumnLayout"
      ]
    },
    "Ext.layout.container.ColumnSplitter": {
      "idx": 437,
      "alias": [
        "widget.columnsplitter"
      ],
      "alternates": []
    },
    "Ext.layout.container.ColumnSplitterTracker": {
      "idx": 436,
      "alias": [],
      "alternates": []
    },
    "Ext.layout.container.Container": {
      "idx": 285,
      "alias": [
        "layout.container"
      ],
      "alternates": [
        "Ext.layout.ContainerLayout"
      ]
    },
    "Ext.layout.container.Dashboard": {
      "idx": 438,
      "alias": [
        "layout.dashboard"
      ],
      "alternates": []
    },
    "Ext.layout.container.Editor": {
      "idx": 289,
      "alias": [
        "layout.editor"
      ],
      "alternates": []
    },
    "Ext.layout.container.Fit": {
      "idx": 361,
      "alias": [
        "layout.fit"
      ],
      "alternates": [
        "Ext.layout.FitLayout"
      ]
    },
    "Ext.layout.container.Form": {
      "idx": 548,
      "alias": [
        "layout.form"
      ],
      "alternates": [
        "Ext.layout.FormLayout"
      ]
    },
    "Ext.layout.container.HBox": {
      "idx": 335,
      "alias": [
        "layout.hbox"
      ],
      "alternates": [
        "Ext.layout.HBoxLayout"
      ]
    },
    "Ext.layout.container.SegmentedButton": {
      "idx": 549,
      "alias": [
        "layout.segmentedbutton"
      ],
      "alternates": []
    },
    "Ext.layout.container.Table": {
      "idx": 425,
      "alias": [
        "layout.table"
      ],
      "alternates": [
        "Ext.layout.TableLayout"
      ]
    },
    "Ext.layout.container.VBox": {
      "idx": 336,
      "alias": [
        "layout.vbox"
      ],
      "alternates": [
        "Ext.layout.VBoxLayout"
      ]
    },
    "Ext.layout.container.border.Region": {
      "idx": 66,
      "alias": [],
      "alternates": []
    },
    "Ext.layout.container.boxOverflow.Menu": {
      "idx": 330,
      "alias": [
        "box.overflow.Menu",
        "box.overflow.menu"
      ],
      "alternates": [
        "Ext.layout.boxOverflow.Menu"
      ]
    },
    "Ext.layout.container.boxOverflow.None": {
      "idx": 322,
      "alias": [
        "box.overflow.None",
        "box.overflow.none"
      ],
      "alternates": [
        "Ext.layout.boxOverflow.None"
      ]
    },
    "Ext.layout.container.boxOverflow.Scroller": {
      "idx": 331,
      "alias": [
        "box.overflow.Scroller",
        "box.overflow.scroller"
      ],
      "alternates": [
        "Ext.layout.boxOverflow.Scroller"
      ]
    },
    "Ext.menu.CheckItem": {
      "idx": 512,
      "alias": [
        "widget.menucheckitem"
      ],
      "alternates": []
    },
    "Ext.menu.ColorPicker": {
      "idx": 550,
      "alias": [
        "widget.colormenu"
      ],
      "alternates": []
    },
    "Ext.menu.DatePicker": {
      "idx": 551,
      "alias": [
        "widget.datemenu"
      ],
      "alternates": []
    },
    "Ext.menu.Item": {
      "idx": 511,
      "alias": [
        "widget.menuitem"
      ],
      "alternates": [
        "Ext.menu.TextItem"
      ]
    },
    "Ext.menu.KeyNav": {
      "idx": 513,
      "alias": [],
      "alternates": []
    },
    "Ext.menu.Manager": {
      "idx": 327,
      "alias": [],
      "alternates": [
        "Ext.menu.MenuMgr"
      ]
    },
    "Ext.menu.Menu": {
      "idx": 515,
      "alias": [
        "widget.menu"
      ],
      "alternates": []
    },
    "Ext.menu.Separator": {
      "idx": 514,
      "alias": [
        "widget.menuseparator"
      ],
      "alternates": []
    },
    "Ext.mixin.Bindable": {
      "idx": 54,
      "alias": [],
      "alternates": []
    },
    "Ext.mixin.Factoryable": {
      "idx": 89,
      "alias": [],
      "alternates": []
    },
    "Ext.mixin.Hookable": {
      "idx": 261,
      "alias": [],
      "alternates": []
    },
    "Ext.mixin.Identifiable": {
      "idx": 4,
      "alias": [],
      "alternates": []
    },
    "Ext.mixin.Inheritable": {
      "idx": 53,
      "alias": [],
      "alternates": []
    },
    "Ext.mixin.Mashup": {
      "idx": 262,
      "alias": [],
      "alternates": []
    },
    "Ext.mixin.Observable": {
      "idx": 5,
      "alias": [],
      "alternates": []
    },
    "Ext.mixin.Queryable": {
      "idx": 176,
      "alias": [],
      "alternates": []
    },
    "Ext.mixin.Responsive": {
      "idx": 263,
      "alias": [],
      "alternates": []
    },
    "Ext.mixin.Selectable": {
      "idx": 264,
      "alias": [],
      "alternates": []
    },
    "Ext.mixin.Templatable": {
      "idx": 216,
      "alias": [],
      "alternates": []
    },
    "Ext.mixin.Traversable": {
      "idx": 265,
      "alias": [],
      "alternates": []
    },
    "Ext.overrides.GlobalEvents": {
      "alias": [],
      "alternates": []
    },
    "Ext.overrides.Widget": {
      "alias": [],
      "alternates": []
    },
    "Ext.overrides.app.Application": {
      "alias": [],
      "alternates": []
    },
    "Ext.overrides.dom.Element": {
      "alias": [],
      "alternates": []
    },
    "Ext.overrides.dom.Helper": {
      "alias": [],
      "alternates": []
    },
    "Ext.overrides.event.Event": {
      "alias": [],
      "alternates": []
    },
    "Ext.overrides.event.publisher.Dom": {
      "alias": [],
      "alternates": []
    },
    "Ext.overrides.event.publisher.Gesture": {
      "alias": [],
      "alternates": []
    },
    "Ext.overrides.util.Positionable": {
      "alias": [],
      "alternates": []
    },
    "Ext.panel.Bar": {
      "idx": 317,
      "alias": [],
      "alternates": []
    },
    "Ext.panel.DD": {
      "idx": 345,
      "alias": [],
      "alternates": []
    },
    "Ext.panel.Header": {
      "idx": 320,
      "alias": [
        "widget.header"
      ],
      "alternates": []
    },
    "Ext.panel.Panel": {
      "idx": 349,
      "alias": [
        "widget.panel"
      ],
      "alternates": [
        "Ext.Panel"
      ]
    },
    "Ext.panel.Pinnable": {
      "idx": 552,
      "alias": [],
      "alternates": []
    },
    "Ext.panel.Proxy": {
      "idx": 344,
      "alias": [],
      "alternates": [
        "Ext.dd.PanelProxy"
      ]
    },
    "Ext.panel.Table": {
      "idx": 362,
      "alias": [
        "widget.tablepanel"
      ],
      "alternates": []
    },
    "Ext.panel.Title": {
      "idx": 318,
      "alias": [
        "widget.title"
      ],
      "alternates": []
    },
    "Ext.panel.Tool": {
      "idx": 319,
      "alias": [
        "widget.tool"
      ],
      "alternates": []
    },
    "Ext.perf.Accumulator": {
      "idx": 266,
      "alias": [],
      "alternates": []
    },
    "Ext.perf.Monitor": {
      "idx": 267,
      "alias": [],
      "alternates": [
        "Ext.Perf"
      ]
    },
    "Ext.picker.Color": {
      "idx": 482,
      "alias": [
        "widget.colorpicker"
      ],
      "alternates": [
        "Ext.ColorPalette"
      ]
    },
    "Ext.picker.Date": {
      "idx": 476,
      "alias": [
        "widget.datepicker"
      ],
      "alternates": [
        "Ext.DatePicker"
      ]
    },
    "Ext.picker.Month": {
      "idx": 475,
      "alias": [
        "widget.monthpicker"
      ],
      "alternates": [
        "Ext.MonthPicker"
      ]
    },
    "Ext.picker.Time": {
      "idx": 486,
      "alias": [
        "widget.timepicker"
      ],
      "alternates": []
    },
    "Ext.plugin.Abstract": {
      "idx": 383,
      "alias": [],
      "alternates": [
        "Ext.AbstractPlugin"
      ]
    },
    "Ext.plugin.Manager": {
      "idx": 553,
      "alias": [],
      "alternates": [
        "Ext.PluginManager",
        "Ext.PluginMgr"
      ]
    },
    "Ext.plugin.Responsive": {
      "idx": 428,
      "alias": [
        "plugin.responsive"
      ],
      "alternates": []
    },
    "Ext.plugin.Viewport": {
      "idx": 429,
      "alias": [
        "plugin.viewport"
      ],
      "alternates": []
    },
    "Ext.resizer.BorderSplitter": {
      "idx": 406,
      "alias": [
        "widget.bordersplitter"
      ],
      "alternates": []
    },
    "Ext.resizer.BorderSplitterTracker": {
      "idx": 554,
      "alias": [],
      "alternates": []
    },
    "Ext.resizer.Handle": {
      "idx": 555,
      "alias": [],
      "alternates": []
    },
    "Ext.resizer.ResizeTracker": {
      "idx": 556,
      "alias": [],
      "alternates": []
    },
    "Ext.resizer.Resizer": {
      "idx": 557,
      "alias": [],
      "alternates": [
        "Ext.Resizable"
      ]
    },
    "Ext.resizer.Splitter": {
      "idx": 333,
      "alias": [
        "widget.splitter"
      ],
      "alternates": []
    },
    "Ext.resizer.SplitterTracker": {
      "idx": 435,
      "alias": [],
      "alternates": []
    },
    "Ext.rtl.Component": {
      "alias": [],
      "alternates": []
    },
    "Ext.rtl.button.Button": {
      "alias": [],
      "alternates": []
    },
    "Ext.rtl.button.Segmented": {
      "alias": [],
      "alternates": []
    },
    "Ext.rtl.dd.DD": {
      "alias": [],
      "alternates": []
    },
    "Ext.rtl.dom.Element": {
      "alias": [],
      "alternates": []
    },
    "Ext.rtl.dom.Layer": {
      "alias": [],
      "alternates": []
    },
    "Ext.rtl.event.Event": {
      "alias": [],
      "alternates": []
    },
    "Ext.rtl.form.Labelable": {
      "alias": [],
      "alternates": []
    },
    "Ext.rtl.form.field.File": {
      "alias": [],
      "alternates": []
    },
    "Ext.rtl.form.field.FileButton": {
      "alias": [],
      "alternates": []
    },
    "Ext.rtl.grid.CellEditor": {
      "alias": [],
      "alternates": []
    },
    "Ext.rtl.grid.ColumnLayout": {
      "alias": [],
      "alternates": []
    },
    "Ext.rtl.grid.NavigationModel": {
      "alias": [],
      "alternates": []
    },
    "Ext.rtl.grid.RowEditor": {
      "alias": [],
      "alternates": []
    },
    "Ext.rtl.grid.column.Column": {
      "alias": [],
      "alternates": []
    },
    "Ext.rtl.grid.feature.Summary": {
      "alias": [],
      "alternates": []
    },
    "Ext.rtl.grid.plugin.HeaderResizer": {
      "alias": [],
      "alternates": []
    },
    "Ext.rtl.grid.plugin.RowEditing": {
      "alias": [],
      "alternates": []
    },
    "Ext.rtl.layout.ContextItem": {
      "alias": [],
      "alternates": []
    },
    "Ext.rtl.layout.component.Dock": {
      "alias": [],
      "alternates": []
    },
    "Ext.rtl.layout.container.Absolute": {
      "alias": [],
      "alternates": []
    },
    "Ext.rtl.layout.container.Border": {
      "alias": [],
      "alternates": []
    },
    "Ext.rtl.layout.container.Box": {
      "alias": [],
      "alternates": []
    },
    "Ext.rtl.layout.container.Column": {
      "alias": [],
      "alternates": []
    },
    "Ext.rtl.layout.container.HBox": {
      "alias": [],
      "alternates": []
    },
    "Ext.rtl.layout.container.VBox": {
      "alias": [],
      "alternates": []
    },
    "Ext.rtl.layout.container.boxOverflow.Menu": {
      "alias": [],
      "alternates": []
    },
    "Ext.rtl.layout.container.boxOverflow.Scroller": {
      "alias": [],
      "alternates": []
    },
    "Ext.rtl.panel.Bar": {
      "alias": [],
      "alternates": []
    },
    "Ext.rtl.panel.Panel": {
      "alias": [],
      "alternates": []
    },
    "Ext.rtl.panel.Title": {
      "alias": [],
      "alternates": []
    },
    "Ext.rtl.resizer.BorderSplitterTracker": {
      "alias": [],
      "alternates": []
    },
    "Ext.rtl.resizer.ResizeTracker": {
      "alias": [],
      "alternates": []
    },
    "Ext.rtl.resizer.SplitterTracker": {
      "alias": [],
      "alternates": []
    },
    "Ext.rtl.scroll.Manager": {
      "alias": [],
      "alternates": []
    },
    "Ext.rtl.scroll.Scroller": {
      "alias": [],
      "alternates": []
    },
    "Ext.rtl.selection.CellModel": {
      "alias": [],
      "alternates": []
    },
    "Ext.rtl.selection.TreeModel": {
      "alias": [],
      "alternates": []
    },
    "Ext.rtl.slider.Multi": {
      "alias": [],
      "alternates": []
    },
    "Ext.rtl.tab.Bar": {
      "alias": [],
      "alternates": []
    },
    "Ext.rtl.tip.QuickTipManager": {
      "alias": [],
      "alternates": []
    },
    "Ext.rtl.tree.Column": {
      "alias": [],
      "alternates": []
    },
    "Ext.rtl.util.Floating": {
      "alias": [],
      "alternates": []
    },
    "Ext.rtl.util.FocusableContainer": {
      "alias": [],
      "alternates": []
    },
    "Ext.rtl.util.Renderable": {
      "alias": [],
      "alternates": []
    },
    "Ext.rtl.view.NavigationModel": {
      "alias": [],
      "alternates": []
    },
    "Ext.rtl.view.Table": {
      "alias": [],
      "alternates": []
    },
    "Ext.scroll.Indicator": {
      "idx": 558,
      "alias": [],
      "alternates": []
    },
    "Ext.scroll.Manager": {
      "idx": 559,
      "alias": [],
      "alternates": []
    },
    "Ext.scroll.Scroller": {
      "idx": 275,
      "alias": [],
      "alternates": []
    },
    "Ext.selection.CellModel": {
      "idx": 560,
      "alias": [
        "selection.cellmodel"
      ],
      "alternates": []
    },
    "Ext.selection.CheckboxModel": {
      "idx": 564,
      "alias": [
        "selection.checkboxmodel"
      ],
      "alternates": []
    },
    "Ext.selection.DataViewModel": {
      "idx": 364,
      "alias": [],
      "alternates": []
    },
    "Ext.selection.Model": {
      "idx": 363,
      "alias": [],
      "alternates": [
        "Ext.AbstractSelectionModel"
      ]
    },
    "Ext.selection.RowModel": {
      "idx": 380,
      "alias": [
        "selection.rowmodel"
      ],
      "alternates": []
    },
    "Ext.selection.TreeModel": {
      "idx": 381,
      "alias": [
        "selection.treemodel"
      ],
      "alternates": []
    },
    "Ext.slider.Multi": {
      "idx": 563,
      "alias": [
        "widget.multislider"
      ],
      "alternates": [
        "Ext.slider.MultiSlider"
      ]
    },
    "Ext.slider.Single": {
      "idx": 565,
      "alias": [
        "widget.slider",
        "widget.sliderfield"
      ],
      "alternates": [
        "Ext.Slider",
        "Ext.form.SliderField",
        "Ext.slider.SingleSlider",
        "Ext.slider.Slider"
      ]
    },
    "Ext.slider.Thumb": {
      "idx": 561,
      "alias": [],
      "alternates": []
    },
    "Ext.slider.Tip": {
      "idx": 562,
      "alias": [
        "widget.slidertip"
      ],
      "alternates": []
    },
    "Ext.slider.Widget": {
      "idx": 566,
      "alias": [
        "widget.sliderwidget"
      ],
      "alternates": []
    },
    "Ext.sparkline.Bar": {
      "idx": 574,
      "alias": [
        "widget.sparklinebar"
      ],
      "alternates": []
    },
    "Ext.sparkline.BarBase": {
      "idx": 572,
      "alias": [],
      "alternates": []
    },
    "Ext.sparkline.Base": {
      "idx": 571,
      "alias": [],
      "alternates": []
    },
    "Ext.sparkline.Box": {
      "idx": 575,
      "alias": [
        "widget.sparklinebox"
      ],
      "alternates": []
    },
    "Ext.sparkline.Bullet": {
      "idx": 576,
      "alias": [
        "widget.sparklinebullet"
      ],
      "alternates": []
    },
    "Ext.sparkline.CanvasBase": {
      "idx": 568,
      "alias": [],
      "alternates": []
    },
    "Ext.sparkline.CanvasCanvas": {
      "idx": 569,
      "alias": [],
      "alternates": []
    },
    "Ext.sparkline.Discrete": {
      "idx": 577,
      "alias": [
        "widget.sparklinediscrete"
      ],
      "alternates": []
    },
    "Ext.sparkline.Line": {
      "idx": 578,
      "alias": [
        "widget.sparklineline"
      ],
      "alternates": []
    },
    "Ext.sparkline.Pie": {
      "idx": 579,
      "alias": [
        "widget.sparklinepie"
      ],
      "alternates": []
    },
    "Ext.sparkline.RangeMap": {
      "idx": 573,
      "alias": [],
      "alternates": []
    },
    "Ext.sparkline.Shape": {
      "idx": 567,
      "alias": [],
      "alternates": []
    },
    "Ext.sparkline.TriState": {
      "idx": 580,
      "alias": [
        "widget.sparklinetristate"
      ],
      "alternates": []
    },
    "Ext.sparkline.VmlCanvas": {
      "idx": 570,
      "alias": [],
      "alternates": []
    },
    "Ext.state.CookieProvider": {
      "idx": 581,
      "alias": [],
      "alternates": []
    },
    "Ext.state.LocalStorageProvider": {
      "idx": 582,
      "alias": [
        "state.localstorage"
      ],
      "alternates": []
    },
    "Ext.state.Manager": {
      "idx": 61,
      "alias": [],
      "alternates": []
    },
    "Ext.state.Provider": {
      "idx": 60,
      "alias": [],
      "alternates": []
    },
    "Ext.state.Stateful": {
      "idx": 62,
      "alias": [],
      "alternates": []
    },
    "Ext.tab.Bar": {
      "idx": 411,
      "alias": [
        "widget.tabbar"
      ],
      "alternates": []
    },
    "Ext.tab.Panel": {
      "idx": 412,
      "alias": [
        "widget.tabpanel"
      ],
      "alternates": [
        "Ext.TabPanel"
      ]
    },
    "Ext.tab.Tab": {
      "idx": 409,
      "alias": [
        "widget.tab"
      ],
      "alternates": []
    },
    "Ext.tip.QuickTip": {
      "idx": 352,
      "alias": [
        "widget.quicktip"
      ],
      "alternates": [
        "Ext.QuickTip"
      ]
    },
    "Ext.tip.QuickTipManager": {
      "idx": 353,
      "alias": [],
      "alternates": [
        "Ext.QuickTips"
      ]
    },
    "Ext.tip.Tip": {
      "idx": 350,
      "alias": [
        "widget.tip"
      ],
      "alternates": [
        "Ext.Tip"
      ]
    },
    "Ext.tip.ToolTip": {
      "idx": 351,
      "alias": [
        "widget.tooltip"
      ],
      "alternates": [
        "Ext.ToolTip"
      ]
    },
    "Ext.toolbar.Breadcrumb": {
      "idx": 583,
      "alias": [
        "widget.breadcrumb"
      ],
      "alternates": []
    },
    "Ext.toolbar.Fill": {
      "idx": 321,
      "alias": [
        "widget.tbfill"
      ],
      "alternates": [
        "Ext.Toolbar.Fill"
      ]
    },
    "Ext.toolbar.Item": {
      "idx": 323,
      "alias": [
        "widget.tbitem"
      ],
      "alternates": [
        "Ext.Toolbar.Item"
      ]
    },
    "Ext.toolbar.Paging": {
      "idx": 471,
      "alias": [
        "widget.pagingtoolbar"
      ],
      "alternates": [
        "Ext.PagingToolbar"
      ]
    },
    "Ext.toolbar.Separator": {
      "idx": 324,
      "alias": [
        "widget.tbseparator"
      ],
      "alternates": [
        "Ext.Toolbar.Separator"
      ]
    },
    "Ext.toolbar.Spacer": {
      "idx": 584,
      "alias": [
        "widget.tbspacer"
      ],
      "alternates": [
        "Ext.Toolbar.Spacer"
      ]
    },
    "Ext.toolbar.TextItem": {
      "idx": 467,
      "alias": [
        "widget.tbtext"
      ],
      "alternates": [
        "Ext.Toolbar.TextItem"
      ]
    },
    "Ext.toolbar.Toolbar": {
      "idx": 338,
      "alias": [
        "widget.toolbar"
      ],
      "alternates": [
        "Ext.Toolbar"
      ]
    },
    "Ext.tree.Column": {
      "idx": 398,
      "alias": [
        "widget.treecolumn"
      ],
      "alternates": []
    },
    "Ext.tree.NavigationModel": {
      "idx": 400,
      "alias": [
        "view.navigation.tree"
      ],
      "alternates": []
    },
    "Ext.tree.Panel": {
      "idx": 401,
      "alias": [
        "widget.treepanel"
      ],
      "alternates": [
        "Ext.tree.TreePanel",
        "Ext.TreePanel"
      ]
    },
    "Ext.tree.View": {
      "idx": 379,
      "alias": [
        "widget.treeview"
      ],
      "alternates": []
    },
    "Ext.tree.ViewDragZone": {
      "idx": 586,
      "alias": [],
      "alternates": []
    },
    "Ext.tree.ViewDropZone": {
      "idx": 587,
      "alias": [],
      "alternates": []
    },
    "Ext.tree.plugin.TreeViewDragDrop": {
      "idx": 588,
      "alias": [
        "plugin.treeviewdragdrop"
      ],
      "alternates": []
    },
    "Ext.util.AbstractMixedCollection": {
      "idx": 25,
      "alias": [],
      "alternates": []
    },
    "Ext.util.Animate": {
      "idx": 46,
      "alias": [],
      "alternates": []
    },
    "Ext.util.Base64": {
      "idx": 276,
      "alias": [],
      "alternates": []
    },
    "Ext.util.CSS": {
      "idx": 369,
      "alias": [],
      "alternates": []
    },
    "Ext.util.ClickRepeater": {
      "idx": 328,
      "alias": [],
      "alternates": []
    },
    "Ext.util.Collection": {
      "idx": 92,
      "alias": [],
      "alternates": []
    },
    "Ext.util.CollectionKey": {
      "idx": 90,
      "alias": [],
      "alternates": []
    },
    "Ext.util.ComponentDragger": {
      "idx": 417,
      "alias": [],
      "alternates": []
    },
    "Ext.util.Cookies": {
      "idx": 589,
      "alias": [],
      "alternates": []
    },
    "Ext.util.ElementContainer": {
      "idx": 58,
      "alias": [],
      "alternates": []
    },
    "Ext.util.Event": {
      "idx": 23,
      "alias": [],
      "alternates": []
    },
    "Ext.util.Filter": {
      "idx": 21,
      "alias": [],
      "alternates": []
    },
    "Ext.util.FilterCollection": {
      "idx": 157,
      "alias": [],
      "alternates": []
    },
    "Ext.util.Floating": {
      "idx": 63,
      "alias": [],
      "alternates": []
    },
    "Ext.util.Focusable": {
      "idx": 64,
      "alias": [],
      "alternates": []
    },
    "Ext.util.FocusableContainer": {
      "idx": 337,
      "alias": [],
      "alternates": []
    },
    "Ext.util.Format": {
      "idx": 51,
      "alias": [],
      "alternates": []
    },
    "Ext.util.Group": {
      "idx": 155,
      "alias": [],
      "alternates": []
    },
    "Ext.util.GroupCollection": {
      "idx": 158,
      "alias": [],
      "alternates": []
    },
    "Ext.util.Grouper": {
      "idx": 91,
      "alias": [],
      "alternates": []
    },
    "Ext.util.HashMap": {
      "idx": 6,
      "alias": [],
      "alternates": []
    },
    "Ext.util.History": {
      "idx": 314,
      "alias": [],
      "alternates": [
        "Ext.History"
      ]
    },
    "Ext.util.Inflector": {
      "idx": 100,
      "alias": [],
      "alternates": []
    },
    "Ext.util.KeyMap": {
      "idx": 292,
      "alias": [],
      "alternates": [
        "Ext.KeyMap"
      ]
    },
    "Ext.util.KeyNav": {
      "idx": 293,
      "alias": [],
      "alternates": [
        "Ext.KeyNav"
      ]
    },
    "Ext.util.LocalStorage": {
      "idx": 277,
      "alias": [],
      "alternates": []
    },
    "Ext.util.LruCache": {
      "idx": 14,
      "alias": [],
      "alternates": []
    },
    "Ext.util.Memento": {
      "idx": 347,
      "alias": [],
      "alternates": []
    },
    "Ext.util.MixedCollection": {
      "idx": 28,
      "alias": [],
      "alternates": []
    },
    "Ext.util.ObjectTemplate": {
      "idx": 94,
      "alias": [],
      "alternates": []
    },
    "Ext.util.Observable": {
      "idx": 24,
      "alias": [],
      "alternates": []
    },
    "Ext.util.Offset": {
      "idx": 79,
      "alias": [],
      "alternates": []
    },
    "Ext.util.PaintMonitor": {
      "idx": 214,
      "alias": [],
      "alternates": []
    },
    "Ext.util.Point": {
      "idx": 81,
      "alias": [],
      "alternates": []
    },
    "Ext.util.Positionable": {
      "idx": 17,
      "alias": [],
      "alternates": []
    },
    "Ext.util.ProtoElement": {
      "idx": 56,
      "alias": [],
      "alternates": []
    },
    "Ext.util.Queue": {
      "idx": 540,
      "alias": [],
      "alternates": []
    },
    "Ext.util.Region": {
      "idx": 80,
      "alias": [],
      "alternates": []
    },
    "Ext.util.Renderable": {
      "idx": 59,
      "alias": [],
      "alternates": []
    },
    "Ext.util.Schedulable": {
      "idx": 111,
      "alias": [],
      "alternates": []
    },
    "Ext.util.Scheduler": {
      "idx": 93,
      "alias": [],
      "alternates": []
    },
    "Ext.util.SizeMonitor": {
      "idx": 221,
      "alias": [],
      "alternates": []
    },
    "Ext.util.Sortable": {
      "idx": 27,
      "alias": [],
      "alternates": []
    },
    "Ext.util.Sorter": {
      "idx": 26,
      "alias": [],
      "alternates": []
    },
    "Ext.util.SorterCollection": {
      "idx": 156,
      "alias": [],
      "alternates": []
    },
    "Ext.util.StoreHolder": {
      "idx": 296,
      "alias": [],
      "alternates": []
    },
    "Ext.util.TaskManager": {
      "idx": 278,
      "alias": [],
      "alternates": [
        "Ext.TaskManager"
      ]
    },
    "Ext.util.TaskRunner": {
      "idx": 29,
      "alias": [],
      "alternates": []
    },
    "Ext.util.TextMetrics": {
      "idx": 279,
      "alias": [],
      "alternates": []
    },
    "Ext.util.Translatable": {
      "idx": 274,
      "alias": [],
      "alternates": []
    },
    "Ext.util.XTemplateCompiler": {
      "idx": 87,
      "alias": [],
      "alternates": []
    },
    "Ext.util.XTemplateParser": {
      "idx": 86,
      "alias": [],
      "alternates": []
    },
    "Ext.util.paintmonitor.Abstract": {
      "idx": 211,
      "alias": [],
      "alternates": []
    },
    "Ext.util.paintmonitor.CssAnimation": {
      "idx": 212,
      "alias": [],
      "alternates": []
    },
    "Ext.util.paintmonitor.OverflowChange": {
      "idx": 213,
      "alias": [],
      "alternates": []
    },
    "Ext.util.sizemonitor.Abstract": {
      "idx": 217,
      "alias": [],
      "alternates": []
    },
    "Ext.util.sizemonitor.Default": {
      "idx": 218,
      "alias": [],
      "alternates": []
    },
    "Ext.util.sizemonitor.OverflowChange": {
      "idx": 220,
      "alias": [],
      "alternates": []
    },
    "Ext.util.sizemonitor.Scroll": {
      "idx": 219,
      "alias": [],
      "alternates": []
    },
    "Ext.util.translatable.Abstract": {
      "idx": 268,
      "alias": [],
      "alternates": []
    },
    "Ext.util.translatable.CssPosition": {
      "idx": 273,
      "alias": [],
      "alternates": []
    },
    "Ext.util.translatable.CssTransform": {
      "idx": 270,
      "alias": [],
      "alternates": []
    },
    "Ext.util.translatable.Dom": {
      "idx": 269,
      "alias": [],
      "alternates": []
    },
    "Ext.util.translatable.ScrollParent": {
      "idx": 272,
      "alias": [],
      "alternates": []
    },
    "Ext.util.translatable.ScrollPosition": {
      "idx": 271,
      "alias": [],
      "alternates": []
    },
    "Ext.view.AbstractView": {
      "idx": 366,
      "alias": [],
      "alternates": []
    },
    "Ext.view.BoundList": {
      "idx": 472,
      "alias": [
        "widget.boundlist"
      ],
      "alternates": [
        "Ext.BoundList"
      ]
    },
    "Ext.view.BoundListKeyNav": {
      "idx": 473,
      "alias": [
        "view.navigation.boundlist"
      ],
      "alternates": []
    },
    "Ext.view.DragZone": {
      "idx": 585,
      "alias": [],
      "alternates": []
    },
    "Ext.view.DropZone": {
      "idx": 494,
      "alias": [],
      "alternates": []
    },
    "Ext.view.MultiSelector": {
      "idx": 591,
      "alias": [
        "widget.multiselector"
      ],
      "alternates": []
    },
    "Ext.view.MultiSelectorSearch": {
      "idx": 590,
      "alias": [
        "widget.multiselector-search"
      ],
      "alternates": []
    },
    "Ext.view.NavigationModel": {
      "idx": 365,
      "alias": [
        "view.navigation.default"
      ],
      "alternates": []
    },
    "Ext.view.NodeCache": {
      "idx": 371,
      "alias": [],
      "alternates": []
    },
    "Ext.view.Table": {
      "idx": 372,
      "alias": [
        "widget.tableview"
      ],
      "alternates": []
    },
    "Ext.view.TableLayout": {
      "idx": 370,
      "alias": [
        "layout.tableview"
      ],
      "alternates": []
    },
    "Ext.view.View": {
      "idx": 367,
      "alias": [
        "widget.dataview"
      ],
      "alternates": [
        "Ext.DataView"
      ]
    },
    "Ext.window.MessageBox": {
      "idx": 449,
      "alias": [
        "widget.messagebox"
      ],
      "alternates": []
    },
    "Ext.window.Toast": {
      "idx": 592,
      "alias": [
        "widget.toast"
      ],
      "alternates": []
    },
    "Ext.window.Window": {
      "idx": 418,
      "alias": [
        "widget.window"
      ],
      "alternates": [
        "Ext.Window"
      ]
    }
  },
  "packages": {
    "ext": {
      "creator": "Sencha",
      "requires": [
        "sencha-core",
        "ext",
        "ext",
        "ext",
        "ext"
      ],
      "type": "framework",
      "version": "5.0.1.1255"
    },
    "sencha-core": {
      "creator": "Sencha",
      "output": "${package.dir}/build",
      "requires": [],
      "slicer": {
        "js": []
      },
      "type": "code",
      "version": "5.0.0"
    }
  },
  "bootRelative": true
});


var Ext = Ext || {};

Ext._startTime = Date.now ? Date.now() : (+ new Date());
(function() {
    var global = this,
        objectPrototype = Object.prototype,
        toString = objectPrototype.toString,
        enumerables = [
                       'valueOf', 'toLocaleString', 'toString', 'constructor'],
        emptyFn = function () {},
        privateFn = function () {},
        identityFn = function(o) { return o; },
        
        
        callOverrideParent = function () {
            var method = callOverrideParent.caller.caller; 
            return method.$owner.prototype[method.$name].apply(this, arguments);
        },
        manifest = Ext.manifest || {},
        i,
        iterableRe = /\[object\s*(?:Array|Arguments|\w*Collection|\w*List|HTML\s+document\.all\s+class)\]/,
        MSDateRe = /^\\?\/Date\(([-+])?(\d+)(?:[+-]\d{4})?\)\\?\/$/;

    Ext.global = global;

    
    emptyFn.$nullFn = identityFn.$nullFn = emptyFn.$emptyFn = identityFn.$identityFn =
        privateFn.$nullFn = true;
    privateFn.$privacy = 'framework';

    
    
    Ext['suspendLayouts'] = Ext['resumeLayouts'] = emptyFn;

    for (i in { toString: 1 }) {
        enumerables = null;
    }

    
    Ext.enumerables = enumerables;

    
    Ext.apply = function(object, config, defaults) {
        if (defaults) {
            Ext.apply(object, defaults);
        }

        if (object && config && typeof config === 'object') {
            var i, j, k;

            for (i in config) {
                object[i] = config[i];
            }

            if (enumerables) {
                for (j = enumerables.length; j--;) {
                    k = enumerables[j];
                    if (config.hasOwnProperty(k)) {
                        object[k] = config[k];
                    }
                }
            }
        }

        return object;
    };

    Ext.buildSettings = Ext.apply({
        baseCSSPrefix: 'x-'
    }, Ext.buildSettings || {});

    Ext.apply(Ext, {
        
        idSeed: 0,

        
        idPrefix: 'ext-',

        
        isSecure: /^https/i.test(window.location.protocol),

        
        enableGarbageCollector: false,

        
        enableListenerCollection: true,

        
        name: Ext.sandboxName || 'Ext',

        
        privateFn: privateFn,

        
        emptyFn: emptyFn,

        
        identityFn: identityFn,

        
        frameStartTime: +new Date(),

        
        manifest: manifest,

        
        debugConfig: Ext.debugConfig || manifest.debug || {
            hooks: {
                '*': true
            }
        },

        
        validIdRe: /^[a-z_][a-z0-9\-_]*$/i,

        
        makeIdSelector: function(id) {
            if (!Ext.validIdRe.test(id)) {
                Ext.Error.raise('Invalid id selector: "' + id + '"');
            }
            return '#' + id;
        },

        
        id: function(o, prefix) {
            if (o && o.id) {
                return o.id;
            }

            var id = (prefix || Ext.idPrefix) + (++Ext.idSeed);
            
            if (o) {
                o.id = id;
            }

            return id;
        },

        
        returnId: function(o) {
            return o.getId();
        },

        
        returnTrue: function() {
            return true;
        },

        
        emptyString: new String(),

        
        baseCSSPrefix: Ext.buildSettings.baseCSSPrefix,

        
        $eventNameMap: {},

        
        applyIf: function(object, config) {
            var property;

            if (object) {
                for (property in config) {
                    if (object[property] === undefined) {
                        object[property] = config[property];
                    }
                }
            }

            return object;
        },

        
        now: (global.performance && global.performance.now) ? function() {
            return performance.now();
        } : (Date.now || (Date.now = function() {
            return +new Date();
        })),

        
        destroy: function() {
            var ln = arguments.length,
            i, arg;

            for (i = 0; i < ln; i++) {
                arg = arguments[i];
                if (arg) {
                    if (Ext.isArray(arg)) {
                        this.destroy.apply(this, arg);
                    } else if (Ext.isFunction(arg.destroy)) {
                        arg.destroy();
                    }
                }
            }
            return null;
        },

        
        destroyMembers: function (object) {
            for (var ref, name, i = 1, a = arguments, len = a.length; i < len; i++) {
                ref = object[name = a[i]];

                
                if (ref != null) {
                    object[name] = Ext.destroy(ref);
                }
            }
        },

        
        override: function (target, overrides) {
            if (target.$isClass) {
                target.override(overrides);
            } else if (typeof target == 'function') {
                Ext.apply(target.prototype, overrides);
            } else {
                var owner = target.self,
                    name, value;

                if (owner && owner.$isClass) { 
                    for (name in overrides) {
                        if (overrides.hasOwnProperty(name)) {
                            value = overrides[name];

                            if (typeof value === 'function') {
                                if (owner.$className) {
                                    value.displayName = owner.$className + '#' + name;
                                }

                                value.$name = name;
                                value.$owner = owner;
                                value.$previous = target.hasOwnProperty(name)
                                    ? target[name] 
                                    : callOverrideParent; 
                            }

                            target[name] = value;
                        }
                    }
                } else {
                    Ext.apply(target, overrides);
                }
            }

            return target;
        },

        
        valueFrom: function(value, defaultValue, allowBlank){
            return Ext.isEmpty(value, allowBlank) ? defaultValue : value;
        },

        
        isEmpty: function(value, allowEmptyString) {
            return (value == null) || (!allowEmptyString ? value === '' : false) || (Ext.isArray(value) && value.length === 0);
        },

        
        isArray: ('isArray' in Array) ? Array.isArray : function(value) {
            return toString.call(value) === '[object Array]';
        },

        
        isDate: function(value) {
            return toString.call(value) === '[object Date]';
        },

        
        isMSDate: function(value) {
            if (!Ext.isString(value)) {
                return false;
            }
            return MSDateRe.test(value);
        },

        
        isObject: (toString.call(null) === '[object Object]') ?
        function(value) {
            
            return value !== null && value !== undefined && toString.call(value) === '[object Object]' && value.ownerDocument === undefined;
        } :
        function(value) {
            return toString.call(value) === '[object Object]';
        },

        
        isSimpleObject: function(value) {
            return value instanceof Object && value.constructor === Object;
        },

        
        isPrimitive: function(value) {
            var type = typeof value;

            return type === 'string' || type === 'number' || type === 'boolean';
        },

        
        isFunction:
        
        
        (typeof document !== 'undefined' && typeof document.getElementsByTagName('body') === 'function') ? function(value) {
            return !!value && toString.call(value) === '[object Function]';
        } : function(value) {
            return !!value && typeof value === 'function';
        },

        
        isNumber: function(value) {
            return typeof value === 'number' && isFinite(value);
        },

        
        isNumeric: function(value) {
            return !isNaN(parseFloat(value)) && isFinite(value);
        },

        
        isString: function(value) {
            return typeof value === 'string';
        },

        
        isBoolean: function(value) {
            return typeof value === 'boolean';
        },

        
        isElement: function(value) {
            return value ? value.nodeType === 1 : false;
        },

        
        isTextNode: function(value) {
            return value ? value.nodeName === "#text" : false;
        },

        
        isDefined: function(value) {
            return typeof value !== 'undefined';
        },

        
        isIterable: function(value) {
            
            if (!value || typeof value.length !== 'number' || typeof value === 'string' || Ext.isFunction(value)) {
                return false;
            }

            
            
            
            if (!value.propertyIsEnumerable) {
                return !!value.item;
            }

            
            
            if (value.hasOwnProperty('length') && !value.propertyIsEnumerable('length')) {
                return true;
            }

            
            return iterableRe.test(toString.call(value));
        },

        
        isDebugEnabled:
            function (className, defaultEnabled) {
                var debugConfig = Ext.debugConfig.hooks;

                if (debugConfig.hasOwnProperty(className)) {
                    return debugConfig[className];
                }

                var enabled = debugConfig['*'],
                    prefixLength = 0;

                if (defaultEnabled !== undefined) {
                    enabled = defaultEnabled;
                }
                if (!className) {
                    return enabled;
                }

                for (var prefix in debugConfig) {
                    var value = debugConfig[prefix];

                    
                    if (className.charAt(prefix.length) === '.') {
                        if (className.substring(0, prefix.length) === prefix) {
                            if (prefixLength < prefix.length) {
                                prefixLength = prefix.length;
                                enabled = value;
                            }
                        }
                    }
                }

                return enabled;
            } ||
            emptyFn,

        
        clone: function(item) {
            if (item === null || item === undefined) {
                return item;
            }

            
            
            
            if (item.nodeType && item.cloneNode) {
                return item.cloneNode(true);
            }

            var type = toString.call(item),
                i, j, k, clone, key;

            
            if (type === '[object Date]') {
                return new Date(item.getTime());
            }

            
            if (type === '[object Array]') {
                i = item.length;

                clone = [];

                while (i--) {
                    clone[i] = Ext.clone(item[i]);
                }
            }
            
            else if (type === '[object Object]' && item.constructor === Object) {
                clone = {};

                for (key in item) {
                    clone[key] = Ext.clone(item[key]);
                }

                if (enumerables) {
                    for (j = enumerables.length; j--;) {
                        k = enumerables[j];
                        if (item.hasOwnProperty(k)) {
                            clone[k] = item[k];
                        }
                    }
                }
            }

            return clone || item;
        },

        
        getUniqueGlobalNamespace: function() {
            var uniqueGlobalNamespace = this.uniqueGlobalNamespace,
                i;

            if (uniqueGlobalNamespace === undefined) {
                i = 0;

                do {
                    uniqueGlobalNamespace = 'ExtBox' + (++i);
                } while (global[uniqueGlobalNamespace] !== undefined);

                global[uniqueGlobalNamespace] = Ext;
                this.uniqueGlobalNamespace = uniqueGlobalNamespace;
            }

            return uniqueGlobalNamespace;
        },

        
        functionFactoryCache: {},

        cacheableFunctionFactory: function() {
            var me = this,
                args = Array.prototype.slice.call(arguments),
                cache = me.functionFactoryCache,
                idx, fn, ln;

             if (Ext.isSandboxed) {
                ln = args.length;
                if (ln > 0) {
                    ln--;
                    args[ln] = 'var Ext=window.' + Ext.name + ';' + args[ln];
                }
            }
            idx = args.join('');
            fn = cache[idx];
            if (!fn) {
                fn = Function.prototype.constructor.apply(Function.prototype, args);

                cache[idx] = fn;
            }
            return fn;
        },

        functionFactory: function() {
            var args = Array.prototype.slice.call(arguments),
                ln;

            if (Ext.isSandboxed) {
                ln = args.length;
                if (ln > 0) {
                    ln--;
                    args[ln] = 'var Ext=window.' + Ext.name + ';' + args[ln];
                }
            }

            return Function.prototype.constructor.apply(Function.prototype, args);
        },

        
        Logger: {
            log: function(message, priority) {
                if (message && global.console) {
                    if (!priority || !(priority in global.console)) {
                        priority = 'log';
                    }
                    message = '[' + priority.toUpperCase() + '] ' + message;
                    global.console[priority](message);
                }
            },
            verbose: function(message) {
                this.log(message, 'verbose');
            },
            info: function(message) {
                this.log(message, 'info');
            },
            warn: function(message) {
                this.log(message, 'warn');
            },
            error: function(message) {
                throw new Error(message);
            },
            deprecate: function(message) {
                this.log(message, 'warn');
            }
        } || {
            verbose: emptyFn,
            log: emptyFn,
            info: emptyFn,
            warn: emptyFn,
            error: function(message) {
                throw new Error(message);
            },
            deprecate: emptyFn
        },

        
        getElementById: function(id) {
            return document.getElementById(id);
        },

        
        splitAndUnescape: (function() {
            var cache = {};
    
            return function(origin, delimiter) {
                if (!origin) {
                    return [];
                }
                else if (!delimiter) {
                    return [origin];
                }
    
                var replaceRe = cache[delimiter] || (cache[delimiter] = new RegExp('\\\\' + delimiter, 'g')),
                    result = [],
                    parts, part;
    
                parts = origin.split(delimiter);
    
                while ((part = parts.shift()) !== undefined) {
                    
                    
                    while (part.charAt(part.length - 1) === '\\' && parts.length > 0) {
                        part = part + delimiter + parts.shift();
                    }
    
                    
                    part = part.replace(replaceRe, delimiter);
    
                    result.push(part);
                }
    
                return result;
            }
        })()
    }); 

    Ext.returnTrue.$nullFn = Ext.returnId.$nullFn = true;
}());


(function() {




    function toString() {
        var me = this,
            cls = me.sourceClass,
            method = me.sourceMethod,
            msg = me.msg;

        if (method) {
            if (msg) {
                method += '(): ';
                method += msg;
            } else {
                method += '()';
            }
        }

        if (cls) {
            method = method ? (cls + '.' + method) : cls;
        }
        
        return method || msg || '';
    }

    Ext.Error = function(config) {
        if (Ext.isString(config)) {
            config = { msg: config };
        }

        var error = new Error();

        Ext.apply(error, config);

        error.message = error.message || error.msg; 
        

        error.toString = toString;

        return error;
    };

    Ext.apply(Ext.Error, {
        
        ignore: false,

        
        raise: function(err) {
            err = err || {};
            if (Ext.isString(err)) {
                err = { msg: err };
            }

            var me = this,
                method = me.raise.caller,
                msg, name;

            if (method) {
                if (!err.sourceMethod && (name = method.$name)) {
                    err.sourceMethod = name;
                }
                if (!err.sourceClass && (name = method.$owner) && (name = name.$className)) {
                    err.sourceClass = name;
                }
            }

            if (me.handle(err) !== true) {
                msg = toString.call(err);

                Ext.log({
                    msg: msg,
                    level: 'error',
                    dump: err,
                    stack: true
                });

                throw new Ext.Error(err);
            }
        },

        
        handle: function () {
            return this.ignore;
        }
    });
})();


Ext.deprecated = function (suggestion) {
    if (!suggestion) {
        suggestion = '';
    }

    function fail () {
        Ext.Error.raise('The method "' + fail.$owner.$className + '.' + fail.$name + 
                '" has been removed. ' + suggestion);
    }

    return fail;
    return Ext.emptyFn;
};


(function () {
    if (typeof window === 'undefined') {
        return; 
    }

    var last = 0,
        
        notify = function() {
            var cnt = Ext.log && Ext.log.counters,
                n = cnt && (cnt.error + cnt.warn + cnt.info + cnt.log),
                msg;

            
            if (n && last !== n) {
                msg = [];
                if (cnt.error) {
                    msg.push('Errors: ' + cnt.error);
                }
                if (cnt.warn) {
                    msg.push('Warnings: ' + cnt.warn);
                }
                if (cnt.info) {
                    msg.push('Info: ' + cnt.info);
                }
                if (cnt.log) {
                    msg.push('Log: ' + cnt.log);
                }
                window.status = '*** ' + msg.join(' -- ');
                last = n;
            }
        };

    
    
    setInterval(notify, 1000);
}());


Ext.Array = new (function() {




    var arrayPrototype = Array.prototype,
        slice = arrayPrototype.slice,
        supportsSplice = (function () {
            var array = [],
                lengthBefore,
                j = 20;

            if (!array.splice) {
                return false;
            }

            
            

            while (j--) {
                array.push("A");
            }

            array.splice(15, 0, "F", "F", "F", "F", "F","F","F","F","F","F","F","F","F","F","F","F","F","F","F","F","F");

            lengthBefore = array.length; 
            array.splice(13, 0, "XXX"); 

            if (lengthBefore + 1 !== array.length) {
                return false;
            }
            

            return true;
        }()),
        supportsIndexOf = 'indexOf' in arrayPrototype,
        supportsSliceOnNodeList = true;

    
    
    function stableSort(array, userComparator) {
        var len = array.length,
            indices = new Array(len),
            result = new Array(len),
            i;

        
        for (i = 0; i < len; i++) {
            indices[i] = i;
        }

        
        indices.sort(function(index1, index2) {
            return userComparator(array[index1], array[index2]) || (index1 - index2);
        });

        
        for (i = 0; i < len; i++) {
            result[i] = array[indices[i]];
        }

        
        for (i = 0; i < len; i++) {
            array[i] = result[i];
        }

        return array;
    }

    try {
        
        if (typeof document !== 'undefined') {
            slice.call(document.getElementsByTagName('body'));
        }
    } catch (e) {
        supportsSliceOnNodeList = false;
    }

    var fixArrayIndex = function (array, index) {
        return (index < 0) ? Math.max(0, array.length + index)
                           : Math.min(array.length, index);
    },

    
    replaceSim = function (array, index, removeCount, insert) {
        var add = insert ? insert.length : 0,
            length = array.length,
            pos = fixArrayIndex(array, index);

        
        if (pos === length) {
            if (add) {
                array.push.apply(array, insert);
            }
        } else {
            var remove = Math.min(removeCount, length - pos),
                tailOldPos = pos + remove,
                tailNewPos = tailOldPos + add - remove,
                tailCount = length - tailOldPos,
                lengthAfterRemove = length - remove,
                i;

            if (tailNewPos < tailOldPos) { 
                for (i = 0; i < tailCount; ++i) {
                    array[tailNewPos+i] = array[tailOldPos+i];
                }
            } else if (tailNewPos > tailOldPos) { 
                for (i = tailCount; i--; ) {
                    array[tailNewPos+i] = array[tailOldPos+i];
                }
            } 

            if (add && pos === lengthAfterRemove) {
                array.length = lengthAfterRemove; 
                array.push.apply(array, insert);
            } else {
                array.length = lengthAfterRemove + add; 
                for (i = 0; i < add; ++i) {
                    array[pos+i] = insert[i];
                }
            }
        }

        return array;
    },

    replaceNative = function (array, index, removeCount, insert) {
        if (insert && insert.length) {
            
            if (index === 0 && !removeCount) {
                array.unshift.apply(array, insert);
            }
            
            else if (index < array.length) {
                array.splice.apply(array, [index, removeCount].concat(insert));
            }
            
            else {
                array.push.apply(array, insert);
            }
        } else {
            array.splice(index, removeCount);
        }
        return array;
    },

    eraseSim = function (array, index, removeCount) {
        return replaceSim(array, index, removeCount);
    },

    eraseNative = function (array, index, removeCount) {
        array.splice(index, removeCount);
        return array;
    },

    spliceSim = function (array, index, removeCount) {
        var pos = fixArrayIndex(array, index),
            removed = array.slice(index, fixArrayIndex(array, pos+removeCount));

        if (arguments.length < 4) {
            replaceSim(array, pos, removeCount);
        } else {
            replaceSim(array, pos, removeCount, slice.call(arguments, 3));
        }

        return removed;
    },

    spliceNative = function (array) {
        return array.splice.apply(array, slice.call(arguments, 1));
    },

    erase = supportsSplice ? eraseNative : eraseSim,
    replace = supportsSplice ? replaceNative : replaceSim,
    splice = supportsSplice ? spliceNative : spliceSim,

    

    ExtArray = {
        
        binarySearch: function (array, item, begin, end, compareFn) {
            var length = array.length,
                middle, comparison;

            if (begin instanceof Function) {
                compareFn = begin;
                begin = 0;
                end = length;
            } else if (end instanceof Function) {
                compareFn = end;
                end = length;
            } else {
                if (begin === undefined) {
                    begin = 0;
                }
                if (end === undefined) {
                    end = length;
                }
                compareFn = compareFn || ExtArray.lexicalCompare;
            }

            --end;

            while (begin <= end) {
                middle = (begin + end) >> 1;
                comparison = compareFn(item, array[middle]);
                if (comparison >= 0) {
                    begin = middle + 1;
                } else if (comparison < 0) {
                    end = middle - 1;
                }
            }

            return begin;
        },

        defaultCompare: function (lhs, rhs) {
            return (lhs < rhs) ? -1 : ((lhs > rhs) ? 1 : 0);
        },

        
        
        lexicalCompare: function (lhs, rhs) {
            lhs = String(lhs);
            rhs = String(rhs);

            return (lhs < rhs) ? -1 : ((lhs > rhs) ? 1 : 0);
        },

        
        each: function(array, fn, scope, reverse) {
            array = ExtArray.from(array);

            var i,
                ln = array.length;

            if (reverse !== true) {
                for (i = 0; i < ln; i++) {
                    if (fn.call(scope || array[i], array[i], i, array) === false) {
                        return i;
                    }
                }
            }
            else {
                for (i = ln - 1; i > -1; i--) {
                    if (fn.call(scope || array[i], array[i], i, array) === false) {
                        return i;
                    }
                }
            }

            return true;
        },

        
        forEach: ('forEach' in arrayPrototype) ? function(array, fn, scope) {
            return array.forEach(fn, scope);
        } : function(array, fn, scope) {
            for (var i = 0, ln = array.length; i < ln; i++) {
                fn.call(scope, array[i], i, array);
            }
        },

        
        indexOf: supportsIndexOf ? function(array, item, from) {
            return arrayPrototype.indexOf.call(array, item, from);
         } : function(array, item, from) {
            var i, length = array.length;

            for (i = (from < 0) ? Math.max(0, length + from) : from || 0; i < length; i++) {
                if (array[i] === item) {
                    return i;
                }
            }

            return -1;
        },

        
        contains: supportsIndexOf ? function(array, item) {
            return arrayPrototype.indexOf.call(array, item) !== -1;
        } : function(array, item) {
            var i, ln;

            for (i = 0, ln = array.length; i < ln; i++) {
                if (array[i] === item) {
                    return true;
                }
            }

            return false;
        },

        
        toArray: function(iterable, start, end){
            if (!iterable || !iterable.length) {
                return [];
            }

            if (typeof iterable === 'string') {
                iterable = iterable.split('');
            }

            if (supportsSliceOnNodeList) {
                return slice.call(iterable, start || 0, end || iterable.length);
            }

            var array = [],
                i;

            start = start || 0;
            end = end ? ((end < 0) ? iterable.length + end : end) : iterable.length;

            for (i = start; i < end; i++) {
                array.push(iterable[i]);
            }

            return array;
        },

        
        pluck: function(array, propertyName) {
            var ret = [],
                i, ln, item;

            for (i = 0, ln = array.length; i < ln; i++) {
                item = array[i];

                ret.push(item[propertyName]);
            }

            return ret;
        },

        
        map: ('map' in arrayPrototype) ? function(array, fn, scope) {
            Ext.Assert.isFunction(fn, 
                'Ext.Array.map must have a callback function passed as second argument.');

            return array.map(fn, scope);
        } : function(array, fn, scope) {
            Ext.Assert.isFunction(fn, 
                'Ext.Array.map must have a callback function passed as second argument.');

            var results = [],
                i = 0,
                len = array.length;

            for (; i < len; i++) {
                results[i] = fn.call(scope, array[i], i, array);
            }

            return results;
        },

        
        every: ('every' in arrayPrototype) ? function(array, fn, scope) {
            Ext.Assert.isFunction(fn, 
                'Ext.Array.every must have a callback function passed as second argument.');

            return array.every(fn, scope);
        } : function(array, fn, scope) {
            Ext.Assert.isFunction(fn, 
                'Ext.Array.every must have a callback function passed as second argument.');

            var i = 0,
                ln = array.length;

            for (; i < ln; ++i) {
                if (!fn.call(scope, array[i], i, array)) {
                    return false;
                }
            }

            return true;
        },

        
        some: ('some' in arrayPrototype) ? function(array, fn, scope) {
            Ext.Assert.isFunction(fn, 
                'Ext.Array.some must have a callback function passed as second argument.');

            return array.some(fn, scope);
        } : function(array, fn, scope) {
            Ext.Assert.isFunction(fn, 
                'Ext.Array.some must have a callback function passed as second argument.');

            var i = 0,
                ln = array.length;

            for (; i < ln; ++i) {
                if (fn.call(scope, array[i], i, array)) {
                    return true;
                }
            }

            return false;
        },
        
        
        equals: function(array1, array2) {
            var len1 = array1.length,
                len2 = array2.length,
                i;
                
            
            if (array1 === array2) {
                return true;
            }
                
            if (len1 !== len2) {
                return false;
            }
            
            for (i = 0; i < len1; ++i) {
                if (array1[i] !== array2[i]) {
                    return false;
                }
            }
            
            return true;
        },

        
        clean: function(array) {
            var results = [],
                i = 0,
                ln = array.length,
                item;

            for (; i < ln; i++) {
                item = array[i];

                if (!Ext.isEmpty(item)) {
                    results.push(item);
                }
            }

            return results;
        },

        
        unique: function(array) {
            var clone = [],
                i = 0,
                ln = array.length,
                item;

            for (; i < ln; i++) {
                item = array[i];

                if (ExtArray.indexOf(clone, item) === -1) {
                    clone.push(item);
                }
            }

            return clone;
        },

        
        filter: ('filter' in arrayPrototype) ? function(array, fn, scope) {
            Ext.Assert.isFunction(fn, 
                'Ext.Array.filter must have a filter function passed as second argument.');

            return array.filter(fn, scope);
        } : function(array, fn, scope) {
            Ext.Assert.isFunction(fn, 
                'Ext.Array.filter must have a filter function passed as second argument.');

            var results = [],
                i = 0,
                ln = array.length;

            for (; i < ln; i++) {
                if (fn.call(scope, array[i], i, array)) {
                    results.push(array[i]);
                }
            }

            return results;
        },

        
        findBy : function(array, fn, scope) {
            var i = 0,
                len = array.length;

            for (; i < len; i++) {
                if (fn.call(scope || array, array[i], i)) {
                    return array[i];
                }
            }
            return null;
        },

        
        from: function(value, newReference) {
            if (value === undefined || value === null) {
                return [];
            }

            if (Ext.isArray(value)) {
                return (newReference) ? slice.call(value) : value;
            }

            var type = typeof value;
            
            
            if (value && value.length !== undefined && type !== 'string' && (type !== 'function' || !value.apply)) {
                return ExtArray.toArray(value);
            }

            return [value];
        },

        
        remove: function(array, item) {
            var index = ExtArray.indexOf(array, item);

            if (index !== -1) {
                erase(array, index, 1);
            }

            return array;
        },

        
        include: function(array, item) {
            if (!ExtArray.contains(array, item)) {
                array.push(item);
            }
        },

        
        clone: function(array) {
            return slice.call(array);
        },

        
        merge: function() {
            var args = slice.call(arguments),
                array = [],
                i, ln;

            for (i = 0, ln = args.length; i < ln; i++) {
                array = array.concat(args[i]);
            }

            return ExtArray.unique(array);
        },

        
        intersect: function() {
            var intersection = [],
                arrays = slice.call(arguments),
                arraysLength,
                array,
                arrayLength,
                minArray,
                minArrayIndex,
                minArrayCandidate,
                minArrayLength,
                element,
                elementCandidate,
                elementCount,
                i, j, k;

            if (!arrays.length) {
                return intersection;
            }

            
            arraysLength = arrays.length;
            for (i = minArrayIndex = 0; i < arraysLength; i++) {
                minArrayCandidate = arrays[i];
                if (!minArray || minArrayCandidate.length < minArray.length) {
                    minArray = minArrayCandidate;
                    minArrayIndex = i;
                }
            }

            minArray = ExtArray.unique(minArray);
            erase(arrays, minArrayIndex, 1);

            
            
            
            minArrayLength = minArray.length;
            arraysLength = arrays.length;
            for (i = 0; i < minArrayLength; i++) {
                element = minArray[i];
                elementCount = 0;

                for (j = 0; j < arraysLength; j++) {
                    array = arrays[j];
                    arrayLength = array.length;
                    for (k = 0; k < arrayLength; k++) {
                        elementCandidate = array[k];
                        if (element === elementCandidate) {
                            elementCount++;
                            break;
                        }
                    }
                }

                if (elementCount === arraysLength) {
                    intersection.push(element);
                }
            }

            return intersection;
        },

        
        difference: function(arrayA, arrayB) {
            var clone = slice.call(arrayA),
                ln = clone.length,
                i, j, lnB;

            for (i = 0,lnB = arrayB.length; i < lnB; i++) {
                for (j = 0; j < ln; j++) {
                    if (clone[j] === arrayB[i]) {
                        erase(clone, j, 1);
                        j--;
                        ln--;
                    }
                }
            }

            return clone;
        },

        
        
        slice: ([1,2].slice(1, undefined).length ?
            function (array, begin, end) {
                return slice.call(array, begin, end);
            } :
            function (array, begin, end) {
                
                if (typeof begin === 'undefined') {
                    return slice.call(array);
                }
                if (typeof end === 'undefined') {
                    return slice.call(array, begin);
                }
                return slice.call(array, begin, end);
            }
        ),

                         
        sort: function(array, sortFn) {
            return stableSort(array, sortFn || ExtArray.lexicalCompare);
        },

        
        flatten: function(array) {
            var worker = [];

            function rFlatten(a) {
                var i, ln, v;

                for (i = 0, ln = a.length; i < ln; i++) {
                    v = a[i];

                    if (Ext.isArray(v)) {
                        rFlatten(v);
                    } else {
                        worker.push(v);
                    }
                }

                return worker;
            }

            return rFlatten(array);
        },

        
        min: function(array, comparisonFn) {
            var min = array[0],
                i, ln, item;

            for (i = 0, ln = array.length; i < ln; i++) {
                item = array[i];

                if (comparisonFn) {
                    if (comparisonFn(min, item) === 1) {
                        min = item;
                    }
                }
                else {
                    if (item < min) {
                        min = item;
                    }
                }
            }

            return min;
        },

        
        max: function(array, comparisonFn) {
            var max = array[0],
                i, ln, item;

            for (i = 0, ln = array.length; i < ln; i++) {
                item = array[i];

                if (comparisonFn) {
                    if (comparisonFn(max, item) === -1) {
                        max = item;
                    }
                }
                else {
                    if (item > max) {
                        max = item;
                    }
                }
            }

            return max;
        },

        
        mean: function(array) {
            return array.length > 0 ? ExtArray.sum(array) / array.length : undefined;
        },

        
        sum: function(array) {
            var sum = 0,
                i, ln, item;

            for (i = 0,ln = array.length; i < ln; i++) {
                item = array[i];

                sum += item;
            }

            return sum;
        },

        
        toMap: function(array, getKey, scope) {
            var map = {},
                i = array.length;

            if (!getKey) {
                while (i--) {
                    map[array[i]] = i+1;
                }
            } else if (typeof getKey === 'string') {
                while (i--) {
                    map[array[i][getKey]] = i+1;
                }
            } else {
                while (i--) {
                    map[getKey.call(scope, array[i])] = i+1;
                }
            }

            return map;
        },

        
        toValueMap: function(array, getKey, scope, arrayify) {
            var map = {},
                i = array.length,
                autoArray, alwaysArray, entry, fn, key, value;

            if (!getKey) {
                while (i--) {
                    value = array[i];
                    map[value] = value;
                }
            } else {
                if (!(fn = (typeof getKey !== 'string'))) {
                    arrayify = scope;
                }

                alwaysArray = arrayify === 1;
                autoArray = arrayify === 2;

                while (i--) {
                    value = array[i];
                    key = fn ? getKey.call(scope, value) : value[getKey];

                    if (alwaysArray) {
                        if (key in map) {
                            map[key].push(value);
                        } else {
                            map[key] = [ value ];
                        }
                    } else if (autoArray && (key in map)) {
                        if ((entry = map[key]) instanceof Array) {
                            entry.push(value);
                        } else {
                            map[key] = [ entry, value ];
                        }
                    } else {
                        map[key] = value;
                    }
                }
            }

            return map;
        },

        _replaceSim: replaceSim, 
        _spliceSim: spliceSim,

        
        erase: erase,

        
        insert: function (array, index, items) {
            return replace(array, index, 0, items);
        },

        
        replace: replace,

        
        splice: splice,

        
        push: function(target) {
            var len = arguments.length,
                i = 1,
                newItem;

            if (target === undefined) {
                target = [];
            } else if (!Ext.isArray(target)) {
                target = [target];
            }
            for (; i < len; i++) {
                newItem = arguments[i];
                Array.prototype.push[Ext.isIterable(newItem) ? 'apply' : 'call'](target, newItem);
            }
            return target;
        },
        
        
        numericSortFn: function(a, b) {
            return a - b;
        }
    };

    
    Ext.each = ExtArray.each;

    
    ExtArray.union = ExtArray.merge;

    
    Ext.min = ExtArray.min;

    
    Ext.max = ExtArray.max;

    
    Ext.sum = ExtArray.sum;

    
    Ext.mean = ExtArray.mean;

    
    Ext.flatten = ExtArray.flatten;

    
    Ext.clean = ExtArray.clean;

    
    Ext.unique = ExtArray.unique;

    
    Ext.pluck = ExtArray.pluck;

    
    Ext.toArray = function() {
        return ExtArray.toArray.apply(ExtArray, arguments);
    };

    return ExtArray;
});





Ext.Assert = {

    
    falsey: function (b, msg) {
        if (b) {
            Ext.Error.raise(msg || ('Expected a falsey value but was ' + b));
        }
    },

    
    falseyProp: function (object, property) {
        Ext.Assert.truthy(object);
        var b = object[property];
        if (b) {
            if (object.$className) {
                property = object.$className + '#' + property;
            }
            Ext.Error.raise('Expected a falsey value for ' + property +
                            ' but was ' + b);
        }
    },

    
    truthy: function (b, msg) {
        if (!b) {
            Ext.Error.raise(msg || ('Expected a truthy value but was ' + typeof b));
        }
    },

    
    truthyProp: function (object, property) {
        Ext.Assert.truthy(object);
        var b = object[property];
        if (!b) {
            if (object.$className) {
                property = object.$className + '#' + property;
            }
            Ext.Error.raise('Expected a truthy value for ' + property +
                            ' but was ' + typeof b);
        }
    }
};

(function () {
    function makeAssert (name, kind) {
        var testFn = Ext[name],
            def;
        return function (value, msg) {
            if (!testFn(value)) {
                Ext.Error.raise(msg || def ||
                    (def = 'Expected value to be ' + kind));
            }
        };
    }

    function makeAssertProp (name, kind) {
        var testFn = Ext[name],
            def;
        return function (object, prop) {
            Ext.Assert.truthy(object);
            if (!testFn(object[prop])) {
                Ext.Error.raise(def || (def = 'Expected ' + 
                        (object.$className ? object.$className + '#' : '') +
                        prop + ' to be ' + kind));
            }
        };
    }

    function makeNotAssert (name, kind) {
        var testFn = Ext[name],
            def;
        return function (value, msg) {
            if (testFn(value)) {
                Ext.Error.raise(msg || def ||
                    (def = 'Expected value to NOT be ' + kind));
            }
        };
    }

    function makeNotAssertProp (name, kind) {
        var testFn = Ext[name],
            def;
        return function (object, prop) {
            Ext.Assert.truthy(object);
            if (testFn(object[prop])) {
                Ext.Error.raise(def || (def = 'Expected ' + 
                        (object.$className ? object.$className + '#' : '') +
                        prop + ' to NOT be ' + kind));
            }
        };
    }

    for (var name in Ext) {
        if (name.substring(0,2) == "is" && Ext.isFunction(Ext[name])) {
            var kind = name.substring(2);
            Ext.Assert[name] = makeAssert(name, kind);
            Ext.Assert[name + 'Prop'] = makeAssertProp(name, kind);
            Ext.Assert['isNot' + kind] = makeNotAssert(name, kind);
            Ext.Assert['isNot' + kind + 'Prop'] = makeNotAssertProp(name, kind);
        }
    }
}());



Ext.String = (function() {




    var trimRegex     = /^[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000]+|[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u2028\u2029\u202f\u205f\u3000]+$/g,
        escapeRe      = /('|\\)/g,
        escapeRegexRe = /([-.*+?\^${}()|\[\]\/\\])/g,
        basicTrimRe   = /^\s+|\s+$/g,
        whitespaceRe  = /\s+/,
        varReplace    = /(^[^a-z]*|[^\w])/gi,
        charToEntity,
        entityToChar,
        charToEntityRegex,
        entityToCharRegex,
        htmlEncodeReplaceFn = function(match, capture) {
            return charToEntity[capture];
        },
        htmlDecodeReplaceFn = function(match, capture) {
            return (capture in entityToChar) ? entityToChar[capture] : String.fromCharCode(parseInt(capture.substr(2), 10));
        },
        boundsCheck = function(s, other){
            if (s === null || s === undefined || other === null || other === undefined) {
                return false;
            }

            return other.length <= s.length; 
        },
        
        ExtString;

    return ExtString = {

        
        insert: function(s, value, index) {
            if (!s) {
                return value;
            }
            
            if (!value) {
                return s;
            }
            
            var len = s.length;
            
            if (!index && index !== 0) {
                index = len;
            }
            
            if (index < 0) {
                index *= -1;
                if (index >= len) {
                    
                    index = 0;
                } else {
                    index = len - index;
                }
            }
            
            if (index === 0) {
                s = value + s;
            } else if (index >= s.length) {
                s += value;
            } else {
                s = s.substr(0, index) + value + s.substr(index);
            }
            return s;
        },
        
        
        startsWith: function(s, start, ignoreCase){
            var result = boundsCheck(s, start);
            
            if (result) {
                if (ignoreCase) {
                    s = s.toLowerCase();
                    start = start.toLowerCase();
                }
                result = s.lastIndexOf(start, 0) === 0;
            }
            return result;
        },
        
        
        endsWith: function(s, end, ignoreCase){
            var result = boundsCheck(s, end);
            
            if (result) {
                if (ignoreCase) {
                    s = s.toLowerCase();
                    end = end.toLowerCase();
                }
                result = s.indexOf(end, s.length - end.length) !== -1;
            }
            return result;
        },

        
        createVarName: function(s) {
            return s.replace(varReplace, '');
        },

        
        htmlEncode: function(value) {
            return (!value) ? value : String(value).replace(charToEntityRegex, htmlEncodeReplaceFn);
        },

        
        htmlDecode: function(value) {
            return (!value) ? value : String(value).replace(entityToCharRegex, htmlDecodeReplaceFn);
        },
        
        
        hasHtmlCharacters: function(s) {
            return charToEntityRegex.test(s);
        },

        
        addCharacterEntities: function(newEntities) {
            var charKeys = [],
                entityKeys = [],
                key, echar;
            for (key in newEntities) {
                echar = newEntities[key];
                entityToChar[key] = echar;
                charToEntity[echar] = key;
                charKeys.push(echar);
                entityKeys.push(key);
            }
            charToEntityRegex = new RegExp('(' + charKeys.join('|') + ')', 'g');
            entityToCharRegex = new RegExp('(' + entityKeys.join('|') + '|&#[0-9]{1,5};' + ')', 'g');
        },

        
        resetCharacterEntities: function() {
            charToEntity = {};
            entityToChar = {};
            
            this.addCharacterEntities({
                '&amp;'     :   '&',
                '&gt;'      :   '>',
                '&lt;'      :   '<',
                '&quot;'    :   '"',
                '&#39;'     :   "'"
            });
        },

        
        urlAppend : function(url, string) {
            if (!Ext.isEmpty(string)) {
                return url + (url.indexOf('?') === -1 ? '?' : '&') + string;
            }

            return url;
        },

        
        trim: function(string) {
            if (string) {
                string = string.replace(trimRegex, "");
            }
            return string || '';
        },

        
        capitalize: function(string) {
            if (string) {
                string = string.charAt(0).toUpperCase() + string.substr(1);
            }
            return string || '';
        },

        
        uncapitalize: function(string) {
            if (string) {
                string = string.charAt(0).toLowerCase() + string.substr(1);
            }
            return string || '';
        },

        
        ellipsis: function(value, length, word) {
            if (value && value.length > length) {
                if (word) {
                    var vs = value.substr(0, length - 2),
                    index = Math.max(vs.lastIndexOf(' '), vs.lastIndexOf('.'), vs.lastIndexOf('!'), vs.lastIndexOf('?'));
                    if (index !== -1 && index >= (length - 15)) {
                        return vs.substr(0, index) + "...";
                    }
                }
                return value.substr(0, length - 3) + "...";
            }
            return value;
        },

        
        escapeRegex: function(string) {
            return string.replace(escapeRegexRe, "\\$1");
        },

        
        createRegex: function (value, startsWith, endsWith, ignoreCase) {
            var ret = value;

            if (value != null && !value.exec) { 
                ret = ExtString.escapeRegex(String(value));

                if (startsWith !== false) {
                    ret = '^' + ret;
                }
                if (endsWith !== false) {
                    ret += '$';
                }

                ret = new RegExp(ret, (ignoreCase !== false) ? 'i' : '');
            }

            return ret;
        },

        
        escape: function(string) {
            return string.replace(escapeRe, "\\$1");
        },

        
        toggle: function(string, value, other) {
            return string === value ? other : value;
        },

        
        leftPad: function(string, size, character) {
            var result = String(string);
            character = character || " ";
            while (result.length < size) {
                result = character + result;
            }
            return result;
        },

        
        repeat: function(pattern, count, sep) {
            if (count < 1) {
                count = 0;
            }
            for (var buf = [], i = count; i--; ) {
                buf.push(pattern);
            }
            return buf.join(sep || '');
        },

        
        splitWords: function (words) {
            if (words && typeof words == 'string') {
                return words.replace(basicTrimRe, '').split(whitespaceRe);
            }
            return words || [];
        }
    };
}());


Ext.String.resetCharacterEntities();


Ext.htmlEncode = Ext.String.htmlEncode;



Ext.htmlDecode = Ext.String.htmlDecode;


Ext.urlAppend = Ext.String.urlAppend;


Ext.Date = (function () {




  var utilDate,
      stripEscapeRe = /(\\.)/g,
      hourInfoRe = /([gGhHisucUOPZ]|MS)/,
      dateInfoRe = /([djzmnYycU]|MS)/,
      slashRe = /\\/gi,
      numberTokenRe = /\{(\d+)\}/g,
      MSFormatRe = new RegExp('\\/Date\\(([-+])?(\\d+)(?:[+-]\\d{4})?\\)\\/'),

      
      
      
      
      code = [
        
        "var me = this, dt, y, m, d, h, i, s, ms, o, O, z, zz, u, v, W, year, jan4, week1monday, daysInMonth, dayMatched,",
            "def = me.defaults,",
            "from = Ext.Number.from,",
            "results = String(input).match(me.parseRegexes[{0}]);", 

        "if(results){",
            "{1}",

            "if(u != null){", 
                "v = new Date(u * 1000);", 
            "}else{",
                
                
                
                "dt = me.clearTime(new Date);",

                "y = from(y, from(def.y, dt.getFullYear()));",
                "m = from(m, from(def.m - 1, dt.getMonth()));",
                "dayMatched = d !== undefined;",
                "d = from(d, from(def.d, dt.getDate()));",
                
                
                
                
                
                
                
                
                "if (!dayMatched) {", 
                    "dt.setDate(1);",
                    "dt.setMonth(m);",
                    "dt.setFullYear(y);",
                
                    "daysInMonth = me.getDaysInMonth(dt);",
                    "if (d > daysInMonth) {",
                        "d = daysInMonth;",
                    "}",
                "}",

                "h  = from(h, from(def.h, dt.getHours()));",
                "i  = from(i, from(def.i, dt.getMinutes()));",
                "s  = from(s, from(def.s, dt.getSeconds()));",
                "ms = from(ms, from(def.ms, dt.getMilliseconds()));",

                "if(z >= 0 && y >= 0){",
                    
                    

                    
                    
                    "v = me.add(new Date(y < 100 ? 100 : y, 0, 1, h, i, s, ms), me.YEAR, y < 100 ? y - 100 : 0);",

                    
                    "v = !strict? v : (strict === true && (z <= 364 || (me.isLeapYear(v) && z <= 365))? me.add(v, me.DAY, z) : null);",
                "}else if(strict === true && !me.isValid(y, m + 1, d, h, i, s, ms)){", 
                    "v = null;", 
                "}else{",
                    "if (W) {", 
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        
                        "year = y || (new Date()).getFullYear();",
                        "jan4 = new Date(year, 0, 4, 0, 0, 0);",
                        "d = jan4.getDay();", 
                        
                        
                        "week1monday = new Date(jan4.getTime() - ((d === 0 ? 6 : d - 1) * 86400000));",
                        
                        
                        
                        
                        "v = Ext.Date.clearTime(new Date(week1monday.getTime() + ((W - 1) * 604800000 + 43200000)));",
                    "} else {",
                        
                        
                        "v = me.add(new Date(y < 100 ? 100 : y, m, d, h, i, s, ms), me.YEAR, y < 100 ? y - 100 : 0);",
                    "}",
                "}",
            "}",
        "}",

        "if(v){",
            
            "if(zz != null){",
                
                "v = me.add(v, me.SECOND, -v.getTimezoneOffset() * 60 - zz);",
            "}else if(o){",
                
                "v = me.add(v, me.MINUTE, -v.getTimezoneOffset() + (sn == '+'? -1 : 1) * (hr * 60 + mn));",
            "}",
        "}",

        "return v;"
      ].join('\n');

    
    
    
    function xf(format) {
        var args = Array.prototype.slice.call(arguments, 1);
        return format.replace(numberTokenRe, function(m, i) {
            return args[i];
        });
    }
  
return utilDate = {
    
    now: Date.now, 

    
    toString: function(date) {
        if (!date) {
            date = new Date();
        }

        var pad = Ext.String.leftPad;

        return date.getFullYear() + "-"
                   + pad(date.getMonth() + 1, 2, '0') + "-"
                   + pad(date.getDate(), 2, '0') + "T"
                   + pad(date.getHours(), 2, '0') + ":"
                   + pad(date.getMinutes(), 2, '0') + ":"
            + pad(date.getSeconds(), 2, '0');
    },

    
    getElapsed: function(dateA, dateB) {
        return Math.abs(dateA - (dateB || utilDate.now()));
    },

    
    useStrict: false,

    
    formatCodeToRegex: function(character, currentGroup) {
        
        var p = utilDate.parseCodes[character];

        if (p) {
          p = typeof p == 'function'? p() : p;
          utilDate.parseCodes[character] = p; 
        }

        return p ? Ext.applyIf({
          c: p.c ? xf(p.c, currentGroup || "{0}") : p.c
        }, p) : {
            g: 0,
            c: null,
            s: Ext.String.escapeRegex(character) 
        };
    },

    
    parseFunctions: {
        "MS": function(input, strict) {
            
            
            var r = (input || '').match(MSFormatRe);
            return r ? new Date(((r[1] || '') + r[2]) * 1) : null;
        },
        "time": function(input, strict) {
            var num = parseInt(input, 10);
            if (num || num === 0) {
                return new Date(num);
            }
            return null;
        },
        "timestamp": function(input, strict) {
            var num = parseInt(input, 10);
            if (num || num === 0) {
                return new Date(num * 1000);
            }
            return null;
        }
    },
    parseRegexes: [],

    
    formatFunctions: {
        "MS": function() {
            
            return '\\/Date(' + this.getTime() + ')\\/';
        },
        "time": function(){
            return this.getTime().toString();
        },
        "timestamp": function(){
            return utilDate.format(this, 'U');
        }
    },

    y2kYear : 50,

    
    MILLI : "ms",

    
    SECOND : "s",

    
    MINUTE : "mi",

    
    HOUR : "h",

    
    DAY : "d",

    
    MONTH : "mo",

    
    YEAR : "y",

    
    defaults: {},

    
    
    dayNames : [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ],
    

    
    
    monthNames : [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ],
    

    
    
    monthNumbers : {
        January: 0,
        Jan: 0,
        February: 1,
        Feb: 1,
        March: 2,
        Mar: 2,
        April: 3,
        Apr: 3,
        May: 4,
        June: 5,
        Jun: 5,
        July: 6,
        Jul: 6,
        August: 7,
        Aug: 7,
        September: 8,
        Sep: 8,
        October: 9,
        Oct: 9,
        November: 10,
        Nov: 10,
        December: 11,
        Dec: 11
    },
    
    
    
    
    defaultFormat : "m/d/Y",
    
    
    
    getShortMonthName : function(month) {
        return Ext.Date.monthNames[month].substring(0, 3);
    },
    

    
    
    getShortDayName : function(day) {
        return Ext.Date.dayNames[day].substring(0, 3);
    },
    

    
    
    getMonthNumber : function(name) {
        
        return Ext.Date.monthNumbers[name.substring(0, 1).toUpperCase() + name.substring(1, 3).toLowerCase()];
    },
    

    
    formatContainsHourInfo : function(format){
        return hourInfoRe.test(format.replace(stripEscapeRe, ''));
    },

    
    formatContainsDateInfo : function(format){
        return dateInfoRe.test(format.replace(stripEscapeRe, ''));
    },
    
    
    unescapeFormat: function(format) {
        
        
        
        return format.replace(slashRe, '');
    },

    
    formatCodes : {
        d: "Ext.String.leftPad(this.getDate(), 2, '0')",
        D: "Ext.Date.getShortDayName(this.getDay())", 
        j: "this.getDate()",
        l: "Ext.Date.dayNames[this.getDay()]",
        N: "(this.getDay() ? this.getDay() : 7)",
        S: "Ext.Date.getSuffix(this)",
        w: "this.getDay()",
        z: "Ext.Date.getDayOfYear(this)",
        W: "Ext.String.leftPad(Ext.Date.getWeekOfYear(this), 2, '0')",
        F: "Ext.Date.monthNames[this.getMonth()]",
        m: "Ext.String.leftPad(this.getMonth() + 1, 2, '0')",
        M: "Ext.Date.getShortMonthName(this.getMonth())", 
        n: "(this.getMonth() + 1)",
        t: "Ext.Date.getDaysInMonth(this)",
        L: "(Ext.Date.isLeapYear(this) ? 1 : 0)",
        o: "(this.getFullYear() + (Ext.Date.getWeekOfYear(this) == 1 && this.getMonth() > 0 ? +1 : (Ext.Date.getWeekOfYear(this) >= 52 && this.getMonth() < 11 ? -1 : 0)))",
        Y: "Ext.String.leftPad(this.getFullYear(), 4, '0')",
        y: "('' + this.getFullYear()).substring(2, 4)",
        a: "(this.getHours() < 12 ? 'am' : 'pm')",
        A: "(this.getHours() < 12 ? 'AM' : 'PM')",
        g: "((this.getHours() % 12) ? this.getHours() % 12 : 12)",
        G: "this.getHours()",
        h: "Ext.String.leftPad((this.getHours() % 12) ? this.getHours() % 12 : 12, 2, '0')",
        H: "Ext.String.leftPad(this.getHours(), 2, '0')",
        i: "Ext.String.leftPad(this.getMinutes(), 2, '0')",
        s: "Ext.String.leftPad(this.getSeconds(), 2, '0')",
        u: "Ext.String.leftPad(this.getMilliseconds(), 3, '0')",
        O: "Ext.Date.getGMTOffset(this)",
        P: "Ext.Date.getGMTOffset(this, true)",
        T: "Ext.Date.getTimezone(this)",
        Z: "(this.getTimezoneOffset() * -60)",

        c: function() { 
            var c, code, i, l, e;
            for (c = "Y-m-dTH:i:sP", code = [], i = 0, l = c.length; i < l; ++i) {
                e = c.charAt(i);
                code.push(e == "T" ? "'T'" : utilDate.getFormatCode(e)); 
            }
            return code.join(" + ");
        },
        

        U: "Math.round(this.getTime() / 1000)"
    },

    
    isValid : function(y, m, d, h, i, s, ms) {
        
        h = h || 0;
        i = i || 0;
        s = s || 0;
        ms = ms || 0;

        
        var dt = utilDate.add(new Date(y < 100 ? 100 : y, m - 1, d, h, i, s, ms), utilDate.YEAR, y < 100 ? y - 100 : 0);

        return y == dt.getFullYear() &&
            m == dt.getMonth() + 1 &&
            d == dt.getDate() &&
            h == dt.getHours() &&
            i == dt.getMinutes() &&
            s == dt.getSeconds() &&
            ms == dt.getMilliseconds();
    },

    
    parse : function(input, format, strict) {
        var p = utilDate.parseFunctions;
        if (p[format] == null) {
            utilDate.createParser(format);
        }
        return p[format].call(utilDate, input, Ext.isDefined(strict) ? strict : utilDate.useStrict);
    },

    
    parseDate: function(input, format, strict){
        return utilDate.parse(input, format, strict);
    },


    
    getFormatCode : function(character) {
        var f = utilDate.formatCodes[character];

        if (f) {
          f = typeof f == 'function'? f() : f;
          utilDate.formatCodes[character] = f; 
        }

        
        return f || ("'" + Ext.String.escape(character) + "'");
    },

    
    createFormat : function(format) {
        var code = [],
            special = false,
            ch = '',
            i;

        for (i = 0; i < format.length; ++i) {
            ch = format.charAt(i);
            if (!special && ch == "\\") {
                special = true;
            } else if (special) {
                special = false;
                code.push("'" + Ext.String.escape(ch) + "'");
            } else {
                if (ch == '\n') {
                    code.push("'\\n'");
                } else {
                    code.push(utilDate.getFormatCode(ch));
                }
            }
        }
        utilDate.formatFunctions[format] = Ext.functionFactory("return " + code.join('+'));
    },

    
    createParser : function(format) {
        var regexNum = utilDate.parseRegexes.length,
            currentGroup = 1,
            calc = [],
            regex = [],
            special = false,
            ch = "",
            i = 0,
            len = format.length,
            atEnd = [],
            obj;

        for (; i < len; ++i) {
            ch = format.charAt(i);
            if (!special && ch == "\\") {
                special = true;
            } else if (special) {
                special = false;
                regex.push(Ext.String.escape(ch));
            } else {
                obj = utilDate.formatCodeToRegex(ch, currentGroup);
                currentGroup += obj.g;
                regex.push(obj.s);
                if (obj.g && obj.c) {
                    if (obj.calcAtEnd) {
                        atEnd.push(obj.c);
                    } else {
                        calc.push(obj.c);
                    }
                }
            }
        }

        calc = calc.concat(atEnd);

        utilDate.parseRegexes[regexNum] = new RegExp("^" + regex.join('') + "$", 'i');
        utilDate.parseFunctions[format] = Ext.functionFactory("input", "strict", xf(code, regexNum, calc.join('')));
    },

    
    parseCodes : {
        
        d: {
            g:1,
            c:"d = parseInt(results[{0}], 10);\n",
            s:"(3[0-1]|[1-2][0-9]|0[1-9])" 
        },
        j: {
            g:1,
            c:"d = parseInt(results[{0}], 10);\n",
            s:"(3[0-1]|[1-2][0-9]|[1-9])" 
        },
        D: function() {
            for (var a = [], i = 0; i < 7; a.push(utilDate.getShortDayName(i)), ++i); 
            return {
                g:0,
                c:null,
                s:"(?:" + a.join("|") +")"
            };
        },
        l: function() {
            return {
                g:0,
                c:null,
                s:"(?:" + utilDate.dayNames.join("|") + ")"
            };
        },
        N: {
            g:0,
            c:null,
            s:"[1-7]" 
        },
        
        S: {
            g:0,
            c:null,
            s:"(?:st|nd|rd|th)"
        },
        
        w: {
            g:0,
            c:null,
            s:"[0-6]" 
        },
        z: {
            g:1,
            c:"z = parseInt(results[{0}], 10);\n",
            s:"(\\d{1,3})" 
        },
        W: {
            g:1,
            c:"W = parseInt(results[{0}], 10);\n",
            s:"(\\d{2})" 
        },
        F: function() {
            return {
                g:1,
                c:"m = parseInt(me.getMonthNumber(results[{0}]), 10);\n", 
                s:"(" + utilDate.monthNames.join("|") + ")"
            };
        },
        M: function() {
            for (var a = [], i = 0; i < 12; a.push(utilDate.getShortMonthName(i)), ++i); 
            return Ext.applyIf({
                s:"(" + a.join("|") + ")"
            }, utilDate.formatCodeToRegex("F"));
        },
        m: {
            g:1,
            c:"m = parseInt(results[{0}], 10) - 1;\n",
            s:"(1[0-2]|0[1-9])" 
        },
        n: {
            g:1,
            c:"m = parseInt(results[{0}], 10) - 1;\n",
            s:"(1[0-2]|[1-9])" 
        },
        t: {
            g:0,
            c:null,
            s:"(?:\\d{2})" 
        },
        L: {
            g:0,
            c:null,
            s:"(?:1|0)"
        },
        o: { 
            g: 1,
            c: "y = parseInt(results[{0}], 10);\n",
            s: "(\\d{4})" 

        },
        Y: {
            g:1,
            c:"y = parseInt(results[{0}], 10);\n",
            s:"(\\d{4})" 
        },
        y: {
            g:1,
            c:"var ty = parseInt(results[{0}], 10);\n"
                + "y = ty > me.y2kYear ? 1900 + ty : 2000 + ty;\n", 
            s:"(\\d{1,2})"
        },
        
        
        a: {
            g:1,
            c:"if (/(am)/i.test(results[{0}])) {\n"
                + "if (!h || h == 12) { h = 0; }\n"
                + "} else { if (!h || h < 12) { h = (h || 0) + 12; }}",
            s:"(am|pm|AM|PM)",
            calcAtEnd: true
        },
        
        
        A: {
            g:1,
            c:"if (/(am)/i.test(results[{0}])) {\n"
                + "if (!h || h == 12) { h = 0; }\n"
                + "} else { if (!h || h < 12) { h = (h || 0) + 12; }}",
            s:"(AM|PM|am|pm)",
            calcAtEnd: true
        },
        
        g: {
            g:1,
            c:"h = parseInt(results[{0}], 10);\n",
            s:"(1[0-2]|[0-9])" 
        },
        G: {
            g:1,
            c:"h = parseInt(results[{0}], 10);\n",
            s:"(2[0-3]|1[0-9]|[0-9])" 
        },
        h: {
            g:1,
            c:"h = parseInt(results[{0}], 10);\n",
            s:"(1[0-2]|0[1-9])" 
        },
        H: {
            g:1,
            c:"h = parseInt(results[{0}], 10);\n",
            s:"(2[0-3]|[0-1][0-9])" 
        },
        i: {
            g:1,
            c:"i = parseInt(results[{0}], 10);\n",
            s:"([0-5][0-9])" 
        },
        s: {
            g:1,
            c:"s = parseInt(results[{0}], 10);\n",
            s:"([0-5][0-9])" 
        },
        u: {
            g:1,
            c:"ms = results[{0}]; ms = parseInt(ms, 10)/Math.pow(10, ms.length - 3);\n",
            s:"(\\d+)" 
        },
        O: {
            g:1,
            c:[
                "o = results[{0}];",
                "var sn = o.substring(0,1),", 
                    "hr = o.substring(1,3)*1 + Math.floor(o.substring(3,5) / 60),", 
                    "mn = o.substring(3,5) % 60;", 
                "o = ((-12 <= (hr*60 + mn)/60) && ((hr*60 + mn)/60 <= 14))? (sn + Ext.String.leftPad(hr, 2, '0') + Ext.String.leftPad(mn, 2, '0')) : null;\n" 
            ].join("\n"),
            s: "([+-]\\d{4})" 
        },
        P: {
            g:1,
            c:[
                "o = results[{0}];",
                "var sn = o.substring(0,1),", 
                    "hr = o.substring(1,3)*1 + Math.floor(o.substring(4,6) / 60),", 
                    "mn = o.substring(4,6) % 60;", 
                "o = ((-12 <= (hr*60 + mn)/60) && ((hr*60 + mn)/60 <= 14))? (sn + Ext.String.leftPad(hr, 2, '0') + Ext.String.leftPad(mn, 2, '0')) : null;\n" 
            ].join("\n"),
            s: "([+-]\\d{2}:\\d{2})" 
        },
        T: {
            g:0,
            c:null,
            s:"[A-Z]{1,5}" 
        },
        Z: {
            g:1,
            c:"zz = results[{0}] * 1;\n" 
                  + "zz = (-43200 <= zz && zz <= 50400)? zz : null;\n",
            s:"([+-]?\\d{1,5})" 
        },
        c: function() {
            var calc = [],
                arr = [
                    utilDate.formatCodeToRegex("Y", 1), 
                    utilDate.formatCodeToRegex("m", 2), 
                    utilDate.formatCodeToRegex("d", 3), 
                    utilDate.formatCodeToRegex("H", 4), 
                    utilDate.formatCodeToRegex("i", 5), 
                    utilDate.formatCodeToRegex("s", 6), 
                    {c:"ms = results[7] || '0'; ms = parseInt(ms, 10)/Math.pow(10, ms.length - 3);\n"}, 
                    {c:[ 
                        "if(results[8]) {", 
                            "if(results[8] == 'Z'){",
                                "zz = 0;", 
                            "}else if (results[8].indexOf(':') > -1){",
                                utilDate.formatCodeToRegex("P", 8).c, 
                            "}else{",
                                utilDate.formatCodeToRegex("O", 8).c, 
                            "}",
                        "}"
                    ].join('\n')}
                ],
                i,
                l;

            for (i = 0, l = arr.length; i < l; ++i) {
                calc.push(arr[i].c);
            }

            return {
                g:1,
                c:calc.join(""),
                s:[
                    arr[0].s, 
                    "(?:", "-", arr[1].s, 
                        "(?:", "-", arr[2].s, 
                            "(?:",
                                "(?:T| )?", 
                                arr[3].s, ":", arr[4].s,  
                                "(?::", arr[5].s, ")?", 
                                "(?:(?:\\.|,)(\\d+))?", 
                                "(Z|(?:[-+]\\d{2}(?::)?\\d{2}))?", 
                            ")?",
                        ")?",
                    ")?"
                ].join("")
            };
        },
        U: {
            g:1,
            c:"u = parseInt(results[{0}], 10);\n",
            s:"(-?\\d+)" 
        }
    },

    
    
    dateFormat: function(date, format) {
        return utilDate.format(date, format);
    },

    
    isEqual: function(date1, date2) {
        
        if (date1 && date2) {
            return (date1.getTime() === date2.getTime());
        }
        
        return !(date1 || date2);
    },

    
    format: function(date, format) {
        var formatFunctions = utilDate.formatFunctions;

        if (!Ext.isDate(date)) {
            return '';
        }

        if (formatFunctions[format] == null) {
            utilDate.createFormat(format);
        }

        return formatFunctions[format].call(date) + '';
    },

    
    getTimezone : function(date) {
        
        
        
        
        
        
        
        
        
        
        
        
        return date.toString().replace(/^.* (?:\((.*)\)|([A-Z]{1,5})(?:[\-+][0-9]{4})?(?: -?\d+)?)$/, "$1$2").replace(/[^A-Z]/g, "");
    },

    
    getGMTOffset : function(date, colon) {
        var offset = date.getTimezoneOffset();
        return (offset > 0 ? "-" : "+")
            + Ext.String.leftPad(Math.floor(Math.abs(offset) / 60), 2, "0")
            + (colon ? ":" : "")
            + Ext.String.leftPad(Math.abs(offset % 60), 2, "0");
    },

    
    getDayOfYear: function(date) {
        var num = 0,
            d = Ext.Date.clone(date),
            m = date.getMonth(),
            i;

        for (i = 0, d.setDate(1), d.setMonth(0); i < m; d.setMonth(++i)) {
            num += utilDate.getDaysInMonth(d);
        }
        return num + date.getDate() - 1;
    },

    
    getWeekOfYear : (function() {
        
        var ms1d = 864e5, 
            ms7d = 7 * ms1d; 

        return function(date) { 
            var DC3 = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate() + 3) / ms1d, 
                AWN = Math.floor(DC3 / 7), 
                Wyr = new Date(AWN * ms7d).getUTCFullYear();

            return AWN - Math.floor(Date.UTC(Wyr, 0, 7) / ms7d) + 1;
        };
    }()),

    
    isLeapYear : function(date) {
        var year = date.getFullYear();
        return !!((year & 3) == 0 && (year % 100 || (year % 400 == 0 && year)));
    },

    
    getFirstDayOfMonth : function(date) {
        var day = (date.getDay() - (date.getDate() - 1)) % 7;
        return (day < 0) ? (day + 7) : day;
    },

    
    getLastDayOfMonth : function(date) {
        return utilDate.getLastDateOfMonth(date).getDay();
    },


    
    getFirstDateOfMonth : function(date) {
        return new Date(date.getFullYear(), date.getMonth(), 1);
    },

    
    getLastDateOfMonth : function(date) {
        return new Date(date.getFullYear(), date.getMonth(), utilDate.getDaysInMonth(date));
    },

    
    getDaysInMonth: (function() {
        var daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

        return function(date) { 
            var m = date.getMonth();

            return m == 1 && utilDate.isLeapYear(date) ? 29 : daysInMonth[m];
        };
    }()),

    
    
    getSuffix : function(date) {
        switch (date.getDate()) {
            case 1:
            case 21:
            case 31:
                return "st";
            case 2:
            case 22:
                return "nd";
            case 3:
            case 23:
                return "rd";
            default:
                return "th";
        }
    },
    

    
    clone : function(date) {
        return new Date(date.getTime());
    },

    
    isDST : function(date) {
        
        
        return new Date(date.getFullYear(), 0, 1).getTimezoneOffset() != date.getTimezoneOffset();
    },

    
    clearTime : function(date, clone) {
        if (clone) {
            return Ext.Date.clearTime(Ext.Date.clone(date));
        }

        
        var d = date.getDate(),
            hr,
            c;

        
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        date.setMilliseconds(0);

        if (date.getDate() != d) { 
            
            

            
            for (hr = 1, c = utilDate.add(date, Ext.Date.HOUR, hr); c.getDate() != d; hr++, c = utilDate.add(date, Ext.Date.HOUR, hr));

            date.setDate(d);
            date.setHours(c.getHours());
        }

        return date;
    },

    
    add : function(date, interval, value) {
        var d = Ext.Date.clone(date),
            Date = Ext.Date,
            day, decimalValue, base = 0;
        if (!interval || value === 0) {
            return d;
        }

        decimalValue = value - parseInt(value, 10);
        value = parseInt(value, 10);

        if (value) {
            switch(interval.toLowerCase()) {
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                case Ext.Date.MILLI:
                    d.setTime(d.getTime() + value);
                    break;
                case Ext.Date.SECOND:
                    d.setTime(d.getTime() + value * 1000);
                    break;
                case Ext.Date.MINUTE:
                    d.setTime(d.getTime() + value * 60 * 1000);
                    break;
                case Ext.Date.HOUR:
                    d.setTime(d.getTime() + value * 60 * 60 * 1000);
                    break;
                case Ext.Date.DAY:
                    d.setDate(d.getDate() + value);
                    break;
                case Ext.Date.MONTH:
                    day = date.getDate();
                    if (day > 28) {
                        day = Math.min(day, Ext.Date.getLastDateOfMonth(Ext.Date.add(Ext.Date.getFirstDateOfMonth(date), Ext.Date.MONTH, value)).getDate());
                    }
                    d.setDate(day);
                    d.setMonth(date.getMonth() + value);
                    break;
                case Ext.Date.YEAR:
                    day = date.getDate();
                    if (day > 28) {
                        day = Math.min(day, Ext.Date.getLastDateOfMonth(Ext.Date.add(Ext.Date.getFirstDateOfMonth(date), Ext.Date.YEAR, value)).getDate());
                    }
                    d.setDate(day);
                    d.setFullYear(date.getFullYear() + value);
                    break;
            }
        }

        if (decimalValue) {
            switch (interval.toLowerCase()) {
                case Ext.Date.MILLI:    base = 1;               break;
                case Ext.Date.SECOND:   base = 1000;            break;
                case Ext.Date.MINUTE:   base = 1000*60;         break;
                case Ext.Date.HOUR:     base = 1000*60*60;      break;
                case Ext.Date.DAY:      base = 1000*60*60*24;   break;

                case Ext.Date.MONTH:
                    day = utilDate.getDaysInMonth(d);
                    base = 1000*60*60*24*day;
                    break;

                case Ext.Date.YEAR:
                    day = (utilDate.isLeapYear(d) ? 366 : 365);
                    base = 1000*60*60*24*day;
                    break;
            }
            if (base) {
                d.setTime(d.getTime() + base * decimalValue); 
            }
        }

        return d;
    },
    
    
    subtract: function(date, interval, value){
        return utilDate.add(date, interval, -value);
    },

    
    between : function(date, start, end) {
        var t = date.getTime();
        return start.getTime() <= t && t <= end.getTime();
    },

    
    compat: function() {
        var nativeDate = window.Date,
            p,
            statics = ['useStrict', 'formatCodeToRegex', 'parseFunctions', 'parseRegexes', 'formatFunctions', 'y2kYear', 'MILLI', 'SECOND', 'MINUTE', 'HOUR', 'DAY', 'MONTH', 'YEAR', 'defaults', 'dayNames', 'monthNames', 'monthNumbers', 'getShortMonthName', 'getShortDayName', 'getMonthNumber', 'formatCodes', 'isValid', 'parseDate', 'getFormatCode', 'createFormat', 'createParser', 'parseCodes'],
            proto = ['dateFormat', 'format', 'getTimezone', 'getGMTOffset', 'getDayOfYear', 'getWeekOfYear', 'isLeapYear', 'getFirstDayOfMonth', 'getLastDayOfMonth', 'getDaysInMonth', 'getSuffix', 'clone', 'isDST', 'clearTime', 'add', 'between'],
            sLen    = statics.length,
            pLen    = proto.length,
            stat, prot, s;

        
        for (s = 0; s < sLen; s++) {
            stat = statics[s];
            nativeDate[stat] = utilDate[stat];
        }

        
        for (p = 0; p < pLen; p++) {
            prot = proto[p];
            nativeDate.prototype[prot] = function() {
                var args = Array.prototype.slice.call(arguments);
                args.unshift(this);
                return utilDate[prot].apply(utilDate, args);
            };
        }
    },

    
    diff: function (min, max, unit) {
        var ExtDate = Ext.Date, est, diff = +max - min;
        switch (unit) {
            case ExtDate.MILLI:
                return diff;
            case ExtDate.SECOND:
                return Math.floor(diff / 1000);
            case ExtDate.MINUTE:
                return Math.floor(diff / 60000);
            case ExtDate.HOUR:
                return Math.floor(diff / 3600000);
            case ExtDate.DAY:
                return Math.floor(diff / 86400000);
            case 'w':
                return Math.floor(diff / 604800000);
            case ExtDate.MONTH:
                est = (max.getFullYear() * 12 + max.getMonth()) - (min.getFullYear() * 12 + min.getMonth());
                if (Ext.Date.add(min, unit, est) > max) {
                    return est - 1;
                } else {
                    return est;
                }
            case ExtDate.YEAR:
                est = max.getFullYear() - min.getFullYear();
                if (Ext.Date.add(min, unit, est) > max) {
                    return est - 1;
                } else {
                    return est;
                }
        }
    },

    
    align: function (date, unit, step) {
        var num = new Date(+date);
        switch (unit.toLowerCase()) {
            case Ext.Date.MILLI:
                return num;
                break;
            case Ext.Date.SECOND:
                num.setUTCSeconds(num.getUTCSeconds() - num.getUTCSeconds() % step);
                num.setUTCMilliseconds(0);
                return num;
                break;
            case Ext.Date.MINUTE:
                num.setUTCMinutes(num.getUTCMinutes() - num.getUTCMinutes() % step);
                num.setUTCSeconds(0);
                num.setUTCMilliseconds(0);
                return num;
                break;
            case Ext.Date.HOUR:
                num.setUTCHours(num.getUTCHours() - num.getUTCHours() % step);
                num.setUTCMinutes(0);
                num.setUTCSeconds(0);
                num.setUTCMilliseconds(0);
                return num;
                break;
            case Ext.Date.DAY:
                if (step == 7 || step == 14){
                    num.setUTCDate(num.getUTCDate() - num.getUTCDay() + 1);
                }
                num.setUTCHours(0);
                num.setUTCMinutes(0);
                num.setUTCSeconds(0);
                num.setUTCMilliseconds(0);
                return num;
                break;
            case Ext.Date.MONTH:
                num.setUTCMonth(num.getUTCMonth() - (num.getUTCMonth() - 1) % step,1);
                num.setUTCHours(0);
                num.setUTCMinutes(0);
                num.setUTCSeconds(0);
                num.setUTCMilliseconds(0);
                return num;
                break;
            case Ext.Date.YEAR:
                num.setUTCFullYear(num.getUTCFullYear() - num.getUTCFullYear() % step, 1, 1);
                num.setUTCHours(0);
                num.setUTCMinutes(0);
                num.setUTCSeconds(0);
                num.setUTCMilliseconds(0);
                return date;
                break;
        }
    }
};
}());


Ext.Function = (function() {




    var lastTime = 0,
        animFrameId,
        animFrameHandlers = [],
        animFrameNoArgs = [],
        idSource = 0,
        animFrameMap = {},
        win = window,
        requestAnimFrame = win.requestAnimationFrame || win.webkitRequestAnimationFrame ||
            win.mozRequestAnimationFrame || win.oRequestAnimationFrame ||
            function(callback) {
                var currTime = Ext.now(),
                    timeToCall = Math.max(0, 16 - (currTime - lastTime)),
                    id = win.setTimeout(function() {
                        callback(currTime + timeToCall);
                    }, timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            },
        fireHandlers = function() {
            var len = animFrameHandlers.length,
                id, i, handler;

            animFrameId = null;
            
            for (i = 0; i < len; i++) {
                handler = animFrameHandlers[i];
                id = handler[3];
                
                
                if (animFrameMap[id]) {
                    handler[0].apply(handler[1] || Ext.global, handler[2] || animFrameNoArgs);
                    delete animFrameMap[id];
                }
            }

            
            
            animFrameHandlers = animFrameHandlers.slice(len);
        },
        fireElevatedHandlers = function() {
            Ext.elevateFunction(fireHandlers);
        },
        ExtFunction = {
        
        flexSetter: function(setter) {
            return function(name, value) {
                var k, i;

                if (name !== null) {
                    if (typeof name !== 'string') {
                        for (k in name) {
                            if (name.hasOwnProperty(k)) {
                                setter.call(this, k, name[k]);
                            }
                        }

                        if (Ext.enumerables) {
                            for (i = Ext.enumerables.length; i--;) {
                                k = Ext.enumerables[i];
                                if (name.hasOwnProperty(k)) {
                                    setter.call(this, k, name[k]);
                                }
                            }
                        }
                    } else {
                        setter.call(this, name, value);
                    }
                }

                return this;
            };
        },

        
        bind: function(fn, scope, args, appendArgs) {
            if (arguments.length === 2) {
                return function() {
                    return fn.apply(scope, arguments);
                };
            }

            var method = fn,
                slice = Array.prototype.slice;

            return function() {
                var callArgs = args || arguments;

                if (appendArgs === true) {
                    callArgs = slice.call(arguments, 0);
                    callArgs = callArgs.concat(args);
                }
                else if (typeof appendArgs == 'number') {
                    callArgs = slice.call(arguments, 0); 
                    Ext.Array.insert(callArgs, appendArgs, args);
                }

                return method.apply(scope || Ext.global, callArgs);
            };
        },

        
        bindCallback: function (callback, scope, args, delay, caller) {
            return function () {
                var a = Ext.Array.slice(arguments);
                return Ext.callback(callback, scope, args ? args.concat(a) : a, delay, caller);
            };
        },

        
        pass: function(fn, args, scope) {
            if (!Ext.isArray(args)) {
                if (Ext.isIterable(args)) {
                    args = Ext.Array.clone(args);
                } else {
                    args = args !== undefined ? [args] : [];
                }
            }

            return function() {
                var fnArgs = args.slice();
                fnArgs.push.apply(fnArgs, arguments);
                return fn.apply(scope || this, fnArgs);
            };
        },

        
        alias: function(object, methodName) {
            return function() {
                return object[methodName].apply(object, arguments);
            };
        },

        
        clone: function(method) {
            return function() {
                return method.apply(this, arguments);
            };
        },

        
        createInterceptor: function(origFn, newFn, scope, returnValue) {
            if (!Ext.isFunction(newFn)) {
                return origFn;
            } else {
                returnValue = Ext.isDefined(returnValue) ? returnValue : null;
                return function() {
                    var me = this,
                        args = arguments;

                    newFn.target = me;
                    newFn.method = origFn;
                    return (newFn.apply(scope || me || Ext.global, args) !== false) ? 
                                origFn.apply(me || Ext.global, args) : returnValue;
                };
            }
        },

        
        createDelayed: function(fn, delay, scope, args, appendArgs) {
            if (scope || args) {
                fn = Ext.Function.bind(fn, scope, args, appendArgs);
            }

            return function() {
                var me = this,
                    args = Array.prototype.slice.call(arguments);

                setTimeout(function() {
                    if (Ext.elevateFunction) {
                        Ext.elevateFunction(fn, me, args);
                    } else {
                        fn.apply(me, args);
                    }
                }, delay);
            };
        },

        
        defer: function(fn, millis, scope, args, appendArgs) {
            fn = Ext.Function.bind(fn, scope, args, appendArgs);
            if (millis > 0) {
                return setTimeout(function () {
                    if (Ext.elevateFunction) {
                        Ext.elevateFunction(fn);
                    } else {
                        fn();
                    }
                }, millis);
            }
            fn();
            return 0;
        },

        
        interval: function(fn, millis, scope, args, appendArgs) {
            fn = Ext.Function.bind(fn, scope, args, appendArgs);
            return setInterval(function () {
                if (Ext.elevateFunction) {
                    Ext.elevateFunction(fn);
                } else {
                    fn();
                }
            }, millis);
        },

        
        createSequence: function(originalFn, newFn, scope) {
            if (!newFn) {
                return originalFn;
            }
            else {
                return function() {
                    var result = originalFn.apply(this, arguments);
                    newFn.apply(scope || this, arguments);
                    return result;
                };
            }
        },

        
        createBuffered: function(fn, buffer, scope, args) {
            var timerId;

            return function() {
                var callArgs = args || Array.prototype.slice.call(arguments, 0),
                    me = scope || this;

                if (timerId) {
                    clearTimeout(timerId);
                }

                timerId = setTimeout(function(){
                    if (Ext.elevateFunction) {
                        Ext.elevateFunction(fn, me, callArgs);
                    } else {
                        fn.apply(me, callArgs);
                    }
                }, buffer);
            };
        },

        
        createAnimationFrame: function(fn, scope, args, queueStrategy) {
            var timerId;

            queueStrategy = queueStrategy || 3;

            return function() {
                var callArgs = args || Array.prototype.slice.call(arguments, 0);

                scope = scope || this;

                if (queueStrategy === 3 && timerId) {
                    ExtFunction.cancelAnimationFrame(timerId);
                }

                if ((queueStrategy & 1) || !timerId) {
                    timerId = ExtFunction.requestAnimationFrame(function() {
                        timerId = null;
                        fn.apply(scope, callArgs);
                    });
                }
            };
        },

        
        requestAnimationFrame: function(fn, scope, args) {
            var id = ++idSource,  
                handler = Array.prototype.slice.call(arguments, 0);

            handler[3] = id;
            animFrameMap[id] = 1; 
            
            
            
            animFrameHandlers.push(handler);

            if (!animFrameId) {
                animFrameId = requestAnimFrame(Ext.elevateFunction ? fireElevatedHandlers : fireHandlers);
            }
            return id;
        },

        cancelAnimationFrame: function(id) {
            
            
            
            delete animFrameMap[id];
        },

        
        createThrottled: function(fn, interval, scope) {
            var lastCallTime = 0,
                elapsed,
                lastArgs,
                timer,
                execute = function() {
                    if (Ext.elevateFunction) {
                        Ext.elevateFunction(fn, scope, lastArgs);
                    } else {
                        fn.apply(scope, lastArgs);
                    }
                    lastCallTime = Ext.now();
                    timer = null;
                };

            return function() {
                
                if (!scope) {
                    scope = this;
                }
                elapsed = Ext.now() - lastCallTime;
                lastArgs = arguments;

                
                
                if (elapsed >= interval) {
                    clearTimeout(timer);
                    execute();
                }
                
                else if (!timer) {
                    timer = Ext.defer(execute, interval - elapsed);
                }
            };
        },

            
        createBarrier: function(count, fn, scope) {
            return function() {
                if (!--count) {
                    fn.apply(scope, arguments);
                }
            };
        },

        
        interceptBefore: function(object, methodName, fn, scope) {
            var method = object[methodName] || Ext.emptyFn;

            return (object[methodName] = function() {
                var ret = fn.apply(scope || this, arguments);
                method.apply(this, arguments);

                return ret;
            });
        },

        
        interceptAfter: function(object, methodName, fn, scope) {
            var method = object[methodName] || Ext.emptyFn;

            return (object[methodName] = function() {
                method.apply(this, arguments);
                return fn.apply(scope || this, arguments);
            });
        },

        makeCallback: function (callback, scope) {
            if (!scope[callback]) {
                if (scope.$className) {
                    Ext.Error.raise('No method "' + callback + '" on ' + scope.$className);
                }
                Ext.Error.raise('No method "' + callback + '"');
            }

            return function () {
                return scope[callback].apply(scope, arguments);
            };
        }
    };

    
    Ext.defer = ExtFunction.defer;

    
    Ext.interval = ExtFunction.interval;

    
    Ext.pass = ExtFunction.pass;

    
    Ext.bind = ExtFunction.bind;

    Ext.deferCallback = ExtFunction.requestAnimationFrame;

    return ExtFunction;
})();


Ext.Number = new function() {



    var ExtNumber = this,
        isToFixedBroken = (0.9).toFixed() !== '1',
        math = Math,
        ClipDefault = {
            count: false,
            inclusive: false,
            wrap: true
        };

    Ext.apply(ExtNumber, {
        Clip: {
            DEFAULT: ClipDefault,

            COUNT: Ext.applyIf({
                    count: true
                }, ClipDefault),

            INCLUSIVE: Ext.applyIf({
                    inclusive: true
                }, ClipDefault),

            NOWRAP: Ext.applyIf({
                    wrap: false
                }, ClipDefault)
        },

        
        clipIndices: function (length, indices, options) {
            options = options || ClipDefault;

            var defaultValue = 0, 
                wrap = options.wrap,
                begin, end, i;

            indices = indices || [];
            for (i = 0; i < 2; ++i) {
                
                
                begin = end;  
                end = indices[i];
                if (end == null) {
                    end = defaultValue;
                } else if (i && options.count) {
                    end += begin; 
                    end = (end > length) ? length : end;
                } else {
                    if (wrap) {
                        end = (end < 0) ? (length + end) : end;
                    }
                    if (i && options.inclusive) {
                        ++end;
                    }
                    end = (end < 0) ? 0 : ((end > length) ? length : end);
                }
                defaultValue = length; 
            }

            
            
            

            indices[0] = begin;
            indices[1] = (end < begin) ? begin : end;
            return indices;
        },

        
        constrain: function(number, min, max) {
            var x = parseFloat(number);

            
            
            
            if (min === null) {
                min = number;
            }

            if (max === null) {
                max = number;
            }

            
            

            
            return (x < min) ? min : ((x > max) ? max : x);
        },

        
        snap : function(value, increment, minValue, maxValue) {
            var m;

            
            
            if (value === undefined || value < minValue) {
                return minValue || 0;
            }

            if (increment) {
                m = value % increment;
                if (m !== 0) {
                    value -= m;
                    if (m * 2 >= increment) {
                        value += increment;
                    } else if (m * 2 < -increment) {
                        value -= increment;
                    }
                }
            }
            return ExtNumber.constrain(value, minValue,  maxValue);
        },

        
        snapInRange : function(value, increment, minValue, maxValue) {
            var tween;

            
            minValue = (minValue || 0);

            
            if (value === undefined || value < minValue) {
                return minValue;
            }

            
            if (increment && (tween = ((value - minValue) % increment))) {
                value -= tween;
                tween *= 2;
                if (tween >= increment) {
                    value += increment;
                }
            }

            
            if (maxValue !== undefined) {
                if (value > (maxValue = ExtNumber.snapInRange(maxValue, increment, minValue))) {
                    value = maxValue;
                }
            }

            return value;
        },

        
        toFixed: isToFixedBroken ? function(value, precision) {
            precision = precision || 0;
            var pow = math.pow(10, precision);
            return (math.round(value * pow) / pow).toFixed(precision);
        } : function(value, precision) {
            return value.toFixed(precision);
        },

        
        from: function(value, defaultValue) {
            if (isFinite(value)) {
                value = parseFloat(value);
            }

            return !isNaN(value) ? value : defaultValue;
        },

        
        randomInt: function (from, to) {
           return math.floor(math.random() * (to - from + 1) + from);
        },
        
        
        correctFloat: function(n) {
            
            
            
            return parseFloat(n.toPrecision(14));
        }
    });

    
    Ext.num = function() {
        return ExtNumber.from.apply(this, arguments);
    };
};



(function() {


var TemplateClass = function(){},
    ExtObject = Ext.Object = {





    
    chain: Object.create || function (object) {
        TemplateClass.prototype = object;
        var result = new TemplateClass();
        TemplateClass.prototype = null;
        return result;
    },

    
    clear: function (object) {
        
        for (var key in object) {
            delete object[key];
        }

        return object;
    },

    
    freeze: Object.freeze ? function (obj, deep) {
        if (obj && typeof obj === 'object' && !Object.isFrozen(obj)) {
            Object.freeze(obj);

            if (deep) {
                for (var name in obj) {
                    ExtObject.freeze(obj[name], deep);
                }
            }
        }
        return obj;
    } : Ext.identityFn,

    
    toQueryObjects: function(name, value, recursive) {
        var self = ExtObject.toQueryObjects,
            objects = [],
            i, ln;

        if (Ext.isArray(value)) {
            for (i = 0, ln = value.length; i < ln; i++) {
                if (recursive) {
                    objects = objects.concat(self(name + '[' + i + ']', value[i], true));
                }
                else {
                    objects.push({
                        name: name,
                        value: value[i]
                    });
                }
            }
        }
        else if (Ext.isObject(value)) {
            for (i in value) {
                if (value.hasOwnProperty(i)) {
                    if (recursive) {
                        objects = objects.concat(self(name + '[' + i + ']', value[i], true));
                    }
                    else {
                        objects.push({
                            name: name,
                            value: value[i]
                        });
                    }
                }
            }
        }
        else {
            objects.push({
                name: name,
                value: value
            });
        }

        return objects;
    },

    
    toQueryString: function(object, recursive) {
        var paramObjects = [],
            params = [],
            i, j, ln, paramObject, value;

        for (i in object) {
            if (object.hasOwnProperty(i)) {
                paramObjects = paramObjects.concat(ExtObject.toQueryObjects(i, object[i], recursive));
            }
        }

        for (j = 0, ln = paramObjects.length; j < ln; j++) {
            paramObject = paramObjects[j];
            value = paramObject.value;

            if (Ext.isEmpty(value)) {
                value = '';
            } else if (Ext.isDate(value)) {
                value = Ext.Date.toString(value);
            }

            params.push(encodeURIComponent(paramObject.name) + '=' + encodeURIComponent(String(value)));
        }

        return params.join('&');
    },

    
    fromQueryString: function(queryString, recursive) {
        var parts = queryString.replace(/^\?/, '').split('&'),
            object = {},
            temp, components, name, value, i, ln,
            part, j, subLn, matchedKeys, matchedName,
            keys, key, nextKey;

        for (i = 0, ln = parts.length; i < ln; i++) {
            part = parts[i];

            if (part.length > 0) {
                components = part.split('=');
                name = decodeURIComponent(components[0]);
                value = (components[1] !== undefined) ? decodeURIComponent(components[1]) : '';

                if (!recursive) {
                    if (object.hasOwnProperty(name)) {
                        if (!Ext.isArray(object[name])) {
                            object[name] = [object[name]];
                        }

                        object[name].push(value);
                    }
                    else {
                        object[name] = value;
                    }
                }
                else {
                    matchedKeys = name.match(/(\[):?([^\]]*)\]/g);
                    matchedName = name.match(/^([^\[]+)/);

                    if (!matchedName) {
                        throw new Error('[Ext.Object.fromQueryString] Malformed query string given, failed parsing name from "' + part + '"');
                    }

                    name = matchedName[0];
                    keys = [];

                    if (matchedKeys === null) {
                        object[name] = value;
                        continue;
                    }

                    for (j = 0, subLn = matchedKeys.length; j < subLn; j++) {
                        key = matchedKeys[j];
                        key = (key.length === 2) ? '' : key.substring(1, key.length - 1);
                        keys.push(key);
                    }

                    keys.unshift(name);

                    temp = object;

                    for (j = 0, subLn = keys.length; j < subLn; j++) {
                        key = keys[j];

                        if (j === subLn - 1) {
                            if (Ext.isArray(temp) && key === '') {
                                temp.push(value);
                            }
                            else {
                                temp[key] = value;
                            }
                        }
                        else {
                            if (temp[key] === undefined || typeof temp[key] === 'string') {
                                nextKey = keys[j+1];

                                temp[key] = (Ext.isNumeric(nextKey) || nextKey === '') ? [] : {};
                            }

                            temp = temp[key];
                        }
                    }
                }
            }
        }

        return object;
    },

    
    each: function(object, fn, scope) {
        var enumerables = Ext.enumerables,
            i, property;

        scope = scope || object;

        for (property in object) {
            if (object.hasOwnProperty(property)) {
                if (fn.call(scope, property, object[property], object) === false) {
                    return;
                }
            }
        }

        if (enumerables) {
            for (i = enumerables.length; i--; ) {
                if (object.hasOwnProperty(property = enumerables[i])) {
                    if (fn.call(scope, property, object[property], object) === false) {
                        return;
                    }
                }
            }
        }
    },

    
    eachValue: function(object, fn, scope) {
        var enumerables = Ext.enumerables,
            i, property;

        scope = scope || object;

        for (property in object) {
            if (object.hasOwnProperty(property)) {
                if (fn.call(scope, object[property]) === false) {
                    return;
                }
            }
        }

        if (enumerables) {
            for (i = enumerables.length; i--; ) {
                if (object.hasOwnProperty(property = enumerables[i])) {
                    if (fn.call(scope, object[property]) === false) {
                        return;
                    }
                }
            }
        }
    },

    
    merge: function(destination) {
        var i = 1,
            ln = arguments.length,
            mergeFn = ExtObject.merge,
            cloneFn = Ext.clone,
            object, key, value, sourceKey;

        for (; i < ln; i++) {
            object = arguments[i];

            for (key in object) {
                value = object[key];
                if (value && value.constructor === Object) {
                    sourceKey = destination[key];
                    if (sourceKey && sourceKey.constructor === Object) {
                        mergeFn(sourceKey, value);
                    } else {
                        destination[key] = cloneFn(value);
                    }
                } else {
                    destination[key] = value;
                }
            }
        }

        return destination;
    },

    
    mergeIf: function(destination) {
        var i = 1,
            ln = arguments.length,
            cloneFn = Ext.clone,
            object, key, value;

        for (; i < ln; i++) {
            object = arguments[i];

            for (key in object) {
                if (!(key in destination)) {
                    value = object[key];

                    if (value && value.constructor === Object) {
                        destination[key] = cloneFn(value);
                    }
                    else {
                        destination[key] = value;
                    }
                }
            }
        }

        return destination;
    },

    
    getKey: function(object, value) {
        for (var property in object) {
            if (object.hasOwnProperty(property) && object[property] === value) {
                return property;
            }
        }

        return null;
    },

    
    getValues: function(object) {
        var values = [],
            property;

        for (property in object) {
            if (object.hasOwnProperty(property)) {
                values.push(object[property]);
            }
        }

        return values;
    },

    
    getKeys: (typeof Object.keys == 'function')
        ? function(object){
            if (!object) {
                return [];
            }
            return Object.keys(object);
        }
        : function(object) {
            var keys = [],
                property;

            for (property in object) {
                if (object.hasOwnProperty(property)) {
                    keys.push(property);
                }
            }

            return keys;
        },

    
    getSize: function(object) {
        var size = 0,
            property;

        for (property in object) {
            if (object.hasOwnProperty(property)) {
                size++;
            }
        }

        return size;
    },
    
    
    isEmpty: function(object){
        for (var key in object) {
            if (object.hasOwnProperty(key)) {
                return false;
            }
        }
        return true;    
    },
    
    
    equals: (function() {
        var check = function(o1, o2) {
            var key;
        
            for (key in o1) {
                if (o1.hasOwnProperty(key)) {
                    if (o1[key] !== o2[key]) {
                        return false;
                    }    
                }
            }    
            return true;
        };
        
        return function(object1, object2) {
            
            
            if (object1 === object2) {
                return true;
            } if (object1 && object2) {
                
                
                return check(object1, object2) && check(object2, object1);  
            } else if (!object1 && !object2) {
                return object1 === object2;
            } else {
                return false;
            }
        };
    })(),

    
    fork: function (obj) {
        var ExtArray = Ext.Array,
            ret, key, value;

        if (obj && obj.constructor === Object) {
            ret = ExtObject.chain(obj);

            for (key in obj) {
                value = obj[key];

                if (value) {
                    if (value.constructor === Object) {
                        ret[key] = ExtObject.fork(value);
                    } else if (value instanceof Array) {
                        ret[key] = Ext.Array.clone(value);
                    }
                }
            }
        } else {
            ret = obj;
        }

        return ret;
    },

    defineProperty: ('defineProperty' in Object) ? Object.defineProperty :
                function(object, name, descriptor) {
                    if (!Object.prototype.__defineGetter__) {
                        return;
                    }
                    if (descriptor.get) {
                        object.__defineGetter__(name, descriptor.get);
                    }

                    if (descriptor.set) {
                        object.__defineSetter__(name, descriptor.set);
                    }
                },

    
    classify: function(object) {
        var prototype = object,
            objectProperties = [],
            propertyClassesMap = {},
            objectClass = function() {
                var i = 0,
                    ln = objectProperties.length,
                    property;

                for (; i < ln; i++) {
                    property = objectProperties[i];
                    this[property] = new propertyClassesMap[property]();
                }
            },
            key, value;

        for (key in object) {
            if (object.hasOwnProperty(key)) {
                value = object[key];

                if (value && value.constructor === Object) {
                    objectProperties.push(key);
                    propertyClassesMap[key] = ExtObject.classify(value);
                }
            }
        }

        objectClass.prototype = prototype;

        return objectClass;
    }
};


Ext.merge = Ext.Object.merge;


Ext.mergeIf = Ext.Object.mergeIf;

}());


Ext.apply(Ext, {




    
    _namedScopes: {
        'this': { isThis: 1 },
        controller: { isController: 1 },
        
        
        self: { isSelf: 1 },
        'self.controller': { isSelf: 1, isController: 1 }
    },

    escapeId: (function(){
        var validIdRe = /^[a-zA-Z_][a-zA-Z0-9_\-]*$/i,
            escapeRx = /([\W]{1})/g,
            leadingNumRx = /^(\d)/g,
            escapeFn = function(match, capture){
                return "\\" + capture;
            },
            numEscapeFn = function(match, capture){
                return '\\00' + capture.charCodeAt(0).toString(16) + ' ';
            };

        return function(id) {
            return validIdRe.test(id)
                ? id
                
                
                : id.replace(escapeRx, escapeFn)
                    .replace(leadingNumRx, numEscapeFn);
        };
    }()),

    
    callback: function (callback, scope, args, delay, caller, defaultScope) {
        if (!callback) {
            return;
        }

        var namedScope = (scope in Ext._namedScopes);
        
        if (callback.charAt) { 
            if ((!scope || namedScope) && caller) {
                scope = caller.resolveListenerScope(namedScope ? scope : defaultScope);
            }
            if (!scope || !Ext.isObject(scope)) {
                Ext.Error.raise('Named method "' + callback + '" requires a scope object');
            }
            if (!Ext.isFunction(scope[callback])) {
                Ext.Error.raise('No method named "' + callback + '" on ' +
                                (scope.$className || 'scope object'));
            }

            callback = scope[callback];
        } else if (namedScope) {
            scope = defaultScope || caller;
        } else if (!scope) {
            scope = caller;
        }
        
        var ret;

        if (callback && Ext.isFunction(callback)) {
            scope = scope || Ext.global;
            if (delay) {
                Ext.defer(callback, delay, scope, args);
            } else if (args) {
                ret = callback.apply(scope, args);
            } else {
                ret = callback.call(scope);
            }
        }

        return ret;
    },

    
    coerce: function(from, to) {
        var fromType = Ext.typeOf(from),
            toType = Ext.typeOf(to),
            isString = typeof from === 'string';

        if (fromType !== toType) {
            switch (toType) {
                case 'string':
                    return String(from);
                case 'number':
                    return Number(from);
                case 'boolean':
                    return isString && (!from || from === 'false') ? false : Boolean(from);
                case 'null':
                    return isString && (!from || from === 'null') ? null : from;
                case 'undefined':
                    return isString && (!from || from === 'undefined') ? undefined : from;
                case 'date':
                    return isString && isNaN(from) ? Ext.Date.parse(from, Ext.Date.defaultFormat) : Date(Number(from));
            }
        }
        return from;
    },

    
    copyTo : function(dest, source, names, usePrototypeKeys){
        if(typeof names == 'string'){
            names = names.split(/[,;\s]/);
        }

        var n,
            nLen = names? names.length : 0,
            name;

        for(n = 0; n < nLen; n++) {
            name = names[n];

            if (usePrototypeKeys || source.hasOwnProperty(name)){
                dest[name] = source[name];
            }
        }

        return dest;
    },

    
    extend: (function() {
        
        var objectConstructor = Object.prototype.constructor,
            inlineOverrides = function(o) {
            for (var m in o) {
                if (!o.hasOwnProperty(m)) {
                    continue;
                }
                this[m] = o[m];
            }
        };

        return function(subclass, superclass, overrides) {
            
            if (Ext.isObject(superclass)) {
                overrides = superclass;
                superclass = subclass;
                subclass = overrides.constructor !== objectConstructor ? overrides.constructor : function() {
                    superclass.apply(this, arguments);
                };
            }

            if (!superclass) {
                Ext.Error.raise({
                    sourceClass: 'Ext',
                    sourceMethod: 'extend',
                    msg: 'Attempting to extend from a class which has not been loaded on the page.'
                });
            }

            
            var F = function() {},
                subclassProto, superclassProto = superclass.prototype;

            F.prototype = superclassProto;
            subclassProto = subclass.prototype = new F();
            subclassProto.constructor = subclass;
            subclass.superclass = superclassProto;

            if (superclassProto.constructor === objectConstructor) {
                superclassProto.constructor = superclass;
            }

            subclass.override = function(overrides) {
                Ext.override(subclass, overrides);
            };

            subclassProto.override = inlineOverrides;
            subclassProto.proto = subclassProto;

            subclass.override(overrides);
            subclass.extend = function(o) {
                return Ext.extend(subclass, o);
            };

            return subclass;
        };
    }()),

    
    iterate: function(object, fn, scope) {
        if (Ext.isEmpty(object)) {
            return;
        }

        if (scope === undefined) {
            scope = object;
        }

        if (Ext.isIterable(object)) {
            Ext.Array.each.call(Ext.Array, object, fn, scope);
        }
        else {
            Ext.Object.each.call(Ext.Object, object, fn, scope);
        }
    },

    
    urlEncode: function () {
        var args = Ext.Array.from(arguments),
            prefix = '';

        
        if (Ext.isString(args[1])) {
            prefix = args[1] + '&';
            args[1] = false;
        }

        return prefix + Ext.Object.toQueryString.apply(Ext.Object, args);
    },

    
    urlDecode: function() {
        return Ext.Object.fromQueryString.apply(Ext.Object, arguments);
    },

    
    getScrollbarSize: function (force) {
        if (!Ext.isDomReady) {
            Ext.Error.raise("getScrollbarSize called before DomReady");
        }

        var scrollbarSize = Ext._scrollbarSize;

        if (force || !scrollbarSize) {
            var db = document.body,
                div = document.createElement('div');

            div.style.width = div.style.height = '100px';
            div.style.overflow = 'scroll';
            div.style.position = 'absolute';

            db.appendChild(div); 

            
            Ext._scrollbarSize = scrollbarSize = {
                width: div.offsetWidth - div.clientWidth,
                height: div.offsetHeight - div.clientHeight
            };

            db.removeChild(div);
        }

        return scrollbarSize;
    },

    
    typeOf: (function () {
        var nonWhitespaceRe = /\S/,
            toString = Object.prototype.toString,
            typeofTypes = {
                number: 1,
                string: 1,
                'boolean': 1,
                'undefined': 1
            },
            toStringTypes = {
                '[object Array]'  : 'array',
                '[object Date]'   : 'date',
                '[object Boolean]': 'boolean',
                '[object Number]' : 'number',
                '[object RegExp]' : 'regexp'
            };

        return function(value) {
            if (value === null) {
                return 'null';
            }

            var type = typeof value,
                ret, typeToString;

            if (typeofTypes[type]) {
                return type;
            }

            ret = toStringTypes[typeToString = toString.call(value)];
            if (ret) {
                return ret;
            }

            if (type === 'function') {
                return 'function';
            }

            if (type === 'object') {
                if (value.nodeType !== undefined) {
                    if (value.nodeType === 3) {
                        return nonWhitespaceRe.test(value.nodeValue) ? 'textnode' : 'whitespace';
                    }
                    else {
                        return 'element';
                    }
                }

                return 'object';
            }

            Ext.Error.raise({
                sourceClass: 'Ext',
                sourceMethod: 'typeOf',
                msg: 'Failed to determine the type of "' + value + '".'
            });

            return typeToString;
        };
    }()),

    
    factory: function(config, classReference, instance, aliasNamespace) {
        var manager = Ext.ClassManager,
            newInstance;

        
        
        if (!config || config.isInstance) {
            if (instance && instance !== config) {
                instance.destroy();
            }

            return config;
        }

        if (aliasNamespace) {
             
            if (typeof config == 'string') {
                return manager.instantiateByAlias(aliasNamespace + '.' + config);
            }
            
            else if (Ext.isObject(config) && 'type' in config) {
                return manager.instantiateByAlias(aliasNamespace + '.' + config.type, config);
            }
        }

        if (config === true) {
            return instance || Ext.create(classReference);
        }

        if (!Ext.isObject(config)) {
            Ext.Logger.error("Invalid config, must be a valid config object");
        }

        if ('xtype' in config) {
            newInstance = manager.instantiateByAlias('widget.' + config.xtype, config);
        }
        else if ('xclass' in config) {
            newInstance = Ext.create(config.xclass, config);
        }

        if (newInstance) {
            if (instance) {
                instance.destroy();
            }

            return newInstance;
        }

        if (instance) {
            return instance.setConfig(config);
        }

        return Ext.create(classReference, config);
    },

    
    log:
        (function () {
            
            var primitiveRe = /string|number|boolean/;
            function dumpObject (object, level, maxLevel, withFunctions) {
                var member, type, value, name, prefix, suffix,
                    members = [];

                if (Ext.isArray(object)) {
                    prefix = '[';
                    suffix = ']';
                } else if (Ext.isObject(object)) {
                    prefix = '{';
                    suffix = '}';
                }
                if (!maxLevel) {
                    maxLevel = 3;
                }
                if (level > maxLevel) {
                    return prefix+'...'+suffix;
                }

                level = level || 1;
                var spacer = (new Array(level)).join('    ');

                
                for (name in object) {
                    if (object.hasOwnProperty(name)) {
                        value = object[name];

                        type = typeof value;
                        if (type == 'function') {
                            if (!withFunctions) {
                                continue;
                            }
                            member = type;
                        } else if (type == 'undefined') {
                            member = type;
                        } else if (value === null || primitiveRe.test(type) || Ext.isDate(value)) {
                            member = Ext.encode(value);
                        } else if (Ext.isArray(value)) {
                            member = this.dumpObject(value, level+1, maxLevel, withFunctions);
                        } else if (Ext.isObject(value)) {
                            member = this.dumpObject(value, level+1, maxLevel, withFunctions);
                        } else {
                            member = type;
                        }
                        members.push(spacer + name + ': ' + member);    
                    }
                }
                if (members.length) {
                    return prefix + '\n    '+ members.join(',\n    ') + '\n'+spacer+suffix;
                }
                return prefix+suffix;
            }

            function log (message) {
                var options, dump,
                    con = Ext.global.console,
                    level = 'log',
                    indent = log.indent || 0,
                    stack,
                    out,
                    max;

                log.indent = indent;

                if (typeof message != 'string') {
                    options = message;
                    message = options.msg || '';
                    level = options.level || level;
                    dump = options.dump;
                    stack = options.stack;

                    if (options.indent) {
                        ++log.indent;
                    } else if (options.outdent) {
                        log.indent = indent = Math.max(indent - 1, 0);
                    }

                    if (dump && !(con && con.dir)) {
                        message += dumpObject(dump);
                        dump = null;
                    }
                }

                if (arguments.length > 1) {
                    message += Array.prototype.slice.call(arguments, 1).join('');
                }

                message = indent ? Ext.String.repeat(' ', log.indentSize * indent) + message : message;
                
                if (level != 'log') {
                    message = '[' + level.charAt(0).toUpperCase() + '] ' + message;
                }

                
                
                
                if (con) { 
                    if (con[level]) {
                        con[level](message);
                    } else {
                        con.log(message);
                    }

                    if (dump) {
                        con.dir(dump);
                    }

                    if (stack && con.trace) {
                        
                        if (!con.firebug || level != 'error') {
                            con.trace();
                        }
                    }
                } else if (Ext.isOpera) {
                    opera.postError(message);
                } else {
                    out = log.out;
                    max = log.max;

                    if (out.length >= max) {
                        
                        
                        Ext.Array.erase(out, 0, out.length - 3 * Math.floor(max / 4)); 
                    }

                    out.push(message);
                }

                
                ++log.count;
                ++log.counters[level];
            }

            function logx (level, args) {
                if (typeof args[0] == 'string') {
                    args.unshift({});
                }
                args[0].level = level;
                log.apply(this, args);
            }

            log.error = function () {
                logx('error', Array.prototype.slice.call(arguments));
            };
            log.info = function () {
                logx('info', Array.prototype.slice.call(arguments));
            };
            log.warn = function () {
                logx('warn', Array.prototype.slice.call(arguments));
            };

            log.count = 0;
            log.counters = { error: 0, warn: 0, info: 0, log: 0 };
            log.indentSize = 2;
            log.out = [];
            log.max = 750;

            return log;
        }()) ||
        (function () {
            var nullLog = function () {};
            nullLog.info = nullLog.warn = nullLog.error = Ext.emptyFn;
            return nullLog;
        }())
});


(function() {


    var 
        checkVerTemp = [''],
        endOfVersionRe = /([^\d\.])/,
        notDigitsRe = /[^\d]/g,
        plusMinusRe = /[\-+]/g,
        stripRe = /\s/g,
        underscoreRe = /_/g,
        Version;

    Ext.Version = Version = function(version, defaultMode) {
            var me = this,
                padModes = me.padModes,
                ch, i, pad, parts, release, releaseStartIndex, ver;

            if (version.isVersion) {
                version = version.version;
            }

            me.version = ver = String(version).toLowerCase().
                                    replace(underscoreRe, '.').replace(plusMinusRe, '');

            ch = ver.charAt(0);
            if (ch in padModes) {
                ver = ver.substring(1);
                pad = padModes[ch];
            } else {
                pad = defaultMode ? padModes[defaultMode] : 0; 
            }
            me.pad = pad;

            releaseStartIndex = ver.search(endOfVersionRe);
            me.shortVersion = ver;

            if (releaseStartIndex !== -1) {
                me.release = release = ver.substr(releaseStartIndex, version.length);
                me.shortVersion = ver.substr(0, releaseStartIndex);
                release = Version.releaseValueMap[release] || release;
            }

            me.releaseValue = release || pad;
            me.shortVersion = me.shortVersion.replace(notDigitsRe, '');

            
            me.parts = parts = ver.split('.');
            for (i = parts.length; i--; ) {
                parts[i] = parseInt(parts[i], 10);
            }
            if (pad === Infinity) {
                
                parts.push(pad);
            }

            
            me.major = parts[0] || pad;

            
            me.minor = parts[1] || pad;

            
            me.patch = parts[2] || pad;

            
            me.build = parts[3] || pad;

            return me;
    };

    Version.prototype = {
        isVersion: true,

        padModes: {
            '~': NaN,
            '^': Infinity
        },

        
        release: '',

        
        compareTo: function (other) {
             
             
            var me = this,
                lhsPad = me.pad,
                lhsParts = me.parts,
                lhsLength = lhsParts.length,
                rhsVersion = other.isVersion ? other : new Version(other),
                rhsPad = rhsVersion.pad,
                rhsParts = rhsVersion.parts,
                rhsLength = rhsParts.length,
                length = Math.max(lhsLength, rhsLength),
                i, lhs, rhs;

            for (i = 0; i < length; i++) {
                lhs = (i < lhsLength) ? lhsParts[i] : lhsPad;
                rhs = (i < rhsLength) ? rhsParts[i] : rhsPad;

                
                
                if (lhs < rhs) {
                    return -1;
                }
                if (lhs > rhs) {
                    return 1;
                }
            }

            
            lhs = me.releaseValue;
            rhs = rhsVersion.releaseValue;
            if (lhs < rhs) {
                return -1;
            }
            if (lhs > rhs) {
                return 1;
            }

            return 0;
        },
               
        
        toString: function() {
            return this.version;
        },

        
        valueOf: function() {
            return this.version;
        },

        
        getMajor: function() {
            return this.major;
        },

        
        getMinor: function() {
            return this.minor;
        },

        
        getPatch: function() {
            return this.patch;
        },

        
        getBuild: function() {
            return this.build;
        },

        
        getRelease: function() {
            return this.release;
        },

        
        getReleaseValue: function() {
            return this.releaseValue;
        },

        
        isGreaterThan: function(target) {
            return this.compareTo(target) > 0;
        },

        
        isGreaterThanOrEqual: function(target) {
            return this.compareTo(target) >= 0;
        },

        
        isLessThan: function(target) {
            return this.compareTo(target) < 0;
        },

        
        isLessThanOrEqual: function(target) {
            return this.compareTo(target) <= 0;
        },

        
        equals: function(target) {
            return this.compareTo(target) === 0;
        },

        
        match: function(target) {
            target = String(target);
            return this.version.substr(0, target.length) === target;
        },

        
        toArray: function() {
            var me = this;
            return [me.getMajor(), me.getMinor(), me.getPatch(), me.getBuild(), me.getRelease()];
        },

        
        getShortVersion: function() {
            return this.shortVersion;
        },

        
        gt: function (target) {
            return this.compareTo(target) > 0;
        },

        
        lt: function (target) {
            return this.compareTo(target) < 0;
        },

        
        gtEq: function (target) {
            return this.compareTo(target) >= 0;
        },

        
        ltEq: function (target) {
            return this.compareTo(target) <= 0;
        }
    };

    Ext.apply(Version, {
        aliases: {
            from: {
                extjs: 'ext',
                core: 'sencha-core'
            },
            to: {
                ext: ['extjs'],
                'sencha-core': ['core']
            }
        },

        
        releaseValueMap: {
            dev:   -6,
            alpha: -5,
            a:     -5,
            beta:  -4,
            b:     -4,
            rc:    -3,
            '#':   -2,
            p:     -1,
            pl:    -1
        },

        
        getComponentValue: function(value) {
            return !value ? 0 : (isNaN(value) ? this.releaseValueMap[value] || value : parseInt(value, 10));
        },

        
        compare: function (current, target) {
            var ver = current.isVersion ? current : new Version(current);
            return ver.compareTo(target);
        },

        set: function (collection, packageName, version) {
            var aliases = Version.aliases.to[packageName],
                ver = version.isVersion ? version : new Version(version),
                i;

            collection[packageName] = ver;
            if (aliases) {
                for (i = aliases.length; i-- > 0; ) {
                    collection[aliases[i]] = ver;
                }
            }

            return ver;
        }
    });

    
    Ext.apply(Ext, {
        
        compatVersions: {},

        
        versions: {},

        
        lastRegisteredVersion: null,

        
        getCompatVersion: function (packageName) {
            var versions = Ext.compatVersions,
                compat;

            if (!packageName) {
                compat = versions.ext || versions.touch || versions.core;
            } else {
                compat = versions[Version.aliases.from[packageName] || packageName];
            }

            return compat || Ext.getVersion(packageName);
        },

        
        setCompatVersion: function (packageName, version) {
            Version.set(Ext.compatVersions, packageName, version);
        },

        
        setVersion: function (packageName, version) {
            Ext.lastRegisteredVersion = Version.set(Ext.versions, packageName, version);
            return this;
        },

        
        getVersion: function (packageName) {
            var versions = Ext.versions;

            if (!packageName) {
                return versions.ext || versions.touch || versions.core;
            }

            return versions[Version.aliases.from[packageName] || packageName];
        },

        
        checkVersion: function (specs, matchAll) {
            var isArray = Ext.isArray(specs),
                aliases = Version.aliases.from,
                compat = isArray ? specs : checkVerTemp,
                length = compat.length,
                versions = Ext.versions,
                frameworkVer = versions.ext || versions.touch,
                i, index, matches, minVer, maxVer, packageName, spec, range, ver;

            if (!isArray) {
                checkVerTemp[0] = specs;
            }

            for (i = 0; i < length; ++i) {
                if (!Ext.isString(spec = compat[i])) {
                    matches = Ext.checkVersion(spec.and || spec.or, !spec.or);
                    if (spec.not) {
                        matches = !matches;
                    }
                } else {
                    if (spec.indexOf(' ') >= 0) {
                        spec = spec.replace(stripRe, '');
                    }

                    
                    
                    index = spec.indexOf('@');
                    if (index < 0) {
                        range = spec;
                        ver = frameworkVer;
                    } else {
                        packageName = spec.substring(0, index);
                        if (!(ver = versions[aliases[packageName] || packageName])) {
                            
                            
                            if (matchAll) {
                                return false;
                            }
                            
                            
                            continue;
                        }
                        range = spec.substring(index+1);
                    }

                    
                    index = range.indexOf('-');
                    if (index < 0) {
                        
                        if (range.charAt(index = range.length - 1) === '+') {
                            minVer = range.substring(0, index);
                            maxVer = null;
                        } else {
                            minVer = maxVer = range;
                        }
                    } else if (index > 0) {
                        
                        minVer = range.substring(0, index);
                        maxVer = range.substring(index+1); 
                    } else {
                        
                        minVer = null;
                        maxVer = range.substring(index+1);
                    }

                    matches = true;
                    if (minVer) {
                        minVer = new Version(minVer, '~'); 
                        matches = minVer.ltEq(ver);
                    }
                    if (matches && maxVer) {
                        maxVer = new Version(maxVer, '~'); 
                        matches = maxVer.gtEq(ver);
                    }
                } 

                if (matches) {
                    
                    if (!matchAll) {
                        return true;
                    }
                } else if (matchAll) {
                    
                    return false;
                }
            }

            
            
            
            
            return !!matchAll;
        },

        
        deprecate: function(packageName, since, closure, scope) {
            if (Version.compare(Ext.getVersion(packageName), since) < 1) {
                closure.call(scope);
            }
        }
    }); 
}());


(function (manifest){
    var packages = (manifest && manifest.packages) || {},
        compat = manifest && manifest.compatibility,
        name, pkg;
    
    for (name in packages) {
        pkg = packages[name];
        Ext.setVersion(name, pkg.version);
    }

    if (compat) {
        if (Ext.isString(compat)) {
            Ext.setCompatVersion('core', compat);
        } else {
            for (name in compat) {
                Ext.setCompatVersion(name, compat[name]);
            }
        }
    }

    if (!packages.ext && !packages.touch) {
        Ext.setVersion('ext', '5');
    }
})(Ext.manifest);


Ext.Config = function (name) {



    var me = this,
        capitalizedName = name.charAt(0).toUpperCase() + name.substr(1);

    
    me.name = name;

    
    me.names = {
        internal: '_' + name,
        initializing: 'is' + capitalizedName + 'Initializing',
        apply: 'apply' + capitalizedName,
        update: 'update' + capitalizedName,
        get: 'get' + capitalizedName,
        set: 'set' + capitalizedName,
        initGet: 'initGet' + capitalizedName,
        doSet : 'doSet' + capitalizedName,
        changeEvent: name.toLowerCase() + 'change'
    };

    
    
    me.root = me;
};

Ext.Config.map = {};

Ext.Config.get = function (name) {
    var map = Ext.Config.map,
        ret = map[name] || (map[name] = new Ext.Config(name));

    return ret;
};

Ext.Config.prototype = {
    self: Ext.Config,

    isConfig: true,

    

    

    

    getGetter: function () {
        return this.getter || (this.root.getter = this.makeGetter());
    },
    
    getInitGetter: function () {
        return this.initGetter || (this.root.initGetter = this.makeInitGetter());
    },

    getSetter: function () {
        return this.setter || (this.root.setter = this.makeSetter());
    },

    
    getInternalName: function (target) {
        return target.$configPrefixed ? this.names.internal : this.name;
    },

    mergeNew: function (newValue, oldValue, target, mixinClass) {
        var ret, key;

        if (!oldValue) {
            ret = newValue;
        } else if (!newValue) {
            ret = oldValue;
        } else {
            ret = Ext.Object.chain(oldValue);

            for (key in newValue) {
                if (!mixinClass || !(key in ret)) {
                    ret[key] = newValue[key];
                }
            }
        }
        return ret;
    },

    
    mergeSets: function (newValue, oldValue, preserveExisting) {
        var ret = oldValue ? Ext.Object.chain(oldValue) : {},
            i, val;

        if (newValue instanceof Array) {
            for (i = newValue.length; i--; ) {
                val = newValue[i];
                if (!preserveExisting || !(val in ret)) {
                    ret[val] = true;
                }
            }
        } else if (newValue) {
            if (newValue.constructor === Object) {
                for (i in newValue) {
                    val = newValue[i];
                    if (!preserveExisting || !(i in ret)) {
                        ret[i] = val;
                    }
                }
            } else if (!preserveExisting || !(newValue in ret)) {
                ret[newValue] = true;
            }
        }

        return ret;
    },

    
    

    makeGetter: function () {
        var name = this.name,
            prefixedName = this.names.internal;

        return function () {
            var internalName = this.$configPrefixed ? prefixedName : name;
            return this[internalName];
        };
    },

    makeInitGetter: function () {
        var name = this.name,
            names = this.names,
            setName = names.set,
            getName = names.get,
            initializingName = names.initializing;

        return function () {
            var me = this;

            me[initializingName] = true;
            
            delete me[getName];

            me[setName](me.config[name]);
            delete me[initializingName];

            return me[getName].apply(me, arguments);
        };
    },

    makeSetter: function () {
        var name = this.name,
            names = this.names,
            prefixedName = names.internal,
            getName = names.get,
            applyName = names.apply,
            updateName = names.update,
            setter;

        
        
        setter = function (value) {
            var me = this,
                internalName = me.$configPrefixed ? prefixedName : name,
                oldValue = me[internalName];

            
            delete me[getName];

            if (!me[applyName] || (value = me[applyName](value, oldValue)) !== undefined) {
                
                
                if (value !== (oldValue = me[internalName])) {
                    me[internalName] = value;

                    if (me[updateName]) {
                        me[updateName](value, oldValue);
                    }
                }
            }

            return me;
        };

        setter.$isDefault = true;

        return setter;
    }
};


(function () { 

var ExtConfig = Ext.Config,
    configPropMap = ExtConfig.map,
    ExtObject = Ext.Object;

Ext.Configurator = function (cls) {




    var me = this,
        prototype = cls.prototype,
        zuper = cls.superclass ? cls.superclass.self.$config : null;

    
    me.cls = cls;
    
    if (zuper) {
        
        me.configs = ExtObject.chain(zuper.configs);
        
        
        me.cachedConfigs = ExtObject.chain(zuper.cachedConfigs);

        
        me.initMap = ExtObject.chain(zuper.initMap);

        
        me.values = ExtObject.chain(zuper.values);
    } else {
        me.configs = {};
        me.cachedConfigs = {};
        me.initMap = {};
        me.values = {};
    }

    prototype.config = prototype.defaultConfig = me.values;
    cls.$config = me;
};

Ext.Configurator.prototype = {
    self: Ext.Configurator,

    
    initList: null,

    
    add: function (config, mixinClass) {
        var me = this,
            Cls = me.cls,
            configs = me.configs,
            cachedConfigs = me.cachedConfigs,
            initMap = me.initMap,
            prototype = Cls.prototype,
            mixinConfigs = mixinClass && mixinClass.$config.configs,
            values = me.values,
            isObject, meta, isCached, merge,
            cfg, currentValue, name, names, s, value;

        for (name in config) {
            value = config[name];
            isObject = value && value.constructor === Object;
            meta = isObject && '$value' in value ? value : null;
            if (meta) {
                isCached = !!meta.cached;
                value = meta.$value;
            }

            merge = meta && meta.merge;

            cfg = configs[name];
            if (cfg) {
                
                if (mixinClass) {
                    merge = cfg.merge;
                    if (!merge) {
                        continue;
                    }
                    
                    meta = null;
                } else {
                    merge = merge || cfg.merge;
                }

                
                
                if (!mixinClass && isCached && !cachedConfigs[name]) {
                    Ext.Error.raise('Redefining config as cached: ' + name + ' in class: ' + Cls.$className);
                }

                
                
                
                currentValue = values[name];

                if (merge) {
                    value = merge.call(cfg, value, currentValue, Cls, mixinClass);
                } else if (isObject) {
                    if (currentValue && currentValue.constructor === Object) {
                        
                        
                        
                        
                        
                        value = ExtObject.merge({}, currentValue, value);
                    }
                    
                }
                
            } else {
                
                
                
                if (mixinConfigs) {
                    
                    
                    
                    cfg = mixinConfigs[name];
                    meta = null;
                } else {
                    cfg = ExtConfig.get(name);
                }

                configs[name] = cfg;
                if (cfg.cached || isCached) {
                    cachedConfigs[name] = true;
                }

                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                
                names = cfg.names;
                if (!prototype[s = names.get]) {
                    prototype[s] = cfg.getGetter();
                }
                if (!prototype[s = names.set]) {
                    prototype[s] = cfg.getSetter();
                }
            }

            if (meta) {
                if (cfg.owner !== Cls) {
                    configs[name] = cfg = Ext.Object.chain(cfg);
                    cfg.owner = Cls;
                }
                Ext.apply(cfg, meta);
                delete cfg.$value;
            }

            
            if (value !== null) {
                initMap[name] = true;
            } else {
                if (prototype.$configPrefixed) {
                    prototype[configs[name].names.internal] = null;
                } else {
                    prototype[configs[name].name] = null;
                }
                if (name in initMap) {
                    
                    initMap[name] = false;
                }
            }
            values[name] = value;
        }
    },

    
    configure: function (instance, instanceConfig) {
        var me = this,
            configs = me.configs,
            initMap = me.initMap,
            initListMap = me.initListMap,
            initList = me.initList,
            prototype = me.cls.prototype,
            
            
            values = ExtObject.fork(me.values),
            notStrict = !instance.$configStrict,
            remaining = 0,
            firstInstance = !initList,
            cachedInitList, cfg, getter, needsInit, i, internalName,
            ln, names, name, value, isCached, merge, valuesKey;

        if (firstInstance) {
            
            
            me.initList = initList = [];
            me.initListMap = initListMap = {};
            instance.isFirstInstance = true;

            for (name in initMap) {
                needsInit = initMap[name];
                cfg = configs[name];
                isCached = cfg.cached;
                if (needsInit) {
                    names = cfg.names;
                    value = values[name];

                    if (!prototype[names.set].$isDefault
                                || prototype[names.apply] || prototype[names.update]
                                || typeof value === 'object') {
                        if (isCached) {
                            
                            
                            
                            
                            
                            (cachedInitList || (cachedInitList = [])).push(cfg);
                        } else {
                            
                            
                            initList.push(cfg);
                            initListMap[name] = true;
                        }

                        
                        
                        
                        instance[names.get] = cfg.initGetter || cfg.getInitGetter();
                    } else {
                        
                        
                        prototype[cfg.getInternalName(prototype)] = value;
                    }
                } else if (isCached) {
                    prototype[cfg.getInternalName(prototype)] = undefined;
                }
            }
        }

        ln = cachedInitList && cachedInitList.length;
        if (ln) {
            
            
            
            

            for (i = 0; i < ln; ++i) {
                internalName = cachedInitList[i].getInternalName(prototype);
                
                
                
                instance[internalName] = null;
            }

            for (i = 0; i < ln; ++i) {
                names = (cfg = cachedInitList[i]).names;
                getter = names.get;

                if (instance.hasOwnProperty(getter)) {
                    instance[names.set](values[cfg.name]);
                    delete instance[getter];
                }
            }

            for (i = 0; i < ln; ++i) {
                internalName = cachedInitList[i].getInternalName(prototype);
                prototype[internalName] = instance[internalName];
                delete instance[internalName];
            }

            
            
        }

        if (firstInstance) {
            
            
            
            if (instance.afterCachedConfig && !instance.afterCachedConfig.$nullFn) {
                instance.afterCachedConfig(instanceConfig);
            }
        }

        
        instance.isConfiguring = true;

        
        
        
        instance.config = values;
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        

        for (i = 0, ln = initList.length; i < ln; ++i) {
            cfg = initList[i];
            instance[cfg.names.get] = cfg.initGetter || cfg.getInitGetter();
        }

        
        if (instance.transformInstanceConfig) {
            instanceConfig = instance.transformInstanceConfig(instanceConfig);
        }

        
        
        
        
        
        
        
        
        
        
        
        
        if (instanceConfig) {
            for (name in instanceConfig) {
                value = instanceConfig[name];
                cfg = configs[name];
                if (!cfg) {
                    
                    
                    if (notStrict) {
                        instance[name] = value;
                    }
                } else {
                    
                    
                    if (!cfg.lazy) {
                        ++remaining;    
                    }
                    if (!initListMap[name]) {
                        instance[cfg.names.get] = cfg.initGetter || cfg.getInitGetter();
                    }

                    merge = cfg.merge;
                    if (merge) {
                        value = merge.call(cfg, value, values[name], instance);
                    } else if (value && value.constructor === Object) {
                        valuesKey = values[name];
                        if (valuesKey && valuesKey.constructor === Object) {
                            value = ExtObject.merge(values[name], value);
                        } else {
                            value = Ext.clone(value);
                        }
                    }
                }
                values[name] = value;
            }
        }

        
        if (instance.beforeInitConfig && !instance.beforeInitConfig.$nullFn) {
            if (instance.beforeInitConfig(instanceConfig) === false) {
                return;
            }
        }

        if (instanceConfig) {
            for (name in instanceConfig) {
                if (!remaining) {
                    
                    
                    break;
                }

                cfg = configs[name];
                if (cfg && !cfg.lazy) {
                    --remaining;
                    
                    names = cfg.names;
                    getter = names.get;

                    
                    
                    
                    
                    if (instance.hasOwnProperty(getter)) {
                        instance[names.set](values[name]);

                        
                        
                        
                        delete instance[names.get];
                    }
                }
            }
        }

        
        for (i = 0, ln = initList.length; i < ln; ++i) {
            cfg = initList[i];
            names = cfg.names;
            getter = names.get;

            if (!cfg.lazy && instance.hasOwnProperty(getter)) {
                
                
                
                
                instance[names.set](values[cfg.name]);
                delete instance[getter];
            }
        }

        
        delete instance.isConfiguring;
    },

    getCurrentConfig: function (instance) {
        var defaultConfig = instance.defaultConfig,
            config = {},
            name;

        for (name in defaultConfig) {
            config[name] = instance[configPropMap[name].names.get]();
        }

        return config;
    },

    
    merge: function(instance, baseConfig, config) {
        
        
        var configs = this.configs,
            name, value, baseValue, cfg, merge;

        for (name in config) {
            value = config[name];
            cfg = configs[name];
            if (cfg) {
                merge = cfg.merge;
                if (merge) {
                    value = merge.call(cfg, value, baseConfig[name], instance);
                } else if (value && value.constructor === Object) {
                    baseValue = baseConfig[name];
                    if (baseValue && baseValue.constructor === Object) {
                        value = Ext.Object.merge(baseValue, value);
                    } else {
                        value = Ext.clone(value);
                    }
                }
            }
            baseConfig[name] = value;
        }

        return baseConfig;
    },

    
    reconfigure: function (instance, instanceConfig, options) {
        var currentConfig = instance.config,
            initialConfig = instance.initialConfig,
            configList = [],
            strict = instance.$configStrict,
            configs = this.configs,
            defaults = options && options.defaults,
            applyProps = options && options.strict === false,
            cfg, getter, i, len, name, names, setter;

        for (name in instanceConfig) {
            if (defaults && instance.hasOwnProperty(name)) {
                continue;
            }

            currentConfig[name] = instanceConfig[name];
            cfg = configs[name];

            if (cfg) {
                
                
                instance[cfg.names.get] = cfg.initGetter || cfg.getInitGetter();
            } else if (strict) {
                if (name !== 'type') {
                    Ext.log.error('No such config "' + name + '" for class ' +
                                  instance.$className);
                }
                continue;
            }

            configList.push(name);
        }

        for (i = 0, len = configList.length; i < len; i++) {
            name = configList[i];
            cfg = configs[name];

            if (cfg) {
                names = cfg.names;
                getter = names.get;

                if (instance.hasOwnProperty(getter)) {
                    
                    
                    
                    
                    instance[names.set](instanceConfig[name]);
                    delete instance[getter];
                }
            } else if (!strict) {
                cfg = configPropMap[name] || Ext.Config.get(name);
                names = cfg.names;

                if (instance[names.set]) {
                    instance[names.set](instanceConfig[name]);
                } else if (applyProps) {
                    
                    instance[name] = instanceConfig[name];
                }
                else if (name !== 'type') {
                    Ext.Error.raise('Config "' + name + '" has no setter on class ' +
                                    instance.$className);
                }
            }
        }
    }
};

}()); 



Ext.Base = (function(flexSetter) {





var noArgs = [],
    baseStaticMember,
    baseStaticMembers = [],
    getConfig = function (name, peek) {
        var me = this,
            ret, cfg, getterName;

        if (name) {
            cfg = Ext.Config.map[name];
            if (!cfg) {
                Ext.Logger.error("Invalid property name for getter: '" + name + "' for '" + me.$className + "'.");
            }
            getterName = cfg.names.get;
            if (peek && me.hasOwnProperty(getterName)) {
                ret = me.config[name];
            } else {
                ret = me[getterName]();
            }
        } else {
            ret = me.getCurrentConfig();
        }
        return ret;
    },
    makeDeprecatedMethod = function (oldName, newName, msg) {
        var message = '"'+ oldName +'" is deprecated.';

        if (msg) {
            message += ' ' + msg;
        } else if (newName) {
            message += ' Please use "'+ newName +'" instead.';
        }

        return function () {
            Ext.Error.raise(message);
        };
    },
    addDeprecatedProperty = function (object, oldName, newName, message) {
        if (!message) {
            message = '"' + oldName + '" is deprecated.';
        }
        if (newName) {
            message += ' Please use "' + newName + '" instead.';
        }

        if (message) {
            Ext.Object.defineProperty(object, oldName, {
                get: function() {
                    Ext.Error.raise(message);
                },
                set: function(value) {
                    Ext.Error.raise(message);
                },
                configurable: true
            });
        }
    },
    makeAliasFn = function (name) {
        return function () {
            return this[name].apply(this, arguments);
        };
    },
    Version = Ext.Version,
    leadingDigitRe = /^\d/,
    oneMember = {},
    aliasOneMember = {},
    Base = function(){},
    BasePrototype = Base.prototype;

    
    Ext.apply(Base, {
        $className: 'Ext.Base',

        $isClass: true,

        
        create: function() {
            return Ext.create.apply(Ext, [this].concat(Array.prototype.slice.call(arguments, 0)));
        },

        
        addDeprecations: function (deprecations) {
            var me = this,
                all = [],
                compatVersion = Ext.getCompatVersion(deprecations.name),
                displayName = (me.$className || '') + '#',
                deprecate, versionSpec, index, message, target,
                enabled, existing, fn, names, oldName, newName, member, statics, version;

            for (versionSpec in deprecations) {
                if (leadingDigitRe.test(versionSpec)) {
                    version = new Ext.Version(versionSpec);
                    version.deprecations = deprecations[versionSpec];
                    all.push(version);
                }
            }

            all.sort(Version.compare);

            for (index = all.length; index--; ) {
                deprecate = (version = all[index]).deprecations;
                target = me.prototype;
                statics = deprecate.statics;

                
                
                
                
                
                
                enabled = compatVersion && compatVersion.lt(version);

                if (!enabled) {} else
                if (!enabled) {
                    
                    break;
                }

                while (deprecate) {
                    names = deprecate.methods;
                    if (names) {
                        for (oldName in names) {
                            member = names[oldName];
                            fn = null;

                            if (!member) {
                                

                                
                                Ext.Assert.isNotDefinedProp(target, oldName);

                                fn = makeDeprecatedMethod(displayName + oldName);
                            } else if (Ext.isString(member)) {
                                

                                
                                Ext.Assert.isNotDefinedProp(target, oldName);
                                Ext.Assert.isDefinedProp(target, member);

                                if (enabled) {
                                    
                                    
                                    fn = makeAliasFn(member);
                                }
                                else {
                                    fn = makeDeprecatedMethod(displayName + oldName, member);
                                }
                            } else {
                                
                                message = '';
                                if (member.message || member.fn) {
                                    message = member.message;
                                    member = member.fn;
                                }

                                existing = target.hasOwnProperty(oldName) && target[oldName];

                                if (enabled && member) {
                                    member.$owner = me;
                                    member.$name = oldName;
                                    member.displayName = displayName + oldName;
                                    if (existing) {
                                        member.$previous = existing;
                                    }

                                    fn = member;
                                }
                                else if (!existing) {
                                    fn = makeDeprecatedMethod(displayName + oldName, null,
                                                              message);
                                }
                            }

                            if (fn) {
                                target[oldName] = fn;
                            }
                        } 
                    }

                    names = deprecate.properties;
                    if (names && !enabled) {
                        
                        
                        
                        for (oldName in names) {
                            newName = names[oldName];

                            if (Ext.isString(newName)) {
                                addDeprecatedProperty(target, displayName + oldName, newName);
                            } else if (newName && newName.message) {
                                addDeprecatedProperty(target, displayName + oldName, null,
                                                      newName.message);
                            } else {
                                addDeprecatedProperty(target, displayName + oldName);
                            }
                        }
                    }

                    
                    deprecate = statics;
                    statics = null;
                    target = me;
                }
            }
        },

        
        extend: function(parent) {
            var me = this,
                parentPrototype = parent.prototype,
                prototype, i, ln, name, statics;

            prototype = me.prototype = Ext.Object.chain(parentPrototype);
            prototype.self = me;

            me.superclass = prototype.superclass = parentPrototype;

            if (!parent.$isClass) {
                for (i in BasePrototype) {
                    if (i in prototype) {
                        prototype[i] = BasePrototype[i];
                    }
                }
            }

            
            statics = parentPrototype.$inheritableStatics;

            if (statics) {
                for (i = 0,ln = statics.length; i < ln; i++) {
                    name = statics[i];

                    if (!me.hasOwnProperty(name)) {
                        me[name] = parent[name];
                    }
                }
            }

            if (parent.$onExtended) {
                me.$onExtended = parent.$onExtended.slice();
            }

            me.getConfigurator();
        },

        
        $onExtended: [],

        
        triggerExtended: function() {
            Ext.classSystemMonitor && Ext.classSystemMonitor(this, 'Ext.Base#triggerExtended', arguments);
        
            var callbacks = this.$onExtended,
                ln = callbacks.length,
                i, callback;

            if (ln > 0) {
                for (i = 0; i < ln; i++) {
                    callback = callbacks[i];
                    callback.fn.apply(callback.scope || this, arguments);
                }
            }
        },

        
        onExtended: function(fn, scope) {
            this.$onExtended.push({
                fn: fn,
                scope: scope
            });

            return this;
        },

        
        addStatics: function (members) {
            this.addMembers(members, true);
            return this;
        },

        
        addInheritableStatics: function(members) {
            var inheritableStatics,
                hasInheritableStatics,
                prototype = this.prototype,
                name, member;

            inheritableStatics = prototype.$inheritableStatics;
            hasInheritableStatics = prototype.$hasInheritableStatics;

            if (!inheritableStatics) {
                inheritableStatics = prototype.$inheritableStatics = [];
                hasInheritableStatics = prototype.$hasInheritableStatics = {};
            }

            var className = Ext.getClassName(this) + '.';

            for (name in members) {
                if (members.hasOwnProperty(name)) {
                    member = members[name];
                    if (typeof member == 'function') {
                        member.displayName = className + name;
                    }
                    this[name] = member;

                    if (!hasInheritableStatics[name]) {
                        hasInheritableStatics[name] = true;
                        inheritableStatics.push(name);
                    }
                }
            }

            return this;
        },

        
        addMembers: function (members, isStatic, privacy) {
            var me = this, 
                cloneFunction = Ext.Function.clone,
                target = isStatic ? me : me.prototype,
                defaultConfig = !isStatic && target.defaultConfig,
                enumerables = Ext.enumerables,
                privates = members.privates,
                configs, i, ln, member, name, subPrivacy, privateStatics;

            var displayName = (me.$className || '') + '#';

            if (privates) {
                
                
                delete members.privates;
                if (!isStatic) {
                    privateStatics = privates.statics;
                    delete privates.statics;
                }
                
                subPrivacy = privates.privacy || privacy || 'framework';

                me.addMembers(privates, isStatic, subPrivacy);
                if (privateStatics) {
                    me.addMembers(privateStatics, true, subPrivacy);
                }
            }

            for (name in members) {
                if (members.hasOwnProperty(name)) {
                    member = members[name];

                    if (member && member.$nullFn && privacy !== member.$privacy) {
                        Ext.Error.raise('Cannot use stock function for private method ' +
                            (me.$className ? me.$className + '#' : '') + name);
                    }

                    if (typeof member === 'function' && !member.$isClass && !member.$nullFn) {
                        if (member.$owner) {
                            member = cloneFunction(member);
                        }

                        if (target.hasOwnProperty(name)) {
                            member.$previous = target[name];
                        }

                        
                        
                        member.$owner = me;
                        member.$name = name;

                        member.displayName = displayName + name;

                        var existing = target[name];

                        if (privacy) {
                            if (privacy === true) {
                                privacy = 'framework';
                            }

                            member.$privacy = privacy;

                            
                            
                            
                            
                            
                            
                            if (existing && existing.$privacy && existing.$privacy !== privacy) {
                                Ext.privacyViolation(me, existing, member, isStatic);
                            }
                        } else if (existing && existing.$privacy) {
                            Ext.privacyViolation(me, existing, member, isStatic);
                        }
                    
                    
                    } else if (defaultConfig && (name in defaultConfig) && !target.config.hasOwnProperty(name)) {
                        
                        
                        (configs || (configs = {}))[name] = member;
                        continue;
                    }

                    target[name] = member;
                }
            }

            if (configs) {
                
                me.addConfig(configs);
            }

            if (enumerables) {
                for (i = 0, ln = enumerables.length; i < ln; ++i) {
                    if (members.hasOwnProperty(name = enumerables[i])) {
                        member = members[name];

                        
                        if (member && !member.$nullFn) {
                            if (member.$owner) {
                                member = cloneFunction(member);
                            }

                            member.$owner = me;
                            member.$name = name;
                            member.displayName = displayName + name;

                            if (target.hasOwnProperty(name)) {
                                member.$previous = target[name];
                            }
                        }

                        target[name] = member;
                    }
                }
            }

            return this;
        },

        
        addMember: function (name, member) {
            oneMember[name] = member;
            this.addMembers(oneMember);
            delete oneMember[name];
            return this;
        },

        
        borrow: function(fromClass, members) {
            Ext.classSystemMonitor && Ext.classSystemMonitor(this, 'Ext.Base#borrow', arguments);

            var prototype = fromClass.prototype,
                membersObj = {},
                i, ln, name;

            members = Ext.Array.from(members);

            for (i = 0,ln = members.length; i < ln; i++) {
                name = members[i];
                membersObj[name] = prototype[name];
            }

            return this.addMembers(membersObj);
        },

        
        override: function(members) {
            var me = this,
                statics = members.statics,
                inheritableStatics = members.inheritableStatics,
                config = members.config,
                mixins = members.mixins,
                cachedConfig = members.cachedConfig;

            if (statics || inheritableStatics || config) {
                members = Ext.apply({}, members);
            }

            if (statics) {
                me.addMembers(statics, true);
                delete members.statics;
            }

            if (inheritableStatics){
                me.addInheritableStatics(inheritableStatics);
                delete members.inheritableStatics;
            }

            if (config) {
                me.addConfig(config);
                delete members.config;
            }
            
            if (cachedConfig) {
                me.addCachedConfig(cachedConfig);
                delete members.cachedConfig;
            }
            
            delete members.mixins;

            me.addMembers(members);
            if (mixins) {
                me.mixin(mixins);
            }
            return me;
        },

        
        callParent: function(args) {
            var method;

            
            return (method = this.callParent.caller) && (method.$previous ||
                  ((method = method.$owner ? method : method.caller) &&
                        method.$owner.superclass.self[method.$name])).apply(this, args || noArgs);
        },

        
        callSuper: function(args) {
            var method;

            
            return (method = this.callSuper.caller) &&
                    ((method = method.$owner ? method : method.caller) &&
                      method.$owner.superclass.self[method.$name]).apply(this, args || noArgs);
        },

        
        mixin: function(name, mixinClass) {
            var me = this,
                mixin, prototype, key, statics, i, ln, staticName, mixinValue, mixins;

            if (typeof name !== 'string') {
                mixins = name;
                if (mixins instanceof Array) {
                    for (i = 0,ln = mixins.length; i < ln; i++) {
                        mixin = mixins[i];
                        me.mixin(mixin.prototype.mixinId || mixin.$className, mixin);
                    }
                } else {
                    
                    
                    
                    
                    for (var mixinName in mixins) {
                        me.mixin(mixinName, mixins[mixinName]);
                    }
                }
                return;
            }

            mixin = mixinClass.prototype;
            prototype = me.prototype;

            if (mixin.onClassMixedIn) {
                mixin.onClassMixedIn.call(mixinClass, me);
            }

            if (!prototype.hasOwnProperty('mixins')) {
                if ('mixins' in prototype) {
                    prototype.mixins = Ext.Object.chain(prototype.mixins);
                }
                else {
                    prototype.mixins = {};
                }
            }

            for (key in mixin) {
                mixinValue = mixin[key];
                if (key === 'mixins') {
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    
                    Ext.applyIf(prototype.mixins, mixinValue);
                }
                else if (!(key === 'mixinId' || key === 'config') && (prototype[key] === undefined)) {
                    prototype[key] = mixinValue;
                }
            }

            
            statics = mixin.$inheritableStatics;

            if (statics) {
                for (i = 0, ln = statics.length; i < ln; i++) {
                    staticName = statics[i];

                    if (!me.hasOwnProperty(staticName)) {
                        me[staticName] = mixinClass[staticName];
                    }
                }
            }

            if ('config' in mixin) {
                me.addConfig(mixin.config, mixinClass);
            }

            prototype.mixins[name] = mixin;

            if (mixin.afterClassMixedIn) {
                mixin.afterClassMixedIn.call(mixinClass, me);
            }

            return me;
        },

        
        addConfig: function (config, mixinClass) {
            var cfg = this.$config || this.getConfigurator();
            cfg.add(config, mixinClass);
        },

        addCachedConfig: function(config, isMixin) {
            var cached = {},
                key;
                
            for (key in config) {
                cached[key] = {
                    cached: true,
                    $value: config[key]
                };
            }
            this.addConfig(cached, isMixin);
        },

        
        getConfigurator: function () {
            
            return this.$config || new Ext.Configurator(this);
        },

        
        getName: function() {
            return Ext.getClassName(this);
        },

        
        createAlias: flexSetter(function(alias, origin) {
            aliasOneMember[alias] = function() {
                return this[origin].apply(this, arguments);
            };
            this.override(aliasOneMember);
            delete aliasOneMember[alias];
        })
    });

    
    
    for (baseStaticMember in Base) {
        if (Base.hasOwnProperty(baseStaticMember)) {
            baseStaticMembers.push(baseStaticMember);
        }
    }

    Base.$staticMembers = baseStaticMembers;

    Base.getConfigurator(); 

    Base.addMembers({
        
        $className: 'Ext.Base',

        
        isInstance: true,

        
        $configPrefixed: true,
        
        
        $configStrict: true,

        
        isConfiguring: false,

        
        isFirstInstance: false,

        
        statics: function() {
            var method = this.statics.caller,
                self = this.self;

            if (!method) {
                return self;
            }

            return method.$owner;
        },

        
        callParent: function(args) {
            
            
            
            
            var method,
                superMethod = (method = this.callParent.caller) && (method.$previous ||
                        ((method = method.$owner ? method : method.caller) &&
                                method.$owner.superclass[method.$name]));

            if (!superMethod) {
                method = this.callParent.caller;
                var parentClass, methodName;

                if (!method.$owner) {
                    if (!method.caller) {
                        throw new Error("Attempting to call a protected method from the public scope, which is not allowed");
                    }

                    method = method.caller;
                }

                parentClass = method.$owner.superclass;
                methodName = method.$name;

                if (!(methodName in parentClass)) {
                    throw new Error("this.callParent() was called but there's no such method (" + methodName +
                                ") found in the parent class (" + (Ext.getClassName(parentClass) || 'Object') + ")");
                }
            }

            return superMethod.apply(this, args || noArgs);
        },

        
        callSuper: function(args) {
            
            
            
            
            var method,
                superMethod = (method = this.callSuper.caller) &&
                        ((method = method.$owner ? method : method.caller) &&
                          method.$owner.superclass[method.$name]);

            if (!superMethod) {
                method = this.callSuper.caller;
                var parentClass, methodName;

                if (!method.$owner) {
                    if (!method.caller) {
                        throw new Error("Attempting to call a protected method from the public scope, which is not allowed");
                    }

                    method = method.caller;
                }

                parentClass = method.$owner.superclass;
                methodName = method.$name;

                if (!(methodName in parentClass)) {
                    throw new Error("this.callSuper() was called but there's no such method (" + methodName +
                                ") found in the parent class (" + (Ext.getClassName(parentClass) || 'Object') + ")");
                }
            }

            return superMethod.apply(this, args || noArgs);
        },

        
        self: Base,

        
        constructor: function() {
            return this;
        },

        getConfigurator: function () {
            return this.$config || this.self.getConfigurator();
        },

        
        initConfig: function(instanceConfig) {
            var me = this,
                cfg = me.getConfigurator();

            me.initConfig = Ext.emptyFn; 
            me.initialConfig = instanceConfig || {};
            cfg.configure(me, instanceConfig);

            return me;
        },

        beforeInitConfig: Ext.emptyFn,

        
        getConfig: getConfig,

        
        setConfig: function(name, value,  options) {
            
            
            
            
            
            var me = this,
                config;

            if (name) {
                if (typeof name === 'string') {
                    config = {};
                    config[name] = value;
                } else {
                    config = name;
                }

                me.getConfigurator().reconfigure(me, config, options);
            }

            return me;
        },

        
        getCurrentConfig: function() {
            var cfg = this.getConfigurator();

            return cfg.getCurrentConfig(this);
        },

        
        hasConfig: function(name) {
            return name in this.defaultConfig;
        },

        
        getInitialConfig: function(name) {
            var config = this.config;

            if (!name) {
                return config;
            }

            return config[name];
        },

        $links: null,

        
        link: function (name, value) {
            var me = this,
                links = me.$links || (me.$links = {});

            links[name] = true;
            me[name] = value;

            return value;
        },

        
        unlink: function (names) {
            var me = this,
                i, ln, link, value;

            if (!Ext.isArray(names)) {
                Ext.Error.raise('Invalid argument - expected array of strings');
            }

            for (i = 0, ln = names.length; i < ln; i++) {
                link = names[i];
                value = me[link];

                if (value) {
                    if (value.isInstance && !value.isDestroyed) {
                        value.destroy();
                    }
                    else if (value.parentNode && 'nodeType' in value) {
                        value.parentNode.removeChild(value);
                    }
                }

                me[link] = null;
            }

            return me;
        },

        
        destroy: function() {
            var me = this,
                links = me.$links;

            me.destroy = Ext.emptyFn;
            me.isDestroyed = true;

            if (links) {
                me.$links = null;
                me.unlink(Ext.Object.getKeys(links));
            }
        }
    });

    
    BasePrototype.callOverridden = BasePrototype.callParent;

    Ext.privacyViolation = function (cls, existing, member, isStatic) {
        var name = member.$name,
            conflictCls = existing.$owner && existing.$owner.$className,
            s = isStatic ? 'static ' : '',
            msg = member.$privacy
                ? 'Private ' + s + member.$privacy + ' method "' + name + '"'
                : 'Public ' + s + 'method "' + name + '"';

        if (cls.$className) {
            msg = cls.$className + ': ' + msg;
        }

        if (!existing.$privacy) {
            msg += conflictCls
                ? ' hides public method inherited from ' + conflictCls
                : ' hides inherited public method.';
        } else {
            msg += conflictCls
                ? ' conflicts with private ' + existing.$privacy +
                  ' method declared by ' + conflictCls
                : ' conflicts with inherited private ' + existing.$privacy + ' method.';
        }

        var compat = Ext.getCompatVersion();
        var ver = Ext.getVersion();

        
        if (ver && compat && compat.lt(ver)) {
            Ext.log.error(msg);
        } else {
            Ext.Error.raise(msg);
        }
    };

    return Base;
}(Ext.Function.flexSetter));


(function() {




    var ExtClass,
        Base = Ext.Base,
        baseStaticMembers = Base.$staticMembers;

    
    function makeCtor (className) {
        function constructor () {
            
            
            return this.constructor.apply(this, arguments) || null;
        }
        if (className) {
            constructor.displayName = className;
        }
        return constructor;
    }

    
    Ext.Class = ExtClass = function(Class, data, onCreated) {
        if (typeof Class != 'function') {
            onCreated = data;
            data = Class;
            Class = null;
        }

        if (!data) {
            data = {};
        }

        Class = ExtClass.create(Class, data);

        ExtClass.process(Class, data, onCreated);

        return Class;
    };

    Ext.apply(ExtClass, {
        
        makeCtor: makeCtor,
        
        
        onBeforeCreated: function(Class, data, hooks) {
            Ext.classSystemMonitor && Ext.classSystemMonitor(Class, '>> Ext.Class#onBeforeCreated', arguments);
        
            Class.addMembers(data);

            hooks.onCreated.call(Class, Class);

            Ext.classSystemMonitor && Ext.classSystemMonitor(Class, '<< Ext.Class#onBeforeCreated', arguments);
        },

        
        create: function (Class, data) {
            var i = baseStaticMembers.length,
                name;

            if (!Class) {
                Class = makeCtor(
                    data.$className
                );
            }

            while (i--) {
                name = baseStaticMembers[i];
                Class[name] = Base[name];
            }

            return Class;
        },

        
        process: function(Class, data, onCreated) {
            var preprocessorStack = data.preprocessors || ExtClass.defaultPreprocessors,
                registeredPreprocessors = this.preprocessors,
                hooks = {
                    onBeforeCreated: this.onBeforeCreated
                },
                preprocessors = [],
                preprocessor, preprocessorsProperties,
                i, ln, j, subLn, preprocessorProperty;

            delete data.preprocessors;
            Class._classHooks = hooks;

            for (i = 0,ln = preprocessorStack.length; i < ln; i++) {
                preprocessor = preprocessorStack[i];

                if (typeof preprocessor == 'string') {
                    preprocessor = registeredPreprocessors[preprocessor];
                    preprocessorsProperties = preprocessor.properties;

                    if (preprocessorsProperties === true) {
                        preprocessors.push(preprocessor.fn);
                    }
                    else if (preprocessorsProperties) {
                        for (j = 0,subLn = preprocessorsProperties.length; j < subLn; j++) {
                            preprocessorProperty = preprocessorsProperties[j];

                            if (data.hasOwnProperty(preprocessorProperty)) {
                                preprocessors.push(preprocessor.fn);
                                break;
                            }
                        }
                    }
                }
                else {
                    preprocessors.push(preprocessor);
                }
            }

            hooks.onCreated = onCreated ? onCreated : Ext.emptyFn;
            hooks.preprocessors = preprocessors;

            this.doProcess(Class, data, hooks);
        },
        
        doProcess: function(Class, data, hooks) {
            var me = this,
                preprocessors = hooks.preprocessors,
                preprocessor = preprocessors.shift(),
                doProcess = me.doProcess;

            for ( ; preprocessor ; preprocessor = preprocessors.shift()) {
                
                if (preprocessor.call(me, Class, data, hooks, doProcess) === false) {
                    return;
                }
            }
            hooks.onBeforeCreated.apply(me, arguments);
        },

        
        preprocessors: {},

        
        registerPreprocessor: function(name, fn, properties, position, relativeTo) {
            if (!position) {
                position = 'last';
            }

            if (!properties) {
                properties = [name];
            }

            this.preprocessors[name] = {
                name: name,
                properties: properties || false,
                fn: fn
            };

            this.setDefaultPreprocessorPosition(name, position, relativeTo);

            return this;
        },

        
        getPreprocessor: function(name) {
            return this.preprocessors[name];
        },

        
        getPreprocessors: function() {
            return this.preprocessors;
        },

        
        defaultPreprocessors: [],

        
        getDefaultPreprocessors: function() {
            return this.defaultPreprocessors;
        },

        
        setDefaultPreprocessors: function(preprocessors) {
            this.defaultPreprocessors = Ext.Array.from(preprocessors);

            return this;
        },

        
        setDefaultPreprocessorPosition: function(name, offset, relativeName) {
            var defaultPreprocessors = this.defaultPreprocessors,
                index;

            if (typeof offset == 'string') {
                if (offset === 'first') {
                    defaultPreprocessors.unshift(name);

                    return this;
                }
                else if (offset === 'last') {
                    defaultPreprocessors.push(name);

                    return this;
                }

                offset = (offset === 'after') ? 1 : -1;
            }

            index = Ext.Array.indexOf(defaultPreprocessors, relativeName);

            if (index !== -1) {
                Ext.Array.splice(defaultPreprocessors, Math.max(0, index + offset), 0, name);
            }

            return this;
        }
    });

    
    ExtClass.registerPreprocessor('extend', function(Class, data, hooks) {
        Ext.classSystemMonitor && Ext.classSystemMonitor(Class, 'Ext.Class#extendPreProcessor', arguments);
        
        var Base = Ext.Base,
            basePrototype = Base.prototype,
            extend = data.extend,
            Parent, parentPrototype, i;

        delete data.extend;

        if (extend && extend !== Object) {
            Parent = extend;
        }
        else {
            Parent = Base;
        }

        parentPrototype = Parent.prototype;

        if (!Parent.$isClass) {
            for (i in basePrototype) {
                if (!parentPrototype[i]) {
                    parentPrototype[i] = basePrototype[i];
                }
            }
        }

        Class.extend(Parent);

        Class.triggerExtended.apply(Class, arguments);

        if (data.onClassExtended) {
            Class.onExtended(data.onClassExtended, Class);
            delete data.onClassExtended;
        }

    }, true); 

    ExtClass.registerPreprocessor('privates', function(Class, data) {
        Ext.classSystemMonitor && Ext.classSystemMonitor(Class, 'Ext.Class#privatePreprocessor', arguments);

        var privates = data.privates,
            statics = privates.statics,
            privacy = privates.privacy || true;

        delete data.privates;
        delete privates.statics;

        
        
        
        Class.addMembers(privates, false, privacy);
        if (statics) {
            Class.addMembers(statics, true, privacy);
        }
    });

    
    ExtClass.registerPreprocessor('statics', function(Class, data) {
        Ext.classSystemMonitor && Ext.classSystemMonitor(Class, 'Ext.Class#staticsPreprocessor', arguments);
        
        Class.addStatics(data.statics);

        delete data.statics;
    });

    
    ExtClass.registerPreprocessor('inheritableStatics', function(Class, data) {
        Ext.classSystemMonitor && Ext.classSystemMonitor(Class, 'Ext.Class#inheritableStaticsPreprocessor', arguments);
        
        Class.addInheritableStatics(data.inheritableStatics);

        delete data.inheritableStatics;
    });

    
    ExtClass.registerPreprocessor('platformConfig', function(Class, data, hooks) {
        var platformConfigs = data.platformConfig,
            config = data.config || {},
            themeName = Ext.theme || (Ext.theme = {
                name: 'Default'
            }),
            platform, theme, platformConfig, i, ln, j , ln2;

        delete data.platformConfig;
        themeName = themeName && themeName.name;

        if (!Ext.filterPlatform) {
            Ext.filterPlatform = function(platform) {
                var profileMatch = false,
                    ua = navigator.userAgent,
                    j, jln;

                platform = [].concat(platform);

                function isPhone(ua) {
                    var isMobile = /Mobile(\/|\s)/.test(ua);

                    
                    
                    
                    

                    return /(iPhone|iPod)/.test(ua) ||
                              (!/(Silk)/.test(ua) && (/(Android)/.test(ua) && (/(Android 2)/.test(ua) || isMobile))) ||
                              (/(BlackBerry|BB)/.test(ua) && isMobile) ||
                              /(Windows Phone)/.test(ua);
                }

                function isTablet(ua) {
                    return !isPhone(ua) && (/iPad/.test(ua) || /Android/.test(ua) || /(RIM Tablet OS)/.test(ua) ||
                        (/MSIE 10/.test(ua) && /; Touch/.test(ua)));
                }

                
                var paramsString = window.location.search.substr(1),
                    paramsArray = paramsString.split("&"),
                    params = {},
                    testPlatform, i;

                for (i = 0; i < paramsArray.length; i++) {
                    var tmpArray = paramsArray[i].split("=");
                    params[tmpArray[0]] = tmpArray[1];
                }

                testPlatform = params.platform;
                if (testPlatform) {
                    return platform.indexOf(testPlatform) != -1;
                }

                for (j = 0, jln = platform.length; j < jln; j++) {
                    switch (platform[j]) {
                        case 'phone':
                            profileMatch = isPhone(ua);
                            break;
                        case 'tablet':
                            profileMatch = isTablet(ua);
                            break;
                        case 'desktop':
                            profileMatch = !isPhone(ua) && !isTablet(ua);
                            break;
                        case 'ios':
                            profileMatch = /(iPad|iPhone|iPod)/.test(ua);
                            break;
                        case 'android':
                            profileMatch = /(Android|Silk)/.test(ua);
                            break;
                        case 'blackberry':
                            profileMatch = /(BlackBerry|BB)/.test(ua);
                            break;
                        case 'safari':
                            profileMatch = /Safari/.test(ua) && !(/(BlackBerry|BB)/.test(ua));
                            break;
                        case 'chrome':
                            profileMatch = /Chrome/.test(ua);
                            break;
                        case 'ie10':
                            profileMatch = /MSIE 10/.test(ua);
                            break;
                    }
                    if (profileMatch) {
                        return true;
                    }
                }
                return false;
            };
        }

        for (i = 0, ln = platformConfigs.length; i < ln; i++) {
            platformConfig = platformConfigs[i];

            platform = platformConfig.platform;
            delete platformConfig.platform;

            theme = [].concat(platformConfig.theme);
            ln2 = theme.length;
            delete platformConfig.theme;

            if (platform && Ext.filterPlatform(platform)) {
                Ext.merge(config, platformConfig);
            }

            if (ln2) {
                for (j = 0; j < ln2; j++) {
                    if (Ext.theme.name == theme[j]) {
                        Ext.merge(config, platformConfig);
                    }
                }
            }
        }
    });

    
    ExtClass.registerPreprocessor('config', function(Class, data) {
        
        if (data.hasOwnProperty('$configPrefixed')) {
            Class.prototype.$configPrefixed = data.$configPrefixed;
        }
        Class.addConfig(data.config);

        
        
        
        delete data.config;
    });
    
    
    ExtClass.registerPreprocessor('cachedConfig', function(Class, data) {
        
        if (data.hasOwnProperty('$configPrefixed')) {
            Class.prototype.$configPrefixed = data.$configPrefixed;
        }
        Class.addCachedConfig(data.cachedConfig);

        
        delete data.cachedConfig;
    });

    
    ExtClass.registerPreprocessor('mixins', function(Class, data, hooks) {
        Ext.classSystemMonitor && Ext.classSystemMonitor(Class, 'Ext.Class#mixinsPreprocessor', arguments);
        
        var mixins = data.mixins,
            onCreated = hooks.onCreated;

        delete data.mixins;

        hooks.onCreated = function() {
            Ext.classSystemMonitor && Ext.classSystemMonitor(Class, 'Ext.Class#mixinsPreprocessor#beforeCreated', arguments);

            
            
            hooks.onCreated = onCreated;

            Class.mixin(mixins);

            
            
            return hooks.onCreated.apply(this, arguments);
        };
    });


    
    Ext.extend = function(Class, Parent, members) {
        Ext.classSystemMonitor && Ext.classSystemMonitor(Class, 'Ext.Class#extend-backwards-compatible', arguments);
            
        if (arguments.length === 2 && Ext.isObject(Parent)) {
            members = Parent;
            Parent = Class;
            Class = null;
        }

        var cls;

        if (!Parent) {
            throw new Error("[Ext.extend] Attempting to extend from a class which has not been loaded on the page.");
        }

        members.extend = Parent;
        members.preprocessors = [
            'extend'
            ,'statics'
            ,'inheritableStatics'
            ,'mixins'
            ,'platformConfig'
            ,'config'
        ];

        if (Class) {
            cls = new ExtClass(Class, members);
            
            cls.prototype.constructor = Class;
        } else {
            cls = new ExtClass(members);
        }

        cls.prototype.override = function(o) {
            for (var m in o) {
                if (o.hasOwnProperty(m)) {
                    this[m] = o[m];
                }
            }
        };

        return cls;
    };
}());

    

Ext.Inventory = function () {



    var me = this;

    me.names = [];
    me.paths = {};

    me.alternateToName = {};
    me.aliasToName = {};
    me.nameToAliases = {};
    me.nameToAlternates = {};
};

Ext.Inventory.prototype = {
    _array1: [0],

    prefixes: null,

    dotRe: /\./g,
    wildcardRe: /\*/g,

    addAlias: function (className, alias) {
        return this.addMapping(className, alias, this.aliasToName, this.nameToAliases);
    },

    addAlternate: function (className, alternate) {
        return this.addMapping(className, alternate, this.alternateToName, this.nameToAlternates);
    },

    addMapping: function (className, alternate, toName, nameTo) {
        var name = className.$className || className,
            mappings = name,
            array = this._array1,
            a, aliases, cls, i, length,
            nameMapping;

        if (Ext.isString(name)) {
            mappings = {};
            mappings[name] = alternate;
        }

        for (cls in mappings) {
            aliases = mappings[cls];
            if (Ext.isString(aliases)) {
                array[0] = aliases;
                aliases = array;
            }

            length = aliases.length;
            nameMapping = nameTo[cls] || (nameTo[cls] = []);
            for (i = 0; i < length; ++i) {
                if (!(a = aliases[i])) {
                    continue;
                }

                if (toName[a] !== cls) {
                    if (toName[a]) {
                        Ext.log.warn("Overriding existing mapping: '" + a + "' From '" +
                            toName[a] + "' to '" + cls + "'. Is this intentional?");
                    }

                    toName[a] = cls;
                    nameMapping.push(a);
                }
            }
        }
    },

    
    getAliasesByName: function (name) {
        return this.nameToAliases[name] || null;
    },

    getAlternatesByName: function (name) {
        return this.nameToAlternates[name] || null;
    },

    
    getNameByAlias: function(alias) {
        return this.aliasToName[alias] || '';
    },

    
    getNameByAlternate: function (alternate) {
        return this.alternateToName[alternate] || '';
    },

    
    getNamesByExpression: function (expression, exclude, accumulate) {
        var me = this,
            aliasToName = me.aliasToName,
            alternateToName = me.alternateToName,
            nameToAliases = me.nameToAliases,
            nameToAlternates = me.nameToAlternates,
            map = accumulate ? exclude : {},
            names = [],
            expressions = Ext.isString(expression) ? [expression] : expression,
            length = expressions.length,
            wildcardRe = me.wildcardRe,
            expr, i, list, match, n, name, regex;

        for (i = 0; i < length; ++i) {
            if ((expr = expressions[i]).indexOf('*') < 0) {
                
                if (!(name = aliasToName[expr])) {
                    if (!(name = alternateToName[expr])) {
                        name = expr;
                    }
                }

                if (!(name in map) && !(exclude && (name in exclude))) {
                    map[name] = 1;
                    names.push(name);
                }
            } else {
                regex = new RegExp('^' + expr.replace(wildcardRe, '(.*?)') + '$');

                for (name in nameToAliases) {
                    if (!(name in map) && !(exclude && (name in exclude))) {
                        if (!(match = regex.test(name))) {
                            n = (list = nameToAliases[name]).length;
                            while (!match && n-- > 0) {
                                match = regex.test(list[n]);
                            }

                            list = nameToAlternates[name];
                            if (list && !match) {
                                n = list.length;
                                while (!match && n-- > 0) {
                                    match = regex.test(list[n]);
                                }
                            }
                        }

                        if (match) {
                            map[name] = 1;
                            names.push(name);
                        }
                    }
                }
            }
        }

        return names;
    },

    getPath: function (className) {
        var me = this,
            paths = me.paths,
            ret = '',
            prefix;

        if (className in paths) {
            ret = paths[className];
        } else {
            prefix = me.getPrefix(className);
            if (prefix) {
                className = className.substring(prefix.length + 1);
                ret = paths[prefix];
                if (ret) {
                    ret += '/';
                }
            }

            ret += className.replace(me.dotRe, '/') + '.js';
        }

        return ret;
    },

    getPrefix: function (className) {
        if (className in this.paths) {
            return className;
        }

        var prefixes = this.getPrefixes(),
            i = prefixes.length,
            length, prefix;

        
        while (i-- > 0) {
            length = (prefix = prefixes[i]).length;
            if (length < className.length && className.charAt(length) === '.'
                                          && prefix === className.substring(0, length)) {
                return prefix;
            }
        }

        return '';
    },

    getPrefixes: function () {
        var me = this,
            prefixes = me.prefixes;

        if (!prefixes) {
            me.prefixes = prefixes = me.names.slice(0);
            prefixes.sort(me._compareNames);
        }

        return prefixes;
    },

    removeName: function (name) {
        var me = this,
            aliasToName = me.aliasToName,
            alternateToName = me.alternateToName,
            nameToAliases = me.nameToAliases,
            nameToAlternates = me.nameToAlternates,
            aliases = nameToAliases[name],
            alternates = nameToAlternates[name],
            i, a;

        delete nameToAliases[name];
        delete nameToAlternates[name];

        if (aliases) {
            for (i = aliases.length; i--;) {
                
                
                
                if (name === (a = aliases[i])) {
                    delete aliasToName[a];
                }
            }
        }

        if (alternates) {
            for (i = alternates.length; i--; ) {
                
                if (name === (a = alternates[i])) {
                    delete alternateToName[a];
                }
            }
        }
    },

    resolveName: function (name) {
        var me = this,
            trueName;

        
        
        if (!(name in me.nameToAliases)) {
            
            if (!(trueName = me.aliasToName[name])) {
                
                
                trueName = me.alternateToName[name];
            }
        }

        return trueName || name;
    },

    
    select: function (receiver, scope) {
        var me = this,
            excludes = {},
            ret = {
                excludes: excludes,

                exclude: function () {
                    me.getNamesByExpression(arguments, excludes, true);
                    return this;
                }
            },
            name;

        for (name in receiver) {
            ret[name] = me.selectMethod(excludes, receiver[name], scope || receiver);
        }

        return ret;
    },

    selectMethod: function (excludes, fn, scope) {
        var me = this;

        return function (include) {
            var args = Ext.Array.slice(arguments, 1);
            
            args.unshift(me.getNamesByExpression(include, excludes));

            return fn.apply(scope, args);
        };
    },

    
    setPath: Ext.Function.flexSetter(function (name, path) {
        var me = this;

        me.paths[name] = path;
        me.names.push(name);

        me.prefixes = null;

        return me;
    }),

    _compareNames: function (lhs, rhs) {
        var cmp = lhs.length - rhs.length;
        if (!cmp) {
            cmp = (lhs < rhs) ? -1 : 1;
        }
        return cmp;
    }
};



Ext.ClassManager = (function(Class, alias, arraySlice, arrayFrom, global) {






var makeCtor = Ext.Class.makeCtor,

    Manager = Ext.apply(new Ext.Inventory(), {
        
        classes: {},

        classState: {
            
        },

        
        existCache: {},

        
        namespaceRewrites: [{
            from: 'Ext.',
            to: Ext
        }],

        
        enableNamespaceParseCache: true,

        
        namespaceParseCache: {},

        
        instantiators: [],

        
        isCreated: function(className) {
            var i, ln, part, root, parts;

            if (typeof className !== 'string' || className.length < 1) {
                throw new Error("[Ext.ClassManager] Invalid classname, must be a string and must not be empty");
            }

            if (Manager.classes[className] || Manager.existCache[className]) {
                return true;
            }

            root = global;
            parts = Manager.parseNamespace(className);

            for (i = 0, ln = parts.length; i < ln; i++) {
                part = parts[i];

                if (typeof part !== 'string') {
                    root = part;
                } else {
                    if (!root || !root[part]) {
                        return false;
                    }

                    root = root[part];
                }
            }

            Manager.triggerCreated(className);

            return true;
        },

        
        createdListeners: [],
        
        
        nameCreatedListeners: {},

        
        existsListeners: [],

        
        nameExistsListeners: {},

        
        triggerCreated: function (className) {
            if(!Manager.existCache[className]) {
                Manager.triggerExists(className);
            }
            Manager.classState[className] += 20;
            Manager.notify(className, Manager.createdListeners, Manager.nameCreatedListeners);
        },

        
        onCreated: function(fn, scope, className) {
            Manager.addListener(fn, scope, className, Manager.createdListeners, Manager.nameCreatedListeners);
        },

        
        triggerExists: function (className, state) {
            Manager.existCache[className] = state || 1;
            Manager.classState[className] += 20;
            Manager.notify(className, Manager.existsListeners, Manager.nameExistsListeners);
        },

        
        onExists: function(fn, scope, className) {
            Manager.addListener(fn, scope, className, Manager.existsListeners, Manager.nameExistsListeners);
        },

        
        notify: function (className, listeners, nameListeners) {
            var alternateNames = Manager.getAlternatesByName(className),
                names = [className],
                i, ln, j, subLn, listener, name;

            for (i = 0,ln = listeners.length; i < ln; i++) {
                listener = listeners[i];
                listener.fn.call(listener.scope, className);
            }

            while (names) {
                for (i = 0,ln = names.length; i < ln; i++) {
                    name = names[i];
                    listeners = nameListeners[name];

                    if (listeners) {
                        for (j = 0,subLn = listeners.length; j < subLn; j++) {
                            listener = listeners[j];
                            listener.fn.call(listener.scope, name);
                        }
                        delete nameListeners[name];
                    }
                }

                names = alternateNames; 
                alternateNames = null; 
            }
        },

        
        addListener: function(fn, scope, className, listeners, nameListeners) {
            if (Ext.isArray(className)) {
                fn = Ext.Function.createBarrier(className.length, fn, scope);
                for (i = 0; i < className.length; i++) {
                    this.addListener(fn, null, className[i], listeners, nameListeners);
                }
                return;
            }
            var i,
                listener = {
                    fn: fn,
                    scope: scope
                };

            if (className) {
                if (this.isCreated(className)) {
                    fn.call(scope, className);
                    return;
                }

                if (!nameListeners[className]) {
                    nameListeners[className] = [];
                }

                nameListeners[className].push(listener);
            }
            else {
                listeners.push(listener);
            }
        },

        
        parseNamespace: function(namespace) {
            if (typeof namespace !== 'string') {
                throw new Error("[Ext.ClassManager] Invalid namespace, must be a string");
            }

            var cache = this.namespaceParseCache,
                parts,
                rewrites,
                root,
                name,
                rewrite, from, to, i, ln;

            if (this.enableNamespaceParseCache) {
                if (cache.hasOwnProperty(namespace)) {
                    return cache[namespace];
                }
            }

            parts = [];
            rewrites = this.namespaceRewrites;
            root = global;
            name = namespace;

            for (i = 0, ln = rewrites.length; i < ln; i++) {
                rewrite = rewrites[i];
                from = rewrite.from;
                to = rewrite.to;

                if (name === from || name.substring(0, from.length) === from) {
                    name = name.substring(from.length);

                    if (typeof to !== 'string') {
                        root = to;
                    } else {
                        parts = parts.concat(to.split('.'));
                    }

                    break;
                }
            }

            parts.push(root);

            parts = parts.concat(name.split('.'));

            if (this.enableNamespaceParseCache) {
                cache[namespace] = parts;
            }

            return parts;
        },

        
        setNamespace: function(name, value) {
            var root = global,
                parts = this.parseNamespace(name),
                ln = parts.length - 1,
                leaf = parts[ln],
                i, part;

            for (i = 0; i < ln; i++) {
                part = parts[i];

                if (typeof part !== 'string') {
                    root = part;
                } else {
                    if (!root[part]) {
                        root[part] = {};
                    }

                    root = root[part];
                }
            }

            root[leaf] = value;

            return root[leaf];
        },

        
        createNamespaces: function() {
            var root = global,
                parts, part, i, j, ln, subLn;

            for (i = 0, ln = arguments.length; i < ln; i++) {
                parts = this.parseNamespace(arguments[i]);

                for (j = 0, subLn = parts.length; j < subLn; j++) {
                    part = parts[j];

                    if (typeof part !== 'string') {
                        root = part;
                    } else {
                        if (!root[part]) {
                            root[part] = {};
                        }

                        root = root[part];
                    }
                }
            }

            return root;
        },

        
        set: function (name, value) {
            var me = this,
                targetName = me.getName(value);

            me.classes[name] = me.setNamespace(name, value);

            if (targetName && targetName !== name) {
                me.addAlternate(targetName, name);
            }

            return this;
        },

        
        get: function(name) {
            var classes = this.classes,
                root,
                parts,
                part, i, ln;

            if (classes[name]) {
                return classes[name];
            }

            root = global;
            parts = this.parseNamespace(name);

            for (i = 0, ln = parts.length; i < ln; i++) {
                part = parts[i];

                if (typeof part !== 'string') {
                    root = part;
                } else {
                    if (!root || !root[part]) {
                        return null;
                    }

                    root = root[part];
                }
            }

            return root;
        },

        
        addNameAliasMappings: function(aliases) {
            this.addAlias(aliases);
        },

        
        addNameAlternateMappings: function (alternates) {
            this.addAlternate(alternates);
        },

        
        getByAlias: function(alias) {
            return this.get(this.getNameByAlias(alias));
        },

        
        getName: function(object) {
            return object && object.$className || '';
        },

        
        getClass: function(object) {
            return object && object.self || null;
        },

        
        create: function(className, data, createdFn) {
            if (className != null && typeof className !== 'string') {
                throw new Error("[Ext.define] Invalid class name '" + className + "' specified, must be a non-empty string");
            }

            var ctor = makeCtor(className);
            if (typeof data === 'function') {
                data = data(ctor);
            }

            if (className) {
                if(Manager.classes[className]) {
                    Ext.log.warn("[Ext.define] Duplicate class name '" + className + "' specified, must be a non-empty string");
                }
                ctor.displayName = className;
            }

            data.$className = className;

            return new Class(ctor, data, function() {
                var postprocessorStack = data.postprocessors || Manager.defaultPostprocessors,
                    registeredPostprocessors = Manager.postprocessors,
                    postprocessors = [],
                    postprocessor, i, ln, j, subLn, postprocessorProperties, postprocessorProperty;

                delete data.postprocessors;

                for (i = 0,ln = postprocessorStack.length; i < ln; i++) {
                    postprocessor = postprocessorStack[i];

                    if (typeof postprocessor === 'string') {
                        postprocessor = registeredPostprocessors[postprocessor];
                        postprocessorProperties = postprocessor.properties;

                        if (postprocessorProperties === true) {
                            postprocessors.push(postprocessor.fn);
                        }
                        else if (postprocessorProperties) {
                            for (j = 0,subLn = postprocessorProperties.length; j < subLn; j++) {
                                postprocessorProperty = postprocessorProperties[j];

                                if (data.hasOwnProperty(postprocessorProperty)) {
                                    postprocessors.push(postprocessor.fn);
                                    break;
                                }
                            }
                        }
                    }
                    else {
                        postprocessors.push(postprocessor);
                    }
                }

                data.postprocessors = postprocessors;
                data.createdFn = createdFn;
                Manager.processCreate(className, this, data);
            });
        },

        processCreate: function(className, cls, clsData){
            var me = this,
                postprocessor = clsData.postprocessors.shift(),
                createdFn = clsData.createdFn;
            
            if (!postprocessor) {
                Ext.classSystemMonitor && Ext.classSystemMonitor(className, 'Ext.ClassManager#classCreated', arguments);
                
                if (className) {
                    me.set(className, cls);
                }

                delete cls._classHooks;

                if (createdFn) {
                    createdFn.call(cls, cls);
                }

                if (className) {
                    me.triggerCreated(className);
                }
                return;
            }

            if (postprocessor.call(me, className, cls, clsData, me.processCreate) !== false) {
                me.processCreate(className, cls, clsData);
            }
        },

        createOverride: function (className, data, createdFn) {
            var me = this,
                overriddenClassName = data.override,
                requires = data.requires,
                uses = data.uses,
                mixins = data.mixins,
                mixinsIsArray,
                compat = data.compatibility,
                depedenciesLoaded,
                classReady = function () {
                    var cls, dependencies, i, key, temp;

                    if (!depedenciesLoaded) {
                        dependencies = requires ? requires.slice(0) : [];

                        if (mixins) {
                            if (!(mixinsIsArray = mixins instanceof Array)) {
                                for (key in mixins) {
                                    if (Ext.isString(cls = mixins[key])) {
                                        dependencies.push(cls);
                                    }
                                }
                            } else {
                                for (i = 0, temp = mixins.length; i < temp; ++i) {
                                    if (Ext.isString(cls = mixins[i])) {
                                        dependencies.push(cls);
                                    }
                                }
                            }
                        }

                        depedenciesLoaded = true;
                        if (dependencies.length) {
                            
                            
                            
                            Ext.require(dependencies, classReady);
                            return;
                        }
                        
                    }

                    
                    
                    
                    if (mixinsIsArray) {
                        for (i = 0, temp = mixins.length; i < temp; ++i) {
                            if (Ext.isString(cls = mixins[i])) {
                                mixins[i] = Ext.ClassManager.get(cls);
                            }
                        }
                    } else if (mixins) {
                        for (key in mixins) {
                            if (Ext.isString(cls = mixins[key])) {
                                mixins[key] = Ext.ClassManager.get(cls);
                            }
                        }
                    }

                    
                    
                    cls = me.get(overriddenClassName);

                    
                    delete data.override;
                    delete data.compatibility;
                    delete data.requires;
                    delete data.uses;

                    Ext.override(cls, data);

                    
                    
                    
                    me.triggerCreated(className);

                    if (uses) {
                        
                        
                        Ext['Loader'].addUsedClasses(uses); 
                    }

                    if (createdFn) {
                        createdFn.call(cls, cls); 
                    }
                };

            me.triggerExists(className, 2);

            if (!compat || Ext.checkVersion(compat)) {
                
                me.onCreated(classReady, me, overriddenClassName);
            }

            return me;
        },

        
        instantiateByAlias: function() {
            var alias = arguments[0],
                args = arraySlice.call(arguments),
                className = this.getNameByAlias(alias);

            if (!className) {
                throw new Error("[Ext.createByAlias] Unrecognized alias: " + alias);
            }

            args[0] = className;

            return Ext.create.apply(Ext, args);
        },

        
        instantiate: function() {
            Ext.log.warn('Ext.ClassManager.instantiate() is deprecated.  Use Ext.create() instead.');
            return Ext.create.apply(Ext, arguments);
        },

        
        dynInstantiate: function(name, args) {
            args = arrayFrom(args, true);
            args.unshift(name);

            return Ext.create.apply(Ext, args);
        },

        
        getInstantiator: function(length) {
            var instantiators = this.instantiators,
                instantiator,
                i,
                args;

            instantiator = instantiators[length];

            if (!instantiator) {
                i = length;
                args = [];

                for (i = 0; i < length; i++) {
                    args.push('a[' + i + ']');
                }

                instantiator = instantiators[length] = new Function('c', 'a', 'return new c(' + args.join(',') + ')');
                instantiator.displayName = "Ext.create" + length;
            }

            return instantiator;
        },

        
        postprocessors: {},

        
        defaultPostprocessors: [],

        
        registerPostprocessor: function(name, fn, properties, position, relativeTo) {
            if (!position) {
                position = 'last';
            }

            if (!properties) {
                properties = [name];
            }

            this.postprocessors[name] = {
                name: name,
                properties: properties || false,
                fn: fn
            };

            this.setDefaultPostprocessorPosition(name, position, relativeTo);

            return this;
        },

        
        setDefaultPostprocessors: function(postprocessors) {
            this.defaultPostprocessors = arrayFrom(postprocessors);

            return this;
        },

        
        setDefaultPostprocessorPosition: function(name, offset, relativeName) {
            var defaultPostprocessors = this.defaultPostprocessors,
                index;

            if (typeof offset === 'string') {
                if (offset === 'first') {
                    defaultPostprocessors.unshift(name);

                    return this;
                }
                else if (offset === 'last') {
                    defaultPostprocessors.push(name);

                    return this;
                }

                offset = (offset === 'after') ? 1 : -1;
            }

            index = Ext.Array.indexOf(defaultPostprocessors, relativeName);

            if (index !== -1) {
                Ext.Array.splice(defaultPostprocessors, Math.max(0, index + offset), 0, name);
            }

            return this;
        }
    });
    
    
    Manager.registerPostprocessor('alias', function(name, cls, data) {
        Ext.classSystemMonitor && Ext.classSystemMonitor(name, 'Ext.ClassManager#aliasPostProcessor', arguments);
        
        var aliases = Ext.Array.from(data.alias),
            i, ln;

        for (i = 0,ln = aliases.length; i < ln; i++) {
            alias = aliases[i];

            this.addAlias(cls, alias);
        }

    }, ['xtype', 'alias']);

    
    Manager.registerPostprocessor('singleton', function(name, cls, data, fn) {
        Ext.classSystemMonitor && Ext.classSystemMonitor(name, 'Ext.ClassManager#singletonPostProcessor', arguments);
        
        if (data.singleton) {
            fn.call(this, name, new cls(), data);
        }
        else {
            return true;
        }
        return false;
    });

    
    Manager.registerPostprocessor('alternateClassName', function(name, cls, data) {
        Ext.classSystemMonitor && Ext.classSystemMonitor(name, 'Ext.ClassManager#alternateClassNamePostprocessor', arguments);
        
        var alternates = data.alternateClassName,
            i, ln, alternate;

        if (!(alternates instanceof Array)) {
            alternates = [alternates];
        }

        for (i = 0, ln = alternates.length; i < ln; i++) {
            alternate = alternates[i];

            if (typeof alternate !== 'string') {
                throw new Error("[Ext.define] Invalid alternate of: '" + alternate + "' for class: '" + name + "'; must be a valid string");
            }

            this.set(alternate, cls);
        }
    });

    
    Manager.registerPostprocessor('debugHooks', function(name, Class, data) {
        Ext.classSystemMonitor && Ext.classSystemMonitor(Class, 'Ext.Class#debugHooks', arguments);

        if (Ext.isDebugEnabled(Class.$className, data.debugHooks.$enabled)) {
            delete data.debugHooks.$enabled;
            Ext.override(Class, data.debugHooks);
        }

        
        var target = Class.isInstance ? Class.self : Class;

        delete target.prototype.debugHooks;
    });

    
    Manager.registerPostprocessor('deprecated', function(name, Class, data) {
        Ext.classSystemMonitor && Ext.classSystemMonitor(Class, 'Ext.Class#deprecated', arguments);

        
        var target = Class.isInstance ? Class.self : Class;
        target.addDeprecations(data.deprecated);

        delete target.prototype.deprecated;
    });

    Ext.apply(Ext, {
        
        create: function () {
            var name = arguments[0],
                nameType = typeof name,
                args = arraySlice.call(arguments, 1),
                cls;

            if (nameType === 'function') {
                cls = name;
            } else {
                if (nameType !== 'string' && args.length === 0) {
                    args = [name];
                    if (!(name = name.xclass)) {
                        name = args[0].xtype;
                        if (name) {
                            name = 'widget.' + name;
                        }
                    }
                }

                if (typeof name !== 'string' || name.length < 1) {
                    throw new Error("[Ext.create] Invalid class name or alias '" + name +
                                    "' specified, must be a non-empty string");
                }

                name = Manager.resolveName(name);
                cls = Manager.get(name);
            }

            
            if (!cls) {
                Ext.log.warn("[Ext.Loader] Synchronously loading '" + name + "'; consider adding " +
                     "Ext.require('" + name + "') above Ext.onReady");

                Ext.syncRequire(name);

                cls = Manager.get(name);
            }

            if (!cls) {
                throw new Error("[Ext.create] Unrecognized class name / alias: " + name);
            }

            if (typeof cls !== 'function') {
                throw new Error("[Ext.create] Singleton '" + name + "' cannot be instantiated.");
            }

            return Manager.getInstantiator(args.length)(cls, args);
        },

        
        widget: function(name, config) {
            
            
            
            
            
            
            
            var xtype = name,
                alias, className, T;

            if (typeof xtype !== 'string') { 
                
                config = name; 
                xtype = config.xtype;
                className = config.xclass;
            } else {
                config = config || {};
            }

            if (config.isComponent) {
                return config;
            }

            if (!className) {
                alias = 'widget.' + xtype;
                className = Manager.getNameByAlias(alias);
            }

            
            if (className) {
                T = Manager.get(className);
            }

            if (!T) {
                return Ext.create(className || alias, config);
            }
            return new T(config);
        },

        
        createByAlias: alias(Manager, 'instantiateByAlias'),

        
        define: function (className, data, createdFn) {
            Ext.classSystemMonitor && Ext.classSystemMonitor(className, 'ClassManager#define', arguments);
            
            if (data.override) {
                Manager.classState[className] = 20;
                return Manager.createOverride.apply(Manager, arguments);
            }

            Manager.classState[className] = 10;
            return Manager.create.apply(Manager, arguments);
        },

        
        undefine: function(className) {
            Ext.classSystemMonitor && Ext.classSystemMonitor(className, 'Ext.ClassManager#undefine', arguments);
        
            var classes = Manager.classes,
                parts, partCount, namespace, i;

            delete Manager.namespaceParseCache[className];
            delete classes[className];
            delete Manager.existCache[className];
            delete Manager.classState[className];

            Manager.removeName(className);

            parts  = Manager.parseNamespace(className);
            partCount = parts.length - 1;
            namespace = parts[0];

            for (i = 1; i < partCount; i++) {
                namespace = namespace[parts[i]];
                if (!namespace) {
                    return;
                }
            }

            
            try {
                delete namespace[parts[partCount]];
            }
            catch (e) {
                namespace[parts[partCount]] = undefined;
            }
        },

        
        getClassName: alias(Manager, 'getName'),

        
        getDisplayName: function(object) {
            if (object) {
                if (object.displayName) {
                    return object.displayName;
                }

                if (object.$name && object.$class) {
                    return Ext.getClassName(object.$class) + '#' + object.$name;
                }

                if (object.$className) {
                    return object.$className;
                }
            }

            return 'Anonymous';
        },

        
        getClass: alias(Manager, 'getClass'),

        
        namespace: alias(Manager, 'createNamespaces')
    });

    
    Ext.createWidget = Ext.widget;

    
    Ext.ns = Ext.namespace;

    Class.registerPreprocessor('className', function(cls, data) {
        if ('$className' in data) {
            cls.$className = data.$className;
            cls.displayName = cls.$className;
        }
        
        Ext.classSystemMonitor && Ext.classSystemMonitor(cls, 'Ext.ClassManager#classNamePreprocessor', arguments);
    }, true, 'first');

    Class.registerPreprocessor('alias', function(cls, data) {
        Ext.classSystemMonitor && Ext.classSystemMonitor(cls, 'Ext.ClassManager#aliasPreprocessor', arguments);
        
        var prototype = cls.prototype,
            xtypes = arrayFrom(data.xtype),
            aliases = arrayFrom(data.alias),
            widgetPrefix = 'widget.',
            widgetPrefixLength = widgetPrefix.length,
            xtypesChain = Array.prototype.slice.call(prototype.xtypesChain || []),
            xtypesMap = Ext.merge({}, prototype.xtypesMap || {}),
            i, ln, alias, xtype;

        for (i = 0,ln = aliases.length; i < ln; i++) {
            alias = aliases[i];

            if (typeof alias !== 'string' || alias.length < 1) {
                throw new Error("[Ext.define] Invalid alias of: '" + alias + "' for class: '" + name + "'; must be a valid string");
            }

            if (alias.substring(0, widgetPrefixLength) === widgetPrefix) {
                xtype = alias.substring(widgetPrefixLength);
                Ext.Array.include(xtypes, xtype);
            }
        }

        cls.xtype = data.xtype = xtypes[0];
        data.xtypes = xtypes;

        for (i = 0,ln = xtypes.length; i < ln; i++) {
            xtype = xtypes[i];

            if (!xtypesMap[xtype]) {
                xtypesMap[xtype] = true;
                xtypesChain.push(xtype);
            }
        }

        data.xtypesChain = xtypesChain;
        data.xtypesMap = xtypesMap;

        Ext.Function.interceptAfter(data, 'onClassCreated', function() {
            Ext.classSystemMonitor && Ext.classSystemMonitor(cls, 'Ext.ClassManager#aliasPreprocessor#afterClassCreated', arguments);
        
            var mixins = prototype.mixins,
                key, mixin;

            for (key in mixins) {
                if (mixins.hasOwnProperty(key)) {
                    mixin = mixins[key];

                    xtypes = mixin.xtypes;

                    if (xtypes) {
                        for (i = 0,ln = xtypes.length; i < ln; i++) {
                            xtype = xtypes[i];

                            if (!xtypesMap[xtype]) {
                                xtypesMap[xtype] = true;
                                xtypesChain.push(xtype);
                            }
                        }
                    }
                }
            }
        });

        for (i = 0,ln = xtypes.length; i < ln; i++) {
            xtype = xtypes[i];

            if (typeof xtype !== 'string' || xtype.length < 1) {
                throw new Error("[Ext.define] Invalid xtype of: '" + xtype + "' for class: '" + name + "'; must be a valid non-empty string");
            }

            Ext.Array.include(aliases, widgetPrefix + xtype);
        }

        data.alias = aliases;

    }, ['xtype', 'alias']);

    
    if(Ext.manifest) {
        var manifest = Ext.manifest,
            classes = manifest.classes,
            paths = manifest.paths,
            aliases = {},
            alternates = {},
            className, obj, name, path, baseUrl;

        if(paths) {
            
            
            
            if(manifest.bootRelative) {
                baseUrl = Ext.Boot.baseUrl;
                for(path in paths) {
                    if(paths.hasOwnProperty(path)) {
                        paths[path] = baseUrl + paths[path];
                    }
                }
            }
            Manager.setPath(paths);
        }

        if(classes) {
            for(className in classes) {
                alternates[className] = [];
                aliases[className] = [];
                obj = classes[className];
                if(obj.alias) {
                    aliases[className] = obj.alias;
                }
                if(obj.alternates) {
                    alternates[className] = obj.alternates;
                }
            }
        }

        Manager.addAlias(aliases);
        Manager.addAlternate(alternates);
    }

    return Manager;
}(Ext.Class, Ext.Function.alias, Array.prototype.slice, Ext.Array.from, Ext.global));



Ext.env || (Ext.env = {});
Ext.env.Browser = function (userAgent, publish) {





    var me = this,
        browserPrefixes = me.browserPrefixes,
        enginePrefixes = me.enginePrefixes,
        browserMatch = userAgent.match(new RegExp('((?:' + 
                Ext.Object.getValues(browserPrefixes).join(')|(?:') + '))([\\w\\._]+)')),
        engineMatch = userAgent.match(new RegExp('((?:' + 
                Ext.Object.getValues(enginePrefixes).join(')|(?:') + '))([\\w\\._]+)')),
        browserNames = me.browserNames,
        browserName = browserNames.other,
        engineNames = me.engineNames,
        engineName = engineNames.other,
        browserVersion = '',
        engineVersion = '',
        majorVer = '',
        isWebView = false,
        i, prefix, mode, name, maxIEVersion;

    
    me.userAgent = userAgent;

    if (browserMatch) {
        browserName = browserNames[Ext.Object.getKey(browserPrefixes, browserMatch[1])];
        if (browserName === 'Safari' && /^Opera/.test(userAgent)) {
            
            browserName = 'Opera';
        }
        browserVersion = new Ext.Version(browserMatch[2]);
    }

    if (engineMatch) {
        engineName = engineNames[Ext.Object.getKey(enginePrefixes, engineMatch[1])];
        engineVersion = new Ext.Version(engineMatch[2]);
    }

    if (engineName == 'Trident' && browserName != 'IE') {
        browserName = 'IE';
        var version = userAgent.match(/.*rv:(\d+.\d+)/);
        if (version && version.length) {
            version = version[1];
            browserVersion = new Ext.Version(version);
        }
    }

    
    
    if (userAgent.match(/FB/) && browserName == "Other") {
        browserName = browserNames.safari;
        engineName = engineNames.webkit;
    }

    if (userAgent.match(/Android.*Chrome/g)) {
        browserName = 'ChromeMobile';
    }

    if (userAgent.match(/OPR/)) {
        browserName = 'Opera';
        browserMatch = userAgent.match(/OPR\/(\d+.\d+)/);
        browserVersion = new Ext.Version(browserMatch[1]);
    }

    Ext.apply(this, {
        engineName: engineName,
        engineVersion: engineVersion,
        name: browserName,
        version: browserVersion
    });

    this.setFlag(browserName, true, publish); 

    if (browserVersion) {
        majorVer = browserVersion.getMajor() || '';
        if (me.is.IE) {
            majorVer = parseInt(majorVer, 10);
            mode = document.documentMode;

            
            
            
            
            

            if (mode == 7 || (majorVer == 7 && mode != 8 && mode != 9 && mode != 10)) {
                majorVer = 7;
            } else if (mode == 8 || (majorVer == 8 && mode != 8 && mode != 9 && mode != 10)) {
                majorVer = 8;
            } else if (mode == 9 || (majorVer == 9 && mode != 7 && mode != 8 && mode != 10)) {
                majorVer = 9;
            } else if (mode == 10 || (majorVer == 10 && mode != 7 && mode != 8 && mode != 9)) {
                majorVer = 10;
            } else if (mode == 11 || (majorVer == 11 && mode != 7 && mode != 8 && mode != 9 && mode != 10)) {
                majorVer = 11;
            }

            maxIEVersion = Math.max(majorVer, 11);
            for (i = 7; i <= maxIEVersion; ++i) {
                prefix = 'isIE' + i; 
                if (majorVer <= i) {
                    Ext[prefix + 'm'] = true;
                }

                if (majorVer === i) {
                    Ext[prefix] = true;
                }

                if (majorVer >= i) {
                    Ext[prefix + 'p'] = true;
                }
            }
        }

        if (me.is.Opera && parseInt(majorVer, 10) <= 12) {
            Ext.isOpera12m = true;
        }

        Ext.chromeVersion = Ext.isChrome ? majorVer : 0;
        Ext.firefoxVersion = Ext.isFirefox ? majorVer : 0;
        Ext.ieVersion = Ext.isIE ? majorVer : 0;
        Ext.operaVersion = Ext.isOpera ? majorVer : 0;
        Ext.safariVersion = Ext.isSafari ? majorVer : 0;
        Ext.webKitVersion = Ext.isWebKit ? majorVer : 0;

        this.setFlag(browserName + majorVer, true, publish); 
        this.setFlag(browserName + browserVersion.getShortVersion());
    }

    for (i in browserNames) {
        if (browserNames.hasOwnProperty(i)) {
            name = browserNames[i];

            this.setFlag(name, browserName === name);
        }
    }

    this.setFlag(name);

    if (engineVersion) {
        this.setFlag(engineName + (engineVersion.getMajor() || ''));
        this.setFlag(engineName + engineVersion.getShortVersion());
    }

    for (i in engineNames) {
        if (engineNames.hasOwnProperty(i)) {
            name = engineNames[i];

            this.setFlag(name, engineName === name, publish);
        }
    }

    this.setFlag('Standalone', !!navigator.standalone);

    this.setFlag('Ripple', !!document.getElementById("tinyhippos-injected") && !Ext.isEmpty(window.top.ripple));
    this.setFlag('WebWorks', !!window.blackberry);

    if (typeof window.PhoneGap != 'undefined' || typeof window.Cordova != 'undefined' || typeof window.cordova != 'undefined') {
        isWebView = true;
        this.setFlag('PhoneGap');
        this.setFlag('Cordova');
    }
    else if (!!window.isNK) {
        isWebView = true;
        this.setFlag('Sencha');
    }

    if (/(Glass)/i.test(userAgent)) {
        this.setFlag('GoogleGlass');
    }

    
    if (/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)(?!.*FBAN)/i.test(userAgent)) {
        isWebView = true;
    }

    
    this.setFlag('WebView', isWebView);

    
    this.isStrict = Ext.isStrict = document.compatMode == "CSS1Compat";

    
    this.isSecure = /^https/i.test(window.location.protocol);

    
    this.identity = browserName + majorVer + (this.isStrict ? 'Strict' : 'Quirks');
};

Ext.env.Browser.prototype = {
    constructor: Ext.env.Browser,

    browserNames: {
        ie: 'IE',
        firefox: 'Firefox',
        safari: 'Safari',
        chrome: 'Chrome',
        opera: 'Opera',
        dolfin: 'Dolfin',
        webosbrowser: 'webOSBrowser',
        chromeMobile: 'ChromeMobile',
        chromeiOS: 'ChromeiOS',
        silk: 'Silk',
        other: 'Other'
    },
    engineNames: {
        webkit: 'WebKit',
        gecko: 'Gecko',
        presto: 'Presto',
        trident: 'Trident',
        other: 'Other'
    },
    enginePrefixes: {
        webkit: 'AppleWebKit/',
        gecko: 'Gecko/',
        presto: 'Presto/',
        trident: 'Trident/'
    },
    browserPrefixes: {
        ie: 'MSIE ',
        firefox: 'Firefox/',
        chrome: 'Chrome/',
        safari: 'Version/',
        opera: 'OPR/',
        dolfin: 'Dolfin/',
        webosbrowser: 'wOSBrowser/',
        chromeMobile: 'CrMo/',
        chromeiOS: 'CriOS/',
        silk: 'Silk/'
    },

    styleDashPrefixes: {
        WebKit: '-webkit-',
        Gecko: '-moz-',
        Trident: '-ms-',
        Presto: '-o-',
        Other: ''
    },

    stylePrefixes: {
        WebKit: 'Webkit',
        Gecko: 'Moz',
        Trident: 'ms',
        Presto: 'O',
        Other: ''
    },

    propertyPrefixes: {
        WebKit: 'webkit',
        Gecko: 'moz',
        Trident: 'ms',
        Presto: 'o',
        Other: ''
    },

    

    
    is: function (name) {
        return !!this.is[name];
    },

    
    name: null,

    
    version: null,

    
    engineName: null,

    
    engineVersion: null,

    setFlag: function(name, value, publish) {
        if (typeof value == 'undefined') {
            value = true;
        }

        this.is[name] = value;
        this.is[name.toLowerCase()] = value;
        if (publish) {
            Ext['is' + name] = value;
        }

        return this;
    },

    getStyleDashPrefix: function() {
        return this.styleDashPrefixes[this.engineName];
    },

    getStylePrefix: function() {
        return this.stylePrefixes[this.engineName];
    },

    getVendorProperyName: function(name) {
        var prefix = this.propertyPrefixes[this.engineName];

        if (prefix.length > 0) {
            return prefix + Ext.String.capitalize(name);
        }

        return name;
    },

    getPreferredTranslationMethod: function(config) {
        if (typeof config == 'object' && 'translationMethod' in config && config.translationMethod !== 'auto') {
            return config.translationMethod;
        } else {
            if (this.is.AndroidStock2 || this.is.IE) {
                return 'scrollposition';
            }
            else {
                return 'csstransform';
            }
        }
    }

};


(function (userAgent) {
    Ext.browser = new Ext.env.Browser(userAgent, true);
    Ext.userAgent = userAgent.toLowerCase();

}(Ext.global.navigator.userAgent));


Ext.env.OS = function(userAgent, platform, browserScope) {





    var me = this,
        names = me.names,
        prefixes = me.prefixes,
        name,
        version = '',
        is = me.is,
        i, prefix, match, item, match1;

    browserScope = browserScope || Ext.browser;

    for (i in prefixes) {
        if (prefixes.hasOwnProperty(i)) {
            prefix = prefixes[i];

            match = userAgent.match(new RegExp('(?:'+prefix+')([^\\s;]+)'));

            if (match) {
                name = names[i];
                match1 = match[1];

                
                
                if (match1 && match1 == "HTC_") {
                    version = new Ext.Version("2.3");
                }
                else if (match1 && match1 == "Silk/") {
                    version = new Ext.Version("2.3");
                }
                else {
                    version = new Ext.Version(match[match.length - 1]);
                }

                break;
            }
        }
    }

    if (!name) {
        name = names[(userAgent.toLowerCase().match(/mac|win|linux/) || ['other'])[0]];
        version = new Ext.Version('');
    }

    this.name = name;
    this.version = version;

    if (platform) {
        this.setFlag(platform.replace(/ simulator$/i, ''));
    }

    this.setFlag(name);

    if (version) {
        this.setFlag(name + (version.getMajor() || ''));
        this.setFlag(name + version.getShortVersion());
    }

    for (i in names) {
        if (names.hasOwnProperty(i)) {
            item = names[i];

            if (!is.hasOwnProperty(name)) {
                this.setFlag(item, (name === item));
            }
        }
    }

    
    if (this.name == "iOS" && window.screen.height == 568) {
        this.setFlag('iPhone5');
    }

    if (browserScope.is.Safari || browserScope.is.Silk) {
        
        if (this.is.Android2 || this.is.Android3 || browserScope.version.shortVersion == 501) {
            browserScope.setFlag("AndroidStock");
            browserScope.setFlag("AndroidStock2");
        }
        if (this.is.Android4) {
            browserScope.setFlag("AndroidStock");
            browserScope.setFlag("AndroidStock4");
        }
    }
};

Ext.env.OS.prototype = {
    constructor: Ext.env.OS,

    names: {
        ios: 'iOS',
        android: 'Android',
        windowsPhone: 'WindowsPhone',
        webos: 'webOS',
        blackberry: 'BlackBerry',
        rimTablet: 'RIMTablet',
        mac: 'MacOS',
        win: 'Windows',
        tizen: 'Tizen',
        linux: 'Linux',
        bada: 'Bada',
        chrome: 'ChromeOS',
        other: 'Other'
    },
    prefixes: {
        tizen: '(Tizen )',
        ios: 'i(?:Pad|Phone|Pod)(?:.*)CPU(?: iPhone)? OS ',
        android: '(Android |HTC_|Silk/)', 
                                    
        windowsPhone: 'Windows Phone ',
        blackberry: '(?:BlackBerry|BB)(?:.*)Version\/',
        rimTablet: 'RIM Tablet OS ',
        webos: '(?:webOS|hpwOS)\/',
        bada: 'Bada\/',
        chrome: 'CrOS '
    },

    
    is: function (name) {
        return !!this[name];
    },

    
    name: null,

    
    version: null,

    setFlag: function(name, value) {
        if (typeof value == 'undefined') {
            value = true;
        }

        if (this.flags) {
            this.flags[name] = value;
        }
        this.is[name] = value;
        this.is[name.toLowerCase()] = value;

        return this;
    }
};

(function() {
    var navigation = Ext.global.navigator,
        userAgent = navigation.userAgent,
        OS = Ext.env.OS,
        is = (Ext.is || (Ext.is = {})),
        osEnv, osName, deviceType;

    OS.prototype.flags = is;

    
    Ext.os = osEnv = new OS(userAgent, navigation.platform);

    osName = osEnv.name;

    
    Ext['is' + osName] = true; 
    Ext.isMac = is.Mac = is.MacOS;

    var search = window.location.search.match(/deviceType=(Tablet|Phone)/),
        nativeDeviceType = window.deviceType;

    
    
    if (search && search[1]) {
        deviceType = search[1];
    }
    else if (nativeDeviceType === 'iPhone') {
        deviceType = 'Phone';
    }
    else if (nativeDeviceType === 'iPad') {
        deviceType = 'Tablet';
    }
    else {
        if (!osEnv.is.Android && !osEnv.is.iOS && !osEnv.is.WindowsPhone && /Windows|Linux|MacOS/.test(osName)) {
            deviceType = 'Desktop';

            
            Ext.browser.is.WebView = !!Ext.browser.is.Ripple;
        }
        else if (osEnv.is.iPad || osEnv.is.RIMTablet || osEnv.is.Android3 || Ext.browser.is.Silk || (osEnv.is.Android4 && userAgent.search(/mobile/i) == -1)) {
            deviceType = 'Tablet';
        }
        else {
            deviceType = 'Phone';
        }
    }

    
    osEnv.setFlag(deviceType, true);
    osEnv.deviceType = deviceType;

    delete OS.prototype.flags;
}());


Ext.feature = {







    
    has: function (name) {
        return !!this.has[name];
    },

    testElements: {},

    getTestElement: function(tag, createNew) {
        if (tag === undefined) {
            tag = 'div';
        }
        else if (typeof tag !== 'string') {
            return tag;
        }

        if (createNew) {
            return document.createElement(tag);
        }

        if (!this.testElements[tag]) {
            this.testElements[tag] = document.createElement(tag);
        }

        return this.testElements[tag];
    },

    isStyleSupported: function(name, tag) {
        var elementStyle = this.getTestElement(tag).style,
            cName = Ext.String.capitalize(name);

        if (typeof elementStyle[name] !== 'undefined'
            || typeof elementStyle[Ext.browser.getStylePrefix(name) + cName] !== 'undefined') {
            return true;
        }

        return false;
    },

    isStyleSupportedWithoutPrefix: function(name, tag) {
        var elementStyle = this.getTestElement(tag).style;

        if (typeof elementStyle[name] !== 'undefined') {
            return true;
        }

        return false;
    },

    isEventSupported: function(name, tag) {
        if (tag === undefined) {
            tag = window;
        }

        var element = this.getTestElement(tag),
            eventName = 'on' + name.toLowerCase(),
            isSupported = (eventName in element);

        if (!isSupported) {
            if (element.setAttribute && element.removeAttribute) {
                element.setAttribute(eventName, '');
                isSupported = typeof element[eventName] === 'function';

                if (typeof element[eventName] !== 'undefined') {
                    element[eventName] = undefined;
                }

                element.removeAttribute(eventName);
            }
        }

        return isSupported;
    },

    
    
    
    getStyle: function (element, styleName) {
        var view = element.ownerDocument.defaultView,
            style = (view ? view.getComputedStyle(element, null) : element.currentStyle) 
                        || element.style;
        return style[styleName];
    },

    getSupportedPropertyName: function(object, name) {
        var vendorName = Ext.browser.getVendorProperyName(name);

        if (vendorName in object) {
            return vendorName;
        }
        else if (name in object) {
            return name;
        }

        return null;
    },

    
    detect: function (isReady) {
        var me = this,
            doc = document,
            toRun = me.toRun || me.tests,
            n = toRun.length,
            div = doc.createElement('div'),
            notRun = [],
            supports = Ext.supports,
            has = me.has,
            name, test, vector, value;

        
        if (!Ext.theme) {
            Ext.theme = {
                name: 'Default'
            };
        }

        Ext.theme.is = {};
        Ext.theme.is[Ext.theme.name] = true;

        
        
        div.innerHTML =
            '<div style="height:30px;width:50px;">' +
                '<div style="height:20px;width:20px;"></div>' +
            '</div>' +
            '<div style="width: 200px; height: 200px; position: relative; padding: 5px;">' +
                '<div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></div>' +
            '</div>' +
            '<div style="position: absolute; left: 10%; top: 10%;"></div>' +
            '<div style="float:left; background-color:transparent;"></div>';
        if (isReady) {
            doc.body.appendChild(div);
        }

        vector = me.preDetected[Ext.browser.identity] || [];
        while (n--) {
            test = toRun[n];
            value = vector[n];
            name = test.name;

            if (value === undefined) {
                if (!isReady && test.ready) {
                    
                    notRun.push(test);
                    continue;
                }

                value = test.fn.call(me, doc, div);
            }

            
            supports[name] = has[name] = value;
        }

        if (isReady) {
            doc.body.removeChild(div);
        }

        me.toRun = notRun;
    },

    
    report: function () {
        var values = [],
            len = this.tests.length,
            i;

        for (i = 0; i < len; ++i) {
            values.push(this.has[this.tests[i].name] ? 1 : 0);
        }

        Ext.log(Ext.browser.identity + ': [' + values.join(',') + ']');
    },
    

    preDetected: {
        
    },

    
    tests: [{
        
        name: 'CSSPointerEvents',
        fn: function (doc) {
            return 'pointerEvents' in doc.documentElement.style;
        }
    },{
        
        name: 'CSS3BoxShadow',
        fn: function (doc) {
            return 'boxShadow' in doc.documentElement.style || 'WebkitBoxShadow' in doc.documentElement.style || 'MozBoxShadow' in doc.documentElement.style;
        }
    },{
        
        name: 'ClassList',
        fn: function (doc) {
            return !!doc.documentElement.classList;
        }
    },{
        
        name: 'Canvas',
        fn: function() {
            var element = this.getTestElement('canvas');
            return !!(element && element.getContext && element.getContext('2d'));
        }
    },{
        
        name: 'Svg',
        fn: function(doc) {
            return !!(doc.createElementNS && !!doc.createElementNS("http:/" + "/www.w3.org/2000/svg", "svg").createSVGRect);
        }
    },{
        
        name: 'Vml',
        fn: function() {
            var element = this.getTestElement(),
                ret = false;

            element.innerHTML = "<!--[if vml]><br><![endif]-->";
            ret = (element.childNodes.length === 1);
            element.innerHTML = "";

            return ret;
        }
    },{
        
        name: 'TouchEvents',
        fn: function() {
            return this.isEventSupported('touchend');
        }
    },{
        
        name: 'Touch',
        fn: function() {
            
            var maxTouchPoints = navigator.msMaxTouchPoints || navigator.maxTouchPoints;
            
            
            
            
            
            
            
            return (this.isEventSupported('touchend') && maxTouchPoints !== 1) ||
                maxTouchPoints > 1;
        }
    },{
        name: 'PointerEvents',
        fn: function() {
            return navigator.pointerEnabled;
        }
    },{
        name: 'MSPointerEvents',
        fn: function() {
            return navigator.msPointerEnabled;
        }
    },{
        
        name: 'Orientation',
        fn: function() {
            return ('orientation' in window) && this.isEventSupported('orientationchange');
        }
    },{
        
        name: 'OrientationChange',
        fn: function() {
            return this.isEventSupported('orientationchange');
        }
    },{
        
        name: 'DeviceMotion',
        fn: function() {
            return this.isEventSupported('devicemotion');
        }
    },{
        
        
        names: [ 'Geolocation', 'GeoLocation' ],
        fn: function() {
            return 'geolocation' in window.navigator;
        }
    },{
        name: 'SqlDatabase',
        fn: function() {
            return 'openDatabase' in window;
        }
    },{
        name: 'WebSockets',
        fn: function() {
            return 'WebSocket' in window;
        }
    },{
        
        name: 'Range',
        fn: function() {
            return !!document.createRange;
        }
    },{
        
        name: 'CreateContextualFragment',
        fn: function() {
            var range = !!document.createRange ? document.createRange() : false;
            return range && !!range.createContextualFragment;
        }
    },{
        
        name: 'History',
        fn: function() {
            return ('history' in window && 'pushState' in window.history);
        }
    },{
        name: 'CssTransforms',
        fn: function() {
            return this.isStyleSupported('transform');
        }
    },{
        name: 'CssTransformNoPrefix',
        fn: function() {
            return this.isStyleSupportedWithoutPrefix('transform');
        }
    },{
        
        name: 'Css3dTransforms',
        fn: function() {
            
            return this.has('CssTransforms') && this.isStyleSupported('perspective') && 
                    !Ext.browser.is.AndroidStock2;
            
            
        }
    },{
        name: 'CssAnimations',
        fn: function() {
            return this.isStyleSupported('animationName');
        }
    },{
        
        names: [ 'CssTransitions', 'Transitions' ],
        fn: function() {
            return this.isStyleSupported('transitionProperty');
        }
    },{
        
        
        names: [ 'Audio', 'AudioTag' ],
        fn: function() {
            return !!this.getTestElement('audio').canPlayType;
        }
    },{
        
        name: 'Video',
        fn: function() {
            return !!this.getTestElement('video').canPlayType;
        }
    },{
        
        name: 'LocalStorage',
        fn: function() {
            try {
                
                
                if ('localStorage' in window && window['localStorage'] !== null) {
                    
                    localStorage.setItem('sencha-localstorage-test', 'test success');
                    
                    localStorage.removeItem('sencha-localstorage-test');
                    return true;
                }
            } catch ( e ) {
                
            }

            return false;
        }
    },{
        
        name: 'XHR2',
        fn: function() {
          return window.ProgressEvent && window.FormData && window.XMLHttpRequest &&
              ('withCredentials' in new XMLHttpRequest);
        }
    }, {
        
        name: 'XHRUploadProgress',
        fn: function() {
            if(window.XMLHttpRequest && !Ext.browser.is.AndroidStock) {
                var xhr = new XMLHttpRequest();
                return xhr && ('upload' in xhr) && ('onprogress' in xhr.upload);
            }
            return false;
        }
    }, {
        
        name: 'NumericInputPlaceHolder',
        fn: function() {
            return !(Ext.browser.is.AndroidStock4 && Ext.os.version.getMinor() < 2);
        }
    },{
        name: 'ProperHBoxStretching',
        ready: true,
        fn: function() {
            
            var bodyElement = document.createElement('div'),
                innerElement = bodyElement.appendChild(document.createElement('div')),
                contentElement = innerElement.appendChild(document.createElement('div')),
                innerWidth;

            bodyElement.setAttribute('style', 'width: 100px; height: 100px; position: relative;');
            innerElement.setAttribute('style', 'position: absolute; display: -ms-flexbox; display: -webkit-flex; display: -moz-flexbox; display: flex; -ms-flex-direction: row; -webkit-flex-direction: row; -moz-flex-direction: row; flex-direction: row; min-width: 100%;');
            contentElement.setAttribute('style', 'width: 200px; height: 50px;');
            document.body.appendChild(bodyElement);
            innerWidth = innerElement.offsetWidth;
            document.body.removeChild(bodyElement);

            return (innerWidth > 100);
        }
    },

    
    {
        name: 'matchesSelector',
        fn: function() {
            var el = document.documentElement,
                w3 = 'matches',
                wk = 'webkitMatchesSelector',
                ms = 'msMatchesSelector',
                mz = 'mozMatchesSelector';

            return el[w3] ? w3 : el[wk] ? wk : el[ms] ? ms : el[mz] ? mz : null;
        }
    }

    ,
    
    {
        name: 'RightMargin',
        ready: true,
        fn: function(doc, div) {
            var view = doc.defaultView;
            return !(view && view.getComputedStyle(div.firstChild.firstChild, null).marginRight != '0px');
        }
    },

    
    {
        name: 'DisplayChangeInputSelectionBug',
        fn: function() {
            var webKitVersion = Ext.webKitVersion;
            
            return 0 < webKitVersion && webKitVersion < 533;
        }
    },

    
    {
        name: 'DisplayChangeTextAreaSelectionBug',
        fn: function() {
            var webKitVersion = Ext.webKitVersion;

            
            return 0 < webKitVersion && webKitVersion < 534.24;
        }
    },

    
    {
        name: 'TransparentColor',
        ready: true,
        fn: function(doc, div, view) {
            view = doc.defaultView;
            return !(view && view.getComputedStyle(div.lastChild, null).backgroundColor != 'transparent');
        }
    },

    
    {
        name: 'ComputedStyle',
        ready: true,
        fn: function(doc, div, view) {
            view = doc.defaultView;
            return view && view.getComputedStyle;
        }
    },

    
    {
        name: 'Float',
        fn: function(doc) {
            return 'cssFloat' in doc.documentElement.style;
        }
    },

    
    {
        name: 'CSS3BorderRadius',
        ready: true,
        fn: function(doc) {
            var domPrefixes = ['borderRadius', 'BorderRadius', 'MozBorderRadius',
                               'WebkitBorderRadius', 'OBorderRadius', 'KhtmlBorderRadius'],
                pass = false,
                i;
            for (i = 0; i < domPrefixes.length; i++) {
                if (doc.documentElement.style[domPrefixes[i]] !== undefined) {
                    pass = true;
                }
            }
            return pass && !Ext.isIE9;
        }
    },

    
    {
        name: 'CSS3LinearGradient',
        fn: function(doc, div) {
            var property = 'background-image:',
                webkit   = '-webkit-gradient(linear, left top, right bottom, from(black), to(white))',
                w3c      = 'linear-gradient(left top, black, white)',
                moz      = '-moz-' + w3c,
                ms       = '-ms-' + w3c,
                opera    = '-o-' + w3c,
                options  = [property + webkit, property + w3c, property + moz, property + ms, property + opera];

            div.style.cssText = options.join(';');

            return (("" + div.style.backgroundImage).indexOf('gradient') !== -1) && !Ext.isIE9;
        }
    },

    
    {
        name: 'MouseEnterLeave',
        fn: function(doc){
            return ('onmouseenter' in doc.documentElement && 'onmouseleave' in doc.documentElement);
        }
    },

    
    {
        name: 'MouseWheel',
        fn: function(doc) {
            return ('onmousewheel' in doc.documentElement);
        }
    },

    
    {
        name: 'Opacity',
        fn: function(doc, div){
            
            if (Ext.isIE8) {
                return false;
            }
            div.firstChild.style.cssText = 'opacity:0.73';
            return div.firstChild.style.opacity == '0.73';
        }
    },

    
    {
        name: 'Placeholder',
        fn: function(doc) {
            return 'placeholder' in doc.createElement('input');
        }
    },

    
    {
        name: 'Direct2DBug',
        fn: function(doc) {
            return Ext.isString(doc.documentElement.style.msTransformOrigin) && Ext.isIE9m;
        }
    },

    
    {
        name: 'BoundingClientRect',
        fn: function(doc) {
            return 'getBoundingClientRect' in doc.documentElement;
        }
    },

    
    {
        name: 'RotatedBoundingClientRect',
        ready: true,
        fn: function(doc) {
            var body = doc.body,
                supports = false,
                el = this.getTestElement(),
                style = el.style;

            if (el.getBoundingClientRect) {
                style.WebkitTransform = style.MozTransform = style.msTransform =
                    style.OTransform = style.transform = 'rotate(90deg)';
                style.width = '100px';
                style.height = '30px';
                body.appendChild(el);

                supports = el.getBoundingClientRect().height !== 100;
                body.removeChild(el);
            }

            return supports;
        }
    },
    {
        name: 'IncludePaddingInWidthCalculation',
        ready: true,
        fn: function(doc, div){
            return div.childNodes[1].firstChild.offsetWidth == 210;
        }
    },
    {
        name: 'IncludePaddingInHeightCalculation',
        ready: true,
        fn: function(doc, div){
            return div.childNodes[1].firstChild.offsetHeight == 210;
        }
    },

    
    {
        name: 'TextAreaMaxLength',
        fn: function(doc){
            return ('maxlength' in doc.createElement('textarea'));
        }
    },
    
    
    {
        name: 'GetPositionPercentage',
        ready: true,
        fn: function(doc, div){
           return Ext.feature.getStyle(div.childNodes[2], 'left') == '10%';
        }
    },
    
    {
        name: 'PercentageHeightOverflowBug',
        ready: true,
        fn: function(doc) {
            var hasBug = false,
                style, el;

            if (Ext.getScrollbarSize().height) {
                
                el = this.getTestElement();
                style = el.style;
                style.height = '50px';
                style.width = '50px';
                style.overflow = 'auto';
                style.position = 'absolute';

                el.innerHTML = [
                    '<div style="display:table;height:100%;">',
                        
                        
                        
                        '<div style="width:51px;"></div>',
                    '</div>'
                ].join('');
                doc.body.appendChild(el);
                if (el.firstChild.offsetHeight === 50) {
                    hasBug = true;
                }
                doc.body.removeChild(el);
            }

            return hasBug;
        }
    },

    
    {
        name: 'xOriginBug',
        ready: true,
        fn: function(doc, div) {
           div.innerHTML = '<div id="b1" style="height:100px;width:100px;direction:rtl;position:relative;overflow:scroll">' +
                '<div id="b2" style="position:relative;width:100%;height:20px;"></div>' +
                '<div id="b3" style="position:absolute;width:20px;height:20px;top:0px;right:0px"></div>' +
            '</div>';

            var outerBox = document.getElementById('b1').getBoundingClientRect(),
                b2 = document.getElementById('b2').getBoundingClientRect(),
                b3 = document.getElementById('b3').getBoundingClientRect();

            return (b2.left !== outerBox.left && b3.right !== outerBox.right);
        }
    },

    
    {
        name: 'ScrollWidthInlinePaddingBug',
        ready: true,
        fn: function(doc) {
            var hasBug = false,
                style, el;

            el = doc.createElement('div');
            style = el.style;
            style.height = '50px';
            style.width = '50px';
            style.padding = '10px';
            style.overflow = 'hidden';
            style.position = 'absolute';

            el.innerHTML =
                '<span style="display:inline-block;zoom:1;height:60px;width:60px;"></span>';
            doc.body.appendChild(el);
            if (el.scrollWidth === 70) {
                hasBug = true;
            }
            doc.body.removeChild(el);

            return hasBug;
        }
    },

    
    {
        name: 'rtlVertScrollbarOnRight',
        ready: true,
        fn: function(doc, div) {
           div.innerHTML = '<div style="height:100px;width:100px;direction:rtl;overflow:scroll">' +
                '<div style="width:20px;height:200px;"></div>' +
            '</div>';

            var outerBox = div.firstChild,
                innerBox = outerBox.firstChild;

            return (innerBox.offsetLeft + innerBox.offsetWidth !== outerBox.offsetLeft + outerBox.offsetWidth);
        }
    },

    
    {
        name: 'rtlVertScrollbarOverflowBug',
        ready: true,
        fn: function(doc, div) {
           div.innerHTML = '<div style="height:100px;width:100px;direction:rtl;overflow:auto">' +
                '<div style="width:95px;height:200px;"></div>' +
            '</div>';

            
            
            
            var outerBox = div.firstChild;
            return outerBox.clientHeight === outerBox.offsetHeight;
        }
    },
    {
        identity: 'defineProperty',
        fn: function () {
            if (Ext.isIE8m) {
                Ext.Object.defineProperty = Ext.emptyFn;
                return false;
            }
            return true;
        }
    },
    {
        identify: 'nativeXhr',
        fn: function () {
            if (typeof XMLHttpRequest !== 'undefined') {
                return true;
            }

            
            XMLHttpRequest = function() {
                try {
                    return new ActiveXObject('MSXML2.XMLHTTP.3.0');
                }
                catch (ex) {
                    return null;
                }
            };
            return false;
        }
    },

    
    {
        name: 'SpecialKeyDownRepeat',
        fn: function() {
            return Ext.isWebKit ?
                parseInt(navigator.userAgent.match(/AppleWebKit\/(\d+)/)[1], 10) >= 525 :
                !((Ext.isGecko && !Ext.isWindows) || (Ext.isOpera && Ext.operaVersion < 12));
        }
    },
    
    {
        name: 'EmulatedMouseOver',
        fn: function() {
            
            return Ext.os.is.iOS;
        }
    },

    
    {
        
        name: 'Hashchange',
        fn: function() {
            
            var docMode = document.documentMode;
            return 'onhashchange' in window && (docMode === undefined || docMode > 7);
        }
    },

    
    {
        name: 'FixedTableWidthBug',
        ready: true,
        fn: function() {
            if (Ext.isIE8) {
                
                return false;
            }
            var outer = document.createElement('div'),
                inner = document.createElement('div'),
                width;

            outer.setAttribute('style', 'display:table;table-layout:fixed;');
            inner.setAttribute('style', 'display:table-cell;min-width:50px;');

            outer.appendChild(inner);
            document.body.appendChild(outer);

            
            outer.offsetWidth;

            outer.style.width = '25px';

            width = outer.offsetWidth;

            document.body.removeChild(outer);

            return width === 50;
        }
    },
    
    
    {
        name: 'FocusinFocusoutEvents',
        
        
        
        
        fn: function() {
            return !Ext.isGecko;
        }
    }
    
    ]
};

Ext.supports = {};

Ext.feature.detect();


Ext.env.Ready = {





    
    blocks: (location.search || '').indexOf('ext-pauseReadyFire') > 0 ? 1 : 0,

    
    bound: 0,

    
    delay: 1,

    
    events: [],

    
    firing: false,

    
    generation: 0,

    
    listeners: [],

    
    nextId: 0,

    
    sortGeneration: 0,

    
    state: 0,

    
    timer: null,

    
    bind: function () {
        var me = Ext.env.Ready,
            doc = document;

        if (!me.bound) {
            
            if (doc.readyState == 'complete') {
                
                me.onReadyEvent({
                    type: doc.readyState || 'body'
                });
            } else {
                me.bound = 1;
                if (Ext.browser.is.PhoneGap && !Ext.os.is.Desktop) {
                    me.bound = 2;
                    doc.addEventListener('deviceready', me.onReadyEvent, false);
                }
                doc.addEventListener('DOMContentLoaded', me.onReadyEvent, false);
                window.addEventListener('load', me.onReadyEvent, false);
            }
        }
    },

    block: function () {
        ++this.blocks;
        Ext.isReady = false;
    },

    
    fireReady: function () {
        var me = Ext.env.Ready;

        if (!me.state) {
            Ext._readyTime = Ext.now();
            Ext.isDomReady = true;
            me.state = 1;

            
            Ext.feature.detect(true);

            if (!me.delay) {
                me.handleReady();
            } else if (navigator.standalone) {
                
                
                
                
                me.timer = Ext.defer(function() {
                    me.timer = null;
                    me.handleReadySoon();
                }, 1);
            } else {
                me.handleReadySoon();
            }
        }
    },

    
    handleReady: function () {
        var me = this;

        if (me.state === 1) {
            me.state = 2;

            Ext._beforeReadyTime = Ext.now();
            me.invokeAll();
            Ext._afterReadytime = Ext.now();
        }
    },

    
    handleReadySoon: function (delay) {
        var me = this;

        if (!me.timer) {
            me.timer = Ext.defer(function () {
                me.timer = null;
                me.handleReady();
            }, delay || me.delay);
        }
    },

    
    invoke: function (listener) {
        var delay = listener.delay;

        if (delay) {
            Ext.defer(function () {
                listener.fn.call(listener.scope);
            }, delay);
        } else {
            listener.fn.call(listener.scope);
        }
    },

    
    invokeAll: function () {
        var me = this,
            listeners = me.listeners,
            listener;

        if (!me.blocks) {
            
            Ext.isReady = true;
        }
        me.firing = true;

        
        
        while (listeners.length) {
            if (me.sortGeneration !== me.generation) {
                me.sortGeneration = me.generation;

                
                
                
                
                listeners.sort(me.sortFn);
            }

            listener = listeners.pop();
            if (me.blocks && !listener.dom) {
                
                
                
                listeners.push(listener);
                break;
            }

            me.invoke(listener);
        }

        me.firing = false;
    },

    
    makeListener: function (fn, scope, options) {
        var ret = {
            fn: fn,
            id: ++this.nextId, 
            scope: scope,
            dom: false,
            priority: 0
        };
        if (options) {
            Ext.apply(ret, options);
        }
        ret.phase = ret.dom ? 0 : 1; 
        return ret;
    },

    
    on: function (fn, scope, options) {
        var me = Ext.env.Ready,
            listener = me.makeListener(fn, scope, options);

        if (me.state === 2 && !me.firing && (listener.dom || !me.blocks)) {
            
            
            
            
            
            
            
            me.invoke(listener);
        } else {
            me.listeners.push(listener);
            ++me.generation;

            if (!me.bound) {
                
                
                
                me.bind();
            }
        }
    },

    
    onReadyEvent: function (ev) {
        var me = Ext.env.Ready;

        if (Ext.elevateFunction) {
            Ext.elevateFunction(me.doReadyEvent, me, arguments);
        } else {
            me.doReadyEvent(ev);
        }
    },

    doReadyEvent: function (ev) {
        var me = this;

        if (ev && ev.type) {
            me.events.push(ev);
        }

        if (me.bound > 0) {
            me.unbind();
            me.bound = -1; 
        }

        if (!me.state) {
            me.fireReady();
        }
    },

    
    sortFn: function (a, b) {
        return -((a.phase - b.phase) || (b.priority - a.priority) || (a.id - b.id));
    },

    unblock: function () {
        var me = this;

        if (me.blocks) {
            if (! --me.blocks) {
                if (me.state === 2 && !me.firing) {
                    
                    
                    me.invokeAll();
                }
                
                
                
                
                
            }
        }
    },

    
    unbind: function () {
        var me = this,
            doc = document;

        if (me.bound > 1) {
            doc.removeEventListener('deviceready', me.onReadyEvent, false);
        }

        doc.removeEventListener('DOMContentLoaded', me.onReadyEvent, false);
        window.removeEventListener('load', me.onReadyEvent, false);
    }
};

(function () {
    var Ready = Ext.env.Ready;


    
    if (Ext.isIE9m) {
        
        Ext.apply(Ready, {
            
            scrollTimer: null,

            
            readyStatesRe  : /complete/i,

            
            pollScroll : function() {
                var scrollable = true;

                try {
                    document.documentElement.doScroll('left');
                } catch(e) {
                    scrollable = false;
                }

                
                
                if (scrollable && document.body) {
                    Ready.onReadyEvent({
                        type: 'doScroll'
                    });
                } else {
                     
                     
                     
                    Ready.scrollTimer = Ext.defer(Ready.pollScroll, 20);
                }

                return scrollable;
            },

            bind: function () {
                if (Ready.bound) {
                    return;
                }

                var doc = document,
                    topContext;

                
                try {
                    topContext = window.frameElement === undefined;
                } catch(e) {
                    
                    
                }

                if (!topContext || !doc.documentElement.doScroll) {
                    Ready.pollScroll = Ext.emptyFn;   
                }
                else if (Ready.pollScroll()) { 
                    return;
                }

                if (doc.readyState == 'complete')  {
                    
                    Ready.onReadyEvent({
                        type: 'already ' + (doc.readyState || 'body')
                    });
                } else {
                    doc.attachEvent('onreadystatechange', Ready.onReadyStateChange);
                    window.attachEvent('onload', Ready.onReadyEvent);
                    Ready.bound = 1;
                }
            },

            unbind : function () {
                document.detachEvent('onreadystatechange', Ready.onReadyStateChange);
                window.detachEvent('onload', Ready.onReadyEvent);

                if (Ext.isNumber(Ready.scrollTimer)) {
                    clearTimeout(Ready.scrollTimer);
                    Ready.scrollTimer = null;
                }
            },

            
            onReadyStateChange: function() {
                var state = document.readyState;

                if (Ready.readyStatesRe.test(state)) {
                    Ready.onReadyEvent({
                        type: state
                    });
                }
            }
        });
    }

    

    

    
    Ext.onDocumentReady = function (fn, scope, options) {
        var opt = {
            dom: true
        };

        if (options) {
            Ext.apply(opt, options);
        }

        Ready.on(fn, scope, opt);
    };

    
    Ext.onReady = function (fn, scope, options) {
        Ready.on(fn, scope, options);
    };

    Ready.bind();
}());



Ext.Loader = new function() {








    var Loader = this,
        Manager = Ext.ClassManager, 
        Boot = Ext.Boot,
        Class = Ext.Class,
        Ready = Ext.env.Ready,
        alias = Ext.Function.alias,
        dependencyProperties = ['extend', 'mixins', 'requires'],
        isInHistory = {},
        history = [],
        readyListeners = [],
        usedClasses = [],
        _requiresMap = {},
        _missingQueue = {},
        _config = {
            
            enabled: true,

            
            scriptChainDelay: false,

            
            disableCaching: true,

            
            disableCachingParam: '_dc',

            
            paths: Manager.paths,

            
            preserveScripts: true,

            
            scriptCharset: undefined
        },
        
        delegatedConfigs = {
            disableCaching: true,
            disableCachingParam: true,
            preserveScripts: true,
            scriptChainDelay: 'loadDelay'
        };

    Ext.apply(Loader, {
        
        isInHistory: isInHistory,

        
        isLoading: false,

        
        history: history,

        
        config: _config,

        
        readyListeners: readyListeners,

        
        optionalRequires: usedClasses,

        
        requiresMap: _requiresMap,

        
        hasFileLoadError: false,

        
        scriptsLoading: 0,

        
        classesLoading: [],

        
        syncModeEnabled: false,

        
        
        missingQueue: _missingQueue,
        
        init: function () {
            
            var scripts = document.getElementsByTagName('script'),
                src = scripts[scripts.length - 1].src,
                path = src.substring(0, src.lastIndexOf('/') + 1),
                meta = Ext._classPathMetadata,
                microloader = Ext.Microloader,
                manifest = Ext.manifest,
                loadOrder, baseUrl, loadlen, l, loadItem;

            if (src.indexOf("packages/sencha-core/src/") !== -1) {
                path = path + "../../";
            } else if (src.indexOf("/core/src/class/") !== -1) {
                path = path + "../../../";
            }

            
            if(!Manager.getPath("Ext")) {
                Manager.setPath('Ext', path + 'src');
            }

            
            if (meta) {
                Ext._classPathMetadata = null;
                Loader.addClassPathMappings(meta);
            }
            
            if(manifest) {
                loadOrder = manifest.loadOrder;
                
                
                
                baseUrl = Ext.Boot.baseUrl;
                if(loadOrder && manifest.bootRelative) {
                    for(loadlen = loadOrder.length, l = 0; l < loadlen; l++) {
                        loadItem = loadOrder[l];
                        loadItem.path = baseUrl + loadItem.path;
                    }                    
                }
            }
            
            if(microloader) {
                Ready.block();
                microloader.onMicroloaderReady(function(){
                    Ready.unblock();
                });
            }
        },

        
        setConfig: Ext.Function.flexSetter(function (name, value) {
            if (name === 'paths') {
                Loader.setPath(value);
            } else {
                _config[name] = value;

                var delegated = delegatedConfigs[name];
                if (delegated) {
                    Boot.setConfig((delegated === true) ? name : delegated, value);
                }
            }

            return Loader;
        }),

        
        getConfig: function(name) {
            return name ? _config[name] : _config;
        },

        
        setPath: function () {
            
            Manager.setPath.apply(Manager, arguments);
            return Loader;
        },

        
        addClassPathMappings: function(paths) {
            
            Manager.setPath(paths);
            return Loader;
        },

        

        addBaseUrlClassPathMappings: function(pathConfig) {
            for(var name in pathConfig) {
                pathConfig[name] = Boot.baseUrl + pathConfig[name];
            }
            Ext.Loader.addClassPathMappings(pathConfig);
        },


        
        getPath: function(className) {
            
            return Manager.getPath(className);
        },

        require: function (expressions, fn, scope, excludes) {
            if (excludes) {
                return Loader.exclude(excludes).require(expressions, fn, scope);
            }

            var classNames = Manager.getNamesByExpression(expressions);

            return Loader.load(classNames, fn, scope);
        },

        syncRequire: function () {
            var wasEnabled = Loader.syncModeEnabled;

            Loader.syncModeEnabled = true;

            var ret = Loader.require.apply(Loader, arguments);

            Loader.syncModeEnabled = wasEnabled;

            return ret;
        },

        exclude: function (excludes) {
            var selector = Manager.select({
                    require: function (classNames, fn, scope) {
                        return Loader.load(classNames, fn, scope);
                    },

                    syncRequire: function (classNames, fn, scope) {
                        var wasEnabled = Loader.syncModeEnabled;

                        Loader.syncModeEnabled = true;

                        var ret = Loader.load(classNames, fn, scope);

                        Loader.syncModeEnabled = wasEnabled;

                        return ret;
                    }
                });

            selector.exclude(excludes);
            return selector;
        },

        load: function (classNames, callback, scope) {
            if (callback) {
                if (callback.length) {
                    
                    
                    callback = Loader.makeLoadCallback(classNames, callback);
                }
                callback = callback.bind(scope || Ext.global);
            }

            var missingClassNames = [],
                numClasses = classNames.length,
                className, i, numMissing, urls = [],
                state = Manager.classState;
            
            for (i = 0; i < numClasses; ++i) {
                className = Manager.resolveName(classNames[i]);
                if (!Manager.isCreated(className)) {
                    missingClassNames.push(className);
                    _missingQueue[className] = Loader.getPath(className);
                    if(!state[className]) {
                        urls.push(_missingQueue[className]);
                    }
                }
            }

            
            
            numMissing = missingClassNames.length;
            if (numMissing) {
                Loader.missingCount += numMissing;
                Ext.Array.push(Loader.classesLoading, missingClassNames);

                
                
                
                
                Manager.onExists(function () {
                    Ext.Array.remove(Loader.classesLoading, missingClassNames);
                    Ext.each(missingClassNames, function(name){
                        Ext.Array.remove(Loader.classesLoading, name);
                    });
                    if (callback) {
                        Ext.callback(callback, scope, arguments);
                    }
                    Loader.checkReady();
                }, Loader, missingClassNames);

                if (!_config.enabled) {
                    Ext.Error.raise("Ext.Loader is not enabled, so dependencies cannot be resolved dynamically. " +
                             "Missing required class" + ((missingClassNames.length > 1) ? "es" : "") + 
                             ": " + missingClassNames.join(', '));
                }

                if(urls.length) {
                    Loader.loadScripts({
                        url: urls,
                        
                        _classNames: missingClassNames
                    });
                } else {
                    
                    
                    
                    Loader.checkReady();
                }
            } else {
                if (callback) {
                    callback.call(scope);
                }
                
                
                
                Loader.checkReady();
            }
            
            if (Loader.syncModeEnabled) {
                
                if (numClasses === 1) {
                    return Manager.get(classNames[0]);
                }
            }

            return Loader;
        },

        makeLoadCallback: function (classNames, callback) {
            return function () {
                var classes = [],
                    i = classNames.length;

                while (i-- > 0) {
                    classes[i] = Manager.get(classNames[i]);
                }

                return callback.apply(this, classes);
            }
        },
        
        onLoadFailure: function () {
            var options = this,
                onError = options.onError;

            Loader.hasFileLoadError = true;
            --Loader.scriptsLoading;

            if (onError) {
                
                onError.call(options.userScope, options);
            }
            else {
                Ext.log.error("[Ext.Loader] Some requested files failed to load.");
            }

            Loader.checkReady();
        },

        onLoadSuccess: function () {
            var options = this,
                onLoad = options.onLoad;

            --Loader.scriptsLoading;
            if (onLoad) {
                
                onLoad.call(options.userScope, options);
                
            }

            Loader.checkReady();
        },


        reportMissingClasses: function () {
            if (!Loader.syncModeEnabled && !Loader.scriptsLoading && Loader.isLoading &&
                    !Loader.hasFileLoadError) {
                var missingClasses = [],
                    missingPaths = [];

                for (var missingClassName in _missingQueue) {
                    missingClasses.push(missingClassName);
                    missingPaths.push(_missingQueue[missingClassName]);
                }

                if (missingClasses.length) {
                    throw new Error("The following classes are not declared even if their files have been " +
                        "loaded: '" + missingClasses.join("', '") + "'. Please check the source code of their " +
                        "corresponding files for possible typos: '" + missingPaths.join("', '"));
                }
            }
        },

        
        onReady: function(fn, scope, withDomReady, options) {
            if (withDomReady) {
                Ready.on(fn, scope, options);
            } else {
                var listener = Ready.makeListener(fn, scope, options);

                if (Loader.isLoading) {
                    readyListeners.push(listener);
                } else {
                    Ready.invoke(listener);
                }
            }
        },

        
        addUsedClasses: function (classes) {
            var cls, i, ln;

            if (classes) {
                classes = (typeof classes === 'string') ? [classes] : classes;
                for (i = 0, ln = classes.length; i < ln; i++) {
                    cls = classes[i];
                    if (typeof cls === 'string' && !Ext.Array.contains(usedClasses, cls)) {
                        usedClasses.push(cls);
                    }
                }
            }

            return Loader;
        },

        
        triggerReady: function() {
            var listener,
                refClasses = usedClasses;

            if (Loader.isLoading && refClasses.length) {
                
                usedClasses = [];

                
                
                Loader.require(refClasses);
            } else {
                
                
                Loader.isLoading = false;

                
                
                readyListeners.sort(Ready.sortFn);

                
                
                
                while (readyListeners.length && !Loader.isLoading) {
                    
                    
                    listener = readyListeners.pop();
                    Ready.invoke(listener);
                }

                
                
                
                
                
                
                
                
                Ready.unblock();
            }
        },

        
        historyPush: function(className) {
            if (className && !isInHistory[className]) {
                isInHistory[className] = true;
                history.push(className);
            }
            return Loader;
        },

        
        loadScripts: function(params) {
            var manifest = Ext.manifest,
                loadOrder = manifest && manifest.loadOrder,
                loadOrderMap = manifest && manifest.loadOrderMap,
                options;
            
            ++Loader.scriptsLoading;
            
            
            
            if (loadOrder && !loadOrderMap) {
                manifest.loadOrderMap = loadOrderMap = Boot.createLoadOrderMap(loadOrder);
            }

            
            
            Loader.checkReady();

            options = Ext.apply({
                loadOrder: loadOrder,
                loadOrderMap: loadOrderMap,
                charset: _config.scriptCharset,
                success: Loader.onLoadSuccess,
                failure: Loader.onLoadFailure,
                sync: Loader.syncModeEnabled,
                _classNames: []
            }, params);

            options.userScope = options.scope;
            options.scope = options;

            Boot.load(options);
        },

        
        loadScriptsSync: function(urls) {
            var syncwas = Loader.syncModeEnabled;
            Loader.syncModeEnabled = true;
            Loader.loadScripts({url: urls});
            Loader.syncModeEnabled = syncwas;
        },

        
        loadScriptsSyncBasePrefix: function(urls) {
            var syncwas = Loader.syncModeEnabled;
            Loader.syncModeEnabled = true;
            Loader.loadScripts({url: urls, prependBaseUrl: true});
            Loader.syncModeEnabled = syncwas;
        },
        
        
        loadScript: function(options) {
            var isString = typeof options === 'string',
                isArray = options instanceof Array,
                isObject = !isArray && !isString,
                url = isObject ? options.url : options,
                onError = isObject && options.onError,
                onLoad = isObject && options.onLoad,
                scope = isObject && options.scope,
                request = {
                    url: url,
                    scope: scope,
                    onLoad: onLoad,
                    onError: onError,
                    _classNames: []
                };

            Loader.loadScripts(request);
        },

        
        flushMissingQueue: function() {
            var name, val, missingwas = 0, missing = 0;
            
            for(name in _missingQueue) {
                missingwas++;
                val = _missingQueue[name];
                if(Manager.isCreated(name)) {
                    delete _missingQueue[name];
                } else if (Manager.existCache[name] === 2) {
                    delete _missingQueue[name];
                } else {
                    ++missing;
                }
            }
            this.missingCount = missing;
        },

        
        checkReady: function() {
            var wasLoading = Loader.isLoading,
                isLoading;

            Loader.flushMissingQueue();
            isLoading = Loader.missingCount + Loader.scriptsLoading;
            
            if(isLoading && !wasLoading) {
                Ready.block();
                Loader.isLoading = !!isLoading;
            } else if (!isLoading && wasLoading) {
                Loader.triggerReady();
            }
        }
    });

    
    Ext.require = alias(Loader, 'require');

    
    Ext.syncRequire = alias(Loader, 'syncRequire');

    
    Ext.exclude = alias(Loader, 'exclude');

    
    Class.registerPreprocessor('loader', function(cls, data, hooks, continueFn) {
        Ext.classSystemMonitor && Ext.classSystemMonitor(cls, 'Ext.Loader#loaderPreprocessor', arguments);
        
        var me = this,
            dependencies = [],
            dependency,
            className = Manager.getName(cls),
            i, j, ln, subLn, value, propertyName, propertyValue,
            requiredMap;

        

        for (i = 0,ln = dependencyProperties.length; i < ln; i++) {
            propertyName = dependencyProperties[i];

            if (data.hasOwnProperty(propertyName)) {
                propertyValue = data[propertyName];

                if (typeof propertyValue == 'string') {
                    dependencies.push(propertyValue);
                }
                else if (propertyValue instanceof Array) {
                    for (j = 0, subLn = propertyValue.length; j < subLn; j++) {
                        value = propertyValue[j];

                        if (typeof value == 'string') {
                            dependencies.push(value);
                        }
                    }
                }
                else if (typeof propertyValue != 'function') {
                    for (j in propertyValue) {
                        if (propertyValue.hasOwnProperty(j)) {
                            value = propertyValue[j];

                            if (typeof value == 'string') {
                                dependencies.push(value);
                            }
                        }
                    }
                }
            }
        }

        if (dependencies.length === 0) {
            return;
        }
        if (className) {
            _requiresMap[className] = dependencies;
        }

        var deadlockPath = [],
            detectDeadlock;

        

        if (className) {
            requiredMap = Loader.requiredByMap || (Loader.requiredByMap = {});

            for (i = 0,ln = dependencies.length; i < ln; i++) {
                dependency = dependencies[i];
                (requiredMap[dependency] || (requiredMap[dependency] = [])).push(className);
            }

            detectDeadlock = function(cls) {
                deadlockPath.push(cls);

                if (_requiresMap[cls]) {
                    if (Ext.Array.contains(_requiresMap[cls], className)) {
                        Ext.Error.raise("Circular requirement detected! '" + className +
                                "' and '" + deadlockPath[1] + "' mutually require each other. Path: " +
                                deadlockPath.join(' -> ') + " -> " + deadlockPath[0]);
                    }

                    for (i = 0,ln = _requiresMap[cls].length; i < ln; i++) {
                        detectDeadlock(_requiresMap[cls][i]);
                    }
                }
            };

            detectDeadlock(className);
        }


        (className ? Loader.exclude(className) : Loader).require(dependencies, function() {
            for (i = 0,ln = dependencyProperties.length; i < ln; i++) {
                propertyName = dependencyProperties[i];

                if (data.hasOwnProperty(propertyName)) {
                    propertyValue = data[propertyName];

                    if (typeof propertyValue == 'string') {
                        data[propertyName] = Manager.get(propertyValue);
                    }
                    else if (propertyValue instanceof Array) {
                        for (j = 0, subLn = propertyValue.length; j < subLn; j++) {
                            value = propertyValue[j];

                            if (typeof value == 'string') {
                                data[propertyName][j] = Manager.get(value);
                            }
                        }
                    }
                    else if (typeof propertyValue != 'function') {
                        for (var k in propertyValue) {
                            if (propertyValue.hasOwnProperty(k)) {
                                value = propertyValue[k];

                                if (typeof value == 'string') {
                                    data[propertyName][k] = Manager.get(value);
                                }
                            }
                        }
                    }
                }
            }

            continueFn.call(me, cls, data, hooks);
        });

        return false;
    }, true, 'after', 'className');

    
    Manager.registerPostprocessor('uses', function(name, cls, data) {
        Ext.classSystemMonitor && Ext.classSystemMonitor(cls, 'Ext.Loader#usesPostprocessor', arguments);
        
        var manifest = Ext.manifest,
            loadOrder = manifest && manifest.loadOrder,
            classes = manifest && manifest.classes,
            uses, clazz, item, len, i, indexMap;

        if (loadOrder) {
            clazz = classes[name];
            if (clazz && !isNaN(i = clazz.idx)) {
                item = loadOrder[i];
                uses = item.uses;
                indexMap = {};
                for (len = uses.length, i = 0; i < len; i++) {
                    indexMap[uses[i]] = true;
                }
                uses = Ext.Boot.getPathsFromIndexes(indexMap, loadOrder, true);
                if (uses.length > 0) {
                    Loader.loadScripts({
                        url: uses,
                        sequential: true
                    });
                }
            }
        }

        if (data.uses) {
            uses = data.uses;
            Loader.addUsedClasses(uses);
        }
    });

    Manager.onCreated(Loader.historyPush);

    Loader.init();
    
};



Ext._endTime = new Date().getTime();




if (Ext._beforereadyhandler){
    Ext._beforereadyhandler();
}


Ext.define('Ext.overrides.util.Positionable', {
    override: 'Ext.util.Positionable',

    

    
    anchorTo: function(anchorToEl, alignment, offsets, animate, monitorScroll, callback) {
        var me = this,
            scroll = !Ext.isEmpty(monitorScroll),
            action = function() {
                me.alignTo(anchorToEl, alignment, offsets, animate);
                Ext.callback(callback, me);
            },
            anchor = me.getAnchor();

        
        me.removeAnchor();
        Ext.apply(anchor, {
            fn: action,
            scroll: scroll
        });

        Ext.on('resize', action, null);

        if (scroll) {
            Ext.getWin().on('scroll', action, null,
                    {buffer: !isNaN(monitorScroll) ? monitorScroll : 50});
        }
        action(); 
        return me;
    },

    getAnchor: function(){
        var el = this.el,
            data, anchor;
            
        if (!el.dom) {
            return;
        }
        data = el.getData();
        anchor = data._anchor;

        if(!anchor){
            anchor = data._anchor = {};
        }
        return anchor;
    },

    

    
    removeAnchor: function() {
        var anchor = this.getAnchor();

        if (anchor && anchor.fn) {
            Ext.un('resize', anchor.fn);
            if (anchor.scroll) {
                Ext.getWin().on('scroll', anchor.fn);
            }
            delete anchor.fn;
        }
        return this;
    },

    
    setBox: function(box, animate) {
        var me = this;

        if (box.isRegion) {
            box = {
                x: box.left,
                y: box.top,
                width: box.right - box.left,
                height: box.bottom - box.top
            };
        }

        if (animate) {
            me.constrainBox(box);
            me.animate(Ext.applyIf({
                to: box,
                listeners: {
                    afteranimate: Ext.Function.bind(me.afterSetPosition, me, [box.x, box.y])
                }
            }, animate));
        } else {
            me.callParent([box]);
        }

        return me;
    }

    

    

    

});


Ext.define('Ext.overrides.dom.Element', (function() {
    var Element, 
        WIN = window,
        DOC = document,
        HIDDEN = 'hidden',
        ISCLIPPED = 'isClipped',
        OVERFLOW = 'overflow',
        OVERFLOWX = 'overflow-x',
        OVERFLOWY = 'overflow-y',
        ORIGINALCLIP = 'originalClip',
        HEIGHT = 'height',
        WIDTH = 'width',
        VISIBILITY = 'visibility',
        DISPLAY = 'display',
        NONE = 'none',
        HIDDEN = 'hidden',
        OFFSETS = 'offsets',
        ORIGINALDISPLAY = 'originalDisplay',
        VISMODE = 'visibilityMode',
        ISVISIBLE = 'isVisible',
        OFFSETCLASS = Ext.baseCSSPrefix + 'hidden-offsets',
        boxMarkup = [
            '<div class="{0}-tl" role="presentation">',
                '<div class="{0}-tr" role="presentation">',
                    '<div class="{0}-tc" role="presentation"></div>',
                '</div>',
            '</div>',
            '<div class="{0}-ml" role="presentation">',
                '<div class="{0}-mr" role="presentation">',
                    '<div class="{0}-mc" role="presentation"></div>',
                '</div>',
            '</div>',
            '<div class="{0}-bl" role="presentation">',
                '<div class="{0}-br" role="presentation">',
                    '<div class="{0}-bc" role="presentation"></div>',
                '</div>',
            '</div>'
        ].join(''),
        tabbableSelector = 'a[href],button,iframe,input,select,textarea,[tabindex]',
        tabbableRe = /^BUTTON|IFRAME|INPUT|SELECT|TEXTAREA$/,
        tabbableSavedFlagAttribute = 'data-tabindexsaved',
        tabbableSavedAttribute = 'data-savedtabindex',
        scriptTagRe = /(?:<script([^>]*)?>)((\n|\r|.)*?)(?:<\/script>)/ig,
        replaceScriptTagRe = /(?:<script.*?>)((\n|\r|.)*?)(?:<\/script>)/ig,
        srcRe = /\ssrc=([\'\"])(.*?)\1/i,
        focusRe = /^a|button|embed|iframe|input|object|select|textarea$/i,
        nonSpaceRe = /\S/,
        typeRe = /\stype=([\'\"])(.*?)\1/i,
        msRe = /^-ms-/,
        camelRe = /(-[a-z])/gi,
        camelReplaceFn = function(m, a) {
            return a.charAt(1).toUpperCase();
        },
        XMASKED = Ext.baseCSSPrefix + "masked",
        XMASKEDRELATIVE = Ext.baseCSSPrefix + "masked-relative",
        EXTELMASKMSG = Ext.baseCSSPrefix + "mask-msg",
        mouseEnterLeaveRe = /^(?:mouseenter|mouseleave)$/,
        bodyRe = /^body/i,
        scrollFly,
        propertyCache = {},
        getDisplay = function(el) {
            var data = el.getData(),
                display = data[ORIGINALDISPLAY];
                
            if (display === undefined) {
                data[ORIGINALDISPLAY] = display = '';
            }
            return display;
        },
        getVisMode = function(el){
            var data = el.getData(),
                visMode = data[VISMODE];
                
            if (visMode === undefined) {
                data[VISMODE] = visMode = Element.VISIBILITY;
            }
            return visMode;
        },
        garbageBin,
        emptyRange      = DOC.createRange ? DOC.createRange() : null;

    return {
        override: 'Ext.dom.Element',

        mixins: [
            'Ext.util.Animate'
        ],

        requires: [
            'Ext.dom.GarbageCollector',
            'Ext.dom.Fly'
        ],

        uses: [
            'Ext.fx.Manager', 
            'Ext.fx.Anim'
        ],

        skipGarbageCollection: false,

        _init: function (E) {
            Element = E; 
        },

        statics: {
            selectableCls: Ext.baseCSSPrefix + 'selectable',
            unselectableCls: Ext.baseCSSPrefix + 'unselectable',

            normalize: function(prop) {
                if (prop === 'float') {
                    prop = Ext.supports.Float ? 'cssFloat' : 'styleFloat';
                }
                
                return propertyCache[prop] || (propertyCache[prop] = prop.replace(msRe, 'ms-').replace(camelRe, camelReplaceFn));
            },

            getViewportHeight: function(){
                return Ext.isIE9m ? DOC.documentElement.clientHeight : WIN.innerHeight;
            },

            getViewportWidth: function() {
                return (!Ext.isStrict && !Ext.isOpera) ? document.body.clientWidth :
                       Ext.isIE9m ? DOC.documentElement.clientWidth : WIN.innerWidth;
            }
        },

        
        addClsOnClick: function(className, testFn, scope) {
            var me = this,
                dom = me.dom,
                hasTest = Ext.isFunction(testFn);
                
            me.on("mousedown", function() {
                if (hasTest && testFn.call(scope || me, me) === false) {
                    return false;
                }
                Ext.fly(dom).addCls(className);
                var d = Ext.getDoc(),
                    fn = function() {
                        Ext.fly(dom).removeCls(className);
                        d.removeListener("mouseup", fn);
                    };
                d.on("mouseup", fn);
            });
            return me;
        },

        
        addClsOnFocus: function(className, testFn, scope) {
            var me = this,
                dom = me.dom,
                hasTest = Ext.isFunction(testFn);
                
            me.on("focus", function() {
                if (hasTest && testFn.call(scope || me, me) === false) {
                    return false;
                }
                Ext.fly(dom).addCls(className);
            });
            me.on("blur", function() {
                Ext.fly(dom).removeCls(className);
            });
            return me;
        },

        
        addClsOnOver: function(className, testFn, scope) {
            var me = this,
                dom = me.dom,
                hasTest = Ext.isFunction(testFn);
                
            me.hover(
                function() {
                    if (hasTest && testFn.call(scope || me, me) === false) {
                        return;
                    }
                    Ext.fly(dom).addCls(className);
                },
                function() {
                    Ext.fly(dom).removeCls(className);
                }
            );
            return me;
        },

        
        addKeyListener: function(key, fn, scope){
            var config;
            if(typeof key !== 'object' || Ext.isArray(key)){
                config = {
                    target: this,
                    key: key,
                    fn: fn,
                    scope: scope
                };
            } else {
                config = {
                    target: this,
                    key : key.key,
                    shift : key.shift,
                    ctrl : key.ctrl,
                    alt : key.alt,
                    fn: fn,
                    scope: scope
                };
            }
            return new Ext.util.KeyMap(config);
        },

        
        addKeyMap: function(config) {
            return new Ext.util.KeyMap(Ext.apply({
                target: this
            }, config));
        },

        
        anchorAnimX: function(anchor) {
            var xName = (anchor === 'l') ? 'right' : 'left';
            this.dom.style[xName] = '0px';
        },

        
        anim: function(config) {
            if (!Ext.isObject(config)) {
                return (config) ? {} : false;
            }

            var me = this,
                duration = config.duration || Ext.fx.Anim.prototype.duration,
                easing = config.easing || 'ease',
                animConfig;

            if (config.stopAnimation) {
                me.stopAnimation();
            }

            Ext.applyIf(config, Ext.fx.Manager.getFxDefaults(me.id));

            
            Ext.fx.Manager.setFxDefaults(me.id, {
                delay: 0
            });

            animConfig = {
                
                target: me.dom,
                remove: config.remove,
                alternate: config.alternate || false,
                duration: duration,
                easing: easing,
                callback: config.callback,
                listeners: config.listeners,
                iterations: config.iterations || 1,
                scope: config.scope,
                block: config.block,
                concurrent: config.concurrent,
                delay: config.delay || 0,
                paused: true,
                keyframes: config.keyframes,
                from: config.from || {},
                to: Ext.apply({}, config)
            };
            Ext.apply(animConfig.to, config.to);

            
            delete animConfig.to.to;
            delete animConfig.to.from;
            delete animConfig.to.remove;
            delete animConfig.to.alternate;
            delete animConfig.to.keyframes;
            delete animConfig.to.iterations;
            delete animConfig.to.listeners;
            delete animConfig.to.target;
            delete animConfig.to.paused;
            delete animConfig.to.callback;
            delete animConfig.to.scope;
            delete animConfig.to.duration;
            delete animConfig.to.easing;
            delete animConfig.to.concurrent;
            delete animConfig.to.block;
            delete animConfig.to.stopAnimation;
            delete animConfig.to.delay;
            return animConfig;
        },

        
        animate: function(config) {
            var me = this,
                animId = me.dom.id || Ext.id(me.dom),
                listeners,
                anim,
                end;
                

            if (!Ext.fx.Manager.hasFxBlock(animId)) {
                
                if (config.listeners) {
                    listeners = config.listeners;
                    delete config.listeners;
                }
                if (config.internalListeners) {
                    config.listeners = config.internalListeners;
                    delete config.internalListeners;
                }
                end = config.autoEnd;
                delete config.autoEnd;
                anim = new Ext.fx.Anim(me.anim(config));
                if (listeners) {
                    anim.on(listeners);
                }
                Ext.fx.Manager.queueFx(anim);
                if (end) {
                    anim.jumpToEnd();
                }
            }
            return me;
        },

        
        boxWrap: function(cls) {
            cls = cls || Ext.baseCSSPrefix + 'box';
            var el = Ext.get(this.insertHtml("beforeBegin", "<div class='" + cls + "' role='presentation'>" + Ext.String.format(boxMarkup, cls) + "</div>"));
            el.selectNode('.' + cls + '-mc').appendChild(this.dom);
            return el;
        },

        
        cacheScrollValues: function() {
            var me = this,
                scrollValues = [],
                scrolledDescendants = [], 
                descendants, descendant, i, len;

            scrollFly = scrollFly || new Ext.dom.Fly();

            descendants = me.query('*');
            for (i = 0, len = descendants.length; i < len; i++) {
                descendant = descendants[i];
                
                
                if (descendant.scrollTop > 0 || descendant.scrollLeft !== 0) {
                    scrolledDescendants.push(descendant);
                    scrollValues.push(scrollFly.attach(descendant).getScroll());
                }
            }

            return function() {
                var scroll, i, len;

                for (i = 0, len = scrolledDescendants.length; i < len; i++) {
                    scroll = scrollValues[i];
                    scrollFly.attach(scrolledDescendants[i]);
                    scrollFly.setScrollLeft(scroll.left);
                    scrollFly.setScrollTop(scroll.top);
                }
            };
        },

        
        clean: function(forceReclean) {
            var me   = this,
                dom  = me.dom,
                data = me.getData(),
                n    = dom.firstChild,
                ni   = -1,
                nx;

            if (data.isCleaned && forceReclean !== true) {
                return me;
            }

            while (n) {
                nx = n.nextSibling;
                if (n.nodeType === 3) {
                    
                    if (!(nonSpaceRe.test(n.nodeValue))) {
                        dom.removeChild(n);
                    
                    } else if (nx && nx.nodeType === 3) {
                        n.appendData(Ext.String.trim(nx.data));
                        dom.removeChild(nx);
                        nx = n.nextSibling;
                        n.nodeIndex = ++ni;
                    }
                } else {
                    
                    Ext.fly(n, '_clean').clean();
                    n.nodeIndex = ++ni;
                }
                n = nx;
            }

            data.isCleaned = true;
            return me;
        },

        
        empty: emptyRange ? function() {
            var dom = this.dom;

            if (dom.firstChild) {
                emptyRange.setStartBefore(dom.firstChild);
                emptyRange.setEndAfter(dom.lastChild);
                emptyRange.deleteContents();
            }
        } : function() {
            var dom = this.dom;

            while (dom.lastChild) {
                dom.removeChild(dom.lastChild);
            }
        },

        clearListeners: function() {
            this.removeAnchor();
            this.callParent();
        },

        
        clearPositioning: function(value) {
            value = value || '';
            return this.setStyle({
                left : value,
                right : value,
                top : value,
                bottom : value,
                'z-index' : '',
                position : 'static'
            });
        },

        
        createProxy: function(config, renderTo, matchBox) {
            config = (typeof config === 'object') ? config :
                { tag: "div", role: 'presentation', cls: config };

            var me = this,
                proxy = renderTo ? Ext.DomHelper.append(renderTo, config, true) :
                                   Ext.DomHelper.insertBefore(me.dom, config, true);

            proxy.setVisibilityMode(Element.DISPLAY);
            proxy.hide();
            if (matchBox && me.setBox && me.getBox) { 
               proxy.setBox(me.getBox());
            }
            return proxy;
        },

        
        clearOpacity: function() {
            return this.setOpacity('');
        },

        
        clip: function() {
            var me = this,
                data = me.getData(),
                style;

            if (!data[ISCLIPPED]) {
                data[ISCLIPPED] = true;
                style = me.getStyle([OVERFLOW, OVERFLOWX, OVERFLOWY]);
                data[ORIGINALCLIP] = {
                    o: style[OVERFLOW],
                    x: style[OVERFLOWX],
                    y: style[OVERFLOWY]
                };
                me.setStyle(OVERFLOW, HIDDEN);
                me.setStyle(OVERFLOWX, HIDDEN);
                me.setStyle(OVERFLOWY, HIDDEN);
            }
            return me;
        },

        constrainScrollLeft: function(left) {
            var dom = this.dom;
            return Math.max(Math.min(left, dom.scrollWidth - dom.clientWidth), 0);
        },

        constrainScrollTop: function(top) {
            var dom = this.dom;
            return Math.max(Math.min(top, dom.scrollHeight - dom.clientHeight), 0);
        },

        destroy: function() {
            var me = this,
                dom = me.dom;

            if (dom && me.isAnimate) {
                me.stopAnimation();
            }

            me.callParent();

            
            
            if (dom && Ext.isIE8) {
                garbageBin = garbageBin || DOC.createElement('div');
                garbageBin.appendChild(dom);
                garbageBin.innerHTML = '';
            }
        },

        
        
        
        doScrollIntoView: function(container, hscroll, animate, highlight, getScrollX, scrollTo) {
            scrollFly = scrollFly || new Ext.dom.Fly();

            var me = this,
                dom = me.dom,
                scrollX = scrollFly.attach(container)[getScrollX](),
                scrollY = container.scrollTop,
                position = me.getScrollIntoViewXY(container, scrollX, scrollY),
                newScrollX = position.x,
                newScrollY = position.y;

            
            if (highlight) {
                if (animate) {
                    animate = Ext.apply({
                        listeners: {
                            afteranimate: function() {
                                scrollFly.attach(dom).highlight();
                            }
                        }
                    }, animate);
                } else {
                    scrollFly.attach(dom).highlight();
                }
            }

            if (newScrollY !== scrollY) {
                scrollFly.attach(container).scrollTo('top', newScrollY, animate);
            }

            if (hscroll !== false  && (newScrollX !== scrollX)) {
                scrollFly.attach(container)[scrollTo]('left', newScrollX, animate);
            }
            return me;
        },

        
        enableDisplayMode : function(display) {
            var me = this;

            me.setVisibilityMode(Element.DISPLAY);

            if (display !== undefined) {
                me.getData()[ORIGINALDISPLAY] = display;
            }

            return me;
        },

        
        fadeIn: function(o) {
            var me = this,
                dom = me.dom;
                
            me.animate(Ext.apply({}, o, {
                opacity: 1,
                internalListeners: {
                    beforeanimate: function(anim){
                        
                        
                        var el = Ext.fly(dom, '_anim');
                        if (el.isStyle('display', 'none')) {
                            el.setDisplayed('');
                        } else {
                            el.show();
                        } 
                    }
                }
            }));
            return this;
        },

        
        fadeOut: function(o) {
            var me = this,
                dom = me.dom;
                
            o = Ext.apply({
                opacity: 0,
                internalListeners: {
                    afteranimate: function(anim){
                        if (dom && anim.to.opacity === 0) {
                            var el = Ext.fly(dom, '_anim');
                            if (o.useDisplay) {
                                el.setDisplayed(false);
                            } else {
                                el.hide();
                            }
                        }         
                    }
                }
            }, o);
            me.animate(o);
            return me;
        },

        
        fixDisplay: function(){
            var me = this;
            if (me.isStyle(DISPLAY, NONE)) {
                me.setStyle(VISIBILITY, HIDDEN);
                me.setStyle(DISPLAY, getDisplay(me)); 
                if (me.isStyle(DISPLAY, NONE)) { 
                    me.setStyle(DISPLAY, "block");
                }
            }
        },

        
        frame: function(color, count, obj){
            var me = this,
                dom = me.dom,
                beforeAnim;

            color = color || '#C3DAF9';
            count = count || 1;
            obj = obj || {};

            beforeAnim = function() {
                var el = Ext.fly(dom, '_anim'),
                    animScope = this,
                    box,
                    proxy, proxyAnim;
                    
                el.show();
                box = el.getBox();
                proxy = Ext.getBody().createChild({
                    role: 'presentation',
                    id: el.dom.id + '-anim-proxy',
                    style: {
                        position : 'absolute',
                        'pointer-events': 'none',
                        'z-index': 35000,
                        border : '0px solid ' + color
                    }
                });
                
                proxyAnim = new Ext.fx.Anim({
                    target: proxy,
                    duration: obj.duration || 1000,
                    iterations: count,
                    from: {
                        top: box.y,
                        left: box.x,
                        borderWidth: 0,
                        opacity: 1,
                        height: box.height,
                        width: box.width
                    },
                    to: {
                        top: box.y - 20,
                        left: box.x - 20,
                        borderWidth: 10,
                        opacity: 0,
                        height: box.height + 40,
                        width: box.width + 40
                    }
                });
                proxyAnim.on('afteranimate', function() {
                    proxy.destroy();
                    
                    animScope.end();
                });
            };

            me.animate({
                
                duration: (Math.max(obj.duration, 500) * 2) || 2000,
                listeners: {
                    beforeanimate: {
                        fn: beforeAnim
                    }
                },
                callback: obj.callback,
                scope: obj.scope
            });
            return me;
        },

        
        getColor: function(attr, defaultValue, prefix) {
            var v = this.getStyle(attr),
                color = prefix || prefix === '' ? prefix : '#',
                h, len, i=0;

            if (!v || (/transparent|inherit/.test(v))) {
                return defaultValue;
            }
            if (/^r/.test(v)) {
                 v = v.slice(4, v.length - 1).split(',');
                 len = v.length;
                 for (; i<len; i++) {
                    h = parseInt(v[i], 10);
                    color += (h < 16 ? '0' : '') + h.toString(16);
                }
            } else {
                v = v.replace('#', '');
                color += v.length === 3 ? v.replace(/^(\w)(\w)(\w)$/, '$1$1$2$2$3$3') : v;
            }
            return(color.length > 5 ? color.toLowerCase() : defaultValue);
        },

        
        getLoader: function() {
            var me = this,
                data = me.getData(),
                loader = data.loader;

            if (!loader) {
                data.loader = loader = new Ext.ElementLoader({
                    target: me
                });
            }
            return loader;
        },

        
        getPositioning: function(autoPx){
            var styles = this.getStyle(['left', 'top', 'position', 'z-index']),
                dom = this.dom;

            if(autoPx) {
                if(styles.left === 'auto') {
                    styles.left = dom.offsetLeft + 'px';
                }
                if(styles.top === 'auto') {
                    styles.top = dom.offsetTop + 'px';
                }
            }

            return styles;
        },

        
        getScroll: function() {
            var me = this,
                dom = me.dom,
                docElement = DOC.documentElement,
                left, top,
                body = document.body;

            if (dom === DOC || dom === body) {
                
                
                
                
                
                
                
                
                left = docElement.scrollLeft || (body ? body.scrollLeft : 0);
                top = docElement.scrollTop || (body ? body.scrollTop : 0);
            } else {
                left = dom.scrollLeft;
                top = dom.scrollTop;
            }

            return {
                left: left,
                top: top
            };
        },

        
        getScrollIntoViewXY: function(container, scrollX, scrollY) {
            var me = this,
                dom = me.dom,
                ct = Ext.getDom(container),
                offsets = me.getOffsetsTo(ct),
            
                width = dom.offsetWidth,
                height = dom.offsetHeight,
                left = offsets[0] + scrollX,
                top = offsets[1] + scrollY,
                bottom = top + height,
                right = left + width,
            
                ctClientHeight = ct.clientHeight,
                ctClientWidth = ct.clientWidth,
                ctBottom = scrollY + ctClientHeight,
                ctRight = scrollX + ctClientWidth,
                scrollX, scrollY;

            if (height > ctClientHeight || top < scrollY) {
                scrollY = top;
            } else if (bottom > ctBottom) {
                scrollY = bottom - ctClientHeight;
            }

            if (width > ctClientWidth || left < scrollX) {
                scrollX = left;
            } else if (right > ctRight) {
                scrollX = right - ctClientWidth;
            }

            return {
                x: scrollX,
                y: scrollY
            };
        },

        
        getScrollLeft: function() {
            var dom = this.dom;
                
            if (dom === DOC || dom === document.body) {
                return this.getScroll().left;
            } else {
                return dom.scrollLeft;
            }
        },
        
        
        getScrollTop: function(){
            var dom = this.dom;
                
            if (dom === DOC || dom === document.body) {
                return this.getScroll().top;
            } else {
                return dom.scrollTop;
            }
        },

        getXY: function() {
            var xy = this.callParent(),
                scroll = Ext.getDoc().getScroll();

            xy[0] += scroll.left;
            xy[1] += scroll.top;
            return xy;
        },

        
        ghost: function(anchor, obj) {
            var me = this,
                dom = me.dom,
                beforeAnim;

            anchor = anchor || "b";
            beforeAnim = function() {
                var el = Ext.fly(dom, '_anim'),
                    width = el.getWidth(),
                    height = el.getHeight(),
                    xy = el.getXY(),
                    position = el.getPositioning(),
                    to = {
                        opacity: 0
                    };
                switch (anchor) {
                    case 't':
                        to.y = xy[1] - height;
                        break;
                    case 'l':
                        to.x = xy[0] - width;
                        break;
                    case 'r':
                        to.x = xy[0] + width;
                        break;
                    case 'b':
                        to.y = xy[1] + height;
                        break;
                    case 'tl':
                        to.x = xy[0] - width;
                        to.y = xy[1] - height;
                        break;
                    case 'bl':
                        to.x = xy[0] - width;
                        to.y = xy[1] + height;
                        break;
                    case 'br':
                        to.x = xy[0] + width;
                        to.y = xy[1] + height;
                        break;
                    case 'tr':
                        to.x = xy[0] + width;
                        to.y = xy[1] - height;
                        break;
                }
                this.to = to;
                this.on('afteranimate', function () {
                    var el = Ext.fly(dom, '_anim');
                    if (el) {
                        el.hide();
                        el.clearOpacity();
                        el.setPositioning(position);
                    }
                });
            };

            me.animate(Ext.applyIf(obj || {}, {
                duration: 500,
                easing: 'ease-out',
                listeners: {
                    beforeanimate: beforeAnim
                }
            }));
            return me;
        },

        
        hide: function(animate){
            
            if (typeof animate === 'string'){
                this.setVisible(false, animate);
                return this;
            }
            this.setVisible(false, this.anim(animate));
            return this;
        },

        
        highlight: function(color, o) {
            var me = this,
                dom = me.dom,
                from = {},
                restore, to, attr, lns, event, fn;

            o = o || {};
            lns = o.listeners || {};
            attr = o.attr || 'backgroundColor';
            from[attr] = color || 'ffff9c';

            if (!o.to) {
                to = {};
                to[attr] = o.endColor || me.getColor(attr, 'ffffff', '');
            }
            else {
                to = o.to;
            }

            
            o.listeners = Ext.apply(Ext.apply({}, lns), {
                beforeanimate: function() {
                    restore = dom.style[attr];
                    var el = Ext.fly(dom, '_anim');
                    el.clearOpacity();
                    el.show();

                    event = lns.beforeanimate;
                    if (event) {
                        fn = event.fn || event;
                        return fn.apply(event.scope || lns.scope || WIN, arguments);
                    }
                },
                afteranimate: function() {
                    if (dom) {
                        dom.style[attr] = restore;
                    }

                    event = lns.afteranimate;
                    if (event) {
                        fn = event.fn || event;
                        fn.apply(event.scope || lns.scope || WIN, arguments);
                    }
                }
            });

            me.animate(Ext.apply({}, o, {
                duration: 1000,
                easing: 'ease-in',
                from: from,
                to: to
            }));
            return me;
        },

        
        hover: function(overFn, outFn, scope, options) {
            var me = this;
            me.on('mouseenter', overFn, scope || me.dom, options);
            me.on('mouseleave', outFn, scope || me.dom, options);
            return me;
        },

        
        initDD: function(group, config, overrides){
            var dd = new Ext.dd.DD(Ext.id(this.dom), group, config);
            return Ext.apply(dd, overrides);
        },

        
        initDDProxy: function(group, config, overrides){
            var dd = new Ext.dd.DDProxy(Ext.id(this.dom), group, config);
            return Ext.apply(dd, overrides);
        },

        
        initDDTarget: function(group, config, overrides){
            var dd = new Ext.dd.DDTarget(Ext.id(this.dom), group, config);
            return Ext.apply(dd, overrides);
        },

        
        isFocusable: function ( asFocusEl) {
            var me = this,
                dom = me.dom,
                hasTabIndex = dom.hasAttribute('tabindex'),
                tabIndex = hasTabIndex && dom.getAttribute('tabindex'),
                nodeName = dom.nodeName,
                canFocus = false;

            if (dom && !dom.disabled) {
                
                if (tabIndex == "-1") { 
                    canFocus = asFocusEl;
                }
                else {
                    
                    if (focusRe.test(nodeName)) {
                        if ((nodeName !== 'A') || dom.href) {
                            canFocus = true;
                        }
                    }
                    
                    else {
                        canFocus = tabIndex != null && tabIndex >= 0;
                    }
                }
                canFocus = canFocus && me.isVisible(true);
            }
            return canFocus;
        },
        
        
        isMasked: function(deep) {
            var me = this,
                data = me.getData(),
                maskEl = data.maskEl,
                maskMsg = data.maskMsg,
                hasMask = false,
                parent;

            if (maskEl && maskEl.isVisible()) {
                if (maskMsg) {
                    maskMsg.center(me);
                }
                hasMask = true;
            }
            else if (deep) {
                parent = me.findParentNode();
                
                if (parent) {
                    return Ext.fly(parent).isMasked(deep);
                }
            }
            
            return hasMask;
        },

        
        isScrollable: function() {
            var dom = this.dom;
            return dom.scrollHeight > dom.clientHeight || dom.scrollWidth > dom.clientWidth;
        },

        
        load: function(options) {
            this.getLoader().load(options);
            return this;
        },

        
        mask: function (msg, msgCls , elHeight) {
            var me = this,
                dom = me.dom,
                data = me.getData(),
                maskEl = data.maskEl,
                maskMsg = data.maskMsg;

            if (!(bodyRe.test(dom.tagName) && me.getStyle('position') == 'static')) {
                me.addCls(XMASKEDRELATIVE);
            }

            
            if (maskEl) {
                maskEl.destroy();
            }

            if (maskMsg) {
                maskMsg.destroy();
            }

            Ext.DomHelper.append(dom, [{
                role: 'presentation',
                cls : Ext.baseCSSPrefix + "mask",
                style: 'top:0;left:0;'
            }, {
                role: 'presentation',
                cls : msgCls ? EXTELMASKMSG + " " + msgCls : EXTELMASKMSG,
                cn  : {
                    tag: 'div',
                    role: 'presentation',
                    cls: Ext.baseCSSPrefix + 'mask-msg-inner',
                    cn: {
                        tag: 'div',
                        role: 'presentation',
                        cls: Ext.baseCSSPrefix + 'mask-msg-text',
                        html: msg || ''
                    }
                }
            }]);

            maskMsg = Ext.get(dom.lastChild);
            maskEl = Ext.get(maskMsg.dom.previousSibling);

            data.maskMsg = maskMsg;
            data.maskEl = maskEl;

            me.addCls(XMASKED);
            maskEl.setDisplayed(true);

            if (typeof msg === 'string') {
                maskMsg.setDisplayed(true);
                maskMsg.center(me);
            } else {
                maskMsg.setDisplayed(false);
            }

            
            if (dom === DOC.body) {
                maskEl.addCls(Ext.baseCSSPrefix + 'mask-fixed');
            }
            else {
                me.saveTabbableState();
            }
            
            me.saveChildrenTabbableState();

            
            if (Ext.isIE9m && dom !== DOC.body && me.isStyle('height', 'auto')) {
                maskEl.setSize(undefined, elHeight || me.getHeight());
            }
            return maskEl;
        },

        
        monitorMouseLeave: function(delay, handler, scope) {
            var me = this,
                timer,
                listeners = {
                    mouseleave: function(e) {
                        if (Ext.isIE9m) {
                            e.enableIEAsync();
                        }
                        timer = Ext.defer(handler, delay, scope || me, [e]);
                    },
                    mouseenter: function() {
                        clearTimeout(timer);
                    }
                };

            me.on(listeners);
            return listeners;
        },

        
        needsTabIndex: function() {
            var me = this;

            if (me.dom) {
                if ((me.dom.nodeName === 'A') && (!me.dom.href)) {
                    return true;
                }
                return !focusRe.test(me.dom.nodeName);
            }
        },

        
        normalizeEvent: function(eventName) {
            var fn, newName;

            if (!Ext.supports.MouseEnterLeave && mouseEnterLeaveRe.test(eventName)) {
                fn = this.normalizeWithin;
                newName = eventName == 'mouseenter' ? 'mouseover' : 'mouseout';
            } else if (eventName == 'mousewheel' && !Ext.supports.MouseWheel && !Ext.isOpera) {
                newName = 'DOMMouseScroll';
            }
            return newName ? {
                eventName: newName,
                normalizeFn: fn
            } : null;
        },

        
        normalizeWithin: function(event) {
            var parent = event.currentTarget,
                child = event.getRelatedTarget();

            if (parent && parent.firstChild) {
                while (child) {
                    if (child === parent) {
                        return false;
                    }
                    child = child.parentNode;
                    if (child && (child.nodeType !== 1)) {
                        child = null;
                    }
                }
            }
            return true;
        },

        
        puff: function(obj) {
            var me = this,
                dom = me.dom,
                beforeAnim,
                box = me.getBox(),
                originalStyles = me.getStyle(['width', 'height', 'left', 'right', 'top', 'bottom', 'position', 'z-index', 'font-size', 'opacity'], true);

           obj = Ext.applyIf(obj || {}, {
                easing: 'ease-out',
                duration: 500,
                useDisplay: false
            });

            beforeAnim = function() {
                var el = Ext.fly(dom, '_anim');
                
                el.clearOpacity();
                el.show();
                this.to = {
                    width: box.width * 2,
                    height: box.height * 2,
                    x: box.x - (box.width / 2),
                    y: box.y - (box.height /2),
                    opacity: 0,
                    fontSize: '200%'
                };
                this.on('afteranimate',function() {
                    var el = Ext.fly(dom, '_anim');
                    if (el) {
                        if (obj.useDisplay) {
                            el.setDisplayed(false);
                        } else {
                            el.hide();
                        }
                        el.setStyle(originalStyles);
                        Ext.callback(obj.callback, obj.scope);
                    }
                });
            };

            me.animate({
                duration: obj.duration,
                easing: obj.easing,
                listeners: {
                    beforeanimate: {
                        fn: beforeAnim
                    }
                }
            });
            return me;
        },

        
        scroll: function(direction, distance, animate) {
            if (!this.isScrollable()) {
                return false;
            }
            
            
            
            direction = direction.charAt(0);
            var me = this,
                dom = me.dom,
                side = direction === 'r' || direction === 'l' ? 'left' : 'top',
                scrolled = false,
                currentScroll, constrainedScroll;

            if (direction === 'l' || direction === 't' || direction === 'u') {
                distance = -distance;
            }

            if (side === 'left') {
                currentScroll = dom.scrollLeft;
                constrainedScroll = me.constrainScrollLeft(currentScroll + distance);
            } else {
                currentScroll = dom.scrollTop;
                constrainedScroll = me.constrainScrollTop(currentScroll + distance);
            }

            if (constrainedScroll !== currentScroll) {
                this.scrollTo(side, constrainedScroll, animate);
                scrolled = true;
            }

            return scrolled;
        },

        
        scrollBy: function(deltaX, deltaY, animate) {
            var me = this,
                dom = me.dom;

            
            if (deltaX.length) {
                animate = deltaY;
                deltaY = deltaX[1];
                deltaX = deltaX[0];
            } else if (typeof deltaX != 'number') { 
                animate = deltaY;
                deltaY = deltaX.y;
                deltaX = deltaX.x;
            }

            if (deltaX) {
                me.scrollTo('left', me.constrainScrollLeft(dom.scrollLeft + deltaX), animate);
            }
            if (deltaY) {
                me.scrollTo('top', me.constrainScrollTop(dom.scrollTop + deltaY), animate);
            }

            return me;
        },

        
        scrollChildIntoView: function(child, hscroll) {
            
            Ext.fly(child).scrollIntoView(this, hscroll);
        },

        
        scrollIntoView: function(container, hscroll, animate, highlight) {
            container = Ext.getDom(container) || Ext.getBody().dom;

            return this.doScrollIntoView(
                container,
                hscroll,
                animate,
                highlight,
                'getScrollLeft',
                'scrollTo'
            );
        },

        
        scrollTo: function(side, value, animate) {
            
            var top = /top/i.test(side),
                me = this,
                prop = top ? 'scrollTop' : 'scrollLeft',
                dom = me.dom,
                animCfg;

            if (!animate || !me.anim) {
                
                dom[prop] = value;
                
                dom[prop] = value;
            }
            else {
                animCfg = {
                    to: {}
                };
                animCfg.to[prop] = value;
                if (Ext.isObject(animate)) {
                    Ext.applyIf(animCfg, animate);
                }
                me.animate(animCfg);
            }
            return me;
        },

        
        selectable: function() {
            var me = this;

            
            
            me.dom.unselectable = '';

            me.removeCls(Element.unselectableCls);
            me.addCls(Element.selectableCls);

            return me;
        },
        
        
        
        
        
        
        
        setCapture: function() {
            var dom = this.dom;
            if (Ext.isIE9m && dom.setCapture) {
                dom.setCapture();
            }
        },

        
        setDisplayed: function(value) {
            if (typeof value === "boolean"){
               value = value ? getDisplay(this) : NONE;
            }
            this.setStyle(DISPLAY, value);
            return this;
        },

        
        setHeight: function(height, animate) {
            var me = this;

            if (!animate || !me.anim) {
                me.callParent(arguments);
            }
            else {
                if (!Ext.isObject(animate)) {
                    animate = {};
                }
                me.animate(Ext.applyIf({
                    to: {
                        height: height
                    }
                }, animate));
            }

            return me;
        },

        
        setHorizontal: function() {
            var me = this,
                cls = me.verticalCls;

            delete me.vertical;
            if (cls) {
                delete me.verticalCls;
                me.removeCls(cls);
            }

            
            delete me.setWidth;
            delete me.setHeight;
            if (!Ext.isIE8) {
                delete me.getWidth;
                delete me.getHeight;
            }

            
            delete me.styleHooks;
        },

        
        updateText: function(text) {
            var me = this,
                dom,
                textNode;

            if (dom) {
                textNode = dom.firstChild;
                if (!textNode || (textNode.nodeType !== 3 || textNode.nextSibling)) {
                    textNode = DOC.createTextNode();
                    me.empty();
                    dom.appendChild(textNode);
                }
                if (text) {
                    textNode.data = text;
                }
            }
        },

        
        setHtml: function(html, loadScripts, callback) {
            var me = this,
                id,
                dom,
                interval;

            if (!me.dom) {
                return me;
            }
            html = html || '';
            dom = me.dom;

            if (loadScripts !== true) {
                dom.innerHTML = html;
                Ext.callback(callback, me);
                return me;
            }

            id  = Ext.id();
            html += '<span id="' + id + '" role="presentation"></span>';

            interval = Ext.interval(function() {
                var hd,
                    match,
                    attrs,
                    srcMatch,
                    typeMatch,
                    el,
                    s;
                if (!(el = DOC.getElementById(id))) {
                    return false;
                }
                clearInterval(interval);
                Ext.removeNode(el);
                hd = Ext.getHead().dom;

                while ((match = scriptTagRe.exec(html))) {
                    attrs = match[1];
                    srcMatch = attrs ? attrs.match(srcRe) : false;
                    if (srcMatch && srcMatch[2]) {
                       s = DOC.createElement("script");
                       s.src = srcMatch[2];
                       typeMatch = attrs.match(typeRe);
                       if (typeMatch && typeMatch[2]) {
                           s.type = typeMatch[2];
                       }
                       hd.appendChild(s);
                    } else if (match[2] && match[2].length > 0) {
                        if (WIN.execScript) {
                           WIN.execScript(match[2]);
                        } else {
                           WIN.eval(match[2]);
                        }
                    }
                }
                Ext.callback(callback, me);
            }, 20);
            dom.innerHTML = html.replace(replaceScriptTagRe, '');
            return me;
        },

        
        setOpacity: function(opacity, animate) {
            var me = this;

            if (!me.dom) {
                return me;
            }

            if (!animate || !me.anim) {
                me.setStyle('opacity', opacity);
            }
            else {
                if (typeof animate != 'object') {
                    animate = {
                        duration: 350,
                        easing: 'ease-in'
                    };
                }

                me.animate(Ext.applyIf({
                    to: {
                        opacity: opacity
                    }
                }, animate));
            }
            return me;
        },

        
        setPositioning: function(pc) {
            return this.setStyle(pc);
        },

        
        setScrollLeft: function(left){
            this.dom.scrollLeft = left;
            return this;
        },
        
        
        setScrollTop: function(top) {
            this.dom.scrollTop = top;
            return this;
        },

        
        setVertical: function(angle, cls) {
            var me = this,
                proto = Element.prototype;

            me.vertical = true;
            if (cls) {
                me.addCls(me.verticalCls = cls);
            }

            me.setWidth = proto.setHeight;
            me.setHeight = proto.setWidth;
            if (!Ext.isIE8) {
                
                
                
                
                me.getWidth = proto.getHeight;
                me.getHeight = proto.getWidth;
            }

            
            me.styleHooks = (angle === 270) ?
                proto.verticalStyleHooks270 : proto.verticalStyleHooks90;
        },

        
        setSize: function(width, height, animate) {
            var me = this;

            if (Ext.isObject(width)) { 
                animate = height;
                height = width.height;
                width = width.width;
            }

            if (!animate || !me.anim) {
                me.dom.style.width = Element.addUnits(width);
                me.dom.style.height = Element.addUnits(height);
            }
            else {
                if (animate === true) {
                    animate = {};
                }
                me.animate(Ext.applyIf({
                    to: {
                        width: width,
                        height: height
                    }
                }, animate));
            }

            return me;
        },

        
        setVisible: function(visible, animate) {
            var me = this,
                dom = me.dom,
                visMode = getVisMode(me);

            
            if (typeof animate === 'string') {
                switch (animate) {
                    case DISPLAY:
                        visMode = Element.DISPLAY;
                        break;
                    case VISIBILITY:
                        visMode = Element.VISIBILITY;
                        break;
                    case OFFSETS:
                        visMode = Element.OFFSETS;
                        break;
                }
                me.setVisibilityMode(visMode);
                animate = false;
            }

            if (!animate || !me.anim) {
                if (visMode === Element.DISPLAY) {
                    return me.setDisplayed(visible);
                } else if (visMode === Element.OFFSETS) {
                    me[visible?'removeCls':'addCls'](OFFSETCLASS);
                } else if (visMode === Element.VISIBILITY) {
                    me.fixDisplay();
                    
                    dom.style.visibility = visible ? '' : HIDDEN;
                }
            } else {
                
                if (visible) {
                    me.setOpacity(0.01);
                    me.setVisible(true);
                }
                if (!Ext.isObject(animate)) {
                    animate = {
                        duration: 350,
                        easing: 'ease-in'
                    };
                }
                me.animate(Ext.applyIf({
                    callback: function() {
                        if (!visible) {
                            
                            
                            Ext.fly(dom).setVisible(false).setOpacity(1);
                        }
                    },
                    to: {
                        opacity: (visible) ? 1 : 0
                    }
                }, animate));
            }
            me.getData()[ISVISIBLE] = visible;
            return me;
        },

        
        setWidth: function(width, animate) {
            var me = this;
            if (!animate || !me.anim) {
                me.callParent(arguments);
            }
            else {
                if (!Ext.isObject(animate)) {
                    animate = {};
                }
                me.animate(Ext.applyIf({
                    to: {
                        width: width
                    }
                }, animate));
            }
            return me;
        },

        setX: function(x, animate) {
            return this.setXY([x, this.getY()], animate);
        },

        setXY: function(xy, animate) {
            var me = this;

            if (!animate || !me.anim) {
                me.callParent([xy]);
            } else {
                if (!Ext.isObject(animate)) {
                    animate = {};
                }
                me.animate(Ext.applyIf({ to: { x: xy[0], y: xy[1] } }, animate));
            }
            return this;
        },

        setY: function(y, animate) {
            return this.setXY([this.getX(), y], animate);
        },

        
        show: function(animate){
            
            if (typeof animate === 'string'){
                this.setVisible(true, animate);
                return this;
            }
            this.setVisible(true, this.anim(animate));
            return this;
        },

        
        slideIn: function(anchor, obj, slideOut) {
            var me = this,
                dom = me.dom,
                elStyle = dom.style,
                beforeAnim,
                wrapAnim,
                restoreScroll,
                wrapDomParentNode;

            anchor = anchor || "t";
            obj = obj || {};

            beforeAnim = function() {
                var animScope = this,
                    listeners = obj.listeners,
                    el = Ext.fly(dom, '_anim'),
                    box, originalStyles, anim, wrap;

                if (!slideOut) {
                    el.fixDisplay();
                }

                box = el.getBox();
                if ((anchor == 't' || anchor == 'b') && box.height === 0) {
                    box.height = dom.scrollHeight;
                }
                else if ((anchor == 'l' || anchor == 'r') && box.width === 0) {
                    box.width = dom.scrollWidth;
                }

                originalStyles = el.getStyle(['width', 'height', 'left', 'right', 'top', 'bottom', 'position', 'z-index'], true);
                el.setSize(box.width, box.height);

                
                if (obj.preserveScroll) {
                    restoreScroll = el.cacheScrollValues();
                }

                wrap = el.wrap({
                    role: 'presentation',
                    id: Ext.id() + '-anim-wrap-for-' + el.dom.id,
                    style: {
                        visibility: slideOut ? 'visible' : 'hidden'
                    }
                });
                wrapDomParentNode = wrap.dom.parentNode;
                wrap.setPositioning(el.getPositioning(true));
                if (wrap.isStyle('position', 'static')) {
                    wrap.position('relative');
                }
                el.clearPositioning('auto');
                wrap.clip();

                
                if (restoreScroll) {
                    restoreScroll();
                }

                
                
                
                el.setStyle({
                    visibility: '',
                    position: 'absolute'
                });
                if (slideOut) {
                    wrap.setSize(box.width, box.height);
                }

                switch (anchor) {
                    case 't':
                        anim = {
                            from: {
                                width: box.width + 'px',
                                height: '0px'
                            },
                            to: {
                                width: box.width + 'px',
                                height: box.height + 'px'
                            }
                        };
                        elStyle.bottom = '0px';
                        break;
                    case 'l':
                        anim = {
                            from: {
                                width: '0px',
                                height: box.height + 'px'
                            },
                            to: {
                                width: box.width + 'px',
                                height: box.height + 'px'
                            }
                        };
                        me.anchorAnimX(anchor);
                        break;
                    case 'r':
                        anim = {
                            from: {
                                x: box.x + box.width,
                                width: '0px',
                                height: box.height + 'px'
                            },
                            to: {
                                x: box.x,
                                width: box.width + 'px',
                                height: box.height + 'px'
                            }
                        };
                        me.anchorAnimX(anchor);
                        break;
                    case 'b':
                        anim = {
                            from: {
                                y: box.y + box.height,
                                width: box.width + 'px',
                                height: '0px'
                            },
                            to: {
                                y: box.y,
                                width: box.width + 'px',
                                height: box.height + 'px'
                            }
                        };
                        break;
                    case 'tl':
                        anim = {
                            from: {
                                x: box.x,
                                y: box.y,
                                width: '0px',
                                height: '0px'
                            },
                            to: {
                                width: box.width + 'px',
                                height: box.height + 'px'
                            }
                        };
                        elStyle.bottom = '0px';
                        me.anchorAnimX('l');
                        break;
                    case 'bl':
                        anim = {
                            from: {
                                y: box.y + box.height,
                                width: '0px',
                                height: '0px'
                            },
                            to: {
                                y: box.y,
                                width: box.width + 'px',
                                height: box.height + 'px'
                            }
                        };
                        me.anchorAnimX('l');
                        break;
                    case 'br':
                        anim = {
                            from: {
                                x: box.x + box.width,
                                y: box.y + box.height,
                                width: '0px',
                                height: '0px'
                            },
                            to: {
                                x: box.x,
                                y: box.y,
                                width: box.width + 'px',
                                height: box.height + 'px'
                            }
                        };
                        me.anchorAnimX('r');
                        break;
                    case 'tr':
                        anim = {
                            from: {
                                x: box.x + box.width,
                                width: '0px',
                                height: '0px'
                            },
                            to: {
                                x: box.x,
                                width: box.width + 'px',
                                height: box.height + 'px'
                            }
                        };
                        elStyle.bottom = '0px';
                        me.anchorAnimX('r');
                        break;
                }

                wrap.show();
                wrapAnim = Ext.apply({}, obj);
                delete wrapAnim.listeners;
                wrapAnim = new Ext.fx.Anim(Ext.applyIf(wrapAnim, {
                    target: wrap,
                    duration: 500,
                    easing: 'ease-out',
                    from: slideOut ? anim.to : anim.from,
                    to: slideOut ? anim.from : anim.to
                }));

                
                wrapAnim.on('afteranimate', function() {
                    var el = Ext.fly(dom, '_anim');
                    
                    el.setStyle(originalStyles);
                    if (slideOut) {
                        if (obj.useDisplay) {
                            el.setDisplayed(false);
                        } else {
                            el.hide();
                        }
                    }
                    if (wrap.dom) {
                        if (wrap.dom.parentNode) {
                            wrap.dom.parentNode.insertBefore(el.dom, wrap.dom);
                        } else {
                            wrapDomParentNode.appendChild(el.dom);
                        }
                        wrap.destroy();
                    }
                    
                    if (restoreScroll) {
                        restoreScroll();
                    }
                    
                    animScope.end();
                });
                
                if (listeners) {
                    wrapAnim.on(listeners);
                }
            };

            me.animate({
                
                duration: obj.duration ? Math.max(obj.duration, 500) * 2 : 1000,
                listeners: {
                    beforeanimate: beforeAnim 
                }
            });
            return me;
        },

        
        slideOut: function(anchor, o) {
            return this.slideIn(anchor, o, true);
        },

        
        swallowEvent: function(eventName, preventDefault) {
            var me = this,
                e, eLen,
                fn = function(e) {
                    e.stopPropagation();
                    if (preventDefault) {
                        e.preventDefault();
                    }
                };

            if (Ext.isArray(eventName)) {
                eLen = eventName.length;

                for (e = 0; e < eLen; e++) {
                    me.on(eventName[e], fn);
                }

                return me;
            }
            me.on(eventName, fn);
            return me;
        },

        
        switchOff: function(obj) {
            var me = this,
                dom = me.dom,
                beforeAnim;

            obj = Ext.applyIf(obj || {}, {
                easing: 'ease-in',
                duration: 500,
                remove: false,
                useDisplay: false
            });

            beforeAnim = function() {
                var el = Ext.fly(dom, '_anim'),
                    animScope = this,
                    size = el.getSize(),
                    xy = el.getXY(),
                    keyframe, position;
                    
                el.clearOpacity();
                el.clip();
                position = el.getPositioning();

                keyframe = new Ext.fx.Animator({
                    target: dom,
                    duration: obj.duration,
                    easing: obj.easing,
                    keyframes: {
                        33: {
                            opacity: 0.3
                        },
                        66: {
                            height: 1,
                            y: xy[1] + size.height / 2
                        },
                        100: {
                            width: 1,
                            x: xy[0] + size.width / 2
                        }
                    }
                });
                keyframe.on('afteranimate', function() {
                    var el = Ext.fly(dom, '_anim');
                    if (obj.useDisplay) {
                        el.setDisplayed(false);
                    } else {
                        el.hide();
                    }
                    el.clearOpacity();
                    el.setPositioning(position);
                    el.setSize(size);
                    
                    animScope.end();
                });
            };
            
            me.animate({
                
                duration: (Math.max(obj.duration, 500) * 2),
                listeners: {
                    beforeanimate: {
                        fn: beforeAnim
                    }
                },
                callback: obj.callback,
                scope: obj.scope
            });
            return me;
        },

        
        syncContent: function(source) {
            source = Ext.getDom(source);
            var sourceNodes = source.childNodes,
                sourceLen = sourceNodes.length,
                dest = this.dom,
                destNodes = dest.childNodes,
                destLen = destNodes.length,
                i,  destNode, sourceNode,
                nodeType, newAttrs, attLen, attName;

            
            
            
            
            if (Ext.isIE9m && dest.mergeAttributes) {
                dest.mergeAttributes(source, true);

                
                
                dest.src = source.src;
            } else {
                newAttrs = source.attributes;
                attLen = newAttrs.length;
                for (i = 0; i < attLen; i++) {
                    attName = newAttrs[i].name;
                    if (attName !== 'id') {
                        dest.setAttribute(attName, newAttrs[i].value);
                    }
                }
            }

            
            if (sourceLen !== destLen) {
                dest.innerHTML = source.innerHTML;
                return;
            }

            
            
            for (i = 0; i < sourceLen; i++) {
                sourceNode = sourceNodes[i];
                destNode = destNodes[i];
                nodeType = sourceNode.nodeType;

                
                if (nodeType !== destNode.nodeType || (nodeType === 1 && sourceNode.tagName !== destNode.tagName)) {
                    dest.innerHTML = source.innerHTML;
                    return;
                }

                
                if (nodeType === 3) {
                    destNode.data = sourceNode.data;
                }
                
                else {
                    if (sourceNode.id && destNode.id !== sourceNode.id) {
                        destNode.id = sourceNode.id;
                    }
                    destNode.style.cssText = sourceNode.style.cssText;
                    destNode.className = sourceNode.className;
                    Ext.fly(destNode, '_syncContent').syncContent(sourceNode);
                }
            }
        },

        
        toggle: function(animate){
            var me = this;
            me.setVisible(!me.isVisible(), me.anim(animate));
            return me;
        },

        
        unmask: function() {
            var me = this,
                data = me.getData(),
                maskEl = data.maskEl,
                maskMsg = data.maskMsg,
                style;

            if (maskEl) {
                style = maskEl.dom.style;
                
                if (style.clearExpression) {
                    style.clearExpression('width');
                    style.clearExpression('height');
                }

                if (maskEl) {
                    maskEl.destroy();
                    delete data.maskEl;
                }

                if (maskMsg) {
                    maskMsg.destroy();
                    delete data.maskMsg;
                }

                me.removeCls([XMASKED, XMASKEDRELATIVE]);
            }
            
            me.restoreChildrenTabbableState();
            
            if (me.dom !== DOC.body) {
                me.restoreTabbableState();
            }
        },

        
        unclip: function() {
            var me = this,
                data = me.getData(),
                clip;

            if (data[ISCLIPPED]) {
                data[ISCLIPPED] = false;
                clip = data[ORIGINALCLIP];
                if (clip.o) {
                    me.setStyle(OVERFLOW, clip.o);
                }
                if (clip.x) {
                    me.setStyle(OVERFLOWX, clip.x);
                }
                if (clip.y) {
                    me.setStyle(OVERFLOWY, clip.y);
                }
            }
            return me;
        },

        translate: function(x, y, z) {
            if (Ext.supports.CssTransforms && !Ext.isIE9m) {
                this.callParent(arguments);
            } else {
                if (x != null) {
                    this.dom.style.left = x + 'px';
                }
                if (y != null) {
                    this.dom.style.top = y + 'px';
                }
                this.dom.style.position = 'absolute';
            }
        },

        
        unselectable: function() {
            
            
            
            
            
            
            
            var me = this;

            
            
            
            
            
            if (Ext.isOpera) {
                me.dom.unselectable = 'on';
            }

            
            
            
            
            
            
            
            
            
            me.removeCls(Element.selectableCls);
            me.addCls(Element.unselectableCls);

            return me;
        },
        
        privates: {
            
            isTabbable: function() {
                var me = this,
                    dom = me.dom,
                    tag = dom.nodeName,
                    editable = dom.isContentEditable,
                    hasIdx, idx;
            
                
                
                
                
                if (dom.hasAttribute('disabled') && (Ext.isIE8 || !editable)) {
                    return false;
                }
            
                
                if (!me.isVisible(true)) {
                    return false;
                }
            
                hasIdx = dom.hasAttribute('tabindex');
                idx    = hasIdx && dom.getAttribute('tabindex') - 0;
            
                if (tag === 'A') {
                    
                    if (dom.href) {
                        return hasIdx && idx < 0 ? false : true;
                    }
                
                    
                    
                    else {
                        if (editable) {
                            return !hasIdx || (hasIdx && idx >= 0) ? true : false;
                        }
                        else {
                            return hasIdx && idx >= 0 ? true : false;
                        }
                    }
                }
            
                
                
                
                else if (editable || tabbableRe.test(tag) || (Ext.isIE8 && tag === 'OBJECT')) {
                    return hasIdx && idx < 0 ? false : true;
                }

                
                
                else {
                    if (hasIdx && idx >= 0) {
                        return true;
                    }
                }
            
                return false;
            },
            
            
            selectTabbableElements: function(asDom, selector,  limit, backward) {
                var selection, nodes, node, el, i, len, to, step;
            
                asDom = asDom != undefined ? asDom : true;
            
                nodes = this.dom.querySelectorAll(selector || tabbableSelector);
                len   = nodes.length;
            
                if (!len) {
                    return nodes;
                }
            
                if (backward) {
                    i    = len - 1;
                    to   = 0;
                    step = -1;
                }
                else {
                    i    = 0;
                    to   = len - 1;
                    step = 1;
                }
            
                selection = [];
            
                
                
                
                for (;; i += step) {
                    if ((step > 0 && i > to) || (step < 0 && i < to)) {
                        break;
                    }
                
                    node = nodes[i];
                    el   = asDom ? Ext.fly(node) : Ext.get(node);
                
                    if (el.isTabbable()) {
                        selection.push(asDom ? node : el);
                    }
                
                    if (selection.length >= limit) {
                        return selection;
                    }
                }
            
                return selection;
            },
        
            
            selectFirstTabbableElement: function(asDom, selector) {
                var els = this.selectTabbableElements(asDom, selector, 1, false);
            
                return els[0];
            },
        
            
            selectLastTabbableElement: function(asDom, selector) {
                var els = this.selectTabbableElements(asDom, selector, 1, true);
            
                return els[0];
            },
        
            
            saveTabbableState: function(attribute) {
                var dom = this.dom;
            
                
                if (dom.hasAttribute(tabbableSavedFlagAttribute)) {
                    return;
                }
                
                attribute = attribute || tabbableSavedAttribute;
            
                
                
                if (dom.hasAttribute('tabindex')) {
                    dom.setAttribute(attribute, dom.getAttribute('tabindex'));
                }
            
                
                else {
                    dom.setAttribute(attribute, 'none');
                }
            
                
                
                dom.setAttribute('tabindex', -1);
                dom.setAttribute(tabbableSavedFlagAttribute, true);
            
                return this;
            },
        
            
            restoreTabbableState: function(attribute) {
                var dom = this.dom,
                    idx;
                
                attribute = attribute || tabbableSavedAttribute;
            
                if (!dom.hasAttribute(tabbableSavedFlagAttribute) ||
                    !dom.hasAttribute(attribute)) {
                    return;
                }
            
                idx = dom.getAttribute(attribute);
            
                
                if (idx === 'none') {
                    dom.removeAttribute('tabindex');
                }
                else {
                    dom.setAttribute('tabindex', idx);
                }
            
                dom.removeAttribute(attribute);
                dom.removeAttribute(tabbableSavedFlagAttribute);
            
                return this;
            },
        
            
            saveChildrenTabbableState: function(attribute) {
                var children, child, i, len;
                if (this.dom) {
                    children = this.selectTabbableElements();

                    for (i = 0, len = children.length; i < len; i++) {
                        child = Ext.fly(children[i]);
                        child.saveTabbableState(attribute);
                    }
                }
                return this;
            },
        
            
            restoreChildrenTabbableState: function(attribute) {
                var children, child, i, len;
                
                attribute = attribute || tabbableSavedAttribute;
            
                children = this.dom.querySelectorAll('[' + attribute + ']');
            
                for (i = 0, len = children.length; i < len; i++) {
                    child = Ext.fly(children[i]);
                    child.restoreTabbableState(attribute);
                }
            
                return this;
            }
        },

        deprecated: {
            '4.0': {
                methods: {
                    
                    pause: function(ms) {
                        var me = this;
                        Ext.fx.Manager.setFxDefaults(me.id, {
                            delay: ms
                        });
                        return me;
                    },

                    
                    scale: function(w, h, o) {
                        this.animate(Ext.apply({}, o, {
                            width: w,
                            height: h
                        }));
                        return this;
                    },

                    
                    shift: function(config) {
                        this.animate(config);
                        return this;
                    }
                }
            },
            '4.2': {
                methods: {
                    
                    moveTo: function(x, y, animate) {
                        return this.setXY([x, y], animate);
                    },

                    
                    setBounds: function(x, y, width, height, animate) {
                        return this.setBox({
                            x: x,
                            y: y,
                            width: width,
                            height: height
                        }, animate);
                    },

                    
                    setLeftTop: function(left, top) {
                        var me = this,
                            style = me.dom.style;

                        style.left = Element.addUnits(left);
                        style.top = Element.addUnits(top);

                        return me;
                    },

                    
                    setLocation: function(x, y, animate) {
                        return this.setXY([x, y], animate);
                    }
                }
            },
            '5.0': {
                methods: {
                    
                    getAttributeNS: function(namespace, name) {
                        return this.getAttribute(name, namespace);
                    },

                    
                    getCenterXY: function(){
                        return this.getAlignToXY(DOC, 'c-c');
                    },

                    
                    getComputedHeight: function() {
                        return Math.max(this.dom.offsetHeight, this.dom.clientHeight) ||
                            parseFloat(this.getStyle(HEIGHT)) || 0;
                    },

                    
                    getComputedWidth: function() {
                        return Math.max(this.dom.offsetWidth, this.dom.clientWidth) ||
                            parseFloat(this.getStyle(WIDTH)) || 0;
                    },

                    
                    getStyleSize: function() {
                        var me = this,
                            d = this.dom,
                            isDoc = (d === DOC || d === DOC.body),
                            s,
                            w, h;

                        
                        if (isDoc) {
                            return {
                                width : Element.getViewportWidth(),
                                height : Element.getViewportHeight()
                            };
                        }

                        s = me.getStyle(['height', 'width'], true);  
                        
                        if (s.width && s.width !== 'auto') {
                            w = parseFloat(s.width);
                        }
                        
                        if (s.height && s.height !== 'auto') {
                            h = parseFloat(s.height);
                        }
                        
                        return {width: w || me.getWidth(true), height: h || me.getHeight(true)};
                    },


                    
                    isBorderBox: function() {
                        return true;
                    },

                    
                    isDisplayed: function() {
                        return !this.isStyle('display', 'none');
                    },

                    
                    focusable: 'isFocusable'
                }
            }
        }
    };
})(), function() {
    var Element = Ext.dom.Element,
        proto = Element.prototype,
        useDocForId = !Ext.isIE8,
        DOC = document,
        view = DOC.defaultView,
        opacityRe = /alpha\(opacity=(.*)\)/i,
        trimRe = /^\s+|\s+$/g,
        styleHooks = proto.styleHooks,
        supports = Ext.supports,
        touchScroll = 0,
        removeNode, garbageBin, verticalStyleHooks90, verticalStyleHooks270, edges, k,
        edge, borderWidth;

    proto._init(Element);
    delete proto._init;

    
    if (Ext.os.is.iOS || Ext.os.is.Android) {
        touchScroll = 2
    } else if (navigator.msMaxTouchPoints ||
            (Ext.isWebKit && supports.TouchEvents && Ext.os.is.Desktop)) {
        touchScroll = 1;
    }
    
    Ext.apply(supports, {
        
        touchScroll: touchScroll
    });

    Ext.plainTableCls = Ext.baseCSSPrefix + 'table-plain';
    Ext.plainListCls = Ext.baseCSSPrefix + 'list-plain';

    
    if (Ext.CompositeElementLite) {
        Ext.CompositeElementLite.importElementMethods();
    }


    styleHooks.opacity = {
        name: 'opacity',
        afterSet: function(dom, value, el) {
            if (el.isLayer) {
                el.onOpacitySet(value);
            }
        }
    };
    if (!supports.Opacity && Ext.isIE) {
        Ext.apply(styleHooks.opacity, {
            get: function (dom) {
                var filter = dom.style.filter,
                    match, opacity;
                if (filter.match) {
                    match = filter.match(opacityRe);
                    if (match) {
                        opacity = parseFloat(match[1]);
                        if (!isNaN(opacity)) {
                            return opacity ? opacity / 100 : 0;
                        }
                    }
                }
                return 1;
            },
            set: function (dom, value) {
                var style = dom.style,
                    val = style.filter.replace(opacityRe, '').replace(trimRe, '');

                style.zoom = 1; 

                
                if (typeof(value) === 'number' && value >= 0 && value < 1) {
                    value *= 100;
                    style.filter = val + (val.length ? ' ' : '') + 'alpha(opacity='+value+')';
                } else {
                    style.filter = val;
                }
            }  
        });
    }
    
    if (!supports.matchesSelector) {
        
        var simpleSelectorRe = /^([a-z]+|\*)?(?:\.([a-z][a-z\-_0-9]*))?$/i,
            dashRe = /\-/g,
            fragment,
            classMatcher = function (tag, cls) {
                var classRe = new RegExp('(?:^|\\s+)' +cls.replace(dashRe, '\\-') + '(?:\\s+|$)');
                if (tag && tag !== '*') {
                    tag = tag.toUpperCase();
                    return function (el) {
                        return el.tagName === tag && classRe.test(el.className);
                    };
                }
                return function (el) {
                    return classRe.test(el.className);
                };
            },
            tagMatcher = function (tag) {
                tag = tag.toUpperCase();
                return function (el) {
                    return el.tagName === tag;
                };
            },
            cache = {};

        proto.matcherCache = cache;
        proto.is = function(selector) {
            
            if (!selector) {
                return true;
            }

            var dom = this.dom,
                cls, match, testFn, root, isOrphan, is, tag;

            
            if (dom.nodeType !== 1) {
                return false;
            }

            if (!(testFn = Ext.isFunction(selector) ? selector : cache[selector])) {
                if (!(match = selector.match(simpleSelectorRe))) {
                    
                    root = dom.parentNode;

                    if (!root) {
                        isOrphan = true;
                        root = fragment || (fragment = DOC.createDocumentFragment());
                        fragment.appendChild(dom);
                    }

                    is = Ext.Array.indexOf(Ext.fly(root, '_is').query(selector), dom) !== -1;

                    if (isOrphan) {
                        fragment.removeChild(dom);
                    }
                    return is;
                }

                tag = match[1];
                cls = match[2];
                cache[selector] = testFn = cls ? classMatcher(tag, cls) : tagMatcher(tag);
            }

            return testFn(dom);
        };
    }

    
    if (!view || !view.getComputedStyle) {
        proto.getStyle = function (property, inline) {
            var me = this,
                dom = me.dom,
                multiple = typeof property !== 'string',
                prop = property,
                props = prop,
                len = 1,
                isInline = inline,
                styleHooks = me.styleHooks,
                camel, domStyle, values, hook, out, style, i;

            if (multiple) {
                values = {};
                prop = props[0];
                i = 0;
                if (!(len = props.length)) {
                    return values;
                }
            }

            if (!dom || dom.documentElement) {
                return values || '';
            }

            domStyle = dom.style;

            if (inline) {
                style = domStyle;
            } else {
                style = dom.currentStyle;

                
                if (!style) {
                    isInline = true;
                    style = domStyle;
                }
            }

            do {
                hook = styleHooks[prop];

                if (!hook) {
                    styleHooks[prop] = hook = { name: Element.normalize(prop) };
                }

                if (hook.get) {
                    out = hook.get(dom, me, isInline, style);
                } else {
                    camel = hook.name;
                    out = style[camel];
                }

                if (!multiple) {
                    return out;
                }

                values[prop] = out;
                prop = props[++i];
            } while (i < len);

            return values;
        };
    }

    
    if (Ext.isIE8) {
        function getBorderWidth (dom, el, inline, style) {
            if (style[this.styleName] === 'none') {
                return '0px';
            }
            return style[this.name];
        }

        edges = ['Top','Right','Bottom','Left'];
        k = edges.length;

        while (k--) {
            edge = edges[k];
            borderWidth = 'border' + edge + 'Width';

            styleHooks['border-'+edge.toLowerCase()+'-width'] = styleHooks[borderWidth] = {
                name: borderWidth,
                styleName: 'border' + edge + 'Style',
                get: getBorderWidth
            };
        }
    }

    Ext.apply(Ext, {
        
        enableGarbageCollector: true,

        
        
        isBorderBox: true,

        
        getDetachedBody: function () {
            var detachedEl = Ext.detachedBodyEl;

            if (!detachedEl) {
                detachedEl = DOC.createElement('div');
                Ext.detachedBodyEl = detachedEl = new Ext.dom.Fly(detachedEl);
                detachedEl.isDetachedBody = true;
            }

            return detachedEl;
        },

        getElementById: function (id) {
            var el = DOC.getElementById(id),
                detachedBodyEl;

            if (!el && (detachedBodyEl = Ext.detachedBodyEl)) {
                el = detachedBodyEl.dom.querySelector(Ext.makeIdSelector(id));
            }

            return el;
        },

        
        addBehaviors: function(o){
            if(!Ext.isReady){
                Ext.onReady(function(){
                    Ext.addBehaviors(o);
                });
            } else {
                var cache = {}, 
                    parts,
                    b,
                    s;
                for (b in o) {
                    if ((parts = b.split('@'))[1]) { 
                        s = parts[0];
                        if(!cache[s]){
                            cache[s] = Ext.fly(document).select(s, true);
                        }
                        cache[s].on(parts[1], o[b]);
                    }
                }
                cache = null;
            }
        }
    });

    if (Ext.isIE8) {
        
        removeNode = Ext.removeNode;
        Ext.removeNode = function(node) {
            removeNode(node);
            
            
            garbageBin = garbageBin || DOC.createElement('div');
            garbageBin.appendChild(node);
            garbageBin.innerHTML = '';
        };
    }

    if (Ext.isIE9m) {
        Ext.getElementById = function (id) {
            var el = DOC.getElementById(id),
                detachedBodyEl;

            if (!el && (detachedBodyEl = Ext.detachedBodyEl)) {
                el = detachedBodyEl.dom.all[id];
            }

            return el;
        };

        proto.getById = function (id, asDom) {
            var dom = this.dom,
                ret = null,
                entry, el;

            if (dom) {
                
                
                el = (useDocForId && DOC.getElementById(id)) || dom.all[id];
                if (el) {
                    if (asDom) {
                        ret = el;
                    } else {
                        
                        
                        entry = Ext.cache[id];
                        if (entry) {
                            if (entry.skipGarbageCollection || !Ext.isGarbage(entry.dom)) {
                                ret = entry;
                            } else {
                                Ext.Error.raise("Stale Element with id '" + el.id +
                                    "' found in Element cache. " +
                                    "Make sure to clean up Element instances using destroy()" );
                                entry.destroy();
                            }
                        }
                        ret = ret || new Ext.Element(el)
                    }
                }
            }

            return ret;
        };
    } else if (!DOC.querySelector) {
        Ext.getDetachedBody = Ext.getBody;

        Ext.getElementById = function (id) {
            return DOC.getElementById(id);
        };

        proto.getById = function (id, asDom) {
            var dom = DOC.getElementById(id);
            return asDom ? dom : (dom ? Ext.get(dom) : null);
        };
    }

    if (Ext.isIE && !(Ext.isIE9p && DOC.documentMode >= 9)) {
        
        
        
        
        
        
        
        
        
        proto.getAttribute = function(name, ns) {
            var d = this.dom,
                    type;
            if (ns) {
                type = typeof d[ns + ":" + name];
                if (type != 'undefined' && type != 'unknown') {
                    return d[ns + ":" + name] || null;
                }
                return null;
            }
            if (name === "for") {
                name = "htmlFor";
            }
            return d[name] || null;
        };
    }

    Ext.onReady(function () {
        var transparentRe = /^(?:transparent|(?:rgba[(](?:\s*\d+\s*[,]){3}\s*0\s*[)]))$/i,
            bodyCls = [],
            
            origSetWidth = proto.setWidth,
            origSetHeight = proto.setHeight,
            origSetSize = proto.setSize,
            pxRe = /^\d+(?:\.\d*)?px$/i,
            colorStyles, i, name, camel;

        if (supports.FixedTableWidthBug) {
            
            
            
            
            
            
            
            
            
            styleHooks.width = {
                name: 'width',
                set: function(dom, value, el) {
                    var style = dom.style,
                        needsFix = el._needsTableWidthFix,
                        origDisplay = style.display;

                    if (needsFix) {
                        style.display = 'none';
                    }

                    style.width = value;

                    if (needsFix) {
                        dom.scrollWidth; 
                        style.display = origDisplay;
                    }
                }
            };
            proto.setWidth = function(width, animate) {
                var me = this,
                    dom = me.dom,
                    style = dom.style,
                    needsFix = me._needsTableWidthFix,
                    origDisplay = style.display;

                if (needsFix && !animate) {
                    style.display = 'none';
                }

                origSetWidth.call(me, width, animate);

                if (needsFix && !animate) {
                    dom.scrollWidth; 
                    style.display = origDisplay;
                }
                return me;
            };
            proto.setSize = function(width, height, animate) {
                var me = this,
                    dom = me.dom,
                    style = dom.style,
                    needsFix = me._needsTableWidthFix,
                    origDisplay = style.display;

                if (needsFix && !animate) {
                    style.display = 'none';
                }

                origSetSize.call(me, width, height, animate);

                if (needsFix && !animate) {
                    dom.scrollWidth; 
                    style.display = origDisplay;
                }
                return me;
            };
        }

        if (Ext.isIE8) {
            styleHooks.height = {
                name: 'height',
                set: function(dom, value, el) {
                    var component = el.component,
                        frameInfo, frameBodyStyle;

                    if (component && component._syncFrameHeight && this === component.el) {
                        frameBodyStyle = component.frameBody.dom.style;
                        if (pxRe.test(value)) {
                            frameInfo = component.getFrameInfo();
                            if (frameInfo) {
                                frameBodyStyle.height = (parseInt(value, 10) - frameInfo.height) + 'px';
                            }
                        } else if (!value || value === 'auto') {
                            frameBodyStyle.height = '';
                        }
                    }

                    dom.style.height = value;
                }
            };

            proto.setHeight = function(height, animate) {
                var component = this.component,
                    frameInfo, frameBodyStyle;

                if (component && component._syncFrameHeight && this === component.el) {
                    frameBodyStyle = component.frameBody.dom.style;
                    if (!height || height === 'auto') {
                        frameBodyStyle.height = '';
                    } else {
                        frameInfo = component.getFrameInfo();
                        if (frameInfo) {
                            frameBodyStyle.height = (height - frameInfo.height) + 'px';
                        }
                    }
                }

                return origSetHeight.call(this, height, animate);
            };

            proto.setSize = function(width, height, animate) {
                var component = this.component,
                    frameInfo, frameBodyStyle;

                if (component && component._syncFrameHeight && this === component.el) {
                    frameBodyStyle = component.frameBody.dom.style;
                    if (!height || height === 'auto') {
                        frameBodyStyle.height = '';
                    } else {
                        frameInfo = component.getFrameInfo();
                        if (frameInfo) {
                            frameBodyStyle.height = (height - frameInfo.height) + 'px';
                        }
                    }
                }

                return origSetSize.call(this, width, height, animate);
            };
        }

        
        
        
        Ext.getDoc().on('selectstart', function(ev, dom) {
            var selectableCls = Element.selectableCls,
                unselectableCls = Element.unselectableCls,
                tagName = dom && dom.tagName;

            tagName = tagName && tagName.toLowerCase();

            
            
            
            if (tagName === 'input' || tagName === 'textarea') {
                return;
            }

            
            while (dom && dom.nodeType === 1 && dom !== DOC.documentElement) {
                var el = Ext.fly(dom);

                
                if (el.hasCls(selectableCls)) {
                    return;
                }

                
                if (el.hasCls(unselectableCls)) {
                    ev.stopEvent();
                    return;
                }

                dom = dom.parentNode;
            }
        });

        function fixTransparent (dom, el, inline, style) {
            var value = style[this.name] || '';
            return transparentRe.test(value) ? 'transparent' : value;
        }

        
        function makeSelectionRestoreFn (activeEl, start, end) {
            return function () {
                activeEl.selectionStart = start;
                activeEl.selectionEnd = end;
            };
        }

        
        function getRightMarginFixCleaner(target) {
            var hasInputBug = supports.DisplayChangeInputSelectionBug,
                hasTextAreaBug = supports.DisplayChangeTextAreaSelectionBug,
                activeEl, tag, start, end; 

            if (hasInputBug || hasTextAreaBug) {
                activeEl = Element.getActiveElement();
                tag = activeEl && activeEl.tagName;

                if ((hasTextAreaBug && tag === 'TEXTAREA') ||
                    (hasInputBug && tag === 'INPUT' && activeEl.type === 'text')) {
                    if (Ext.fly(target).isAncestor(activeEl)) {
                        start = activeEl.selectionStart;
                        end = activeEl.selectionEnd;

                        if (Ext.isNumber(start) && Ext.isNumber(end)) { 
                            
                            
                            
                            
                            return makeSelectionRestoreFn(activeEl, start, end);
                        }
                    }
                }
            }

            return Ext.emptyFn; 
        }

        function fixRightMargin (dom, el, inline, style) {
            var result = style.marginRight,
                domStyle, display;

            
            
            if (result !== '0px') {
                domStyle = dom.style;
                display = domStyle.display;
                domStyle.display = 'inline-block';
                result = (inline ? style : dom.ownerDocument.defaultView.getComputedStyle(dom, null)).marginRight;
                domStyle.display = display;
            }

            return result;
        }

        function fixRightMarginAndInputFocus (dom, el, inline, style) {
            var result = style.marginRight,
                domStyle, cleaner, display;

            if (result !== '0px') {
                domStyle = dom.style;
                cleaner = getRightMarginFixCleaner(dom);
                display = domStyle.display;
                domStyle.display = 'inline-block';
                result = (inline ? style : dom.ownerDocument.defaultView.getComputedStyle(dom, '')).marginRight;
                domStyle.display = display;
                cleaner();
            }

            return result;
        }

        
        if (!supports.RightMargin) {
            styleHooks.marginRight = styleHooks['margin-right'] = {
                name: 'marginRight',
                
                
                get: (supports.DisplayChangeInputSelectionBug || supports.DisplayChangeTextAreaSelectionBug) ?
                    fixRightMarginAndInputFocus : fixRightMargin
            };
        }

        if (!supports.TransparentColor) {
            colorStyles = ['background-color', 'border-color', 'color', 'outline-color'];
            for (i = colorStyles.length; i--; ) {
                name = colorStyles[i];
                camel = Element.normalize(name);

                styleHooks[name] = styleHooks[camel] = {
                    name: camel,
                    get: fixTransparent
                };
            }
        }

        
        
        proto.verticalStyleHooks90 = verticalStyleHooks90 = Ext.Object.chain(styleHooks);
        proto.verticalStyleHooks270 = verticalStyleHooks270 = Ext.Object.chain(styleHooks);

        verticalStyleHooks90.width = styleHooks.height || { name: 'height' };
        verticalStyleHooks90.height = styleHooks.width || { name: 'width' };
        verticalStyleHooks90['margin-top'] = { name: 'marginLeft' };
        verticalStyleHooks90['margin-right'] = { name: 'marginTop' };
        verticalStyleHooks90['margin-bottom'] = { name: 'marginRight' };
        verticalStyleHooks90['margin-left'] = { name: 'marginBottom' };
        verticalStyleHooks90['padding-top'] = { name: 'paddingLeft' };
        verticalStyleHooks90['padding-right'] = { name: 'paddingTop' };
        verticalStyleHooks90['padding-bottom'] = { name: 'paddingRight' };
        verticalStyleHooks90['padding-left'] = { name: 'paddingBottom' };
        verticalStyleHooks90['border-top'] = { name: 'borderLeft' };
        verticalStyleHooks90['border-right'] = { name: 'borderTop' };
        verticalStyleHooks90['border-bottom'] = { name: 'borderRight' };
        verticalStyleHooks90['border-left'] = { name: 'borderBottom' };

        verticalStyleHooks270.width = styleHooks.height || { name: 'height' };
        verticalStyleHooks270.height = styleHooks.width || { name: 'width' };
        verticalStyleHooks270['margin-top'] = { name: 'marginRight' };
        verticalStyleHooks270['margin-right'] = { name: 'marginBottom' };
        verticalStyleHooks270['margin-bottom'] = { name: 'marginLeft' };
        verticalStyleHooks270['margin-left'] = { name: 'marginTop' };
        verticalStyleHooks270['padding-top'] = { name: 'paddingRight' };
        verticalStyleHooks270['padding-right'] = { name: 'paddingBottom' };
        verticalStyleHooks270['padding-bottom'] = { name: 'paddingLeft' };
        verticalStyleHooks270['padding-left'] = { name: 'paddingTop' };
        verticalStyleHooks270['border-top'] = { name: 'borderRight' };
        verticalStyleHooks270['border-right'] = { name: 'borderBottom' };
        verticalStyleHooks270['border-bottom'] = { name: 'borderLeft' };
        verticalStyleHooks270['border-left'] = { name: 'borderTop' };

        
        if (!Ext.scopeCss) {
            bodyCls.push(Ext.baseCSSPrefix + 'body');
        }

        if (supports.Touch) {
            bodyCls.push(Ext.baseCSSPrefix + 'touch');
        }

        if (Ext.isIE && Ext.isIE9m) {
            bodyCls.push(Ext.baseCSSPrefix + 'ie',
                         Ext.baseCSSPrefix + 'ie9m');

            
            
            
            
            
            
            
            
            
            
            
            bodyCls.push(Ext.baseCSSPrefix + 'ie8p');

            if (Ext.isIE8) {
                bodyCls.push(Ext.baseCSSPrefix + 'ie8');
            } else {
                bodyCls.push(Ext.baseCSSPrefix + 'ie9',
                             Ext.baseCSSPrefix + 'ie9p');
            }

            if (Ext.isIE8m) {
                bodyCls.push(Ext.baseCSSPrefix + 'ie8m');
            }
        }

        if (Ext.isIE10) {
            bodyCls.push(Ext.baseCSSPrefix + 'ie10');
        }
        
        if (Ext.isIE11) {
            bodyCls.push(Ext.baseCSSPrefix + 'ie11');
        }

        if (Ext.isGecko) {
            bodyCls.push(Ext.baseCSSPrefix + 'gecko');
        }
        if (Ext.isOpera) {
            bodyCls.push(Ext.baseCSSPrefix + 'opera');
        }
        if (Ext.isOpera12m) {
            bodyCls.push(Ext.baseCSSPrefix + 'opera12m');
        }
        if (Ext.isWebKit) {
            bodyCls.push(Ext.baseCSSPrefix + 'webkit');
        }
        if (Ext.isSafari) {
            bodyCls.push(Ext.baseCSSPrefix + 'safari');
        }
        if (Ext.isChrome) {
            bodyCls.push(Ext.baseCSSPrefix + 'chrome');
        }
        if (Ext.isMac) {
            bodyCls.push(Ext.baseCSSPrefix + 'mac');
        }
        if (Ext.isLinux) {
            bodyCls.push(Ext.baseCSSPrefix + 'linux');
        }
        if (!supports.CSS3BorderRadius) {
            bodyCls.push(Ext.baseCSSPrefix + 'nbr');
        }
        if (!supports.CSS3LinearGradient) {
            bodyCls.push(Ext.baseCSSPrefix + 'nlg');
        }
        if (supports.Touch) {
            bodyCls.push(Ext.baseCSSPrefix + 'touch');
        }
        

        Ext.getBody().addCls(bodyCls);
    }, null, { priority: 1500 }); 
});




Ext.define('Ext.overrides.GlobalEvents', {
    override: 'Ext.GlobalEvents',

    

    

    attachListeners: function() {
        this.callParent();
        Ext.getDoc().on('mousedown', this.fireMouseDown, this);
    },

    fireMouseDown: function(e) {
        this.fireEvent('mousedown', e);
    },

    deprecated: {
        5: {
            methods: {
                addListener: function(ename, fn, scope, options) {
                    var name,
                        readyFn;

                    
                    

                    if (ename === 'ready') {
                        readyFn = fn;
                    } else if (typeof ename !== 'string') {
                        for (name in ename) {
                            if (name === 'ready') {
                                readyFn = ename[name];
                            }
                        }
                    }

                    if (readyFn) {
                        Ext.log.warn("Ext.on('ready', fn) is deprecated.  Please use Ext.onReady(fn) instead.");
                        Ext.onReady(readyFn);
                    }

                    this.callParent([ename, fn, scope, options]);
                }
            }
        }
    }
});

Ext.define('Ext.overrides.event.Event', {
    override: 'Ext.event.Event',

    
    mousedownEvents: {
        mousedown: 1,
        pointerdown: 1,
        touchstart: 1
    },

    
    injectEvent: (function () {
        var API,
            dispatchers = {}, 
            crazyIEButtons;

        

        
        

        if (!Ext.isIE9m && document.createEvent) { 
            API = {
                createHtmlEvent: function (doc, type, bubbles, cancelable) {
                    var event = doc.createEvent('HTMLEvents');

                    event.initEvent(type, bubbles, cancelable);
                    return event;
                },

                createMouseEvent: function (doc, type, bubbles, cancelable, detail,
                                            clientX, clientY, ctrlKey, altKey, shiftKey, metaKey,
                                            button, relatedTarget) {
                    var event = doc.createEvent('MouseEvents'),
                        view = doc.defaultView || window;

                    if (event.initMouseEvent) {
                        event.initMouseEvent(type, bubbles, cancelable, view, detail,
                                    clientX, clientY, clientX, clientY, ctrlKey, altKey,
                                    shiftKey, metaKey, button, relatedTarget);
                    } else { 
                        event = doc.createEvent('UIEvents');
                        event.initEvent(type, bubbles, cancelable);
                        event.view = view;
                        event.detail = detail;
                        event.screenX = clientX;
                        event.screenY = clientY;
                        event.clientX = clientX;
                        event.clientY = clientY;
                        event.ctrlKey = ctrlKey;
                        event.altKey = altKey;
                        event.metaKey = metaKey;
                        event.shiftKey = shiftKey;
                        event.button = button;
                        event.relatedTarget = relatedTarget;
                    }

                    return event;
                },

                createUIEvent: function (doc, type, bubbles, cancelable, detail) {
                    var event = doc.createEvent('UIEvents'),
                        view = doc.defaultView || window;

                    event.initUIEvent(type, bubbles, cancelable, view, detail);
                    return event;
                },

                fireEvent: function (target, type, event) {
                    target.dispatchEvent(event);
                }
            };
        } else if (document.createEventObject) { 
            crazyIEButtons = { 0: 1, 1: 4, 2: 2 };

            API = {
                createHtmlEvent: function (doc, type, bubbles, cancelable) {
                    var event = doc.createEventObject();
                    event.bubbles = bubbles;
                    event.cancelable = cancelable;
                    return event;
                },

                createMouseEvent: function (doc, type, bubbles, cancelable, detail,
                                            clientX, clientY, ctrlKey, altKey, shiftKey, metaKey,
                                            button, relatedTarget) {
                    var event = doc.createEventObject();
                    event.bubbles = bubbles;
                    event.cancelable = cancelable;
                    event.detail = detail;
                    event.screenX = clientX;
                    event.screenY = clientY;
                    event.clientX = clientX;
                    event.clientY = clientY;
                    event.ctrlKey = ctrlKey;
                    event.altKey = altKey;
                    event.shiftKey = shiftKey;
                    event.metaKey = metaKey;
                    event.button = crazyIEButtons[button] || button;
                    event.relatedTarget = relatedTarget; 
                    return event;
                },

                createUIEvent: function (doc, type, bubbles, cancelable, detail) {
                    var event = doc.createEventObject();
                    event.bubbles = bubbles;
                    event.cancelable = cancelable;
                    return event;
                },

                fireEvent: function (target, type, event) {
                    target.fireEvent('on' + type, event);
                }
            };
        }

        
        

        Ext.Object.each({
                load:   [false, false],
                unload: [false, false],
                select: [true, false],
                change: [true, false],
                submit: [true, true],
                reset:  [true, false],
                resize: [true, false],
                scroll: [true, false]
            },
            function (name, value) {
                var bubbles = value[0], cancelable = value[1];
                dispatchers[name] = function (targetEl, srcEvent) {
                    var e = API.createHtmlEvent(name, bubbles, cancelable);
                    API.fireEvent(targetEl, name, e);
                };
            });

        
        

        function createMouseEventDispatcher (type, detail) {
            var cancelable = (type != 'mousemove');
            return function (targetEl, srcEvent) {
                var xy = srcEvent.getXY(),
                    e = API.createMouseEvent(targetEl.ownerDocument, type, true, cancelable,
                                detail, xy[0], xy[1], srcEvent.ctrlKey, srcEvent.altKey,
                                srcEvent.shiftKey, srcEvent.metaKey, srcEvent.button,
                                srcEvent.relatedTarget);
                API.fireEvent(targetEl, type, e);
            };
        }

        Ext.each(['click', 'dblclick', 'mousedown', 'mouseup', 'mouseover', 'mousemove', 'mouseout'],
            function (eventName) {
                dispatchers[eventName] = createMouseEventDispatcher(eventName, 1);
            });

        
        

        Ext.Object.each({
                focusin:  [true, false],
                focusout: [true, false],
                activate: [true, true],
                focus:    [false, false],
                blur:     [false, false]
            },
            function (name, value) {
                var bubbles = value[0], cancelable = value[1];
                dispatchers[name] = function (targetEl, srcEvent) {
                    var e = API.createUIEvent(targetEl.ownerDocument, name, bubbles, cancelable, 1);
                    API.fireEvent(targetEl, name, e);
                };
            });

        
        if (!API) {
            

            dispatchers = {}; 

            API = {};
        }

        function cannotInject (target, srcEvent) {
            
        }

        return function (target) {
            var me = this,
                dispatcher = dispatchers[me.type] || cannotInject,
                t = target ? (target.dom || target) : me.getTarget();

            dispatcher(t, me);
        };
    }()), 

    preventDefault: function() {
        var me = this,
            event = me.browserEvent;


        
        
        
        if (typeof event.type !== 'unknown') {
            if (event.preventDefault) {
                event.preventDefault();
            } else {
                
                event.returnValue = false;
                
                
                if (event.ctrlKey || event.keyCode > 111 && event.keyCode < 124) {
                    event.keyCode = -1;
                }
            }
        }

        return me;
    },

    stopPropagation: function() {
        var me = this,
            event = me.browserEvent;

        
        
        
        if (typeof event.type !== 'unknown') {
            if (me.mousedownEvents[me.type]) {
                
                
                Ext.GlobalEvents.fireMouseDown(me);
            }
            me.callParent();
        }
        return me;
    },

    deprecated: {
        '5.0': {
            methods: {
                
                clone: function() {
                    return new this.self(this.browserEvent, this);
                }
            }
        }
    }
}, function() {
    var Event = this,
        btnMap,
        onKeyDown = function(e) {
            if (e.keyCode === 9) {
                Event.forwardTab = !e.shiftKey;
            }
        },
        onKeyUp = function(e) {
            if (e.keyCode === 9) {
                delete Event.forwardTab;
            }
        };

    if (Ext.isIE9m) {
        btnMap = {
            1: 0,
            4: 1,
            2: 2
        };

        Event.override({
            statics: {
                
                enableIEAsync: function(browserEvent) {
                    var name,
                        fakeEvent = {};

                    for (name in browserEvent) {
                        fakeEvent[name] = browserEvent[name];
                    }

                    return fakeEvent;
                }
            },

            constructor: function(event, info, touchesMap, identifiers) {
                var me = this;
                me.callParent([event, info, touchesMap, identifiers]);
                me.button = btnMap[event.button];

                
                
                
                me.toElement = event.toElement;
                me.fromElement = event.fromElement;
            },

            mouseLeaveRe: /(mouseout|mouseleave)/,
            mouseEnterRe: /(mouseover|mouseenter)/,

            
            enableIEAsync: function(browserEvent) {
                this.browserEvent = this.self.enableIEAsync(browserEvent);
            },

            getRelatedTarget: function(selector, maxDepth, returnEl) {
                var me = this,
                    type, target;

                if (!me.relatedTarget) {
                    type = me.type;
                    if (me.mouseLeaveRe.test(type)) {
                        target = me.toElement;
                    } else if (me.mouseEnterRe.test(type)) {
                        target = me.fromElement;
                    }
                    if (target) {
                        me.relatedTarget = me.self.resolveTextNode(target);
                    }
                }

                return me.callParent([selector, maxDepth, returnEl]);
            }
        });

        
        
        
        document.attachEvent('onkeydown', onKeyDown);
        document.attachEvent('onkeyup',   onKeyUp);
        
        window.attachEvent('onunload', function() {
            document.detachEvent('onkeydown', onKeyDown);
            document.detachEvent('onkeyup',   onKeyUp);
        });
    }
    else
    if (document.addEventListener) {
        document.addEventListener('keydown', onKeyDown, true);
        document.addEventListener('keyup',   onKeyUp,   true);
    }
});

Ext.define('Ext.overrides.event.publisher.Dom', {
    override: 'Ext.event.publisher.Dom'

}, function() {
    var DomPublisher = Ext.event.publisher.Dom,
        prototype = DomPublisher.prototype;

    if (Ext.isIE9m) {
        DomPublisher.override({
            initHandlers: function() {
                var me = this,
                    docBody = document.body,
                    superOnDelegatedEvent, superOnDirectEvent;

                me.callParent();

                superOnDelegatedEvent = me.onDelegatedEvent;
                superOnDirectEvent = me.onDirectEvent;

                me.target = document;
                me.targetIsWin = false;

                me.onDelegatedEvent = function(e) {
                    e.target = e.srcElement || window;
                    
                    if (e.type === 'focusin') {
                        e.relatedTarget = e.fromElement === docBody ? null : e.fromElement;
                    }
                    else if (e.type === 'focusout') {
                        e.relatedTarget = e.toElement === docBody ? null : e.toElement;
                    }
                    
                    superOnDelegatedEvent.call(me, e);
                };

                
                
                me.onDirectEvent = function(e) {
                    e.target = e.srcElement || window;
                    e.currentTarget = this; 
                    superOnDirectEvent.call(me, e);
                };
            },

            addDelegatedListener: function(eventName) {
                
                
                this.target.attachEvent('on' + eventName, this.onDelegatedEvent);
            },

            removeDelegatedListener: function(eventName) {
                this.target.detachEvent('on' + eventName, this.onDelegatedEvent);
            },

            addDirectListener: function(eventName, element) {
                var me = this,
                    
                    
                    boundFn = Ext.Function.bind(me.onDirectEvent, element);

                me.directSubscribers[element.id][eventName].fn = boundFn;
                
                
                if(element.attachEvent) {
                    element.attachEvent('on' + eventName, boundFn);
                } else {
                    me.callParent(arguments);
                }
            },

            removeDirectListener: function(eventName, element) {
                if(element.detachEvent) {
                    element.detachEvent('on' + eventName,
                        this.directSubscribers[element.id][eventName].fn);
                } else {
                    this.callParent(arguments);
                }
            }
        });

        
        
        Ext.apply(prototype.directEvents, prototype.captureEvents);
        prototype.captureEvents = {};
    }
});

Ext.define('Ext.overrides.event.publisher.Gesture', {
    override: 'Ext.event.publisher.Gesture'
}, function() {
    if (Ext.isIE9m) {
        this.override({
            updateTouches: function(e, isEnd) {
                var browserEvent = e.browserEvent,
                    xy = e.getXY();

                
                
                browserEvent.pageX = xy[0];
                browserEvent.pageY = xy[1];
                this.callParent([e, isEnd]);
            },

            initHandlers: function() {
                var me = this,
                    superOnDelegatedEvent;

                me.callParent();
                superOnDelegatedEvent = me.onDelegatedEvent;

                me.onDelegatedEvent = function(e) {
                    
                    
                    
                    superOnDelegatedEvent.call(me, Ext.event.Event.enableIEAsync(e));
                };
            }
        });
    }
});






Ext.require([
    'Ext.event.gesture.*',
    'Ext.event.publisher.Dom',
    'Ext.event.publisher.Gesture',
    'Ext.event.publisher.Focus',
    'Ext.event.Dispatcher'
]);

Ext.onReady(function() {
    var dispatcher = Ext.event.Dispatcher.getInstance();

    dispatcher.setPublishers({
        dom: new Ext.event.publisher.Dom(),
        gesture: new Ext.event.publisher.Gesture({
            recognizers: {
                drag: new Ext.event.gesture.Drag(),
                tap: new Ext.event.gesture.Tap(),
                doubleTap: new Ext.event.gesture.DoubleTap(),
                longPress: new Ext.event.gesture.LongPress(),
                swipe: new Ext.event.gesture.Swipe(),
                pinch: new Ext.event.gesture.Pinch(),
                rotate: new Ext.event.gesture.Rotate(),
                edgeSwipe: new Ext.event.gesture.EdgeSwipe()
            }
        }),
        focus: new Ext.event.publisher.Focus()
        
        
        
        


    });

    Ext.get(window).on('unload', dispatcher.destroy, dispatcher);

}, null, {
    
    
    priority: 2000
});

Ext.apply(Ext, {
    
    SSL_SECURE_URL : Ext.isSecure && Ext.isIE ? 'javascript:\'\'' : 'about:blank',

    
    BLANK_IMAGE_URL: 'data:image/gif;base64,R0lGODlhAQABAID/AMDAwAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=='
});

Ext.define('Ext.overrides.Widget', {
    override: 'Ext.Widget',

    requires: ['Ext.Component'],

    $configStrict: false,

    isComponent: true,

    liquidLayout: true,

    
    
    
    rendered: true,

    rendering: true,

    cachedConfig: {
        baseCls: Ext.baseCSSPrefix + 'widget'
    },

    constructor: function(config) {
        this.callParent([config]);

        
        this.getComponentLayout();
    },

    addCls: function(cls) {
        this.el.addCls(cls);
    },

    addClsWithUI: function(cls) {
        this.el.addCls(cls);
    },

    afterComponentLayout: Ext.emptyFn,

    finishRender: function () {
        this.rendering = false;
        this.initBindable();
    },

    getComponentLayout: function() {
        var me = this,
            layout = me.componentLayout;

        if (!layout) {
            layout = me.componentLayout = new Ext.layout.component.Auto();
            layout.setOwner(me);
        }

        return layout;
    },

    
    getTdCls: function() {
        return Ext.baseCSSPrefix + this.getTdType() + '-' + (this.ui || 'default') + '-cell';
    },

    
    getTdType: function() {
        return this.xtype;
    },

    
    getItemId: function() {
        return this.itemId || this.id;
    },

    getSizeModel: function() {
        return Ext.Component.prototype.getSizeModel.apply(this, arguments);
    },

    onAdded: function (container, pos, instanced) {
        var me = this,
            inheritedState = me.inheritedState;

        me.ownerCt = container;

        
        
        
        if (inheritedState && instanced) {
            me.invalidateInheritedState();
        }

        if (me.reference) {
            me.fixReference();
        }
    },

    onRemoved: function(destroying) {
        var me = this,
            refHolder;

        if (me.reference) {
            refHolder = me.lookupReferenceHolder();
            if (refHolder) {
                refHolder.clearReference(me);
            }
        }

        if (!destroying) {
            me.removeBindings();
        }

        if (me.inheritedState && !destroying) {
            me.invalidateInheritedState();
        }

        me.ownerCt = me.ownerLayout = null;
    },

    parseBox: function(box) {
        return Ext.Element.parseBox(box);
    },

    render: function(container, position) {
        var element = this.element,
            nextSibling;

        if (position) {
            nextSibiling = container.childNodes[position];
            if (nextSibling) {
                container.insertBefore(element, nextSibling);
                return;
            }
        }

        container.appendChild(element);
    },

    setPosition: function(x, y) {
        this.el.setLocalXY(x, y);
    }

}, function() {
    var prototype;

    if (Ext.isIE8) {
        prototype = Ext.Widget.prototype;
        
        
        prototype.addElementReferenceOnDemand = prototype.addElementReference;
    }

    this.borrow(Ext.Component, ['up']);
});

Ext.define('Ext.overrides.dom.Helper', (function() {
    var tableRe = /^(?:table|thead|tbody|tr|td)$/i,
        tableElRe = /td|tr|tbody|thead/i,
        ts = '<table>',
        te = '</table>',
        tbs = ts+'<tbody>',
        tbe = '</tbody>'+te,
        trs = tbs + '<tr>',
        tre = '</tr>'+tbe;

    return {
        override: 'Ext.dom.Helper',

        ieInsertHtml: function(where, el, html) {
            var frag = null;

            
            if (Ext.isIE9m && tableRe.test(el.tagName)) {
                frag = this.insertIntoTable(el.tagName.toLowerCase(), where, el, html);
            }
            return frag;
        },

        ieOverwrite: function(el, html) {
            
            
            if (Ext.isIE9m && tableRe.test(el.tagName)) {
                
                while (el.firstChild) {
                    el.removeChild(el.firstChild);
                }
                if (html) {
                    return this.insertHtml('afterbegin', el, html);
                }
            } 
        },

        ieTable: function(depth, openingTags, htmlContent, closingTags){
            var i = -1,
                el = this.detachedDiv,
                ns, nx;

            el.innerHTML = [openingTags, htmlContent, closingTags].join('');

            while (++i < depth) {
                el = el.firstChild;
            }
            
            ns = el.nextSibling;

            if (ns) {
                ns = el;
                el = document.createDocumentFragment();
                
                while (ns) {
                     nx = ns.nextSibling;
                     el.appendChild(ns);
                     ns = nx;
                }
            }
            return el;
        },

        
        insertIntoTable: function(tag, where, destinationEl, html) {
            var node,
                before,
                bb = where === 'beforebegin',
                ab = where === 'afterbegin',
                be = where === 'beforeend',
                ae = where === 'afterend';

            if (tag === 'td' && (ab || be) || !tableElRe.test(tag) && (bb || ae)) {
                return null;
            }
            before = bb ? destinationEl :
                     ae ? destinationEl.nextSibling :
                     ab ? destinationEl.firstChild : null;

            if (bb || ae) {
                destinationEl = destinationEl.parentNode;
            }

            if (tag === 'td' || (tag === 'tr' && (be || ab))) {
                node = this.ieTable(4, trs, html, tre);
            } else if (((tag === 'tbody' || tag === 'thead') && (be || ab)) ||
                    (tag === 'tr' && (bb || ae))) {
                node = this.ieTable(3, tbs, html, tbe);
            } else {
                node = this.ieTable(2, ts, html, te);
            }
            destinationEl.insertBefore(node, before);
            return node;
        }
    };
})());




Ext.define('Ext.overrides.app.Application', {
    override: 'Ext.app.Application'
});


Ext.application = function(config) {
    var createApp = function (App) {
            
            Ext.onReady(function() {
                Ext.app.Application.instance = new App();
            });
        },
        paths = config.paths,
        ns;

    if (typeof config === "string") {
        Ext.require(config, function() {
            createApp(Ext.ClassManager.get(config));
        });
    }
    else {
        config = Ext.apply({
            extend: 'Ext.app.Application' 
        }, config);

        
        
        Ext.Loader.setPath(config.name, config.appFolder || 'app');

        if (paths) {
            for (ns in paths) {
                if (paths.hasOwnProperty(ns)) {
                    Ext.Loader.setPath(ns, paths[ns]);
                }
            }
        }

        config['paths processed'] = true;

        
        Ext.define(config.name + ".$application", config,
            function () {
                createApp(this);
            });
    }
};
