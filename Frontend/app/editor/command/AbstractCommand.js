/**
 * Абстрактная команда редактора тела книги.
 *
 * @abstract
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.AbstractCommand',
	{
		extend: 'FBEditor.command.InterfaceCommand',

		/**
		 * @property {Object} Данные для команды.
		 */
		data: null,

		/**
		 * @property {Boolean} Нужна ли синхронизация кнопок после проверки по схеме.
		 */
		syncButtons: true,

		/**
		 * @param {Object} opts Данные.
		 */
		constructor: function (opts)
		{
			var me = this;

			me.data = opts || {};
		},

		/**
		 * Возвращает данные для команды.
		 * @return {Object} Данные для команды.
		 */
		getData: function ()
		{
			return this.data;
		},

		/**
		 * Возвращает менеджер истории редактора текста.
		 * @param {FBEditor.editor.element.AbstractElement} el Эемент.
		 * @return {FBEditor.editor.History}
		 */
		getHistory: function (el)
		{
			var editor,
				history;

			editor = el.getEditor();
			history = editor.getHistory();

			return history;
		},

		/**
		 * @template
		 * Выполняется перед отменой операции unExecute.
		 * В сдучае, если отмена дествительно нужна то выполнит resolve, иначе reject.
		 * @return {Promise}
		 */
		beforeUnExecute: function ()
		{
			var promise;

			promise = Promise.resolve(true);

			return promise;
		},

		/**
		 * @protected
		 * Опитмизирует однотипные пересекающиеся элементы.
		 * @param {FBEditor.editor.element.AbstractElement} el Родительский элемент, относительно которого
		 * начинается оптимизация.
		 */
		optimizeEqualIntersectEls: function (el)
		{
			var me = this,
				data = me.getData(),
				continueOptimize = true,
				queue = [],
				map;

			while (continueOptimize)
			{
				continueOptimize = false;

				// соединяет соседние однотипные стилевые элементы
				if (map = me.joinEqualSibling(el))
				{
					queue.push(
						{
							type: 'join',
							map: map
						}
					);
				}

				// удаляет однотипные вложенные друг в друга стилевые элементы
				if (map = me.removeEqualInner(el))
				{
					queue.push(
						{
							type: 'remove',
							map: map
						}
					);

					continueOptimize = true;
				}
			}

			data.optimizeQueue = queue.length ? queue : null;
		},

		/**
		 * @protected
		 * Восстанавливает исходное состояние оптимизированных пересекавшихся элементов.
		 * @param {FBEditor.editor.element.AbstractElement} el Родительский элемент, относительно которого
		 * начинается восстановление.
		 */
		unOptimizeEqualIntersectEls: function (el)
		{
			var me = this,
				data = me.getData(),
				queue = data.optimizeQueue.reverse();

			//console.log('queue', queue);

			Ext.each(
				queue,
				function (item)
				{
					switch (item.type)
					{
						case 'remove':
							me.unRemoveEqualInner(item.map);
							break;
						case 'join':
							me.unJoinEqualSibling(item.map, el);
							break;
					}
				}
			);

			delete data.optimizeQueue;
		},

		/**
		 * @private
		 * Соединяет соседние однотипные стилевые элементы.
		 * @param {FBEditor.editor.element.AbstractElement} el Родительский элемент, относительно которого
		 * начинается проверка.
		 * @param {Object} mapJoinEqual Сохраненные ссылки на оптимизированные элементы (для ctrl+z).
		 * @return {Object} Сохраненные ссылки на оптимизированные элементы (для ctrl+z).
		 */
		joinEqualSibling: function (el, mapJoinEqual)
		{
			var me = this,
				data = me.getData(),
				viewportId = data.viewportId,
				els = {},
				map;

			if (el.isStyleFormat && el.next() && el.getName() === el.next().getName())
			{
				// соединяем соседние элементы

				map = {
					el: el,
					next: el.next(),
					child: []
				};

				els.next = el.next();
				els.first = els.next.first();

				while (els.first)
				{
					map.child.push(els.first);
					el.add(els.first, viewportId);
					els.first = els.next.first();
				}

				el.parent.remove(els.next, viewportId);

				// сохраняем ссылки для ctrl+z
				mapJoinEqual = mapJoinEqual || {};
				mapJoinEqual[el.elementId] = mapJoinEqual[el.elementId] || [];
				mapJoinEqual[el.elementId].push(map);

				// проверяем еще раз
				mapJoinEqual = me.joinEqualSibling(el, mapJoinEqual);
			}

			// проверяем потомков
			el.each(
				function (child)
				{
					mapJoinEqual = me.joinEqualSibling(child, mapJoinEqual);
				}
			);

			return mapJoinEqual;
		},

		/**
		 * @private
		 * Разъединяет соединенные соседние однотипные стилевые элементы.
		 * @param {FBEditor.editor.element.AbstractElement} el Родительский элемент, относительно которого
		 * начинается проверка.
		 * @param {Object} mapData Данные для восстановления.
		 */
		unJoinEqualSibling: function (mapData, el)
		{
			var me = this,
				data = me.getData(),
				viewportId = data.viewportId,
				els = {},
				nodes = {},
				map,
				helper;

			if (el.isStyleFormat && mapData[el.elementId])
			{
				// разъединяем соединенные соседние элементы

				// получаем сохраненные данные
				map = mapData[el.elementId][mapData[el.elementId].length - 1];

				// элемент, который должен быть следующим
				els.old = map.next;
				helper = els.old.getNodeHelper();
				nodes.old = helper.getNode(viewportId);

				if (!nodes.old.parentNode)
				{
					// создаем следующий элемент

					if (els.next = el.next())
					{
						el.parent.insertBefore(els.old, els.next, viewportId);
					}
					else
					{
						el.parent.add(els.old, viewportId);
					}
				}

				// переносим потомка во вновь созданный следующий элемент
				els.child = map.child.shift();
				els.old.add(els.child, viewportId);

				if (!map.child.length)
				{
					// подчищаем данные, как только все потомки перенесены
					mapData[el.elementId].pop();
				}

				if (!mapData[el.elementId].length)
				{
					// подчищаем данные
					delete mapData[el.elementId];
				}

				// проверяем еще раз
				me.unJoinEqualSibling(mapData, el);
			}

			// проверяем потомков
			el.each(
				function (child)
				{
					me.unJoinEqualSibling(mapData, child);
				}
			);
		},

		/**
		 * @private
		 * Удаляет вложенные друг в друга однотипные стилевые элементы.
		 * @param {FBEditor.editor.element.AbstractElement} el Родительский элемент, относительно которого
		 * начинается проверка.
		 * @param {Object} mapRemoveEqual Сохраненные ссылки на оптимизированные элементы (для ctrl+z).
		 * @return {Object} Сохраненные ссылки на оптимизированные элементы (для ctrl+z).
		 */
		removeEqualInner: function (el, mapRemoveEqual)
		{
			var me = this,
				data = me.getData(),
				viewportId = data.viewportId,
				els = {},
				map;

			if (el.isStyleFormat && el.hasParentName(el.getName()))
			{
				// удаляем вложенный элемент, перенося всех его потомков на его же уровень

				// сохраняем ссылки для ctrl+z
				map = {
					el: el,
					child: []
				};

				while (els.first = el.first())
				{
					el.parent.insertBefore(els.first, el, viewportId);

					// для ctrl+z
					map.child.push(els.first);
				}

				el.parent.remove(el, viewportId);

				// для ctrl+z
				mapRemoveEqual = mapRemoveEqual || [];
				mapRemoveEqual.push(map);
			}

			// проверяем потомков
			el.each(
				function (child)
				{
					mapRemoveEqual = me.removeEqualInner(child, mapRemoveEqual);
				}
			);

			return mapRemoveEqual;
		},

		/**
		 * @protected
		 * Восттанваливает удаленные вложенные друг в друга однотипные стилевые элементы.
		 * @param {Array} mapData Данные для восстановления.
		 */
		unRemoveEqualInner: function (mapData)
		{
			var me = this,
				data = me.getData(),
				viewportId = data.viewportId,
				els = {};

			Ext.each(
				mapData,
				function (map)
				{
					// восстанавливаем вложенный элемент

					els.el = map.el;
					els.parent = els.el.parent;
					els.first = map.child[0];
					els.parent.insertBefore(els.el, els.first, viewportId);

					// перемещаем во вновь созданный вложенный элемент всех его потомков
					Ext.each(
						map.child,
						function (child)
						{
							els.el.add(child, viewportId);
						}
					)
				}
			);
		},
		
		/**
		 * Проверяет по схеме элемент.
		 * @param {FBEditor.editor.element.AbstractElement} el Элемент.
		 * @param {Object} [opts] Дополнительные опции.
		 * @param {Boolean} [opts.validXml] Нужно ли проверить получившуюся структуру документа через xsd.
		 * @param {Boolean} [opts.debug] Нужны ли отладочные сообщения.
		 */
		verifyElement: function (el, opts)
		{
			var me = this,
				manager = el.getManager(),
				sch = manager.getSchema(),
				scopeData,
				xml;
			
			if (!el || el.isText || el.isUndefined || el.isStyleHolder && el.isEmpty())
			{
				// текст, пустые абзацы и неопределенные элементы не нуждаются в проверке
				return true;
			}
			
			opts = opts || {};
			
			scopeData = {
				el: el,
				debug: opts.debug,
				syncButtons: me.syncButtons
			};
			
			if (opts.validXml)
			{
				// получаем xml без текстовых элементов
				xml = manager.getContent().getXml(true);
				
				//console.log(xml);
				
				// приостанавливаем обработку команд на время выполнения проверки по схеме
				manager.setSuspendCmd(true);
				
				// вызываем проверку по схеме
				sch.validXml({xml: xml, callback: me.verifyResult, scope: me, scopeData: scopeData});
			}
			else
			{
				me.verifyResult(true, scopeData);
			}
		},

		/**
		 * @private
		 * Получает результат проверки элемента по схеме и в случае неудачи отменяет действие команды.
		 * @param {Boolean} res Успешна ли проверка.
		 * @param {Object} [scopeData]
		 */
		verifyResult: function (res, scopeData)
		{
			var me = this,
				el = scopeData.el,
				syncButtons = scopeData.syncButtons,
				manager = el.getManager(),
				xml;

			//console.log('res', res, scopeData);
			
			// возобновляем обработку команд
			manager.setSuspendCmd(false);

			if (!res)
			{
				xml = el.getXml();

				me.beforeUnExecute().then(
					function ()
					{
						// отменяем действие команды
						me.unExecute();

						Ext.log({msg: 'Полученная структура элемента не соответствует схеме:' + xml, level: 'info'});

						throw Error('Действие команды отменено для ' + el.getName());
					},
				    function ()
				    {
					    // 
				    }
				);
			}
			
			manager.setChanged(true);
			
			if (syncButtons)
			{
				// принудительно синхронизируем кнопки, игнорируя кэш
				manager.syncButtons();
			}
		}
	}
);