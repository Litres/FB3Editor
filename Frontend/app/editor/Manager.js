/**
 * Менеджер редактора тела книги.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.Manager',
	{
		singleton: 'true',
		requires: [
			'FBEditor.editor.schema.Schema',
			'FBEditor.editor.Factory',
			'FBEditor.editor.HistoryManager'
		],

		/**
		 * @property {FBEditor.editor.schema.Schema} Правила проверки элементов.
		 */
		schema: null,

		/**
		 * @property {FBEditor.editor.element.AbstractElement} Корневой элемент тела книги.
		 */
		content: null,

		/**
		 * @property {Selection} Текущее выделение в теле книги.
		 */
		selection: null,

		/**
		 * @property {Boolean} Заморозить ли события вставки узлов.
		 */
		suspendEvent: false,

		/**
		 * @property {String} Имя пустого элемента.
		 */
		emptyElement: 'br',

		/**
		 * @private
		 * @property {FBEditor.editor.element.AbstractElement} Текущий выделенный элемент в редакторе.
		 */
		focusElement: null,

		/**
		 * Инициализирует менеджер.
		 */
		init: function ()
		{
			var me = this;

			me.schema = Ext.create('FBEditor.editor.schema.Schema');
		},

		/**
		 * Создает контент из загруженной книги.
		 * @param {String} content Исходный объект тела книги в виде строки, которую необходимо преобразовать
		 * в настоящий объект.
		 */
		createContent: function (content)
		{
			var me = this,
				ce,
				ct;

			// сокращенные формы методов создания элементов
			ce = function (el, attr, ch)
			{
				return FBEditor.editor.Factory.createElement(el, attr, ch);
			};
			ct = function (text)
			{
				return FBEditor.editor.Factory.createElementText(text);
			};

			content = content.replace(/\s+/g, ' ');
			content = content.replace(/\), ?]/g, ')]');
			//console.log(content);

			// преобразование строки в объект
			eval('me.content = ' + content);

			// сбрасываем историю
			FBEditor.editor.HistoryManager.clear();

			// загружаем контент
			Ext.getCmp('main-editor').fireEvent('loadData');
		},

		/**
		 * Возвращает html тела книги.
		 * @return {HTMLElement}
		 */
		getNode: function (viewportId)
		{
			var me = this,
				content = me.content,
				node;

			FBEditor.editor.Manager.suspendEvent = true;
			node = content.getNode(viewportId);
			FBEditor.editor.Manager.suspendEvent = false;

			return node;
		},

		/**
		 * Возвращает xml тела книги.
		 * @return {String} Строка xml.
		 */
		getXml: function ()
		{
			var me = this,
				content = me.content,
				xml;

			xml = content.getXml();
			xml = '<?xml version="1.0" encoding="UTF-8"?>' + xml;
			console.log(xml);

			return xml;
		},

		/**
		 * Создает корневой элемент.
		 * @return {FBEditor.editor.element.AbstractElement} Корневой элемент.
		 */
		createRootElement: function ()
		{
			var me = this,
				root;

			root = FBEditor.editor.Factory.createElement('fb3-body');
			me.content = root;

			return root;
		},

		/**
		 * Устанавливает текущий выделенный элемент в редакторе.
		 * @param {FBEditor.editor.element.AbstractElement} el
		 * @param {Selection} sel
		 */
		setFocusElement: function (el, sel)
		{
			var me = this,
				bridgeProps = FBEditor.getBridgeProps(),
				data;

			me.focusElement = el;
			me.selection = sel || window.getSelection();

			// показываем информацию о выделенном элементе
			data = el.getData();
			bridgeProps.Ext.getCmp('panel-props-body').fireEvent('loadData', data);
		},

		/**
		 * Возвращает текущий выделенный элемент в редакторе.
		 * @return {FBEditor.editor.element.AbstractElement}
		 */
		getFocusElement: function ()
		{
			return this.focusElement;
		},

		/**
		 * Удаляет все ссылки на узлы для конкретного окна.
		 * @param {String} viewportId Id окна.
		 */
		removeNodes: function (viewportId)
		{
			var me = this,
				rootEl = me.content;

			rootEl.removeNodes(viewportId);
		},

		/**
		 * Создает новый элемент в теле книги.
		 * @param {String} name Имя элемента.
		 */
		createElement: function (name)
		{
			var me = this,
				el,
				sel;

			sel = me.getSelection();
			if (sel)
			{
				el = FBEditor.editor.Factory.createElement(name);
				el.fireEvent('createElement', sel);
			}
		},

		/**
		 * Возвращает текущее выделение в теле книги.
		 * @return {Selection} Текущее выделение в теле книги.
		 */
		getSelection: function ()
		{
			return this.selection;
		},

		/**
		 * Возвращает правила проверки элементов.
		 * @return {FBEditor.editor.schema.Schema}
		 */
		getSchema: function ()
		{
			return this.schema;
		},

		/**
		 * Возвращает список имен дочерних элементов.
		 * @param {FBEditor.editor.element.AbstractElement} el Элемент.
		 * @return {Array} Имена дочерних элементов.
		 */
		getNamesElements: function (el)
		{
			var els = [];

			Ext.Array.each(
				el.children,
			    function (item)
			    {
				    if (!item.isText)
				    {
					    els.push(item.xmlTag);
				    }
			    }
			);

			return els;
		},

		/**
		 * Возвращает пустой элемент, для заполнения элементов без содержимого.
		 * @return {FBEditor.editor.element.AbstractElement} Пустой элемент.
		 */
		createEmptyElement: function ()
		{
			var me= this,
				el;

			el = FBEditor.editor.Factory.createElement(me.emptyElement);

			return el;
		},

		/**
		 * Разбивает узел на два.
		 * @param els Элементы.
		 * @param els.common Верхний родительский элемент,
		 * отсносительно которого происходит разбивка текущего узла.
		 * @param {Object} nodes Узлы.
		 * @param {Number} offset Смещение курсора относительно текущего узла.
		 * @return {Node} Новый узел, получившийся в результате разбивки.
		 */
		splitNode: function (els, nodes, offset)
		{
			var me = this,
				viewportId;

			nodes.parentContainer = nodes.container.parentNode;
			viewportId = nodes.parentContainer.viewportId;
			els.parentContainer = nodes.parentContainer.getElement();
			els.container = nodes.container.getElement();

			while (els.parentContainer.elementId !== els.common.elementId)
			{
				nodes.next = nodes.parentContainer.nextSibling;
				nodes.parent = nodes.parentContainer.parentNode;
				els.parent = nodes.parent.getElement();
				nodes.nextContainer = nodes.container.nextSibling;

				// клонируем узел
				els.cloneContainer = els.parentContainer.clone({ignoredDeep: true});

				if (els.container.isText)
				{
					// часть текста после курсора
					els.endTextValue = nodes.container.nodeValue.substring(offset);

					// часть текста перед курсором
					els.startTextValue = nodes.container.nodeValue.substring(0, offset);

					if (!els.startTextValue)
					{
						if (!nodes.parentContainer.previousSibling)
						{
							// вставляем пустое содержимое вместо текущего узла
							els.empty = me.createEmptyElement();
							els.parentContainer.replace(els.empty, els.container);
							nodes.parentContainer.replaceChild(els.empty.getNode(viewportId), nodes.container);
						}
						else
						{
							// удаляем пустой текущий узел
							els.parentContainer.remove(els.container);
							nodes.parentContainer.removeChild(nodes.container);
						}
					}
					else
					{
						// изменяем текст текущего узла
						nodes.container.nodeValue = els.startTextValue;
						els.container.setText(els.startTextValue);
					}

					if (els.endTextValue.trim())
					{
						// добавляем текст
						els.t = FBEditor.editor.Factory.createElementText(els.endTextValue);
						els.cloneContainer.add(els.t);
					}

					nodes.cloneContainer = els.cloneContainer.getNode(viewportId);

					if (nodes.next)
					{
						els.next = nodes.next.getElement();
						els.parent.insertBefore(els.cloneContainer, els.next);
						nodes.parent.insertBefore(nodes.cloneContainer, nodes.next);
					}
					else
					{
						els.parent.add(els.cloneContainer);
						nodes.parent.appendChild(nodes.cloneContainer);
					}
				}
				else
				{
					nodes.cloneContainer = els.cloneContainer.getNode(viewportId);

					if (nodes.next)
					{
						els.next = nodes.next.getElement();
						els.parent.insertBefore(els.cloneContainer, els.next);
						nodes.parent.insertBefore(nodes.cloneContainer, nodes.next);
					}
					else
					{
						els.parent.add(els.cloneContainer);
						nodes.parent.appendChild(nodes.cloneContainer);
					}

					if (nodes.container.firstChild)
					{
						// если элемент не пустой, то переносим его в клонированный элемент
						els.cloneContainer.add(els.container);
						nodes.cloneContainer.appendChild(nodes.container);
					}
					else
					{
						// или просто удаляем
						nodes.parentContainer.removeChild(nodes.container);
					}
					els.parentContainer.remove(els.container);
				}

				// переносим все узлы после курсора
				nodes.parent = nodes.cloneContainer;
				els.parent = nodes.parent.getElement();
				while (nodes.nextContainer)
				{
					els.nextContainer = nodes.nextContainer.getElement();
					nodes.buf = nodes.nextContainer.nextSibling;

					els.parent.add(els.nextContainer);
					nodes.parent.appendChild(nodes.nextContainer);
					els.parentContainer.remove(els.nextContainer);

					nodes.nextContainer = nodes.buf;
				}

				if (!nodes.parent.firstChild && els.parent.xmlTag === 'p' && !nodes.parent.nextSibling)
				{
					// добавляем пустое содержимое в параграф
					els.empty = me.createEmptyElement();
					els.parent.add(els.empty);
					nodes.parent.appendChild(els.empty.getNode(viewportId));
				}

				// переносим указатель
				nodes.container = nodes.cloneContainer;
				els.container = nodes.container.getElement();

				nodes.parentContainer = nodes.container.parentNode;
				els.parentContainer = nodes.parentContainer.getElement();

			}

			return nodes.container;
		},

		/**
		 * Соединяет переданный узел с предыдущим узлом.
		 * @param {Node} node Узел, который необходимо объединить с предыдущим.
		 */
		joinNode: function (node)
		{
			var me = this,
				nodes = {},
				els = {};

			nodes.node = node;
			els.node = node.getElement();
			nodes.prev = node.previousSibling;
			els.prev = nodes.prev.getElement();

			// переносим все элементы в предыдущий узел
			nodes.first = nodes.node.firstChild;
			els.first = nodes.first ? nodes.first.getElement() : null;
			nodes.prevLast = nodes.prev;
			els.prevLast = els.prev;
			nodes.last = nodes.prevLast.lastChild;
			els.last = nodes.last ? nodes.last.getElement() : null;
			//console.log('join nodes, els', nodes, els);
			while (els.first)
			{
				nodes.firstChild = nodes.first.firstChild;
				nodes.next = nodes.first;
				//console.log('nodes.first, nodes.last, nodes.prevLast', nodes.first, nodes.last, nodes.prevLast);
				while (nodes.next)
				{
					nodes.buf = nodes.next.nextSibling;
					els.next = nodes.next.getElement();
					if (els.last && els.last.isText && els.next.isText)
					{
						// объединяем текстовые узлы
						els.nodeValue = nodes.last.nodeValue + nodes.next.nodeValue;
						nodes.last.nodeValue = els.nodeValue;
						els.last.setText(els.nodeValue);
					}
					else
					{
						// переносим узел
						els.prevLast.add(els.next);
						nodes.next.parentNode.getElement().remove(els.next);
						nodes.prevLast.appendChild(nodes.next);
					}
					nodes.next = nodes.buf;
				}

				if (els.last.isText)
				{
					// удаляем узел
					nodes.first.parentNode.getElement().remove(els.first);
					nodes.first.parentNode.removeChild(nodes.first);
				}

				if (nodes.prevLast.firstChild.getElement().xmlTag === me.emptyElement)
				{
					// удаляем пустой узел
					els.prevLast.remove(nodes.prevLast.firstChild.getElement());
					nodes.prevLast.removeChild(nodes.prevLast.firstChild);
				}

				nodes.first = nodes.firstChild;
				els.first = nodes.first ? nodes.first.getElement() : null;
				nodes.prevLast = nodes.last;
				els.prevLast = els.last;
				nodes.last = nodes.prevLast.lastChild;
				els.last = nodes.last ? nodes.last.getElement() : null;
			}

			// удаляем узел
			nodes.node.parentNode.getElement().remove(els.node);
			nodes.node.parentNode.removeChild(nodes.node);
		}
	}
);