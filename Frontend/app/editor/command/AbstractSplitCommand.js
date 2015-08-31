/**
 * Абстрактный класс команды разделения элемента на несколько элементов.
 *
 * @abstract
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.AbstractSplitCommand',
	{
		extend: 'FBEditor.editor.command.AbstractCommand',

		/**
		 * @property {String} Имя элемента.
		 */
		elementName: null,

		execute: function ()
		{
			var me = this,
				data = me.getData(),
				res = false,
				els = {},
				nodes = {},
				offset = {},
				sel = window.getSelection(),
				range,
				joinStartContainer,
				reg = {},
				pos = {},
				manager;

			manager = FBEditor.editor.Manager;

			try
			{
				manager.suspendEvent = true;

				if (data.saveRange)
				{
					// восстанваливаем выделение
					manager.setCursor(data.saveRange);
				}

				// получаем данные выделения
				range = sel.getRangeAt(0);

				if (!data.node)
				{
					// узел, в котором установлен курсор

					nodes.cur = range.startContainer;
					els.cur = nodes.cur.getElement();
					while (els.cur && !els.cur.hisName(me.elementName))
					{
						nodes.cur = nodes.cur.parentNode;
						els.cur = nodes.cur ? nodes.cur.getElement() : null;
					}

					data.node = nodes.cur;
				}

				//console.log('data.node', data.node);

				nodes.prevNode = data.node;
				data.viewportId = nodes.prevNode.viewportId;
				els.prevNode = nodes.prevNode.getElement();

				offset = {
					start: range.startOffset,
					end: range.endOffset
				};

				// необходимо ли после операции undo соединять первый узел выделения
				joinStartContainer = range.startOffset === 0 ?
				                     !manager.isFirstNode(data.node, range.startContainer) : true;

				data.range = {
					common: range.commonAncestorContainer,
					start: range.startContainer,
					end: range.endContainer,
					prevParentStart: range.startContainer.parentNode.previousSibling,
					collapsed: range.collapsed,
					offset: offset,
					joinStartContainer: joinStartContainer
				};

				//console.log('range', data.range);

				nodes.startContainer = range.startContainer;
				nodes.endContainer = range.endContainer;
				els.startContainer = nodes.startContainer.getElement();
				els.endContainer = nodes.endContainer.getElement();

				if (!range.collapsed)
				{
					// регулярные выражения для определения позиции выделения
					reg.start = new RegExp('^' + Ext.String.escapeRegex(range.toString()));
					reg.start2 = new RegExp('^' + Ext.String.escapeRegex(els.startContainer.getText()));
					reg.end = new RegExp(Ext.String.escapeRegex(range.toString()) + '$');
					reg.end2 = new RegExp(Ext.String.escapeRegex(els.endContainer.getText()) + '$');

					// находится ли начальная точка выделения в начале первого элемента
					pos.isStart = reg.start.test(els.startContainer.getText()) || reg.start2.test(range.toString());

					// находится ли конечная точка выделения в конце последнего элемента
					pos.isEnd = reg.end.test(els.endContainer.getText()) || reg.end2.test(range.toString());
				}
				else
				{
					pos.isEnd = offset.end === data.range.end.nodeValue.length ?
					            manager.isLastNode(data.node, data.range.end) : false;
					pos.isStart = offset.start === 0 ?
					              manager.isFirstNode(data.node, data.range.start) : false;
				}

				data.range.pos = pos;
				//console.log('pos', pos, range.toString());

				// разбиваем конечный узел текущего выделения
				nodes.container = nodes.endContainer;
				nodes.common = data.node;
				els.common = data.node.getElement();
				nodes.endContainer = manager.splitNode(els, nodes, offset.end);

				// начальный узел текущего выделения
				if (data.range.collapsed)
				{
					nodes.startContainer = nodes.endContainer;
				}
				else
				{
					// разбиваем начальный узел текущего выделения
					nodes.container = nodes.startContainer;
					nodes.startContainer = manager.splitNode(els, nodes, offset.start);
				}

				els.startContainer = nodes.startContainer.getElement();
				els.endContainer = nodes.endContainer.getElement();

				// создаём элемент
				els.node = FBEditor.editor.Factory.createElement(me.elementName);

				// вставляем новый элемент
				nodes.parent = nodes.prevNode.parentNode;
				els.parent = nodes.parent.getElement();
				nodes.next = nodes.prevNode.nextSibling;
				nodes.nextPrevNode = nodes.next;
				nodes.node = els.node.getNode(data.viewportId);
				if (nodes.next)
				{
					els.next = nodes.next.getElement();
					els.parent.insertBefore(els.node, els.next);
					nodes.parent.insertBefore(nodes.node, nodes.next);
				}
				else
				{
					els.parent.add(els.node);
					nodes.parent.appendChild(nodes.node);
				}

				// заполняем новый элемент
				me.createElement(nodes, els);

				// переносим элементы, которые находятся после текущего выделения, из старого в новый
				me.moveToCreateElement(nodes, els);

				// синхронизируем
				els.parent.sync(data.viewportId);

				//console.log('nodes', nodes);

				manager.suspendEvent = false;

				// устанавливаем курсор
				nodes.cursor = nodes.cursor ? nodes.cursor : nodes.node;
				manager.setCursor(
					{
						startNode: nodes.cursor.firstChild
					}
				);

				// сохраянем узлы
				data.saveNodes = nodes;

				// проверяем по схеме
				me.verifyElement(els.parent);

				res = true;
			}
			catch (e)
			{
				Ext.log({level: 'warn', msg: e, dump: e});
				FBEditor.editor.HistoryManager.removeNext();
			}

			return res;
		},

		unExecute: function ()
		{
			var me = this,
				data = me.getData(),
				res = false,
				els = {},
				nodes = {},
				manager = FBEditor.editor.Manager,
				range,
				viewportId;

			try
			{
				manager.suspendEvent = true;

				range = data.range;
				nodes = data.saveNodes;
				viewportId = nodes.node.viewportId;
				console.log('undo split ' + me.elementName, range, nodes);

				els.node = nodes.node.getElement();
				els.prevNode = nodes.prevNode.getElement();
				nodes.parent = nodes.node.parentNode;
				els.parent = nodes.parent.getElement();

				// переносим все элементы обратно

				// если старый элемент пустой, то удаляем из него пустой элемент
				if (els.prevNode.isEmpty())
				{
					els.prevNode.removeAll();
					nodes.prevNode.removeChild(nodes.prevNode.firstChild);
				}

				// если новый элемент пустой, то удаляем из него пустой элемент
				if (els.node.isEmpty())
				{
					els.node.removeAll();
					nodes.node.removeChild(nodes.node.firstChild);
					range.joinStartContainer = false;
				}

				me.restoreElement(nodes, els, range);

				nodes.first = nodes.node.firstChild;
				if (nodes.first)
				{
					me.moveNodes(nodes, els);
				}

				// удаляем новый элемент
				nodes.parent.removeChild(nodes.node);
				els.parent.remove(els.node);

				// объединяем элементы в точках разделения
				if (range.joinStartContainer)
				{
					manager.joinNode(nodes.startContainer);
				}
				if (!range.collapsed)
				{
					manager.joinNode(nodes.endContainer);
				}

				// синхронизируем
				els.parent.sync(viewportId);

				manager.suspendEvent = false;

				// устанавливаем выделение

				if (!range.joinStartContainer)
				{
					range.start = nodes.startContainer;
					range.common = range.start.getElement().isText ? range.start.parentNode : range.start;
				}
				else
				{
					range.common = range.common.getElement().isText ? range.common.parentNode : range.common;
				}
				range.common = range.common ? range.common : range.prevParentStart.parentNode;
				range.start = range.start.parentNode ? range.start : range.prevParentStart.nextSibling;
				range.end = range.collapsed || !range.end.parentNode ? range.start : range.end;
				range.end = !range.collapsed && range.end.firstChild ? range.end.firstChild : range.end;

				data.saveRange = {
					startNode: range.start,
					endNode: range.end,
					startOffset: range.offset.start,
					endOffset: range.offset.end
				};
				manager.setCursor(data.saveRange);

				res = true;
			}
			catch (e)
			{
				Ext.log({level: 'warn', msg: e, dump: e});
				FBEditor.editor.HistoryManager.remove();
			}

			return res;
		},

		/**
		 * Перемещает дочерние узлы в другой узел.
		 * @param {Object} nodes Узлы.
		 * @param {Object} els Элементы.
		 */
		moveNodes: function (nodes, els)
		{
			while (nodes.first)
			{
				els.first = nodes.first.getElement();
				nodes.prevNode.appendChild(nodes.first);
				els.prevNode.add(els.first);
				els.node.remove(els.first);
				nodes.first = nodes.node.firstChild;
			}
		},

		/**
		 * Восстанавливает элемент до применения команды.
		 * @param {Object} nodes Узлы.
		 * @param {Object} els Элементы.
		 * @param {Object} range Выделение.
		 */
		restoreElement: function (nodes, els, range)
		{
			var me = this;

			if (!range.collapsed)
			{
				nodes.next = nodes.prevNode.nextSibling;

				nodes.first = nodes.next.firstChild;
				me.moveNodes(nodes, els);

				// удаляем новый блок
				nodes.parent.removeChild(nodes.next);
				els.parent.remove(nodes.next.getElement());
			}
		},

		/**
		 * Создаёт содержимое элемента.
		 * @param {Object} nodes Узлы.
		 * @param {Object} els Элементы.
		 */
		createElement: function (nodes, els)
		{
			var me = this,
				data = me.getData(),
				factory = FBEditor.editor.Factory;

			// переносим элементы, которые находятся в текущем выделении, из старого элемента в новый
			if (!data.range.collapsed)
			{
				nodes.next = nodes.startContainer;
				els.next = nodes.next ? nodes.next.getElement() : null;
				nodes.parentNext = nodes.next.parentNode;
				els.parentNext = nodes.parentNext.getElement();
				while (els.next && els.next.elementId !== els.endContainer.elementId)
				{
					nodes.buf = nodes.next.nextSibling;

					els.node.add(els.next);
					nodes.node.appendChild(nodes.next);
					els.parentNext.remove(els.next);

					nodes.next = nodes.buf;
					els.next = nodes.next ? nodes.next.getElement() : null;
				}

				// создаем новый блок
				els.node = factory.createElement(me.elementName);
				nodes.node = els.node.getNode(data.viewportId);
				if (nodes.nextPrevNode)
				{
					els.nextPrevNode = nodes.nextPrevNode.getElement();
					els.parent.insertBefore(els.node, els.nextPrevNode);
					nodes.parent.insertBefore(nodes.node, nodes.nextPrevNode);
				}
				else
				{
					els.parent.add(els.node);
					nodes.parent.appendChild(nodes.node);
				}
			}
		},

		/**
		 * Переносит элементы после текущего выделения в новый элемент.
		 * @param {Object} nodes Узлы.
		 * @param {Object} els Элементы.
		 */
		moveToCreateElement: function (nodes, els)
		{
			var me = this,
				data = me.getData(),
				manager = FBEditor.editor.Manager;

			els.node = nodes.node.getElement();
			nodes.next = nodes.endContainer;
			nodes.parentNext = nodes.next.parentNode;
			els.parentNext = nodes.parentNext.getElement();

			while (nodes.next)
			{
				nodes.buf = nodes.next.nextSibling;
				els.next = nodes.next.getElement();

				els.node.add(els.next);
				nodes.node.appendChild(nodes.next);
				els.parentNext.remove(els.next);

				nodes.next = nodes.buf;
			}

			if (!nodes.parentNext.firstChild)
			{
				// добавляем пустой параграф в старый элемент
				els.p = FBEditor.editor.Factory.createElement('p');
				els.empty = manager.createEmptyElement();
				els.p.add(els.empty);
				els.parentNext.add(els.p);
				nodes.parentNext.appendChild(els.p.getNode(data.viewportId));
			}
		}
	}
);