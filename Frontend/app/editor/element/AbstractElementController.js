/**
 * Класс абстрактного контроллера элемента.
 *
 * @abstract
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.AbstractElementController',
	{
		/**
		 * @property {FBEditor.editor.element.AbstractElement} Элемент контроллера.
		 */
		el: null,

		/**
		 * @param {FBEditor.editor.element.AbstractElement} el Элемент контроллера.
		 */
		constructor: function (el)
		{
			var me = this;

			me.el = el;
		},

		/**
		 * Создаёт новый элемент.
		 * @param {Selection} sel Выделение, которое указывает где необхоидмо создать элемент.
		 */
		onCreateElement: function (sel)
		{
			var me = this,
				cmd,
				name,
				node;

			// получаем узел из выделения и одновременно проверяем элемент по схеме
			node = me.getNodeVerify(sel);

			if (node)
			{
				// если элемент прошел проверку, то создаем его
				name = me.getNameElement();
				cmd = Ext.create('FBEditor.editor.command.' + name + '.CreateCommand', {node: node});
				if (cmd.execute())
				{
					FBEditor.editor.HistoryManager.add(cmd);
				}
			}
		},

		/**
		 * Вставляет новый элемент.
		 * @param {Node} node Узел, после которого необходимо вставить элемент.
		 * @param {Boolean} isEmpty true - создает пустой новый элемент,
		 * false - создает заполненный новый элемент с частью содержимого из текущего элемента.
		 */
		onInsertElement: function (node, isEmpty)
		{
			var cmd,
				name;

			isEmpty = isEmpty || false;
			name = node.getElement().xmlTag;
			if (!isEmpty)
			{
				cmd = Ext.create('FBEditor.editor.command.' + name + '.SplitCommand', {node: node});
			}
			else
			{
				cmd = Ext.create('FBEditor.editor.command.' + name + '.CreateCommand', {prevNode: node});
			}
			if (cmd.execute())
			{
				FBEditor.editor.HistoryManager.add(cmd);
			}
		},

		/**
		 * Разбивает элемент, вставляя новый элемент после текущего.
		 * @param {Node} node Узел элемента.
		 * @param {Boolean} isEmpty true - создает пустой новый элемент,
		 * false - создает заполненный новый элемент с частью содержимого из текущего элемента.
		 */
		onSplitElement: function (node, isEmpty)
		{
			var el,
				sch,
				elements,
				parentEl,
				parentNode,
				pos,
				name;

			isEmpty = isEmpty || false;
			el = node.getElement();
			//console.log('splittable', el.permit.splittable, node);

			// разрешена ли разбивка блока на два
			if (el.permit.splittable)
			{
				sch = FBEditor.editor.Manager.getSchema();
				parentNode = node.parentNode;
				parentEl = parentNode.getElement();
				elements = FBEditor.editor.Manager.getNamesElements(parentEl);
				name = el.xmlTag;
				pos = parentEl.getChildPosition(el);
				elements.splice(pos + 1, 0, name);
				if (sch.verify(parentEl.xmlTag, elements))
				{
					// вставляем новый элемент
					el.fireEvent('insertElement', node, isEmpty);
				}
			}
			else
			{
				// пытаемся разбить родительский элемент до тех пор пока не встретим корневой элемент
				node = node.parentNode;
				if (node.nodeName !== 'MAIN')
				{
					el = node.getElement();
					el.fireEvent('splitElement', node, isEmpty);
				}
			}
		},

		/**
		 * Нажатие кнопки клавиатуры.
		 * @param {Event} e Объект события.
		 */
		onKeyDown: function (e)
		{
			var me = this,
				focusNode,
				el,
				controller;

			e.stopPropagation();
			focusNode = me.getFocusNode(e.target);
			if (focusNode)
			{
				el = focusNode.getElement ? focusNode.getElement() : null;
				controller = el && el.controller ? el.controller : me;
				//console.log('keydown', e);
				switch (e.keyCode)
				{
					case Ext.event.Event.ENTER:
						if (e.shiftKey)
						{
							return controller.onKeyDownShiftEnter(e);
						}
						else if (e.ctrlKey)
						{
							return controller.onKeyDownCtrlEnter(e);
						}

						return controller.onKeyDownEnter(e);

					case Ext.event.Event.DELETE:
						return controller.onKeyDownDelete(e);

					case Ext.event.Event.BACKSPACE:
						return controller.onKeyDownBackspace(e);

					case Ext.event.Event.Z:
						if (e.ctrlKey && e.shiftKey)
						{
							return controller.onKeyDownCtrlShiftZ(e);
						}
						else if (e.ctrlKey)
						{
							return controller.onKeyDownCtrlZ(e);
						}

						return false;
				}
			}
		},

		/**
		 * Комбинация клавиш Shift+Enter разделяет контейнер на две части.
		 * @param {Event} e Событие.
		 * @return {Boolean} false
		 */
		onKeyDownShiftEnter: function (e)
		{
			var me = this,
				node,
				el;

			e.preventDefault();
			node = me.getFocusNode(e.target);
			el = node.getElement ? node.getElement() : null;
			//console.log('shift+enter', node, el);
			el.fireEvent('splitElement', node, false);

			return false;
		},

		/**
		 * Комбинация клавиш Ctrl+Enter вставляет новый блок.
		 * @param {Event} e Событие.
		 * @return {Boolean} false
		 */
		onKeyDownCtrlEnter: function (e)
		{
			var me = this,
				node,
				el;

			e.preventDefault();
			node = me.getFocusNode(e.target);
			el = node.getElement ? node.getElement() : null;
			//console.log('ctrl+enter', node, el);
			el.fireEvent('splitElement', node, true);

			return false;
		},

		onKeyDownEnter: function (e)
		{
			e.preventDefault();

			return false;
		},

		onKeyDownDelete: function (e)
		{
			return true;
		},

		onKeyDownBackspace: function (e)
		{
			return true;
		},

		onKeyDownCtrlZ: function (e)
		{
			e.preventDefault();
			FBEditor.editor.HistoryManager.undo();

			return false;
		},

		onKeyDownCtrlShiftZ: function (e)
		{
			e.preventDefault();
			FBEditor.editor.HistoryManager.redo();

			return false;
		},

		/**
		 * Отпускание кнопки клавиатуры определяет элемент, на котором находится курсор.
		 * @param {Event} e Объект события.
		 */
		onKeyUp: function (e)
		{
			var me = this,
				focusNode,
				el,
				controller;

			e.stopPropagation();
			focusNode = me.getFocusNode(e.target);
			el = focusNode.getElement ? focusNode.getElement() : null;
			if (el)
			{
				FBEditor.editor.Manager.setFocusElement(el);
				controller = el && el.controller ? el.controller : me;
				/*console.log('keyup', e);
				switch (e.keyCode)
				{
					case Ext.event.Event.Z:
						return e.ctrlKey ? true : false;
				}*/
			}

			return false;
		},

		/**
		 * Отпускание кнопки мыши определяет элемент, на котором находится фокус.
		 * @param {Event} e Объект события.
		 */
		onMouseUp: function (e)
		{
			var me = this,
				focusNode,
				focusElement;

			e.stopPropagation();
			focusNode = me.getFocusNode(e.target);
			if (focusNode && focusNode.getElement)
			{
				focusElement = focusNode.getElement();
				//console.log('mouseup: focusNode, focusElement', e, focusNode, focusElement);
				FBEditor.editor.Manager.setFocusElement(focusElement);
			}

			return false;
		},

		/**
		 * Вставка нового узла.
		 * @param {Event} e Объект события.
		 */
		onNodeInserted: function (e)
		{
			var me = this,
				relNode = e.relatedNode,
				node = e.target,
				viewportId = relNode.viewportId,
				newEl,
				nextSibling,
				previousSibling,
				parentEl,
				nextSiblingEl;

			// игнориуруется вставка корневого узла, так как он уже вставлен и
			// игнорируется вставка при включенной заморозке
			if (relNode.firstChild.nodeName !== 'MAIN' && !FBEditor.editor.Manager.suspendEvent)
			{
				console.log('DOMNodeInserted:', Ext.Object.getValues(FBEditor.editor.Manager.content.nodes)[0].innerHTML);
				if (node.nodeType === Node.TEXT_NODE)
				{
					newEl = FBEditor.editor.Factory.createElementText(node.nodeValue);
				}
				else
				{
					newEl = FBEditor.editor.Factory.createElement(node.localName);
				}
				node.viewportId = viewportId;
				newEl.setNode(node);
				nextSibling = node.nextSibling;
				previousSibling = node.previousSibling;
				parentEl = relNode.getElement();
				console.log('new, parent', node, relNode.outerHTML, parentEl.children.length);
				if (nextSibling)
				{
					nextSiblingEl = nextSibling.getElement();
					console.log('insert, nextSibling', nextSibling);
					parentEl.insertBefore(newEl, nextSiblingEl);
				}
				else if (previousSibling)
				{
					parentEl.add(newEl);
					console.log('add, previousSibling', previousSibling);
				}
				else
				{
					//console.log('removeAll', node, node.parentNode);
					console.log('add');
					//parentEl.removeAll();
					parentEl.add(newEl);
				}
				parentEl.sync(viewportId);
				FBEditor.editor.Manager.setFocusElement(newEl);
				e.stopPropagation();
			}
		},

		/**
		 * Удаление узла.
		 * @param {Event} e Объект события.
		 */
		onNodeRemoved: function (e)
		{
			var me = this,
				relNode = e.relatedNode,
				target = e.target,
				viewportId = relNode.viewportId,
				parentEl,
				el;

			// игнориуруется удаление корневого узла, так как он всегда необходим
			if (relNode.firstChild && relNode.firstChild.nodeName !== 'MAIN' && !FBEditor.editor.Manager.suspendEvent)
			{
				console.log('DOMNodeRemoved:', target, relNode.outerHTML);
				parentEl = relNode.getElement();
				el = target.getElement();
				parentEl.remove(el);
				parentEl.sync(viewportId);
				e.stopPropagation();
			}
		},

		/**
		 * Дроп узла.
		 * @param {Event} e Объект события.
		 */
		onDrop: function (e)
		{
			//console.log('drop:', e, me);

			e.preventDefault();
		},

		/**
		 * Вставка.
		 * @param {Event} e Объект события.
		 */
		onPaste: function (e)
		{
			//console.log('drop:', e, me);

			e.preventDefault();
		},

		/**
		 * @protected
		 * Возвращает элемент контроллера.
		 * @return {FBEditor.editor.element.AbstractElement} Элемент контроллера.
		 */
		getElement: function ()
		{
			return this.el;
		},

		/**
		 * @protected
		 * Возвращает имя элемента.
		 * @return {String} Имя элемента.
		 */
		getNameElement: function ()
		{
			var me = this;

			return me.getElement().xmlTag;
		},

		/**
		 * @protected
		 * Проверяет элемент по схеме и возвращает узел в случае успеха.
		 * @param {Selection} sel Выделение.
		 * @return {Node|Boolean} Узел.
		 */
		getNodeVerify: function (sel)
		{
			var me = this,
				els = {},
				nodes = {},
				res,
				sch,
				name,
				range,
				nameElements;

			// получаем узел из выделения
			sel = sel || window.getSelection();
			range = sel.getRangeAt(0);
			nodes.node = range.endContainer.parentNode;
			nodes.parent = nodes.node.parentNode;

			// получаем дочерние имена элементов для проверки по схеме
			nameElements = me.getNameElementsVerify(nodes);

			// проверяем элемент по схеме
			sch = FBEditor.editor.Manager.getSchema();
			els.parent = nodes.parent.getElement();
			name = els.parent.xmlTag;
			res = sch.verify(name, nameElements) ? nodes.node : false;

			return res;
		},

		/**
		 * @protected
		 * Возвращает список имен дочерних элементов.
		 * @param {Object} nodes Данные узла.
		 * @returns {Array} Список имен дочерних элементов.
		 */
		getNameElementsVerify: function (nodes)
		{
			var me = this,
				els = {},
				nameElements,
				name;

			name = me.getNameElement();
			nodes.node = nodes.parent.getElement().xmlTag === name ? nodes.parent : nodes.node;
			nodes.parent = nodes.node.parentNode;
			els.parent = nodes.parent.getElement();
			nameElements = FBEditor.editor.Manager.getNamesElements(els.parent);
			nameElements.unshift(name);

			return nameElements;
		},

		/**
		 * @protected
		 * Возвращает выделенный узел html, на котором установлен фокус.
		 * @param {HTMLElement} target Узел html.
		 * @return {HTMLElement}
		 */
		getFocusNode: function (target)
		{
			var me = this,
				sel = window.getSelection(),
				node = target,
				range;

			range = sel && sel.type !== 'None' ? sel.getRangeAt(0) : null;
			if (range)
			{
				if (sel.type === 'Range')
				{
					node = range.commonAncestorContainer.nodeType === Node.TEXT_NODE ?
					       range.commonAncestorContainer.parentNode : range.commonAncestorContainer;
				}
				else if (sel.type === 'Caret' && node.nodeName !== 'IMG')
				{
					node = range.commonAncestorContainer.nodeType === Node.TEXT_NODE ?
					       range.commonAncestorContainer.parentNode : range.commonAncestorContainer;
				}
			}
			//console.log('sel, range, node', sel, range, node);
			/*if (node.getElement === undefined)
			{
				node = me.getFocusNode(node.parentNode);
			}*/

			return node;
		}
	}
);