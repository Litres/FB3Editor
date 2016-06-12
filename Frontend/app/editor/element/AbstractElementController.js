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
				el,
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
						el = node.getElement();
						me.getHistory(el).add(cmd);
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
				el,
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
					el = sel.getRangeAt(0).startContainer.getElement();
					me.getHistory(el).add(cmd);
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
			var me = this,
				cmd,
				name,
				el;

			isEmpty = isEmpty || false;
			el = node.getElement();
			name = el.getName();

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
				me.getHistory(el).add(cmd);
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
			var me = this,
				factory = FBEditor.editor.Factory,
				els = {},
				nodes = {},
				manager,
				name,
				xml,
				sch,
				pos;

			isEmpty = isEmpty || false;
			nodes.node = node;
			els.node = nodes.node.getElement();

			manager = els.node.getManager();

			// разрешена ли разбивка элемента
			if (els.node.splittable)
			{
				// создаем временную будущую структуру и проверяем ее по схеме

				els.root = els.node.getRoot();

				nodes.parent = nodes.node.parentNode;
				els.parent = nodes.parent.getElement();

				// создаем временный элемент для проверки новой структуры
				name = els.node.getName();
				els.newEl = factory.createElement(name);
				els.newEl.createScaffold();

				pos = els.parent.getChildPosition(els.node) + 1;
				els.parent.children.splice(pos, 0, els.newEl);

				// получаем xml
				xml = els.root.getXml(true);

				// удаляем временный элемент
				els.parent.children.splice(pos, 1);

				sch = manager.getSchema();

				// вызываем проверку по схеме
				sch.validXml(
					{
						xml: xml,
						callback: function (enable)
						{
							if (enable)
							{
								// вставляем новый элемент
								els.node.fireEvent('insertElement', nodes.node, isEmpty);
							}
						},
						scope: me
					}
				);
			}
			else
			{
				// пытаемся разбить родительский элемент до тех пор пока не получится или не встретим корневой элемент

				nodes.node = nodes.node.parentNode;
				els.node = nodes.node.getElement ? nodes.node.getElement() : null;

				if (els.node && !els.node.isRoot)
				{
					els.node.fireEvent('splitElement', nodes.node, isEmpty);
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
				node,
				el,
				controller,
				manager;

			e.stopPropagation();
			node = me.getFocusNode(e.target);
			el = node.getElement ? node.getElement() : null;
			//console.log('keyup', e.target, node);

			if (el)
			{
				manager = el.getManager();
				manager.setFocusElement(el);
				controller = el && el.controller ? el.controller : me;

				return controller.onKeyUpDefault(e);
			}

			return false;
		},

		onKeyUpDefault: function (e)
		{
			//
		},

		/**
		 * Нажатие символьной кнопки клавиатуры.
		 * @param {Event} e Объект события.
		 */
		onKeyPress: function (e)
		{
			//
		},

		onKeyPressDefault: function (e)
		{
			//
		},

		/**
		 * Нажатие кнопки клавиатуры.
		 * @param {Event} e Объект события.
		 */
		onKeyDown: function (e)
		{
			var me = this,
				node,
				el,
				controller;

			e.stopPropagation();
			node = me.getFocusNode(e.target);
			el = node.getElement ? node.getElement() : null;
			//console.log('keydown', e.target, node);

			if (el)
			{
				controller = el && el.controller ? el.controller : me;
				//console.log('keydown', e.keyCode, e);

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

					case Ext.event.Event.LEFT:
						return controller.onKeyDownLeft(e);

					case Ext.event.Event.UP:
						return controller.onKeyDownUp(e);

					case Ext.event.Event.RIGHT:
						return controller.onKeyDownRight(e);

					case Ext.event.Event.DOWN:
						return controller.onKeyDownDown(e);

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
				target = e.target,
				manager,
				keymap,
				el;

			el = target.getElement ? target.getElement() : null;

			if (el)
			{
				// проверяем сочитание нажатых клавиш

				manager = el.getManager();
				keymap = manager.getKeymap();
				keymap.key(e);
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

		onKeyDownLeft: function (e)
		{
			//
		},

		onKeyDownUp: function (e)
		{
			//
		},

		onKeyDownRight: function (e)
		{
			//
		},

		onKeyDownDown: function (e)
		{
			//
		},

		onKeyDownCtrlZ: function (e)
		{
			var me = this;

			e.preventDefault();
			me.getHistory().undo();

			return false;
		},

		onKeyDownCtrlShiftZ: function (e)
		{
			var me = this;

			e.preventDefault();
			me.getHistory().redo();

			return false;
		},

		/**
		 * Нажатие кнопки мыши.
		 * @param {Event} e Объект события.
		 */
		onMouseDown: function (e)
		{
			//
		},

		/**
		 * Отпускание кнопки мыши определяет элемент, на котором находится фокус.
		 * @param {Event} e Объект события.
		 */
		onMouseUp: function (e)
		{
			var me = this,
				manager,
				node,
				el;

			node = me.getFocusNode(e.target);
			el = node.getElement ? node.getElement() : null;
			manager = el ? el.getManager() : null;

			if (manager)
			{
				// фокус на элемент
				manager.setFocusElement(el);
			}
		},

		/**
		 * Вызывается при движении курсора на элементе.
		 * @param {Event} e Объект события.
		 */
		onMouseMove: function (e)
		{
			//
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
				factory = FBEditor.editor.Factory,
				manager,
				newEl,
				nextSibling,
				previousSibling,
				parentEl,
				nextSiblingEl;

			manager = relNode.getElement ? relNode.getElement().getManager() : null;

			// игнориуруется вставка корневого узла, так как он уже вставлен и
			// игнорируется вставка при включенной заморозке
			if (relNode.firstChild.nodeName !== 'MAIN' && manager && !manager.isSuspendEvent())
			{
				e.stopPropagation();

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

				//console.log('new, parent', node, relNode.outerHTML, parentEl.children.length);

				if (nextSibling)
				{
					nextSiblingEl = nextSibling.getElement();
					console.log('new insert, nextSibling', nextSibling);
					parentEl.insertBefore(newEl, nextSiblingEl);
				}
				else if (previousSibling)
				{
					parentEl.add(newEl);
					console.log('new add, previousSibling', previousSibling);
				}
				else
				{
					console.log('new add', parentEl, newEl.elementId, newEl);
					parentEl.add(newEl);
				}

				parentEl.sync(viewportId);
				manager.setFocusElement(newEl);
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
				manager,
				parentEl,
				el;

			// игнориуруется удаление корневого узла, так как он всегда необходим
			if (relNode.firstChild && relNode.firstChild.nodeName !== 'MAIN')
			{
				parentEl = relNode.getElement();
				el = target.getElement();

				manager = el.getManager();

				if (!manager.isSuspendEvent())
				{
					e.stopPropagation();

					console.log('DOMNodeRemoved:', target, relNode.outerHTML);

					parentEl.remove(el);
					parentEl.sync(viewportId);
				}
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
			var me = this,
				el = me.getElement(),
				root;

			e.stopPropagation();

			root = el.getRoot();

			// изменяем данные элементов перед копированием
			root.beforeCopy();
		},

		/**
		 * Копирование.
		 * @param {Event} e Объект события.
		 */
		onCopy: function (e)
		{
			var me = this,
				el = me.getElement(),
				root;

			e.stopPropagation();

			root = el.getRoot();

			Ext.defer(
				function ()
				{
					// изменяем данные элементов после копирования
					root.afterCopy();
				},
				10 // задержка необходима для того, чтобы процесс начинался после копирования
			);
		},

		/**
		 * Удаляет выделенную часть текста.
		 */
		removeNodes: function ()
		{
			var me = this,
				cmd;

			cmd = Ext.create('FBEditor.editor.command.RemoveNodesCommand');

			if (cmd.execute())
			{
				me.getHistory().add(cmd);
			}
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

			return me.getElement().getName();
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
				manager,
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
			manager = els.node.getManager();
			sch = manager.getSchema();
			name = els.parent.getName();
			console.log('name, nameElements', name, nameElements);
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
				manager,
				nameElements,
				name;

			name = me.getNameElement();
			nodes.node = nodes.parent.getElement().xmlTag === name ? nodes.parent : nodes.node;
			nodes.parent = nodes.node.parentNode;
			els.parent = nodes.parent.getElement();
			manager = els.parent.getManager();
			nameElements = manager.getNamesElements(els.parent);
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

			if (range && node.nodeName !== 'IMG')
			{
				node = range.commonAncestorContainer.nodeType === Node.TEXT_NODE ?
				       range.commonAncestorContainer.parentNode : range.commonAncestorContainer;
			}

			return node;
		},

		/**
		 * @protected
		 * Возвращает менеджер истории.
		 * @param {FBEditor.editor.element.AbstractElement} [element] Элемент.
		 * @return {FBEditor.editor.History}
		 */
		getHistory: function (element)
		{
			var me = this,
				el = element || me.getElement(),
				history;

			history = el.getHistory();

			return history;
		}
	}
);