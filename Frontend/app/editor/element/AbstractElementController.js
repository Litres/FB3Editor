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
			this.el = el;
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
				nodes = {},
				els = {},
				isCreateRange,
				cmd,
				name;

			//console.log('sel', sel);

			// фокусный элемент
			nodes.focus = sel ? sel.focusNode : null;
			els.focus = nodes.focus ? nodes.focus.getElement() : null;

			// создавать ли элемент из выделения
			isCreateRange = els.focus && me.createFromRange && (!sel.getRangeAt(0).collapsed || els.focus.isImg);

			if (isCreateRange)
			{
				// создаем элемент из выделения
				me.createRangeElement(sel, opts);
			}
			else
			{
				//console.log(sel, opts);
				// получаем узел из выделения и одновременно проверяем элемент по схеме
				nodes.node = me.getNodeVerify(sel, opts);

				if (nodes.node)
				{
					// если элемент прошел проверку, то создаем его
					name = me.getNameElement();
					cmd = Ext.create('FBEditor.editor.command.' + name + '.CreateCommand',
					                 {node: nodes.node, sel: sel, opts: opts});

					if (cmd.execute())
					{
						els.el = nodes.node.getElement();
						me.getHistory(els.el).add(cmd);
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
				nodes = {},
				els = {},
				commandName,
				name,
				cmd;

			opts = opts || {};

			// проверяем элемент по схеме
			if (me.checkRangeVerify(sel))
			{
				// если элемент прошел проверку, то создаем его

				// фокусный элемент
				nodes.focus = sel ? sel.focusNode : null;
				els.focus = nodes.focus ? nodes.focus.getElement() : null;
				opts.focus = nodes.focus;

				// название команды
				name = me.getNameElement();
				commandName = els.focus.isImg ? 'CreateRangeObjectCommand' : 'CreateRangeCommand';
				commandName = 'FBEditor.editor.command.' + name + '.' + commandName;

				// создаем команду
				cmd = Ext.create(commandName, {sel: sel, opts: opts});

				if (cmd.execute())
				{
					els.el = sel.getRangeAt(0).startContainer.getElement();
					me.getHistory(els.el).add(cmd);
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
				els.node.fireEvent('insertElement', nodes.node, isEmpty);
				
				/*
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
				
				console.log('onSplitElement', xml);

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
				*/
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
				//manager.setFocusElement(node, null, true);
				controller = el && el.controller ? el.controller : me;

				switch (e.keyCode)
				{
					case Ext.event.Event.LEFT:
						if (e.shiftKey && e.ctrlKey)
						{
							return controller.onKeyUpShiftCtrlLeft(e);
						}
						else if (e.shiftKey)
						{
							return controller.onKeyUpShiftLeft(e);
						}
						
						return controller.onKeyUpLeft(e);
						
					case Ext.event.Event.UP:
						if (e.shiftKey)
						{
							return controller.onKeyUpShiftUp(e);
						}
						
						return controller.onKeyUpUp(e);
					
					case Ext.event.Event.RIGHT:
						if (e.shiftKey && e.ctrlKey)
						{
							return controller.onKeyUpShiftCtrlRight(e);
						}
						else if (e.shiftKey)
						{
							return controller.onKeyUpShiftRight(e);
						}
						
						return controller.onKeyUpRight(e);
					
					case Ext.event.Event.DOWN:
						if (e.shiftKey)
						{
							return controller.onKeyUpShiftDown(e);
						}
						
						return controller.onKeyUpDown(e);
					
					case Ext.event.Event.A:
						if (e.ctrlKey)
						{
							return controller.onKeyUpCtrlA(e);
						}
						
						return false;
					
					case Ext.event.Event.HOME:
						if (e.shiftKey && e.ctrlKey)
						{
							return controller.onKeyUpShiftCtrlHome(e);
						}
						else if (e.ctrlKey)
						{
							return controller.onKeyUpCtrlHome(e);
						}
						
						return false;
					
					case Ext.event.Event.END:
						if (e.shiftKey && e.ctrlKey)
						{
							return controller.onKeyUpShiftCtrlEnd(e);
						}
						else if (e.ctrlKey)
						{
							return controller.onKeyUpCtrlEnd(e);
						}
						
						return false;

					default:
						return controller.onKeyUpDefault(e);
				}
			}

			return false;
		},

		onKeyUpDefault: function (e)
		{
			//
		},
		
		onKeyUpLeft: function (e)
		{
			this.syncButtonsAfterSelectionKeys();
		},
		
		onKeyUpShiftCtrlLeft: function (e)
		{
			this.syncButtonsAfterSelectionKeys();
		},
		
		onKeyUpShiftLeft: function (e)
		{
			this.syncButtonsAfterSelectionKeys();
		},

		onKeyUpUp: function (e)
		{
			this.syncButtonsAfterSelectionKeys();
		},
		
		onKeyUpShiftUp: function (e)
		{
			this.syncButtonsAfterSelectionKeys();
		},
		
		onKeyUpRight: function (e)
		{
			this.syncButtonsAfterSelectionKeys();
		},
		
		onKeyUpShiftCtrlRight: function (e)
		{
			this.syncButtonsAfterSelectionKeys();
		},
		
		onKeyUpShiftRight: function (e)
		{
			this.syncButtonsAfterSelectionKeys();
		},

		onKeyUpDown: function (e)
		{
			this.syncButtonsAfterSelectionKeys();
		},
		
		onKeyUpShiftDown: function (e)
		{
			this.syncButtonsAfterSelectionKeys();
		},
		
		onKeyUpCtrlA: function (e)
		{
			this.syncButtonsAfterSelectionKeys();
		},
		
		onKeyUpShiftCtrlHome: function (e)
		{
			this.syncButtonsAfterSelectionKeys();
		},
		
		onKeyUpCtrlHome: function (e)
		{
			this.syncButtonsAfterSelectionKeys();
		},
		
		onKeyUpShiftCtrlEnd: function (e)
		{
			this.syncButtonsAfterSelectionKeys();
		},
		
		onKeyUpCtrlEnd: function (e)
		{
			this.syncButtonsAfterSelectionKeys();
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
						if (e.ctrlKey)
						{
							return controller.onKeyDownCtrlEnter(e);
						}
						else if (e.shiftKey)
						{
							// данное сочетание клавиш можно установить через редактор горячих клавиш
                            return controller.onKeyDownDefault(e);
						}

						return controller.onKeyDownEnter(e);

					case Ext.event.Event.DELETE:
						return controller.onKeyDownDelete(e);

					case Ext.event.Event.BACKSPACE:
						return controller.onKeyDownBackspace(e);
					
					case Ext.event.Event.ESC:
						return controller.onKeyDownEsc(e);

					case Ext.event.Event.LEFT:
						if (e.shiftKey && e.ctrlKey)
						{
							return controller.onKeyDownShiftCtrlLeft(e);
						}
						else if (e.shiftKey)
						{
							return controller.onKeyDownShiftLeft(e);
						}

						return controller.onKeyDownLeft(e);

					case Ext.event.Event.UP:
						if (e.shiftKey && e.ctrlKey)
						{
							return controller.onKeyDownShiftCtrlUp(e);
						}
						else if (e.shiftKey)
						{
							return controller.onKeyDownShiftUp(e);
						}

						return controller.onKeyDownUp(e);

					case Ext.event.Event.RIGHT:
						if (e.shiftKey && e.ctrlKey)
						{
							return controller.onKeyDownShiftCtrlRight(e);
						}
						else if (e.shiftKey)
						{
							return controller.onKeyDownShiftRight(e);
						}

						return controller.onKeyDownRight(e);

					case Ext.event.Event.DOWN:
						if (e.shiftKey && e.ctrlKey)
						{
							return controller.onKeyDownShiftCtrlDown(e);
						}
						else if (e.shiftKey)
						{
							return controller.onKeyDownShiftDown(e);
						}

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

					case Ext.event.Event.A:
						if (e.ctrlKey)
						{
							return controller.onKeyDownCtrlA(e);
						}

						return false;

					case Ext.event.Event.HOME:
						if (e.shiftKey && e.ctrlKey)
						{
							return controller.onKeyDownShiftCtrlHome(e);
						}
						else if (e.ctrlKey)
						{
							return controller.onKeyDownCtrlHome(e);
						}

						return false;

					case Ext.event.Event.END:
						if (e.shiftKey && e.ctrlKey)
						{
							return controller.onKeyDownShiftCtrlEnd(e);
						}
						else if (e.ctrlKey)
						{
							return controller.onKeyDownCtrlEnd(e);
						}

						return false;

					case Ext.event.Event.X:
						if (e.ctrlKey)
						{
							return controller.onKeyDownCtrlX(e);
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
				el;

			el = target.getElement ? target.getElement() : null;

			if (el)
			{
                manager = el.getManager();

                // провереям нажатие горячих клавиш
                manager.checkHotkeys(e);
			}
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
			var me = this,
				sel = window.getSelection(),
				els = {},
				range;

			range = sel.getRangeAt(0);
			els.node = range.startContainer.getElement();
			els.p = els.node.getStyleHolder();
			if (els.p && !me.getElement().equal(els.p)){els.p.fireEvent('keyDownEnter', e);}
		},

		onKeyDownDelete: function (e)
		{
			var me = this;
			
			if (e)
			{
				e.preventDefault();
			}
			
			me.removeNodes();
		},

		onKeyDownBackspace: function (e)
		{
			var me = this;

			e.preventDefault();
			me.removeNodes();
		},
		
		onKeyDownEsc: function (e)
		{
			var me = this,
				el = me.getElement(),
				manager = el.getManager();
			
			e.preventDefault();
			
			// закрываем панель поиска
			manager.doEsc();
		},

		onKeyDownLeft: function (e)
		{
			var me = this,
				sel = window.getSelection(),
				els = {},
				range;

			range = sel.getRangeAt(0);
			els.node = range.startContainer.getElement();
			els.p = els.node.getStyleHolder();
			
			if (els.p && !me.getElement().equal(els.p))
			{
				els.p.fireEvent('keyDownLeft', e);
			}
		},

		onKeyDownUp: function (e)
		{
			var me = this,
				sel = window.getSelection(),
				els = {},
				range;

			range = sel.getRangeAt(0);
			els.node = range.startContainer.getElement();
			els.p = els.node.getStyleHolder();
			if (els.p && !me.getElement().equal(els.p)){els.p.fireEvent('keyDownUp', e);}
		},

		onKeyDownRight: function (e)
		{
			var me = this,
				sel = window.getSelection(),
				els = {},
				range;

			range = sel.getRangeAt(0);
			els.node = range.endContainer.getElement();
			els.p = els.node.getStyleHolder();
			if (els.p && !me.getElement().equal(els.p)){els.p.fireEvent('keyDownRight', e);}
		},

		onKeyDownDown: function (e)
		{
			var me = this,
				sel = window.getSelection(),
				els = {},
				range;

			range = sel.getRangeAt(0);
			els.node = range.endContainer.getElement();
			els.p = els.node.getStyleHolder();
			if (els.p && !me.getElement().equal(els.p)){els.p.fireEvent('keyDownDown', e);}
		},

		onKeyDownShiftCtrlLeft: function (e)
		{
			var me = this,
				sel = window.getSelection(),
				els = {},
				range;

			range = sel.getRangeAt(0);
			els.node = range.endContainer.getElement();
			els.p = els.node.getStyleHolder();

			if (els.p && !me.getElement().equal(els.p))
			{
				els.p.fireEvent('keyDownShiftCtrlLeft', e);
			}
		},

		onKeyDownShiftCtrlRight: function (e)
		{
			var me = this,
				sel = window.getSelection(),
				els = {},
				range;

			range = sel.getRangeAt(0);
			els.node = range.endContainer.getElement();
			els.p = els.node.getStyleHolder();

			if (els.p && !me.getElement().equal(els.p))
			{
				els.p.fireEvent('keyDownShiftCtrlRight', e);
			}
		},

		onKeyDownShiftCtrlUp: function (e)
		{
			//
		},

		onKeyDownShiftCtrlDown: function (e)
		{
			//
		},

		onKeyDownShiftLeft: function (e)
		{
			var me = this,
				sel = window.getSelection(),
				els = {},
				range;

			range = sel.getRangeAt(0);
			els.node = range.startContainer.getElement();
			els.p = els.node.getStyleHolder();
			
			if (els.p && !me.getElement().equal(els.p))
			{
				els.p.fireEvent('keyDownShiftLeft', e);
			}
		},

		onKeyDownShiftRight: function (e)
		{
			var me = this,
				sel = window.getSelection(),
				els = {},
				range;

			range = sel.getRangeAt(0);
			els.node = range.endContainer.getElement();
			els.p = els.node.getStyleHolder();
			
			if (els.p && !me.getElement().equal(els.p))
			{
				els.p.fireEvent('keyDownShiftRight', e);
			}
		},

		onKeyDownShiftUp: function (e)
		{
			var me = this,
				sel = window.getSelection(),
				els = {},
				range;

			range = sel.getRangeAt(0);
			els.node = range.startContainer.getElement();
			els.p = els.node.getStyleHolder();
			
			if (els.p && !me.getElement().equal(els.p))
			{
				els.p.fireEvent('keyDownShiftUp', e);
			}
		},

		onKeyDownShiftDown: function (e)
		{
			var me = this,
				sel = window.getSelection(),
				els = {},
				range;

			range = sel.getRangeAt(0);
			els.node = range.endContainer.getElement();
			els.p = els.node.getStyleHolder();
			if (els.p && !me.getElement().equal(els.p)){els.p.fireEvent('keyDownShiftDown', e);}
		},

		onKeyDownCtrlA: function (e)
		{
			var me = this,
				sel = window.getSelection(),
				els = {},
				manager = me.getElement().getManager(),
				range;

			range = sel.getRangeAt(0);
			els.node = range.startContainer.getElement();
			els.p = els.node.getStyleHolder();
			
			if (els.p && !me.getElement().equal(els.p))
			{
				els.p.fireEvent('keyDownCtrlA', e);
			}
		},

		onKeyDownShiftCtrlHome: function (e)
		{
			var me = this,
				sel = window.getSelection(),
				els = {},
				range;

			range = sel.getRangeAt(0);
			els.node = range.startContainer.getElement();
			els.p = els.node.getStyleHolder();
			if (els.p && !me.getElement().equal(els.p)){els.p.fireEvent('keyDownShiftCtrlHome', e);}
		},

		onKeyDownShiftCtrlEnd: function (e)
		{
			var me = this,
				sel = window.getSelection(),
				els = {},
				range;

			range = sel.getRangeAt(0);
			els.node = range.endContainer.getElement();
			els.p = els.node.getStyleHolder();
			if (els.p && !me.getElement().equal(els.p)){els.p.fireEvent('keyDownShiftCtrlEnd', e);}
		},

		onKeyDownCtrlHome: function (e)
		{
			var me = this,
				sel = window.getSelection(),
				els = {},
				range;

			range = sel.getRangeAt(0);
			els.node = range.startContainer.getElement();
			els.p = els.node.getStyleHolder();
			if (els.p && !me.getElement().equal(els.p)){els.p.fireEvent('keyDownCtrlHome', e);}
		},

		onKeyDownCtrlEnd: function (e)
		{
			var me = this,
				sel = window.getSelection(),
				els = {},
				range;

			range = sel.getRangeAt(0);
			els.node = range.startContainer.getElement();
			els.p = els.node.getStyleHolder();
			if (els.p && !me.getElement().equal(els.p)){els.p.fireEvent('keyDownCtrlEnd', e);}
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

		onKeyDownCtrlX: function (e)
		{
			//
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
				el.fireEvent('focus', e);
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

		onFocus: function (e)
		{
			var me = this,
				manager,
				node,
				el;

			node = me.getFocusNode(e.target);
			el = node.getElement ? node.getElement() : null;
			manager = el ? el.getManager() : null;
			
            // фокус на элемент
			manager.setFocusElement(node);
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
				helper,
				newEl,
				nextSibling,
				previousSibling,
				parentEl,
				nextSiblingEl,
				previousSiblingEl;

			manager = relNode.getElement ? relNode.getElement().getManager() : null;

			// игнориуруется вставка корневого узла, так как он уже вставлен и
			// игнорируется вставка при включенной заморозке
			if (relNode.firstChild.nodeName !== 'MAIN' && manager && !manager.isSuspendEvent())
			{
				e.stopPropagation();
				parentEl = relNode.getElement();

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

				//console.log('new, parent', node, relNode.outerHTML, parentEl.children.length);

				if (nextSibling)
				{
					nextSiblingEl = nextSibling.getElement();

					console.log('new insert, nextSibling', nextSibling, nextSiblingEl);

					if (nextSiblingEl.isBr)
					{
						// удаляем br
						parentEl.remove(nextSiblingEl, viewportId);
					}

					parentEl.insertBefore(newEl, nextSiblingEl);
				}
				else if (previousSibling)
				{
					console.log('new add, previousSibling', previousSibling);

					previousSiblingEl = previousSibling.getElement();

					if (previousSiblingEl.isBr)
					{
						// удаляем br
						parentEl.remove(previousSiblingEl, viewportId);
					}

					parentEl.add(newEl);
				}
				else
				{
					console.log('new add', node, parentEl, newEl);

					if (parentEl.isEmpty())
					{
						// удаляем br
						parentEl.removeAll(viewportId);
					}
					
					parentEl.add(newEl);
				}

				parentEl.sync(viewportId);
				helper = newEl.getNodeHelper();
				manager.setFocusElement(helper.getNode(viewportId));
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
			if (target.getElement && relNode.firstChild && relNode.firstChild.nodeName !== 'MAIN')
			{
				parentEl = relNode.getElement();
				el = target.getElement();
				manager = el.getManager();

				if (manager && !manager.isSuspendEvent())
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

		onScroll: function (e)
		{
			//
		},
		
		onContextMenu: function (e)
		{
			e.preventDefault();
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
			manager = els.node.getManager();

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
		},

		/**
		 * @protected
		 * Возвращает редактируемость всех абзацев.
		 */
		enableAllEditable: function ()
		{
			var me = this,
				nodes = {};

			nodes.pp = document.querySelectorAll('.el-styleholder[contenteditable=false]');

			Ext.Array.each(
				nodes.pp,
				function (p)
				{
					p.setAttribute('contenteditable', true);
				}
			);
		},

		/**
		 * @protected
		 * Преобразует простой текст в html строку.
		 * @param {String} text Простой текст, который может содержать переносы.
		 * @return {String} Строка html.
		 */
		convertTextToHtml: function (text)
		{
			var html;

			html = text.replace(/^(.*?)$/gim, '<p>$1</p>');

			return html;
		},
		
		/**
		 * @protected
		 * Синхронизирует панель форматирования после выделения в тексте через клавиши.
		 */
		syncButtonsAfterSelectionKeys: function ()
		{
			var me = this,
				el = me.getElement(),
				manager = el.getManager();
			
			// обновляем реальные данные выделения в тексте перед синхронизацией
			manager.getRangeCursor();
			
			// синхронизируем панель форматирования
			manager.syncButtons();
		}
	}
);