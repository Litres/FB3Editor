/**
 * Прокси для поиска.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
    'FBEditor.view.panel.main.xml.proxy.search.Search',
    {
        requires: [
	        'FBEditor.view.panel.main.xml.proxy.search.State'
        ],
        
        /**
         * @private
         * @property {FBEditor.view.panel.main.xml.proxy.Editor} Прокси внешнего редактора xml.
         */
        proxy: null,
	
	    /**
	     * @private
	     * @property {FBEditor.view.panel.main.xml.proxy.search.State} Состояние поиска.
	     */
        sate: null,

        /**
         * @param {FBEditor.view.panel.main.xml.proxy.Editor} proxy Прокси внешнего редактора xml.
         */
        constructor: function (proxy)
        {
            var me = this;
            
            me.proxy = proxy;
            
            // состояние поиска
            me.state = Ext.create('FBEditor.view.panel.main.xml.proxy.search.State');
        },
	
	    /**
	     * Возвращает прокси внешнего редактора.
	     * @return {FBEditor.view.panel.main.xml.proxy.Editor}
	     */
	    getProxy: function ()
	    {
		    return this.proxy;
	    },
	
	    /**
	     * Возвращает состояние поиска.
	     * @return {FBEditor.view.panel.main.xml.proxy.search.State}
	     */
	    getState: function ()
	    {
		    return this.state;
	    },
	
	    /**
	     * Возвращает внешний редактор xml.
	     * @return {Object}
	     */
	    getLib: function ()
	    {
		    var me = this,
			    proxy = me.getProxy();
		
		    return proxy.getLib();
	    },

        /**
         * Выполняет поиск.
         * @param {String|RegExp} query Строка поиска.
         * @param {Boolean} isReg Регулярное ли выражение в строке поиска.
         * @param {Boolean} ignoreCase Игнорировать ли регистр букв.
         * @param {Boolean} words Искать ли слова.
         * @return {Number} Количество найденных совпадений.
         */
        find: function (query, isReg, ignoreCase, words)
        {
            var me = this,
                proxy = me.getProxy(),
                state = me.getState(),
	            count = 0,
                overlay,
                cursor;
	
            state.setQueryText(query);
	        state.setIgnoreCase(ignoreCase);
	        state.setIsReg(isReg);
	        state.setWords(words);
	
	        // удаляем старую подсветку в тексте
	        overlay = state.getOverlay();
	        proxy.removeOverlay(overlay);
	        
	        if (!query)
            {
                return false;
            }
	
	        // создаем новую подсветку в тексте
	        overlay = me.getOverlay();
	        state.setOverlay(overlay);
	        
	        if (overlay)
            {
	            proxy.addOverlay(overlay);
            }
            
            // получаем результат поиска
	        cursor = me.getCursor();
	        state.setCursor(cursor);
	        
            if (cursor)
            {
                // устанавливаем выделение в тексте
	            me.toCursor();
	            
	            count = me.getCount();
            }
	
	        state.setCount(count);
	
	        return count;
        },
	
	    /**
	     * Перемещает курсор к следующему найденому результату.
	     */
	    findNext: function ()
	    {
		    var me = this,
			    state = me.getState(),
			    count = state.getCount(),
			    cursor;
		
		    if (count)
		    {
			    cursor = me.getCursor();
			    state.setCursor(cursor);
			    me.toCursor();
		    }
	    },
	
	    /**
	     * Перемещает курсор к следующему найденому результату.
	     */
	    findPrev: function ()
	    {
		    var me = this,
			    state = me.getState(),
			    count = state.getCount(),
			    cursor;
		
		    if (count)
		    {
			    cursor = me.getCursor(true);
			    state.setCursor(cursor);
			    me.toCursor();
		    }
	    },
	
	    /**
         * Убирает подсветку найденных результатов.
	     */
	    removeOverlay: function ()
	    {
		    var me = this,
			    state = me.getState(),
                proxy = me.getProxy(),
			    overlay;
		    
		    overlay = state.getOverlay();
		    proxy.removeOverlay(overlay);
	    },
	
	    /**
	     * Возвращает количество найденных совпадений.
	     * @return {Number}
	     */
	    getCount: function ()
	    {
		    var me = this,
			    proxy = me.getProxy(),
			    state = me.getState(),
			    query = state.getQueryText(),
			    total = 0,
			    match,
			    data;
		    
		    if (query)
		    {
			    query = me.parseQuery();
			
			    if (query)
			    {
				    data = proxy.getData();
				    match = data.match(query);
				    total = match ? match.length : total;
				    //console.log('match', match);
			    }
		    }
		
		    return total;
	    },
	
	    /**
	     * @private
	     * Устанавливает выделение в тексте.
	     */
	    toCursor: function ()
	    {
		    var me = this,
			    proxy = me.getProxy(),
			    state = me.getState(),
			    SCROLL_MARGIN = 20,
			    cursor,
			    from,
			    to;
		    
		    cursor = state.getCursor();
		    
		    if (cursor)
		    {
			    from = cursor.from();
			    to = cursor.to();
			    proxy.setSelection(from, to);
			    proxy.scrollIntoView(from, to, SCROLL_MARGIN);
		    }
	    },
	
	    /**
	     * @private
	     * Возвращает объект поиска.
	     * @param {Boolean} [reverse] Поиск в обратном порядке.
	     * @return {Object}
	     */
	    getCursor: function (reverse)
	    {
		    var me = this,
			    proxy = me.getProxy(),
			    lib = me.getLib(),
			    state = me.getState(),
			    query = state.getQueryText(),
			    isReg = state.getIsReg(),
			    ignoreCase = state.getIgnoreCase(),
			    words = state.getWords(),
			    borderStart = me.getBorderRegExp(),
			    borderEnd = me.getBorderRegExp(true),
			    res,
			    pos,
			    cursor;
		
		    if (isReg || words)
		    {
			    try
			    {
				    query = words ? borderStart + query + borderEnd : query;
				    query = new RegExp(query, ignoreCase ? 'giu' : 'gu');
			    }
			    catch (e)
			    {
				    return false;
			    }
		    }
		    
		    //console.log('query', query);
		
		    // позиция курсора
		    pos = proxy.getCursor(reverse ? 'from' : 'to');
		
		    // получаем объект поиска начиная с текущей позиции курсора
		    cursor = lib.getSearchCursor(query, pos, {caseFold: ignoreCase});
		    res = cursor.find(reverse);
		    
		    if (!res)
		    {
			    pos = reverse ? proxy.createPos(lib.lastLine()) : proxy.createPos(lib.firstLine(), 0);
			    cursor = lib.getSearchCursor(query, pos, {caseFold: ignoreCase});
			    res = cursor.find(reverse);
		    }
		
		    cursor = res ? cursor : false;
		
		    return cursor;
	    },
	
	    /**
	     * @private
	     * Возвращает преобразованную поисковую строку.
	     * @return {RegExp}
	     */
	    parseQuery: function ()
	    {
		    var me = this,
			    state = me.getState(),
			    queryText = state.getQueryText(),
			    isReg = state.getIsReg(),
			    ignoreCase = state. getIgnoreCase(),
			    words = state.getWords(),
			    borderStart = me.getBorderRegExp(),
			    borderEnd = me.getBorderRegExp(true),
			    mods,
			    query;
		    
		    try
		    {
			    mods = ignoreCase ? 'giu' : 'gu';
			
			    if (!isReg)
			    {
				    // преобразуем строку в регулярное выражение, экранируя все спецсимволы регулярных выражений
				    queryText = queryText.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
			    }

			    query = words ? borderStart + queryText + borderEnd : queryText;
			    query = new RegExp(query, mods);
		    }
		    catch (e)
		    {
			    return false;
		    }
		    
		    //console.log('parseQuery', query);
		    
		    return query;
	    },
	
	    /**
	     * @private
	     * Возвращает объект подсветки.
	     * @return {Object}
	     */
	    getOverlay: function ()
	    {
		    var me = this,
			    query,
			    overlay;
		
		    /* @link https://codemirror.net/doc/manual.html#modeapi */
		    function getToken (stream)
		    {
			    var match;
			
			    query.lastIndex = stream.pos;
			    match = query.exec(stream.string);
			
			    if (match && match.index == stream.pos)
			    {
				    stream.pos += match[0].length || 1;
				
				    return "searching";
			    }
			    else if (match)
			    {
				    stream.pos = match.index;
			    }
			    else
			    {
				    stream.skipToEnd();
			    }
		    }
		
		    // преобразуем строку поиска
		    query = me.parseQuery();
		
		    if (!query)
		    {
			    return false;
		    }
		
		    overlay = {
			    token: getToken
		    };
		
		    return overlay;
	    },
	
	    /**
	     * @private
	     * Возвращает универсальную границу слова для использования в регулярном выражении поиска слов.
	     * @param {Boolean} [isEnd] true - граница конца слова, false - граница начала слова.
	     * @return {String}
	     */
	    getBorderRegExp: function (isEnd)
	    {
		    var border;
		
		    border = (isEnd ? ')' : '') + '(?:' + (isEnd ? '$' : '^') + '|[^_0-9a-zA-Zа-яА-ЯёЁ])' + (isEnd ? '' : '(');
		    border = '\\b';
		
		    return border;
	    }
    }
);