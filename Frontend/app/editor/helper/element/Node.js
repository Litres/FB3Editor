/**
 * Хэлпер для работы с отображением элемента.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.helper.element.Node',
	{
		/**
		 * @private
		 * @property {FBEditor.editor.element.AbstractElement} Элемент.
		 */
		el: null,

		constructor: function (el)
		{
			var me = this;

			me.el = el;
		},

		/**
		 * Возвращает узел элемента.
		 * @param {String} [viewportId] Айди окна.
		 * @return {Node}
		 */
		getNode: function (viewportId)
		{
			var me = this,
				el = me.el,
				sel = window.getSelection(),
				node = null,
				range;

			if (el.nodes)
			{
				range = sel.rangeCount ? sel.getRangeAt(0) : null;
				viewportId = viewportId || (range ? range.startContainer.viewportId : false);
				node = viewportId && el.nodes[viewportId] ? el.nodes[viewportId] : Ext.Object.getValues(el.nodes)[0];
			}

			return node;
		},

		/**
		 * Возвращает координаты симовла с заданным смещением курсора в тексте.
		 * Координаты отсчитываются относительно окна браузера.
		 * @param {String} [viewportId] Айди окна.
		 * @param {Number} o Смещение курсора в тексте.
		 * @return {Object}
		 * @return {Number} Object.x
		 * @return {Number} Object.y
		 */
		getXY: function (viewportId, o)
		{
			var me = this,
				offset = o,
				el = me.el,
				node = me.getNode(viewportId),
				manager = el.getManager(),
				nodes = {},
				map,
				rect,
				pos;

			pos = {};

			if (el.isText)
			{
				map = el.getMapCoords();
				offset = offset > el.getText().length ? el.getText().length : offset;

				//console.log('map', offset, el, map);

				if (!map)
				{
					// разбиваем текстовый узел на отдельные символы обернутые в span

					nodes.chars = [];

					// временный фрагмент
					nodes.fragment = document.createDocumentFragment();

					nodes.wrap = document.createElement('span');

					for (var i = 0; i < el.text.length; i++)
					{
						nodes.span = document.createElement('span');
						nodes.t = document.createTextNode(el.text[i]);
						nodes.span.appendChild(nodes.t);
						nodes.wrap.appendChild(nodes.span);

						// добавляем символ в список
						nodes.chars.push(nodes.span);
					}

					nodes.fragment.appendChild(nodes.wrap);

					manager.setSuspendEvent(true);

					// вставляем фрагмент в текущее окно редактора

					nodes.parent = node.parentNode;
					nodes.parent.insertBefore(nodes.fragment, node);
					node.nodeValue = '';

					// инициализируем карту смещений символов для текстового узла
					map = [];

					for (i = 0; i < el.text.length; i++)
					{
						nodes.cur = nodes.chars[i];
						rect = nodes.cur.getBoundingClientRect();
						pos = {
							x: rect.left + Math.round((rect.right - rect.left) / 2),
							y: rect.top,
							w: rect.right - rect.left,
							h: rect.bottom - rect.top
						};

						// сохраняем позицию символа в карте смещений
						map.push(pos);

						// новая карта координат символов
						el.setMapCoords(map);
					}

					// смещение последнего символа
					nodes.cur = nodes.wrap.lastChild;
					rect = nodes.cur.getBoundingClientRect();
					pos = {
						x: rect.right,
						y: rect.top,
						w: rect.right - rect.left,
						h: rect.bottom - rect.top
					};
					map.push(pos);

					// удаляем фрагмент
					nodes.parent.removeChild(nodes.wrap);

					// восстанавливаем текстовый узел
					node.nodeValue = el.convertSpaces(el.text);

					manager.setSuspendEvent(false);
				}

				// координаты символа
				pos = map[offset];
			}
			else
			{
				rect = node.firstChild && node.firstChild.getBoundingClientRect ?
				       node.firstChild.getBoundingClientRect() : node.getBoundingClientRect();
				pos = {
					x: rect.left,
					y: rect.top,
					w: rect.right - rect.left,
					h: rect.bottom - rect.top
				}
			}

			return pos;
		},

		/**
		 * Устанавливает текст в узлах отображения текстового элемента.
		 * @param {string} text Текст.
		 */
		setNodeValue: function (text)
		{
			var me = this,
				el = me.el;

			if (el.isText)
			{
				Ext.Object.each(
					el.nodes,
					function (viewportId, node)
					{
						node.nodeValue = text;
					}
				);
			}
		},

		/**
		 * Разбивает все текстовые элементы узла на отдельные узлы-символы.
		 * @param {String} viewportId Айди окна.
		 */
		splitNode: function (viewportId)
		{
			var me = this,
				el = me.el,
				node = me.getNode(viewportId),
				children = el.children,
				nodes = {},
				manager = el.getManager();

			if (children.length)
			{
				el.each(
					function (child)
					{
						child.getNodeHelper().splitNode(viewportId);
					}
				);
			}
			else if (el.isText)
			{
				// временный фрагмент
				nodes.fragment = document.createDocumentFragment();

				nodes.wrap = document.createElement('span');

				for (var i = 0; i < el.text.length; i++)
				{
					nodes.span = document.createElement('span');

					// смещение
					nodes.span.setAttribute('data-offset', i);

					// ссылка на элемент
					nodes.span.getTextElement = function ()
					{
						return el;
					};

					nodes.t = document.createTextNode(el.text[i]);
					nodes.span.appendChild(nodes.t);
					nodes.wrap.appendChild(nodes.span);
				}

				// добавляем пустой замыкающий элемент в конец
				nodes.span = document.createElement('span');
				nodes.span.setAttribute('data-offset', i);
				nodes.span.getTextElement = function ()
				{
					return el;
				};
				nodes.t = document.createTextNode(' ');
				nodes.span.appendChild(nodes.t);
				nodes.wrap.appendChild(nodes.span);

				nodes.fragment.appendChild(nodes.wrap);

				manager.setSuspendEvent(true);

				// вставляем фрагмент в текущее окно редактора

				nodes.parent = node.parentNode;

				nodes.parent.insertBefore(nodes.fragment, node);
				node.nodeValue = '';

				manager.setSuspendEvent(false);
			}
		},

		/**
		 * Собирает разбитый элемент обратно.
		 * @param {String} [viewportId] Айди окна.
		 */
		joinNode: function (viewportId)
		{
			var me = this,
				el = me.el,
				node = me.getNode(viewportId),
				children = el.children,
				nodes = {},
				manager = el.getManager();

			if (children.length)
			{
				el.each(
					function (child)
					{
						child.getNodeHelper().joinNode(viewportId);
					}
				);
			}
			else if (el.isText)
			{
				manager.setSuspendEvent(true);

				nodes.parent = node.parentNode;
				nodes.wrap = node.previousSibling;

				// удаляем временный элемент
				nodes.parent.removeChild(nodes.wrap);

				// восстанавливаем текст
				node.nodeValue = el.convertSpaces(el.getText());

				manager.setSuspendEvent(false);
			}
		},

		/**
		 * Прокручивает скролл элемента относительно текущей позиции.
		 * @param {Number} x Прокрутка по оси X.
		 * @param {Number} y Прокрутка по оси Y.
		 * @param {String} [viewportId] Айди окна.
		 */
		scrollBy: function (x, y, viewportId)
		{
			var me = this,
				node;

			node = me.getNode(viewportId);
			node.scrollLeft += x;
			node.scrollTop += y;
		}
	}
);