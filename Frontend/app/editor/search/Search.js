/**
 * Поиск по тексту.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.search.Search',
	{
		requires: [
			'FBEditor.editor.search.cursor.Cursor',
			'FBEditor.editor.search.State'
		],
		
		config: {
			/**
			 * @cfg {FBEditor.editor.Manager} Менеджер редактора текста.
			 */
			manager: null
		},
		
		/**
		 * @private
		 * @property {FBEditor.editor.Manager} Менеджер редактора текста.
		 */
		manager: null,
		
		/**
		 * @private
		 * @property {FBEditor.editor.search.State} Состояние поиска.
		 */
		sate: null,
		
		/**
		 * @param {FBEditor.editor.Manager} cfg.manager Менеджер редактора текста.
		 */
		constructor: function (cfg)
		{
			var me = this;
			
			me.initConfig(cfg);
			
			// состояние поиска
			me.state = Ext.create('FBEditor.editor.search.State');
		},
		
		/**
		 * Возвращает состояние поиска.
		 * @return {FBEditor.editor.search.State}
		 */
		getState: function ()
		{
			return this.state;
		},
		
		/**
		 * Ищет все совпадения в тексте.
		 * @param {String} query Поисковая строка.
		 * @param {Object} [opts] Дополнительные параметры поиска.
		 */
		find: function (query, opts)
		{
			var me = this,
				state = me.getState(),
				results,
				ignoreCase,
				isReg,
				words,
				cursor;
			
			if (query === 'n')
			{
				me.next();
				return;
			}
			
			if (query === 'p')
			{
				me.prev();
				return;
			}
			
			// убираем старую подсветку
			me.removeOverlay();
			
			if (opts)
			{
				ignoreCase = opts.ignoreCase;
				isReg = opts.isReg;
				words = opts.words;
			}
			
			// сохраняем состояние поиска
			state.setQueryText(query);
			state.setIgnoreCase(ignoreCase);
			state.setIsReg(isReg);
			state.setWords(words);
			
			// получаем объект поиска
			cursor = me.getCursor();
			
			state.setCursor(cursor);
			results = cursor.getResults();
			
			if (results)
			{
				// добавляем подсветку ко всем найденым совпадениям
				me.addOverlay();
			}
		},
		
		/**
		 * Переходит к следующему найденому совпадению.
		 */
		next: function ()
		{
			var me = this,
				state = me.getState(),
				next,
				cursor;
			
			me.removeOverlay();
			cursor = state.getCursor();
			next = cursor.next();
			me.addOverlay();
		},
		
		/**
		 * Переходит к предыдущему найденому совпадению.
		 */
		prev: function ()
		{
			var me = this,
				state = me.getState(),
				prev,
				cursor;
			
			me.removeOverlay();
			cursor = state.getCursor();
			prev = cursor.prev();
			me.addOverlay();
		},
		
		/**
		 * Убирает подсветку найденных совпадений.
		 */
		removeOverlay: function ()
		{
			var me = this,
				state = me.getState(),
				manager = me.getManager(),
				overlay = state.getOverlay();
			
			if (overlay)
			{
				manager.removeOverlay(overlay);
			}
		},
		
		/**
		 * @private
		 * Возвращает объект поиска.
		 * @return {Object}
		 */
		getCursor: function ()
		{
			var me = this,
				cursor;
			
			cursor = Ext.create('FBEditor.editor.search.cursor.Cursor', {search: me});
			
			return cursor;
		},
		
		/**
		 * @private
		 * Добавляет подсветку в тексте к найденным совпадениям.
		 */
		addOverlay: function ()
		{
			var me = this,
				manager = me.getManager(),
				state = me.getState(),
				overlay;
			
			// создаем объект для подсветки в тексте
			overlay = me.getOverlay();
			state.setOverlay(overlay);
			
			if (overlay)
			{
				manager.addOverlay(overlay);
			}
		},
		
		/**
		 * @private
		 * Возвращает объект для подсветки в тексте.
		 * @return {Object}
		 */
		getOverlay: function ()
		{
			var me = this,
				state = me.getState(),
				data,
				overlay,
				cursor;
			
			cursor = state.getCursor();
			data = cursor.getResults();
			
			// создаём объект подсветки
			overlay = Ext.create('FBEditor.editor.overlay.Overlay', {data: data, cls: 'overlay-search'});
			
			return overlay;
		}
	}
);