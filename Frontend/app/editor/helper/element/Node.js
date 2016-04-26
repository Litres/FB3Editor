/**
 * Хэлпер для работы с отображением элемента.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.helper.element.Node',
	{
		statics: {
			/**
			 * @const {String} Название для CSS-класса символа в разбитом элементе.
			 */
			splitedCharCls: 'mode-splitedChar'
		},

		/**
		 * @private
		 * @property {FBEditor.editor.element.AbstractElement} Элемент.
		 */
		el: null,

		/**
		 * @private
		 * @property {Boolean} Ссылка на разбитый на символы элемент.
		 */
		splitedNode: null,

		/**
		 * @private
		 * @property {String} CSS-свойство display.
		 */
		displayStyle: '',

		constructor: function (el)
		{
			var me = this;

			me.el = el;
		},

		/**
		 * Разбивает элемент на символы
		 * @param {String} viewportId Айди окна отобржаения.
		 * @param {Node} [parentNode] Родительский узел.
		 */
		splitChars: function (viewportId, parentNode)
		{
			var me = this,
				el = me.el,
				srcNode = el.nodes[viewportId],
				node,
				fragment,
				style;

			// родительский узел
			node = parentNode ? parentNode : srcNode.cloneNode(false);
			node.viewportId = viewportId;

			node.getElement = function ()
			{
				return el;
			};

			// перебираем всех потомков
			el.each(
				function (child)
				{
					var nodeHelper,
						childNode,
						text;

					if (child.isText)
					{
						// текстовый узел разбиваем на символы

						text = child.getText();

						for (var i = 0; i < text.length; i++)
						{
							// создаем символ

							childNode = document.createElement('span');
							childNode.setAttribute('class', me.self.splitedCharCls);
							childNode.setAttribute('data-pos', i + 1);
							childNode.viewportId = viewportId;

							childNode.getElement = function ()
							{
								return child;
							};

							childNode.appendChild(document.createTextNode(text[i]));
							node.appendChild(childNode);
						}
					}
					else
					{
						// клонируем дочерний узел
						childNode = child.nodes[viewportId].cloneNode(false);

						node.appendChild(childNode);

						if (child.children.length)
						{
							nodeHelper = child.getNodeHelper();
							nodeHelper.splitChars(viewportId, childNode);
						}
					}
				}
			);

			if (!parentNode)
			{
				// создаем фрагмент
				fragment = document.createDocumentFragment();
				fragment.appendChild(node);

				// стили элемента
				style = window.getComputedStyle(srcNode);

				// сохраняем свойство display
				me.displayStyle = style.display;

				// прячем реальный элемент
				srcNode.style.display = 'none';

				// показываем разбитый элемент
				srcNode.parentNode.insertBefore(fragment, srcNode);

				// сохраняем ссылку на разбитый элемент
				me.splitedNode = node;
			}
		},

		/**
		 * Отменяет разбивку элемента на символы.
		 * @param {String} viewportId Айди окна отобржаения.
		 */
		unsplitChars: function (viewportId)
		{
			var me = this,
				el = me.el,
				srcNode;

			srcNode = el.nodes[viewportId];

			// удаляем разбитый элемент
			me.splitedNode.parentNode.removeChild(me.splitedNode);
			me.splitedNode = null;

			// показываем реальный элемент
			srcNode.style.display = me.displayStyle;
		},

		/**
		 * Разбит ли элемент на символы.
		 * @return {Boolean}
		 */
		isSplitedChars: function ()
		{
			return this.splitedNode ? true: false;
		}
	}
);