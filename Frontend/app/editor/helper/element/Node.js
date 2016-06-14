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
				node;

			node = viewportId ? el.nodes[viewportId] : Ext.Object.getValues(el.nodes)[0];

			return node;
		},

		/**
		 * Возвращает координаты симовла с заданным смещением курсора в тексте.
		 * Координаты относительно окна браузера.
		 * @param {String} viewportId Айди окна.
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
				els = {},
				nodes = {},
				rect,
				pos;

			pos = {};

			if (el.isText)
			{
				// разбиваем текстовый узел на отдельные символы обернутые в span

				offset = offset > el.text.length ? el.text.length : offset;

				// временный фрагмент
				nodes.fragment = document.createDocumentFragment();

				nodes.wrap = document.createElement('span');

				for (var i = 0; i < el.text.length; i++)
				{
					nodes.span = document.createElement('span');
					nodes.t = document.createTextNode(el.text[i]);
					nodes.span.appendChild(nodes.t);

					if (i === offset)
					{
						// символ с искомым смещением
						nodes.cur = nodes.span;
					}

					nodes.wrap.appendChild(nodes.span);
				}

				nodes.fragment.appendChild(nodes.wrap);

				manager.setSuspendEvent(true);

				// вставляем фрагмент в текущее окно редактора

				nodes.parent = node.parentNode;

				nodes.parent.insertBefore(nodes.fragment, node);
				node.nodeValue = '';

				if (offset === el.text.length)
				{
					// смещение в конце текстового узла

					nodes.cur = nodes.wrap.lastChild;
					rect = nodes.cur.getBoundingClientRect();
					pos = {
						x: rect.right,
						y: rect.top
					};

				}
				else
				{
					rect = nodes.cur.getBoundingClientRect();
					pos = {
						x: rect.left,
						y: rect.top
					};
				}

				// удаляем фрагмент
				nodes.parent.removeChild(nodes.wrap);

				// восстанавливаем текстовый узел
				node.nodeValue = el.text;

				manager.setSuspendEvent(false);

			}
			else
			{
				rect = node.firstChild && node.firstChild.getBoundingClientRect ?
				       node.firstChild.getBoundingClientRect() : node.getBoundingClientRect();
				pos = {
					x: rect.left,
					y: rect.top
				}
			}

			return pos;
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
		 * @param {String} viewportId Айди окна.
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
				node.nodeValue = el.text;

				manager.setSuspendEvent(false);
			}
		}
	}
);