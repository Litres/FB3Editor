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
		 * @property {String} CSS-класс для подсветки найденных совпадений.
		 */
		overlayCls: 'overlay-search',
		
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
		 * @return {Number} Количество найденных совпадений.
		 */
		find: function (query, opts)
		{
			var me = this,
				state = me.getState(),
				count,
				results,
				ignoreCase,
				isReg,
				words,
				cursor;
			
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

			// убираем старую подсветку
			me.removeOverlay();
			
			if (!query)
			{
				return false;
			}
			
			// получаем объект поиска
			cursor = me.getCursor();
			
			state.setCursor(cursor);
			results = cursor.getResults();
			
			if (results)
			{
				// добавляем подсветку ко всем найденым совпадениям
				me.addOverlay();
			}
			
			// количество найденных совпадений
			count = cursor.getCount();
			state.setCount(count);
			
			return count;
		},
		
		/**
		 * Заменяет текущее найденное совпадение.
		 * @param {String} replaceStr Строка замены.
		 * @return {Number} Количество оставшихся совпадений после замены.
		 */
		replace: function (replaceStr)
		{
			var me = this,
				str = replaceStr,
				state = me.getState(),
				reg,
				matches,
				text,
				queryText,
				query,
				isReg,
				count,
				cursor;
			
			cursor = state.getCursor();
			count = state.getCount();
			isReg = state.getIsReg();
			
			if (cursor)
			{
				queryText = state.getQueryText();
				
				if (queryText !== str)
				{
					if (isReg)
					{
						// выделенный текст
						text = me.getTextSelection();
						query = me.parseQuery(true);
						matches = text.match(query);
						
						if (matches[1])
						{
							// преобразуем текущую строку замены с учетом скобочных групп в поисковой строке
							for (var i = 1; i < matches.length; i++)
							{
								reg = new RegExp('\\$' + i, 'g');
								str = str.replace(reg, matches[i]);
							}
						}
					}
					
					// заменяем текущее совпадение
					me.replaceResult(str);
					
					// перемещаем курсор к следующему совпадению
					me.next(true);
				}
				
				count = count - 1;
				state.setCount(count);
			}
			
			return count;
		},
		
		/**
		 * Заменяет все найденные совпадения.
		 * @param {String} replaceStr Строка замены.
		 * @return {Boolean} Успешна ли замена.
		 */
		replaceAll: function (replaceStr)
		{
			var me = this,
				state = me.getState(),
				res = false,
				queryText,
				cursor;
			
			queryText = state.getQueryText();
			
			console.log('replace all', replaceStr); return false;
			
			if (queryText !== replaceStr)
			{
				proxy.operation(
					function ()
					{
						while (cursor = state.getCursor())
						{
							// заменяем текущее совпадение
							me.replace(replaceStr);
							
							res = true;
						}
					}
				);
			}
			
			return res;
		},
		
		/**
		 * Переходит к следующему найденому совпадению.
		 * @param {Boolean} [delOldPos] Удалить ли выделение в предыдущем совпадении.
		 */
		next: function (delOldPos)
		{
			var me = this,
				state = me.getState(),
				cursor = state.getCursor(),
				pos = cursor.getPos(),
				results,
				result,
				resPos,
				next;
			
			me.removeOverlay();
			next = cursor.next();
			
			if (delOldPos)
			{
				results = cursor.getResults();
				result = results[pos.number];
				resPos = result.getPos();
				resPos.splice(pos.pos, 1);
				
				// корректируем поизицию текущего совпадения
				cursor.setPos(
					{
						number: cursor.getPos().number,
						pos: cursor.getPos().number === pos.number ? pos.pos : cursor.getPos().pos
					}
				);
				
				if (!resPos.length)
				{
					// удаляем результат, если в текущем элементе больше нет совпадений
					cursor.removeResult(pos.number);
				}
			}
			
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
		 * Возвращает преобразованную поисковую строку.
		 * @param {Boolean} [ignoreGlobal] Игнорировать ли глобальный поиск.
		 * @return {RegExp}
		 */
		parseQuery: function (ignoreGlobal)
		{
			var me = this,
				state = me.getState(),
				queryText = state.getQueryText(),
				isReg = state.getIsReg(),
				ignoreCase = state.getIgnoreCase(),
				words = state.getWords(),
				borderStart = me.getBorderRegExp(),
				borderEnd = me.getBorderRegExp(true),
				mods,
				query;
			
			try
			{
				mods = ignoreGlobal ? 'u' : 'gu';
				mods = ignoreCase ? mods + 'i' : mods;
				
				if (!isReg)
				{
					// преобразуем строку в регулярное выражение, экранируя все спецсимволы регулярных выражений
					queryText = queryText.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
				}
				else
				{
					queryText = me.compileQuery(queryText);
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
		},
		
		/**
		 * @private
		 * Возвращает компилированную строку для RegExp.
		 * @param {String} query Строка поиска.
		 * @return {String} Компилированная строка.
		 */
		compileQuery: function (query)
		{
			var str,
				w;
			
			// заменяем \w
			w = FBEditor.ExcludedCompiler.regexpW;
			str = query.replace(/\\[w]/g, w);
			
			return str;
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
				overlayCls = me.overlayCls,
				data,
				overlay,
				cursor;
			
			cursor = state.getCursor();
			data = cursor.getResults();
			
			// создаём объект подсветки
			overlay = Ext.create('FBEditor.editor.overlay.Overlay', {data: data, cls: overlayCls});
			
			return overlay;
		},
		
		/**
		 * @private
		 * Заменяет текущее совпадение.
		 * @param {String} str Строка замены.
		 */
		replaceResult: function (str)
		{
			var me = this,
				state = me.getState(),
				cursor = state.getCursor(),
				pos = cursor.getPos(),
				result = cursor.getResult(),
				resPos,
				el,
				overlayPos,
				text,
				newText,
				difLen;
			
			console.log('pos', pos);
			console.log('result', result);
			
			// элемент
			el = result.getEl();
			
			// позиции оверлеев элемента
			resPos = result.getPos();
			
			// текущая позиция
			overlayPos = resPos[pos.pos];
			
			// текст элемента
			text = el.getText();
			
			// новый текст
			newText = text.substring(0, overlayPos.start);
			newText += str;
			newText += text.substring(overlayPos.end);
			el.setText(newText);
			
			// синхронизируем
			el.sync();
			
			if (newText.length !== text.length)
			{
				// разница в длине между старым и новым текстом
				difLen = newText.length - text.length;
				
				// корректируем позиции оверлеев
				Ext.each(
					resPos,
					function (item, i, self)
					{
						var start = item.start,
							end = item.end;
						
						self[i].start += difLen;
						self[i].end += difLen;
					}
				);
			}
		},
		
		/**
		 * Возвращает выделенный текст.
		 * @return {String}
		 */
		getTextSelection: function ()
		{
			var me = this,
				state = me.getState(),
				cursor = state.getCursor(),
				pos = cursor.getPos(),
				result = cursor.getResult(),
				el,
				resPos,
				text;
			
			el = result.getEl();
			resPos = result.getPos()[pos.pos];
			text = el.getText(resPos.start, resPos.end);
			
			return text;
		}
	}
);