/**
 * Класс абстрактного контроллера элемента.
 *
 * @abstract
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.AbstractElementController',
	{
		requires: [
			'FBEditor.editor.KeyMap'
		],

		/**
		 * @property {FBEditor.editor.element.AbstractElement} Элемент контроллера.
		 */
		el: null,

		/**
		 * @property {Boolean} Может ли элемент быть создан из выделения.
		 */
		createFromRange: false,

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
		 * @param [opts] Дополнительные данные.
		 * @param {Object} opts.range Данные выделения.
		 */
		onCreateElement: function (sel, opts)
		{
			var me = this,
				cmd,
				name,
				node;

			if (sel && !sel.getRangeAt(0).collapsed && me.createFromRange)
			{
				// создаем элемент из выделения
				me.createRangeElement(sel, opts);
			}
			else
			{
				// получаем узел из выделения и одновременно проверяем элемент по схеме
				node = me.getNodeVerify(sel, opts);

				if (node)
				{
					// если элемент прошел проверку, то создаем его
					name = me.getNameElement();
					cmd = Ext.create('FBEditor.editor.command.' + name + '.CreateCommand',
					                 {node: node, sel: sel, opts: opts});

					if (cmd.execute())
					{
						FBEditor.editor.HistoryManager.add(cmd);
					}
				}
			}
		},

		/**
		 * Создаёт элемент из выделения.
		 * @param {Selection} sel Выделение, которое указывает где необхоидмо создать элемент.
		 * @param {Object} opts Дополнительные данные.
		 */
		createRangeElement: function (sel, opts)
		{
			var me = this,
				name,
				cmd;

			// проверяем элемент по схеме
			if (me.checkRangeVerify(sel))
			{
				// если элемент прошел проверку, то создаем его
				name = me.getNameElement();
				cmd = Ext.create('FBEditor.editor.command.' + name + '.CreateRangeCommand', {sel: sel, opts: opts});
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
			var manager = FBEditor.editor.Manager,
				el,
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
				sch = manager.getSchema();
				parentNode = node.parentNode;
				parentEl = parentNode.getElement();
				elements = manager.getNamesElements(parentEl);
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
				if (node && node.getElement && !node.getElement().isRoot)
				{
					el = node.getElement();
					el.fireEvent('splitElement', node, isEmpty);
				}
			}
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
			//console.log('keyup', e.target, focusNode);
			el = focusNode.getElement ? focusNode.getElement() : null;
			if (el)
			{
				FBEditor.editor.Manager.setFocusElement(el);
				controller = el && el.controller ? el.controller : me;

				return controller.onKeyUpDefault(e);

				/*console.log('keyup', e);
				 switch (e.keyCode)
				 {
				 case Ext.event.Event.Z:
				 return e.ctrlKey ? true : false;
				 }*/
			}

			return false;
		},

		onKeyUpDefault: function (e)
		{
			var me = this;

			//console.log('onKeyUpDefault', e);
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
			//console.log('keydown', e.target, focusNode);
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

					default:
						return controller.onKeyDownDefault(e);
				}
			}
		},

		onKeyDownDefault: function (e)
		{
			var me = this,
				keymap = FBEditor.editor.KeyMap;

			keymap.key(e);
			//e.preventDefault();
			//console.log('onKeyDownDefault', me.getElement());
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
			var me = this;

			e.preventDefault();
			me.removeNodes();
		},

		onKeyDownBackspace: function (e)
		{
			var me = this;

			e.preventDefault();
			me.removeNodes();
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
		 * Нажатие кнопки мыши.
		 * @param {Event} e Объект события.
		 */
		onMouseDown: function (e)
		{
			var manager = FBEditor.editor.Manager,
				viewportId;

			e.stopPropagation();

			// снимаем выделение с элементов
			viewportId = e.target.viewportId;
			manager.clearSelectNodes(viewportId);
		},

		/**
		 * Отпускание кнопки мыши определяет элемент, на котором находится фокус.
		 * @param {Event} e Объект события.
		 */
		onMouseUp: function (e)
		{
			var me = this,
				bridgeNav = FBEditor.getBridgeNavigation(),
				manager = FBEditor.editor.Manager,
				focusNode,
				focusElement,
				viewportId;

			e.stopPropagation();
			focusNode = me.getFocusNode(e.target);

			if (focusNode && focusNode.getElement)
			{
				viewportId = focusNode.viewportId;
				focusElement = focusNode.getElement();

				// фокус на элементе
				manager.setFocusElement(focusNode);

				// разворачиваем узел элемента в дереве навигации по тексту
				bridgeNav.Ext.getCmp('panel-body-navigation').expandElement(focusElement);

				// проверяем есть лы выделенные элементы
				manager.checkSelectNodes(viewportId);
			}
		},

		/**
		 * Вызывается при движении курсора на элементе.
		 * @param {Event} e Объект события.
		 */
		onMouseMove: function (e)
		{
			var me = this,
				el = me.el,
				selection = el.selection;

			if (selection && e.which == 1)
			{
				e.stopPropagation();

				// обрабатываем выделение
				selection.execute();
			}
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
				manager = FBEditor.editor.Manager,
				factory = FBEditor.editor.Factory,
				newEl,
				nextSibling,
				previousSibling,
				parentEl,
				nextSiblingEl;

			// игнориуруется вставка корневого узла, так как он уже вставлен и
			// игнорируется вставка при включенной заморозке
			if (relNode.firstChild.nodeName !== 'MAIN' && !manager.suspendEvent)
			{
				console.log('DOMNodeInserted:', Ext.Object.getValues(manager.content.nodes)[0].innerHTML);
				if (node.nodeType === Node.TEXT_NODE)
				{
					newEl = factory.createElementText(node.nodeValue);
				}
				else
				{
					newEl = factory.createElement(node.localName);
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
				manager.setFocusElement(newEl);

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
			//console.log('paste:', this.getElement(), e.target, clipboard.getData('text'));
			e.preventDefault();
			e.stopPropagation();
		},

		/**
		 * Перед копированием.
		 * @param {Event} e Объект события.
		 */
		onBeforeCopy: function (e)
		{
			//console.log('beforecopy', this.getElement());
			//e.preventDefault();
			e.stopPropagation();

			// изменяем данные элементов перед копированием
			FBEditor.editor.Manager.getContent().beforeCopy();
		},

		/**
		 * Копирование.
		 * @param {Event} e Объект события.
		 */
		onCopy: function (e)
		{
			//console.log('copy', this.getElement());
			//e.preventDefault();
			e.stopPropagation();

			Ext.defer(
				function ()
				{
					// изменяем данные элементов после копирования
					FBEditor.editor.Manager.getContent().afterCopy();
				},
				10
			);
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
		 * @param {Object} [opts] Дополнительные данные.
		 * @return {Node|Boolean} Узел.
		 */
		getNodeVerify: function (sel, opts)
		{
			var me = this,
				els = {},
				nodes = {},
				manager = FBEditor.editor.Manager,
				res,
				sch,
				name,
				range,
				nameElements;

			// получаем узел из выделения
			sel = sel || window.getSelection();
			range = sel.getRangeAt(0);

			nodes.node = range.endContainer;
			els.node = nodes.node.getElement();

			nodes.node = els.node.isText || els.node.hisName(manager.emptyElement) ? nodes.node.parentNode : nodes.node;
			els.node = nodes.node.getElement();

			nodes.parent = nodes.node.parentNode;
			els.parent = nodes.parent.getElement();

			// получаем дочерние имена элементов для проверки по схеме
			nameElements = me.getNameElementsVerify(nodes);

			// проверяем элемент по схеме
			sch = manager.getSchema();
			name = els.parent.getName();
			//console.log('name, nameElements', name, nameElements);
			res = sch.verify(name, nameElements) ? nodes.node : false;

			return res;
		},

		/**
		 * @protected
		 * Возвращает список имен дочерних элементов.
		 * @param {Object} nodes Данные узла.
		 * @return {Array} Список имен дочерних элементов.
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
		 * Возвращает выделенный узел, на котором установлен фокус.
		 * @param {Node} target Узел.
		 * @return {Node} Активный узел.
		 */
		getFocusNode: function (target)
		{
			var me = this,
				sel = window.getSelection(),
				node = target,
				range;

			range = sel && sel.rangeCount ? sel.getRangeAt(0) : null;
			//console.log('node', node);
			if (range && node.nodeName !== 'IMG'/* || range && node.nodeName === 'IMG' && !range.collapsed*/)
			{
				node = range.commonAncestorContainer.nodeType === Node.TEXT_NODE ?
				       range.commonAncestorContainer.parentNode : range.commonAncestorContainer;
			}
			//console.log('sel, range, node', sel, range, node);
			/*if (node.getElement === undefined)
			{
				node = me.getFocusNode(node.parentNode);
			}*/

			return node;
		},

		/**
		 * Удаляет выделенную часть текста.
		 */
		removeNodes: function ()
		{
			var cmd;

			cmd = Ext.create('FBEditor.editor.command.RemoveNodesCommand');
			if (cmd.execute())
			{
				FBEditor.editor.HistoryManager.add(cmd);
			}
		}

		/**
		 * Проверяет получаемую схему.
		 * @param {String} xml Строка xml, новой проверяемой структуры.
		 * @return {Boolean}
		 */
		/*verify: function (xml, debug)
		{
			var manager = FBEditor.editor.Manager,
				sch = manager.getSchema(),
				res;

			res = sch.validXml(xml, debug);

			return res;
		}*/
	}
);