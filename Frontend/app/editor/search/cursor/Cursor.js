/**
 * Объект поиска со всеми найденными совпадениями.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.search.cursor.Cursor',
	{
		requires: [
			'FBEditor.editor.search.cursor.Result'
		],
		
		config: {
			/**
			 * @cfg {FBEditor.editor.search.Search} Поиск по тексту.
			 */
			search: null
		},
		
		/**
		 * @private
		 * @property {FBEditor.editor.search.cursor.Result[]} Все найденные совпадения.
		 */
		results: null,
		
		/**
		 * @private
		 * @property {Object} Данные текущего совпадения, выделенного в тексте.
		 * @property {Number} Object.number Номер текущего элемента (из FBEditor.editor.search.cursor.Cursor#results).
		 * @property {Number} Object.pos Номер позиции в текущем элементе.
		 */
		pos: null,
		
		/**
		 * @private
		 * @property {Number} Количество найденных совпадений.
		 */
		count: 0,
		
		constructor: function (cfg)
		{
			var me = this;
			
			me.initConfig(cfg);
			
			// выполняем поиск
			me.results = me.getResults();
		},
		
		/**
		 * Возвращает количество найденных совпадений.
		 * @returns {number}
		 */
		getCount: function ()
		{
			return this.count;
		},
		
		/**
		 * Возвращает все найденные совпадения.
		 * @return {FBEditor.editor.search.cursor.Result[]}
		 */
		getResults: function ()
		{
			var me = this,
				results = me.results,
				search = me.getSearch(),
				state = search.getState(),
				manager = search.getManager(),
				range = manager.getRange(),
				content = manager.getContent(),
				isSetSelection = false,
				curNumber = 0,
				curOffset = 0,
				selection,
				curEl,
				query,
				reg;
			
			if (results)
			{
				return results;
			}
			
			// обновляем порядковые номера всех элементов
			manager.updateNumbers();
			
			if (range)
			{
				// текущий элемент, в котором находится курсор
				curEl = range.start.getElement();
				curOffset = range.offset.start;
				curNumber = curEl.getNumber();
			}
			
			query = state.getQueryText();
			reg = new RegExp(query, 'gi');
			
			// перебираем всех потомков
			content.eachAll(
				function (el)
				{
					var pos = [],
						number,
						result,
						text,
						res,
						cfg;
					
					if (el.isText)
					{
						text = el.getText();
						
						// позиция элемента в общем потоке элементов
						number = el.getNumber();
						
						while (res = reg.exec(text))
						{
							selection = false;
							
							// совпадение, которое находится ближе к курсору в тексте
							if (!isSetSelection && number >= curNumber && res.index >= curOffset)
							{
								isSetSelection = true;
								selection = true;
								//console.log('el', number, el);
								
								// сохраняем позицию текущего совпадения
								me.setPos(
									{
										number: results ? results.length : 0,
										pos: pos.length
									}
								);
							}
							
							// начальная позиция совпадения в элементе
							pos.push(
								{
									start: res.index,
									end: res.index + res[0].length,
									selection: selection
								}
							);
							
							me.count++;
						}
						
						if (pos.length)
						{
							cfg = {
								el: el,
								pos: pos
							};
							
							// создаем объект результата поиска
							result = Ext.create('FBEditor.editor.search.cursor.Result', cfg);
							
							results = results || [];
							results.push(result);
						}
					}
				}
			);
			
			manager.setRange(null);
			
			return results;
		},
		
		
		/**
		 * Возвращает следующий результат поиска.
		 * @return {FBEditor.editor.search.cursor.Result}
		 */
		next: function ()
		{
			var me = this,
				results = me.results,
				search = me.getSearch(),
				manager = search.getManager(),
				range = manager.getRange(),
				curNumber = 0,
				curOffset = 0,
				oldPos = me.getPos(),
				oldResult,
				oldResultEl,
				oldResultPos,
				newPos,
				firstResult,
				firstEl,
				firstPos,
				curEl,
				next;
			
			// обновляем порядковые номера всех элементов
			manager.updateNumbers();
			
			if (range)
			{
				// текущий элемент, в котором находится курсор
				curEl = range.start.getElement();
				curOffset = range.offset.start;
				curNumber = curEl.getNumber();

				//console.log('range', range);
				//console.log('curEl, curOffset, curNumber', curEl, curOffset, curNumber);
			}
			
			me.each(
				function (item, i)
				{
					var itemPos = item.getPos(),
						itemEl = item.getEl(),
						nextItem = results[i + 1],
						nextEl,
						nextPos,
						number;
					
					// позиция элемента в общем потоке элементов
					number = itemEl.getNumber();
					
					item.each(
						function (pos, j)
						{
							if (range)
							{
								// ищем ближайшее совпадение после курсора в тексте
								
								if (number >= curNumber && pos.start >= curOffset)
								{
									// совпадение, которое находится после курсора в тексте
									
									if (pos.selection)
									{
										next = item;
									}
									else
									{
										itemPos[j].selection = true;
										next = Ext.create('FBEditor.editor.search.cursor.Result', {el: itemEl, pos: itemPos});
										results[i] = next;
									}
									
									// новая позиция текущего совпадения
									newPos = {
										number: i,
										pos: j
									};
									
									return true;
								}
							}
							else if (pos.selection)
							{
								// ищем следующее совпадение после текущего
								
								if (itemPos[j + 1])
								{
									// текущий элемент и следующая позиция
									
									itemPos[j].selection = false;
									itemPos[j + 1].selection = true;
									next = Ext.create('FBEditor.editor.search.cursor.Result', {el: itemEl, pos: itemPos});
									results[i] = next;
									
									// новая позиция текущего совпадения
									newPos = {
										number: i,
										pos: j + 1
									};
								}
								else if (nextItem)
								{
									// следующий элемент и первая позиция
									
									itemPos[j].selection = false;
									results[i] = Ext.create('FBEditor.editor.search.cursor.Result', {el: itemEl, pos: itemPos});
									
									nextEl = nextItem.getEl();
									nextPos = nextItem.getPos();
									nextPos[0].selection = true;
									next = Ext.create('FBEditor.editor.search.cursor.Result', {el: nextEl, pos: nextPos});
									results[i + 1] = next;
									
									// новая позиция текущего совпадения
									newPos = {
										number: i + 1,
										pos: 0
									};
								}
								else
								{
									// первый элемент и первая позиция
									
									itemPos[j].selection = false;
									results[i] = Ext.create('FBEditor.editor.search.cursor.Result', {el: itemEl, pos: itemPos});
									
									firstResult = results[0];
									nextEl = firstResult.getEl();
									nextPos = firstResult.getPos();
									nextPos[0].selection = true;
									next = Ext.create('FBEditor.editor.search.cursor.Result', {el: nextEl, pos: nextPos});
									results[0] = next;
									
									// новая позиция текущего совпадения
									newPos = {
										number: 0,
										pos: 0
									};
								}
								
								return true;
							}
						}
					);
					
					if (next)
					{
						return true;
					}
				}
			);
		
			if (range)
			{
				if (!next)
				{
					// самое первое совпадение в тексте
					
					firstResult = results[0];
					firstEl = firstResult.getEl();
					firstPos = firstResult.getPos();
					firstPos[0].selection = true;
					next = Ext.create('FBEditor.editor.search.cursor.Result', {el: firstEl, pos: firstPos});
					results[0] = next;
					
					// новая позиция текущего совпадения
					newPos = {
						number: 0,
						pos: 0
					};
				}
				
				if (!Ext.Object.equals(oldPos, newPos))
				{
					// убираем выделение со старого текущего совпадения
					
					oldResult = results[oldPos.number];
					oldResultEl = oldResult.getEl();
					oldResultPos = oldResult.getPos();
					oldResultPos[oldPos.pos].selection = false;
					
					results[oldPos] = Ext.create('FBEditor.editor.search.cursor.Result', {el: oldResultEl, pos: oldResultPos});
				}
			}

			// сохраняем новую позицию текущего совпадения
			me.setPos(newPos);
			
			manager.setRange(null);
			
			return next;
		},
		
		
		/**
		 * Возвращает предыдущий результат поиска.
		 * @return {FBEditor.editor.search.cursor.Result}
		 */
		prev: function ()
		{
			var me = this,
				results = me.results,
				search = me.getSearch(),
				manager = search.getManager(),
				range = manager.getRange(),
				oldPos = me.getPos(),
				oldResult,
				oldResultEl,
				oldResultPos,
				curNumber,
				curOffset,
				curEl,
				newPos,
				lastEl,
				lastPos,
				lastResult,
				prev;
			
			// обновляем порядковые номера всех элементов
			manager.updateNumbers();
			
			if (range)
			{
				// текущий элемент, в котором находится курсор
				curEl = range.start.getElement();
				curOffset = range.offset.start;
				curNumber = curEl.getNumber();
				
				//console.log('range', range);
				//console.log('curEl, curOffset, curNumber', curEl, curOffset, curNumber);
			}
			
			me.each(
				function (item, i)
				{
					var itemPos = item.getPos(),
						itemEl = item.getEl(),
						prevItem = results[i - 1],
						prevEl,
						prevPos,
						number;
					
					// позиция элемента в общем потоке элементов
					number = itemEl.getNumber();
					
					item.each(
						function (pos, j)
						{
							if (range)
							{
								// ищем ближайшее совпадение перед курсором в тексте
								
								if (number === curNumber && pos.end <= curOffset || number < curNumber)
								{
									// совпадение, которое находится перед курсором в тексте в том же элементе
									
									if (pos.selection)
									{
										prev = item;
									}
									else
									{
										itemPos[j].selection = true;
										prev = Ext.create('FBEditor.editor.search.cursor.Result', {el: itemEl, pos: itemPos});
										results[i] = prev;
									}
									
									// новая позиция текущего совпадения
									newPos = {
										number: i,
										pos: j
									};
									
									return true;
								}
							}
							else if (pos.selection)
							{
								// ищем предыдущее совпадение перед текущим
								
								if (itemPos[j - 1])
								{
									// текущий элемент и предыдущая позиция
									
									itemPos[j].selection = false;
									itemPos[j - 1].selection = true;
									prev = Ext.create('FBEditor.editor.search.cursor.Result', {el: itemEl, pos: itemPos});
									results[i] = prev;
									
									// новая позиция текущего совпадения
									newPos = {
										number: i,
										pos: j - 1
									};
								}
								else if (prevItem)
								{
									// предыдущий элемент и последняя позиция
									
									itemPos[j].selection = false;
									results[i] = Ext.create('FBEditor.editor.search.cursor.Result', {el: itemEl, pos: itemPos});
									
									prevEl = prevItem.getEl();
									prevPos = prevItem.getPos();
									prevPos[prevPos.length - 1].selection = true;
									prev = Ext.create('FBEditor.editor.search.cursor.Result', {el: prevEl, pos: prevPos});
									results[i - 1] = prev;
									
									// новая позиция текущего совпадения
									newPos = {
										number: i - 1,
										pos: prevPos.length - 1
									};
								}
								else
								{
									// последний элемент и последняя позиция
									
									itemPos[j].selection = false;
									results[i] = Ext.create('FBEditor.editor.search.cursor.Result', {el: itemEl, pos: itemPos});
									
									lastResult = results[results.length - 1];
									prevEl = lastResult.getEl();
									prevPos = lastResult.getPos();
									prevPos[prevPos.length - 1].selection = true;
									prev = Ext.create('FBEditor.editor.search.cursor.Result', {el: prevEl, pos: prevPos});
									results[results.length - 1] = prev;
									
									// новая позиция текущего совпадения
									newPos = {
										number: results.length - 1,
										pos: prevPos.length - 1
									};
								}
								
								return true;
							}
						},
						item,
						true
					);
					
					if (prev)
					{
						return true;
					}
				},
				me,
				true
			);
			
			if (range)
			{
				if (!prev)
				{
					// самое первое совпадение в тексте
					
					lastResult = results[results.length - 1];
					lastEl = lastResult.getEl();
					lastPos = lastResult.getPos();
					lastPos[lastPos.length - 1].selection = true;
					prev = Ext.create('FBEditor.editor.search.cursor.Result', {el: lastEl, pos: lastPos});
					results[results.length - 1] = prev;
					
					// новая позиция текущего совпадения
					newPos = {
						number: results.length - 1,
						pos: lastPos.length - 1
					};
				}
				
				if (!Ext.Object.equals(oldPos, newPos))
				{
					// убираем выделение со старого текущего совпадения
					
					oldResult = results[oldPos.number];
					oldResultEl = oldResult.getEl();
					oldResultPos = oldResult.getPos();
					oldResultPos[oldPos.pos].selection = false;
					
					results[oldPos] = Ext.create('FBEditor.editor.search.cursor.Result', {el: oldResultEl, pos: oldResultPos});
				}
			}
			
			// сохраняем новую позицию текущего совпадения
			me.setPos(newPos);
			
			manager.setRange(null);
			
			return prev;
		},
		
		/**
		 * Перебирает все найденные элементы, передавая их в функцию.
		 * @param {Function} fn Функция-итератор.
		 * @param {Object} [scope] Область видимости.
		 * @param {Boolean} [reverse] Перебирать в обратном порядке.
		 */
		each: function (fn, scope, reverse)
		{
			var me = this,
				pos = 0,
				res;
			
			scope = scope || me;
			
			if (!reverse)
			{
				while (pos < me.results.length)
				{
					res = me.results[pos];
					pos++;
					
					if (fn.apply(scope, [res, pos - 1]))
					{
						// прерываем цикл
						break;
					}
				}
			}
			else
			{
				pos = me.results.length - 1;
				
				while (pos >= 0)
				{
					res = me.results[pos];
					pos--;
					
					if (fn.apply(scope, [res, pos + 1]))
					{
						// прерываем цикл
						break;
					}
				}
			}
		},
		
		/**
		 * Устанавливает номер текущего совпадения.
		 * @param {Object} data Данные текущего совпадения, выделенного в тексте.
		 * @param {Number} data.number Номер текущего элемента (из FBEditor.editor.search.cursor.Cursor#results).
		 * @param {Number} data.pos Номер позиции в текущем элементе.
		 */
		setPos: function (data)
		{
			this.pos = data;
		},
		
		/**
		 * Возвращает номер текущего совпадения.
		 * @return {Object}  Данные текущего совпадения, выделенного в тексте.
		 * @return {Number} Object.number Номер текущего элемента (из FBEditor.editor.search.cursor.Cursor#results).
		 * @return {Number} Object.pos Номер позиции в текущем элементе.
		 */
		getPos: function ()
		{
			return this.pos;
		}
	}
);